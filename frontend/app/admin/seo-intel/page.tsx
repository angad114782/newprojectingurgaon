'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAdmin, API } from '../_context';
import { Card, PageHeader, Btn, Badge, ScoreRing, Toast } from '../_components/shared';

function ImpactBadge({ impact }: { impact: string }) {
  const color = impact === 'High' ? 'red' : impact === 'Medium' ? 'orange' : 'slate';
  return <Badge color={color}>{impact}</Badge>;
}

export default function SeoIntelPage() {
  const { authH, token } = useAdmin();
  const [seoScore, setSeoScore] = useState<any>(null);
  const [aiAdvice, setAiAdvice] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [aiContext, setAiContext] = useState('');
  const [aiFocus, setAiFocus] = useState('all');
  const [activeTab, setActiveTab] = useState<'issues' | 'quickwins' | 'aio' | 'geo' | 'content' | 'plan'>('issues');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const loadScore = useCallback(async () => {
    if (!token) return;
    setScoreLoading(true);
    const r = await fetch(`${API}/ai/seo-score`, { headers: authH() });
    const d = await r.json();
    if (d.success) setSeoScore(d.data);
    setScoreLoading(false);
  }, [token, authH]);

  useEffect(() => { loadScore(); }, [loadScore]);

  const runAI = async () => {
    setAiLoading(true);
    try {
      const r = await fetch(`${API}/ai/seo-advisor`, {
        method: 'POST', headers: authH(),
        body: JSON.stringify({ focus: aiFocus, context: aiContext }),
      });
      const d = await r.json();
      if (d.success) {
        setAiAdvice(d.data);
        setActiveTab('issues');
        setToast({ msg: 'AI analysis complete!', type: 'success' });
      } else {
        setToast({ msg: d.error || 'AI advisor failed', type: 'error' });
      }
    } catch { setToast({ msg: 'Network error', type: 'error' }); }
    finally { setAiLoading(false); }
  };

  const scoreColor = (s: number) => s >= 80 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';

  const TABS = [
    { key: 'issues', label: 'Critical Issues' },
    { key: 'quickwins', label: 'Quick Wins' },
    { key: 'aio', label: 'AIO Tips' },
    { key: 'geo', label: 'GEO Tips' },
    { key: 'content', label: 'Content Gaps' },
    { key: 'plan', label: '30-Day Plan' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-6xl">
      <PageHeader title="SEO Intelligence" subtitle="AI-powered SEO, AIO & GEO advisor powered by Claude" />

      {/* Score rings */}
      <Card className="mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">SEO Health Score</h2>
          <Btn size="sm" variant="secondary" onClick={loadScore} disabled={scoreLoading}>
            {scoreLoading ? '⏳ Checking…' : '↻ Refresh Score'}
          </Btn>
        </div>
        <div className="p-4 sm:p-6">
          {scoreLoading ? (
            <div className="flex gap-8 justify-center animate-pulse">
              {[...Array(5)].map((_, i) => <div key={i} className="w-20 h-24 bg-slate-100 rounded-xl" />)}
            </div>
          ) : seoScore ? (
            <>
              <div className="flex flex-wrap gap-6 justify-center mb-6">
                <ScoreRing score={seoScore.overall} label="Overall" color={scoreColor(seoScore.overall)} size={90} />
                <ScoreRing score={seoScore.technical} label="Technical" color={scoreColor(seoScore.technical)} />
                <ScoreRing score={seoScore.analytics} label="Analytics" color={scoreColor(seoScore.analytics)} />
                <ScoreRing score={seoScore.local} label="Local SEO" color={scoreColor(seoScore.local)} />
                <ScoreRing score={seoScore.content} label="Content" color={scoreColor(seoScore.content)} />
                <ScoreRing score={seoScore.social} label="Social" color={scoreColor(seoScore.social)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seoScore.passed?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">✅ Passing ({seoScore.passed.length})</h3>
                    <div className="space-y-1">
                      {seoScore.passed.map((item: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="text-emerald-500 shrink-0">✓</span> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {seoScore.failed?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">❌ Fix These ({seoScore.failed.length})</h3>
                    <div className="space-y-1">
                      {seoScore.failed.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="text-red-400 shrink-0">✗</span>
                          {item.label}
                          <span className="text-xs text-slate-400 ml-auto shrink-0">+{item.weight}pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-slate-400 text-sm text-center py-4">Failed to load score</p>
          )}
        </div>
      </Card>

      {/* AI Advisor */}
      <Card className="mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">🤖 AI SEO Advisor</h2>
          <p className="text-xs text-slate-400 mt-0.5">Powered by Claude AI — analyzes your site and gives actionable recommendations</p>
        </div>
        <div className="p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <select value={aiFocus} onChange={(e) => setAiFocus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500">
              <option value="all">All Areas</option>
              <option value="seo">Technical SEO Only</option>
              <option value="aio">AIO (AI Overview) Only</option>
              <option value="geo">GEO (Local) Only</option>
              <option value="content">Content Strategy Only</option>
            </select>
            <input value={aiContext} onChange={(e) => setAiContext(e.target.value)}
              placeholder="Optional context: e.g. 'We launched 3 new projects on Dwarka Expressway this month'"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
            <Btn onClick={runAI} disabled={aiLoading} className="shrink-0">
              {aiLoading ? '🤖 Analyzing…' : '🚀 Run AI Analysis'}
            </Btn>
          </div>

          {aiLoading && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-700">
              <span className="animate-spin text-lg">🤖</span>
              Claude is analyzing your website… This takes ~15 seconds
            </div>
          )}

          {!aiAdvice && !aiLoading && (
            <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6 text-center text-slate-400 text-sm">
              Click "Run AI Analysis" to get personalized SEO recommendations for your site
            </div>
          )}

          {aiAdvice && (
            <>
              {/* Summary */}
              <div className="flex flex-wrap gap-4 mb-5 p-4 bg-slate-50 rounded-xl">
                {[
                  { label: 'Overall', score: aiAdvice.overall_score },
                  { label: 'SEO', score: aiAdvice.seo_score },
                  { label: 'AIO', score: aiAdvice.aio_score },
                  { label: 'GEO', score: aiAdvice.geo_score },
                  { label: 'Content', score: aiAdvice.content_score },
                ].map(s => (
                  <ScoreRing key={s.label} score={s.score || 0} label={s.label} color={scoreColor(s.score || 0)} />
                ))}
                {aiAdvice.score_explanation && (
                  <div className="flex-1 min-w-48 flex items-center">
                    <p className="text-sm text-slate-600 italic">{aiAdvice.score_explanation}</p>
                  </div>
                )}
              </div>

              {/* Tab nav */}
              <div className="flex gap-1 overflow-x-auto mb-4 pb-1">
                {TABS.map(t => (
                  <button key={t.key} onClick={() => setActiveTab(t.key as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      activeTab === t.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab === 'issues' && (
                <div className="space-y-3">
                  {(aiAdvice.critical_issues || []).map((issue: any, i: number) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-semibold text-slate-900 text-sm">{issue.issue}</p>
                        <ImpactBadge impact={issue.impact} />
                      </div>
                      <p className="text-sm text-slate-600 mb-2"><span className="font-medium text-slate-700">Fix:</span> {issue.fix}</p>
                      {issue.estimated_traffic_gain && (
                        <p className="text-xs text-emerald-600 font-medium">📈 {issue.estimated_traffic_gain}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'quickwins' && (
                <div className="space-y-3">
                  {(aiAdvice.quick_wins || []).map((qw: any, i: number) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-semibold text-slate-900 text-sm">{qw.action}</p>
                        <div className="flex gap-1 shrink-0">
                          <ImpactBadge impact={qw.impact} />
                          <Badge color="blue">{qw.effort}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500">{qw.why}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'aio' && (
                <div className="space-y-3">
                  {(aiAdvice.aio_recommendations || []).map((rec: any, i: number) => (
                    <div key={i} className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <p className="font-semibold text-slate-900 text-sm mb-1">{rec.recommendation}</p>
                      <p className="text-sm text-slate-600 mb-2"><span className="font-medium">How:</span> {rec.implementation}</p>
                      <p className="text-xs text-blue-600 font-medium">🤖 {rec.ai_engine_benefit}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'geo' && (
                <div className="space-y-3">
                  {(aiAdvice.geo_recommendations || []).map((rec: any, i: number) => (
                    <div key={i} className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                      <p className="font-semibold text-slate-900 text-sm mb-1">{rec.recommendation}</p>
                      <p className="text-sm text-slate-600 mb-2"><span className="font-medium">How:</span> {rec.implementation}</p>
                      <p className="text-xs text-emerald-700 font-medium">📍 {rec.local_seo_benefit}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-3">
                  {(aiAdvice.content_gaps || []).map((gap: any, i: number) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-slate-900 text-sm">{gap.missing_content}</p>
                        <Badge color={gap.monthly_searches_estimate === 'high' ? 'red' : gap.monthly_searches_estimate === 'medium' ? 'orange' : 'slate'}>
                          {gap.monthly_searches_estimate} searches
                        </Badge>
                      </div>
                      <p className="text-xs text-emerald-600 font-mono mb-1">/{gap.suggested_url}</p>
                      <p className="text-sm text-slate-500">Target: <span className="font-medium text-slate-700">{gap.target_keyword}</span></p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'plan' && (
                <div className="space-y-4">
                  {(aiAdvice['30_day_action_plan'] || []).map((week: any, i: number) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
                      <h3 className="font-bold text-slate-900 mb-3">{week.week}</h3>
                      <ul className="space-y-2">
                        {(week.tasks || []).map((task: string, j: number) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="text-emerald-500 mt-0.5 shrink-0">▸</span> {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Google update warnings */}
              {aiAdvice.google_update_warnings?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">⚠️ Google Update Warnings</h3>
                  <div className="space-y-2">
                    {aiAdvice.google_update_warnings.map((w: any, i: number) => (
                      <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <p className="font-semibold text-slate-900 text-sm mb-1">{w.update}</p>
                        <p className="text-sm text-slate-600 mb-1"><span className="font-medium text-red-600">Risk:</span> {w.risk}</p>
                        <p className="text-sm text-slate-600"><span className="font-medium text-green-600">Mitigation:</span> {w.mitigation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
