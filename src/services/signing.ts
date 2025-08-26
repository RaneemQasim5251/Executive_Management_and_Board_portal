import { supabase } from './db';

export async function requestSignature(packId:string, docId:string, signerId:string){
  // native placeholder: insert sign_request; your Edge function / provider will update status
  const { error } = await supabase.from('sign_requests').insert({ pack_id:packId, doc_id:docId, signer_id: signerId, status:'requested' });
  if (error) throw error;
}

export async function listTimeline(packId:string){
  const [a1, a2] = await Promise.all([
    supabase.from('audit_logs').select('*').eq('subject_id', packId).order('at',{ascending:false}),
    supabase.from('sign_requests').select('*').eq('pack_id', packId).order('created_at',{ascending:false})
  ]);
  return { audit: a1.data||[], signs: a2.data||[] };
}
