import { Card, Col, Row, Typography, Tag } from 'antd';

export default function CompliancePage() {
  return (
    <div style={{padding: 32}}>
      <Typography.Title level={2}>Security & Compliance (Demo)</Typography.Title>
      <Row gutter={24}>
        <Col span={12}>
          <Card title="Certifications">
            <Tag color="gold">ISO 27001</Tag>
            <Tag color="blue">Cyber Essentials</Tag>
            <Tag color="green">GDPR</Tag>
            <div>Compliant — UK/EU data protection</div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Data Residency & Sub-processors">
            <div>Primary region: eu-west</div>
            <ul>
              <li>Supabase (Postgres + Storage) — encrypted at rest & in transit</li>
              <li>OpenAI/Azure for AI features</li>
              <li>DocuSign/Adobe for e-signatures</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
