export async function askAI(endpoint:'insight'|'minutes', payload:any): Promise<string> {
  // Try SSE first; fall back to JSON
  const resp = await fetch(`/api/ai/${endpoint}`, {
    method:'POST',
    headers:{'Content-Type':'application/json', 'Accept':'text/event-stream'},
    body: JSON.stringify(payload)
  });

  if (resp.headers.get('content-type')?.includes('text/event-stream')) {
    const reader = resp.body!.getReader();
    const dec = new TextDecoder();
    let out = '';
    // stream concatenation (Server sends "data: <chunk>\n\n")
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      out += dec.decode(value);
    }
    // strip "data:" markers
    return out.replace(/^data:\s?/gm,'').trim();
  }

  if (!resp.ok) throw new Error(await resp.text());
  const { text } = await resp.json();
  return text;
}
