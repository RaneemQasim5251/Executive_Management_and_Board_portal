import type { Router } from 'express';
import fetch from 'node-fetch';

export default function aiRoutes(router: Router) {
  router.post('/ai/insight', async (req, res) => {
    const { packId } = req.body;
    // TODO: fetch pack text (join pack_documents & pull text/OCR); for now demo prompt
    const prompt = `You are an assistant for board packs. Summarize key points, risks with mitigations, and 5 critical questions for pack ${packId}. Return concise markdown.`;
    const text = await callOpenAI(prompt);
    res.json({ text });
  });

  router.post('/ai/minutes', async (req, res) => {
    const { packId } = req.body;
    const prompt = `Draft board meeting minutes for pack ${packId}. Sections: Attendees, Apologies, Matters Arising, Agenda Items with decisions, Actions with owner & due date. Use clear bullet points.`;
    const text = await callOpenAI(prompt);
    res.json({ text });
  });
}

async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY!;
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method:'POST',
    headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'},
    body: JSON.stringify({
      model: 'gpt-4o-mini', messages: [{role:'user', content: prompt}],
      temperature: 0.2
    })
  });
  const j = await r.json();
  return j.choices?.[0]?.message?.content || '';
}
