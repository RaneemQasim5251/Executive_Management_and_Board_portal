import { FC, useState, useEffect } from "react";
import { 
  Row, 
  Col, 
  Card, 
  Statistic,
  Typography, 
  Space, 
  Button, 
  Progress, 
  Avatar, 
  Tag, 
  Badge,
  Divider
} from "antd";
import {
  TeamOutlined,
  DollarOutlined,
  ProjectOutlined,
  TrophyOutlined,
  BellOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  ArrowUpOutlined,
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
import { useNavigate } from "react-router-dom";
import { QuickAccessPanel } from '../../components/QuickAccessPanel';

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
  const isArabic = i18n.language?.toLowerCase().startsWith('ar');
  const T = (key: string) => {
    const map: Record<string, string> = {
      '+12.5% vs last year': '‎+١٢٫٥٪ مقارنة بالعام الماضي',
      '+3 new this quarter': '‎+٣ عناصر جديدة هذا الربع',
      '+8.2% growth rate': '‎+٨٫٢٪ معدل النمو',
      '+2.1% improvement': '‎+٢٫١٪ تحسّن',
      'Upcoming Events': 'الفعاليات القادمة',
      'Quick Actions': 'إجراءات سريعة',
      'Need help? Check our Executive Guide': 'هل تحتاج مساعدة؟ اطّلع على دليل التنفيذيين لدينا',
    };
    return isArabic && map[key] ? map[key] : t(key);
  };
  const navigate = useNavigate();
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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    const logoTimer = setTimeout(() => {}, 1000);
    return () => { clearTimeout(timer); clearTimeout(logoTimer); };
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
        background: "#ffffff", 
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

          {/* Content Container */}
          <div className="hero-content" style={{ 
            position: "relative", 
            zIndex: 2, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: "center",
            direction: i18n.language === 'ar' ? "rtl" : "ltr" 
          }}>
            {/* Overlay: logo, big title, subtitle - separated for easier styling */}
            <div className="hero-overlay" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
              <div className="hero-logo-wrapper" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src="/aljeri-logo.png" alt="Al Jeri Logo" className="hero-logo" style={{height: 96}} />
              </div>
              <div className="hero-title-wrapper" style={{textAlign: 'center'}}>
                <h1 className="hero-title" style={{margin: 0, color: '#000000', fontWeight: 900}}>{t('AL JERI')}</h1>
                <div className="hero-subtitle" style={{color: '#333333'}}>{t('Executive Board Platform')}</div>
              </div>
            </div>
            {/* decorative floating logo removed to avoid duplication; overlay logo remains */}

            {/* Brand Identity */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {/* main title moved into hero-overlay to avoid duplication */}
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
                  color: "#000000",
                  fontSize: "24px",
                  fontWeight: "700",
                  textAlign: "center",
                  direction: i18n.language === 'ar' ? "rtl" : "ltr"
                }}
              >
                {t('Executive Board Platform')}
              </Title>
              
              <Text style={{ 
                fontSize: "18px", 
                color: "#e5e7eb", 
                fontWeight: "500",
                lineHeight: "1.6",
                textAlign: "center",
                direction: i18n.language === 'ar' ? "rtl" : "ltr",
                display: "block"
              }}>
                {t("Strategic Decision Making • Board Governance")}
              </Text>
            </motion.div>

          </div>
        </Card>
      </motion.div>



      {/* Main KPIs */}
      <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card className="kpi-card">
              <Statistic
                title={<span style={{ color: "rgba(255, 255, 255, 0.9)" }}>{t("Annual Revenue")}</span>}
                value={68.2}
                precision={1}
                valueStyle={{ color: "#000000", fontSize: "2.5rem", fontWeight: 700 }}
                prefix={<DollarOutlined />}
                suffix="M"
              />
              <div className="trend-info">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ArrowUpOutlined style={{ color: "#10b981", marginRight: "4px" }} />
                   <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>{T('+12.5% vs last year')}</Text>
                </div>
                <Button 
                  type="link" 
                  size="small"
                  onClick={() => navigate('/reports')}
                  style={{ 
                    color: "#000000", 
                    fontWeight: 600,
                    padding: "4px 8px",
                    fontSize: "12px"
                  }}
                >
                  {t("View Details")}
                </Button>
              </div>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card className="kpi-card">
              <Statistic
                title={<span style={{ color: "rgba(255, 255, 255, 0.9)" }}>{t("Active Projects")}</span>}
                value={24}
                valueStyle={{ color: "#000000", fontSize: "2.5rem", fontWeight: 700 }}
                prefix={<ProjectOutlined />}
              />
              <div className="trend-info">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ArrowUpOutlined style={{ color: "#10b981", marginRight: "4px" }} />
                   <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>{T('+3 new this quarter')}</Text>
                </div>
                <Button 
                  type="link" 
                  size="small"
                  onClick={() => navigate('/strategic-planning')}
                  style={{ 
                    color: "#000000", 
                    fontWeight: 600,
                    padding: "4px 8px",
                    fontSize: "12px"
                  }}
                >
                  {t("View Projects")}
                </Button>
              </div>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card className="kpi-card">
              <Statistic
                title={<span style={{ color: "rgba(255, 255, 255, 0.9)" }}>{t("dashboard.boardMembers")}</span>}
                value={1247}
                valueStyle={{ color: "#000000", fontSize: "2.5rem", fontWeight: 700 }}
                prefix={<TeamOutlined />}
              />
              <div className="trend-info">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ArrowUpOutlined style={{ color: "#10b981", marginRight: "4px" }} />
                   <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>{T('+8.2% growth rate')}</Text>
                </div>
                <Button 
                  type="link" 
                  size="small"
                  onClick={() => navigate('/my-meetings')}
                  style={{ 
                    color: "#000000", 
                    fontWeight: 600,
                    padding: "4px 8px",
                    fontSize: "12px"
                  }}
                >
                  {t("buttons.viewRegister")}
                </Button>
              </div>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card className="kpi-card">
              <Statistic
                title={<span style={{ color: "rgba(255, 255, 255, 0.9)" }}>{t("Success Rate")}</span>}
                value={94.2}
                precision={1}
                valueStyle={{ color: "#000000", fontSize: "2.5rem", fontWeight: 700 }}
                prefix={<TrophyOutlined />}
                suffix="%"
              />
              <div className="trend-info">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ArrowUpOutlined style={{ color: "#10b981", marginRight: "4px" }} />
                   <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>{T('+2.1% improvement')}</Text>
                </div>
                <Button 
                  type="link" 
                  size="small"
                  onClick={() => navigate('/enterprise-systems/kpis-erp')}
                  style={{ 
                    color: "#000000", 
                    fontWeight: 600,
                    padding: "4px 8px",
                    fontSize: "12px"
                  }}
                >
                  {t("View Metrics")}
                </Button>
              </div>
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
                  <span>{T('Upcoming Events')}</span>
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
                      border: "2px solid #f0f0f0"
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
                  <span>{T('Quick Actions')}</span>
                </Space>
              }
              style={cardStyle}
            >
              <Row gutter={[24, 24]}>
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
                          border: `3px solid ${action.color}20`,
                          background: `${action.color}05`
                        }}
                        styles={{ body: { padding: "22px 16px" } }}
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
                  {T('Need help? Check our Executive Guide')}
                </Text>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Quick Access Panel */}
      <QuickAccessPanel />
    </motion.div>
  );
};