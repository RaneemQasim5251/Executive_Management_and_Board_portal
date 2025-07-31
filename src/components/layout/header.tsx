import React, { useContext } from "react";
import { Layout, Space, Avatar, Dropdown, Button, Typography, Badge } from "antd";
import type { MenuProps } from "antd";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  GlobalOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { useLogout, useGetIdentity } from "@refinedev/core";
import { ColorModeContext } from "../../contexts/color-mode";

const { Header: AntdHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  sticky?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ sticky = true }) => {
  const { mutate: logout } = useLogout();
  const { data: user } = useGetIdentity<{
    id: string;
    name: string;
    email: string;
    avatar: string;
  }>();

  const { mode, setMode } = useContext(ColorModeContext);

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Executive Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Portal Settings",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign Out",
      onClick: () => logout(),
    },
  ];

  const toggleColorMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
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
      {/* Left side - Portal Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ fontSize: "24px" }}>🏢</div>
        <div>
          <Text strong style={{ fontSize: "18px", color: "#1e3a8a" }}>
            Executive Portal
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Strategic Command Center
          </Text>
        </div>
      </div>

      {/* Right side - Actions and User */}
      <Space size="middle">
        {/* Notifications */}
        <Badge count={3} size="small">
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{ color: "#6b7280" }}
          />
        </Badge>

        {/* Global Actions */}
        <Button
          type="text"
          icon={<GlobalOutlined />}
          style={{ color: "#6b7280" }}
        />

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
        >
          <Space style={{ cursor: "pointer", padding: "8px 12px", borderRadius: "8px" }}>
            <Avatar
              size="small"
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                color: "white",
              }}
            >
              {user?.avatar || "👤"}
            </Avatar>
            <div style={{ textAlign: "right" }}>
              <Text strong style={{ fontSize: "14px", color: "#1f2937" }}>
                {user?.name || "Executive"}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {user?.email || "executive@company.com"}
              </Text>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </AntdHeader>
  );
};