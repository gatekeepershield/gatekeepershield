import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
  FileSearch,
  Zap,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { SampleJob } from '../types';

interface UploadSectionProps {
  onAnalyze: (payload: {
    image?: string;
    mimeType?: string;
    jobText?: string;
    jobUrl?: string;
  }) => void;
  onSelectSample: (sample: SampleJob) => void;
  samples: SampleJob[];
  isAnalyzing: boolean;
}

// Client-side fast image compression helper (max 1600px width/height)
const compressImageForFastOCR = (file: File): Promise<{ dataUrl: string; sizeKB: number }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1600;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
        }

        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        const sizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);
        resolve({ dataUrl, sizeKB });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const UploadSection: React.FC<UploadSectionProps> = ({
  onAnalyze,
  onSelectSample,
  samples,
  isAnalyzing,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'url'>('upload');
  const [selectedImage, setSelectedImage] = useState<{
    dataUrl: string;
    mimeType: string;
    name: string;
    sizeKB: number;
  } | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated speed progress steps during analysis
  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      setProgressStep(15);
      interval = setInterval(() => {
        setProgressStep((prev) => {
          if (prev >= 90) return prev;
          return prev + 25;
        });
      }, 400);
    } else {
      setProgressStep(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, etc.) or screenshot.');
      return;
    }

    try {
      const { dataUrl, sizeKB } = await compressImageForFastOCR(file);
      setSelectedImage({
        dataUrl,
        mimeType: 'image/jpeg',
        name: file.name,
        sizeKB,
      });
    } catch (e) {
      console.error('Fast compression fallback', e);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage({
            dataUrl: reader.result,
            mimeType: file.type || 'image/png',
            name: file.name,
            sizeKB: Math.round(file.size / 1024),
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnalyzing) return;

    if (activeTab === 'upload') {
      if (!selectedImage) {
        alert('Please choose or drop an image/screenshot first.');
        return;
      }
      onAnalyze({
        image: selectedImage.dataUrl,
        mimeType: selectedImage.mimeType,
        jobText: pastedText,
      });
    } else if (activeTab === 'text') {
      if (!pastedText.trim()) {
        alert('Please paste the job description or recruiter message text.');
        return;
      }
      onAnalyze({
        jobText: pastedText.trim(),
      });
    } else if (activeTab === 'url') {
      if (!jobUrl.trim()) {
        alert('Please enter a job posting URL or web link.');
        return;
      }
      onAnalyze({
        jobUrl: jobUrl.trim(),
        jobText: `Analysis requested for URL: ${jobUrl.trim()}\nAdditional details: ${pastedText}`,
      });
    }
  };

  return (
    <div id="upload-section-container" className="w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl shadow-fuchsia-100/50 border border-fuchsia-200/80 overflow-hidden text-slate-800">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#9d174d] via-[#a21caf] to-[#701a75] px-6 py-7 border-b border-fuchsia-300/40 text-white relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-fuchsia-400/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/50 text-amber-200 text-xs font-semibold mb-3 shadow-xs">
              <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="font-sans tracking-wide">High-Speed AI Multimodal OCR Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif-aesthetic">
              Scan Job Vacancies & Detect AI Scams
            </h1>
            <p className="mt-2 text-sm text-fuchsia-100/90 max-w-2xl font-sans leading-relaxed">
              Upload job offer screenshots, WhatsApp/Telegram messages, or emails.
              Our AI extracts OCR text and evaluates risk with interactive Bar & Pie charts.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="hidden lg:flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 shadow-inner text-white">
            <div className="text-center px-2">
              <div className="text-xl font-bold text-amber-300 flex items-center justify-center space-x-1 font-display-luxury">
                <BarChart3 className="w-4 h-4 text-amber-300" />
                <span>CHARTS</span>
              </div>
              <div className="text-[10px] text-fuchsia-100/80 uppercase font-bold tracking-wider">Bar & Pie Graphs</div>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="text-center px-2">
              <div className="text-xl font-bold text-fuchsia-200 font-display-luxury">&lt; 2s</div>
              <div className="text-[10px] text-fuchsia-100/80 uppercase font-bold tracking-wider">Fast OCR Scan</div>
            </div>
          </div>
        </div>

        {/* Input Mode Tabs */}
        <div className="mt-7 flex flex-wrap gap-2 border-b border-fuchsia-300/30 pb-1 relative z-10">
          <button
            id="tab-upload-image"
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'upload'
                ? 'bg-white text-[#be185d] border-amber-400 shadow-md'
                : 'bg-white/10 text-fuchsia-100 hover:text-white border-transparent hover:bg-white/20'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span className="font-sans">Upload Screenshot / Image</span>
          </button>

          <button
            id="tab-paste-text"
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'text'
                ? 'bg-white text-[#be185d] border-amber-400 shadow-md'
                : 'bg-white/10 text-fuchsia-100 hover:text-white border-transparent hover:bg-white/20'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="font-sans">Paste Text / Email</span>
          </button>

          <button
            id="tab-paste-url"
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'url'
                ? 'bg-white text-[#be185d] border-amber-400 shadow-md'
                : 'bg-white/10 text-fuchsia-100 hover:text-white border-transparent hover:bg-white/20'
            }`}
          >
            <LinkIcon className="w-4 h-4 text-amber-400" />
            <span className="font-sans">Job URL / Link</span>
          </button>
        </div>
      </div>

      {/* Progress Bar when analyzing */}
      {isAnalyzing && (
        <div className="bg-fuchsia-50 text-slate-900 px-6 py-3 border-b border-fuchsia-200 space-y-1.5 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-[#be185d]">
            <span className="flex items-center space-x-2">
              <Zap className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
              <span className="font-sans">
                {progressStep < 40
                  ? 'Step 1/3: High-Speed Image OCR Parsing...'
                  : progressStep < 80
                  ? 'Step 2/3: Screening for AI Check & Telegram Scams...'
                  : 'Step 3/3: Generating Bar Chart & Pie Chart Data...'}
              </span>
            </span>
            <span className="text-[#be185d] font-mono">{progressStep}%</span>
          </div>
          <div className="w-full bg-fuchsia-200/80 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 via-rose-600 to-fuchsia-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressStep}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Main Form Body */}
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          {/* TAB 1: UPLOAD SCREENSHOT */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                  isDragging
                    ? 'border-[#be185d] bg-fuchsia-100/80 scale-[0.99]'
                    : selectedImage
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-fuchsia-300 hover:border-[#be185d] bg-fuchsia-50/40 hover:bg-fuchsia-100/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif, image/heic"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                {selectedImage ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative group max-w-md w-full rounded-xl overflow-hidden shadow-xl border border-emerald-400 bg-slate-900 max-h-64 flex justify-center items-center">
                      <img
                        src={selectedImage.dataUrl}
                        alt="Uploaded Job Screenshot"
                        className="object-contain max-h-60 w-auto"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white transition-colors"
                        title="Remove Image"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-emerald-800 font-semibold bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{selectedImage.name} ({selectedImage.sizeKB} KB) compressed & optimized for speed</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3 py-4">
                    <div className="p-4 rounded-full bg-fuchsia-100 text-[#be185d] group-hover:scale-110 transition-transform border border-fuchsia-200 shadow-xs">
                      <Upload className="w-8 h-8 text-[#be185d]" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900 font-sans">
                        Drop screenshot or image file here, or <span className="text-[#be185d] underline font-bold">browse</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Supports PNG, JPG, WEBP, WhatsApp screenshots, Telegram offers, recruitment emails
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Notes with Image */}
              <div>
                <label htmlFor="input-image-notes" className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Notes or Recruiter Email (Optional)
                </label>
                <input
                  id="input-image-notes"
                  type="text"
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="e.g. Sender emailed from recruiter@gmail.com asking to chat on Telegram @KellyHR"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-fuchsia-200 focus:outline-none focus:ring-2 focus:ring-[#be185d] bg-fuchsia-50/30 text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PASTE TEXT */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <label htmlFor="textarea-job-text" className="block text-xs font-bold text-slate-700">
                Paste Job Posting Description, Recruiter Email, or Chat Message
              </label>
              <textarea
                id="textarea-job-text"
                rows={6}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the full job offer email, LinkedIn message, or recruitment text here..."
                className="w-full px-4 py-3 text-sm rounded-xl border border-fuchsia-200 focus:outline-none focus:ring-2 focus:ring-[#be185d] bg-fuchsia-50/30 text-slate-900 placeholder-slate-400"
              />
            </div>
          )}

          {/* TAB 3: JOB URL */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="input-job-url" className="block text-xs font-bold text-slate-700 mb-1">
                  Job Posting URL / Link
                </label>
                <input
                  id="input-job-url"
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://example.com/careers/job-vacancy-123"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-fuchsia-200 focus:outline-none focus:ring-2 focus:ring-[#be185d] bg-fuchsia-50/30 text-slate-900 placeholder-slate-400"
                />
              </div>

              <div>
                <label htmlFor="textarea-url-notes" className="block text-xs font-bold text-slate-700 mb-1">
                  Context / Message Text (Optional)
                </label>
                <textarea
                  id="textarea-url-notes"
                  rows={3}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Any details on how you received this link or recruiter outreach..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-fuchsia-200 focus:outline-none focus:ring-2 focus:ring-[#be185d] bg-fuchsia-50/30 text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600 flex items-center space-x-1.5 font-medium">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Optimized high-speed OCR & analytics generation</span>
            </div>

            <button
              id="btn-submit-analyze"
              type="submit"
              disabled={isAnalyzing}
              className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-xl font-bold text-white text-base shadow-xl transition-all ${
                isAnalyzing
                  ? 'bg-fuchsia-300 cursor-not-allowed opacity-80'
                  : 'shimmer-button hover:shadow-fuchsia-300/80 active:scale-[0.98]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="font-sans">Extracting OCR & Generating Bar/Pie Charts...</span>
                </>
              ) : (
                <>
                  <FileSearch className="w-5 h-5 text-amber-300" />
                  <span className="font-sans tracking-wide">Run Gatekeeper Risk Scan</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* PRESET SAMPLE SCENARIOS */}
        <div className="mt-8 pt-6 border-t border-fuchsia-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#be185d] flex items-center space-x-1.5 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Or Try Sample Scam Screenshots Instantly:</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {samples.map((sample) => (
              <button
                id={`btn-sample-${sample.id}`}
                key={sample.id}
                onClick={() => onSelectSample(sample)}
                className="group text-left p-4 rounded-xl border border-fuchsia-200/80 hover:border-[#be185d] bg-fuchsia-50/50 hover:bg-fuchsia-100/80 transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      sample.riskLevel === 'CRITICAL' || sample.riskLevel === 'HIGH'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {sample.badge}
                  </span>
                  <span className="text-[11px] font-bold text-[#be185d] group-hover:text-rose-700 transition-colors">
                    Instant Demo →
                  </span>
                </div>
                <h4 className="mt-2 text-xs font-bold text-slate-900 group-hover:text-[#be185d] line-clamp-1 font-sans">
                  {sample.title}
                </h4>
                <p className="mt-1 text-[11px] text-slate-600 line-clamp-2 font-sans">
                  {sample.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
