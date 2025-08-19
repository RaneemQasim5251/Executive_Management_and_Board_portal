import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Button, Space, Avatar, Badge } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  ProjectOutlined,
  CalendarOutlined,
  BarChartOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { Text, Title } = Typography;

interface SimplifiedSidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export const SimplifiedSidebar: React.FC<SimplifiedSidebarProps> = ({ 
  collapsed = false, 
  onCollapse 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // Simplified navigation structure - only essential items
  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: t('Dashboard'),
      onClick: () => navigate('/'),
    },
    {
      key: 'projects',
      icon: <ProjectOutlined />,
      label: t('Projects'),
      onClick: () => navigate('/board'),
    },
    {
      key: 'timeline',
      icon: <CalendarOutlined />,
      label: t('Timeline'),
      onClick: () => navigate('/timeline'),
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: t('Reports'),
      onClick: () => navigate('/reports'),
    },
    {
      key: 'companies',
      icon: <TeamOutlined />,
      label: t('Companies'),
      onClick: () => navigate('/companies/jtc'),
    },
    {
      key: 'meetings',
      icon: <FileTextOutlined />,
      label: (
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <span>{t('Meetings')}</span>
          <Badge count={3} size="small" style={{ backgroundColor: '#52c41a' }} />
        </Space>
      ),
      onClick: () => navigate('/my-meetings'),
    },
  ];

  // Update selected key based on current route
  useEffect(() => {
    const pathname = location.pathname;
    
    if (pathname === '/') {
      setSelectedKeys(['dashboard']);
    } else if (pathname.includes('/board')) {
      setSelectedKeys(['projects']);
    } else if (pathname.includes('/timeline')) {
      setSelectedKeys(['timeline']);
    } else if (pathname.includes('/reports')) {
      setSelectedKeys(['reports']);
    } else if (pathname.includes('/companies')) {
      setSelectedKeys(['companies']);
    } else if (pathname.includes('/my-meetings') || pathname.includes('/secretary')) {
      setSelectedKeys(['meetings']);
    } else {
      setSelectedKeys([]);
    }
  }, [location.pathname]);

  const toggleCollapsed = () => {
    onCollapse?.(!collapsed);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={280}
      collapsedWidth={80}
      style={{
        background: '#ffffff',
        borderRight: '1px solid #f0f0f0',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.2s ease',
        overflow: 'hidden',
        height: '100vh',
        position: 'relative',
      }}
    >
      {/* Logo Section */}
      <div style={{ 
        padding: collapsed ? '20px 16px' : '24px', 
        borderBottom: '1px solid #f0f0f0',
        background: '#fafafa',
        textAlign: collapsed ? 'center' : 'left',
      }}>
        <Space align="center" size={collapsed ? 0 : 12}>
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
              <Title level={5} style={{ 
                margin: 0, 
                color: '#0C085C', 
                fontSize: '16px', 
                fontWeight: 700,
                lineHeight: 1.2,
              }}>
                {t('Executive Portal')}
              </Title>
              <Text type="secondary" style={{ fontSize: '12px', lineHeight: 1.2 }}>
                {t('Al Jeri Group')}
              </Text>
            </div>
          )}
        </Space>
      </div>

      {/* Navigation Menu */}
      <div style={{ 
        flex: 1, 
        padding: collapsed ? '16px 8px' : '24px 16px',
        overflow: 'auto',
      }}>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '15px',
            fontWeight: 500,
          }}
          inlineIndent={collapsed ? 0 : 24}
        />
      </div>

      {/* User Profile Section */}
      {!collapsed && (
        <div style={{ 
          padding: '16px 24px', 
          borderTop: '1px solid #f0f0f0',
          background: '#fafafa',
        }}>
          <Space align="center" size={12}>
            <Avatar 
              size={40} 
              style={{ 
                background: 'linear-gradient(135deg, #0C085C 0%, #363692 100%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              {t('Executive')[0]}
            </Avatar>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text strong style={{ 
                fontSize: '14px', 
                color: '#1f2937',
                display: 'block',
                lineHeight: 1.3,
              }}>
                {t('Executive User')}
              </Text>
              <Text type="secondary" style={{ 
                fontSize: '12px',
                lineHeight: 1.3,
              }}>
                executive@aljeri.com
              </Text>
            </div>
          </Space>
        </div>
      )}

      {/* Collapse Toggle */}
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleCollapsed}
        style={{
          position: 'absolute',
          top: '50%',
          right: collapsed ? '-16px' : '-20px',
          transform: 'translateY(-50%)',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 1001,
          fontSize: '14px',
          color: '#6b7280',
        }}
      />
    </Sider>
  );
};

export default SimplifiedSidebar;
