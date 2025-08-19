import React, { useState } from 'react';
import { Layout } from 'antd';
import { SimplifiedHeader } from './SimplifiedHeader';
import { SimplifiedSidebar } from './SimplifiedSidebar';
import { NotificationCenter } from '../NotificationCenter';
import { AIAssistant } from '../AIAssistant';
import { VoiceControl } from '../VoiceControl';
import { ThemeSettings } from '../ThemeSettings';

const { Content } = Layout;

interface SimplifiedLayoutProps {
  children: React.ReactNode;
}

export const SimplifiedLayout: React.FC<SimplifiedLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);
  const [voiceControlVisible, setVoiceControlVisible] = useState(false);
  const [themeSettingsVisible, setThemeSettingsVisible] = useState(false);

  const toggleLanguage = () => {
    // Language toggle logic handled in header
  };

  const toggleTheme = () => {
    // Theme toggle logic handled in header
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Simplified Sidebar */}
      <SimplifiedSidebar
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
      />
      
      <Layout style={{ 
        marginLeft: sidebarCollapsed ? '80px' : '280px',
        transition: 'margin-left 0.2s ease',
        background: '#f8fafc',
      }}>
        {/* Simplified Header */}
        <SimplifiedHeader
          onOpenNotifications={() => setNotificationVisible(true)}
          onOpenVoiceControl={() => setVoiceControlVisible(true)}
          onOpenAI={() => setAiAssistantVisible(true)}
          onOpenSettings={() => setThemeSettingsVisible(true)}
        />
        
        {/* Main Content */}
        <Content
          style={{
            padding: 0,
            background: '#f8fafc',
            minHeight: 'calc(100vh - 72px)',
            overflow: 'auto',
          }}
        >
          <main id="main-content" role="main" tabIndex={-1}>
            {children}
          </main>
        </Content>
      </Layout>

      {/* Modals and Drawers */}
      <NotificationCenter 
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />
      
      <AIAssistant
        visible={aiAssistantVisible}
        onClose={() => setAiAssistantVisible(false)}
      />
      
      <VoiceControl
        visible={voiceControlVisible}
        onClose={() => setVoiceControlVisible(false)}
        onOpenAI={() => setAiAssistantVisible(true)}
        onOpenThemeSettings={() => setThemeSettingsVisible(true)}
        onOpenNotifications={() => setNotificationVisible(true)}
        onLanguageSwitch={toggleLanguage}
        onThemeSwitch={toggleTheme}
      />
      
      <ThemeSettings
        visible={themeSettingsVisible}
        onClose={() => setThemeSettingsVisible(false)}
      />
    </Layout>
  );
};

export default SimplifiedLayout;
