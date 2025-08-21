import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Typography, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Timeline, 
  Badge, 
  Button, 
  Dropdown, 
  Menu 
} from 'antd';
import { 
  DashboardOutlined, 
  CalendarOutlined, 
  FileTextOutlined, 
  ClockCircleOutlined, 
  MoreOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ThemeSwitcher from '../../components/ThemeSwitcher';

const { Title, Text } = Typography;
const { Content } = Layout;

const WorldClassDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [themeSwitcherVisible, setThemeSwitcherVisible] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem('executive-portal-theme') || 'default'
  );

  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      setTheme(event.detail.theme);
    };

    window.addEventListener('theme-changed', 
      handleThemeChange as EventListener
    );

    return () => {
      window.removeEventListener('theme-changed', 
        handleThemeChange as EventListener
      );
    };
  }, []);

  const upcomingMeetings = [
    {
      id: 1,
      title: 'Q3 Strategic Review',
      time: '10:00 AM',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Digital Transformation Roadmap',
      time: '2:30 PM',
      status: 'upcoming'
    }
  ];

  const pendingApprovals = [
    {
      id: 1,
      title: 'JTC Fleet Expansion Budget',
      type: 'financial',
      status: 'pending'
    },
    {
      id: 2,
      title: 'AI Innovation Lab Proposal',
      type: 'strategic',
      status: 'pending'
    }
  ];

  const companyPerformance = [
    {
      name: 'JTC Logistics',
      growth: 15.3,
      status: 'positive'
    },
    {
      name: 'J:Oil Petroleum',
      growth: -5.2,
      status: 'negative'
    }
  ];

  const renderPerformanceIndicator = (growth: number) => {
    return growth >= 0 ? (
      <CheckCircleOutlined style={{ color: 'green', marginLeft: 8 }} />
    ) : (
      <CloseCircleOutlined style={{ color: 'red', marginLeft: 8 }} />
    );
  };

  const actionMenu = (
    <Menu
      items={[
        {
          key: '1',
          icon: <RocketOutlined />,
          label: 'Quick Actions'
        },
        {
          key: '2',
          icon: <FileTextOutlined />,
          label: 'View Documents'
        }
      ]}
    />
  );

  return (
    <Layout 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: theme === 'apple' ? '#f5f5f7' : 'white' 
      }}
    >
      <Content style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        <Row gutter={[24, 24]}>
          {/* Header Section */}
          <Col span={24}>
            <Row justify="space-between" align="middle">
              <Col>
                <Title 
                  level={2} 
                  style={{ 
                    margin: 0, 
                    color: theme === 'apple' ? '#1d1d1f' : '#0C085C' 
                  }}
                >
                  {t('Executive Dashboard')}
                </Title>
                <Text 
                  type="secondary" 
                  style={{ 
                    fontSize: 14, 
                    color: theme === 'apple' ? '#86868b' : undefined 
                  }}
                >
                  {t('Strategic overview and key performance indicators')}
                </Text>
              </Col>
              <Col>
                <Button 
                  icon={<MoreOutlined />} 
                  type="text"
                  onClick={() => setThemeSwitcherVisible(true)}
                >
                  {t('Customize Portal')}
                </Button>
              </Col>
            </Row>
          </Col>

          {/* Key Metrics */}
          <Col xs={24} sm={12} md={6}>
            <Card 
              hoverable 
              style={{ 
                borderRadius: 12, 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
              }}
            >
              <Statistic 
                title={t('Total Revenue')} 
                value={12.5} 
                precision={1} 
                suffix="M" 
                valueStyle={{ color: '#0C085C' }} 
              />
              <Progress 
                percent={75} 
                strokeColor="#0C085C" 
                showInfo={false} 
              />
            </Card>
          </Col>

          {/* Upcoming Meetings */}
          <Col xs={24} sm={12} md={8}>
            <Card 
              title={
                <Row justify="space-between" align="middle">
                  <Title level={5} style={{ margin: 0 }}>
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    {t('Upcoming Meetings')}
                  </Title>
                  <Button type="text" size="small">
                    {t('View All')}
                  </Button>
                </Row>
              }
              style={{ 
                borderRadius: 12, 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
              }}
            >
              <Timeline
                items={upcomingMeetings.map(meeting => ({
                  key: meeting.id,
                  color: meeting.status === 'upcoming' ? 'blue' : 'gray',
                  children: (
                    <>
                      <Text strong>{meeting.title}</Text>
                      <Text type="secondary" style={{ display: 'block' }}>
                        {meeting.time}
                      </Text>
                    </>
                  )
                }))}
              />
            </Card>
          </Col>

          {/* Pending Approvals */}
          <Col xs={24} sm={12} md={10}>
            <Card 
              title={
                <Row justify="space-between" align="middle">
                  <Title level={5} style={{ margin: 0 }}>
                    <FileTextOutlined style={{ marginRight: 8 }} />
                    {t('Pending Approvals')}
                  </Title>
                  <Dropdown overlay={actionMenu} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                </Row>
              }
              style={{ 
                borderRadius: 12, 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
              }}
            >
              {pendingApprovals.map(approval => (
                <Row 
                  key={approval.id} 
                  justify="space-between" 
                  align="middle" 
                  style={{ marginBottom: 12 }}
                >
                  <Col>
                    <Text strong>{approval.title}</Text>
                    <Text 
                      type="secondary" 
                      style={{ display: 'block', textTransform: 'capitalize' }}
                    >
                      {approval.type}
                    </Text>
                  </Col>
                  <Col>
                    <Badge 
                      status="warning" 
                      text={t('Pending')} 
                    />
                  </Col>
                </Row>
              ))}
            </Card>
          </Col>

          {/* Company Performance */}
          <Col span={24}>
            <Card 
              title={
                <Title level={4} style={{ margin: 0 }}>
                  {t('Company Performance')}
                </Title>
              }
              style={{ 
                borderRadius: 12, 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
              }}
            >
              <Row gutter={[16, 16]}>
                {companyPerformance.map(company => (
                  <Col key={company.name} xs={24} sm={12}>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text strong>{company.name}</Text>
                      </Col>
                      <Col>
                        <Text 
                          strong 
                          style={{ 
                            color: company.growth >= 0 ? 'green' : 'red' 
                          }}
                        >
                          {company.growth}%
                          {renderPerformanceIndicator(company.growth)}
                        </Text>
                      </Col>
                    </Row>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>

      <ThemeSwitcher 
        visible={themeSwitcherVisible} 
        onClose={() => setThemeSwitcherVisible(false)} 
      />
    </Layout>
  );
};

export default WorldClassDashboard;
