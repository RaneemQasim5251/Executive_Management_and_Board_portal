import React from 'react';
import { Card, Typography, Space, Button, Timeline, Row, Col, Statistic } from 'antd';
import { 
  RocketOutlined, 
  CalendarOutlined, 
  TrophyOutlined, 
  TeamOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

export const StrategicPlanningPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const planningPhases = [
    {
      title: t("Strategic Analysis"),
      description: "تحليل الوضع الحالي والفرص المتاحة",
      status: "completed",
      date: "Q1 2024"
    },
    {
      title: t("Vision Development"),
      description: "تطوير الرؤية والرسالة الاستراتيجية",
      status: "completed", 
      date: "Q2 2024"
    },
    {
      title: t("Goal Setting"),
      description: "تحديد الأهداف الاستراتيجية والمؤشرات",
      status: "in-progress",
      date: "Q3 2024"
    },
    {
      title: t("Implementation Planning"),
      description: "وضع خطط التنفيذ التفصيلية",
      status: "pending",
      date: "Q4 2024"
    }
  ];

  const strategicMetrics = [
    { title: "Strategic Initiatives", value: 12, suffix: "projects" },
    { title: "Implementation Rate", value: 85, suffix: "%" },
    { title: "Budget Allocation", value: 2.5, prefix: "$", suffix: "M" },
    { title: "Team Involvement", value: 156, suffix: "members" }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ color: '#1e3a8a', marginBottom: '8px' }}>
          🎯 {t("Strategic Planning")}
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          {t("Comprehensive strategic planning and roadmap development")}
        </Text>
      </div>

      {/* Strategic Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        {strategicMetrics.map((metric, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card size="small">
              <Statistic
                title={metric.title}
                value={metric.value}
                prefix={metric.prefix}
                suffix={metric.suffix}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Strategic Timeline Access */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <CalendarOutlined style={{ color: '#1890ff' }} />
                {t("Strategic Timeline")}
              </Space>
            }
            extra={
              <Button 
                type="primary" 
                icon={<ArrowRightOutlined />}
                onClick={() => navigate('/timeline')}
              >
                {t("View Timeline")}
              </Button>
            }
          >
            <Paragraph>
              {t("Access the comprehensive strategic timeline showing all major milestones, initiatives, and deadlines for the organization's strategic plan.")}
            </Paragraph>
            
            <div style={{ marginTop: '16px' }}>
              <Text strong>Quick Overview:</Text>
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                <li>Q1 2025: Strategic Review & Planning</li>
                <li>Q2 2025: Digital Transformation Phase 2</li>
                <li>Q3 2025: Market Expansion Initiative</li>
                <li>Q4 2025: Innovation Lab Launch</li>
              </ul>
            </div>
          </Card>
        </Col>

        {/* Planning Phases */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <RocketOutlined style={{ color: '#52c41a' }} />
                Planning Phases
              </Space>
            }
          >
            <Timeline>
              {planningPhases.map((phase, index) => (
                <Timeline.Item
                  key={index}
                  color={
                    phase.status === 'completed' ? 'green' :
                    phase.status === 'in-progress' ? 'blue' : 'gray'
                  }
                  dot={
                    phase.status === 'completed' ? <TrophyOutlined /> :
                    phase.status === 'in-progress' ? <TeamOutlined /> : undefined
                  }
                >
                  <div>
                    <Text strong style={{ fontSize: '14px' }}>{phase.title}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {phase.date}
                    </Text>
                    <br />
                    <Text style={{ fontSize: '13px' }}>{phase.description}</Text>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* Strategic Initiatives Overview */}
      <Card 
        title="Strategic Initiatives Overview" 
        style={{ marginTop: '24px' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card size="small" style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
              <Statistic
                title="Completed Initiatives"
                value={8}
                suffix="/ 12"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" style={{ backgroundColor: '#e6f7ff', border: '1px solid #91d5ff' }}>
              <Statistic
                title="In Progress"
                value={3}
                suffix="initiatives"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" style={{ backgroundColor: '#fff2e8', border: '1px solid #ffd591' }}>
              <Statistic
                title="Planned"
                value={1}
                suffix="upcoming"
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};