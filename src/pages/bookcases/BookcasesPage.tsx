import { useMemo, useState } from 'react';
import { Typography, Divider, Input, Button, message } from 'antd';
import { SearchOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookcaseShelf } from '../../components/bookcase/BookcaseShelf';

export default function BookcasesPage() {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const rtl = i18n.language === 'ar';
  const [query, setQuery] = useState('');

  const monthsEn = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const monthsAr = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const m = rtl ? monthsAr : monthsEn;

  const demo = (committee: string, year: number) => [
    { id:'p1', committeeName: rtl ? committee.replace('Board','المجلس') : committee, monthLabel: rtl ? m[7]  : 'August',   year, version:3, status:'new', unreadCount:81, hasMeetingLink:true },
    { id:'p2', committeeName: rtl ? committee.replace('Board','المجلس') : committee, monthLabel: rtl ? m[6]  : 'July',     year, version:2, status:'updated', unreadCount:12, hasRecording:true },
    { id:'p3', committeeName: rtl ? committee.replace('Board','المجلس') : committee, monthLabel: rtl ? m[5]  : 'June',     year, version:1, status:'draft' },
    { id:'p4', committeeName: rtl ? committee.replace('Board','المجلس') : committee, monthLabel: rtl ? m[4]  : 'May',      year, version:4, status:'published', locked:true },
    { id:'p5', committeeName: rtl ? committee.replace('Board','المجلس') : committee, monthLabel: rtl ? m[3]  : 'April',    year, version:5, status:'published' },
  ];

  const allShelves = useMemo(() => ({
    main: demo(rtl ? 'المجلس الرئيسي' : 'Main Board', 2025),
    exec: demo(rtl ? 'اللجنة التنفيذية' : 'Exec Committee', 2025),
    audit: demo(rtl ? 'لجنة المراجعة' : 'Audit Committee', 2025),
  }), [rtl]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allShelves;
    const filterPacks = (arr:any[]) => arr.filter(p => (
      `${p.monthLabel} ${p.committeeName}`.toLowerCase().includes(q)
    ));
    return {
      main: filterPacks(allShelves.main),
      exec: filterPacks(allShelves.exec),
      audit: filterPacks(allShelves.audit),
    };
  }, [query, allShelves]);

  const openPack = (id: string) => { navigate(`/pack/${id}`); };
  const openTimeline = (id: string) => { navigate(`/pack/${id}?tab=timeline`); };
  const openPlanner = () => { navigate('/agenda/1'); };
  const createAgenda = () => { message.success(rtl ? 'فتح مخطط الاجتماعات…' : 'Opening agenda planner…'); navigate('/agenda/1'); };

  return (
    <div className="bi-bg bookcase-container" style={{ padding: 24 }}>
      <Typography.Title level={3} style={{ marginTop: 8 }}>{rtl ? 'المكتبة' : 'Bookcase'}</Typography.Title>

      {/* Toolbar */}
      <div className={`shelf-toolbar${rtl ? ' rtl' : ''}`} style={{marginTop:8}}>
        <div className="toolbar-search">
          <div className="search-icon-box"><SearchOutlined /></div>
          <Input
            className="search-input"
            placeholder={rtl ? 'ابحث في الحِزَم' : 'Search packs'}
            allowClear
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
          />
        </div>
        <Button type="primary" icon={<CalendarOutlined />} onClick={createAgenda}>{rtl ? 'إنشاء أجندة' : 'Create agenda'}</Button>
      </div>

      {/* Planner tile */}
      <div className="planner-tile" style={{marginBottom:18}}>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <div style={{width:36, height:36, display:'grid', placeItems:'center', borderRadius:10, background:'#dfe7ff'}}>
            <CalendarOutlined />
          </div>
          <div>
            <div style={{fontWeight:800}}>{rtl ? 'عرض المخطط' : 'VIEW PLANNER'}</div>
            <div className="sub">{rtl ? 'لديك 3 أجندات غير منشورة' : 'You have 3 unpublished agendas'}</div>
          </div>
        </div>
        <Button type="default" onClick={openPlanner}>{rtl ? 'فتح' : 'Open'}</Button>
      </div>

      <Divider />

      <BookcaseShelf title={rtl ? 'المجلس الرئيسي' : 'MAIN BOARD'} packs={filtered.main} onOpen={openPack} onTimeline={openTimeline} rtl={rtl} />
      <BookcaseShelf title={rtl ? 'اللجنة التنفيذية' : 'EXEC COMMITTEE'} packs={filtered.exec} onOpen={openPack} onTimeline={openTimeline} rtl={rtl} />
      <BookcaseShelf title={rtl ? 'لجنة المراجعة' : 'AUDIT COMMITTEE'} packs={filtered.audit} onOpen={openPack} onTimeline={openTimeline} rtl={rtl} />
    </div>
  );
}
