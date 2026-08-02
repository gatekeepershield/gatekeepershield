import React from 'react';
import { X, ShieldAlert, CreditCard, MessageSquare, Briefcase, Lock, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';

interface ScamKnowledgeBaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScamKnowledgeBase: React.FC<ScamKnowledgeBaseProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const SCAM_PATTERNS = [
    {
      title: '1. The Fake Check & Equipment Purchase Scam',
      icon: <CreditCard className="w-5 h-5 text-rose-600" />,
      tag: 'Most Frequent',
      description:
        'The scammer impersonates a recruiter and sends an email or text offer. They agree to "hire" you instantly and offer to send a mobile check to purchase office laptops/monitors from their "authorized vendor".',
      redFlags: [
        'Sending a check BEFORE you do any real work.',
        'Asking you to Zelle/Wire/Venmo money to a third-party supplier for equipment.',
        'The check clears initially in 1 day but bounces 5 days later, leaving you liable.',
      ],
    },
    {
      title: '2. Telegram / WhatsApp / Signal Interview Trap',
      icon: <MessageSquare className="w-5 h-5 text-purple-600" />,
      tag: 'High Risk',
      description:
        'Recruiters contacting you out of nowhere asking to transition immediately to messaging channels like Telegram handles (@HR_Recruiter_Job) or WhatsApp for text-only questionnaires.',
      redFlags: [
        'No video call or formal ATS application portal.',
        'HR reps using free @gmail.com or @outlook.com addresses.',
        'Instant job offer granted within 15 minutes of answering simple questionnaire.',
      ],
    },
    {
      title: '3. Task Optimization & Crypto Rating Scam',
      icon: <AlertOctagon className="w-5 h-5 text-amber-600" />,
      tag: 'Pig Butchering Hybrid',
      description:
        'Promises $200-$500/day for 30 minutes of pressing rating/benchmarking buttons for apps or products. Requires depositing cryptocurrency (USDT) to unlock task tiers or clear negative balances.',
      redFlags: [
        'Unusually high hourly pay for clicking simple buttons.',
        'Must deposit your own crypto/money to unlock "commission earnings".',
        'Withdrawal locks asking for "tax fees" when you attempt to retrieve money.',
      ],
    },
    {
      title: '4. Pay-for-Background-Check / Visa Fee Trap',
      icon: <Lock className="w-5 h-5 text-rose-600" />,
      tag: 'Upfront Fee Fraud',
      description:
        'Asks candidate to pay a $50-$150 "processing fee", "security badge fee", or "visa background check fee" via gift card or crypto before starting the job.',
      redFlags: [
        'Legitimate companies absorb background check costs and never request gift cards.',
        'High urgency: "Pay within 2 hours or job offer expires".',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-fuchsia-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#9d174d] via-[#a21caf] to-[#701a75] text-white flex items-center justify-between border-b border-fuchsia-300/30">
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className="w-6 h-6 text-amber-300" />
            <div>
              <h2 className="font-extrabold text-lg text-white font-serif-aesthetic">Anti-AI Job Scam Protection Field Guide</h2>
              <p className="text-xs text-fuchsia-100/90 font-sans">How to spot Generative AI recruitment fraud & fake vacancies</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-fuchsia-100 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start space-x-2.5">
            <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Golden Rule of Job Safety:</span> Legitimate employers pay YOU for your skills and work. A real company will NEVER ask you to pay money, buy gift cards, transfer crypto, or mobile-deposit a check to buy equipment from a specified vendor.
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#be185d] border-b border-fuchsia-100 pb-2 font-sans">
              Top 4 AI-Generated Job Scam Patterns
            </h3>

            {SCAM_PATTERNS.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-fuchsia-200 bg-fuchsia-50/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <h4 className="text-sm font-bold text-slate-900 font-sans">{item.title}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-900 border border-rose-300">
                    {item.tag}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3 font-sans">{item.description}</p>

                <div className="bg-white p-3 rounded-lg border border-fuchsia-100">
                  <div className="text-[11px] font-bold text-[#be185d] mb-1 font-sans">Key Red Flags to Look For:</div>
                  <ul className="space-y-1 text-xs text-slate-600 font-sans">
                    {item.redFlags.map((flag, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-1.5">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Golden Rules Checklist */}
          <div className="bg-gradient-to-r from-[#9d174d] via-[#a21caf] to-[#701a75] text-white p-5 rounded-xl space-y-2 shadow-lg">
            <h4 className="text-sm font-bold text-amber-300 flex items-center space-x-2 font-serif-aesthetic">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>3 Seconds Verification Checklist</span>
            </h4>
            <ul className="text-xs text-fuchsia-100 space-y-1.5 pt-1 font-sans">
              <li>1. <strong>Email Domain:</strong> Did the email come from @company.com or @gmail.com?</li>
              <li>2. <strong>Careers Site:</strong> Search for the exact Job ID on the official corporate website.</li>
              <li>3. <strong>Identity Check:</strong> Find the recruiter on LinkedIn and send a direct message confirming outreach.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-fuchsia-50/50 border-t border-fuchsia-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl shimmer-button text-white font-bold text-xs shadow-md transition-all"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
