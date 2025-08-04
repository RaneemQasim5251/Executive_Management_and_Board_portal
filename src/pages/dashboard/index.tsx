import { FC } from "react";
import { Row, Col, Card, Statistic, Typography, Space } from "antd";
import {
  ArrowUpOutlined,
  TeamOutlined,
  DollarOutlined,
  ProjectOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

// Executive KPI Data
const revenueData = [
  { month: "Jan", revenue: 4200000, target: 4000000 },
  { month: "Feb", revenue: 4800000, target: 4200000 },
  { month: "Mar", revenue: 5200000, target: 4500000 },
  { month: "Apr", revenue: 5800000, target: 4800000 },
  { month: "May", revenue: 6200000, target: 5000000 },
  { month: "Jun", revenue: 6800000, target: 5500000 },
];

const projectData = [
  { name: "Strategic Initiatives", value: 35, color: "#1e3a8a" },
  { name: "Digital Transformation", value: 25, color: "#3b82f6" },
  { name: "Market Expansion", value: 20, color: "#60a5fa" },
  { name: "Innovation Projects", value: 20, color: "#93c5fd" },
];

const performanceData = [
  { quarter: "Q1", efficiency: 85, satisfaction: 92, growth: 15 },
  { quarter: "Q2", efficiency: 88, satisfaction: 94, growth: 18 },
  { quarter: "Q3", efficiency: 91, satisfaction: 96, growth: 22 },
  { quarter: "Q4", efficiency: 94, satisfaction: 98, growth: 25 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export const ExecutiveDashboard: FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh" }}
    >
      {/* Executive Header */}
      <motion.div variants={itemVariants} className="executive-header">
        <Title level={2} style={{ color: "white", margin: 0 }}>
          Executive Dashboard
        </Title>
        <Text style={{ color: "rgba(255, 255, 255, 0.9)" }}>
          Strategic overview and key performance indicators
        </Text>
      </motion.div>

      {/* Executive KPIs */}
      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card className="kpi-card">
              <Statistic
                title={<span style={{ color: "rgba(255, 255, 255, 0.9)" }}>Annual Revenue</span>}
                value={68.2}
                precision={1}
                valueStyle={{ color: "white", fontSize: "2.5rem", fontWeight: 700 }}
                prefix={<DollarOutlined />}
                suffix="M"
              />
              <div style={{ marginTop: "8px" }}>
                <ArrowUpOutlined style={{ color: "#10b981", marginRight: "4px" }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>+12.5% vs last year</Text>
              </div>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card className="kpi-card">
              <Statistic
                title={<span style={{ color: "rgba(255, 255, 255, 0.9)" }}>Active Projects</span>}
                value={24}
                valueStyle={{ color: "white", fontSize: "2.5rem", fontWeight: 700 }}
                prefix={<ProjectOutlined />}
              />
              <div style={{ marginTop: "8px" }}>
                <ArrowUpOutlined style={{ color: "#10b981", marginRight: "4px" }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>+3 new this quarter</Text>
              </div>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card className="kpi-card">
              <Statistic
                title={<span style={{ color: "rgba(255, 255, 255, 0.9)" }}>Team Members</span>}
                value={1247}
                valueStyle={{ color: "white", fontSize: "2.5rem", fontWeight: 700 }}
                prefix={<TeamOutlined />}
              />
              <div style={{ marginTop: "8px" }}>
                <ArrowUpOutlined style={{ color: "#10b981", marginRight: "4px" }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>+8.2% growth rate</Text>
              </div>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card className="kpi-card">
              <Statistic
                title={<span style={{ color: "rgba(255, 255, 255, 0.9)" }}>Efficiency Score</span>}
                value={94.2}
                precision={1}
                valueStyle={{ color: "white", fontSize: "2.5rem", fontWeight: 700 }}
                prefix={<TrophyOutlined />}
                suffix="%"
              />
              <div style={{ marginTop: "8px" }}>
                <ArrowUpOutlined style={{ color: "#10b981", marginRight: "4px" }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>+2.1% improvement</Text>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[24, 24]}>
        {/* Revenue Trend */}
        <Col xs={24} lg={16}>
          <motion.div variants={itemVariants}>
            <Card className="chart-container">
              <Title level={4} className="chart-title">
                Revenue Performance vs Target
              </Title>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1e3a8a"
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                    name="Actual Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#ef4444"

                    strokeDasharray="5 5"
                    name="Target"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        {/* Project Distribution */}
        <Col xs={24} lg={8}>
          <motion.div variants={itemVariants}>
            <Card className="chart-container">
              <Title level={4} className="chart-title">
                Strategic Project Distribution
              </Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {projectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        {/* Performance Metrics */}
        <Col xs={24}>
          <motion.div variants={itemVariants}>
            <Card className="chart-container">
              <Title level={4} className="chart-title">
                Quarterly Performance Metrics
              </Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="quarter" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="efficiency"
                    fill="#0C085C"
                    name="Operational Efficiency (%)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="satisfaction"
                    fill="#0095CE"
                    name="Customer Satisfaction (%)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="growth"
                    fill="#363692"
                    name="Market Growth (%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Executive Insights */}
      <Row gutter={[24, 24]} style={{ marginTop: "32px" }}>
        <Col xs={24} lg={12}>
          <motion.div variants={itemVariants}>
            <Card className="executive-card">
              <Title level={4} style={{ color: "#1e3a8a", marginBottom: "16px" }}>
                📈 Strategic Insights
              </Title>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Text strong>Revenue Growth Acceleration</Text>
                  <br />
                  <Text type="secondary">
                    Q2 revenue exceeded targets by 14.3%, driven by digital transformation initiatives.
                  </Text>
                </div>
                <div>
                  <Text strong>Market Expansion Success</Text>
                  <br />
                  <Text type="secondary">
                    New market penetration increased by 22%, with strong performance in APAC region.
                  </Text>
                </div>
                <div>
                  <Text strong>Operational Excellence</Text>
                  <br />
                  <Text type="secondary">
                    Efficiency improvements of 9.2% achieved through AI-driven process optimization.
                  </Text>
                </div>
              </Space>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={12}>
          <motion.div variants={itemVariants}>
            <Card className="executive-card">
              <Title level={4} style={{ color: "#1e3a8a", marginBottom: "16px" }}>
                🎯 Strategic Priorities
              </Title>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Text strong>Digital Innovation Pipeline</Text>
                  <br />
                  <Text type="secondary">
                    Launch 3 AI-powered products by Q4 to maintain competitive edge.
                  </Text>
                </div>
                <div>
                  <Text strong>Sustainability Goals</Text>
                  <br />
                  <Text type="secondary">
                    Achieve carbon neutrality by 2025 through green technology investments.
                  </Text>
                </div>
                <div>
                  <Text strong>Talent Acquisition</Text>
                  <br />
                  <Text type="secondary">
                    Scale engineering team by 35% to support global expansion plans.
                  </Text>
                </div>
              </Space>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};