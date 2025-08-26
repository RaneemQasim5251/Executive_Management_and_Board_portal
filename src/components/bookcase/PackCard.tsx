import { Card, Button, Space, Tag } from 'antd';
import { EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';

export type PackCardModel = {
  id: string;
  committeeName: string;
  monthLabel: string;  // e.g., "August"
  year: number;
  version: number;
  status: 'new'|'updated'|'draft'|'published';
  count?: number;
};

export function PackCard({ pack, onOpen, onTimeline }:{
  pack: PackCardModel;
  onOpen: (id:string)=>void;
  onTimeline:(id:string)=>void;
}) {
  const diagonalClass = pack.status === 'updated' ? 'updated' : (pack.status === 'new' ? 'new' : undefined);

  return (
    <Card hoverable className="relative rounded-2xl overflow-hidden pack-card-dark">
      {pack.count ? <div className="book-badge">{pack.count}</div> : null}
      {diagonalClass && (
        <>
          <div className={`book-diagonal ${diagonalClass}`}></div>
          <div className="book-diagonal-label">{diagonalClass.toUpperCase()}</div>
        </>
      )}
      <div style={{height:140, background:'linear-gradient(135deg,#0b1e6b,#172554)'}}/>
      <div style={{padding:12}}>
        <div style={{color:'#e5e7eb', fontSize:14, fontWeight:600}}>{pack.monthLabel} {pack.year}</div>
        <div style={{color:'#9ca3af', fontSize:12}}>{pack.committeeName}</div>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-2 bg-white/90 backdrop-blur hidden group-hover:flex justify-between"
           style={{display:'flex', alignItems:'center'}}>
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={()=>onOpen(pack.id)}>Open</Button>
          <Button size="small" icon={<ClockCircleOutlined />} onClick={()=>onTimeline(pack.id)}>Timeline</Button>
        </Space>
        <Tag color="gold">v{pack.version}</Tag>
      </div>
    </Card>
  );
}
