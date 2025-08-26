import { Card, Col, Row, Typography, Tag, List } from 'antd';

export default function CompliancePage() {
  return (
    <div className="bi-bg" style={{padding: 24}}>
      <Typography.Title level={2}>Security & Compliance</Typography.Title>

      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Card title="Certifications & Standards">
            <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:12}}>
              <Tag color="gold">ISO 27001</Tag>
              <Tag color="blue">Cyber Essentials PLUS</Tag>
              <Tag color="green">GDPR</Tag>
              <Tag>ISO 9001</Tag>
            </div>
            <div>Encryption in transit (TLS 1.2+) & at rest (AES-256). UK/EU data protection compliant.</div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Data Residency & Sub-processors">
            <List
              dataSource={[
                'Supabase (Postgres + Storage) — encrypted at rest & in transit',
                'OpenAI/Azure OpenAI — AI features',
                'DocuSign/Adobe — e-Signatures'
              ]}
              renderItem={i => <List.Item>{i}</List.Item>}
            />
            <div style={{fontSize:12, color:'#64748B'}}>Primary region: eu-west • Business continuity & DR tested.</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
