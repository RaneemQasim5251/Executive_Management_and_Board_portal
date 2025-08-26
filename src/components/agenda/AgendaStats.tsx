import { Card, Statistic, Row, Col } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { computeAgendaStats, AgendaItem } from '../../services/agendaStats';

export function AgendaStats({ items }: { items: AgendaItem[] }) {
  const stats = computeAgendaStats(items);
  
  return (
    <div style={{display:'grid', gap:12}}>
      <Card>
        <Statistic title="Meeting length" value={`${Math.round(stats.total)} mins`} />
      </Card>

      <Card title="Stakeholder perspectives">
        <div style={{height:220}}>
          <ResponsiveContainer>
            <BarChart data={stats.perspective}>
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip />
              <Bar dataKey="pct" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Six conversations">
        <div style={{height:220}}>
          <ResponsiveContainer>
            <BarChart data={stats.buckets}>
              <XAxis dataKey="tag" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="minutes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
