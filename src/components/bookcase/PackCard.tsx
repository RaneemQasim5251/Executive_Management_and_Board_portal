// src/components/bookcase/PackCard.tsx
import { Button, Dropdown, MenuProps, Tooltip } from 'antd';
import {
  MoreOutlined, VideoCameraOutlined, PlayCircleOutlined, LockOutlined
} from '@ant-design/icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { PackCardModel } from './types';
import '../../styles/bookcase.css';

export function PackCard({
  pack, onOpen, onTimeline
}:{
  pack: PackCardModel;
  onOpen:(id:string)=>void;
  onTimeline:(id:string)=>void;
}) {
  const { t } = useTranslation();

  const menuItems = useMemo<MenuProps['items']>(()=>[
    { key:'get',    label:t('Get pack') },
    { key:'join',   label:t('Join meeting'), disabled:!pack.hasMeetingLink },
    { type:'divider' },
    { key:'edit',   label:t('Edit') },
    { key:'move',   label:t('Move') },
    { key:'clone',  label:t('Clone pack') },
    { key:'perm',   label:t('Permissions') },
    { key:'export', label:t('Export files') },
    { type:'divider' },
    { key:'timeline', label:t('Open timeline') },
    { key:'delete', label:t('Delete'), danger:true },
  ],[pack, t]);

  function onMenuClick({key}:{key:string}){
    if (key==='get') onOpen(pack.id);
    else if (key==='timeline') onTimeline(pack.id);
    // other actions are placeholders; wire as needed
  }

  const statusLabel =
    pack.status==='updated' ? t('UPDATED') :
    pack.status==='new'     ? t('NEW PACK') :
    pack.status==='meeting' ? t('MEETING SOON') : '';

  return (
    <div className="bi-pack" role="button" aria-label={`${pack.monthLabel} ${pack.committeeName}`} onDoubleClick={()=>onOpen(pack.id)}>
      {/* tiny feature icons */}
      <div className="bi-pack-icons">
        {pack.locked && (
          <Tooltip title={t('Restricted')}>
            <div className="bi-pack-icon"><LockOutlined /></div>
          </Tooltip>
        )}
        {pack.hasMeetingLink && (
          <Tooltip title={t('Meeting link available')}>
            <div className="bi-pack-icon"><VideoCameraOutlined /></div>
          </Tooltip>
        )}
        {pack.hasRecording && (
          <Tooltip title={t('Recording available')}>
            <div className="bi-pack-icon"><PlayCircleOutlined /></div>
          </Tooltip>
        )}
      </div>

      {/* title */}
      <div className="bi-pack-title">
        {pack.monthLabel} {pack.committeeName}
      </div>

      {/* unread bubble */}
      {!!pack.unread && <div className="bi-pack-badge">{pack.unread>99?'99+':pack.unread}</div>}

      {/* hover CTA */}
      <div className="bi-pack-cta">
        <Button block type="primary" onClick={()=>onOpen(pack.id)}>{t('Get pack')}</Button>
      </div>

      {/* status wedge */}
      {statusLabel && (
        <>
          <div className={`bi-pack-wedge ${pack.status}`}/>
          <div className="bi-pack-wedge-label">{statusLabel}</div>
        </>
      )}

      {/* 3-dots dropdown */}
      <Dropdown
        trigger={['click']}
        menu={{ items:menuItems, onClick:onMenuClick }}
        placement="bottomRight"
      >
        <div className="bi-pack-dots" aria-label={t('Open menu')}><MoreOutlined /></div>
      </Dropdown>
    </div>
  );
}
