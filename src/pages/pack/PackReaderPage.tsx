import { Row, Col, Card, Typography, Tree, Tabs } from 'antd';
import { InsightPanel } from '../../components/ai/InsightPanel';
import { useTranslation } from 'react-i18next';

export default function PackReaderPage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.toLowerCase().startsWith('ar');

  const translateText = (text: string) => {
    if (!isArabic) return text;
    const map: Record<string, string> = {
      'Pack Reader': 'قارئ الحزم',
      'Contents': 'المحتويات',
      'Document Viewer': 'عارض المستندات',
      'AI Sidekick': 'المساعد الذكي',
      'Notes': 'الملاحظات',
      'Board Papers': 'أوراق المجلس',
      'CEO Report': 'تقرير الرئيس التنفيذي',
      'Finance': 'المالية',
      'Financials': 'البيانات المالية',
      'Approvals': 'الموافقات',
      'PDF/Office viewer placeholder': 'مكان عرض ملفات PDF/Office',
      'Shared & private annotations (demo)': 'تعليقات مشتركة وخاصة (تجريبي)'
    };
    return map[text] || text;
  };

  const treeData = [
    { title: isArabic ? '1. أوراق المجلس' : '1. Board Papers', key:'1', children:[
      { title: isArabic ? '1.1 تقرير الرئيس التنفيذي' : '1.1 CEO Report', key:'1-1' },
      { title: isArabic ? '1.2 المالية' : '1.2 Finance', key:'1-2' },
    ]},
    { title: isArabic ? '2. البيانات المالية' : '2. Financials', key:'2' },
    { title: isArabic ? '3. الموافقات' : '3. Approvals', key:'3' }
  ];

  return (
    <div style={{padding: 24}}>
      <Typography.Title level={2}>{translateText('Pack Reader')}</Typography.Title>
      <Row gutter={24}>
        <Col flex="0 0 260px">
          <Card title={translateText('Contents')}>
            <Tree treeData={treeData} defaultExpandAll />
          </Card>
        </Col>
        <Col flex="1 1 640px">
          <Card title={translateText('Document Viewer')}>
            <div style={{height:420,display:'flex',alignItems:'center',justifyContent:'center',color:'#888'}}>
              {translateText('PDF/Office viewer placeholder')}
            </div>
          </Card>
        </Col>
        <Col flex="0 0 380px">
          <Tabs items={[
            { key:'ai', label: translateText('AI Sidekick'), children:<InsightPanel packId="demo-pack-001"/> },
            { key:'notes', label: translateText('Notes'), children:<Card><div>{translateText('Shared & private annotations (demo)')}</div></Card> }
          ]}/>
        </Col>
      </Row>
    </div>
  );
}
