import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Checkbox,
  Space,
  Alert,
  Row,
  Col,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useLogin, useNotification } from '@refinedev/core';
import { motion } from 'framer-motion';
import { PalmLoginDemo } from '../../components/PalmLoginDemo';

const { Title, Text, Paragraph } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export const SimplifiedLogin: React.FC = () => {
  const { mutate: login, isLoading } = useLogin<LoginFormValues>();
  const { t, i18n } = useTranslation();
  const { open: notification } = useNotification();
  const [form] = Form.useForm();
  const [loginMethod, setLoginMethod] = useState<'password' | 'biometric'>('password');

  const toggleLanguage = () => {
    const newLng = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLng);
    localStorage.setItem('selectedLanguage', newLng);
    
    // Update document direction
    const isRTL = newLng === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = newLng;
  };

  const onFinish = (values: LoginFormValues) => {
    login(values);
  };

  const handleBiometricSuccess = (userData: any) => {
    localStorage.setItem('access_token', userData.tokens?.access_token || 'demo_token');
    localStorage.setItem('palm_demo_used', 'true');
    
    notification?.({
      type: 'success',
      message: t('Welcome Back'),
      description: t('Secure login successful'),
    });
    
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  const handleBiometricError = (error: string) => {
    notification?.({
      type: 'error',
      message: t('Login Failed'),
      description: error,
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        <Card
          style={{
            borderRadius: '16px',
            border: 'none',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            background: '#ffffff',
          }}
          styles={{ body: { padding: '40px' } }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img
              src="/aljeri-logo.png"
              alt="Al Jeri Logo"
              style={{
                height: '48px',
                width: 'auto',
                marginBottom: '16px',
                filter: 'drop-shadow(0 2px 4px rgba(12, 8, 92, 0.15))',
              }}
            />
            <Title level={3} style={{ 
              margin: 0, 
              color: '#1f2937', 
              fontWeight: 700,
              fontSize: '24px',
              lineHeight: 1.2,
            }}>
              {t('Executive Portal')}
            </Title>
            <Text style={{ 
              color: '#6b7280', 
              fontSize: '14px',
              display: 'block',
              marginTop: '4px',
            }}>
              {t('Al Jeri Group Leadership Platform')}
            </Text>
          </div>

          {/* Login Method Toggle */}
          <div style={{ marginBottom: '24px' }}>
            <Row gutter={8}>
              <Col span={12}>
                <Button
                  block
                  size="large"
                  type={loginMethod === 'password' ? 'primary' : 'default'}
                  icon={<LockOutlined />}
                  onClick={() => setLoginMethod('password')}
                  style={{
                    height: '48px',
                    borderRadius: '8px',
                    fontWeight: 600,
                  }}
                >
                  {t('Password')}
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  block
                  size="large"
                  type={loginMethod === 'biometric' ? 'primary' : 'default'}
                  icon={<SafetyOutlined />}
                  onClick={() => setLoginMethod('biometric')}
                  style={{
                    height: '48px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    background: loginMethod === 'biometric' 
                      ? 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)'
                      : undefined,
                    border: loginMethod === 'biometric' ? 'none' : undefined,
                  }}
                >
                  {t('Biometric')}
                </Button>
              </Col>
            </Row>
          </div>

          {/* Password Login Form */}
          {loginMethod === 'password' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Form
                form={form}
                name="login"
                onFinish={onFinish}
                layout="vertical"
                size="large"
                initialValues={{
                  email: "board@company.com",
                  password: "executive2024",
                  remember: true,
                }}
              >
                <Form.Item
                  label={<Text strong style={{ fontSize: '14px' }}>{t('Email Address')}</Text>}
                  name="email"
                  rules={[
                    { required: true, message: t('Please enter your email') },
                    { type: 'email', message: t('Please enter a valid email') },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                    placeholder={t('Enter your email')}
                    style={{
                      height: '48px',
                      borderRadius: '8px',
                      fontSize: '15px',
                      border: '1px solid #e5e7eb',
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label={<Text strong style={{ fontSize: '14px' }}>{t('Password')}</Text>}
                  name="password"
                  rules={[
                    { required: true, message: t('Please enter your password') },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                    placeholder={t('Enter your password')}
                    style={{
                      height: '48px',
                      borderRadius: '8px',
                      fontSize: '15px',
                      border: '1px solid #e5e7eb',
                    }}
                  />
                </Form.Item>

                <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                  <Col>
                    <Form.Item name="remember" valuePropName="checked" style={{ margin: 0 }}>
                      <Checkbox style={{ fontSize: '14px' }}>
                        {t('Keep me signed in')}
                      </Checkbox>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Button type="link" style={{ 
                      padding: 0, 
                      color: '#0C085C',
                      fontSize: '14px',
                    }}>
                      {t('Forgot password?')}
                    </Button>
                  </Col>
                </Row>

                <Form.Item style={{ margin: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    block
                    size="large"
                    style={{
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 600,
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #0C085C 0%, #363692 100%)',
                      border: 'none',
                      boxShadow: 'none',
                    }}
                  >
                    {isLoading ? t('Signing in...') : t('Sign In')}
                  </Button>
                </Form.Item>
              </Form>
            </motion.div>
          )}

          {/* Biometric Login */}
          {loginMethod === 'biometric' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PalmLoginDemo
                onSuccess={handleBiometricSuccess}
                onError={handleBiometricError}
              />
            </motion.div>
          )}

          {/* Language Toggle */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #f0f0f0',
          }}>
            <Button
              type="text"
              icon={<GlobalOutlined />}
              onClick={toggleLanguage}
              style={{
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              {i18n.language === 'ar' ? 'English' : 'العربية'}
            </Button>
          </div>

          {/* Demo Credentials */}
          {loginMethod === 'password' && (
            <Alert
              message={t('Demo Access')}
              description={
                <Space direction="vertical" size={4}>
                  <Text style={{ fontSize: '12px' }}>
                    <strong>{t('Email')}:</strong> board@company.com
                  </Text>
                  <Text style={{ fontSize: '12px' }}>
                    <strong>{t('Password')}:</strong> executive2024
                  </Text>
                </Space>
              }
              type="info"
              showIcon
              style={{
                marginTop: '16px',
                borderRadius: '8px',
                background: '#f0f9ff',
                border: '1px solid #bfdbfe',
              }}
            />
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default SimplifiedLogin;
