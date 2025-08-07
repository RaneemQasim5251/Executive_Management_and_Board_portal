import { FC, useContext, useState } from "react";
import { Layout, Space, Avatar, Dropdown, Button, Typography, Badge } from "antd";
import type { MenuProps } from "antd";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,

  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { useLogout, useGetIdentity } from "@refinedev/core";
import { useTranslation } from "react-i18next";
import { ColorModeContext } from "../../contexts/color-mode";
import { NotificationCenter } from "../NotificationCenter";
import { LanguageSwitcher } from "../LanguageSwitcher";

const { Header: AntdHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  sticky?: boolean;
}

export const Header: FC<HeaderProps> = ({ sticky = true }) => {
  const { mutate: logout } = useLogout();
  const { t, i18n } = useTranslation();
  const [notificationVisible, setNotificationVisible] = useState(false);
  const { data: user } = useGetIdentity<{
    id: string;
    name: string;
    email: string;
    avatar: string;
  }>();

  const { mode, setMode } = useContext(ColorModeContext);

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
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: t("Board Profile"),
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
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <>
      <AntdHeader
        style={{
        position: sticky ? "sticky" : "relative",
        top: 0,
        zIndex: 999,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        background: "#ffffff",
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
          src="C:\Users\raneem althaqafi\Executive-Management-Portal\public\Aljeri_logo.png - Copy01.png" 
          alt="Al Jeri Logo" 
          style={{ 
            height: "40px", 
            width: "auto",
            filter: "drop-shadow(0 2px 4px rgba(12, 8, 92, 0.15))",
            flexShrink: 0
          }} 
        />
        <div style={{ 
          lineHeight: "1.3",
          minWidth: 0,
          overflow: "hidden"
        }}>
          <Text strong style={{ 
            fontSize: "14px", 
            color: "#0C085C",
            display: "block",
            fontWeight: "700",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {i18n.language === 'ar' ? 'منصَّة مجلس الإدارة التنفيذية لشركة الجِري' : 'Al Jeri Executive Board Platform'}
          </Text>
          <Text type="secondary" style={{ 
            fontSize: "10px", 
            marginTop: "2px", 
            display: "block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {i18n.language === 'ar' ? 'مركز القيادة التنفيذية ومجلس الإدارة' : 'Executive Command & Board Center'}
          </Text>
        </div>
      </div>

      {/* Right side - Actions and User */}
      <Space size="small" style={{ flexShrink: 0 }}>
        {/* Notifications */}
        <Badge count={3} size="small" style={{ backgroundColor: '#0C085C' }}>
          <Button
            type="text"
            shape="circle"
            icon={<BellOutlined />}
            onClick={() => setNotificationVisible(true)}
            style={{
              color: "#0C085C",
              fontSize: "16px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(12, 8, 92, 0.1)";
              e.currentTarget.style.color = "#0C085C";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#0C085C";
            }}
          />
        </Badge>

        {/* Language Switcher */}
        <LanguageSwitcher />
        
        {/* Color Mode Toggle */}
        <Button
          type="text"
          icon={mode === "light" ? <MoonOutlined /> : <SunOutlined />}
          onClick={toggleColorMode}
          style={{ color: "#6b7280" }}
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
                background: "#0C085C",
                color: "white",
                fontSize: "16px",
              }}
            >
              {user?.avatar || "👤"}
            </Avatar>
            <div style={{ textAlign: i18n.language === 'ar' ? 'left' : 'right', lineHeight: "1.3" }}>
              <Text strong style={{ fontSize: "13px", color: "#1f2937", display: "block" }}>
                {user?.name || (i18n.language === 'ar' ? 'المدير التنفيذي' : 'Executive')}
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
    </>
  );
};