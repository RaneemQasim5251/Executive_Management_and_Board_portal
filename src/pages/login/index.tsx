import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Typography, 
  Card, 
  message, 
  Divider 
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  LoginOutlined 
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { usePortalTheme } from '../../contexts/PortalThemeContext';

const { Title, Text, Link } = Typography;

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, setTheme, setIsLoggedIn } = usePortalTheme();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      // Simulate login (replace with actual authentication logic)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set login state and token
      localStorage.setItem('user-token', 'simulated-token');
      setIsLoggedIn(true);

      // Update login method in theme
      setTheme({
        ...theme,
        loginMethod: 'password'
      });

      // Show success message
      message.success(t('Secure login successful'));
      
      // Navigate to dashboard
      navigate('/');
    } catch (error) {
      message.error(t('Login Failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: theme.mode === 'dark' ? '#121212' : '#f0f2f5'
      }}
    >
      <Card 
        style={{ 
          width: 400, 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: 12
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>{t('Board of Directors & C-Suite Access')}</Title>
          <Text type="secondary">{t('Strategic Command Center')}</Text>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { 
                required: true, 
                message: t('Please input your email!') 
              },
              { 
                type: 'email', 
                message: t('Please enter a valid email!') 
              }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder={t('Enter your email')} 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ 
              required: true, 
              message: t('Please input your password!') 
            }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder={t('Enter your password')} 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<LoginOutlined />}
              loading={loading}
              block
            >
              {t('Sign In')}
            </Button>
          </Form.Item>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: 16 
          }}>
            <Link href="#">{t('Forgot Password?')}</Link>
            <Text type="secondary">{t('Protected by SSL encryption and enterprise security')}</Text>
          </div>

          <Divider>{t('or')}</Divider>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            gap: 16 
          }}>
            <Button 
              block 
              onClick={() => {
                // Update login method and navigate to biometric login
                setTheme({
                  ...theme,
                  loginMethod: 'biometric'
                });
                navigate('/login-world-class');
              }}
            >
              {t('Use Biometric Login')}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};