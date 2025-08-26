import { Typography, Divider, Switch, Space, Input } from 'antd';
import { useState } from 'react';
import { BookcaseShelf } from '../../components/bookcase/BookcaseShelf';
import type { PackCardModel } from '../../components/bookcase/types';
import '../../styles/bookcase.css';

export default function BookcasesPage() {
  const [compact, setCompact] = useState(false);
  const [query, setQuery] = useState('');

  const demo = (committee:string, year:number): PackCardModel[] => [
    { id:'p1', committeeName:committee, monthLabel:'July',     year, version:3, status:'new',     unread:3, hasMeetingLink:true },
    { id:'p2', committeeName:committee, monthLabel:'June',     year, version:2, status:'updated', unread:81, hasRecording:true },
    { id:'p3', committeeName:committee, monthLabel:'May',      year, version:4, status:'meeting', unread:0, locked:true },
    { id:'p4', committeeName:committee, monthLabel:'April',    year, version:5, status:'published' },
    { id:'p5', committeeName:committee, monthLabel:'March',    year, version:1, status:'draft' },
  ];

  function openPack(id:string){ window.location.href = `/pack/${id}`; }
  function openTimeline(id:string){ window.location.href = `/pack/${id}?tab=timeline`; }

  const filter = (p:PackCardModel)=> `${p.monthLabel} ${p.committeeName}`.toLowerCase().includes(query.toLowerCase());

  return (
    <div className={`bi-bg ${compact ? 'bi-compact':''}`} style={{ padding:24 }}>
      <Typography.Title level={3} style={{ marginTop: 8 }}>Bookcase</Typography.Title>

      <Space size="middle" style={{ display:'flex', justifyContent:'space-between', margin: '8px 0 12px' }}>
        <Space>
          <Input.Search placeholder="Search packs…" allowClear onChange={(e)=>setQuery(e.target.value)} style={{ width: 340 }}/>
        </Space>
        <Space>
          <span>Show as compact</span>
          <Switch checked={compact} onChange={setCompact}/>
        </Space>
      </Space>
      <Divider/>

      <BookcaseShelf
        title="Main Board"
        packs={demo('Board', 2025).filter(filter)}
        onOpen={openPack}
        onTimeline={openTimeline}
        showPlanner
        plannerCount={3}
      />
      <BookcaseShelf
        title="Exec Committee"
        packs={demo('ExCo', 2025).filter(filter)}
        onOpen={openPack}
        onTimeline={openTimeline}
        showPlanner
      />
      <BookcaseShelf
        title="Audit Committee"
        packs={demo('Audit', 2025).filter(filter)}
        onOpen={openPack}
        onTimeline={openTimeline}
        showPlanner
      />
    </div>
  );
}
