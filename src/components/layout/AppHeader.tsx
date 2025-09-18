import React, { useState } from 'react';
import { Layout, Typography, Dropdown, Menu, Avatar, Badge } from 'antd';
import { 
  BellOutlined, 
  UserOutlined, 
  GlobalOutlined, 
  SettingOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [notifications] = useState([
    { id: 1, message: t('New project milestone reached'), type: 'success' },
    { id: 2, message: t('Quarterly report ready'), type: 'info' }
  ]);

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLanguage);
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        {t('Profile')}
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        {t('Settings')}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        {t('Logout')}
      </Menu.Item>
    </Menu>
  );

  return (
    <Header 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 24px', 
        backgroundColor: 'white', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)' 
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src="/path/to/logo.png" 
          alt="Al Jeri Logo" 
          style={{ height: '40px', marginRight: '16px' }} 
        />
        <Text strong style={{ color: '#0C085C', fontSize: '18px' }}>
          {t('Executive Management Portal')}
        </Text>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Badge 
          count={notifications.length} 
          style={{ 
            marginRight: '16px', 
            backgroundColor: '#FF2424' 
          }}
        >
          <BellOutlined 
            style={{ 
              fontSize: '20px', 
              color: '#0C085C', 
              cursor: 'pointer' 
            }} 
          />
        </Badge>

        <LanguageSwitcher /> 
        

        <div 
          onClick={toggleLanguage} 
          style={{ 
            marginRight: '16px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center' 
          }}
        >
          <GlobalOutlined 
            style={{ 
              fontSize: '20px', 
              color: '#0C085C', 
              marginRight: '8px' 
            }} 
          />
          <Text>{i18n.language === 'ar' ? 'EN' : 'AR'}</Text>
        </div>

        <Dropdown overlay={userMenu} placement="bottomRight">
          <Avatar 
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: '#0C085C', 
              cursor: 'pointer' 
            }} 
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;
