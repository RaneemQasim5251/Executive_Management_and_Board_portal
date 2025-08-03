import React from 'react';
import { Card, Row, Col, Typography, Tag, Progress, Space, Statistic, Timeline, Divider, List } from 'antd';
import { 
  CarOutlined, 
  RiseOutlined, 
  SafetyOutlined,
  GlobalOutlined,
  TeamOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;

export const ShaheenPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Vehicle fleet data
  const fleetData = [
    { category: 'Economy Cars', count: 85, percentage: 35, color: '#52c41a' },
    { category: 'Mid-Range Vehicles', count: 120, percentage: 45, color: '#1890ff' },
    { category: 'Luxury Vehicles', count: 35, percentage: 15, color: '#722ed1' },
    { category: 'SUVs & Trucks', count: 20, percentage: 8, color: '#fa8c16' }
  ];

  // Expansion timeline
  const expansionPlan = [
    { city: 'Riyadh', status: 'Operating', outlets: 2, year: '2024' },
    { city: 'Jeddah', status: 'Planning', outlets: 3, year: '2025' },
    { city: 'Dammam', status: 'Planning', outlets: 2, year: '2025' },
    { city: 'Mecca', status: 'Future', outlets: 2, year: '2026' },
    { city: 'Medina', status: 'Future', outlets: 1, year: '2026' }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col span={24}>
          <Card style={{ background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', border: 'none' }}>
            <Row align="middle" gutter={24}>
              <Col flex="none">
                <img 
                  src="/Shaheen-Logo.png" 
                  alt="Shaheen Logo" 
                  style={{ height: '80px', width: 'auto' }}
                />
              </Col>
              <Col flex="auto">
                <Title level={1} style={{ color: 'white', margin: 0, fontSize: '42px' }}>
                  Shaheen Rent a Car
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
                  The Vehicle You Want, When You Want
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Key Metrics Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Total Fleet")}
              value={260}
              suffix="Vehicles"
              prefix={<CarOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Active Outlets")}
              value={2}
              suffix="Riyadh"
              prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Customer Satisfaction")}
              value={4.8}
              suffix="/5.0"
              prefix={<StarOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Monthly Rentals")}
              value={1840}
              prefix={<RiseOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Business Overview */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} lg={16}>
          <Card title={t("Business Overview")} 
                headStyle={{ background: '#f0f8ff', borderBottom: '2px solid #1890ff' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                <Text strong>Providing for our customers the freedom of movement</Text>
              </Paragraph>
              <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                With a diverse fleet of vehicles ranging from unassuming economy cars, to iconic luxury vehicles, 
                Shaheen rent a car works with our clients to hire out precisely the car which best fits their use case.
              </Paragraph>
              <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                Currently operating <Text strong style={{ color: '#1890ff' }}>two outlets in Riyadh</Text>, 
                Shaheen Rent a Car is at present focused on developing a modern, end-to-end platform. 
                Shaheen rent a car will soon after expand its presence across the country, opening outlets in 
                <Text strong style={{ color: '#1890ff' }}> Jeddah and Dammam</Text>.
              </Paragraph>
              
              <Divider />
              
              <Title level={4} style={{ color: '#0C085C' }}>Service Categories:</Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Tag color="green">Economy Cars</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="blue">Mid-Range Vehicles</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="purple">Luxury Vehicles</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="orange">SUVs & Trucks</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="cyan">Short-term Rentals</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="volcano">Long-term Leasing</Tag>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title={t("Fleet Composition")} 
                headStyle={{ background: '#f0f8ff', borderBottom: '2px solid #1890ff' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {fleetData.map((item, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Text style={{ fontSize: '14px' }}>{item.category}</Text>
                    <Text strong style={{ color: item.color }}>{item.count}</Text>
                  </div>
                  <Progress 
                    percent={item.percentage} 
                    strokeColor={item.color}
                    showInfo={false}
                    size="small"
                  />
                </div>
              ))}
              
              <Divider />
              
              <div style={{ textAlign: 'center' }}>
                <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                  Total: 260 Vehicles
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Expansion Strategy */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} lg={16}>
          <Card title={t("Expansion Plan")} 
                headStyle={{ background: '#f0f8ff', borderBottom: '2px solid #1890ff' }}>
            <List
              dataSource={expansionPlan}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<EnvironmentOutlined style={{ color: '#1890ff', fontSize: '20px' }} />}
                    title={
                      <Space>
                        <Text strong>{item.city}</Text>
                        <Tag color={
                          item.status === 'Operating' ? 'green' :
                          item.status === 'Planning' ? 'blue' : 'default'
                        }>
                          {item.status}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space>
                        <Text type="secondary">{item.outlets} outlets planned</Text>
                        <Text type="secondary">• Target: {item.year}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title={t("Digital Platform Development")} 
                headStyle={{ background: '#f0f8ff', borderBottom: '2px solid #1890ff' }}>
            <Timeline
              items={[
                {
                  dot: <CarOutlined style={{ fontSize: '16px', color: '#1890ff' }} />,
                  children: (
                    <div>
                      <Text strong>Q1 2025: Platform Launch</Text>
                      <br />
                      <Text type="secondary">End-to-end digital booking system</Text>
                    </div>
                  ),
                },
                {
                  dot: <GlobalOutlined style={{ fontSize: '16px', color: '#52c41a' }} />,
                  children: (
                    <div>
                      <Text strong>Q2 2025: Mobile App</Text>
                      <br />
                      <Text type="secondary">iOS and Android applications</Text>
                    </div>
                  ),
                },
                {
                  dot: <RiseOutlined style={{ fontSize: '16px', color: '#faad14' }} />,
                  children: (
                    <div>
                      <Text strong>Q3 2025: National Expansion</Text>
                      <br />
                      <Text type="secondary">Jeddah and Dammam outlets</Text>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Integration Strategy */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title={t("Portfolio Integration")} 
                headStyle={{ background: '#f0f8ff', borderBottom: '2px solid #1890ff' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card size="small" style={{ background: '#f9f9f9' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#1890ff' }}>J:Oil Synergy</Text>
                    <Text style={{ fontSize: '13px' }}>
                      Fleet refueling partnerships with J:Oil stations for cost optimization
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" style={{ background: '#f9f9f9' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#1890ff' }}>JTC Integration</Text>
                    <Text style={{ fontSize: '13px' }}>
                      Vehicle transport services leveraging JTC's car carrier fleet
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" style={{ background: '#f9f9f9' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#1890ff' }}>Digital Innovation</Text>
                    <Text style={{ fontSize: '13px' }}>
                      Seamless customer experience through innovative digital technologies
                    </Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};