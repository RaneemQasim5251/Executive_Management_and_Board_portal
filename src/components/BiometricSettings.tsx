import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  List,
  Avatar,
  Tag,
  Popconfirm,
  Alert,
  Statistic,
  Row,
  Col,
  Modal,
  Progress,
  Timeline,
} from 'antd';
import {
  SafetyOutlined,
  PlusOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  SecurityScanOutlined,
  MobileOutlined,
  DesktopOutlined,
  UsbOutlined,
  WifiOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNotification } from '@refinedev/core';
import { BiometricAuth } from './BiometricAuth';

const { Title, Text, Paragraph } = Typography;

interface BiometricCredential {
  id: string;
  credential_id: string;
  device_name: string;
  device_type: string;
  authenticator_attachment: 'platform' | 'cross-platform';
  transport_methods: string[];
  last_used_at?: string;
  use_count: number;
  created_at: string;
}

interface BiometricSettingsProps {
  userId: string;
}

export const BiometricSettings: React.FC<BiometricSettingsProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { open: notification } = useNotification();
  
  const [credentials, setCredentials] = useState<BiometricCredential[]>([]);
  const [loading, setLoading] = useState(false);
  const [setupModalVisible, setSetupModalVisible] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);

  // Check WebAuthn support
  useEffect(() => {
    const checkSupport = async () => {
      try {
        const supported = !!(window.PublicKeyCredential && 
                            typeof window.PublicKeyCredential === 'function');
        
        if (supported) {
          const platformSupported = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBiometricSupported(platformSupported);
        }
      } catch (error) {
        console.error('Error checking biometric support:', error);
      }
    };
    
    checkSupport();
  }, []);

  // Load credentials
  useEffect(() => {
    loadCredentials();
  }, [userId]);

  const loadCredentials = async () => {
    try {
      setLoading(true);
      // In production, this would call the API
      // const response = await axios.get('/api/v1/biometric/credentials');
      // setCredentials(response.data.data.credentials);
      
      // For demo, load from localStorage
      const stored = localStorage.getItem(`biometric_credentials_${userId}`);
      if (stored) {
        setCredentials(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
      notification?.open({
        type: 'error',
        message: t('Error'),
        description: t('Failed to load biometric credentials'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetupSuccess = () => {
    notification?.open({
      type: 'success',
      message: t('Success'),
      description: t('Biometric authentication registered successfully'),
    });
    
    // Add demo credential to localStorage
    const newCredential: BiometricCredential = {
      id: Date.now().toString(),
      credential_id: `cred_${Date.now()}`,
      device_name: getBrowserDeviceName(),
      device_type: 'biometric',
      authenticator_attachment: 'platform',
      transport_methods: ['internal'],
      use_count: 0,
      created_at: new Date().toISOString(),
    };
    
    const updated = [...credentials, newCredential];
    setCredentials(updated);
    localStorage.setItem(`biometric_credentials_${userId}`, JSON.stringify(updated));
    localStorage.setItem('has_biometric_credentials', 'true');
    
    setSetupModalVisible(false);
  };

  const handleDeleteCredential = async (credentialId: string) => {
    try {
      // In production, call API
      // await axios.delete(`/api/v1/biometric/credentials/${credentialId}`);
      
      // For demo, remove from localStorage
      const updated = credentials.filter(c => c.credential_id !== credentialId);
      setCredentials(updated);
      localStorage.setItem(`biometric_credentials_${userId}`, JSON.stringify(updated));
      
      if (updated.length === 0) {
        localStorage.removeItem('has_biometric_credentials');
      }

      notification?.open({
        type: 'success',
        message: t('Success'),
        description: t('Biometric credential deleted successfully'),
      });
    } catch (error) {
      notification?.open({
        type: 'error',
        message: t('Error'),
        description: t('Failed to delete biometric credential'),
      });
    }
  };

  const getBrowserDeviceName = (): string => {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('iPhone')) return 'iPhone Touch ID/Face ID';
    if (userAgent.includes('iPad')) return 'iPad Touch ID/Face ID';
    if (userAgent.includes('Mac')) return 'Mac Touch ID';
    if (userAgent.includes('Windows')) return 'Windows Hello';
    if (userAgent.includes('Android')) return 'Android Biometric';
    
    return 'Platform Biometric';
  };

  const getDeviceIcon = (transportMethods: string[], attachment: string) => {
    if (attachment === 'platform') {
      return <MobileOutlined style={{ color: '#52c41a' }} />;
    }
    
    if (transportMethods.includes('usb')) {
      return <UsbOutlined style={{ color: '#1890ff' }} />;
    }
    
    if (transportMethods.includes('nfc') || transportMethods.includes('ble')) {
      return <WifiOutlined style={{ color: '#722ed1' }} />;
    }
    
    return <DesktopOutlined style={{ color: '#fa8c16' }} />;
  };

  const getSecurityBadge = (credential: BiometricCredential) => {
    if (credential.authenticator_attachment === 'platform') {
      return <Tag color="green" icon={<SecurityScanOutlined />}>{t('High Security')}</Tag>;
    }
    return <Tag color="blue">{t('Standard Security')}</Tag>;
  };

  const getUsageStats = () => {
    const totalUsage = credentials.reduce((sum, cred) => sum + cred.use_count, 0);
    const lastUsed = credentials
      .filter(c => c.last_used_at)
      .sort((a, b) => new Date(b.last_used_at!).getTime() - new Date(a.last_used_at!).getTime())[0];
    
    return { totalUsage, lastUsed };
  };

  const { totalUsage, lastUsed } = getUsageStats();

  return (
    <div>
      {/* Overview Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('Registered Devices')}
              value={credentials.length}
              prefix={<SafetyOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('Total Authentications')}
              value={totalUsage}
              prefix={<CheckCircleOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('Last Used')}
              value={lastUsed ? new Date(lastUsed.last_used_at!).toLocaleDateString() : t('Never')}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Settings Card */}
      <Card
        title={
          <Space>
            <SafetyOutlined />
            <span>{t('Biometric Security Management')}</span>
            {credentials.length > 0 && (
              <Tag color="green">{credentials.length} {t('active')}</Tag>
            )}
          </Space>
        }
        extra={
          biometricSupported && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setSetupModalVisible(true)}
            >
              {t('Add New Device')}
            </Button>
          )
        }
      >
        {!biometricSupported ? (
          <Alert
            message={t('Biometric Authentication Not Supported')}
            description={t('Your current browser or device does not support biometric authentication. Please use a compatible device or update your browser.')}
            type="warning"
            showIcon
            icon={<ExclamationCircleOutlined />}
          />
        ) : credentials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <SafetyOutlined style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '16px' }} />
            <Title level={4} type="secondary">
              {t('Enhance Your Security')}
            </Title>
            <Paragraph type="secondary" style={{ maxWidth: '400px', margin: '0 auto 24px' }}>
              {t('Set up biometric authentication for instant, secure access to your executive dashboard. No more passwords to remember.')}
            </Paragraph>
            <Button
              type="primary"
              size="large"
              icon={<SafetyOutlined />}
              onClick={() => setSetupModalVisible(true)}
            >
              {t('Set Up Biometric Authentication')}
            </Button>
          </div>
        ) : (
          <div>
            <Alert
              message={t('Security Status: Active')}
              description={t('Your biometric authentication is active and protecting your executive account.')}
              type="success"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            
            <List
              loading={loading}
              dataSource={credentials}
              renderItem={(credential) => (
                <List.Item
                  actions={[
                    <Popconfirm
                      title={t('Remove Biometric Device')}
                      description={t('This will permanently remove biometric access for this device. You can re-register it later.')}
                      onConfirm={() => handleDeleteCredential(credential.credential_id)}
                      okText={t('Remove')}
                      cancelText={t('Cancel')}
                      okButtonProps={{ danger: true }}
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                      />
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={getDeviceIcon(credential.transport_methods, credential.authenticator_attachment)}
                        style={{
                          backgroundColor: credential.authenticator_attachment === 'platform' ? '#f6ffed' : '#e6f7ff',
                          color: credential.authenticator_attachment === 'platform' ? '#52c41a' : '#1890ff',
                          fontSize: '18px',
                        }}
                      />
                    }
                    title={
                      <Space>
                        <span style={{ fontWeight: 600 }}>{credential.device_name}</span>
                        {getSecurityBadge(credential)}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={4}>
                        <Space wrap>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {t('Type')}: {credential.device_type}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {t('Attachment')}: {credential.authenticator_attachment}
                          </Text>
                        </Space>
                        <Space wrap>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            <ClockCircleOutlined style={{ marginRight: '4px' }} />
                            {credential.last_used_at 
                              ? t('Last used') + ': ' + new Date(credential.last_used_at).toLocaleDateString()
                              : t('Never used')
                            }
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {credential.use_count} {t('authentications')}
                          </Text>
                        </Space>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          {t('Registered')}: {new Date(credential.created_at).toLocaleDateString()}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Card>

      {/* Security Timeline */}
      {credentials.length > 0 && (
        <Card
          title={t('Security Timeline')}
          style={{ marginTop: '16px' }}
        >
          <Timeline
            items={[
              ...credentials.map(cred => ({
                color: 'green',
                children: (
                  <div>
                    <Text strong>{t('Biometric Device Registered')}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {cred.device_name} • {new Date(cred.created_at).toLocaleString()}
                    </Text>
                  </div>
                ),
              })),
              {
                color: 'blue',
                children: (
                  <div>
                    <Text strong>{t('Account Created')}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {t('Executive portal access granted')}
                    </Text>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* Setup Modal */}
      <Modal
        title={
          <Space>
            <SafetyOutlined style={{ color: '#52c41a' }} />
            <span>{t('Add Biometric Device')}</span>
          </Space>
        }
        open={setupModalVisible}
        onCancel={() => setSetupModalVisible(false)}
        footer={null}
        width={600}
      >
        <BiometricAuth
          onSuccess={handleSetupSuccess}
          onError={(error) => {
            notification?.open({
              type: 'error',
              message: t('Setup Failed'),
              description: error,
            });
          }}
          showManagement={false}
          userId={userId}
        />
      </Modal>
    </div>
  );
};

export default BiometricSettings;
