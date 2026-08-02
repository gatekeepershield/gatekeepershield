import React from 'react';
import { JobAnalysisResult } from '../types';
import { X, History, Trash2, ExternalLink, ShieldCheck, Flame, AlertTriangle } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: JobAnalysisResult[];
  onSelectScan: (item: JobAnalysisResult) => void;
  onClearHistory: () => void;
  onDeleteScan: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectScan,
  onClearHistory,
  onDeleteScan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-fuchsia-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-r from-[#9d174d] via-[#a21caf] to-[#701a75] text-white flex items-center justify-between border-b border-fuchsia-300/30">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base text-white font-serif-aesthetic">Scanned Jobs History</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-amber-300 border border-white/20">
              {history.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-fuchsia-100 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <History className="w-12 h-12 mx-auto text-fuchsia-300 mb-2 stroke-1" />
              <p className="text-sm font-semibold text-slate-700">No past scan records.</p>
              <p className="text-xs text-slate-400 mt-1">
                Scanned screenshots and job posts will be automatically saved here.
              </p>
            </div>
          ) : (
            history.map((item) => {
              let badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
              if (item.riskLevel === 'HIGH' || item.riskLevel === 'CRITICAL') {
                badgeBg = 'bg-rose-100 text-rose-900 border-rose-300';
              } else if (item.riskLevel === 'MEDIUM') {
                badgeBg = 'bg-fuchsia-100 text-[#be185d] border-fuchsia-300';
              }

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectScan(item);
                    onClose();
                  }}
                  className="group relative p-3.5 rounded-xl border border-fuchsia-100 hover:border-[#be185d] bg-fuchsia-50/30 hover:bg-fuchsia-50 cursor-pointer transition-all shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md border ${badgeBg}`}>
                      {item.riskLevel} ({item.overallRiskScore}%)
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="mt-2 text-xs font-bold text-slate-900 group-hover:text-[#be185d] line-clamp-1 font-sans">
                    {item.jobTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {item.companyName}
                  </p>

                  <p className="mt-1.5 text-[11px] text-slate-600 line-clamp-2 italic">
                    "{item.verdictSummary}"
                  </p>

                  {/* Delete Item Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteScan(item.id);
                    }}
                    className="absolute top-3 right-3 p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-fuchsia-200 bg-fuchsia-50/50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Stored locally in browser
            </span>
            <button
              onClick={onClearHistory}
              className="px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 rounded-lg transition-colors flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
