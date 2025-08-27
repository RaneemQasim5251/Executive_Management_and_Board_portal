import React from 'react';
import { Dropdown, MenuProps, Tooltip, Button } from 'antd';
import { MoreOutlined, LockOutlined, VideoCameraOutlined, PlayCircleOutlined } from '@ant-design/icons';
import clsx from 'clsx';

export type PackCardStatus = 'new'|'updated'|'published'|'draft'|'meeting';
export interface PackCardModel {
  id: string;
  committeeName: string;
  monthLabel: string;
  year: number;
  version: number;
  status: PackCardStatus;
  unreadCount?: number;
  locked?: boolean;
  hasMeetingLink?: boolean;
  hasRecording?: boolean;
}

export function PackCard({
  pack,
  onOpen,
  onTimeline,
  rtl = false
}:{
  pack: PackCardModel;
  onOpen:(id:string)=>void;
  onTimeline?:(id:string)=>void;
  rtl?: boolean;
}) {
  const menu: MenuProps['items'] = [
    { key:'open', label: rtl ? 'فتح الحزمة' : 'Open pack', onClick: ()=>onOpen(pack.id) },
    { key:'timeline', label: rtl ? 'الخط الزمني' : 'Timeline', onClick: ()=>onTimeline?.(pack.id) },
    { key:'copy', label: rtl ? 'نسخ الرابط' : 'Copy link' },
    { key:'perm', label: rtl ? 'الأذونات' : 'Permissions' },
    { key:'export', label: rtl ? 'تصدير الملفات' : 'Export files' },
    { key:'delete', danger: true, label: rtl ? 'حذف' : 'Delete' },
  ];

  const ribbonLabel = rtl
    ? (pack.status==='new' ? 'حزمة جديدة' : pack.status==='updated' ? 'مُحدَّث' : pack.status==='draft' ? 'مسودة' : pack.status==='meeting' ? 'اجتماع قريب' : undefined)
    : (pack.status==='new' ? 'NEW PACK' : pack.status==='updated' ? 'UPDATED' : pack.status==='draft' ? 'DRAFT' : pack.status==='meeting' ? 'MEETING SOON' : undefined);

  function stop(e: React.SyntheticEvent) {
    e.stopPropagation();
    if ('preventDefault' in e) e.preventDefault();
  }

  return (
    <div
      className={clsx('book-card', rtl && 'rtl')}
      role="button"
      onClick={()=>onOpen(pack.id)}
      aria-label={`${pack.monthLabel} ${pack.year} — ${pack.committeeName}`}
      tabIndex={0}
      onKeyDown={(e)=>{ if(e.key==='Enter') onOpen(pack.id); }}
    >
      {/* Spine gleam */}
      <div className="book-spine" />
      {/* Top rounded bevel */}
      <div className="book-bevel" />

      {/* tiny feature icons (avoid overlap with badge) */}
      <div style={{ position:'absolute', [rtl ? 'right' : 'left']:12, top:10, display:'flex', gap:8, color:'#E2E8F0' }}>
        {pack.locked && (
          <Tooltip title={rtl ? 'مقيَّد' : 'Restricted'}><LockOutlined /></Tooltip>
        )}
        {pack.hasMeetingLink && (
          <Tooltip title={rtl ? 'رابط اجتماع متاح' : 'Meeting link available'}><VideoCameraOutlined /></Tooltip>
        )}
        {pack.hasRecording && (
          <Tooltip title={rtl ? 'تسجيل متاح' : 'Recording available'}><PlayCircleOutlined /></Tooltip>
        )}
      </div>

      {/* unread bubble */}
      {typeof pack.unreadCount === 'number' && pack.unreadCount>0 && (
        <div className="book-badge">{pack.unreadCount>99?'99+':pack.unreadCount}</div>
      )}

      {/* Ribbon */}
      {ribbonLabel && (
        <>
          <div className={clsx('book-ribbon', pack.status)} />
          <div className="book-ribbon-label">{ribbonLabel}</div>
        </>
      )}

      {/* Title */}
      <div className="book-title">
        <div className="book-title__main">{rtl ? `مجلس ${pack.monthLabel}` : `${pack.monthLabel} Board`}</div>
        <div className="book-title__sub">{pack.committeeName}</div>
      </div>

      {/* action menu (three dots) */}
      <Dropdown menu={{items:menu}} trigger={["click"]}>
        <button className="book-menu" aria-label={rtl ? 'افتح الإجراءات' : 'Open actions'} onClick={stop} onMouseDown={stop}>
          <MoreOutlined />
        </button>
      </Dropdown>

      {/* glossy highlight */}
      <div className="book-gloss" />
      {/* page edges */}
      <div className="book-pages" />

      {/* Hover CTA (Get pack) */}
      <div style={{ position:'absolute', insetInline:12, bottom:12, display:'none' }} className="book-cta">
        <Button block type="primary" size="small" onClick={(e)=>{ stop(e); onOpen(pack.id); }}>{rtl ? 'احصل على الحزمة' : 'Get pack'}</Button>
      </div>
    </div>
  );
}
