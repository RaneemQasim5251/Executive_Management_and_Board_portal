import React from 'react';
import { Card, Typography, Row, Col, Statistic, Tag, List, Avatar, Progress } from 'antd';
import { RocketOutlined, CalendarOutlined, AimOutlined, RiseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export const Archive2025: React.FC = () => {
  const { t } = useTranslation();

  const data = {
    currentProjects: 35,
    ytdRevenue: 45.8, // in millions USD
    goalsProgress: 68, // percentage
    currentQuarter: t("Q2 2025"),
    activeInitiatives: [
      {
        id: 1,
        title: t("APAC Market Expansion"),
        description: t("Establishing new regional headquarters and distribution channels in Southeast Asia."),
        progress: 75,
        date: "2025-09-30",
        tags: ["Market", "Growth"],
        assignees: ["CEO", "Business Dev"]
      },
      {
        id: 2,
        title: t("Sustainability Initiative Rollout"),
        description: t("Implementing phase 2 of the sustainability program focusing on renewable energy sources."),
        progress: 40,
        date: "2025-12-31",
        tags: ["ESG", "Operations"],
        assignees: ["COO", "Sustainability Team"]
      },
      {
        id: 3,
        title: "AI Integration in Customer Service",
        description: "Deploying AI-powered chatbots and virtual assistants to enhance customer support efficiency.",
        progress: 60,
        date: "2025-08-15",
        tags: ["Technology", "Customer Experience"],
        assignees: ["CTO", "Customer Service"]
      }
    ]
  };

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh', overflow: 'auto' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Title level={2} style={{ color: '#1e3a8a', marginBottom: '32px', textAlign: 'center' }}>
          📈 {t("2025 Current")}
        </Title>
        
        <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={t("Current Projects")}
                value={data.currentProjects}
                prefix={<RocketOutlined />}
                valueStyle={{ color: '#1e3a8a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={t("YTD Revenue")}
                value={data.ytdRevenue}
                suffix="M USD"
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#10b981' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={t("Goals Progress")}
                value={data.goalsProgress}
                suffix="%"
                prefix={<AimOutlined />}
                valueStyle={{ color: '#f59e0b' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={t("Current Quarter")}
                value="Q2 2025"
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1e3a8a' }}
              />
            </Card>
          </Col>
        </Row>

        <Card 
          title={<Title level={4} style={{ margin: 0 }}>{t("Active Initiatives")}</Title>}
          style={{ marginBottom: '24px' }}
        >
          <List
            itemLayout="vertical"
            dataSource={data.activeInitiatives}
            renderItem={item => (
              <List.Item
                key={item.id}
                style={{ 
                  border: '1px solid #f0f0f0', 
                  borderRadius: '8px', 
                  marginBottom: '16px', 
                  padding: '16px',
                  background: '#fafafa'
                }}
                actions={[
                  <Tag color="blue" icon={<CalendarOutlined />} key="date">{item.date}</Tag>,
                  <Progress 
                    key="progress"
                    percent={item.progress} 
                    size="small" 
                    status={item.progress === 100 ? "success" : "active"} 
                    style={{ width: '120px' }} 
                  />,
                  <Avatar.Group max={{ count: 2 }} key="assignees">
                    {item.assignees.map((assignee, index) => (
                      <Avatar key={index} style={{ backgroundColor: '#1e3a8a' }}>
                        {assignee.charAt(0)}
                      </Avatar>
                    ))}
                  </Avatar.Group>
                ]}
              >
                <List.Item.Meta
                  title={<a href="#" style={{ fontSize: '16px', fontWeight: 600 }}>{item.title}</a>}
                  description={
                    <>
                      <Text style={{ display: 'block', marginBottom: '12px' }}>{item.description}</Text>
                      <div>
                        {item.tags.map(tag => (
                          <Tag key={tag} color="geekblue" style={{ marginBottom: '4px' }}>{tag}</Tag>
                        ))}
                      </div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
};