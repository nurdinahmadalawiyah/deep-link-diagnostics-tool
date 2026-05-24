import React, { useState } from 'react';
import { Terminal, Copy, Check, ChevronRight } from 'lucide-react';
import { ValidationResponse } from '@/hooks/useDomainValidation';

interface PathTesterProps {
  domain: string;
  results: ValidationResponse | null;
}

export function PathTester({ domain, results }: PathTesterProps) {
  const [path, setPath] = useState('');
  const [copiedAndroid, setCopiedAndroid] = useState(false);
  const [copiedIos, setCopiedIos] = useState(false);

  if (!results || !domain) return null;

  const isIosSuccess = results.ios?.status === 'success';
  const isAndroidSuccess = results.android?.status === 'success';

  if (!isIosSuccess && !isAndroidSuccess) return null;

  const fullUrl = `https://${domain.replace(/^https?:\/\//, '').replace(/\/+$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

  let androidPackage = "com.your.package";
  if (isAndroidSuccess && Array.isArray(results.android?.data)) {
    const target = results.android?.data[0]?.target;
    if (target?.package_name) {
      androidPackage = target.package_name;
    }
  }

  const androidCommand = `adb shell am start -W -a android.intent.action.VIEW -d "${fullUrl}" ${androidPackage}`;
  const iosCommand = `xcrun simctl openurl booted "${fullUrl}"`;

  const copyToClipboard = (text: string, type: 'android' | 'ios') => {
    navigator.clipboard.writeText(text);
    if (type === 'android') {
      setCopiedAndroid(true);
      setTimeout(() => setCopiedAndroid(false), 2000);
    } else {
      setCopiedIos(true);
      setTimeout(() => setCopiedIos(false), 2000);
    }
  };

  return (
    <div className="mt-8 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10 bg-white/[0.02]">
        <div>
          <h3 className="text-xl font-bold flex items-center text-zinc-100 tracking-tight">
            <Terminal className="w-5 h-5 mr-2 text-indigo-400" />
            Local Path Tester
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            Test specific deep link paths locally on your emulators using CLI.
          </p>
        </div>
      </div>

      <div className="p-8 space-y-8 relative z-10">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
          <div className="relative flex items-center bg-zinc-950 rounded-xl border border-white/10 overflow-hidden">
            <div className="pl-4 pr-2 bg-zinc-900 border-r border-white/5 h-full py-3">
              <span className="text-zinc-500 font-mono text-sm">PATH</span>
            </div>
            <input
              type="text"
              placeholder="/product/123"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="flex-1 bg-transparent px-4 py-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-0 font-mono text-sm"
            />
          </div>
        </div>

        <div className="grid gap-6">
          {isAndroidSuccess && (
            <div className="space-y-2.5">
              <div className="flex items-center text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                <img src="https://cdn.worldvectorlogo.com/logos/android-logomark.svg" alt="Android" className="w-4 h-4 mr-2 opacity-70" />
                Android ADB Command
              </div>
              <div className="relative group rounded-xl bg-zinc-950 border border-zinc-800 p-1 flex items-stretch">
                <div className="flex items-center px-3 text-zinc-600 select-none border-r border-zinc-800">
                  <ChevronRight className="w-4 h-4" />
                </div>
                <code className="flex-1 px-4 py-3 text-sm text-zinc-300 break-all font-mono overflow-x-auto whitespace-pre">
                  {androidCommand}
                </code>
                <button
                  onClick={() => copyToClipboard(androidCommand, 'android')}
                  className="flex items-center justify-center w-12 border-l border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors rounded-r-lg"
                  title="Copy to clipboard"
                >
                  {copiedAndroid ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {isIosSuccess && (
            <div className="space-y-2.5">
              <div className="flex items-center text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="w-4 h-4 mr-2 opacity-70 invert" />
                iOS xcrun Command
              </div>
              <div className="relative group rounded-xl bg-zinc-950 border border-zinc-800 p-1 flex items-stretch">
                <div className="flex items-center px-3 text-zinc-600 select-none border-r border-zinc-800">
                  <ChevronRight className="w-4 h-4" />
                </div>
                <code className="flex-1 px-4 py-3 text-sm text-zinc-300 break-all font-mono overflow-x-auto whitespace-pre">
                  {iosCommand}
                </code>
                <button
                  onClick={() => copyToClipboard(iosCommand, 'ios')}
                  className="flex items-center justify-center w-12 border-l border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors rounded-r-lg"
                  title="Copy to clipboard"
                >
                  {copiedIos ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
