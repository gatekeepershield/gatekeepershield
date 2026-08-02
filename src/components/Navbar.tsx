import React from 'react';
import { ShieldCheck, History, BookOpen, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenHistory: () => void;
  onOpenKnowledge: () => void;
  scannedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHistory,
  onOpenKnowledge,
  scannedCount,
}) => {
  return (
    <header id="app-header" className="sticky top-0 z-40 w-full border-b border-fuchsia-200/80 bg-white/80 backdrop-blur-md text-slate-900 shadow-md shadow-fuchsia-100/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-fuchsia-500 to-purple-500 p-0.5 shadow-md shadow-fuchsia-200/60">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#be185d]" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="stylish-brand-heading text-xl sm:text-2xl font-bold tracking-normal drop-shadow-xs">
                GatekeepeRShield
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full bg-purple-100 text-[#be185d] border border-purple-200 shadow-2xs">
                Anti-AI Scam
              </span>
            </div>
            <p className="text-xs text-purple-900/70 hidden sm:block font-serif-aesthetic italic">
              Job Vacancy & Recruitment Fraud OCR Protector
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            id="btn-knowledge-base"
            onClick={onOpenKnowledge}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-fuchsia-50 hover:bg-fuchsia-100 text-[#be185d] text-xs sm:text-sm font-semibold transition-all border border-fuchsia-200 shadow-xs hover:border-fuchsia-300"
            title="Anti-Scam Guide"
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span className="hidden md:inline font-sans">Scam Guide</span>
          </button>

          <button
            id="btn-scan-history"
            onClick={onOpenHistory}
            className="relative shimmer-button flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-rose-200 border border-fuchsia-300/40"
            title="Scan History"
          >
            <History className="w-4 h-4 text-amber-300" />
            <span className="font-sans">History</span>
            {scannedCount > 0 && (
              <span className="ml-1 px-2 py-0.2 text-[10px] font-extrabold rounded-full bg-amber-300 text-rose-950 shadow-2xs">
                {scannedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

