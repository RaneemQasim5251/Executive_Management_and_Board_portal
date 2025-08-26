import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Avatar, Typography, Badge, Button } from 'antd';
import { SIDEBAR_EXPANDED_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from './constants';
import {
  HomeOutlined, DashboardOutlined,
  LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  SearchOutlined, ProjectOutlined, TeamOutlined,
  FileTextOutlined, CalendarOutlined, BarChartOutlined, GlobalOutlined,
  CarOutlined, RocketOutlined, ExperimentOutlined,
  SafetyOutlined, ToolOutlined, TrophyOutlined, SettingOutlined, DatabaseOutlined, LineChartOutlined,
  BookOutlined, ScheduleOutlined, ReadOutlined
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

// Extend AntD Menu item type to allow 'path' property
interface MenuItemType {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  onClick?: () => void;
  path?: string;
  children?: MenuItemType[];
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onCollapse }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = useContext(ColorModeContext);
  
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  // Hover expansion removed to prevent overlaying content; use explicit collapse toggle only

  // Helper: Find the best matching menu item trail for a given path
  function findTrail(items: MenuItemType[], path: string, trail: string[] = []): string[] {
    for (const it of items) {
      const key = String(it.key);
      const itemPath = it.path;
      const children = it.children;
      // Support dynamic segments
      if (itemPath && matchPath(itemPath, path)) return [...trail, key];
      if (children) {
        const found = findTrail(children, path, [...trail, key]);
        if (found.length) return found;
      }
    }
    return [];
  }
  // Simple path matcher supporting dynamic segments like /agenda/:meetingId
  function matchPath(pattern: string, pathname: string): boolean {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = pathname.split('/').filter(Boolean);
    if (patternParts.length !== pathParts.length) return false;
    return patternParts.every((part, i) => part.startsWith(':') || part === pathParts[i]);
  }

  useEffect(() => {
    const trail = findTrail(menuItems, location.pathname);
    setSelectedKeys(trail.slice(-1));
    setExpandedKeys(trail.slice(0, -1));
  }, [location.pathname]);

  const menuItems: MenuItemType[] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: t('Executive Overview'),
      onClick: () => navigate('/'),
      path: '/',
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
      icon: <SettingOutlined />,
      label: t('Enterprise Systems'),
      children: [
        {
          key: 'ecc',
          label: t('ECC'),
          icon: <DatabaseOutlined />,
          onClick: () => navigate('/enterprise-systems/ecc')
        },
        {
          key: 'ecp',
          label: t('ECP'),
          icon: <LineChartOutlined />,
          onClick: () => navigate('/enterprise-systems/ecp')
        },
        {
          key: 'kpi-erp',
          label: t('KPIs → ERP'),
          icon: <DatabaseOutlined />,
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
          <span style={{ flex: '1 1 auto', whiteSpace: 'normal' }}>{t('Executive Secretary')}</span>
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
      label: t("My Meetings"),
      onClick: () => navigate('/my-meetings')
    },
    {
      key: 'world-class',
      icon: <RocketOutlined />,
      label: t('World-Class Dashboard'),
      onClick: () => navigate('/world-class')
    },
    {
      key: 'world-class-login',
      icon: <RocketOutlined />,
      label: t('World-Class Login'),
      onClick: () => navigate('/login-world-class')
    },
    {
      key: 'bookcases',
      icon: <BookOutlined />,
      label: t('Bookcase'),
      onClick: () => navigate('/bookcases'),
      path: '/bookcases',
    },
    {
      key: 'agenda',
      icon: <ScheduleOutlined />,
      label: t('Agenda Planner'),
      onClick: () => navigate('/agenda/1'), // default meetingId for navigation
      path: '/agenda/:meetingId',
    },
    {
      key: 'pack',
      icon: <ReadOutlined />,
      label: t('Pack Reader'),
      onClick: () => navigate('/pack/1'), // default packId for navigation
      path: '/pack/:packId',
    },
    {
      key: 'compliance',
      icon: <SafetyOutlined />,
      label: t('Security & Compliance'),
      onClick: () => navigate('/compliance'),
      path: '/compliance',
    },
  ];

  const toggleCollapsed = () => {
    onCollapse?.(!collapsed);
  };

  return (
    <Sider
      className="app-sider"
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={SIDEBAR_EXPANDED_WIDTH}
      collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
      style={{
        background: mode === 'dark' ? '#1f2937' : '#ffffff',
        borderRight: `1px solid ${mode === 'dark' ? '#374151' : '#e5e7eb'}`,
        transition: 'all 0.3s ease',
        height: '100vh',
        position: 'relative'
      }}
    >
      <nav id="navigation" role="navigation" aria-label={t('Main Navigation')}>
      {/* Logo Section */}
      <div style={{ 
        padding: '16px', 
        borderBottom: `1px solid ${mode === 'dark' ? '#374151' : '#e5e7eb'}`,
        textAlign: collapsed ? 'center' : 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/aljeri-logo.png"
            alt="Al Jeri Logo"
            style={{
              width: collapsed ? '32px' : '40px',
              height: 'auto',
              filter: 'drop-shadow(0 2px 4px rgba(12, 8, 92, 0.15))'
            }}
          />
          {!collapsed && (
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
      {!collapsed && (
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
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Menu
          className="app-sider-menu"
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={expandedKeys}
          onOpenChange={(keys) => setExpandedKeys(keys as string[])}
          items={menuItems as any}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '14px'
          }}
          theme={mode === 'dark' ? 'dark' : 'light'}
        />
      </div>

      {/* User Profile Section */}
      <div style={{ 
        padding: '16px', 
        borderTop: `1px solid ${mode === 'dark' ? '#374151' : '#e5e7eb'}`,
        background: mode === 'dark' ? '#111827' : '#f9fafb'
      }}>
        {!collapsed ? (
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
      </nav>
    </Sider>
  );
};
