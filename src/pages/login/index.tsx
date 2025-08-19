import { FC, useState, useEffect } from "react";
import { useLogin, useNotification } from "@refinedev/core";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Checkbox,
  Space,
  Divider,
  Alert,
  Row,
  Col,
  Tabs,
  Modal,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GlobalOutlined,
  SafetyOutlined,
  CheckOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PalmLoginDemo } from "../../components/PalmLoginDemo";

const { Title, Text, Paragraph } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export const Login: FC = () => {
  const { mutate: login, isLoading } = useLogin<LoginFormValues>();
  const { t, i18n } = useTranslation();
  const { open: notification } = useNotification();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('traditional');
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [showBiometricInfo, setShowBiometricInfo] = useState(false);

  const toggleLanguage = () => {
    const currentLng = i18n.language;
    const newLng = currentLng === 'ar' ? 'en' : 'ar';
    const isRTL = newLng === 'ar';
    
    // Update language and persist choice
    i18n.changeLanguage(newLng);
    localStorage.setItem('i18nextLng', newLng);
    localStorage.setItem('selectedLanguage', newLng);
    
    // Update document direction and attributes immediately
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLng);
    document.body.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.body.style.direction = isRTL ? 'rtl' : 'ltr';
    
    // Update font family
    document.body.style.fontFamily = isRTL 
      ? "'Noto Sans Arabic', 'Cairo', 'Amiri', system-ui, -apple-system, sans-serif"
      : "'Inter', system-ui, -apple-system, sans-serif";
  };

  // Always enable palm demo (no HTTPS required)
  useEffect(() => {
    console.log('🖐️ Palm Authentication Demo - Always Available!');
    setBiometricSupported(true);
    
    // Auto-switch to biometric tab if user has used it before
    if (localStorage.getItem('palm_demo_used') === 'true') {
      console.log('✅ Auto-switching to palm demo tab');
      setActiveTab('biometric');
    }
  }, []);

  const onFinish = (values: LoginFormValues) => {
    login(values);
  };

  const handleBiometricSuccess = (userData: any) => {
    // Store demo user data and tokens
    localStorage.setItem('access_token', userData.tokens?.access_token || 'demo_token');
    localStorage.setItem('refresh_token', userData.tokens?.refresh_token || 'demo_refresh');
    localStorage.setItem('palm_demo_used', 'true');
    localStorage.setItem('demo_user', JSON.stringify(userData));
    
    notification?.({
      type: 'success',
      message: t('Welcome Back') + ', ' + userData.name,
      description: t('Palm authentication successful - Demo Mode'),
    });
    
    // Simulate login success and redirect
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  const handleBiometricError = (error: string) => {
    notification?.({
      type: 'error',
      message: t('Authentication Failed'),
      description: error,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.2,
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0C085C",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Decorations */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: "300px",
          height: "300px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{
          position: "absolute",
          bottom: "15%",
          left: "15%",
          width: "250px",
          height: "250px",
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "50%",
          filter: "blur(50px)",
        }}
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{
          position: "absolute",
          top: "50%",
          left: "5%",
          width: "100px",
          height: "100px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "50%",
          filter: "blur(20px)",
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <motion.div variants={cardVariants}>
          <Card
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
            }}
            styles={{ body: { padding: "48px" } }}
          >
            {/* Header Section */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div
                style={{
                  fontSize: "64px",
                  marginBottom: "16px",
                  background: "#0C085C",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                🏢
              </div>
              <Title
                level={2}
                style={{
                  margin: 0,
                  fontSize: "32px",
                  fontWeight: "700",
                  background: "#0C085C",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t("Executive Management Portal")}
              </Title>
              <Text
                style={{
                  color: "#6b7280",
                  fontSize: "16px",
                  fontWeight: "500",
                  display: "block",
                  marginTop: "8px",
                }}
              >
                {t("Board of Directors & C-Suite Access")}
              </Text>
              <Text
                style={{
                  color: "#9ca3af",
                  fontSize: "14px",
                  display: "block",
                  marginTop: "4px",
                }}
              >
                {t("Strategic Command Center")}
              </Text>
            </div>

            <Divider style={{ margin: "32px 0" }} />

            {/* Login Tabs */}
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              centered
              items={[
                {
                  key: 'traditional',
                  label: (
                    <Space>
                      <LockOutlined />
                      {t('Password')}
                    </Space>
                  ),
                  children: (
                    <Form
                      form={form}
                      name="login"
                      onFinish={onFinish}
                      autoComplete="off"
                      layout="vertical"
                      size="large"
                      initialValues={{
                        email: "board@company.com",
                        password: "executive2024",
                        remember: true,
                      }}
                    >
                      <Form.Item
                        label={<Text strong>{t("Email")}</Text>}
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: t("Please input your email!"),
                          },
                          {
                            type: "email",
                            message: t("Please enter a valid email!"),
                          },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined style={{ color: "#1e3a8a" }} />}
                          placeholder={t("Email")}
                          style={{
                            borderRadius: "12px",
                            padding: "12px 16px",
                            fontSize: "16px",
                          }}
                        />
                      </Form.Item>

                      <Form.Item
                        label={<Text strong>{t("Password")}</Text>}
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: t("Please input your password!"),
                          },
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined style={{ color: "#1e3a8a" }} />}
                          placeholder={t("Password")}
                          iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                          }
                          style={{
                            borderRadius: "12px",
                            padding: "12px 16px",
                            fontSize: "16px",
                          }}
                        />
                      </Form.Item>

                      <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
                        <Col>
                          <Form.Item name="remember" valuePropName="checked" style={{ margin: 0 }}>
                            <Checkbox>{t("Remember me")}</Checkbox>
                          </Form.Item>
                        </Col>
                        <Col>
                          <Button type="link" style={{ padding: 0, color: "#1e3a8a" }}>
                            {t("Forgot Password?")}
                          </Button>
                        </Col>
                      </Row>

                      <Form.Item style={{ margin: 0 }}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={isLoading}
                          style={{
                            width: "100%",
                            height: "50px",
                            fontSize: "16px",
                            fontWeight: "600",
                            borderRadius: "12px",
                            background: "#0C085C",
                            border: "none",
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.6)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                          }}
                        >
                          {t("Sign In")}
                        </Button>
                      </Form.Item>
                    </Form>
                  ),
                },
                {
                  key: 'biometric',
                  label: (
                    <Space>
                      <SafetyOutlined />
                      {t('Biometric')}
                      {biometricSupported && <SecurityScanOutlined style={{ color: '#52c41a' }} />}
                    </Space>
                  ),
                  children: (
                    <div style={{ minHeight: '300px' }}>
                      <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                          <motion.div
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotateY: [0, 10, 0]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            style={{ fontSize: '64px', marginBottom: '16px' }}
                          >
                            🖐️
                          </motion.div>
                          <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                            {t('Palm Authentication Demo')}
                          </Title>
                          <Text type="secondary">
                            {t('Advanced biometric security for executives')}
                          </Text>
                        </div>
                        
                        <PalmLoginDemo
                          onSuccess={handleBiometricSuccess}
                          onError={handleBiometricError}
                        />
                        
                        <div style={{ textAlign: 'center' }}>
                          <Button
                            type="link"
                            icon={<CheckOutlined />}
                            onClick={() => setShowBiometricInfo(true)}
                            style={{ color: '#1890ff' }}
                          >
                            {t('How does biometric login work?')}
                          </Button>
                        </div>
                      </Space>
                    </div>
                  ),
                },
              ]}
            />

            <Divider style={{ margin: "32px 0" }} />

            {/* Language Toggle */}
            <div style={{ textAlign: "center" }}>
              <Button
                                  type="default"
                icon={<GlobalOutlined />}
                onClick={toggleLanguage}
                style={{
                                      borderColor: "#0C085C",
                    color: "#0C085C",
                  borderRadius: "8px",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                                      e.currentTarget.style.background = "#0C085C";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                                      e.currentTarget.style.color = "#0C085C";
                }}
              >
                {i18n.language === 'ar' ? 'English' : 'العربية'}
              </Button>
            </div>

            {/* Demo Credentials */}
            <Alert
              message={t("Demo Credentials")}
              description={
                <div>
                  <Paragraph style={{ margin: 0, fontSize: "12px" }}>
                    <strong>{t("Email")}:</strong> board@company.com
                  </Paragraph>
                  <Paragraph style={{ margin: 0, fontSize: "12px" }}>
                    <strong>{t("Password")}:</strong> executive2024
                  </Paragraph>
                  {biometricSupported && (
                    <Paragraph style={{ margin: 0, fontSize: "12px", color: '#52c41a' }}>
                      <strong>{t("Biometric")}:</strong> {t('Available on this device')}
                    </Paragraph>
                  )}
                </div>
              }
              type="info"
              showIcon
              style={{
                marginTop: "24px",
                borderRadius: "8px",
                backgroundColor: "rgba(102, 126, 234, 0.05)",
                border: "1px solid rgba(102, 126, 234, 0.1)",
              }}
            />
          </Card>
        </motion.div>

        {/* Biometric Information Modal */}
        <Modal
          title={
            <Space>
              <CheckOutlined style={{ color: '#52c41a' }} />
              <span>{t('Biometric Authentication Guide')}</span>
            </Space>
          }
          open={showBiometricInfo}
          onCancel={() => setShowBiometricInfo(false)}
          footer={[
            <Button key="close" onClick={() => setShowBiometricInfo(false)}>
              {t('Close')}
            </Button>
          ]}
          width={600}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            
            <Alert
              message={t('Executive-Grade Security')}
              description={t('Biometric authentication provides the highest level of security for executive access. Your biometric data is processed locally on your device and never transmitted to our servers.')}
              type="success"
              showIcon
              icon={<SecurityScanOutlined />}
            />

            <div>
              <Title level={5}>{t('Supported Biometric Methods')}</Title>
              <ul style={{ paddingLeft: '20px' }}>
                <li><Text>{t('Fingerprint recognition (Touch ID)')}</Text></li>
                <li><Text>{t('Facial recognition (Face ID)')}</Text></li>
                <li><Text>{t('Palm vein scanning')}</Text></li>
                <li><Text>{t('Windows Hello biometrics')}</Text></li>
                <li><Text>{t('Android biometric authentication')}</Text></li>
              </ul>
            </div>

            <div>
              <Title level={5}>{t('How It Works')}</Title>
              <ol style={{ paddingLeft: '20px' }}>
                <li><Text>{t('Your device captures your biometric signature locally')}</Text></li>
                <li><Text>{t('A cryptographic key pair is generated on your device')}</Text></li>
                <li><Text>{t('Only the public key is shared with our servers')}</Text></li>
                <li><Text>{t('Your biometric data never leaves your device')}</Text></li>
                <li><Text>{t('Authentication happens through cryptographic challenge-response')}</Text></li>
              </ol>
            </div>

            <div>
              <Title level={5}>{t('Benefits for Executives')}</Title>
              <ul style={{ paddingLeft: '20px' }}>
                <li><Text>{t('Faster access to critical business information')}</Text></li>
                <li><Text>{t('Enhanced security without password complexity')}</Text></li>
                <li><Text>{t('Audit trail with biometric authentication logs')}</Text></li>
                <li><Text>{t('Compliance with enterprise security standards')}</Text></li>
                <li><Text>{t('Seamless experience across devices')}</Text></li>
              </ul>
            </div>

          </Space>
        </Modal>
      </motion.div>
    </div>
  );
};