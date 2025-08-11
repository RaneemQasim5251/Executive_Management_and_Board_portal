import { FC } from "react";
import { Drawer, List, Typography, Badge, Button, Space, Empty, Tag, Avatar } from "antd";
import { 
  BellOutlined, 
  DeleteOutlined, 
  CheckOutlined, 
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNotifications } from "../contexts/AppStateProvider";
import { INotification } from "../contexts/AppStateProvider";

const { Text } = Typography;

interface NotificationCenterProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationCenter: FC<NotificationCenterProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { notifications, markAsRead, removeNotification } = useNotifications();

  const getIcon = (type: INotification['type']) => {
    switch (type) {
      case 'info': return <InfoCircleOutlined style={{ color: '#0095CE' }} />;
      case 'warning': return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'error': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'success': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      default: return <BellOutlined />;
    }
  };

  const getTypeColor = (type: INotification['type']) => {
    switch (type) {
      case 'info': return '#0095CE';
      case 'warning': return '#faad14';
      case 'error': return '#ff4d4f';
      case 'success': return '#52c41a';
      default: return '#8c8c8c';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t("Just now");
    if (minutes < 60) return t("time.minute", { count: minutes });
    if (hours < 24) return t("time.hour", { count: hours });
    return t("time.day", { count: days });
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const markAllAsRead = () => {
    notifications.forEach(notif => {
      if (!notif.read) {
        markAsRead(notif.id);
      }
    });
  };

  const deleteNotification = (id: string) => {
    removeNotification(id);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <BellOutlined />
            <span>{t("Notifications")}</span>
            {unreadCount > 0 && (
              <Badge count={unreadCount} style={{ backgroundColor: '#0C085C' }} />
            )}
          </Space>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
      extra={
        unreadCount > 0 && (
          <Button type="link" size="small" onClick={markAllAsRead}>
            {t("Mark all as read")}
          </Button>
        )
      }
    >
      {notifications.length > 0 ? (
        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item
              key={notification.id}
              style={{
                opacity: notification.read ? 0.6 : 1,
                backgroundColor: notification.read ? 'transparent' : '#f6ffed',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '8px',
                border: notification.urgent ? '2px solid #ff4d4f' : '1px solid #f0f0f0'
              }}
              actions={[
                !notification.read && (
                  <Button
                    type="link"
                    size="small"
                    icon={<CheckOutlined />}
                    onClick={() => handleMarkAsRead(notification.id)}
                    title={t("Mark as read")}
                  />
                ),
                <Button
                  type="link"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => deleteNotification(notification.id)}
                  title={t("Delete")}
                  danger
                />
              ].filter(Boolean)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={getIcon(notification.type)} 
                    style={{ 
                      backgroundColor: getTypeColor(notification.type),
                      border: notification.urgent ? '2px solid #ff4d4f' : 'none'
                    }} 
                  />
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ fontSize: '14px' }}>
                      {notification.title}
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {notification.urgent && (
                        <Tag color="red" style={{ margin: 0, fontSize: '10px' }}>
                          URGENT
                        </Tag>
                      )}
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {formatTimestamp(notification.timestamp)}
                      </Text>
                    </div>
                  </div>
                }
                description={
                  <Text style={{ fontSize: '13px', lineHeight: '1.4' }}>
                    {notification.message}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span style={{ color: '#8c8c8c' }}>
              {t("No notifications yet")}
            </span>
          }
        />
      )}
    </Drawer>
  );
};