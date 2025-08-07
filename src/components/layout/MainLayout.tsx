import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Header } from './header';
import { Sidebar } from './Sidebar';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
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
        width: sidebarCollapsed ? 80 : 280,
        transition: 'width 0.3s ease',
        flexShrink: 0
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
          background: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <Header />
        
        {/* Content */}
        <Content 
          style={{ 
            margin: '16px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            flex: 1,
            overflow: 'auto',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
