/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  SUKUNA_INITIAL_PROMPT,
  detectTechniqueInText,
  generateInCharacterResponse,
  calculateSukunaDisposition,
} from './src/utils/sukunaGameLogic.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI SDK if API key exists
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn('Could not initialize Gemini SDK with provided key:', err);
    }
  }

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      character: 'Ryomen Sukuna',
      hasApiKey: Boolean(apiKey),
    });
  });

  // Chat endpoint
  app.post('/api/chat', async (req, res) => {
    const { messages = [], action } = req.body;
    const lastUserMsg = messages.filter((m: { role: string; content: string }) => m.role === 'user').slice(-1)[0];
    const userPrompt = lastUserMsg?.content || action || 'Make your move, Sukuna.';

    let reply = '';
    let techniqueTriggered: 'dismantle' | 'cleave' | 'fuga' | 'domain' | 'black_flash' | 'simple_domain' | null = null;

    if (ai) {
      try {
        // Convert chat history to Gemini contents format
        const contents = messages.slice(-10).map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        // Ensure user message is at the end
        if (contents.length === 0 || contents[contents.length - 1].role !== 'user') {
          contents.push({ role: 'user', parts: [{ text: userPrompt }] });
        }

        const modelName = 'gemini-3.8-flash';
        
        // Timeout race to ensure zero hanging
        const apiPromise = ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: SUKUNA_INITIAL_PROMPT,
            temperature: 0.85,
            topP: 0.95,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 6500)
        );

        const response = await Promise.race([apiPromise, timeoutPromise]);
        reply = response.text || '';
      } catch (geminiError) {
        console.warn('Gemini API call timed out or failed, seamlessly using in-character fallback engine:', geminiError);
      }
    }

    // If Gemini was offline, throttled, or missing key, use high-fidelity fallback
    if (!reply.trim()) {
      const fallbackResult = generateInCharacterResponse(userPrompt, messages);
      reply = fallbackResult.reply;
      techniqueTriggered = fallbackResult.techniqueTriggered;
    } else {
      const detected = detectTechniqueInText(reply);
      techniqueTriggered = detected.technique;
    }

    const updatedStats = calculateSukunaDisposition([
      ...messages,
      { role: 'user', content: userPrompt },
      { role: 'assistant', content: reply },
    ]);

    res.json({
      success: true,
      reply,
      technique: techniqueTriggered,
      stats: updatedStats,
    });
  });

  // Specific Sukuna technique demonstration endpoint
  app.post('/api/technique', (req, res) => {
    const { technique } = req.body;
    let description = '';
    let sound = 'slash';

    switch (technique) {
      case 'dismantle':
        description = `*With an effortless flick of two fingers, an invisible wave of raw cutting cursed energy rends the air. A clean, silent slash shears through concrete and steel, separating matter at an atomic level.* "Dismantle (解). You didn't even notice the cut until the blood spilled."`;
        sound = 'slash';
        break;
      case 'cleave':
        description = `*Sukuna's predatory eyes flare crimson as he lays a hand upon your shoulder. His cursed energy instantly gauges your toughness, adjusting its cutting frequency to match your exact durability.* "Cleave (捌き). Tailored specifically to slice through every shred of your cursed defense."`;
        sound = 'slash';
        break;
      case 'fuga':
        description = `*Sukuna raises his arm, forming a bowstring gesture with his fingers. An incandescent flame of apocalyptic heat ignites at his fingertips, illuminating all of Shibuya in blood-red fire.* "■ Open (竈 - Fuga). Ash returns to ash. Perish."`;
        sound = 'flame';
        break;
      case 'domain':
        description = `*Crossing his thumbs and bending his fingers into the Enmaten mudra, Sukuna expands his barrierless domain across a 200-meter radius.* "Domain Expansion: Malevolent Shrine (伏魔御廚子). An open canvas painted in relentless, ceaseless slashes."`;
        sound = 'domain';
        break;
      default:
        description = `*Sukuna smirks, resting his cheek on his fist.* "Such insolence. Try harder."`;
        sound = 'slash';
    }

    res.json({
      technique,
      description,
      sound,
    });
  });

  // Serve app via Vite in development, static in production
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`King of Curses: Ryomen Sukuna server active on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
