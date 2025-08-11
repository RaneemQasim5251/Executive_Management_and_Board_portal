import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Avatar, Typography, Badge, Button } from 'antd';
import type { MenuProps } from 'antd';
import {
  HomeOutlined, DashboardOutlined,
  LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  SearchOutlined, ProjectOutlined, TeamOutlined,
  FileTextOutlined, CalendarOutlined, BarChartOutlined, GlobalOutlined,
  BankOutlined, CarOutlined, RocketOutlined, ExperimentOutlined,
  SafetyOutlined, ToolOutlined, TrophyOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { ColorModeContext } from '../../contexts/color-mode';

const { Sider } = Layout;
const { Text, Title } = Typography;

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onCollapse }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = useContext(ColorModeContext);
  
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const pathname = location.pathname;
    const currentKey = pathname.split('/').filter(Boolean)[0] || 'home';
    setSelectedKeys([currentKey]);
  }, [location.pathname]);

  const menuItems: MenuProps['items'] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: t('Executive Overview'),
      onClick: () => navigate('/')
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: t('Executive Board'),
      onClick: () => navigate('/executive-board')
    },
    {
      key: 'executive-board',
      icon: <TrophyOutlined />,
      label: t('Executive Board'),
      onClick: () => navigate('/executive-board')
    },
    {
      key: 'enterprise-systems',
      icon: <BankOutlined />,
      label: t('Enterprise Systems'),
      children: [
        {
          key: 'kpi-erp',
          icon: <BarChartOutlined />,
          label: t('KPIs → ERP'),
          onClick: () => navigate('/systems/kpi-erp')
        }
      ]
    },
    {
      key: 'companies',
      icon: <TeamOutlined />,
      label: t('Investment Portfolio'),
      children: [
        {
          key: 'jtc',
          icon: <CarOutlined />,
          label: t('JTC Transport & Logistics'),
          onClick: () => navigate('/companies/jtc')
        },
        {
          key: 'energy',
          icon: <RocketOutlined />,
          label: t('Al Jeri Energy'),
          onClick: () => navigate('/companies/energy')
        },
        {
          key: 'joil',
          icon: <ExperimentOutlined />,
          label: t('J:Oil Petroleum'),
          onClick: () => navigate('/companies/joil')
        },
        {
          key: '45degrees',
          icon: <GlobalOutlined />,
          label: t('45degrees Cafe'),
          onClick: () => navigate('/companies/45degrees')
        },
        {
          key: 'shaheen',
          icon: <SafetyOutlined />,
          label: t('Shaheen Rent a Car'),
          onClick: () => navigate('/companies/shaheen')
        }
      ]
    },
    {
      key: 'secretary-workspace',
      icon: <FileTextOutlined />,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{t('Executive-Secretary Workspace')}</span>
          <Badge count="3" size="small" style={{ backgroundColor: '#0C085C' }} />
        </div>
      ),
      onClick: () => navigate('/secretary')
    },
    {
      key: 'strategic-planning',
      icon: <ProjectOutlined />,
      label: t('Strategic Planning'),
      onClick: () => navigate('/board/strategic-planning')
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: t('Reports & Analytics'),
      onClick: () => navigate('/reports')
    },
    {
      key: 'board',
      icon: <ToolOutlined />,
      label: t('Board Management'),
      onClick: () => navigate('/board')
    },
    {
      key: 'timeline',
      icon: <CalendarOutlined />,
      label: t('Strategic Timeline'),
      onClick: () => navigate('/timeline')
    },
    {
      key: 'meetings',
      icon: <TeamOutlined />,
      label: t('myMeetings.title'),
      onClick: () => navigate('/my-meetings')
    }
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key, keyPath }) => {
    setSelectedKeys([key]);
    if (keyPath.length > 1) {
      setExpandedKeys(prev => {
        const parentKey = keyPath[keyPath.length - 2];
        return prev.includes(parentKey) ? prev : [...prev, parentKey];
      });
    }
  };

  const toggleCollapsed = () => {
    onCollapse?.(!collapsed);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed && !isHovered}
      width={280}
      collapsedWidth={80}
      style={{
        background: mode === 'dark' ? '#1f2937' : '#ffffff',
        borderRight: `1px solid ${mode === 'dark' ? '#374151' : '#e5e7eb'}`,
        transition: 'all 0.3s ease',
        overflow: 'auto',
        height: '100vh',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Section */}
      <div style={{ 
        padding: '16px', 
        borderBottom: `1px solid ${mode === 'dark' ? '#374151' : '#e5e7eb'}`,
        textAlign: collapsed && !isHovered ? 'center' : 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/aljeri-logo.png"
            alt="Al Jeri Logo"
            style={{
              width: collapsed && !isHovered ? '32px' : '40px',
              height: 'auto',
              filter: 'drop-shadow(0 2px 4px rgba(12, 8, 92, 0.15))'
            }}
          />
          {(!collapsed || isHovered) && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <Title level={5} style={{ margin: 0, color: '#0C085C', fontSize: '14px', fontWeight: 700 }}>
                {i18n.language === 'ar' ? 'منصَّة مجلس الإدارة' : 'Executive Board'}
              </Title>
              <Text type="secondary" style={{ fontSize: '10px' }}>
                {i18n.language === 'ar' ? 'مركز القيادة التنفيذية' : 'Management Platform'}
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Search Section */}
      {(!collapsed || isHovered) && (
        <div style={{ padding: '16px', borderBottom: `1px solid ${mode === 'dark' ? '#374151' : '#e5e7eb'}` }}>
          <div style={{ position: 'relative' }}>
            <SearchOutlined style={{ position: 'absolute', [i18n.language === 'ar' ? 'right' : 'left']: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder={t('Search...')}
              style={{
                width: '100%',
                padding: i18n.language === 'ar' ? '8px 36px 8px 12px' : '8px 12px 8px 36px',
                border: `1px solid ${mode === 'dark' ? '#374151' : '#d1d5db'}`,
                borderRadius: '8px',
                background: mode === 'dark' ? '#374151' : '#f9fafb',
                color: mode === 'dark' ? '#f9fafb' : '#1f2937',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      )}

      {/* Menu Section */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={expandedKeys}
          items={menuItems}
          onClick={handleMenuClick}
          onOpenChange={setExpandedKeys}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '14px'
          }}
          theme={mode as 'light' | 'dark'}
        />
      </div>

      {/* User Profile Section */}
      <div style={{ 
        padding: '16px', 
        borderTop: `1px solid ${mode === 'dark' ? '#374151' : '#e5e7eb'}`,
        background: mode === 'dark' ? '#111827' : '#f9fafb'
      }}>
        {(!collapsed || isHovered) ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar size={40} style={{ background: '#0C085C', color: 'white', fontSize: '16px' }}>
              JD
            </Avatar>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text strong style={{ fontSize: '14px', color: mode === 'dark' ? '#f9fafb' : '#1f2937' }}>
                {t('Executive')}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                executive@aljeri.com
              </Text>
            </div>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              size="small"
              onClick={() => console.log('Logout')}
              style={{ color: '#6b7280' }}
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <Avatar size={32} style={{ background: '#0C085C', color: 'white', fontSize: '14px' }}>
              JD
            </Avatar>
          </div>
        )}
      </div>

      {/* Collapse Toggle Button */}
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleCollapsed}
        style={{
          position: 'absolute',
          top: '50%',
          right: collapsed ? '-12px' : '-16px',
          transform: 'translateY(-50%)',
          background: mode === 'dark' ? '#1f2937' : '#ffffff',
          border: `1px solid ${mode === 'dark' ? '#374151' : '#e5e7eb'}`,
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 1001
        }}
      />
    </Sider>
  );
};
