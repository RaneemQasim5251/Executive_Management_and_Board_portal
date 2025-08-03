import { FC, useState, useEffect } from "react";
import { 
  Row, 
  Col, 
  Card, 
 
  Typography, 
  Space, 
  Button, 
  Progress, 
  Avatar, 
  Tag, 
  Badge,
  Dropdown,
  MenuProps,
  Divider
} from "antd";
import {
  TeamOutlined,
  DollarOutlined,
  ProjectOutlined,
  TrophyOutlined,
  MoreOutlined,
  EyeOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  BellOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FireOutlined,
  ThunderboltOutlined,
  StarOutlined,
  ArrowUpOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import {
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AchievementSystem } from "../../components/AchievementSystem";

const { Title, Text } = Typography;

// Modern Data
const revenueData = [
  { month: "Jan", revenue: 4.2, target: 4.0, growth: 5 },
  { month: "Feb", revenue: 4.8, target: 4.2, growth: 14 },
  { month: "Mar", revenue: 5.2, target: 4.5, growth: 16 },
  { month: "Apr", revenue: 5.8, target: 4.8, growth: 21 },
  { month: "May", revenue: 6.2, target: 5.0, growth: 24 },
  { month: "Jun", revenue: 6.8, target: 5.5, growth: 24 },
];

// Move projectsData inside component to access t function
// const projectsData will be defined inside component



// Move upcomingEvents inside component to access t function
// const upcomingEvents will be defined inside component

// Move quickActions inside component to access t function
// const quickActions will be defined inside component

export const ModernExecutiveDashboard: FC = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  
  // Force cache refresh with language check
  console.log("🌍 Current language:", i18n.language);

  // Define data arrays inside component to access t function
  const projectsData = [
    { name: t("AI & Automation"), value: 35, color: "#0C085C", trend: "+12%" },
    { name: t("Digital Transformation"), value: 28, color: "#0095CE", trend: "+8%" },
    { name: t("Market Expansion"), value: 22, color: "#363692", trend: "+15%" },
    { name: t("Innovation Lab"), value: 15, color: "#FF2424", trend: "+5%" },
  ];

  const upcomingEvents = [
    { id: 1, title: t("Board Meeting Q4 Review"), time: t("Today") + ", 2:00 PM", type: "critical", attendees: 8 },
    { id: 2, title: t("Digital Strategy Presentation"), time: t("Tomorrow") + ", 10:00 AM", type: "high", attendees: 12 },
    { id: 3, title: t("Investor Relations Call"), time: "Dec 15, 3:00 PM", type: "medium", attendees: 6 },
  ];

  const quickActions = [
    { icon: <ProjectOutlined />, label: t("New Initiative"), color: "#0C085C" },
    { icon: <TeamOutlined />, label: t("Team Review"), color: "#0095CE" },
    { icon: <CalendarOutlined />, label: t("Schedule Meeting"), color: "#363692" },
    { icon: <BellOutlined />, label: t("Send Update"), color: "#FF2424" },
  ];
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [achievementVisible, setAchievementVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardStyle = {
    borderRadius: "16px",
    border: "1px solid #f0f0f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    transition: "all 0.3s ease",
  };

  const headerMenuItems: MenuProps['items'] = [
    { key: 'export', icon: <DownloadOutlined />, label: 'Export Report' },
    { key: 'share', icon: <ShareAltOutlined />, label: 'Share Dashboard' },
    { key: 'view', icon: <EyeOutlined />, label: 'Full Screen' },
  ];

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
                          <ThunderboltOutlined style={{ fontSize: '48px', color: '#0C085C' }} />
        </motion.div>
        <Text style={{ fontSize: '16px', color: '#666' }}>{t("Loading")}...</Text>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
                style={{ 
            padding: "24px",
            background: "linear-gradient(135deg, #0C085C 0%, #0095CE 100%)",
            minHeight: "100vh"
          }}
    >
      {/* STUNNING LOGO HERO SECTION */}
      <motion.div 
        variants={itemVariants}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Card 
          style={{ 
            background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,255,0.95) 50%, rgba(240,245,255,0.9) 100%)",
            backdropFilter: "blur(40px)",
            borderRadius: "32px",
            border: "2px solid rgba(12, 8, 92, 0.08)",
            boxShadow: "0 30px 80px rgba(12, 8, 92, 0.25), 0 0 0 1px rgba(255,255,255,0.5) inset",
            marginBottom: "40px",
            overflow: "hidden",
            position: "relative",
            transform: "perspective(1000px) rotateX(2deg)",
            transition: "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)"
          }}
          styles={{ body: { padding: "80px 60px" } }}
          className="hero-card"
        >
          {/* STUNNING Background Effects */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 30%, rgba(12, 8, 92, 0.08) 0%, transparent 40%),
              radial-gradient(circle at 80% 20%, rgba(0, 149, 206, 0.06) 0%, transparent 40%),
              radial-gradient(circle at 60% 80%, rgba(54, 54, 146, 0.04) 0%, transparent 40%),
              linear-gradient(45deg, rgba(12, 8, 92, 0.02) 0%, transparent 50%),
              conic-gradient(from 45deg at 50% 50%, rgba(0, 149, 206, 0.03) 0deg, transparent 120deg, rgba(12, 8, 92, 0.03) 240deg, transparent 360deg)
            `,
            zIndex: 0
          }} />
          
          {/* Floating Particles */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(2px 2px at 20% 30%, rgba(12, 8, 92, 0.3), transparent),
              radial-gradient(2px 2px at 40% 70%, rgba(0, 149, 206, 0.4), transparent),
              radial-gradient(1px 1px at 60% 15%, rgba(54, 54, 146, 0.3), transparent),
              radial-gradient(1px 1px at 80% 50%, rgba(12, 8, 92, 0.2), transparent),
              radial-gradient(2px 2px at 90% 80%, rgba(0, 149, 206, 0.3), transparent)
            `,
            backgroundSize: "100px 100px, 120px 120px, 80px 80px, 110px 110px, 90px 90px",
            animation: "float-particles 20s ease-in-out infinite",
            zIndex: 1
          }} />
          
          {/* Animated Light Rays */}
          <div style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            right: "-50%",
            bottom: "-50%",
            background: "conic-gradient(from 0deg, transparent 70deg, rgba(0, 149, 206, 0.1) 110deg, transparent 180deg, rgba(12, 8, 92, 0.08) 250deg, transparent 320deg)",
            animation: "rotate-rays 30s linear infinite",
            zIndex: 0
          }} />
          
          {/* Content Container */}
          <div style={{ 
            position: "relative", 
            zIndex: 1, 
            textAlign: "center",
            direction: i18n.language === 'ar' ? "rtl" : "ltr" 
          }}>
            
            {/* Alerts Section - Positioned with Logo */}
            <div style={{ 
              position: "absolute", 
              top: "20px", 
              right: i18n.language === 'ar' ? "auto" : "20px",
              left: i18n.language === 'ar' ? "20px" : "auto",
              zIndex: 10 
            }}>
              <Space size="middle">
                <Button 
                  type="default" 
                  icon={<BellOutlined />}
                  style={{ 
                    borderRadius: "12px",
                    borderColor: "#0C085C",
                    color: "#0C085C",
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 12px rgba(12, 8, 92, 0.15)"
                  }}
                >
                  {t("3 Alerts")}
                </Button>
                <Dropdown menu={{ items: headerMenuItems }} placement="bottomRight">
                  <Button 
                    type="primary" 
                    icon={<MoreOutlined />}
                    style={{ 
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #0C085C, #0095CE)",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(12, 8, 92, 0.25)"
                    }}
                  />
                </Dropdown>
              </Space>
            </div>
            {/* SPECTACULAR Animated Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -360, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ 
                duration: 2.5, 
                ease: [0.175, 0.885, 0.32, 1.275],
                type: "spring",
                stiffness: 80,
                damping: 15
              }}
              whileHover={{ 
                scale: 1.12,
                rotate: [0, -3, 3, 0],
                transition: { rotate: { duration: 0.6, repeat: Infinity } }
              }}
              className="logo-floating"
              style={{ 
                marginBottom: "32px",
                position: "relative"
              }}
            >
              {/* Logo Glow Ring */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background: "conic-gradient(from 0deg, rgba(12, 8, 92, 0.3), rgba(0, 149, 206, 0.4), rgba(54, 54, 146, 0.3), rgba(12, 8, 92, 0.3))",
                  filter: "blur(20px)",
                  animation: "rotate-glow 8s linear infinite",
                  zIndex: -1
                }}
              />
              
              <img 
                src="/Qarar Logo no text.png" 
                alt="Qarar Logo" 
                style={{ 
                  height: "160px", 
                  width: "auto",
                  filter: "drop-shadow(0 15px 40px rgba(12, 8, 92, 0.4)) drop-shadow(0 0 20px rgba(0, 149, 206, 0.3))",
                  transition: "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
                  position: "relative",
                  zIndex: 2
                }} 
              />
              
              {/* Sparkle Effects */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                style={{
                  position: "absolute",
                  top: "10%",
                  right: "10%",
                  width: "8px",
                  height: "8px",
                  background: "radial-gradient(circle, rgba(0, 149, 206, 1) 0%, transparent 70%)",
                  borderRadius: "50%",
                  boxShadow: "0 0 10px rgba(0, 149, 206, 0.8)"
                }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2.5 }}
                style={{
                  position: "absolute",
                  bottom: "15%",
                  left: "15%",
                  width: "6px",
                  height: "6px",
                  background: "radial-gradient(circle, rgba(12, 8, 92, 1) 0%, transparent 70%)",
                  borderRadius: "50%",
                  boxShadow: "0 0 8px rgba(12, 8, 92, 0.8)"
                }}
              />
            </motion.div>

            {/* Brand Identity */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Title 
                level={1} 
                style={{ 
                  margin: "0 0 8px 0", 
                  background: "linear-gradient(135deg, #0C085C 0%, #0095CE 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "48px",
                  fontWeight: "900",
                  letterSpacing: i18n.language === 'ar' ? "2px" : "1px",
                  textAlign: "center",
                  direction: i18n.language === 'ar' ? "rtl" : "ltr"
                }}
              >
                {i18n.language === 'ar' ? 'قرار' : 'QARAR'}
              </Title>
              
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "220px", opacity: 1 }}
                transition={{ delay: 2.2, duration: 1.2, ease: "easeOut" }}
                className="brand-divider"
                style={{
                  height: "6px",
                  background: "linear-gradient(90deg, #0C085C 0%, #0095CE 50%, #0C085C 100%)",
                  margin: "24px auto",
                  borderRadius: "3px",
                  boxShadow: "0 4px 15px rgba(12, 8, 92, 0.4), 0 0 20px rgba(0, 149, 206, 0.3)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "300%" }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "30%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                    borderRadius: "3px"
                  }}
                />
              </motion.div>
              
              <Title 
                level={2} 
                style={{ 
                  margin: "16px 0 8px 0", 
                  color: "#0C085C",
                  fontSize: "28px",
                  fontWeight: "700",
                  textAlign: "center",
                  direction: i18n.language === 'ar' ? "rtl" : "ltr"
                }}
              >
                {t("Executive Command Center")}
              </Title>
              
              <Text style={{ 
                fontSize: "18px", 
                color: "#666", 
                fontWeight: "500",
                lineHeight: "1.6",
                textAlign: "center",
                direction: i18n.language === 'ar' ? "rtl" : "ltr",
                display: "block"
              }}>
                {t("Strategic Decision Making • Executive Intelligence • Board Governance")}
              </Text>
            </motion.div>
          </div>
        </Card>
      </motion.div>



      {/* Main KPIs */}
      <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card 
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #0C085C 0%, #0095CE 100%)",
                color: "white",
                height: "200px"
              }}
              styles={{ body: { padding: "32px" } }}
            >
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <DollarOutlined style={{ fontSize: "32px", opacity: 0.8 }} />
                  <Tag style={{ border: "none", background: "rgba(255,255,255,0.95)", color: "#10B981", fontWeight: "700", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    <ArrowUpOutlined /> +12.5%
                  </Tag>
                </div>
                <div>
                  <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>{t("Annual Revenue")}</Text>
                  <div style={{ fontSize: "36px", fontWeight: "800" }}>$68.2M</div>
                </div>
                <Progress 
                  percent={85} 
                  showInfo={false} 
                  strokeColor="rgba(255,255,255,0.8)"
                  trailColor="rgba(255,255,255,0.2)"
                />
              </Space>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card 
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #0095CE 0%, #0C085C 100%)",
                color: "white",
                height: "200px"
              }}
              styles={{ body: { padding: "32px" } }}
            >
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <ProjectOutlined style={{ fontSize: "32px", opacity: 0.8 }} />
                  <Tag style={{ border: "none", background: "rgba(255,255,255,0.95)", color: "#0095CE", fontWeight: "700", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    <FireOutlined /> {t("Hot")}
                  </Tag>
                </div>
                <div>
                  <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>{t("Active Projects")}</Text>
                  <div style={{ fontSize: "36px", fontWeight: "800" }}>24</div>
                </div>
                <Progress 
                  percent={72} 
                  showInfo={false} 
                  strokeColor="rgba(255,255,255,0.8)"
                  trailColor="rgba(255,255,255,0.2)"
                />
              </Space>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card 
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #0095CE 0%, #363692 100%)",
                color: "white",
                height: "200px"
              }}
              styles={{ body: { padding: "32px" } }}
            >
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <TeamOutlined style={{ fontSize: "32px", opacity: 0.8 }} />
                  <Tag style={{ border: "none", background: "rgba(255,255,255,0.95)", color: "#10B981", fontWeight: "700", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    <RiseOutlined /> +8.2%
                  </Tag>
                </div>
                <div>
                  <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>{t("Team Members")}</Text>
                  <div style={{ fontSize: "36px", fontWeight: "800" }}>1,247</div>
                </div>
                <Progress 
                  percent={94} 
                  showInfo={false} 
                  strokeColor="rgba(255,255,255,0.8)"
                  trailColor="rgba(255,255,255,0.2)"
                />
              </Space>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card 
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #0C085C 0%, #363692 100%)",
                color: "white",
                height: "200px"
              }}
              styles={{ body: { padding: "32px" } }}
            >
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <TrophyOutlined style={{ fontSize: "32px", opacity: 0.8 }} />
                  <Tag style={{ border: "none", background: "rgba(255, 255, 255, 0.9)", color: "#0C085C", fontWeight: "700", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    <StarOutlined /> {t("Excellent")}
                  </Tag>
                </div>
                <div>
                  <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>{t("Success Rate")}</Text>
                  <div style={{ fontSize: "36px", fontWeight: "800" }}>94.2%</div>
                </div>
                <Progress 
                  percent={94} 
                  showInfo={false} 
                  strokeColor="rgba(255,255,255,0.8)"
                  trailColor="rgba(255,255,255,0.2)"
                />
              </Space>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
        <Col xs={24} lg={16}>
          <motion.div variants={itemVariants}>
            <Card 
              title={
                <Space>
                  <ArrowUpOutlined style={{ color: "#0095CE" }} />
                  <span>{t("Revenue Performance vs Target")}</span>
                </Space>
              }
              extra={
                <Space>
                  <Button size="small" type={selectedMetric === "revenue" ? "primary" : "default"} 
                    onClick={() => setSelectedMetric("revenue")}>{t("Revenue")}</Button>
                  <Button size="small" type={selectedMetric === "growth" ? "primary" : "default"}
                    onClick={() => setSelectedMetric("growth")}>{t("Growth")}</Button>
                </Space>
              }
              style={{ ...cardStyle, height: "400px" }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#0095CE" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0095CE" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#0095CE" 
                    fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                  <Line type="monotone" dataKey="target" stroke="#e5e7eb" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={8}>
          <motion.div variants={itemVariants}>
            <Card 
              title={
                <Space>
                  <ProjectOutlined style={{ color: "#0095CE" }} />
                  <span>{t("Strategic Projects")}</span>
                </Space>
              }
              style={{ 
                ...cardStyle, 
                height: "400px", 
                position: "relative",
                overflow: "visible" 
              }}
              styles={{ 
                body: { 
                  height: "calc(100% - 60px)",
                  overflowY: "auto",
                  position: "relative",
                  zIndex: 1
                } 
              }}
            >
              <Space direction="vertical" size={16} style={{ width: "100%", paddingBottom: "20px" }}>
                {projectsData.map((project, index) => (
                  <motion.div 
                    key={project.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                      position: "relative",
                      zIndex: 2,
                      marginBottom: "12px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <Text strong style={{ fontSize: "14px" }}>{project.name}</Text>
                      <Tag color="green">{project.trend}</Tag>
                    </div>
                    <Progress 
                      percent={project.value} 
                      strokeColor={project.color}
                      trailColor="#f0f0f0"
                      size="default"
                      style={{ marginBottom: "8px" }}
                    />
                  </motion.div>
                ))}
              </Space>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Bottom Section */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <motion.div variants={itemVariants}>
            <Card 
              title={
                <Space>
                  <CalendarOutlined style={{ color: "#363692" }} />
                  <span>Upcoming Events</span>
                </Space>
              }
              style={cardStyle}
            >
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                {upcomingEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    whileHover={{ scale: 1.02 }}
                    style={{
                      padding: "26px",
                      background: "#fafafa",
                      borderRadius: "12px",
                      border: "1px solid #f0f0f0"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <Text strong>{event.title}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          <ClockCircleOutlined /> {event.time}
                        </Text>
                      </div>
                      <Space>
                        <Avatar.Group max={{ count: 3 }} size="small">
                          {Array.from({ length: event.attendees }, (_, i) => (
                            <Avatar key={i} style={{ backgroundColor: "#363692" }}>
                              {String.fromCharCode(65 + i)}
                            </Avatar>
                          ))}
                        </Avatar.Group>
                        <Badge 
                          color={event.type === "critical" ? "#ff4d4f" : event.type === "high" ? "#faad14" : "#52c41a"} 
                        />
                      </Space>
                    </div>
                  </motion.div>
                ))}
              </Space>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={12}>
          <motion.div variants={itemVariants}>
            <Card 
              title={
                <Space>
                  <ThunderboltOutlined style={{ color: "#0C085C" }} />
                  <span>Quick Actions</span>
                </Space>
              }
              style={cardStyle}
            >
              <Row gutter={[16, 16]}>
                {quickActions.map((action) => (
                  <Col span={12} key={action.label}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        hoverable
                        style={{
                          textAlign: "center",
                          borderRadius: "12px",
                          border: `2px solid ${action.color}20`,
                          background: `${action.color}05`
                        }}
                        styles={{ body: { padding: "24px 16px" } }}
                      >
                        <div style={{ fontSize: "24px", color: action.color, marginBottom: "8px" }}>
                          {action.icon}
                        </div>
                        <Text strong style={{ fontSize: "12px" }}>{action.label}</Text>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>

              <Divider />

              <div style={{ textAlign: "center" }}>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Need help? Check our <a href="#" style={{ color: "#0095CE" }}>Executive Guide</a>
                </Text>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Floating Achievement Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 1000,
        }}
      >
                        <Badge count="3" style={{ backgroundColor: '#363692' }}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<TrophyOutlined />}
            onClick={() => setAchievementVisible(true)}
            style={{
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, #0C085C, #0095CE)",
              border: "none",
              boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
              fontSize: "20px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(102, 126, 234, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.4)";
            }}
          />
        </Badge>
      </motion.div>

      <AchievementSystem 
        visible={achievementVisible}
        onClose={() => setAchievementVisible(false)}
      />
    </motion.div>
  );
};