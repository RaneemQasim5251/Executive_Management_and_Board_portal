import { FC, useContext, useState, useEffect } from "react";
import { Layout, Space, Avatar, Dropdown, Button, Typography, Badge } from "antd";
import type { MenuProps } from "antd";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  MoonOutlined,
  SunOutlined,
  EyeOutlined,
  RobotOutlined,
  AudioOutlined,
} from "@ant-design/icons";
import { useLogout, useGetIdentity } from "@refinedev/core";
import { useTranslation } from "react-i18next";
import { ColorModeContext } from "../../contexts/color-mode";
import { NotificationCenter } from "../NotificationCenter";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { ThemeSettings } from "../ThemeSettings";
import { AIAssistant } from "../AIAssistant";
import { VoiceControl } from "../VoiceControl";
import { VoiceStatusIndicator } from "../VoiceStatusIndicator";
import { SimpleVoiceControl } from "../SimpleVoiceControl";
import { useTheme } from "../../contexts/theme/ThemeProvider";
import ProfileEditor from "../ProfileEditor";
import { getProfileByEmail } from "../../utils/profileStore";

const { Header: AntdHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  sticky?: boolean;
}

export const Header: FC<HeaderProps> = ({ sticky = true }) => {
  const { mutate: logout } = useLogout();
  const { t, i18n } = useTranslation();
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [themeSettingsVisible, setThemeSettingsVisible] = useState(false);
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);
  const [voiceControlVisible, setVoiceControlVisible] = useState(false);
  const { data: user } = useGetIdentity<{
    id: string;
    name: string;
    email: string;
    avatar: string;
  }>();

  const { mode, setMode } = useContext(ColorModeContext);
  const { preferences, updatePreferences } = useTheme();
  const [animateLogo, setAnimateLogo] = useState(true);
  const [profileEditorOpen, setProfileEditorOpen] = useState(false);

  // Run a subtle circular movement on first mount for ~1 second
  useEffect(() => {
    const timeout = setTimeout(() => setAnimateLogo(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  const toggleLanguage = () => {
    const currentLng = i18n.language;
    const newLng = currentLng === 'ar' ? 'en' : 'ar';
    const isRTL = newLng === 'ar';
    
    // Update language and persist choice
    i18n.changeLanguage(newLng);
    localStorage.setItem('i18nextLng', newLng);
    localStorage.setItem('selectedLanguage', newLng);
    
    // Update document direction and attributes immediately
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLng);
    document.body.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.body.style.direction = isRTL ? 'rtl' : 'ltr';
    
    // Update font family
    document.body.style.fontFamily = isRTL 
      ? "'Noto Sans Arabic', 'Cairo', 'Amiri', system-ui, -apple-system, sans-serif"
      : "'Inter', system-ui, -apple-system, sans-serif";
    
    // Apply changes immediately without reload
    // Update all CSS variables and styles
    const root = document.documentElement;
    root.style.setProperty('--direction', isRTL ? 'rtl' : 'ltr');
    root.style.setProperty('--text-align', isRTL ? 'right' : 'left');
    
    // Update all layout elements
    const layoutElements = document.querySelectorAll('.ant-layout, .ant-layout-content, .ant-layout-sider, .ant-layout-header');
    layoutElements.forEach(el => {
      (el as HTMLElement).style.direction = isRTL ? 'rtl' : 'ltr';
    });
    
    // Apply language immediately to all elements
    document.querySelectorAll('*').forEach(el => {
      if (el instanceof HTMLElement) {
        if (isRTL) {
          el.classList.add('rtl-mode');
          el.style.direction = 'rtl';
        } else {
          el.classList.remove('rtl-mode');
          el.style.direction = 'ltr';
        }
      }
    });
    
    // Wait a bit and then reload for complete refresh
    // No reload needed; i18n + ConfigProvider handle updates
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: t("Board Profile"),
      onClick: () => setProfileEditorOpen(true),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: t("Executive Settings"),
    },
    {
      type: "divider",
    },

    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: t("Logout"),
      onClick: () => logout(),
    },
  ];

  const toggleColorMode = () => {
    const nextMode = mode === "light" ? "dark" : mode === "dark" ? "eye-comfort" : "light";
    setMode(nextMode);
    updatePreferences({ mode: nextMode as any });
  };

  const getThemeIcon = () => {
    switch (preferences.mode) {
      case 'dark':
        return <MoonOutlined />;
      case 'eye-comfort':
        return <EyeOutlined />;
      default:
        return <SunOutlined />;
    }
  };

  return (
    <>
      <AntdHeader
        className="app-header"
        style={{
        position: sticky ? "sticky" : "relative",
        top: 0,
        zIndex: 999,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {/* Left side - Al Jeri Logo & Portal Title */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "16px",
        minWidth: 0,
        flex: 1
      }}>
        <img 
          src="/aljeri-logo.png" 
          alt="Al Jeri Logo" 
          style={{ 
            height: "40px", 
            width: "auto",
            filter: "drop-shadow(0 2px 4px rgba(12, 8, 92, 0.15))",
            flexShrink: 0
          }} 
          className={animateLogo ? "logo-circle-once" : undefined}
        />
        <div style={{ 
          lineHeight: "1.3",
          minWidth: 0,
          overflow: "hidden"
        }}>
          <Text strong style={{ 
            fontSize: "14px", 
            color: "var(--primary-color)",
            display: "block",
            fontWeight: "700",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {t('Al Jeri Executive Board Platform')}
          </Text>
          <Text type="secondary" style={{ 
            fontSize: "10px", 
            marginTop: "2px", 
            display: "block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {t('Executive Command & Board Center')}
          </Text>
        </div>
      </div>

      {/* Right side - Actions and User */}
      <Space size="small" style={{ flexShrink: 0 }}>
        {/* Notifications */}
        <Badge count={3} size="small" style={{ backgroundColor: 'var(--primary-color)' }}>
          <Button
            type="text"
            shape="circle"
            icon={<BellOutlined />}
            onClick={() => setNotificationVisible(true)}
            style={{
              color: "var(--primary-color)",
              fontSize: "16px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(12, 8, 92, 0.1)";
              e.currentTarget.style.color = "var(--primary-color)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--primary-color)";
            }}
          />
        </Badge>

        {/* Voice Control */}
        <Button
          type="text"
          icon={<AudioOutlined />}
          onClick={() => setVoiceControlVisible(true)}
          style={{ color: "#6b7280" }}
          title={t('Voice Control')}
        />

        {/* AI Assistant */}
        <Button
          type="text"
          icon={<RobotOutlined />}
          onClick={() => setAiAssistantVisible(true)}
          style={{ color: "#6b7280" }}
          title={t('AI Executive Assistant')}
        />

        {/* Language Switcher */}
        <LanguageSwitcher />
        
        {/* Theme Settings */}
        <Button
          type="text"
          icon={<SettingOutlined />}
          onClick={() => setThemeSettingsVisible(true)}
          style={{ color: "#6b7280" }}
          title={t('Theme & Accessibility Settings')}
        />

        {/* Color Mode Toggle */}
        <Button
          type="text"
          icon={getThemeIcon()}
          onClick={toggleColorMode}
          style={{ color: "#6b7280" }}
          title={t(`Switch to ${preferences.mode === 'light' ? 'Dark' : preferences.mode === 'dark' ? 'Eye Comfort' : 'Light'} Theme`)}
        />

        {/* User Profile */}
        <Dropdown
          menu={{ items: menuItems }}
          trigger={["click"]}
          placement="bottomRight"
          arrow
        >
          <Space 
            style={{ 
              cursor: "pointer", 
              padding: "6px 12px", 
              borderRadius: "10px",
              transition: "all 0.2s ease",
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f8fafc";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <Avatar
              size="default"
              style={{
                background: "var(--primary-color)",
                color: "white",
                fontSize: "16px",
              }}
            >
              {getProfileByEmail(user?.email || "")?.avatarUrl ? (
                <img src={getProfileByEmail(user?.email || "")!.avatarUrl} alt="avatar" style={{ width: 24, height: 24, borderRadius: '50%' }} />
              ) : (
                user?.avatar || "👤"
              )}
            </Avatar>
            <div style={{ textAlign: i18n.language === 'ar' ? 'left' : 'right', lineHeight: "1.3" }}>
              <Text strong style={{ fontSize: "13px", color: "#1f2937", display: "block" }}>
                {getProfileByEmail(user?.email || "")?.name || user?.name || (i18n.language === 'ar' ? 'المدير التنفيذي' : 'Executive')}
              </Text>
              <Text type="secondary" style={{ fontSize: "11px", marginTop: "1px", display: "block" }}>
                {user?.email || "executive@company.com"}
              </Text>
            </div>
          </Space>
        </Dropdown>
      </Space>
      </AntdHeader>
      
      <NotificationCenter 
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />
      
      <ThemeSettings
        visible={themeSettingsVisible}
        onClose={() => setThemeSettingsVisible(false)}
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
        onThemeSwitch={toggleColorMode}
      />

      <ProfileEditor
        visible={profileEditorOpen}
        onClose={() => setProfileEditorOpen(false)}
        currentEmail={user?.email}
        currentName={getProfileByEmail(user?.email || "")?.name || user?.name}
      />
    </>
  );
};