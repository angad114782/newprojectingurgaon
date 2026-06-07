/**
 * Instant Indexing Service
 * Submits URLs to Google Indexing API and IndexNow (Bing/Yandex/DuckDuckGo)
 * Uses Node built-in crypto — no extra npm packages needed.
 */
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const IndexingLog = require('../models/IndexingLog');
const SiteSettings = require('../models/SiteSettings');

// Path to Next.js public dir (for IndexNow key file)
const FRONTEND_PUBLIC = path.join(__dirname, '../../frontend/public');

// ─── Google Indexing API ──────────────────────────────────────────────────────

function b64url(obj) {
  const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
  return Buffer.from(str).toString('base64url');
}

async function getGoogleToken(serviceAccountJson) {
  let sa;
  try {
    sa = typeof serviceAccountJson === 'string' ? JSON.parse(serviceAccountJson) : serviceAccountJson;
  } catch {
    throw new Error('Invalid service account JSON');
  }
  if (!sa.private_key || !sa.client_email) throw new Error('Service account missing private_key or client_email');

  const now = Math.floor(Date.now() / 1000);
  const header = b64url({ alg: 'RS256', typ: 'JWT' });
  const payload = b64url({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  });

  const toSign = `${header}.${payload}`;
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(toSign)
    .sign(sa.private_key)
    .toString('base64url');

  const jwt = `${toSign}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth2:grant_type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await res.json();
  if (!data.access_token) throw new Error(`Google token error: ${data.error_description || JSON.stringify(data)}`);
  return data.access_token;
}

async function submitToGoogle(url, action, serviceAccountJson) {
  const token = await getGoogleToken(serviceAccountJson);

  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, type: action }),
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

// ─── IndexNow (Bing, Yandex, DuckDuckGo) ─────────────────────────────────────

async function writeIndexNowKeyFile(key) {
  try {
    await fs.mkdir(FRONTEND_PUBLIC, { recursive: true });
    await fs.writeFile(path.join(FRONTEND_PUBLIC, `${key}.txt`), key, 'utf8');
    return true;
  } catch (e) {
    console.warn('IndexNow key file write failed:', e.message);
    return false;
  }
}

async function submitToIndexNow(urls, key, siteUrl) {
  if (!key) throw new Error('IndexNow key not configured');
  const urlArray = Array.isArray(urls) ? urls : [urls];
  const host = new URL(siteUrl).host;

  const body = {
    host,
    key,
    keyLocation: `${siteUrl}/${key}.txt`,
    urlList: urlArray,
  };

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  // IndexNow returns 200 or 202 on success; 202 = accepted (async processing)
  return { ok: res.status === 200 || res.status === 202, status: res.status, data: await res.text() };
}

// ─── Main: submitUrls ─────────────────────────────────────────────────────────

async function submitUrls(urls, { triggeredBy = 'manual', action = 'URL_UPDATED' } = {}) {
  if (!urls || urls.length === 0) return { google: [], indexnow: [] };

  const urlArray = Array.isArray(urls) ? urls : [urls];

  let settings;
  try {
    settings = await SiteSettings.findOne({}).lean();
  } catch { settings = null; }

  const serviceAccountJson = settings?.googleSearchConsole?.serviceAccountJson || '';
  const indexNowKey = settings?.indexNowKey || '';
  // Must be a real https:// URL — sc-domain: format is NOT valid here
  let siteUrl = settings?.googleSearchConsole?.siteUrl || '';
  if (siteUrl && !siteUrl.startsWith('http')) siteUrl = '';

  const googleResults = [];
  const indexnowResults = [];

  // ── Google Indexing API ──
  if (serviceAccountJson) {
    for (const url of urlArray) {
      const log = new IndexingLog({ url, engine: 'google', action, triggeredBy });
      try {
        const { ok, status, data } = await submitToGoogle(url, action, serviceAccountJson);
        log.status = ok ? 'success' : 'error';
        log.statusCode = status;
        log.message = ok ? 'Submitted' : (data?.error?.message || JSON.stringify(data));
        googleResults.push({ url, ok, status });
      } catch (e) {
        log.status = 'error';
        log.message = e.message;
        googleResults.push({ url, ok: false, error: e.message });
      }
      await log.save().catch(() => {});
    }
  }

  // ── IndexNow (batch) ──
  if (indexNowKey && siteUrl) {
    // Write key file (silent fail)
    await writeIndexNowKeyFile(indexNowKey);

    const log = new IndexingLog({
      url: urlArray[0],
      engine: 'indexnow',
      action,
      triggeredBy,
    });
    try {
      const { ok, status } = await submitToIndexNow(urlArray, indexNowKey, siteUrl);
      log.status = ok ? 'success' : 'error';
      log.statusCode = status;
      log.message = ok ? `${urlArray.length} URL(s) submitted` : `HTTP ${status}`;
      indexnowResults.push({ urls: urlArray, ok, status });
    } catch (e) {
      log.status = 'error';
      log.message = e.message;
      indexnowResults.push({ ok: false, error: e.message });
    }
    await log.save().catch(() => {});
  }

  return { google: googleResults, indexnow: indexnowResults };
}

// Non-blocking fire-and-forget for route hooks
function autoSubmit(urls) {
  submitUrls(urls, { triggeredBy: 'auto' }).catch((e) =>
    console.warn('[indexing] auto-submit failed:', e.message)
  );
}

module.exports = { submitUrls, autoSubmit, writeIndexNowKeyFile };
