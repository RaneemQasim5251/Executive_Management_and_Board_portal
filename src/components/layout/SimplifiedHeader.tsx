import React, { useState } from 'react';
import { Layout, Space, Avatar, Dropdown, Button, Typography, Badge, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  GlobalOutlined,
  AudioOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useLogout, useGetIdentity } from '@refinedev/core';

const { Header: AntdHeader } = Layout;
const { Text } = Typography;

interface SimplifiedHeaderProps {
  onOpenNotifications?: () => void;
  onOpenVoiceControl?: () => void;
  onOpenAI?: () => void;
  onOpenSettings?: () => void;
}

export const SimplifiedHeader: React.FC<SimplifiedHeaderProps> = ({
  onOpenNotifications,
  onOpenVoiceControl,
  onOpenAI,
  onOpenSettings,
}) => {
  const { mutate: logout } = useLogout();
  const { t, i18n } = useTranslation();
  const { data: user } = useGetIdentity<{
    id: string;
    name: string;
    email: string;
    avatar: string;
  }>();

  const toggleLanguage = () => {
    const newLng = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLng);
    localStorage.setItem('selectedLanguage', newLng);
    
    const isRTL = newLng === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = newLng;
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('Profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('Settings'),
      onClick: onOpenSettings,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('Sign Out'),
      onClick: () => logout(),
    },
  ];

  return (
    <AntdHeader
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        background: '#ffffff',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
        height: '72px',
      }}
    >
      {/* Left: Company Info */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px',
        flex: 1,
        minWidth: 0,
      }}>
        <img 
          src="/aljeri-logo.png" 
          alt="Al Jeri Logo" 
          style={{ 
            height: '36px', 
            width: 'auto',
            filter: 'drop-shadow(0 2px 4px rgba(12, 8, 92, 0.15))',
          }} 
        />
        <div style={{ minWidth: 0 }}>
          <Text strong style={{ 
            fontSize: '16px', 
            color: '#1f2937',
            display: 'block',
            lineHeight: 1.2,
            fontWeight: 700,
          }}>
            {t('Executive Portal')}
          </Text>
          <Text type="secondary" style={{ 
            fontSize: '12px',
            lineHeight: 1.2,
          }}>
            {t('Al Jeri Group')}
          </Text>
        </div>
      </div>

      {/* Right: Actions */}
      <Space size="large">
        {/* Notifications */}
        <Tooltip title={t('Notifications')}>
          <Badge count={3} size="small">
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined />}
              onClick={onOpenNotifications}
              style={{
                width: '40px',
                height: '40px',
                color: '#6b7280',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </Badge>
        </Tooltip>

        {/* Voice Control */}
        <Tooltip title={t('Voice Control')}>
          <Button
            type="text"
            shape="circle"
            icon={<AudioOutlined />}
            onClick={onOpenVoiceControl}
            style={{
              width: '40px',
              height: '40px',
              color: '#6b7280',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </Tooltip>

        {/* AI Assistant */}
        <Tooltip title={t('AI Assistant')}>
          <Button
            type="text"
            shape="circle"
            icon={<RobotOutlined />}
            onClick={onOpenAI}
            style={{
              width: '40px',
              height: '40px',
              color: '#6b7280',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </Tooltip>

        {/* Language Toggle */}
        <Tooltip title={t('Switch Language')}>
          <Button
            type="text"
            shape="circle"
            icon={<GlobalOutlined />}
            onClick={toggleLanguage}
            style={{
              width: '40px',
              height: '40px',
              color: '#6b7280',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </Tooltip>

        {/* User Profile */}
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement="bottomRight"
          arrow
        >
          <Button
            type="text"
            style={{
              height: '48px',
              padding: '0 12px',
              borderRadius: '12px',
              border: '1px solid transparent',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <Space align="center">
              <Avatar
                size={32}
                style={{
                  background: 'linear-gradient(135deg, #0C085C 0%, #363692 100%)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {user?.name?.[0] || 'E'}
              </Avatar>
              <div style={{ 
                textAlign: i18n.language === 'ar' ? 'right' : 'left',
                lineHeight: 1.3,
              }}>
                <Text strong style={{ 
                  fontSize: '14px', 
                  color: '#1f2937',
                  display: 'block',
                }}>
                  {user?.name || t('Executive')}
                </Text>
                <Text type="secondary" style={{ 
                  fontSize: '12px',
                  display: 'block',
                }}>
                  {user?.email || 'executive@aljeri.com'}
                </Text>
              </div>
            </Space>
          </Button>
        </Dropdown>
      </Space>
    </AntdHeader>
  );
};

export default SimplifiedHeader;
