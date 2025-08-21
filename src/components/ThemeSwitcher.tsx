import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Typography, 
  Space, 
  Card, 
  Switch, 
  Select, 
  Divider, 
  Row, 
  Col,
  Button
} from 'antd';
import { 
  AppleOutlined, 
  RocketOutlined, 
  FunctionOutlined, 
  IeOutlined,
  CodeOutlined,
  EyeOutlined,
  FontSizeOutlined,
  BorderOutlined,
  GlobalOutlined,
  CloseOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { usePortalTheme } from '../contexts/PortalThemeContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const themes = [
  {
    key: 'default',
    name: 'Default Executive',
    icon: <RocketOutlined />,
    description: 'Original executive portal design',
    colors: {
      primary: '#0C085C', // Federal Blue
      background: '#FFFFFF',
      text: '#000000'
    }
  },
  {
    key: 'dark',
    name: 'Dark Executive',
    icon: <CodeOutlined />,
    description: 'Sleek dark mode design',
    colors: {
      primary: '#363692', // Egyptian Blue
      background: '#121212',
      text: '#FFFFFF'
    }
  },
  {
    key: 'minimalist',
    name: 'Minimalist Portal',
    icon: <IeOutlined />,
    description: 'Ultra-clean, distraction-free design',
    colors: {
      primary: '#0095CE', // Celestial Blue
      background: '#F5F5F5',
      text: '#000000'
    }
  },
  {
    key: 'apple',
    name: 'Apple-Inspired',
    icon: <AppleOutlined />,
    description: 'Elegant, premium design with soft aesthetics and intuitive interactions',
    colors: {
      primary: '#007AFF', // Apple Blue
      background: '#FFFFFF',
      text: '#000000'
    },
    features: [
      'Soft, rounded corners',
      'Subtle shadows and transitions',
      'Clean typography',
      'Intuitive interactions'
    ]
  },
  {
    key: 'stripe',
    name: 'Stripe-Inspired',
    icon: <FunctionOutlined />,
    description: 'Modern, clean, and professional interface',
    colors: {
      primary: '#6772E5', // Stripe Purple
      background: '#FFFFFF',
      text: '#32325D'
    }
  }
];

interface ThemeSwitcherProps {
  visible?: boolean;
  onClose?: () => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  visible = false, 
  onClose 
}) => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = usePortalTheme();
  const [isModalVisible, setIsModalVisible] = useState(visible);

  useEffect(() => {
    setIsModalVisible(visible);
  }, [visible]);

  const handleClose = () => {
    setIsModalVisible(false);
    onClose?.();
  };

  const handleThemeChange = (themeKey: string) => {
    const selectedTheme = themes.find(t => t.key === themeKey);
    if (selectedTheme) {
      setTheme({
        ...theme,
        mode: themeKey as any,
        primaryColor: selectedTheme.colors.primary
      });
    }
  };

  const handleAccessibilityChange = (setting: string, value: any) => {
    switch(setting) {
      case 'fontSize':
        setTheme({ ...theme, fontSize: value });
        break;
      case 'highContrast':
        setTheme({ ...theme, highContrast: value });
        break;
      case 'reducedMotion':
        setTheme({ ...theme, reducedMotion: value });
        break;
      case 'language':
        i18n.changeLanguage(value);
        break;
    }
  };

  return (
    <>
      {/* Floating Theme Switcher Button */}
      <Button 
        type="primary" 
        icon={<SettingOutlined />} 
        onClick={() => setIsModalVisible(true)}
        style={{
          position: 'fixed', 
          bottom: 20, 
          right: 20, 
          zIndex: 1000,
          borderRadius: '50%',
          width: 50,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        title={t('Theme & Accessibility Settings')}
      />

      {/* Theme Switcher Modal */}
      <Modal
        title={t('Theme & Accessibility Settings')}
        open={isModalVisible}
        onCancel={handleClose}
        footer={null}
        width={1000}
        closeIcon={<CloseOutlined />}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Theme Selection */}
          <div>
            <Title level={4}>{t('Choose Your Portal Experience')}</Title>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              {themes.map((themeOption) => (
                <Col key={themeOption.key} xs={24} sm={12} md={8} lg={4}>
                  <Card 
                    hoverable
                    style={{ 
                      textAlign: 'center', 
                      borderColor: theme.mode === themeOption.key ? themeOption.colors.primary : undefined,
                      boxShadow: theme.mode === themeOption.key 
                        ? `0 4px 6px rgba(${parseInt(themeOption.colors.primary.slice(1, 3), 16)}, ${parseInt(themeOption.colors.primary.slice(3, 5), 16)}, ${parseInt(themeOption.colors.primary.slice(5, 7), 16)}, 0.2)` 
                        : undefined
                    }}
                    onClick={() => handleThemeChange(themeOption.key)}
                  >
                    {React.cloneElement(themeOption.icon, { 
                      style: { 
                        fontSize: '48px', 
                        color: theme.mode === themeOption.key ? themeOption.colors.primary : '#666' 
                      } 
                    })}
                    <div style={{ marginTop: 12 }}>
                      <Text strong style={{ 
                        display: 'block', 
                        color: theme.mode === themeOption.key ? themeOption.colors.primary : 'inherit' 
                      }}>
                        {themeOption.name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {themeOption.description}
                      </Text>
                      {themeOption.features && (
                        <div style={{ marginTop: 8, textAlign: 'left', paddingLeft: 16 }}>
                          {themeOption.features.map((feature, index) => (
                            <Text 
                              key={index} 
                              type="secondary" 
                              style={{ 
                                fontSize: 10, 
                                display: 'block',
                                color: theme.mode === themeOption.key ? themeOption.colors.primary : '#999'
                              }}
                            >
                              • {feature}
                            </Text>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          <Divider />

          {/* Accessibility Settings */}
          <div>
            <Title level={4}>{t('Accessibility Options')}</Title>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              {/* Font Size */}
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Space direction="vertical">
                    <Title level={5}>
                      <FontSizeOutlined style={{ marginRight: 8 }} />
                      {t('Font Size')}
                    </Title>
                    <Select
                      value={theme.fontSize}
                      onChange={(value) => handleAccessibilityChange('fontSize', value)}
                      style={{ width: '100%' }}
                    >
                      <Option value="small">{t('Small (14px)')}</Option>
                      <Option value="medium">{t('Medium (16px)')}</Option>
                      <Option value="large">{t('Large (18px)')}</Option>
                      <Option value="xlarge">{t('Extra Large (20px)')}</Option>
                    </Select>
                    <Paragraph type="secondary">
                      {t('Larger text improves readability and accessibility')}
                    </Paragraph>
                  </Space>
                </Card>
              </Col>

              {/* High Contrast */}
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Space direction="vertical">
                    <Title level={5}>
                      <BorderOutlined style={{ marginRight: 8 }} />
                      {t('High Contrast')}
                    </Title>
                    <Switch
                      checked={theme.highContrast}
                      onChange={(checked) => handleAccessibilityChange('highContrast', checked)}
                    />
                    <Paragraph type="secondary">
                      {t('Adjusts colors for better distinction')}
                    </Paragraph>
                  </Space>
                </Card>
              </Col>

              {/* Reduced Motion */}
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Space direction="vertical">
                    <Title level={5}>
                      <EyeOutlined style={{ marginRight: 8 }} />
                      {t('Reduce Motion')}
                    </Title>
                    <Switch
                      checked={theme.reducedMotion}
                      onChange={(checked) => handleAccessibilityChange('reducedMotion', checked)}
                    />
                    <Paragraph type="secondary">
                      {t('Reduce motion to prevent vestibular disorders')}
                    </Paragraph>
                  </Space>
                </Card>
              </Col>

              {/* Language */}
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Space direction="vertical">
                    <Title level={5}>
                      <GlobalOutlined style={{ marginRight: 8 }} />
                      {t('Language')}
                    </Title>
                    <Select
                      value={i18n.language}
                      onChange={(value) => handleAccessibilityChange('language', value)}
                      style={{ width: '100%' }}
                    >
                      <Option value="en">English</Option>
                      <Option value="ar">العربية</Option>
                    </Select>
                    <Paragraph type="secondary">
                      {t('Choose your preferred language')}
                    </Paragraph>
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>
        </Space>
      </Modal>
    </>
  );
};

export default ThemeSwitcher;
