export async function askAI(endpoint:'insight'|'minutes', payload:any): Promise<string> {
  const res = await fetch(`/api/ai/${endpoint}`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
  const { text } = await res.json();
  return text;
}
