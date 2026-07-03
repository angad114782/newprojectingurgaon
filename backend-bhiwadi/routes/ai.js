const express = require('express');
const router = express.Router();
const { protect: verifyToken } = require('../middleware/auth');
const Project = require('../models/Project');
const Lead = require('../models/Lead');
const Blog = require('../models/Blog');
const Settings = require('../models/SiteSettings');

// ── POST /api/ai/seo-advisor ────────────────────────────────────────────────
// Calls Claude API with current site context → returns SEO/AIO/GEO suggestions
router.post('/seo-advisor', verifyToken, async (req, res) => {
  try {
    // Gather site metrics (settings also contains the API key)
    const [projectCount, leadCount, blogCount, settings] = await Promise.all([
      Project.countDocuments({ isActive: true }),
      Lead.countDocuments({}),
      Blog.countDocuments({ status: 'published' }),
      Settings.findOne({}).lean(),
    ]);

    // API key: DB takes priority, falls back to .env
    const apiKey = settings?.anthropicApiKey || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'Anthropic API key not configured. Admin → Settings → Integrations mein set karo.',
      });
    }

    const corridorBreakdown = await Project.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$corridor', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentLeads = await Lead.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    const topSources = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const siteContext = {
      siteName: settings?.siteName || 'New Projects in Bhiwadi',
      domain: settings?.siteUrl ? settings.siteUrl.replace(/https?:\/\//, '') : 'propertyinbhiwadi.com',
      totalProjects: projectCount,
      publishedBlogs: blogCount,
      totalLeads: leadCount,
      corridors: corridorBreakdown,
      topLeadSources: topSources,
      hasSEOTitle: !!settings?.seoTitle,
      hasOgImage: !!settings?.ogImage,
      hasGA4: !!settings?.ga4Id,
      hasGSC: !!settings?.googleSearchConsole?.verificationCode,
      hasFacebook: !!settings?.social?.facebook,
      hasInstagram: !!settings?.social?.instagram,
      phone: settings?.phone ? 'set' : 'missing',
      reraNumber: settings?.reraNumber ? 'set' : 'missing',
    };

    const userContext = req.body.context || '';
    const focus = req.body.focus || 'all'; // 'seo' | 'aio' | 'geo' | 'content' | 'all'

    const prompt = `You are a senior SEO + AIO (AI Overview) + GEO (Generative Engine Optimization) expert specializing in Indian real estate websites. You are analyzing a Bhiwadi (Rajasthan) real estate advisory website and must provide precise, actionable, prioritized recommendations.

WEBSITE DATA:
${JSON.stringify(siteContext, null, 2)}

FOCUS AREA: ${focus}
ADDITIONAL CONTEXT FROM ADMIN: ${userContext || 'None'}

TODAY'S DATE: ${new Date().toISOString().split('T')[0]}

TASK: Analyze this website and provide a structured SEO/AIO/GEO audit with specific, implementable recommendations.

Return ONLY valid JSON in this exact format:
{
  "overall_score": <number 0-100>,
  "seo_score": <number 0-100>,
  "aio_score": <number 0-100>,
  "geo_score": <number 0-100>,
  "content_score": <number 0-100>,
  "score_explanation": "<2 sentence summary of scores>",
  "critical_issues": [
    {
      "issue": "<specific issue>",
      "impact": "High|Medium|Low",
      "fix": "<exact step to fix>",
      "estimated_traffic_gain": "<e.g. +200 visits/month>"
    }
  ],
  "quick_wins": [
    {
      "action": "<specific action>",
      "effort": "15min|1hr|Half-day",
      "impact": "High|Medium|Low",
      "why": "<reason this helps SEO/AIO/GEO>"
    }
  ],
  "aio_recommendations": [
    {
      "recommendation": "<specific AIO optimization>",
      "implementation": "<how to implement>",
      "ai_engine_benefit": "<which AI engine this helps: Google SGE/ChatGPT/Perplexity>"
    }
  ],
  "geo_recommendations": [
    {
      "recommendation": "<location/geographic optimization>",
      "implementation": "<how to implement>",
      "local_seo_benefit": "<benefit for local search>"
    }
  ],
  "content_gaps": [
    {
      "missing_content": "<what content is missing>",
      "target_keyword": "<keyword to target>",
      "monthly_searches_estimate": "<low/medium/high>",
      "suggested_url": "<suggested URL slug>"
    }
  ],
  "google_update_warnings": [
    {
      "update": "<Google update name>",
      "risk": "<risk this site faces>",
      "mitigation": "<how to mitigate>"
    }
  ],
  "30_day_action_plan": [
    {
      "week": "Week 1|Week 2|Week 3|Week 4",
      "tasks": ["<task 1>", "<task 2>"]
    }
  ]
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      let errBody;
      try { errBody = await response.json(); } catch { errBody = { error: { message: await response.text() } }; }

      // Surface human-readable messages for common billing/auth errors
      const msg = errBody?.error?.message || 'Unknown API error';
      if (response.status === 401 || msg.includes('authentication')) {
        return res.status(400).json({ success: false, error: 'Invalid Anthropic API key. Settings → Integrations mein check karo.' });
      }
      if (response.status === 402 || msg.includes('credit balance') || msg.includes('billing')) {
        return res.status(402).json({ success: false, error: 'Anthropic account ka credit balance khatam ho gaya. console.anthropic.com → Plans & Billing mein credits add karo.' });
      }
      if (response.status === 429) {
        return res.status(429).json({ success: false, error: 'Anthropic rate limit. Kuch minutes baad try karo.' });
      }
      return res.status(500).json({ success: false, error: `Claude API error (${response.status}): ${msg}` });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ success: false, error: 'Could not parse AI response', raw: text });
    }

    const suggestions = JSON.parse(jsonMatch[0]);
    res.json({ success: true, data: suggestions, generatedAt: new Date().toISOString() });
  } catch (err) {
    console.error('AI advisor error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/ai/seo-score ──────────────────────────────────────────────────
// Rule-based SEO score calculation (no API key needed)
router.get('/seo-score', verifyToken, async (req, res) => {
  try {
    const [projectCount, blogCount, settings] = await Promise.all([
      Project.countDocuments({ isActive: true }),
      Blog.countDocuments({ status: 'published' }),
      Settings.findOne({}).lean(),
    ]);

    const checks = {
      // Technical SEO
      hasSeoTitle: { pass: !!settings?.seoTitle, weight: 5, label: 'SEO Title set' },
      hasSeoDesc: { pass: !!settings?.seoDescription, weight: 5, label: 'Meta Description set' },
      hasOgImage: { pass: !!settings?.ogImage, weight: 4, label: 'OG Image set' },
      hasLogo: { pass: !!settings?.logoUrl, weight: 3, label: 'Logo uploaded' },
      hasFavicon: { pass: !!settings?.faviconUrl, weight: 2, label: 'Favicon set' },
      hasPhone: { pass: !!settings?.phone, weight: 3, label: 'Phone number set' },
      hasAddress: { pass: !!settings?.address, weight: 3, label: 'Business address set' },
      hasRera: { pass: !!settings?.reraNumber, weight: 4, label: 'RERA number set' },
      // Analytics & Tracking
      hasGA4: { pass: !!settings?.ga4Id, weight: 6, label: 'GA4 connected' },
      hasGSC: { pass: !!settings?.googleSearchConsole?.verificationCode, weight: 5, label: 'Google Search Console verified' },
      hasGTM: { pass: !!settings?.gtmId, weight: 3, label: 'GTM connected' },
      // Social signals
      hasFacebook: { pass: !!settings?.social?.facebook, weight: 2, label: 'Facebook linked' },
      hasInstagram: { pass: !!settings?.social?.instagram, weight: 2, label: 'Instagram linked' },
      hasGBP: { pass: !!settings?.googleBusinessProfile, weight: 5, label: 'Google Business Profile linked' },
      // Content
      hasEnoughProjects: { pass: projectCount >= 10, weight: 8, label: '10+ active projects' },
      hasBlogs: { pass: blogCount >= 5, weight: 6, label: '5+ blog posts published' },
      // AIO signals
      hasSeoKeywords: { pass: (settings?.seoKeywords?.length || 0) >= 5, weight: 4, label: 'SEO keywords configured' },
      hasMarketStats: { pass: !!settings?.marketStats?.rating, weight: 3, label: 'Market stats & ratings set' },
      // GEO signals
      hasGeoCoords: { pass: !!(settings?.geoLat && settings?.geoLng), weight: 4, label: 'Geo coordinates set' },
      hasLocalAddress: { pass: !!(settings?.streetAddress && settings?.postalCode), weight: 3, label: 'Full address with postal code' },
    };

    let totalWeight = 0;
    let earnedWeight = 0;
    const passed = [];
    const failed = [];

    for (const [key, check] of Object.entries(checks)) {
      totalWeight += check.weight;
      if (check.pass) {
        earnedWeight += check.weight;
        passed.push(check.label);
      } else {
        failed.push({ label: check.label, weight: check.weight });
      }
    }

    const score = Math.round((earnedWeight / totalWeight) * 100);

    // Category scores
    const techChecks = ['hasSeoTitle','hasSeoDesc','hasOgImage','hasLogo','hasFavicon'];
    const analyticsChecks = ['hasGA4','hasGSC','hasGTM'];
    const localChecks = ['hasPhone','hasAddress','hasRera','hasGBP','hasGeoCoords','hasLocalAddress'];
    const contentChecks = ['hasEnoughProjects','hasBlogs','hasSeoKeywords'];
    const socialChecks = ['hasFacebook','hasInstagram'];

    const catScore = (keys) => {
      const w = keys.reduce((a, k) => a + checks[k].weight, 0);
      const e = keys.reduce((a, k) => a + (checks[k].pass ? checks[k].weight : 0), 0);
      return w > 0 ? Math.round((e / w) * 100) : 0;
    };

    res.json({
      success: true,
      data: {
        overall: score,
        technical: catScore(techChecks),
        analytics: catScore(analyticsChecks),
        local: catScore(localChecks),
        content: catScore(contentChecks),
        social: catScore(socialChecks),
        passed,
        failed: failed.sort((a, b) => b.weight - a.weight),
        projectCount,
        blogCount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
