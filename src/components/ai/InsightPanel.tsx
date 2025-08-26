import { useState } from 'react';
import { Card, Tabs, Button, message, Space, Typography } from 'antd';
import { askAI } from '../../services/ai';
import ReactMarkdown from 'react-markdown';

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
              <Space>
                <Button type="primary" loading={loading} onClick={()=>run('insight')}>Summarise & flag risks</Button>
                <Button disabled={!text} onClick={() => navigator.clipboard.writeText(text)}>Copy</Button>
                <Button disabled={!text} onClick={() => downloadMd(text, `insights-${packId}.md`)}>Download</Button>
              </Space>
              <div style={{marginTop:12, minHeight:140, border:'1px solid rgba(2,6,23,.08)', borderRadius:8, padding:12}}>
                {text ? <ReactMarkdown>{text}</ReactMarkdown> : <Typography.Text type="secondary">No output yet.</Typography.Text>}
              </div>
            </>
          )},
          { key:'minutes', label:'Minute Writer', children:(
            <>
              <Space>
                <Button loading={loading} onClick={()=>run('minutes')}>Draft minutes</Button>
                <Button disabled={!text} onClick={() => navigator.clipboard.writeText(text)}>Copy</Button>
                <Button disabled={!text} onClick={() => downloadMd(text, `minutes-${packId}.md`)}>Download</Button>
              </Space>
              <div style={{marginTop:12, minHeight:140, border:'1px solid rgba(2,6,23,.08)', borderRadius:8, padding:12}}>
                {text ? <ReactMarkdown>{text}</ReactMarkdown> : <Typography.Text type="secondary">No draft yet.</Typography.Text>}
              </div>
            </>
          )}
        ]}
      />
    </Card>
  );
}

function downloadMd(md:string, filename:string){
  const blob = new Blob([md], {type:'text/markdown'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
