import { FC } from "react";
import { useLogin } from "@refinedev/core";
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
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GlobalOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export const Login: FC = () => {
  const { mutate: login, isLoading } = useLogin<LoginFormValues>();
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();

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

  const onFinish = (values: LoginFormValues) => {
    login(values);
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

            {/* Login Form */}
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
      </motion.div>
    </div>
  );
};