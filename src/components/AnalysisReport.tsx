import React, { useState } from 'react';
import { JobAnalysisResult, RiskLevel } from '../types';
import { RiskGauge } from './RiskGauge';
import { RiskAnalyticsCharts } from './RiskAnalyticsCharts';
import {
  AlertOctagon,
  CheckCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  Building,
  ShieldCheck,
  ExternalLink,
  Printer,
  Share2,
  FileText,
  Lock,
  Tag,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface AnalysisReportProps {
  result: JobAnalysisResult;
  onNewScan: () => void;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ result, onNewScan }) => {
  const [showOcrText, setShowOcrText] = useState(false);
  const [copiedOcr, setCopiedOcr] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const handleCopyOcr = () => {
    navigator.clipboard.writeText(result.extractedText);
    setCopiedOcr(true);
    setTimeout(() => setCopiedOcr(false), 2000);
  };

  const handleShareReport = () => {
    const summary = `Gatekeeper Shield Scan Report:\nJob Title: ${result.jobTitle}\nCompany: ${result.companyName}\nRisk Score: ${result.overallRiskScore}% (${result.riskLevel})\nVerdict: ${result.verdictSummary}`;
    navigator.clipboard.writeText(summary);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredIndicators = result.aiScamIndicators.filter((item) => {
    if (severityFilter === 'ALL') return true;
    return item.severity === severityFilter;
  });

  return (
    <div id="analysis-report-container" className="w-full space-y-6 text-slate-800">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#9d174d] via-[#a21caf] to-[#701a75] text-white p-5 rounded-2xl shadow-xl border border-fuchsia-300/40">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-sans">
              OCR & AI Scan Result
            </span>
            <span className="text-xs text-fuchsia-100/80">• {new Date(result.timestamp).toLocaleTimeString()}</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-serif-aesthetic mt-0.5">
            {result.jobTitle}
          </h2>
          <div className="flex items-center space-x-2 text-xs text-fuchsia-100 mt-1 font-sans">
            <Building className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-semibold">{result.companyName}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            id="btn-copy-report"
            onClick={handleShareReport}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all shadow-md"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-300" />
            <span>{copiedShare ? 'Copied Report!' : 'Share'}</span>
          </button>

          <button
            id="btn-print-report"
            onClick={handlePrint}
            className="hidden md:inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all shadow-md"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span>Print PDF</span>
          </button>

          <button
            id="btn-scan-another"
            onClick={onNewScan}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#be185d] text-xs font-bold shadow-lg transition-all"
          >
            <span>+ Scan Another Job</span>
          </button>
        </div>
      </div>

      {/* Risk Gauge Header Component */}
      <RiskGauge
        score={result.overallRiskScore}
        level={result.riskLevel}
        verdictSummary={result.verdictSummary}
      />

      {/* Visual Data Graphs: Bar Chart & Pie Chart */}
      <RiskAnalyticsCharts result={result} />

      {/* Extracted OCR Text Box */}
      <div id="ocr-extracted-text-card" className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-fuchsia-200/80 shadow-xl shadow-fuchsia-100/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-[#be185d] font-serif-aesthetic">
              Extracted OCR Text & Raw Input ({result.extractedText.length} characters)
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-copy-ocr-text"
              onClick={handleCopyOcr}
              className="px-3 py-1 text-xs font-semibold text-[#be185d] hover:text-rose-700 bg-fuchsia-100 hover:bg-fuchsia-200 rounded-lg flex items-center space-x-1 transition-colors border border-fuchsia-200"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedOcr ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              id="btn-toggle-ocr-view"
              onClick={() => setShowOcrText(!showOcrText)}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-fuchsia-100 transition-colors"
              title={showOcrText ? 'Collapse OCR Text' : 'Expand OCR Text'}
            >
              {showOcrText ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {showOcrText ? (
          <div className="mt-3 p-4 bg-fuchsia-50/80 text-slate-800 font-mono text-xs rounded-xl overflow-x-auto max-h-60 whitespace-pre-wrap border border-fuchsia-200">
            {result.extractedText}
          </div>
        ) : (
          <p
            onClick={() => setShowOcrText(true)}
            className="mt-2 text-xs text-slate-600 line-clamp-2 cursor-pointer hover:text-[#be185d] italic bg-fuchsia-50/50 p-3 rounded-xl border border-fuchsia-100"
          >
            "{result.extractedText.substring(0, 180)}..." <span className="font-semibold text-[#be185d] not-italic">(Click to expand full OCR text)</span>
          </p>
        )}
      </div>

      {/* Scam Tactics Badges */}
      {result.scamTacticsDetected.length > 0 && (
        <div className="bg-rose-50/80 text-slate-800 rounded-2xl p-5 border border-rose-200/80 shadow-md">
          <div className="flex items-center space-x-2 mb-3">
            <Tag className="w-4 h-4 text-rose-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 font-sans">
              Scam & Phishing Tactics Identified ({result.scamTacticsDetected.length})
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.scamTacticsDetected.map((tactic, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{tactic}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Scam Indicators Breakdown */}
      <div id="scam-indicators-card" className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-fuchsia-200/80 shadow-xl shadow-fuchsia-100/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-fuchsia-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-[#be185d] flex items-center space-x-2 font-serif-aesthetic">
              <AlertOctagon className="w-5 h-5 text-rose-600" />
              <span>Detected Scam & Red Flag Indicators ({result.aiScamIndicators.length})</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1 font-sans">
              Specific language patterns, payment requests, and communication risks found in the input.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-fuchsia-100/80 p-1.5 rounded-xl border border-fuchsia-200">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  severityFilter === sev
                    ? 'bg-[#be185d] text-white shadow-md'
                    : 'text-slate-700 hover:text-[#be185d]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {filteredIndicators.length === 0 ? (
          <div className="py-8 text-center bg-fuchsia-50/50 rounded-xl border border-dashed border-fuchsia-200">
            <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">No red flags matching this filter.</p>
            <p className="text-xs text-slate-500">The analyzed offer appears clean in these categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIndicators.map((item, idx) => {
              let badgeColor = 'bg-rose-100 text-rose-900 border-rose-300';
              if (item.severity === 'HIGH') badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
              if (item.severity === 'MEDIUM') badgeColor = 'bg-purple-100 text-purple-900 border-purple-300';
              if (item.severity === 'LOW') badgeColor = 'bg-slate-100 text-slate-800 border-slate-300';

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-fuchsia-200/80 bg-fuchsia-50/40 hover:bg-fuchsia-100/60 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#be185d] font-sans">
                        {item.category}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border ${badgeColor}`}
                      >
                        {item.severity}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 font-sans">{item.title}</h4>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed font-sans">{item.description}</p>
                  </div>

                  {item.foundEvidence && (
                    <div className="mt-3 pt-2.5 border-t border-fuchsia-200/80 bg-amber-50/80 p-3 rounded-lg border border-amber-200">
                      <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-0.5 font-sans">
                        Found Evidence Quote:
                      </div>
                      <div className="text-xs font-mono text-amber-900 italic">
                        "{item.foundEvidence}"
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Authenticity Markers (If clean elements found) */}
      {result.authenticityMarkers.length > 0 && (
        <div className="bg-emerald-50/80 text-slate-800 rounded-2xl p-5 border border-emerald-200/80 shadow-md">
          <h3 className="text-sm font-bold text-emerald-900 flex items-center space-x-2 mb-3 font-serif-aesthetic">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>Positive Authenticity & Legitimacy Signs ({result.authenticityMarkers.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {result.authenticityMarkers.map((marker, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-emerald-200">
                <h4 className="text-xs font-bold text-emerald-900 font-sans">{marker.title}</h4>
                <p className="mt-1 text-xs text-slate-600 font-sans">{marker.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Company Verification & WHOIS Guide */}
      <div className="bg-gradient-to-r from-[#9d174d] via-[#a21caf] to-[#701a75] text-white rounded-2xl p-6 shadow-xl border border-fuchsia-300/40">
        <div className="flex items-center space-x-2 mb-3">
          <Building className="w-5 h-5 text-amber-300" />
          <h3 className="text-base font-bold text-white font-serif-aesthetic">Company & Domain Verification Checklist</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-fuchsia-100">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <div className="font-bold text-amber-300 text-sm mb-1 font-sans">Domain & Recruiter Email Check</div>
            <p className="leading-relaxed font-sans">{result.companyVerificationGuide.domainCheckNotes}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <div className="font-bold text-amber-300 text-sm mb-1 font-sans">Careers Site Verification Tip</div>
            <p className="leading-relaxed font-sans">{result.companyVerificationGuide.officialWebsiteTip}</p>
          </div>
        </div>
      </div>

      {/* Actionable Safety Steps */}
      <div id="safety-action-steps-card" className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-fuchsia-200/80 shadow-xl shadow-fuchsia-100/50">
        <h3 className="text-base font-bold text-[#be185d] flex items-center space-x-2 mb-4 font-serif-aesthetic">
          <Lock className="w-5 h-5 text-amber-600" />
          <span>Recommended Next Steps & Protective Actions</span>
        </h3>

        <div className="space-y-3">
          {result.actionableSafetySteps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3 p-4 rounded-xl bg-fuchsia-50/50 border border-fuchsia-200/80"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#be185d] text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-300/40">
                {idx + 1}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-sans">{step.step}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-sans">{step.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
