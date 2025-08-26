import { Row, Col, Card, Typography, Progress } from 'antd';

export default function AgendaPage() {
  return (
    <div style={{padding: 32}}>
      <Typography.Title level={2}>Agenda Planner (Demo)</Typography.Title>
      <Row gutter={24}>
        <Col flex="1 1 600px">
          <Card title="Agenda Table">
            <div>1. Welcome & Apologies (10 min)</div>
            <div>2. Strategy Update (30 min)</div>
            <div>3. Performance Review (20 min)</div>
            <div>4. Governance (15 min)</div>
          </Card>
        </Col>
        <Col flex="0 0 320px">
          <Card title="Statistics">
            <div>Meeting Length: <b>75 min</b></div>
            <div>Strategy: <Progress percent={40} size="small" /></div>
            <div>Performance: <Progress percent={27} size="small" /></div>
            <div>Governance: <Progress percent={20} size="small" /></div>
            <div>Stakeholder: Employee 60%, Customer 20%, Shareholder 20%</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
