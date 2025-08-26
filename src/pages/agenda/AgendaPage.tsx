import { Row, Col, Card, Typography, Button } from 'antd';
import React, { useMemo, useState } from 'react';
import { AgendaGrid } from '../../components/agenda/AgendaGrid';
import { AgendaStats } from '../../components/agenda/AgendaStats';
import type { AgendaItem } from '../../services/agendaStats';

export default function AgendaPage() {
  const initial: AgendaItem[] = useMemo(()=>[
    { id:'a1', idx:1, title:'Welcome & Apologies', minutes:10, tag:'Governance' },
    { id:'a2', idx:2, title:'Strategy Update', minutes:30, tag:'Strategy', stakeholders:['Shareholder'] },
    { id:'a3', idx:3, title:'Performance Review', minutes:20, tag:'Performance', stakeholders:['Employee','Customer'] },
    { id:'a4', idx:4, title:'Governance', minutes:15, tag:'Governance', stakeholders:['Community'] },
  ],[]);
  const [items, setItems] = useState<AgendaItem[]>(initial);

  return (
    <div className="bi-bg" style={{padding: 24}}>
      <Typography.Title level={2}>Agenda Planner</Typography.Title>
      <Row gutter={24}>
        <Col flex="1 1 640px">
          <Card title="Agenda" extra={<Button type="primary">Save Agenda</Button>}>
            <AgendaGrid items={items} setItems={setItems}/>
          </Card>
        </Col>
        <Col flex="0 0 360px">
          <AgendaStats items={items}/>
        </Col>
      </Row>
    </div>
  );
}
