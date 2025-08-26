import type { Router } from 'express';
import fetch from 'node-fetch';

export default function aiRoutes(router: Router) {
  router.post('/ai/insight', async (req, res) => {
    const { packId } = req.body;
    const system = [
      "You are an analyst for board packs.",
      "Return concise, board-ready markdown.",
      "Sections: Key Points, Risks & Mitigations, 5 Critical Questions."
    ].join(' ');
    const user = `Summarize the board pack ${packId}. If no text provided, return a realistic demo output.`;

    return streamOpenAI(res, system, user);
  });

  router.post('/ai/minutes', async (req, res) => {
    const { packId } = req.body;
    const system = [
      "You are a professional minute taker.",
      "Return clean markdown with headings and bullet points.",
      "Preserve action owner and due date in a table."
    ].join(' ');
    const user = `Draft board meeting minutes for pack ${packId}.
Sections: Attendees, Apologies, Matters Arising, Agenda Items (discussion + decision), Actions (owner, due).
If transcript not provided, produce a believable demo.`;

    return streamOpenAI(res, system, user);
  });
}

async function streamOpenAI(res:any, system:string, user:string) {
  const apiKey = process.env.OPENAI_API_KEY!;
  const useSSE = (String(res.req.headers.accept||'').includes('text/event-stream'));

  const body = {
    model: 'gpt-4o-mini',
    temperature: 0.2,
    messages: [
      { role:'system', content: system },
      { role:'user', content: user }
    ],
    stream: useSSE
  };

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method:'POST',
    headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });

  if (!useSSE) {
    const j = await r.json();
    const text = j.choices?.[0]?.message?.content || '';
    return res.json({ text });
  }

  res.status(200);
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  // Proxy OpenAI stream
  for await (const chunk of r.body as any) {
    res.write(chunk); // already "data: ..." lines
  }
  res.end();
}
