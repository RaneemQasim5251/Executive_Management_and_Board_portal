import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Alert,
  List,
  Avatar,
  Popconfirm,
  Tag,
  Tooltip,
  Modal,
  Progress,
  Divider,
} from 'antd';
import {
  SafetyOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  MobileOutlined,
  DesktopOutlined,
  UsbOutlined,
  WifiOutlined,
  ClockCircleOutlined,
  SecurityScanOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNotification } from '@refinedev/core';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

// Types
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

interface WebAuthnSupport {
  supported: boolean;
  availableAuthenticators: string[];
  platformAuthenticator: boolean;
  conditionalMediation: boolean;
  userVerifying: boolean;
}

interface BiometricAuthProps {
  onSuccess?: (tokens: any) => void;
  onError?: (error: string) => void;
  showManagement?: boolean;
  userId?: string;
}

// Utility functions
const base64URLToArrayBuffer = (base64url: string): ArrayBuffer => {
  const padding = '='.repeat((4 - (base64url.length % 4)) % 4);
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/') + padding;
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return buffer;
};

const arrayBufferToBase64URL = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const BiometricAuth: React.FC<BiometricAuthProps> = ({
  onSuccess,
  onError,
  showManagement = false,
  userId,
}) => {
  const { t } = useTranslation();
  const { open: notification } = useNotification();
  
  const [support, setSupport] = useState<WebAuthnSupport>({
    supported: false,
    availableAuthenticators: [],
    platformAuthenticator: false,
    conditionalMediation: false,
    userVerifying: false,
  });
  
  const [credentials, setCredentials] = useState<BiometricCredential[]>([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [setupModalVisible, setSetupModalVisible] = useState(false);

  // Check WebAuthn support
  const checkWebAuthnSupport = useCallback(async () => {
    try {
      console.log('🔍 BiometricAuth: Checking WebAuthn support...');
      
      // Check if we're in a secure context
      const isSecureContext = window.isSecureContext;
      console.log('Secure context (HTTPS/localhost):', isSecureContext);
      
      if (!isSecureContext) {
        console.log('❌ WebAuthn requires HTTPS or localhost');
        setSupport({
          supported: false,
          availableAuthenticators: [],
          platformAuthenticator: false,
          conditionalMediation: false,
          userVerifying: false,
        });
        return;
      }
      
      // Check if WebAuthn API is available
      const webAuthnAvailable = !!(window.PublicKeyCredential && 
                                  typeof window.PublicKeyCredential === 'function');
      
      console.log('WebAuthn API available:', webAuthnAvailable);
      
      if (!webAuthnAvailable) {
        console.log('❌ WebAuthn API not available in this browser');
        setSupport({
          supported: false,
          availableAuthenticators: [],
          platformAuthenticator: false,
          conditionalMediation: false,
          userVerifying: false,
        });
        return;
      }

      // Check for platform authenticator (biometrics)
      console.log('🔍 Checking for platform authenticator...');
      const platformAuthenticator = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      console.log('Platform authenticator available:', platformAuthenticator);
      
      // Check for conditional mediation (if supported)
      let conditionalMediation = false;
      try {
        if (PublicKeyCredential.isConditionalMediationAvailable) {
          conditionalMediation = await PublicKeyCredential.isConditionalMediationAvailable();
          console.log('Conditional mediation available:', conditionalMediation);
        }
      } catch (error) {
        console.log('Conditional mediation check failed (not critical):', error);
      }

      const finalSupport = {
        supported: true,
        availableAuthenticators: platformAuthenticator ? ['platform'] : ['cross-platform'],
        platformAuthenticator,
        conditionalMediation,
        userVerifying: platformAuthenticator,
      };

      console.log('🖐️ Final biometric support status:', finalSupport);
      setSupport(finalSupport);
      
      if (platformAuthenticator) {
        console.log('✅ Biometric authentication is fully supported on this device!');
      } else {
        console.log('⚠️ Platform authenticator not available. Possible reasons:');
        console.log('- No biometric sensors on device');
        console.log('- Biometrics not set up in device settings');
        console.log('- Browser blocking biometric access');
        console.log('- Device in incognito/private mode');
      }
      
    } catch (error) {
      console.error('❌ Error checking WebAuthn support:', error);
      setSupport({
        supported: false,
        availableAuthenticators: [],
        platformAuthenticator: false,
        conditionalMediation: false,
        userVerifying: false,
      });
    }
  }, []);

  // Load user's biometric credentials
  const loadCredentials = useCallback(async () => {
    if (!userId || !showManagement) return;

    try {
      setLoading(true);
      const response = await axios.get('/api/v1/biometric/credentials', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.data.success) {
        setCredentials(response.data.data.credentials);
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
  }, [userId, showManagement, notification, t]);

  useEffect(() => {
    checkWebAuthnSupport();
    loadCredentials();
  }, [checkWebAuthnSupport, loadCredentials]);

  // Register new biometric credential
  const handleRegister = async () => {
    if (!support.supported) {
      notification?.open({
        type: 'error',
        message: t('Not Supported'),
        description: t('Biometric authentication is not supported in this browser'),
      });
      return;
    }

    try {
      setRegistering(true);

      // Step 1: Get registration options from server
      const optionsResponse = await axios.post('/api/v1/biometric/register/begin', {
        userDisplayName: 'Executive User',
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      const options = optionsResponse.data.data.options;

      // Convert base64url strings to ArrayBuffers
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        ...options,
        challenge: base64URLToArrayBuffer(options.challenge),
        user: {
          ...options.user,
          id: base64URLToArrayBuffer(options.user.id),
        },
        excludeCredentials: options.excludeCredentials?.map((cred: any) => ({
          ...cred,
          id: base64URLToArrayBuffer(cred.id),
        })),
      };

      // Step 2: Create credential with WebAuthn API
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('No credential created');
      }

      // Step 3: Send credential to server for verification
      const credentialForServer = {
        id: credential.id,
        rawId: arrayBufferToBase64URL(credential.rawId),
        response: {
          clientDataJSON: arrayBufferToBase64URL(credential.response.clientDataJSON),
          attestationObject: arrayBufferToBase64URL((credential.response as any).attestationObject),
          transports: (credential.response as any).getTransports?.() || ['internal'],
        },
        type: credential.type,
        clientExtensionResults: credential.getClientExtensionResults(),
        authenticatorAttachment: (credential as any).authenticatorAttachment,
      };

      const verificationResponse = await axios.post('/api/v1/biometric/register/complete', {
        credential: credentialForServer,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (verificationResponse.data.success) {
        notification?.open({
          type: 'success',
          message: t('Success'),
          description: t('Biometric authentication registered successfully'),
        });
        
        // Reload credentials
        await loadCredentials();
        setSetupModalVisible(false);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || error.message || t('Registration failed');
      
      notification?.open({
        type: 'error',
        message: t('Registration Failed'),
        description: errorMessage,
      });
      
      onError?.(errorMessage);
    } finally {
      setRegistering(false);
    }
  };

  // Authenticate with biometrics
  const handleAuthenticate = async () => {
    if (!support.supported) {
      notification?.open({
        type: 'error',
        message: t('Not Supported'),
        description: t('Biometric authentication is not supported in this browser'),
      });
      return;
    }

    try {
      setAuthenticating(true);

      // Step 1: Get authentication options from server
      const optionsResponse = await axios.post('/api/v1/biometric/authenticate/begin', {
        userId: userId,
      });

      const options = optionsResponse.data.data.options;

      // Convert base64url strings to ArrayBuffers
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        ...options,
        challenge: base64URLToArrayBuffer(options.challenge),
        allowCredentials: options.allowCredentials?.map((cred: any) => ({
          ...cred,
          id: base64URLToArrayBuffer(cred.id),
        })),
      };

      // Step 2: Get assertion with WebAuthn API
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      }) as PublicKeyCredential;

      if (!assertion) {
        throw new Error('No assertion received');
      }

      // Step 3: Send assertion to server for verification
      const credentialForServer = {
        id: assertion.id,
        rawId: arrayBufferToBase64URL(assertion.rawId),
        response: {
          clientDataJSON: arrayBufferToBase64URL(assertion.response.clientDataJSON),
          authenticatorData: arrayBufferToBase64URL((assertion.response as any).authenticatorData),
          signature: arrayBufferToBase64URL((assertion.response as any).signature),
          userHandle: (assertion.response as any).userHandle 
            ? arrayBufferToBase64URL((assertion.response as any).userHandle) 
            : undefined,
        },
        type: assertion.type,
        clientExtensionResults: assertion.getClientExtensionResults(),
        authenticatorAttachment: (assertion as any).authenticatorAttachment,
      };

      const verificationResponse = await axios.post('/api/v1/biometric/authenticate/complete', {
        credential: credentialForServer,
      });

      if (verificationResponse.data.success) {
        notification?.open({
          type: 'success',
          message: t('Success'),
          description: t('Biometric authentication successful'),
        });
        
        onSuccess?.(verificationResponse.data.data.tokens);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      const errorMessage = error.response?.data?.error || error.message || t('Authentication failed');
      
      notification?.open({
        type: 'error',
        message: t('Authentication Failed'),
        description: errorMessage,
      });
      
      onError?.(errorMessage);
    } finally {
      setAuthenticating(false);
    }
  };

  // Delete credential
  const handleDeleteCredential = async (credentialId: string) => {
    try {
      await axios.delete(`/api/v1/biometric/credentials/${credentialId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      notification?.open({
        type: 'success',
        message: t('Success'),
        description: t('Biometric credential deleted successfully'),
      });

      // Reload credentials
      await loadCredentials();
    } catch (error: any) {
      console.error('Delete error:', error);
      notification?.open({
        type: 'error',
        message: t('Error'),
        description: t('Failed to delete biometric credential'),
      });
    }
  };

  // Get device icon based on transport methods
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

  // Get security level badge
  const getSecurityBadge = (credential: BiometricCredential) => {
    if (credential.authenticator_attachment === 'platform') {
      return <Tag color="green">{t('High Security')}</Tag>;
    }
    return <Tag color="blue">{t('Standard Security')}</Tag>;
  };

  if (!support.supported) {
    return (
      <Alert
        message={t('Biometric Authentication Not Available')}
        description={t('Your browser or device does not support biometric authentication. Please use traditional login methods.')}
        type="warning"
        showIcon
        icon={<ExclamationCircleOutlined />}
      />
    );
  }

  return (
    <div>
      {/* Quick Authentication Section */}
      {!showManagement && (
        <Card
          title={
            <Space>
              <SafetyOutlined style={{ color: '#52c41a' }} />
              <span>{t('Biometric Authentication')}</span>
              <Tag color="green">{t('Secure')}</Tag>
            </Space>
          }
          style={{ marginBottom: 16 }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Paragraph type="secondary">
              {t('Use your fingerprint, face, or palm biometrics for secure and convenient access to the Executive Portal.')}
            </Paragraph>
            
            <Button
              type="primary"
              size="large"
              icon={<SafetyOutlined />}
              loading={authenticating}
              onClick={handleAuthenticate}
              style={{
                background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                border: 'none',
                height: '48px',
                borderRadius: '8px',
                fontWeight: 600,
              }}
              block
            >
              {authenticating ? t('Authenticating...') : t('Login with Biometrics')}
            </Button>
            
            {support.platformAuthenticator && (
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  <ShieldCheckOutlined style={{ marginRight: '4px' }} />
                  {t('Touch sensor or look at camera when prompted')}
                </Text>
              </div>
            )}
          </Space>
        </Card>
      )}

      {/* Credential Management Section */}
      {showManagement && (
        <Card
          title={
            <Space>
              <SafetyOutlined />
              <span>{t('Biometric Security')}</span>
              {credentials.length > 0 && (
                <Tag color="green">{credentials.length} {t('registered')}</Tag>
              )}
            </Space>
          }
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setSetupModalVisible(true)}
              disabled={!support.platformAuthenticator}
            >
              {t('Add Biometric')}
            </Button>
          }
        >
          {credentials.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <SafetyOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
              <Title level={4} type="secondary">
                {t('No Biometric Authentication Registered')}
              </Title>
              <Paragraph type="secondary">
                {t('Set up biometric authentication for faster and more secure access to your executive dashboard.')}
              </Paragraph>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setSetupModalVisible(true)}
                disabled={!support.platformAuthenticator}
              >
                {t('Set Up Biometric Login')}
              </Button>
            </div>
          ) : (
            <List
              dataSource={credentials}
              renderItem={(credential) => (
                <List.Item
                  actions={[
                    <Tooltip title={t('Delete this biometric credential')}>
                      <Popconfirm
                        title={t('Delete Biometric Credential')}
                        description={t('Are you sure you want to remove this biometric authentication method?')}
                        onConfirm={() => handleDeleteCredential(credential.credential_id)}
                        okText={t('Delete')}
                        cancelText={t('Cancel')}
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          size="small"
                        />
                      </Popconfirm>
                    </Tooltip>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={getDeviceIcon(credential.transport_methods, credential.authenticator_attachment)}
                        style={{
                          backgroundColor: credential.authenticator_attachment === 'platform' ? '#f6ffed' : '#e6f7ff',
                          color: credential.authenticator_attachment === 'platform' ? '#52c41a' : '#1890ff',
                        }}
                      />
                    }
                    title={
                      <Space>
                        <span>{credential.device_name}</span>
                        {getSecurityBadge(credential)}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={4}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {t('Device Type')}: {credential.device_type} • {t('Attachment')}: {credential.authenticator_attachment}
                        </Text>
                        <Space size={16}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            <ClockCircleOutlined style={{ marginRight: '4px' }} />
                            {credential.last_used_at 
                              ? t('Last used') + ': ' + new Date(credential.last_used_at).toLocaleDateString()
                              : t('Never used')
                            }
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {t('Used')} {credential.use_count} {t('times')}
                          </Text>
                        </Space>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      )}

      {/* Setup Modal */}
      <Modal
        title={
          <Space>
            <SafetyOutlined style={{ color: '#52c41a' }} />
            <span>{t('Set Up Biometric Authentication')}</span>
          </Space>
        }
        open={setupModalVisible}
        onCancel={() => setSetupModalVisible(false)}
        footer={null}
        width={500}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          
          <Alert
            message={t('Executive-Grade Security')}
            description={t('Biometric authentication provides the highest level of security for executive access. Your biometric data never leaves your device.')}
            type="info"
            showIcon
            icon={<SecurityScanOutlined />}
          />

          {/* Setup Steps */}
          <div>
            <Title level={5}>{t('Setup Process')}</Title>
            <div style={{ marginLeft: '16px' }}>
              <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: '#52c41a', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>1</div>
                <Text>{t('Click "Register Biometric" button')}</Text>
              </div>
              <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: '#1890ff', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>2</div>
                <Text>{t('Follow your device\'s biometric prompt')}</Text>
              </div>
              <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: '#722ed1', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>3</div>
                <Text>{t('Complete setup and start using biometric login')}</Text>
              </div>
            </div>
          </div>

          {/* Device Support Info */}
          <Card size="small" style={{ background: '#fafafa' }}>
            <Title level={5} style={{ marginBottom: '8px' }}>{t('Device Compatibility')}</Title>
            <Space direction="vertical" size={4}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>{t('Platform Biometrics')}:</Text>
                <Text style={{ color: support.platformAuthenticator ? '#52c41a' : '#ff4d4f' }}>
                  {support.platformAuthenticator ? t('Supported') : t('Not Available')}
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>{t('Touch ID / Face ID')}:</Text>
                <Text style={{ color: support.platformAuthenticator ? '#52c41a' : '#d9d9d9' }}>
                  {support.platformAuthenticator ? t('Available') : t('N/A')}
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>{t('Windows Hello')}:</Text>
                <Text style={{ color: support.platformAuthenticator ? '#52c41a' : '#d9d9d9' }}>
                  {support.platformAuthenticator ? t('Available') : t('N/A')}
                </Text>
              </div>
            </Space>
          </Card>

          {/* Action Buttons */}
          <Space style={{ width: '100%', justifyContent: 'center' }}>
            <Button
              onClick={() => setSetupModalVisible(false)}
            >
              {t('Cancel')}
            </Button>
            <Button
              type="primary"
              icon={<SafetyOutlined />}
              loading={registering}
              onClick={handleRegister}
              disabled={!support.platformAuthenticator}
            >
              {registering ? t('Registering...') : t('Register Biometric')}
            </Button>
          </Space>

          {registering && (
            <div style={{ textAlign: 'center' }}>
              <Progress 
                type="circle" 
                percent={75} 
                size={60}
                strokeColor="#52c41a"
                showInfo={false}
              />
              <div style={{ marginTop: '8px' }}>
                <Text type="secondary">{t('Follow the prompts on your device...')}</Text>
              </div>
            </div>
          )}
        </Space>
      </Modal>
    </div>
  );
};

export default BiometricAuth;
