import { SampleJob } from '../types';

export const SAMPLE_JOBS: SampleJob[] = [
  {
    id: 'sample_1',
    title: 'Telegram High-Pay Data Entry Check Scam',
    badge: 'Check & Telegram Scam',
    riskLevel: 'CRITICAL',
    description: 'Screenshot of a text/email offering $48/hr remote data entry with interview via Telegram handle @HR_Kelly_Global and fake check equipment purchase.',
    fullText: `URGENT HIRING: Remote Data Entry & Administrative Assistant
Pay: $48.50/hour (Paid weekly via direct deposit or check)
Location: Work From Home (100% Remote)
Company: Global Healthcare Logistics Inc.

We reviewed your CV on LinkedIn/ZipRecruiter and selected you for an instant text interview.
To proceed with the interview immediately, message our HR Director Mrs. Kelly Rogers on Telegram app: @HR_Kelly_Global_Careers

Equipment Notice:
We will send you a certified company check for $2,850 to purchase your home office setup (Apple MacBook Pro 16", Dual Monitors, Ergonomic Desk) from our authorized vendor via Zelle or Wire Transfer.

No prior experience required. Apply now!`,
    analysis: {
      id: 'sample_1_analysis',
      timestamp: Date.now() - 3600000 * 2,
      jobTitle: 'Remote Data Entry & Administrative Assistant',
      companyName: 'Global Healthcare Logistics Inc. (Unverified / Impersonated)',
      extractedText: `URGENT HIRING: Remote Data Entry & Administrative Assistant\nPay: $48.50/hour (Paid weekly via direct deposit or check)\nLocation: Work From Home (100% Remote)\nCompany: Global Healthcare Logistics Inc.\n\nWe reviewed your CV on LinkedIn/ZipRecruiter and selected you for an instant text interview.\nTo proceed with the interview immediately, message our HR Director Mrs. Kelly Rogers on Telegram app: @HR_Kelly_Global_Careers\n\nEquipment Notice:\nWe will send you a certified company check for $2,850 to purchase your home office setup (Apple MacBook Pro 16", Dual Monitors, Ergonomic Desk) from our authorized vendor via Zelle or Wire Transfer.\n\nNo prior experience required. Apply now!`,
      overallRiskScore: 98,
      riskLevel: 'CRITICAL',
      verdictSummary: 'Definitive Fake Check & Telegram Recruitment Scam. Legitimate corporations never conduct text interviews over Telegram handles, nor do they send checks for candidates to buy equipment through specific vendor accounts via Zelle.',
      aiScamIndicators: [
        {
          category: 'Payment & Check Fraud',
          title: 'Fake Check Equipment Deposit Trap',
          description: 'The scammer offers to send a check to buy equipment from a "certified vendor" via Zelle/wire. The check will bounce after you transfer real funds to the scammer.',
          severity: 'CRITICAL',
          foundEvidence: 'We will send you a certified company check for $2,850 to purchase your home office setup... via Zelle',
        },
        {
          category: 'Communication Red Flag',
          title: 'Telegram Exclusive Interview',
          description: 'Reputable companies use verified domain email addresses, ATS portals (Workday, Greenhouse), or formal video calls (Teams, Zoom, Google Meet), never raw Telegram handles.',
          severity: 'HIGH',
          foundEvidence: 'message our HR Director Mrs. Kelly Rogers on Telegram app: @HR_Kelly_Global_Careers',
        },
        {
          category: 'Unrealistic Compensation',
          title: 'Inflated Pay for Zero Experience',
          description: '$48.50/hour ($100k+/year) for entry-level remote data entry requiring no prior experience is a textbook hook for employment fraud.',
          severity: 'HIGH',
          foundEvidence: 'Pay: $48.50/hour ... No prior experience required',
        },
        {
          category: 'AI Language Template',
          title: 'Generic Urgent Outreach Syntax',
          description: 'Uses standardized AI phishing prompt structures designed to induce FOMO and bypass critical evaluation.',
          severity: 'MEDIUM',
          foundEvidence: 'URGENT HIRING ... selected you for an instant text interview',
        },
      ],
      authenticityMarkers: [],
      scamTacticsDetected: [
        'Fake Check Bouncing Trap',
        'Telegram Contact Red Flag',
        'Zelle / Wire Transfer Request',
        'Inflated Unskilled Wage',
        'Generic Unsolicited Outreach',
      ],
      actionableSafetySteps: [
        {
          step: 'Do NOT accept or deposit any checks',
          details: 'If a check arrives, do not mobile-deposit it. Bank funds available early are legally recoverable once the check clears as fraudulent 3-10 days later.',
        },
        {
          step: 'Cease communication on Telegram',
          details: 'Block the handle immediately. Do not share SSN, banking info, or ID photos.',
        },
        {
          step: 'Report to FTC & IC3',
          details: 'File a report at ReportFraud.ftc.gov and IC3.gov to document recruitment fraud.',
        },
      ],
      companyVerificationGuide: {
        isRegisteredCompany: false,
        domainCheckNotes: 'The company name is generic and lacks official domain credentials or verified LinkedIn company page listing.',
        officialWebsiteTip: 'Search for "Global Healthcare Logistics Careers" directly on Google and verify if @HR_Kelly_Global_Careers appears on any corporate site.',
      },
      sourceType: 'sample',
    },
  },
  {
    id: 'sample_2',
    title: 'Crypto App Optimization Task Fraud',
    badge: 'Task Scam / USDT Pay',
    riskLevel: 'CRITICAL',
    description: 'WhatsApp message inviting user to perform 30-minute "App Benchmark Ratings" for $300 daily in USDT cryptocurrency.',
    fullText: `Hi dear! I am Sarah from Apex Tech Digital Talent.
We are looking for part-time Online App Optimization Operators.
Tasks: Simply review and submit 40 app ratings daily on our web workbench.
Time needed: 30-60 mins per day.
Salary: 100 - 300 USDT daily paid directly to your crypto wallet.

Requirement: Must have Telegram & Crypto Wallet (OKX / Binance) to deposit a 50 USDT refundable benchmark deposit to unlock Level 2 High Commission tasks.

Interested? Reply 1 to get started now!`,
    analysis: {
      id: 'sample_2_analysis',
      timestamp: Date.now() - 3600000 * 5,
      jobTitle: 'Online App Optimization Operator',
      companyName: 'Apex Tech Digital Talent (Fake Task Platform)',
      extractedText: `Hi dear! I am Sarah from Apex Tech Digital Talent.\nWe are looking for part-time Online App Optimization Operators.\nTasks: Simply review and submit 40 app ratings daily on our web workbench.\nTime needed: 30-60 mins per day.\nSalary: 100 - 300 USDT daily paid directly to your crypto wallet.\n\nRequirement: Must have Telegram & Crypto Wallet (OKX / Binance) to deposit a 50 USDT refundable benchmark deposit to unlock Level 2 High Commission tasks.\n\nInterested? Reply 1 to get started now!`,
      overallRiskScore: 99,
      riskLevel: 'CRITICAL',
      verdictSummary: 'Malicious Task / Pig-Butchering Style Crypto Scam. You will be asked to pay increasing crypto deposits to unlock "negative balance" commission tasks and will never be allowed to withdraw your funds.',
      aiScamIndicators: [
        {
          category: 'Crypto Task Scam',
          title: 'Pay-to-Work Deposit Mechanism',
          description: 'Requiring candidates to deposit cryptocurrency (USDT) to unlock tasks or withdraw earnings is 100% indicative of task fraud.',
          severity: 'CRITICAL',
          foundEvidence: 'deposit a 50 USDT refundable benchmark deposit to unlock Level 2 High Commission tasks',
        },
        {
          category: 'Suspicious Payment Method',
          title: 'Cryptocurrency Only Payout',
          description: 'Salaries offered strictly in USDT/Crypto via WhatsApp outreach lack tax reporting (W2/W9) and offer zero buyer protection or legal recourse.',
          severity: 'HIGH',
          foundEvidence: '100 - 300 USDT daily paid directly to your crypto wallet',
        },
        {
          category: 'Unrealistic Work-to-Pay Ratio',
          title: 'Absurd Hourly Yield',
          description: 'Earning $300 for 30 minutes of pressing rating buttons is an impossible economic model.',
          severity: 'HIGH',
          foundEvidence: '30-60 mins per day ... Salary: 100 - 300 USDT daily',
        },
      ],
      authenticityMarkers: [],
      scamTacticsDetected: [
        'Task Scam (App Rating Trap)',
        'Crypto USDT Deposit Demand',
        'WhatsApp Unsolicited Spam',
        'Fake Level Progression Trap',
      ],
      actionableSafetySteps: [
        {
          step: 'Never deposit crypto to work',
          details: 'A legitimate employer pays you for work; you never pay an employer to unlock tasks or complete benchmark tiers.',
        },
        {
          step: 'Block sender on WhatsApp',
          details: 'Do not respond with "1" as this confirms your phone number is active for secondary scam campaigns.',
        },
      ],
      companyVerificationGuide: {
        isRegisteredCompany: false,
        domainCheckNotes: 'No registered corporate entity or legitimate recruiter contacts candidates via informal WhatsApp greetings like "Hi dear!".',
        officialWebsiteTip: 'Always search for registered business filings in your state/country before engaging in remote work.',
      },
      sourceType: 'sample',
    },
  },
  {
    id: 'sample_3',
    title: 'Verified Software Engineer Posting (Safe Example)',
    badge: 'Legitimate / Safe (8%)',
    riskLevel: 'LOW',
    description: 'Corporate career portal screenshot for Senior Full Stack Engineer at Stripe with official domain, transparent requirements, and standard ATS process.',
    fullText: `Senior Full Stack Engineer - Developer Experience
Company: Stripe, Inc.
Location: San Francisco, CA or Remote (US/Canada)
Job ID: #ST-884122

About the role:
We are looking for a Senior Full Stack Engineer to build tools for developer platform SDKs.
Qualifications:
- 5+ years building backend microservices and modern React applications in TypeScript.
- Strong knowledge of API security, OAuth 2.0, and cloud infra (AWS/GCP).
- Experience leading architectural discussions and cross-functional project planning.

Hiring Process:
1. Application review via stripe.com/jobs
2. Recruiter phone screen (30 mins)
3. Technical deep dive & System Design interview via Google Meet
4. Virtual Onsite

Compensation & Benefits:
Base salary range: $185,000 - $230,000 USD + Equity + Comprehensive Health Insurance.
Stripe is an equal opportunity employer. Applications accepted solely through stripe.com/jobs.`,
    analysis: {
      id: 'sample_3_analysis',
      timestamp: Date.now() - 3600000 * 12,
      jobTitle: 'Senior Full Stack Engineer - Developer Experience',
      companyName: 'Stripe, Inc.',
      extractedText: `Senior Full Stack Engineer - Developer Experience\nCompany: Stripe, Inc.\nLocation: San Francisco, CA or Remote (US/Canada)\nJob ID: #ST-884122\n\nAbout the role:\nWe are looking for a Senior Full Stack Engineer to build tools for developer platform SDKs.\nQualifications:\n- 5+ years building backend microservices and modern React applications in TypeScript.\n- Strong knowledge of API security, OAuth 2.0, and cloud infra (AWS/GCP).\n- Experience leading architectural discussions and cross-functional project planning.\n\nHiring Process:\n1. Application review via stripe.com/jobs\n2. Recruiter phone screen (30 mins)\n3. Technical deep dive & System Design interview via Google Meet\n4. Virtual Onsite\n\nCompensation & Benefits:\nBase salary range: $185,000 - $230,000 USD + Equity + Comprehensive Health Insurance.\nStripe is an equal opportunity employer. Applications accepted solely through stripe.com/jobs.`,
      overallRiskScore: 8,
      riskLevel: 'LOW',
      verdictSummary: 'Low Risk / Highly Legitimate Posting. Displays transparent multi-stage technical hiring process, official careers portal URL (stripe.com), detailed technical requirements, and market-standard salary ranges.',
      aiScamIndicators: [],
      authenticityMarkers: [
        {
          title: 'Official Corporate Application Channel',
          description: 'Explicitly directs candidates to apply via stripe.com/jobs rather than third-party messaging apps.',
        },
        {
          title: 'Structured Multi-Stage Interview Process',
          description: 'Outlines standard technical screening, system design, and onsite stages with realistic timelines.',
        },
        {
          title: 'Realistic Qualification & Pay Standard',
          description: 'Salary range aligns accurately with US senior software engineering benchmarks and requires specific technical expertise.',
        },
      ],
      scamTacticsDetected: [],
      actionableSafetySteps: [
        {
          step: 'Verify URL domain in address bar',
          details: 'Always check that the address bar displays https://stripe.com before submitting sensitive personal resume details.',
        },
      ],
      companyVerificationGuide: {
        isRegisteredCompany: true,
        domainCheckNotes: 'Stripe, Inc. is a well-established fintech corporate entity. Official domain: stripe.com.',
        officialWebsiteTip: 'Search for Job ID #ST-884122 on stripe.com/jobs to confirm active opening.',
      },
      sourceType: 'sample',
    },
  },
];
