import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Header } from './header';
import { Sidebar } from './Sidebar';
import {
  SIDEBAR_EXPANDED_WIDTH,
  SIDEBAR_COLLAPSED_WIDTH,
  MOBILE_MAX_WIDTH,
  DESKTOP_OPEN_GAP_PX,
  DESKTOP_COLLAPSED_GAP_PX,
} from './constants';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_MAX_WIDTH; // centralized breakpoint
      setIsMobile(mobile);
      if (mobile) setSidebarCollapsed(true);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar - Part of the flex layout */}
      <div style={{ 
        width: sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
        transition: 'width 0.3s ease',
        flexShrink: 0,
        marginInlineEnd: isMobile ? 0 : (sidebarCollapsed ? DESKTOP_COLLAPSED_GAP_PX : DESKTOP_OPEN_GAP_PX)
      }}>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onCollapse={handleSidebarCollapse}
        />
      </div>
      
      {/* Main Content Area - Flexes to fill remaining space */}
      <Layout 
        style={{ 
          flex: 1,
          minHeight: '100vh',
          background: '#f5f7fa',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <Header />
        
        {/* Content */}
        <Content 
          style={{ 
            margin: 0,
            padding: 0,
            background: 'transparent',
            borderRadius: 0,
            flex: 1,
            overflow: 'auto'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
