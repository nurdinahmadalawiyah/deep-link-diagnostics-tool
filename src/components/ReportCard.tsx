import React, { useState } from 'react';
import { ValidationResult } from '@/lib/validation/validator';
import { Check, X, Server, Code, CheckCircle2, XCircle, Cloud, AlertCircle } from 'lucide-react';
import { DiffViewer } from './DiffViewer';

interface ReportCardProps {
  platform: 'iOS' | 'Android';
  result: ValidationResult | null;
}

export function ReportCard({ platform, result }: ReportCardProps) {
  const [activeTab, setActiveTab] = useState<'direct' | 'cdn'>('direct');

  if (!result) return null;

  const isSuccess = result.status === 'success';

  return (
    <div className="relative group rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden transition-all duration-300 hover:bg-zinc-900/70 hover:border-white/10">
      {/* Subtle top glow based on status */}
      <div className={`absolute top-0 left-0 w-full h-[2px] ${isSuccess ? 'bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0' : 'bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0'}`} />
      
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <h3 className="text-xl font-bold flex items-center text-zinc-100 tracking-tight">
          {platform} Report
        </h3>
        {isSuccess ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Valid
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
            <XCircle className="w-3.5 h-3.5" /> Invalid
          </span>
        )}
      </div>

      <div className="border-b border-white/5 bg-zinc-950/30 flex">
        <button
          onClick={() => setActiveTab('direct')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'direct' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-white/[0.02]' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Server className="w-4 h-4" /> Direct Server
        </button>
        <button
          onClick={() => setActiveTab('cdn')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'cdn' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-white/[0.02]' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Cloud className="w-4 h-4" /> {platform === 'iOS' ? 'Apple CDN' : 'Google API'}
        </button>
      </div>

      <div className="p-6 space-y-6">
        {activeTab === 'direct' ? (
          <>
            <div className="flex items-start group/item">
              <div className="p-2 rounded-lg bg-zinc-800/50 mr-4 border border-white/5 group-hover/item:border-white/10 transition-colors">
                <Server className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-1">Status Message</p>
                <p className="text-sm text-zinc-400">{result.message}</p>
              </div>
            </div>

            {!isSuccess && result.errors && (
              <div className="flex items-start group/item">
                <div className="p-2 rounded-lg bg-zinc-800/50 mr-4 border border-white/5 group-hover/item:border-white/10 transition-colors">
                  <Code className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-2">Schema Errors</p>
                  <ul className="space-y-2">
                    {result.errors.map((err, i) => (
                      <li key={i} className="text-sm text-red-300 flex items-start bg-red-500/5 p-2 rounded-md border border-red-500/10">
                        <X className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
                        <span><span className="font-mono text-red-400 bg-red-500/10 px-1 rounded mr-1">{err.instancePath || 'root'}</span> {err.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {result.expectedVsActual ? (
              <div className="pt-4 mt-2">
                <p className="text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-3 flex items-center">
                  <span className="bg-zinc-800/80 px-2 py-1 rounded border border-white/5 text-xs mr-2">Diff</span> Expected vs Actual
                </p>
                <DiffViewer
                  expected={result.expectedVsActual.expected}
                  actual={result.expectedVsActual.actual}
                />
              </div>
            ) : result.data && (
              <div className="pt-4 mt-2">
                <p className="text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-3 flex items-center">
                  <Code className="w-4 h-4 mr-2 text-indigo-400" /> Direct Response JSON
                </p>
                <div className="relative group rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-8 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <pre className="p-4 pt-12 text-xs text-zinc-300 font-mono overflow-auto max-h-64 custom-scrollbar">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-start group/item">
              <div className="p-2 rounded-lg bg-zinc-800/50 mr-4 border border-white/5 group-hover/item:border-white/10 transition-colors">
                <Cloud className={`w-5 h-5 ${result.cdnStatus === 'success' ? 'text-emerald-400' : result.cdnStatus === 'not_found' ? 'text-amber-400' : 'text-red-400'}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-1">Cache Status</p>
                <p className="text-sm text-zinc-400">{result.cdnMessage || "Fetching..."}</p>
              </div>
            </div>

            {result.cdnData && (
              <div className="pt-4 mt-2">
                <p className="text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-3 flex items-center">
                  <Code className="w-4 h-4 mr-2 text-indigo-400" /> Cached JSON
                </p>
                <div className="relative group rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-8 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <pre className="p-4 pt-12 text-xs text-zinc-300 font-mono overflow-auto max-h-64 custom-scrollbar">
                    {JSON.stringify(result.cdnData, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {result.cdnStatus === 'not_found' && (
              <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-200/80 leading-relaxed">
                  The bot hasn't found or cached your file yet. If you just deployed it, it might take a few hours to a day for Apple/Google to scrape it.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
