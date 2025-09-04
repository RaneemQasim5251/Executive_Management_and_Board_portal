import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AudioOutlined, 
  BellOutlined, 
  TrophyOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Typography, Badge, Dropdown, Menu, Tooltip } from 'antd';
import { VoiceControl } from './VoiceControl';
import { AchievementSystem } from './AchievementSystem';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

// Notification data type
interface Notification {
  id: number;
  type: 'warning' | 'info' | 'success' | 'error';
  message: string;
  time: string;
  icon: React.ReactNode;
}

const notifications: Notification[] = [
  {
    id: 1,
    type: 'warning',
    message: 'Board Meeting Q2 Review',
    time: '2:30 PM',
    icon: <WarningOutlined style={{ color: '#FF2424' }} />
  },
  {
    id: 2,
    type: 'info',
    message: 'New Project Milestone',
    time: '12:45 PM',
    icon: <InfoCircleOutlined style={{ color: '#0095CE' }} />
  },
  {
    id: 3,
    type: 'success',
    message: 'Q2 Revenue Target Exceeded',
    time: '10:15 AM',
    icon: <CheckCircleOutlined style={{ color: '#10b981' }} />
  }
];

export const QuickAccessPanel: React.FC = () => {
  const [isVoiceControlActive, setIsVoiceControlActive] = useState(false);
  const [isNotificationExpanded, setIsNotificationExpanded] = useState(false);
  const [isAchievementsVisible, setIsAchievementsVisible] = useState(false);
  const { t } = useTranslation();

  // Detect RTL to avoid covering content in Arabic layout
  const isRTL = typeof document !== 'undefined' && document?.documentElement?.dir === 'rtl';

  const NotificationMenu = (
    <Menu 
      style={{ 
        width: 300, 
        borderRadius: '12px', 
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)' 
      }}
    >
      <Menu.ItemGroup title={t('Recent Notifications')}>
        {notifications.map(notification => (
          <Menu.Item key={notification.id}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {notification.icon}
                <Text>{t(notification.message)}</Text>
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t(notification.time)}
              </Text>
            </div>
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
    </Menu>
  );

  return (
    <>
      <div 
        style={{ 
          position: 'fixed', 
          bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
          // Place on the start side for RTL to avoid covering key UI
          right: isRTL ? 'auto' : 24,
          left: isRTL ? 24 : 'auto',
          display: 'flex', 
          alignItems: 'center', 
          gap: 12,
          zIndex: 1000,
          backgroundColor: 'rgba(12, 8, 92, 0.8)', 
          borderRadius: '32px',
          padding: '8px 16px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 24px rgba(12, 8, 92, 0.25)',
          // Prevent the bar from stretching too wide and covering content
          maxWidth: 'min(90vw, 560px)',
          flexWrap: 'wrap'
        }}
      >
        {/* Performance Metrics */}
        <Tooltip title={t('Success Rate')}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              color: 'white'
            }}
          >
            <TrophyOutlined />
            <Text strong style={{ color: 'white', fontSize: 16 }}>
              94.2%
            </Text>
            <Text type="secondary" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
              {t('+2.1% improvement')}
            </Text>
          </div>
        </Tooltip>

        {/* Voice Control Button */}
        <Tooltip title={t('Quick Voice Control')}>
          <motion.button
            onClick={() => setIsVoiceControlActive(true)}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(255,255,255,0.2)', // Semi-transparent white background
              color: 'white', // White icon color
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <AudioOutlined style={{ fontSize: 20 }} />
          </motion.button>
        </Tooltip>

        {/* Notifications Button */}
        <Dropdown 
          overlay={NotificationMenu} 
          placement="topRight"
          trigger={['click']}
          onVisibleChange={(visible) => setIsNotificationExpanded(visible)}
        >
          <motion.div
            style={{
              position: 'relative',
              cursor: 'pointer'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge count={3} size="small">
              <motion.button
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'rgba(255,255,255,0.2)', // Semi-transparent white background
                  color: 'white', // White icon color
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                }}
              >
                <BellOutlined style={{ fontSize: 20 }} />
              </motion.button>
            </Badge>
          </motion.div>
        </Dropdown>

        {/* Achievements Button */}
        <Tooltip title="Achievements">
          <motion.div
            style={{
              position: 'relative',
              cursor: 'pointer'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge count={3} size="small" style={{ backgroundColor: '#363692' }}>
              <motion.button
                onClick={() => setIsAchievementsVisible(true)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'rgba(255,255,255,0.2)', // Semi-transparent white background
                  color: 'white', // White icon color
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                }}
              >
                <TrophyOutlined style={{ fontSize: 20 }} />
              </motion.button>
            </Badge>
          </motion.div>
        </Tooltip>
      </div>

      {/* Voice Control Modal */}
      <VoiceControl 
        visible={isVoiceControlActive}
        onClose={() => setIsVoiceControlActive(false)}
      />

      {/* Achievements Modal */}
      <AchievementSystem 
        visible={isAchievementsVisible}
        onClose={() => setIsAchievementsVisible(false)}
      />
    </>
  );
};

export default QuickAccessPanel;
