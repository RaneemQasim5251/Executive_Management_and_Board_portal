import { Card, Statistic } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { computeAgendaStats, AgendaItem } from '../../services/agendaStats';
import { useTranslation } from 'react-i18next';
 
export function AgendaStats({ items }: { items: AgendaItem[] }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.toLowerCase().startsWith('ar');
  const stats = computeAgendaStats(items);

  const translateText = (text: string) => {
    if (!isArabic) return text;
    const map: Record<string, string> = {
      'Meeting length': 'مدة الاجتماع',
      'Stakeholder perspectives': 'وجهات نظر أصحاب المصلحة',
      'Six conversations': 'المحادثة',
      'mins': 'دقيقة',
      'Employee': 'الموظف',
      'Customer': 'العميل',
      'Supplier': 'المورد',
      'Shareholder': 'المساهم',
      'Community': 'المجتمع',
      'Environment': 'البيئة',
      'Steering': 'التوجيه',
      'Supervising': 'الإشراف',
      'Strategy': 'الإستراتيجية',
      'Performance': 'الأداء',
      'Governance': 'الحوكمة'
    };
    return map[text] || text;
  };

  // Translate the data for charts
  const translatedPerspective = stats.perspective.map(item => ({
    ...item,
    name: translateText(item.name)
  }));

  const translatedBuckets = stats.buckets.map(item => ({
    ...item,
    tag: translateText(item.tag)
  }));

  return (
    <div style={{display:'grid', gap:12}}>
      <Card>
        <Statistic 
          title={translateText('Meeting length')} 
          value={`${Math.round(stats.total)} ${isArabic ? 'دقيقة' : 'mins'}`} 
        />
      </Card>

      <Card title={translateText('Stakeholder perspectives')}>
        <div style={{height:220}}>
          <ResponsiveContainer>
            <BarChart data={translatedPerspective}>
              <XAxis dataKey="name" />
              <YAxis unit="%" domain={[0, 100]}/>
              <Tooltip />
              <Bar dataKey="pct">
                <LabelList dataKey="pct" position="top" formatter={(v:number)=>`${v}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title={translateText('Six conversations')}>
        <div style={{height:220}}>
          <ResponsiveContainer>
            <BarChart data={translatedBuckets}>
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
