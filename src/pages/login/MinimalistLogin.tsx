import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLogin, useNotification } from '@refinedev/core';
import { PalmLoginDemo } from '../../components/PalmLoginDemo';
import '../../styles/minimalist.css';

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

export const MinimalistLogin: React.FC = () => {
  const { mutate: login, isLoading } = useLogin<LoginFormValues>();
  const { t, i18n } = useTranslation();
  const { open: notification } = useNotification();
  const [form] = Form.useForm();
  const [loginMethod, setLoginMethod] = useState<'password' | 'biometric'>('password');

  const toggleLanguage = () => {
    const newLng = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLng);
    localStorage.setItem('selectedLanguage', newLng);
    
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
      message: t('Access Granted'),
      description: t('Welcome to Executive Portal'),
    });
    
    setTimeout(() => {
      window.location.href = '/minimalist';
    }, 800);
  };

  const handleBiometricError = (error: string) => {
    notification?.({
      type: 'error',
      message: t('Access Denied'),
      description: error,
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
      }}
    >
      <div style={{ 
        width: '100%', 
        maxWidth: '400px',
        textAlign: 'center',
      }}>
        
        {/* Minimal Header */}
        <div style={{ marginBottom: '48px' }}>
          <img
            src="/aljeri-logo.png"
            alt="Al Jeri"
            style={{
              height: '32px',
              width: 'auto',
              marginBottom: '24px',
              opacity: 0.8,
            }}
          />
          <Title level={2} style={{ 
            margin: 0, 
            color: '#000000', 
            fontWeight: 600,
            fontSize: '24px',
            lineHeight: 1.2,
          }}>
            {t('Executive Portal')}
          </Title>
        </div>

        {/* Method Selection */}
        <div style={{ 
          marginBottom: '32px',
          display: 'flex',
          gap: '1px',
          background: '#f0f0f0',
        }}>
          <button
            onClick={() => setLoginMethod('password')}
            style={{
              flex: 1,
              padding: '12px',
              background: loginMethod === 'password' ? '#000000' : '#ffffff',
              color: loginMethod === 'password' ? '#ffffff' : '#000000',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
          >
            {t('Password')}
          </button>
          <button
            onClick={() => setLoginMethod('biometric')}
            style={{
              flex: 1,
              padding: '12px',
              background: loginMethod === 'biometric' ? '#000000' : '#ffffff',
              color: loginMethod === 'biometric' ? '#ffffff' : '#000000',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
          >
            {t('Biometric')}
          </button>
        </div>

        {/* Password Form */}
        {loginMethod === 'password' && (
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            initialValues={{
              email: "board@company.com",
              password: "executive2024",
            }}
            style={{ textAlign: 'left' }}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: t('Email required') },
                { type: 'email', message: t('Invalid email') },
              ]}
            >
              <Input
                placeholder={t('Email')}
                className="minimal-input"
                style={{
                  height: '48px',
                  border: '1px solid #e0e0e0',
                  background: '#ffffff',
                  fontSize: '16px',
                  padding: '0 16px',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: t('Password required') },
              ]}
            >
              <Input.Password
                placeholder={t('Password')}
                className="minimal-input"
                style={{
                  height: '48px',
                  border: '1px solid #e0e0e0',
                  background: '#ffffff',
                  fontSize: '16px',
                }}
              />
            </Form.Item>

            <Form.Item style={{ margin: '24px 0 0 0' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                className="minimal-button-primary"
                style={{
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 600,
                  background: '#0C085C',
                  border: 'none',
                  color: '#ffffff',
                }}
              >
                {isLoading ? t('Signing in') : t('Sign In')}
              </Button>
            </Form.Item>
          </Form>
        )}

        {/* Biometric Login */}
        {loginMethod === 'biometric' && (
          <div style={{ textAlign: 'center' }}>
            <PalmLoginDemo
              onSuccess={handleBiometricSuccess}
              onError={handleBiometricError}
            />
          </div>
        )}

        {/* Language Toggle */}
        <div style={{ 
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #f0f0f0',
        }}>
          <button
            onClick={toggleLanguage}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#666666',
              fontSize: '14px',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            {i18n.language === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>

        {/* Demo Info */}
        {loginMethod === 'password' && (
          <div style={{ 
            marginTop: '24px',
            padding: '16px',
            background: '#f8f8f8',
            border: '1px solid #f0f0f0',
            textAlign: 'left',
          }}>
            <Text style={{ fontSize: '12px', color: '#666666', display: 'block' }}>
              <strong>{t('Demo')}:</strong> board@company.com / executive2024
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalistLogin;
