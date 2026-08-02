import React from 'react';
import { RiskLevel } from '../types';
import { ShieldAlert, ShieldCheck, AlertTriangle, Flame } from 'lucide-react';

interface RiskGaugeProps {
  score: number; // 0 to 100
  level: RiskLevel;
  verdictSummary: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, verdictSummary }) => {
  // Determine color theme based on score & level
  let colorTheme = {
    bg: 'bg-white/90 border-emerald-200 shadow-emerald-100/50',
    text: 'text-emerald-900',
    badgeBg: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
    ring: 'text-emerald-600',
    icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
    label: 'Low Scam Risk / Legitimate Offer',
  };

  if (score > 25 && score <= 55) {
    colorTheme = {
      bg: 'bg-white/90 border-fuchsia-200 shadow-fuchsia-100/50',
      text: 'text-[#be185d]',
      badgeBg: 'bg-fuchsia-100 text-[#be185d] border border-fuchsia-300',
      ring: 'text-purple-600',
      icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
      label: 'Medium Scam Risk / Proceed with Caution',
    };
  } else if (score > 55 && score <= 85) {
    colorTheme = {
      bg: 'bg-white/90 border-rose-200 shadow-rose-100/50',
      text: 'text-rose-900',
      badgeBg: 'bg-rose-100 text-rose-900 border border-rose-300',
      ring: 'text-rose-600',
      icon: <ShieldAlert className="w-8 h-8 text-rose-600" />,
      label: 'High Scam Risk / Probable Fraud',
    };
  } else if (score > 85) {
    colorTheme = {
      bg: 'bg-white/90 border-rose-300 shadow-rose-200/50',
      text: 'text-rose-950',
      badgeBg: 'bg-rose-700 text-amber-200 border border-amber-300 animate-pulse',
      ring: 'text-rose-700',
      icon: <Flame className="w-8 h-8 text-amber-600" />,
      label: 'Critical Scam Risk / Confirmed Scam Trap',
    };
  }

  // SVG Gauge calculations
  const radius = 70;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Semi-circle circumference
  const normalizedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div id="risk-gauge-card" className={`rounded-2xl p-6 border ${colorTheme.bg} shadow-xl backdrop-blur-md transition-all text-slate-800`}>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Semi-Circle SVG Gauge */}
        <div className="flex flex-col items-center justify-center relative">
          <div className="relative w-48 h-28 flex justify-center items-end">
            <svg className="w-48 h-48 -rotate-180 transform" viewBox="0 0 160 160">
              {/* Background Arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#f0abfc"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeLinecap="round"
              />
              {/* Colored Score Arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="currentColor"
                className={`${colorTheme.ring} transition-all duration-1000 ease-out`}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Center Text */}
            <div className="absolute bottom-1 flex flex-col items-center">
              <span className="text-3xl font-bold tracking-tight text-[#be185d] font-display-luxury">
                {score}<span className="text-lg text-amber-600 font-semibold">%</span>
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 font-sans">
                Risk Score
              </span>
            </div>
          </div>

          <div className="mt-3">
            <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-2xs ${colorTheme.badgeBg}`}>
              {level} RISK ({score}/100)
            </span>
          </div>
        </div>

        {/* Verdict Explanation Text */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-2">
            {colorTheme.icon}
            <h2 className={`text-xl font-bold ${colorTheme.text} font-serif-aesthetic`}>
              {colorTheme.label}
            </h2>
          </div>

          <p className="text-sm font-medium text-slate-800 leading-relaxed bg-fuchsia-50/60 p-4 rounded-xl border border-fuchsia-200/80 font-sans shadow-2xs">
            {verdictSummary}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pt-1 font-sans">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>0-25% Low</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>26-55% Medium</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>56-85% High</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>86-100% Critical</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
