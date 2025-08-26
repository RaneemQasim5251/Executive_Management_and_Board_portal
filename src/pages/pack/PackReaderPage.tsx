import { Row, Col, Card, Typography } from 'antd';

export default function PackReaderPage() {
  return (
    <div style={{padding: 32}}>
      <Typography.Title level={2}>Pack Reader (Demo)</Typography.Title>
      <Row gutter={24}>
        <Col flex="0 0 220px">
          <Card title="Contents">
            <div>Section 1: Board Papers</div>
            <div>Section 2: Financials</div>
            <div>Section 3: Approvals</div>
          </Card>
        </Col>
        <Col flex="1 1 600px">
          <Card title="Document Viewer">
            <div style={{height:200,display:'flex',alignItems:'center',justifyContent:'center',color:'#888'}}>PDF/Office viewer placeholder</div>
          </Card>
        </Col>
        <Col flex="0 0 320px">
          <Card title="AI Sidekick">
            <div>Insight Driver: Key Points, Risks, Questions</div>
            <div>Minute Writer: Draft minutes from transcript</div>
            <div>Lucia Coach: Report checks</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
