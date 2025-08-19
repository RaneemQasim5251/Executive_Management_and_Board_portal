import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Space,
  Button,
  Avatar,
  Progress,
  List,
  Tag,
  Divider,
} from 'antd';
import {
  DollarOutlined,
  ProjectOutlined,
  TeamOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CalendarOutlined,
  BellOutlined,
  FileTextOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const { Title, Text } = Typography;

// Simplified data for executive overview
const kpiData = [
  { name: 'Jan', revenue: 65, projects: 28, efficiency: 85 },
  { name: 'Feb', revenue: 68, projects: 32, efficiency: 88 },
  { name: 'Mar', revenue: 72, projects: 35, efficiency: 92 },
  { name: 'Apr', revenue: 75, projects: 38, efficiency: 89 },
  { name: 'May', revenue: 78, projects: 42, efficiency: 94 },
  { name: 'Jun', revenue: 82, projects: 45, efficiency: 96 },
];

const upcomingMeetings = [
  { id: 1, title: 'Board Meeting Q2 Review', time: '09:00 AM', attendees: 8, priority: 'high' },
  { id: 2, title: 'JTC Strategic Planning', time: '02:00 PM', attendees: 5, priority: 'medium' },
  { id: 3, title: 'Energy Sector Update', time: '04:30 PM', attendees: 3, priority: 'low' },
];

const recentAlerts = [
  { id: 1, message: 'Q2 Revenue target exceeded by 12%', type: 'success', time: '2 hours ago' },
  { id: 2, message: 'JTC project milestone completed', type: 'info', time: '4 hours ago' },
  { id: 3, message: 'Board meeting agenda ready for review', type: 'warning', time: '6 hours ago' },
];

export const SimplifiedDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div style={{ 
      padding: '24px',
      background: '#f8fafc',
      minHeight: '100vh',
    }}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '32px' }}
      >
        <Space direction="vertical" size={8}>
          <Title level={2} style={{ 
            margin: 0, 
            color: '#1f2937', 
            fontSize: '32px',
            fontWeight: 700,
          }}>
            {t('Good morning, Executive')}
          </Title>
          <Text style={{ 
            color: '#6b7280', 
            fontSize: '16px',
            lineHeight: 1.5,
          }}>
            {t('Here\'s your business overview for today')}
          </Text>
        </Space>
      </motion.div>

      {/* Key Metrics */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        {[
          {
            title: t('Revenue'),
            value: '$82M',
            change: '+12%',
            trend: 'up',
            icon: <DollarOutlined />,
            color: '#52c41a',
            route: '/reports',
          },
          {
            title: t('Active Projects'),
            value: '45',
            change: '+7',
            trend: 'up',
            icon: <ProjectOutlined />,
            color: '#1890ff',
            route: '/board',
          },
          {
            title: t('Team Members'),
            value: '284',
            change: '+12',
            trend: 'up',
            icon: <TeamOutlined />,
            color: '#722ed1',
            route: '/companies/jtc',
          },
          {
            title: t('Efficiency'),
            value: '96%',
            change: '+4%',
            trend: 'up',
            icon: <TrophyOutlined />,
            color: '#fa8c16',
            route: '/reports',
          },
        ].map((metric, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <motion.div
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card
                hoverable
                onClick={() => navigate(metric.route)}
                style={{
                  borderRadius: '12px',
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                styles={{ body: { padding: '24px' } }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: `${metric.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      color: metric.color,
                    }}>
                      {metric.icon}
                    </div>
                    <Space>
                      {metric.trend === 'up' ? (
                        <ArrowUpOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                      ) : (
                        <ArrowDownOutlined style={{ color: '#ff4d4f', fontSize: '12px' }} />
                      )}
                      <Text style={{ 
                        color: metric.trend === 'up' ? '#52c41a' : '#ff4d4f',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}>
                        {metric.change}
                      </Text>
                    </Space>
                  </div>
                  
                  <div>
                    <Text type="secondary" style={{ fontSize: '14px', lineHeight: 1.2 }}>
                      {metric.title}
                    </Text>
                    <Title level={3} style={{ 
                      margin: '4px 0 0 0', 
                      color: '#1f2937',
                      fontSize: '28px',
                      fontWeight: 700,
                      lineHeight: 1.1,
                    }}>
                      {metric.value}
                    </Title>
                  </div>
                </Space>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Revenue Trend Chart */}
        <Col xs={24} lg={16}>
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card
              title={
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Text strong style={{ fontSize: '16px', color: '#1f2937' }}>
                    {t('Performance Trend')}
                  </Text>
                  <Button type="link" onClick={() => navigate('/reports')}>
                    {t('View Details')}
                  </Button>
                </Space>
              }
              style={{
                borderRadius: '12px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
              styles={{ body: { padding: '24px' } }}
            >
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={kpiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0C085C" 
                    strokeWidth={3}
                    dot={{ fill: '#0C085C', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#0C085C', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        {/* Today's Schedule */}
        <Col xs={24} lg={8}>
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card
              title={
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Text strong style={{ fontSize: '16px', color: '#1f2937' }}>
                    {t('Today\'s Schedule')}
                  </Text>
                  <Button 
                    type="link" 
                    onClick={() => navigate('/my-meetings')}
                    style={{ fontSize: '14px' }}
                  >
                    {t('View All')}
                  </Button>
                </Space>
              }
              style={{
                borderRadius: '12px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                height: '100%',
              }}
              styles={{ body: { padding: '16px' } }}
            >
              <List
                dataSource={upcomingMeetings}
                renderItem={(meeting) => (
                  <List.Item style={{ padding: '12px 0', border: 'none' }}>
                    <Space style={{ width: '100%' }} direction="vertical" size={4}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: '14px', color: '#1f2937' }}>
                          {meeting.title}
                        </Text>
                        <Tag 
                          color={meeting.priority === 'high' ? 'red' : meeting.priority === 'medium' ? 'orange' : 'green'}
                          style={{ fontSize: '10px' }}
                        >
                          {meeting.priority}
                        </Tag>
                      </div>
                      <Space>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <CalendarOutlined style={{ marginRight: '4px' }} />
                          {meeting.time}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <TeamOutlined style={{ marginRight: '4px' }} />
                          {meeting.attendees} {t('attendees')}
                        </Text>
                      </Space>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        {/* Recent Alerts */}
        <Col xs={24} lg={12}>
          <motion.div
            custom={6}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card
              title={
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Text strong style={{ fontSize: '16px', color: '#1f2937' }}>
                    {t('Recent Updates')}
                  </Text>
                  <Button 
                    type="link"
                    icon={<BellOutlined />}
                    style={{ fontSize: '14px' }}
                  >
                    {t('View All')}
                  </Button>
                </Space>
              }
              style={{
                borderRadius: '12px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
              styles={{ body: { padding: '16px' } }}
            >
              <List
                dataSource={recentAlerts}
                renderItem={(alert) => (
                  <List.Item style={{ padding: '12px 0', border: 'none' }}>
                    <Space style={{ width: '100%' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: alert.type === 'success' ? '#52c41a' : 
                                   alert.type === 'warning' ? '#faad14' : '#1890ff',
                        flexShrink: 0,
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text style={{ fontSize: '14px', color: '#1f2937', lineHeight: 1.4 }}>
                          {alert.message}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {alert.time}
                        </Text>
                      </div>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </motion.div>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={12}>
          <motion.div
            custom={7}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card
              title={
                <Text strong style={{ fontSize: '16px', color: '#1f2937' }}>
                  {t('Quick Actions')}
                </Text>
              }
              style={{
                borderRadius: '12px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
              styles={{ body: { padding: '24px' } }}
            >
              <Row gutter={[16, 16]}>
                {[
                  {
                    title: t('View Projects'),
                    description: t('Strategic initiatives'),
                    icon: <ProjectOutlined />,
                    color: '#1890ff',
                    route: '/board',
                  },
                  {
                    title: t('Check Timeline'),
                    description: t('Project milestones'),
                    icon: <CalendarOutlined />,
                    color: '#722ed1',
                    route: '/timeline',
                  },
                  {
                    title: t('Review Reports'),
                    description: t('Analytics & insights'),
                    icon: <FileTextOutlined />,
                    color: '#fa8c16',
                    route: '/reports',
                  },
                  {
                    title: t('Company Portfolio'),
                    description: t('Business units'),
                    icon: <RiseOutlined />,
                    color: '#52c41a',
                    route: '/companies/jtc',
                  },
                ].map((action, index) => (
                  <Col span={12} key={index}>
                    <Button
                      block
                      onClick={() => navigate(action.route)}
                      style={{
                        height: '80px',
                        borderRadius: '12px',
                        border: '1px solid #f0f0f0',
                        background: '#ffffff',
                        textAlign: 'left',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = action.color;
                        e.currentTarget.style.boxShadow = `0 4px 12px ${action.color}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#f0f0f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <div style={{ color: action.color, fontSize: '18px' }}>
                          {action.icon}
                        </div>
                        <Text strong style={{ fontSize: '13px', color: '#1f2937' }}>
                          {action.title}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          {action.description}
                        </Text>
                      </Space>
                    </Button>
                  </Col>
                ))}
              </Row>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default SimplifiedDashboard;
