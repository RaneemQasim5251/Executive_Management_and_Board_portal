// صفحة تسجيل الدخول الحديثة / Modern Login Page
import React, { FC, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Divider,
  Alert,
  Checkbox,
  Row,
  Col,
  Switch,
  message,
} from 'antd';
import {
  MailOutlined,
  LockOutlined,
  GlobalOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  LoginOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import { useLogin } from '@refinedev/core';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;

export const ModernLogin: FC = () => {
  const { mutate: login, isLoading } = useLogin();
  const { t, i18n } = useTranslation();
  const [rememberMe, setRememberMe] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(true);

  // تسجيل الدخول / Login handler
  const onFinish = (values: any) => {
    console.log('🔐 Attempting login with:', values);
    login({ ...values, remember: rememberMe });
  };

  // تبديل اللغة / Toggle language
  const toggleLanguage = () => {
    const newLng = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLng);
    localStorage.setItem('i18nextLng', newLng);
    message.success(
      newLng === 'ar' 
        ? 'تم تغيير اللغة إلى العربية' 
        : 'Language changed to English'
    );
  };

  // متغيرات الحركة / Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0C085C 0%, #0095CE 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* خلفية متحركة / Animated Background */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: '100%',
          maxWidth: '450px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* شعار وعنوان / Logo and Title */}
        <motion.div 
          variants={itemVariants}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <motion.div
            variants={logoVariants}
            style={{
              width: '100px',
              height: '100px',
              margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
              borderRadius: '25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            🏢
          </motion.div>
          
          <Title 
            level={1} 
            style={{ 
              color: 'white', 
              margin: '0 0 8px 0',
              fontSize: '32px',
              fontWeight: '800',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            {t('Executive Management Portal')}
          </Title>
          
          <Text 
            style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontSize: '16px',
              fontWeight: '500',
            }}
          >
            {t('Board & C-Suite Command Center')}
          </Text>
        </motion.div>

        {/* بطاقة تسجيل الدخول / Login Card */}
        <motion.div variants={itemVariants}>
          <Card
            style={{
              borderRadius: '24px',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
            }}
            styles={{ body: { padding: '40px' } }}
          >
            {/* شريط علوي ملون / Top colored bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #0C085C, #0095CE)',
              }}
            />

            {/* تبديل اللغة / Language Toggle */}
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <Button
                type="text"
                icon={<GlobalOutlined />}
                onClick={toggleLanguage}
                style={{
                  color: '#667eea',
                  fontWeight: '500',
                  borderRadius: '8px',
                  padding: '4px 12px',
                }}
              >
                {i18n.language === 'ar' ? 'English' : 'العربية'}
              </Button>
            </div>

            {/* عنوان النموذج / Form Title */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Title level={3} style={{ color: '#1a1a1a', margin: '0 0 8px 0' }}>
                {t('Welcome back!')}
              </Title>
              <Text style={{ color: '#666', fontSize: '14px' }}>
                {t('Please sign in to your executive account')}
              </Text>
            </div>

            {/* بيانات اختبارية / Demo Credentials Alert */}
            {showDemoCredentials && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.5 }}
              >
                <Alert
                  message={
                    <div>
                      <Text strong style={{ color: '#667eea' }}>
                        {t('Demo Credentials')}:
                      </Text>
                      <br />
                      <Text code>board@company.com</Text> | <Text code>executive2024</Text>
                    </div>
                  }
                  type="info"
                  showIcon
                  closable
                  onClose={() => setShowDemoCredentials(false)}
                  style={{
                    marginBottom: '24px',
                    border: '1px solid #667eea30',
                    backgroundColor: '#667eea10',
                    borderRadius: '12px',
                  }}
                />
              </motion.div>
            )}

            {/* نموذج تسجيل الدخول / Login Form */}
            <Form
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              style={{ width: '100%' }}
            >
              <Form.Item
                name="email"
                label={
                  <Text strong style={{ color: '#1a1a1a' }}>
                    {t('Email')}
                  </Text>
                }
                rules={[
                  { required: true, message: t('Please input your email!') },
                  { type: 'email', message: t('Please enter a valid email!') },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#667eea' }} />}
                  placeholder={
                    i18n.language === 'ar' 
                      ? 'البريد الإلكتروني' 
                      : 'Enter your email'
                  }
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #f0f0f0',
                    padding: '12px 16px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#f0f0f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={
                  <Text strong style={{ color: '#1a1a1a' }}>
                    {t('Password')}
                  </Text>
                }
                rules={[{ required: true, message: t('Please input your password!') }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#667eea' }} />}
                  placeholder={
                    i18n.language === 'ar' 
                      ? 'كلمة المرور' 
                      : 'Enter your password'
                  }
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #f0f0f0',
                    padding: '12px 16px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#f0f0f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </Form.Item>

              {/* خيارات إضافية / Additional Options */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '24px' 
              }}>
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ color: '#666' }}
                >
                  {i18n.language === 'ar' ? 'تذكرني' : 'Remember me'}
                </Checkbox>
                
                <Button 
                  type="link" 
                  style={{ 
                    color: '#667eea', 
                    padding: 0,
                    fontWeight: '500',
                  }}
                >
                  {i18n.language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                </Button>
              </div>

              {/* زر تسجيل الدخول / Login Button */}
              <Form.Item style={{ margin: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"  
                  loading={isLoading}
                  block
                  style={{
                    height: '56px',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0C085C, #0095CE)',
                    border: 'none',
                    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                  icon={<LoginOutlined />}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                  }}
                >
                  {t('Sign In')}
                </Button>
              </Form.Item>
            </Form>

            <Divider style={{ margin: '32px 0 24px 0', color: '#ccc' }}>
              {i18n.language === 'ar' ? 'أو' : 'or'}
            </Divider>

            {/* أزرار تسجيل الدخول البديلة / Alternative Login Buttons */}
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Button
                  block
                  style={{
                    height: '48px',
                    borderRadius: '12px',
                    border: '2px solid #f0f0f0',
                    background: 'white',
                    color: '#666',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#4285f4';
                    e.currentTarget.style.color = '#4285f4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#f0f0f0';
                    e.currentTarget.style.color = '#666';
                  }}
                >
                  📧 Google
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  block
                  style={{
                    height: '48px',
                    borderRadius: '12px',
                    border: '2px solid #f0f0f0',
                    background: 'white',
                    color: '#666',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0078d4';
                    e.currentTarget.style.color = '#0078d4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#f0f0f0';
                    e.currentTarget.style.color = '#666';
                  }}
                >
                  💼 Microsoft
                </Button>
              </Col>
            </Row>

            {/* تذييل / Footer */}
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Text style={{ color: '#999', fontSize: '12px' }}>
                {i18n.language === 'ar' 
                  ? 'محمي بواسطة تشفير SSL وأمان المؤسسات'
                  : 'Protected by SSL encryption and enterprise security'
                }
              </Text>
              <br />
              <Space size="middle" style={{ marginTop: '8px' }}>
                <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
                <Text style={{ color: '#52c41a', fontSize: '12px', fontWeight: '500' }}>
                  {i18n.language === 'ar' ? 'اتصال آمن' : 'Secure Connection'}
                </Text>
              </Space>
            </div>
          </Card>
        </motion.div>

        {/* معلومات إضافية / Additional Info */}
        <motion.div 
          variants={itemVariants}
          style={{ textAlign: 'center', marginTop: '24px' }}
        >
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
            {i18n.language === 'ar' 
              ? 'صُمم خصيصاً للقادة التنفيذيين ومجالس الإدارة'
              : 'Designed exclusively for C-Level executives and board members'
            }
          </Text>
        </motion.div>
      </motion.div>

      {/* CSS للحركة المتحركة / CSS for animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
          }

          .ant-input:focus,
          .ant-input-password:focus {
            border-color: #667eea !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
          }

          .ant-input-affix-wrapper:focus,
          .ant-input-affix-wrapper-focused {
            border-color: #667eea !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
          }
        `}
      </style>
    </div>
  );
};