import { useState } from 'react';
import { Card, Tabs, Button, message, Space, Typography } from 'antd';
import { askAI } from '../../services/ai';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';

export function InsightPanel({ packId }: { packId: string }) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.toLowerCase().startsWith('ar');
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string>('');

  const translateText = (text: string) => {
    if (!isArabic) return text;
    const map: Record<string, string> = {
      'Insight Driver': 'محرك الرؤى',
      'Minute Writer': 'كاتب المحاضر',
      'Summarise & flag risks': 'تلخيص وتحديد المخاطر',
      'Draft minutes': 'مسودة المحاضر',
      'Copy': 'نسخ',
      'Download': 'تحميل',
      'No output yet.': 'لا يوجد مخرجات بعد.',
      'No draft yet.': 'لا توجد مسودة بعد.'
    };
    return map[text] || text;
  };

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
          { key:'insight', label: translateText('Insight Driver'), children:(
            <>
              <Space>
                <Button type="primary" loading={loading} onClick={()=>run('insight')}>{translateText('Summarise & flag risks')}</Button>
                <Button disabled={!text} onClick={() => navigator.clipboard.writeText(text)}>{translateText('Copy')}</Button>
                <Button disabled={!text} onClick={() => downloadMd(text, `insights-${packId}.md`)}>{translateText('Download')}</Button>
              </Space>
              <div style={{marginTop:12, minHeight:140, border:'1px solid rgba(2,6,23,.08)', borderRadius:8, padding:12}}>
                {text ? <ReactMarkdown>{text}</ReactMarkdown> : <Typography.Text type="secondary">{translateText('No output yet.')}</Typography.Text>}
              </div>
            </>
          )},
          { key:'minutes', label: translateText('Minute Writer'), children:(
            <>
              <Space>
                <Button loading={loading} onClick={()=>run('minutes')}>{translateText('Draft minutes')}</Button>
                <Button disabled={!text} onClick={() => navigator.clipboard.writeText(text)}>{translateText('Copy')}</Button>
                <Button disabled={!text} onClick={() => downloadMd(text, `minutes-${packId}.md`)}>{translateText('Download')}</Button>
              </Space>
              <div style={{marginTop:12, minHeight:140, border:'1px solid rgba(2,6,23,.08)', borderRadius:8, padding:12}}>
                {text ? <ReactMarkdown>{text}</ReactMarkdown> : <Typography.Text type="secondary">{translateText('No draft yet.')}</Typography.Text>}
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
