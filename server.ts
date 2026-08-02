import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Gatekeeper Shield Anti-Scam OCR Engine' });
});

app.post('/api/analyze-job', async (req, res) => {
  try {
    const { image, mimeType = 'image/png', jobText = '', jobUrl = '' } = req.body;

    if (!image && !jobText) {
      return res.status(400).json({
        error: 'Please upload an image/screenshot or paste job description text.',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is missing on the server. Please check your secrets configuration.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const parts: any[] = [];

    if (image) {
      // Strip data URL prefix if present (e.g., data:image/png;base64,...)
      let base64Data = image;
      if (image.includes('base64,')) {
        base64Data = image.split('base64,')[1];
      }

      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/png',
          data: base64Data,
        },
      });
    }

    let promptText = `You are Gatekeeper Shield, an elite anti-AI scam protector & recruitment fraud specialist.
Your task:
1. OCR & Text Extraction: Extract EVERY word of text visible in the attached screenshot/image or document.
2. Scam & Fraud Analysis: Examine the extracted text and any user note below for signs of AI-generated job scams, fake recruitment, check-clearing equipment scams, Telegram/WhatsApp interview traps, task scams, wire transfer fraud, unrealistic salaries, suspicious email domains (@gmail/@hotmail impersonation), grammatical errors typical of LLM translation scams, or pressure tactics.
3. Determine a numerical Risk Score between 0 (completely legitimate and verified) and 100 (definitive scam/fraud).
4. Assign Risk Level:
   - LOW (0-25%): standard job posting, official credentials, reasonable process
   - MEDIUM (26-55%): minor red flags or ambiguous contact info, caution advised
   - HIGH (56-85%): strong scam indicators, suspicious communication or payment request
   - CRITICAL (86-100%): unambiguous active scam, check deposit / wire transfer / paid equipment or task scam
5. Provide detailed breakdown of scam indicators, legitimate markers, scam tactics, and actionable safety steps for the job seeker.`;

    if (jobText) {
      promptText += `\n\nUser-provided Text / Notes:\n"""\n${jobText}\n"""`;
    }
    if (jobUrl) {
      promptText += `\n\nUser-provided Job URL / Link:\n${jobUrl}`;
    }

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: { parts },
      config: {
        systemInstruction:
          'You are an expert AI security analyst focused on protecting job seekers from recruitment scams, AI-generated phish, and employment fraud. Be thorough, precise, objective, and provide clear evidence quotes.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedText: {
              type: Type.STRING,
              description: 'Full text extracted via OCR from the screenshot or image, or the provided text.',
            },
            jobTitle: {
              type: Type.STRING,
              description: 'Job title detected or inferenced.',
            },
            companyName: {
              type: Type.STRING,
              description: 'Company name associated with the job posting.',
            },
            overallRiskScore: {
              type: Type.INTEGER,
              description: 'Risk score from 0 (completely safe) to 100 (definite fraud/scam).',
            },
            riskLevel: {
              type: Type.STRING,
              description: 'LOW, MEDIUM, HIGH, or CRITICAL',
            },
            verdictSummary: {
              type: Type.STRING,
              description: 'Concise summary of the analysis verdict.',
            },
            aiScamIndicators: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  foundEvidence: { type: Type.STRING },
                },
                required: ['category', 'title', 'description', 'severity'],
              },
            },
            authenticityMarkers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['title', 'description'],
              },
            },
            scamTacticsDetected: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            actionableSafetySteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.STRING },
                  details: { type: Type.STRING },
                },
                required: ['step', 'details'],
              },
            },
            companyVerificationGuide: {
              type: Type.OBJECT,
              properties: {
                isRegisteredCompany: { type: Type.BOOLEAN },
                domainCheckNotes: { type: Type.STRING },
                officialWebsiteTip: { type: Type.STRING },
              },
              required: ['domainCheckNotes', 'officialWebsiteTip'],
            },
          },
          required: [
            'extractedText',
            'jobTitle',
            'companyName',
            'overallRiskScore',
            'riskLevel',
            'verdictSummary',
            'aiScamIndicators',
            'authenticityMarkers',
            'scamTacticsDetected',
            'actionableSafetySteps',
            'companyVerificationGuide',
          ],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('No analysis text returned from Gemini model.');
    }

    const parsedData = JSON.parse(responseText);

    const result = {
      id: 'analysis_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
      jobTitle: parsedData.jobTitle || 'Unspecified Position',
      companyName: parsedData.companyName || 'Unspecified Organization',
      extractedText: parsedData.extractedText || jobText || 'No text extracted.',
      overallRiskScore: Math.min(100, Math.max(0, Number(parsedData.overallRiskScore) || 0)),
      riskLevel: parsedData.riskLevel || 'MEDIUM',
      verdictSummary: parsedData.verdictSummary || 'Analysis complete.',
      aiScamIndicators: parsedData.aiScamIndicators || [],
      authenticityMarkers: parsedData.authenticityMarkers || [],
      scamTacticsDetected: parsedData.scamTacticsDetected || [],
      actionableSafetySteps: parsedData.actionableSafetySteps || [],
      companyVerificationGuide: parsedData.companyVerificationGuide || {
        domainCheckNotes: 'Verify official corporate domain.',
        officialWebsiteTip: 'Look for job ID on company official careers portal.',
      },
      sourceType: image ? 'image' : 'text',
    };

    return res.json(result);
  } catch (err: any) {
    console.error('Error analyzing job vacancy:', err);
    return res.status(500).json({
      error: err.message || 'Failed to complete job vacancy analysis.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gatekeeper Shield server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
