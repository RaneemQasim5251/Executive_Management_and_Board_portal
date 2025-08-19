import React, { useState } from 'react';
import {
  Drawer,
  Space,
  Typography,
  Switch,
  Select,
  Button,
  Divider,
  Card,
  Row,
  Col,
  Badge,
  Alert,
  Tooltip,
} from 'antd';
import {
  SettingOutlined,
  SunOutlined,
  MoonOutlined,
  EyeOutlined,
  FontSizeOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTheme, ThemeMode, FontSize, MotionPreference } from '../contexts/theme/ThemeProvider';

const { Title, Text, Paragraph } = Typography;

interface ThemeSettingsProps {
  visible: boolean;
  onClose: () => void;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { preferences, updatePreferences, resetPreferences, wcagCompliant } = useTheme();
  const [hasChanges, setHasChanges] = useState(false);

  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    updatePreferences({ [key]: value });
    setHasChanges(true);
  };

  const handleReset = () => {
    resetPreferences();
    setHasChanges(false);
  };

  const themeOptions = [
    {
      value: 'light' as ThemeMode,
      label: t('Light Theme'),
      icon: <SunOutlined />,
      description: t('Clean and bright interface'),
    },
    {
      value: 'dark' as ThemeMode,
      label: t('Dark Theme'),
      icon: <MoonOutlined />,
      description: t('Easy on the eyes in low light'),
    },
    {
      value: 'eye-comfort' as ThemeMode,
      label: t('Eye Comfort'),
      icon: <EyeOutlined />,
      description: t('Optimized for extended use'),
      recommended: true,
    },
  ];

  const fontSizeOptions = [
    { value: 'small' as FontSize, label: t('Small (14px)') },
    { value: 'medium' as FontSize, label: t('Medium (16px)'), recommended: true },
    { value: 'large' as FontSize, label: t('Large (18px)') },
    { value: 'extra-large' as FontSize, label: t('Extra Large (20px)') },
  ];

  const motionOptions = [
    { value: 'full' as MotionPreference, label: t('Full Animations') },
    { value: 'reduced' as MotionPreference, label: t('Reduced Motion') },
    { value: 'none' as MotionPreference, label: t('No Animations') },
  ];

  return (
    <Drawer
      title={
        <Space>
          <SettingOutlined />
          <span>{t('Theme & Accessibility Settings')}</span>
          {wcagCompliant && (
            <Badge 
              count={<CheckCircleOutlined style={{ color: '#52c41a' }} />} 
              title={t('WCAG AA Compliant')}
            />
          )}
        </Space>
      }
      placement="right"
      width={400}
      open={visible}
      onClose={onClose}
      extra={
        <Space>
          <Button size="small" onClick={handleReset} disabled={!hasChanges}>
            {t('Reset')}
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        
        {/* WCAG Compliance Status */}
        <Alert
          message={wcagCompliant ? t('WCAG AA Compliant') : t('Accessibility Can Be Improved')}
          description={wcagCompliant 
            ? t('Your current settings meet accessibility guidelines')
            : t('Consider enabling high contrast or increasing font size')
          }
          type={wcagCompliant ? 'success' : 'info'}
          icon={wcagCompliant ? <CheckCircleOutlined /> : <InfoCircleOutlined />}
          showIcon
        />

        {/* Theme Mode Selection */}
        <Card size="small">
          <Title level={5}>{t('Theme Mode')}</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            {themeOptions.map((option) => (
              <Card
                key={option.value}
                size="small"
                hoverable
                onClick={() => handlePreferenceChange('mode', option.value)}
                style={{
                  border: preferences.mode === option.value ? '2px solid #1890ff' : '1px solid #d9d9d9',
                  cursor: 'pointer',
                }}
              >
                <Row align="middle" gutter={12}>
                  <Col flex="none">
                    <div style={{ fontSize: '20px', color: preferences.mode === option.value ? '#1890ff' : undefined }}>
                      {option.icon}
                    </div>
                  </Col>
                  <Col flex="auto">
                    <Space direction="vertical" size={0}>
                      <Space>
                        <Text strong>{option.label}</Text>
                        {option.recommended && (
                          <Badge count="Recommended" style={{ backgroundColor: '#52c41a' }} />
                        )}
                      </Space>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {option.description}
                      </Text>
                    </Space>
                  </Col>
                  <Col flex="none">
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      border: '2px solid #d9d9d9',
                      backgroundColor: preferences.mode === option.value ? '#1890ff' : 'transparent',
                    }} />
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
        </Card>

        {/* Font Size */}
        <Card size="small">
          <Title level={5}>
            <Space>
              <FontSizeOutlined />
              {t('Font Size')}
            </Space>
          </Title>
          <Select
            value={preferences.fontSize}
            onChange={(value) => handlePreferenceChange('fontSize', value)}
            style={{ width: '100%' }}
            options={fontSizeOptions.map(option => ({
              ...option,
              label: (
                <Space>
                  {option.label}
                  {option.recommended && <Badge count="Recommended" size="small" />}
                </Space>
              ),
            }))}
          />
          <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: 8, marginBottom: 0 }}>
            {t('Larger text improves readability and accessibility')}
          </Paragraph>
        </Card>

        {/* Motion Preferences */}
        <Card size="small">
          <Title level={5}>
            <Space>
              <ThunderboltOutlined />
              {t('Motion & Animations')}
            </Space>
          </Title>
          <Select
            value={preferences.motionPreference}
            onChange={(value) => handlePreferenceChange('motionPreference', value)}
            style={{ width: '100%' }}
            options={motionOptions}
          />
          <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: 8, marginBottom: 0 }}>
            {t('Reduce motion to prevent vestibular disorders')}
          </Paragraph>
        </Card>

        {/* Accessibility Options */}
        <Card size="small">
          <Title level={5}>{t('Accessibility Options')}</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            
            <Row justify="space-between" align="middle">
              <Col>
                <Space direction="vertical" size={0}>
                  <Text strong>{t('High Contrast')}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {t('Improves text visibility')}
                  </Text>
                </Space>
              </Col>
              <Col>
                <Switch
                  checked={preferences.highContrast}
                  onChange={(checked) => handlePreferenceChange('highContrast', checked)}
                />
              </Col>
            </Row>

            <Divider style={{ margin: '12px 0' }} />

            <Row justify="space-between" align="middle">
              <Col>
                <Space direction="vertical" size={0}>
                  <Text strong>{t('Focus Ring Visible')}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {t('Shows focus outline for keyboard navigation')}
                  </Text>
                </Space>
              </Col>
              <Col>
                <Switch
                  checked={preferences.focusRingVisible}
                  onChange={(checked) => handlePreferenceChange('focusRingVisible', checked)}
                />
              </Col>
            </Row>

            <Divider style={{ margin: '12px 0' }} />

            <Row justify="space-between" align="middle">
              <Col>
                <Space direction="vertical" size={0}>
                  <Text strong>{t('Reduced Transparency')}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {t('Removes transparent effects')}
                  </Text>
                </Space>
              </Col>
              <Col>
                <Switch
                  checked={preferences.reducedTransparency}
                  onChange={(checked) => handlePreferenceChange('reducedTransparency', checked)}
                />
              </Col>
            </Row>

            <Divider style={{ margin: '12px 0' }} />

            <Row justify="space-between" align="middle">
              <Col>
                <Space direction="vertical" size={0}>
                  <Text strong>{t('Color Blindness Support')}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {t('Adjusts colors for better distinction')}
                  </Text>
                </Space>
              </Col>
              <Col>
                <Switch
                  checked={preferences.colorBlindnessSupport}
                  onChange={(checked) => handlePreferenceChange('colorBlindnessSupport', checked)}
                />
              </Col>
            </Row>
          </Space>
        </Card>

        {/* Tips */}
        <Card size="small" style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
          <Title level={5} style={{ color: '#52c41a', marginBottom: 8 }}>
            <InfoCircleOutlined /> {t('Accessibility Tips')}
          </Title>
          <ul style={{ paddingLeft: 16, marginBottom: 0 }}>
            <li><Text style={{ fontSize: '12px' }}>{t('Use keyboard Tab and Enter to navigate')}</Text></li>
            <li><Text style={{ fontSize: '12px' }}>{t('Enable high contrast in bright environments')}</Text></li>
            <li><Text style={{ fontSize: '12px' }}>{t('Increase font size for comfortable reading')}</Text></li>
            <li><Text style={{ fontSize: '12px' }}>{t('Reduce motion if you experience dizziness')}</Text></li>
          </ul>
        </Card>

      </Space>
    </Drawer>
  );
};

export default ThemeSettings;
