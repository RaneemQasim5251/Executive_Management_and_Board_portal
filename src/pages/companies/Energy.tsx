import React from 'react';
import { Card, Row, Col, Typography, Tag, Progress, Space, Statistic, Timeline, Divider, List } from 'antd';
import { 
  ThunderboltOutlined, 
  SunOutlined, 
  CarOutlined,
  GlobalOutlined,
  TeamOutlined,
  SettingOutlined,
  EnvironmentOutlined,
  RiseOutlined,
  PoweroffOutlined,
  FireOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;

export const EnergyPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Solutions data
  const solutionsData = [
    { name: 'Solar Energy Systems', icon: <SunOutlined />, projects: 12, capacity: '2.5MW', color: '#faad14' },
    { name: 'EV Charging Stations', icon: <CarOutlined />, projects: 8, capacity: '150 Units', color: '#52c41a' },
    { name: 'Power Supply UPS Batteries', icon: <PoweroffOutlined />, projects: 25, capacity: '500kW', color: '#1890ff' },
    { name: 'Diesel Power Generators', icon: <FireOutlined />, projects: 15, capacity: '1.2MW', color: '#ff4d4f' },
    { name: 'Bio Diesel Power Generators', icon: <EnvironmentOutlined />, projects: 6, capacity: '300kW', color: '#52c41a' },
    { name: 'GEH2 Hydrogen Fuel Cell Generators', icon: <ThunderboltOutlined />, projects: 3, capacity: '100kW', color: '#722ed1' }
  ];

  // Market segments
  const marketSegments = [
    { segment: 'Corporate Clients', percentage: 45, projects: 28, color: '#1890ff' },
    { segment: 'Government Projects', percentage: 30, projects: 18, color: '#52c41a' },
    { segment: 'Industrial Facilities', percentage: 25, projects: 15, color: '#faad14' }
  ];

  // Sustainability metrics
  const sustainabilityMetrics = [
    { metric: 'CO2 Reduction', value: '1,250', unit: 'tons/year', icon: <EnvironmentOutlined /> },
    { metric: 'Renewable Energy Generated', value: '3.2', unit: 'GWh/year', icon: <SunOutlined /> },
    { metric: 'Fossil Fuel Displacement', value: '850', unit: 'MWh/year', icon: <ThunderboltOutlined /> }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col span={24}>
          <Card style={{ background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)', border: 'none' }}>
            <Row align="middle" gutter={24}>
              <Col flex="none">
                <img 
                  src="/al-Jeri-Energy-2.png" 
                  alt="Al Jeri Energy Logo" 
                  style={{ height: '80px', width: 'auto' }}
                />
              </Col>
              <Col flex="auto">
                <Title level={1} style={{ color: 'white', margin: 0, fontSize: '42px' }}>
                  Al Jeri Energy
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
                  Renewable Energy for a Sustainable Tomorrow
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
              title={t("Years Experience")}
              value={35}
              suffix="Combined"
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Active Projects")}
              value={69}
              prefix={<SettingOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Total Capacity")}
              value="4.6"
              suffix="MW"
              prefix={<ThunderboltOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("CO2 Reduction")}
              value="1,250"
              suffix="tons/year"
              prefix={<EnvironmentOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Business Overview */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} lg={16}>
          <Card title={t("Business Overview")} 
                headStyle={{ background: '#f6ffed', borderBottom: '2px solid #52c41a' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                <Text strong>Powering the ambitions of tomorrow</Text>
              </Paragraph>
              <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                Al Jeri Energy is a sustainability oriented energy company looking to expand the use of solar energy 
                and electric vehicle charging stations throughout Saudi Arabia.
              </Paragraph>
              <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                With over <Text strong style={{ color: '#52c41a' }}>35 years of combined experience</Text> in design, 
                integration, installation, and maintenance, JE's expert team helps companies divest from fossil fuels 
                and adopt green technologies.
              </Paragraph>
              <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                The supply of energy is one of the most critical sustainability concerns faced by corporations and 
                governments alike. We see it as a highly valuable sector for integrating across our portfolio as our 
                environmental vision places great emphasis on <Text strong style={{ color: '#52c41a' }}>energy independence</Text>.
              </Paragraph>
              
              <Divider />
              
              <Title level={4} style={{ color: '#0C085C' }}>Core Services:</Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Tag color="green">Solar Energy Systems</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="blue">EV Charging Stations</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="orange">Power Supply UPS</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="purple">Hydrogen Fuel Cells</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="volcano">Bio Diesel Generators</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="cyan">Design & Installation</Tag>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title={t("Market Segments")} 
                headStyle={{ background: '#f6ffed', borderBottom: '2px solid #52c41a' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {marketSegments.map((item, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Text style={{ fontSize: '14px' }}>{item.segment}</Text>
                    <Text strong style={{ color: item.color }}>{item.projects}</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                    {item.percentage}% of portfolio
                  </Text>
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
                <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                  Total: 61 Active Projects
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Solutions Portfolio */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col span={24}>
          <Card title={t("Energy Solutions Portfolio")} 
                headStyle={{ background: '#f6ffed', borderBottom: '2px solid #52c41a' }}>
            <Row gutter={[16, 16]}>
              {solutionsData.map((solution, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card size="small" style={{ textAlign: 'center', height: '140px' }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ fontSize: '24px', color: solution.color }}>
                        {solution.icon}
                      </div>
                      <Text strong style={{ fontSize: '14px' }}>{solution.name}</Text>
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {solution.projects} Projects • {solution.capacity}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Sustainability Impact */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} lg={16}>
          <Card title={t("Sustainability Impact")} 
                headStyle={{ background: '#f6ffed', borderBottom: '2px solid #52c41a' }}>
            <Row gutter={[16, 16]}>
              {sustainabilityMetrics.map((metric, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card size="small" style={{ background: '#f9f9f9', textAlign: 'center' }}>
                    <Space direction="vertical" size="small">
                      <div style={{ fontSize: '20px', color: '#52c41a' }}>
                        {metric.icon}
                      </div>
                      <Text strong style={{ fontSize: '14px' }}>{metric.metric}</Text>
                      <div>
                        <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                          {metric.value}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                          {metric.unit}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title={t("Strategic Vision")} 
                headStyle={{ background: '#f6ffed', borderBottom: '2px solid #52c41a' }}>
            <Timeline
              items={[
                {
                  dot: <SunOutlined style={{ fontSize: '16px', color: '#52c41a' }} />,
                  children: (
                    <div>
                      <Text strong>Solar Expansion</Text>
                      <br />
                      <Text type="secondary">Kingdom-wide solar deployment</Text>
                    </div>
                  ),
                },
                {
                  dot: <CarOutlined style={{ fontSize: '16px', color: '#1890ff' }} />,
                  children: (
                    <div>
                      <Text strong>EV Infrastructure</Text>
                      <br />
                      <Text type="secondary">National charging network</Text>
                    </div>
                  ),
                },
                {
                  dot: <EnvironmentOutlined style={{ fontSize: '16px', color: '#faad14' }} />,
                  children: (
                    <div>
                      <Text strong>Carbon Neutrality</Text>
                      <br />
                      <Text type="secondary">Supporting Vision 2030 goals</Text>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Portfolio Integration */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title={t("Portfolio Integration Opportunities")} 
                headStyle={{ background: '#f6ffed', borderBottom: '2px solid #52c41a' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card size="small" style={{ background: '#f9f9f9' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#52c41a' }}>J:Oil Integration</Text>
                    <Text style={{ fontSize: '13px' }}>
                      Solar panels and EV charging stations at petrol stations for comprehensive energy services
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" style={{ background: '#f9f9f9' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#52c41a' }}>JTC Fleet Electrification</Text>
                    <Text style={{ fontSize: '13px' }}>
                      Supporting the transition to electric commercial vehicles with charging infrastructure
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" style={{ background: '#f9f9f9' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#52c41a' }}>Environmental Vision</Text>
                    <Text style={{ fontSize: '13px' }}>
                      Great emphasis on energy independence across all Al Jeri Investment operations
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