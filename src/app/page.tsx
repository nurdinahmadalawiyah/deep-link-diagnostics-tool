'use client';

import React from 'react';
import { useDomainValidation } from '@/hooks/useDomainValidation';
import { Search, Loader2 } from 'lucide-react';
import { StatusBanner } from '@/components/StatusBanner';
import { ReportCard } from '@/components/ReportCard';
import { PathTester } from '@/components/PathTester';

export default function Home() {
  const { isLoading, error, validationResults, validateDomain, domain } = useDomainValidation();
  const [inputDomain, setInputDomain] = React.useState('');
  const [checkIos, setCheckIos] = React.useState(true);
  const [checkAndroid, setCheckAndroid] = React.useState(true);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputDomain) {
      const platforms: ('ios' | 'android')[] = [];
      if (checkIos) platforms.push('ios');
      if (checkAndroid) platforms.push('android');
      validateDomain(inputDomain, platforms);
    }
  };

  React.useEffect(() => {
    // If the user has already analyzed this domain, automatically re-analyze when they toggle the platforms
    if (domain && domain === inputDomain) {
      if (checkIos || checkAndroid) {
        handleSubmit();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIos, checkAndroid]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30 overflow-hidden relative flex flex-col">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16 flex-grow w-full">
        
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-2 bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl mb-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-inner">
              <Search className="text-white w-5 h-5" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 pb-4">
            Deep Link Diagnostics
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Validate server-side configurations for iOS Universal Links and Android App Links. Ensure your <code className="bg-zinc-900 border border-white/10 px-1.5 py-0.5 rounded-md text-zinc-300 shadow-sm">.well-known</code> files are perfectly formatted.
          </p>
        </div>

        {/* Input Section */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative group z-10 space-y-6">
          
          {/* Platform Toggles */}
          <div className="flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={() => setCheckIos(!checkIos)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border flex items-center gap-2.5 ${
                checkIos
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                  : 'bg-zinc-900/40 text-zinc-500 border-white/5 hover:bg-zinc-800/60 hover:text-zinc-400'
              }`}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className={`w-4 h-4 transition-all duration-300 ${checkIos ? 'invert opacity-90' : 'invert opacity-40'}`} />
              iOS (AASA)
            </button>
            <button
              type="button"
              onClick={() => setCheckAndroid(!checkAndroid)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border flex items-center gap-2.5 ${
                checkAndroid
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  : 'bg-zinc-900/40 text-zinc-500 border-white/5 hover:bg-zinc-800/60 hover:text-zinc-400'
              }`}
            >
              <img src="https://cdn.worldvectorlogo.com/logos/android-logomark.svg" alt="Android" className={`w-4 h-4 transition-all duration-300 ${checkAndroid ? 'opacity-90' : 'opacity-40 grayscale'}`} />
              Android (AssetLinks)
            </button>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl transition-all duration-300 focus-within:border-indigo-500/50 focus-within:bg-zinc-900">
              <div className="pl-4 pr-2 flex items-center pointer-events-none">
                <span className="text-zinc-500 font-medium select-none">https://</span>
              </div>
              <input
                type="text"
                value={inputDomain}
                onChange={(e) => setInputDomain(e.target.value)}
                placeholder="api.example.com"
                className="flex-1 bg-transparent py-4 px-2 text-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-0 w-full"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputDomain.trim() || (!checkIos && !checkAndroid)}
                className="ml-2 inline-flex items-center justify-center px-8 py-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Analyze'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error Banner */}
        {error && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-4 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl shadow-xl flex items-center justify-center">
              <p className="text-sm text-red-400 font-medium">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {validationResults && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out space-y-10 relative z-10">
            
            {isLoading && (
              <div className="absolute -inset-4 z-50 flex flex-col items-center justify-center bg-zinc-950/60 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl">
                <div className="p-4 bg-zinc-900/80 rounded-2xl shadow-xl flex flex-col items-center border border-white/10">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
                  <p className="text-zinc-300 font-medium animate-pulse">Analyzing configuration...</p>
                </div>
              </div>
            )}

            <StatusBanner results={validationResults} />
            
            <div className={`grid grid-cols-1 ${validationResults.ios && validationResults.android ? 'md:grid-cols-2' : ''} gap-8`}>
              {validationResults.ios && <ReportCard platform="iOS" result={validationResults.ios} />}
              {validationResults.android && <ReportCard platform="Android" result={validationResults.android} />}
            </div>

            <PathTester domain={domain} results={validationResults} />
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-white/5 mt-auto relative z-10 bg-zinc-950/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-zinc-500 text-sm font-medium tracking-wide">
            © {new Date().getFullYear()} Deep Link Diagnostics. Crafted with <span className="text-indigo-500 animate-pulse inline-block">♥</span> by{' '}
            <a 
              href="https://github.com/nurdinahmadalawiyah" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-300 hover:text-indigo-400 transition-colors"
            >
              Nurdin Ahmad Alawiyah
            </a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
