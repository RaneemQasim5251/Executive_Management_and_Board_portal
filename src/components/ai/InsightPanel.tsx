import { useState } from 'react';
import { Card, Tabs, Button, message } from 'antd';
import { askAI } from '../../services/ai';

export function InsightPanel({ packId }: { packId: string }) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string>('');

  async function run(kind:'insight'|'minutes'){
    setLoading(true);
    try {
      const t = await askAI(kind, { packId });
      setText(t);
    } catch(e:any){ message.error(e.message); }
    setLoading(false);
  }

  return (
    <Card style={{height:'100%'}}>
      <Tabs
        items={[
          { key:'insight', label:'Insight Driver', children:(
            <>
              <Button type="primary" loading={loading} onClick={()=>run('insight')}>Summarise & flag risks</Button>
              <pre style={{whiteSpace:'pre-wrap', marginTop:12}}>{text}</pre>
            </>
          )},
          { key:'minutes', label:'Minute Writer', children:(
            <>
              <Button loading={loading} onClick={()=>run('minutes')}>Draft minutes</Button>
              <pre style={{whiteSpace:'pre-wrap', marginTop:12}}>{text}</pre>
            </>
          )}
        ]}
      />
    </Card>
  );
}
