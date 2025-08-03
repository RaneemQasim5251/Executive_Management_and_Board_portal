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
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  // Define data arrays inside component to access t function
  const projectsData = [
    { name: t("AI & Automation"), value: 35, color: "#8B5CF6", trend: "+12%" },
    { name: t("Digital Transformation"), value: 28, color: "#06B6D4", trend: "+8%" },
    { name: t("Market Expansion"), value: 22, color: "#10B981", trend: "+15%" },
    { name: t("Innovation Lab"), value: 15, color: "#F59E0B", trend: "+5%" },
  ];

  const upcomingEvents = [
    { id: 1, title: t("Board Meeting Q4 Review"), time: t("Today") + ", 2:00 PM", type: "critical", attendees: 8 },
    { id: 2, title: t("Digital Strategy Presentation"), time: t("Tomorrow") + ", 10:00 AM", type: "high", attendees: 12 },
    { id: 3, title: t("Investor Relations Call"), time: "Dec 15, 3:00 PM", type: "medium", attendees: 6 },
  ];

  const quickActions = [
    { icon: <ProjectOutlined />, label: t("New Initiative"), color: "#8B5CF6" },
    { icon: <TeamOutlined />, label: t("Team Review"), color: "#06B6D4" },
    { icon: <CalendarOutlined />, label: t("Schedule Meeting"), color: "#10B981" },
    { icon: <BellOutlined />, label: t("Send Update"), color: "#F59E0B" },
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
          <ThunderboltOutlined style={{ fontSize: '48px', color: '#8B5CF6' }} />
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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh"
      }}
    >
      {/* Header Section */}
      <motion.div variants={itemVariants}>
        <Card 
          style={{ 
            ...cardStyle,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            marginBottom: "24px"
          }}
          styles={{ body: { padding: "32px" } }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space direction="vertical" size="small">
                <Title 
                  level={1} 
                  style={{ 
                    margin: 0, 
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: "42px",
                    fontWeight: "800"
                  }}
                >
                  {t("Executive Command Center")}
                </Title>
                <Text style={{ fontSize: "16px", color: "#666" }}>
                  {t("Strategic overview and real-time performance insights")}
                </Text>
              </Space>
            </Col>
            <Col>
              <Space size="middle">
                <Button 
                  type="default" 
                  icon={<BellOutlined />}
                  style={{ 
                    borderRadius: "12px",
                    borderColor: "#667eea",
                    color: "#667eea"
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
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      border: "none"
                    }}
                  />
                </Dropdown>
              </Space>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Main KPIs */}
      <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card 
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                height: "200px"
              }}
              styles={{ body: { padding: "32px" } }}
            >
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <DollarOutlined style={{ fontSize: "32px", opacity: 0.8 }} />
                  <Tag color="green" style={{ border: "none", background: "rgba(255,255,255,0.2)" }}>
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
                background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
                color: "white",
                height: "200px"
              }}
              styles={{ body: { padding: "32px" } }}
            >
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <ProjectOutlined style={{ fontSize: "32px", opacity: 0.8 }} />
                  <Tag color="cyan" style={{ border: "none", background: "rgba(255,255,255,0.2)" }}>
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
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: "white",
                height: "200px"
              }}
              styles={{ body: { padding: "32px" } }}
            >
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <TeamOutlined style={{ fontSize: "32px", opacity: 0.8 }} />
                  <Tag color="green" style={{ border: "none", background: "rgba(255,255,255,0.2)" }}>
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
                background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                color: "white",
                height: "200px"
              }}
              styles={{ body: { padding: "32px" } }}
            >
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <TrophyOutlined style={{ fontSize: "32px", opacity: 0.8 }} />
                  <Tag color="purple" style={{ border: "none", background: "rgba(255,255,255,0.2)" }}>
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
                  <ArrowUpOutlined style={{ color: "#8B5CF6" }} />
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
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" 
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
                  <ProjectOutlined style={{ color: "#06B6D4" }} />
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
                  <CalendarOutlined style={{ color: "#F59E0B" }} />
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
                            <Avatar key={i} style={{ backgroundColor: "#8B5CF6" }}>
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
                  <ThunderboltOutlined style={{ color: "#8B5CF6" }} />
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
                  Need help? Check our <a href="#" style={{ color: "#8B5CF6" }}>Executive Guide</a>
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
        <Badge count="3" style={{ backgroundColor: '#F59E0B' }}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<TrophyOutlined />}
            onClick={() => setAchievementVisible(true)}
            style={{
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
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