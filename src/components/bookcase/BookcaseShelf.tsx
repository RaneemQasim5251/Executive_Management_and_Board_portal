import { Row, Col, Typography } from 'antd';
import { PackCard, PackCardModel } from './PackCard';

export function BookcaseShelf({ title, packs, onOpen, onTimeline }:{
  title: string; packs: PackCardModel[];
  onOpen:(id:string)=>void; onTimeline:(id:string)=>void;
}) {
  return (
    <div className="wood-shelf-wrap" style={{marginBottom:36, position:'relative'}}>
      <Row gutter={[16,16]} className="group" style={{paddingBottom:16}}>
        {packs.map(p=>(
          <Col key={p.id} xs={24} sm={12} md={8} lg={6} xl={4}>
            <div className="pack-card-spine">
              <PackCard pack={p} onOpen={onOpen} onTimeline={onTimeline}/>
            </div>
          </Col>
        ))}
      </Row>
      <div className="wood-shelf-bar">
        <div className="wood-grain"/>
        <div className="shelf-label">{title}</div>
      </div>
    </div>
  );
}
