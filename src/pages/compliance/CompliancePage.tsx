import { Card, Col, Row, Typography, Tag, List } from 'antd';
import { useTranslation } from 'react-i18next';

export default function CompliancePage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.toLowerCase().startsWith('ar');

  const translateText = (text: string) => {
    if (!isArabic) return text;
    const map: Record<string, string> = {
      'Security & Compliance': 'الأمان والامتثال',
      'Certifications & Standards': 'الشهادات والمعايير',
      'Data Residency & Sub-processors': 'إقامة البيانات والمقاولين من الباطن',
      'Encryption in transit (TLS 1.2+) & at rest (AES-256). UK/EU data protection compliant.': 'التشفير أثناء النقل (TLS 1.2+) وفي حالة الراحة (AES-256). متوافق مع حماية البيانات في المملكة المتحدة/الاتحاد الأوروبي.',
      'Supabase (Postgres + Storage) — encrypted at rest & in transit': 'Supabase (Postgres + التخزين) — مشفر في حالة الراحة وأثناء النقل',
      'OpenAI/Azure OpenAI — AI features': 'OpenAI/Azure OpenAI — ميزات الذكاء الاصطناعي',
      'DocuSign/Adobe — e-Signatures': 'DocuSign/Adobe — التوقيعات الإلكترونية',
      'Primary region: eu-west • Business continuity & DR tested.': 'المنطقة الأساسية: eu-west • تم اختبار استمرارية الأعمال والاسترداد من الكوارث.'
    };
    return map[text] || text;
  };

  return (
    <div className="bi-bg" style={{padding: 24}}>
      <Typography.Title level={2}>{translateText('Security & Compliance')}</Typography.Title>

      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Card title={translateText('Certifications & Standards')}>
            <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:12}}>
              <Tag color="gold">ISO 27001</Tag>
              <Tag color="blue">Cyber Essentials PLUS</Tag>
              <Tag color="green">GDPR</Tag>
              <Tag>ISO 9001</Tag>
            </div>
            <div>{translateText('Encryption in transit (TLS 1.2+) & at rest (AES-256). UK/EU data protection compliant.')}</div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title={translateText('Data Residency & Sub-processors')}>
            <List
              dataSource={[
                translateText('Supabase (Postgres + Storage) — encrypted at rest & in transit'),
                translateText('OpenAI/Azure OpenAI — AI features'),
                translateText('DocuSign/Adobe — e-Signatures')
              ]}
              renderItem={i => <List.Item>{i}</List.Item>}
            />
            <div style={{fontSize:12, color:'#64748B'}}>{translateText('Primary region: eu-west • Business continuity & DR tested.')}</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
