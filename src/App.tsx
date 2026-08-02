import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UploadSection } from './components/UploadSection';
import { AnalysisReport } from './components/AnalysisReport';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ScamKnowledgeBase } from './components/ScamKnowledgeBase';
import { SAMPLE_JOBS } from './data/sampleJobs';
import { JobAnalysisResult, SampleJob } from './types';
import { ShieldCheck, AlertCircle, Sparkles, Shield, ArrowRight } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'gatekeeper_shield_scan_history_v1';

export default function App() {
  const [currentResult, setCurrentResult] = useState<JobAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<JobAnalysisResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);

  // Load past history on initial load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse history from localStorage', e);
    }
  }, []);

  // Save history to localStorage on change
  const saveHistory = (newHistory: JobAnalysisResult[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  };

  const handleAnalyze = async (payload: {
    image?: string;
    mimeType?: string;
    jobText?: string;
    jobUrl?: string;
  }) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis server request failed.');
      }

      // Append image preview URL if present
      if (payload.image) {
        data.imagePreviewUrl = payload.image;
      }

      setCurrentResult(data);

      // Add to history
      const updatedHistory = [data, ...history.filter((h) => h.id !== data.id)].slice(0, 30);
      saveHistory(updatedHistory);

      // Scroll smoothly down to analysis report
      setTimeout(() => {
        document.getElementById('analysis-report-container')?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 100);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'An unexpected error occurred during OCR analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSample = (sample: SampleJob) => {
    setCurrentResult(sample.analysis);
    setError(null);

    // Save to history if not present
    const exists = history.some((h) => h.id === sample.analysis.id);
    if (!exists) {
      saveHistory([sample.analysis, ...history]);
    }

    setTimeout(() => {
      document.getElementById('analysis-report-container')?.scrollIntoView({
        behavior: 'smooth',
      });
    }, 100);
  };

  const handleDeleteScan = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
    if (currentResult?.id === id) {
      setCurrentResult(null);
    }
  };

  const handleClearHistory = () => {
    saveHistory([]);
    setCurrentResult(null);
  };

  return (
    <div className="relative min-h-screen bg-[#fdf4f8] text-[#4c0519] font-sans flex flex-col selection:bg-fuchsia-200 selection:text-[#4c0519] overflow-x-hidden">
      {/* Blurred Ambient Light Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-purple-300/35 rounded-full blur-[120px]" />
        <div className="absolute top-20 -right-20 w-[550px] h-[550px] bg-rose-300/30 rounded-full blur-[110px]" />
        <div className="absolute top-[45%] left-[25%] w-[650px] h-[650px] bg-fuchsia-200/30 rounded-full blur-[130px]" />
        <div className="absolute -bottom-20 right-10 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[100px]" />
      </div>

      {/* Navigation Header */}
      <div className="relative z-10">
        <Navbar
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenKnowledge={() => setIsKnowledgeOpen(true)}
          scannedCount={history.length}
        />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Notification Banner */}
        {error && (
          <div className="bg-rose-50/90 backdrop-blur-md border border-rose-300 p-4 rounded-2xl flex items-start space-x-3 text-rose-900 text-sm shadow-md animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Scan Error: </span>
              {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-bold text-rose-700 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Upload & Form Section */}
        <UploadSection
          onAnalyze={handleAnalyze}
          onSelectSample={handleSelectSample}
          samples={SAMPLE_JOBS}
          isAnalyzing={isAnalyzing}
        />

        {/* Analysis Results Display */}
        {currentResult && (
          <AnalysisReport
            result={currentResult}
            onNewScan={() => {
              setCurrentResult(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Informational Value Cards when no scan result active */}
        {!currentResult && !isAnalyzing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-white/85 backdrop-blur-md p-6 rounded-2xl border border-fuchsia-200/80 shadow-md space-y-2 hover:shadow-lg transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#be185d] font-sans">OCR Screenshot Parsing</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Upload screenshots from Telegram, WhatsApp, LinkedIn, or email inbox. Gemini extracts text from any image format.
              </p>
            </div>

            <div className="bg-white/85 backdrop-blur-md p-6 rounded-2xl border border-fuchsia-200/80 shadow-md space-y-2 hover:shadow-lg transition-all">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-100 text-[#be185d] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#be185d] font-sans">AI Scam Pattern Radar</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Evaluates fake check deposits, crypto task traps, @gmail impersonators, and generic LLM-phishing templates.
              </p>
            </div>

            <div className="bg-white/85 backdrop-blur-md p-6 rounded-2xl border border-fuchsia-200/80 shadow-md space-y-2 hover:shadow-lg transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#be185d] font-sans">Actionable Safety Guidance</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Provides WHOIS domain check advice, company verification steps, and FTC/IC3 reporting links.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectScan={(item) => {
          setCurrentResult(item);
          setTimeout(() => {
            document.getElementById('analysis-report-container')?.scrollIntoView({
              behavior: 'smooth',
            });
          }, 100);
        }}
        onClearHistory={handleClearHistory}
        onDeleteScan={handleDeleteScan}
      />

      {/* Scam Knowledge Base Field Guide */}
      <ScamKnowledgeBase
        isOpen={isKnowledgeOpen}
        onClose={() => setIsKnowledgeOpen(false)}
      />

      {/* Footer */}
      <footer className="relative z-10 mt-16 border-t border-fuchsia-200/80 bg-white/70 backdrop-blur-md py-8 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#be185d]" />
            <span className="stylish-brand-heading font-bold text-sm">GatekeepeRShield</span>
            <span>— Anti-AI Recruitment Scam Protector</span>
          </div>
          <p className="text-slate-500">
            Powered by Gemini AI OCR & Security Analysis. Designed to safeguard job seekers.
          </p>
        </div>
      </footer>
    </div>
  );
}
