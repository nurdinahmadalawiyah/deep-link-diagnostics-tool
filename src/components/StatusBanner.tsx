import React from 'react';
import { ValidationResponse } from '@/hooks/useDomainValidation';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface StatusBannerProps {
  results: ValidationResponse | null;
}

export function StatusBanner({ results }: StatusBannerProps) {
  if (!results) return null;

  const hasIos = results.ios !== null;
  const hasAndroid = results.android !== null;

  const isIosSuccess = hasIos ? results.ios?.status === 'success' : true;
  const isAndroidSuccess = hasAndroid ? results.android?.status === 'success' : true;

  let status: 'success' | 'warning' | 'error' = 'success';
  let message = 'All systems go! Your domain configuration is valid.';
  let Icon = CheckCircle2;

  if (hasIos && hasAndroid) {
    if (!isIosSuccess && !isAndroidSuccess) {
      status = 'error';
      message = 'Critical errors found: Both iOS and Android configurations are invalid or missing.';
      Icon = AlertCircle;
    } else if (!isIosSuccess || !isAndroidSuccess) {
      status = 'warning';
      message = `Warning: ${!isIosSuccess ? 'iOS' : 'Android'} configuration has issues.`;
      Icon = AlertTriangle;
    } else {
      message = 'All systems go! Your domain configuration is valid for both iOS and Android.';
    }
  } else {
    // Only one platform checked
    const checkedPlatform = hasIos ? 'iOS' : 'Android';
    const isSuccess = hasIos ? isIosSuccess : isAndroidSuccess;
    
    if (!isSuccess) {
      status = 'error';
      message = `Critical errors found: ${checkedPlatform} configuration is invalid or missing.`;
      Icon = AlertCircle;
    } else {
      message = `All systems go! Your domain configuration is valid for ${checkedPlatform}.`;
    }
  }

  const colors = {
    success: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]",
    warning: "from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.1)]",
    error: "from-red-500/10 to-red-500/5 border-red-500/20 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
  };

  return (
    <div className={`relative overflow-hidden flex items-center p-5 rounded-2xl border bg-gradient-to-r backdrop-blur-md transition-all duration-500 ${colors[status]}`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${status === 'success' ? 'bg-emerald-500' : status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
      <div className="flex-shrink-0 p-2 bg-white/5 rounded-full mr-4 border border-white/5">
        <Icon className="w-6 h-6" />
      </div>
      <span className="font-medium text-base tracking-wide">{message}</span>
    </div>
  );
}
