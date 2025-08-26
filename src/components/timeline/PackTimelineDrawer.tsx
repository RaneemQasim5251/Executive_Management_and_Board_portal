import { Drawer, List, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { listTimeline } from '../../services/signing';

export function PackTimelineDrawer({ packId, open, onClose }:{
  packId:string; open:boolean; onClose:()=>void;
}) {
  const [items, setItems] = useState<any[]>([]);
  
  useEffect(()=>{
    if (open) load();
    async function load(){
      const { audit, signs } = await listTimeline(packId);
      const merged = [
        ...audit.map((a:any)=>({ type:'audit', at:a.at, label:a.action, meta:a.meta })),
        ...signs.map((s:any)=>({ type:'sign', at:s.created_at, label:`Sign ${s.status}`, meta:{ signer:s.signer_id, doc:s.doc_id }}))
      ].sort((a,b)=>+new Date(b.at)-+new Date(a.at));
      setItems(merged);
    }
  },[open, packId]);

  return (
    <Drawer title="Timeline" open={open} onClose={onClose} width={420}>
      <List dataSource={items} renderItem={(it:any)=>(
        <List.Item>
          <List.Item.Meta
            title={<>{new Date(it.at).toLocaleString()} {it.type==='sign' && <Tag color="blue">signature</Tag>}</>}
            description={<pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(it.meta,null,2)}</pre>}
          />
        </List.Item>
      )}/>
    </Drawer>
  );
}
