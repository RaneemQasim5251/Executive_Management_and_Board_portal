// src/components/bookcase/PlannerCard.tsx
import { CalendarOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import '../../styles/bookcase.css';

export function PlannerCard({ onClick, unpublishedCount=0 }:{
  onClick:()=>void; unpublishedCount?:number;
}) {
  const { t } = useTranslation();
  return (
    <div className="bi-planner">
      <div>
        <CalendarOutlined style={{ fontSize:32 }} />
        <div style={{marginTop:8, fontWeight:800}}>{t('VIEW PLANNER')}</div>
        <div className="sub">
          {t('You have {{n}} unpublished agendas',{ n: unpublishedCount })}
        </div>
        <div className="btn">
          <Button size="small" onClick={onClick}>{t('Open')}</Button>
        </div>
      </div>
    </div>
  );
}
