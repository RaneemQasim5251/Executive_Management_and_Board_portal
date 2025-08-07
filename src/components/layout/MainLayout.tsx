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

  // Calculate the left margin based on sidebar state
  const getContentMargin = () => {
    if (isMobile) {
      return 0; // No margin on mobile, sidebar overlays
    }
    return sidebarCollapsed ? 80 : 280; // Match sidebar width
  };

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar - Fixed position */}
      <div style={{ 
        position: 'fixed', 
        left: 0, 
        top: 0, 
        bottom: 0, 
        zIndex: 1000,
        width: sidebarCollapsed ? 80 : 280,
        transition: 'width 0.3s ease'
      }}>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onCollapse={handleSidebarCollapse}
        />
      </div>
      
      {/* Main Content Area - Pushed to the right */}
      <Layout 
        style={{ 
          marginLeft: getContentMargin(),
          width: `calc(100% - ${getContentMargin()}px)`,
          transition: 'all 0.3s ease',
          minHeight: '100vh',
          background: '#f5f5f5'
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
            minHeight: 'calc(100vh - 120px)',
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
