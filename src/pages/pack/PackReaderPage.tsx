import { Row, Col, Card, Typography, Tree, Tabs } from 'antd';
import { InsightPanel } from '../../components/ai/InsightPanel';


export default function PackReaderPage() {
  const treeData = [
    { title:'1. Board Papers', key:'1', children:[
      { title:'1.1 CEO Report', key:'1-1' },
      { title:'1.2 Finance', key:'1-2' },
    ]},
    { title:'2. Financials', key:'2' },
    { title:'3. Approvals', key:'3' }
  ];
  return (
    <div style={{padding: 24}}>
      <Typography.Title level={2}>Pack Reader</Typography.Title>
      <Row gutter={24}>
        <Col flex="0 0 260px">
          <Card title="Contents">
            <Tree treeData={treeData} defaultExpandAll />
          </Card>
        </Col>
        <Col flex="1 1 640px">
          <Card title="Document Viewer">
            <div style={{height:420,display:'flex',alignItems:'center',justifyContent:'center',color:'#888'}}>PDF/Office viewer placeholder</div>
          </Card>
        </Col>
        <Col flex="0 0 380px">
          <Tabs items={[
            { key:'ai', label:'AI Sidekick', children:<InsightPanel packId="demo-pack-001"/> },
            { key:'notes', label:'Notes', children:<Card><div>Shared & private annotations (demo)</div></Card> }
          ]}/>
        </Col>
      </Row>
    </div>
  );
}
