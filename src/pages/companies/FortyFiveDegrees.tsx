
import { Card, Row, Col, Typography, Tag, Progress, Space, Statistic, Timeline, Divider } from 'antd';
import { 
  CoffeeOutlined, 
  RiseOutlined, 


  TeamOutlined,
  FireOutlined,

  StarOutlined,
  CarOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;

export const FortyFiveDegreesPage = () => {
  const { t } = useTranslation();


  // Current operations data
  const operationsData = [
    { type: 'Flagship Cafe', count: 1, location: 'Riyadh Central', status: 'Operating' },
    { type: 'Drive-thru Outlets', count: 6, location: 'Riyadh', status: 'Operating' },
    { type: 'Planned Drive-thrus', count: 93, location: 'Saudi Arabia', status: 'Planning' }
  ];

  // Coffee sourcing regions
  const sourcingRegions = [
    { region: 'South America', percentage: 60, quality: 'Premium Arabica', color: '#8B4513' },
    { region: 'Africa', percentage: 40, quality: 'Specialty Blends', color: '#D2691E' }
  ];

  // Expansion timeline
  const expansionMilestones = [
    { year: '2024', target: 7, achieved: 7, status: 'completed' },
    { year: '2025', target: 100, achieved: 0, status: 'in-progress' },
    { year: '2026', target: 150, achieved: 0, status: 'planned' }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col span={24}>
          <Card style={{ background: '#8B4513', border: 'none' }}>
            <Row align="middle" gutter={24}>
              <Col flex="none">
                <img 
                  src="/45-logo-1-1.png" 
                  alt="45degrees Logo" 
                  style={{ height: '80px', width: 'auto' }}
                />
              </Col>
              <Col flex="auto">
                <Title level={1} style={{ color: 'white', margin: 0, fontSize: '42px' }}>
                  45degrees Cafe & Drive-thru
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
                  Exacting Standards, for Quality in a Timely Fashion
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
              title={t("Current Outlets")}
              value={7}
              suffix="Total"
              prefix={<CoffeeOutlined style={{ color: '#8B4513' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              <Tag color="green">1 Flagship</Tag>
              <Tag color="blue">6 Drive-thru</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("2025 Target")}
              value={100}
              suffix="Drive-thrus"
              prefix={<RiseOutlined style={{ color: '#8B4513' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Quality Rating")}
              value={4.9}
              suffix="/5.0"
              prefix={<StarOutlined style={{ color: '#8B4513' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Daily Customers")}
              value={2850}
              prefix={<TeamOutlined style={{ color: '#8B4513' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Business Overview */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} lg={16}>
          <Card title={t("Business Overview")} 
                headStyle={{ background: '#faf7f2', borderBottom: '2px solid #8B4513' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                <Text strong>A perennially productive part of the economy</Text>
              </Paragraph>
              <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                Aiming to become the instinctive choice for coffee in the region, 45degrees Cafe leans on our 
                well trained baristas and highly selective sourcing process for coffee beans.
              </Paragraph>
              <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                Quality beans deserve quality treatment, and our roasting technology does justice to our 
                <Text strong style={{ color: '#8B4513' }}> South American and African beans</Text> in preserving 
                their character and aroma, delivering a flavourful experience every time, guaranteed.
              </Paragraph>
              <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                Building on our <Text strong style={{ color: '#8B4513' }}>flagship cafe and 6 drive-thrus in Riyadh</Text>, 
                45degrees is poised to operate over <Text strong style={{ color: '#8B4513' }}>100 drive-thru cafes</Text> in 
                Saudi Arabia by 2025.
              </Paragraph>
              
              <Divider />
              
              <Title level={4} style={{ color: '#0C085C' }}>Core Advantages:</Title>
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Tag color="brown">Premium Bean Sourcing</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="orange">Advanced Roasting Technology</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="green">Trained Baristas</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="blue">Drive-thru Convenience</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="purple">Quality Consistency</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="cyan">Customer Experience</Tag>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title={t("Coffee Sourcing")} 
                headStyle={{ background: '#faf7f2', borderBottom: '2px solid #8B4513' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {sourcingRegions.map((item, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Text style={{ fontSize: '14px' }}>{item.region}</Text>
                    <Text strong style={{ color: item.color }}>{item.percentage}%</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                    {item.quality}
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
                <FireOutlined style={{ fontSize: '24px', color: '#8B4513', marginBottom: '8px' }} />
                <Text strong style={{ fontSize: '14px', display: 'block' }}>
                  Roasting Excellence
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Preserving character & aroma
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Expansion Strategy */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} lg={16}>
          <Card title={t("Expansion Timeline")} 
                headStyle={{ background: '#faf7f2', borderBottom: '2px solid #8B4513' }}>
            <Row gutter={[24, 24]}>
              {expansionMilestones.map((milestone, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card size="small" style={{ 
                    background: milestone.status === 'completed' ? '#f6ffed' : 
                               milestone.status === 'in-progress' ? '#fff7e6' : '#f0f0f0',
                    textAlign: 'center'
                  }}>
                    <Space direction="vertical" size="small">
                      <Text strong style={{ fontSize: '18px', color: '#8B4513' }}>{milestone.year}</Text>
                      <div>
                        <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>
                          {milestone.status === 'completed' ? milestone.achieved : milestone.target}
                        </Text>
                        <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                          {milestone.status === 'completed' ? 'Completed' : 'Target'} Outlets
                        </Text>
                      </div>
                      <Tag color={
                        milestone.status === 'completed' ? 'green' :
                        milestone.status === 'in-progress' ? 'orange' : 'default'
                      }>
                        {milestone.status === 'completed' ? 'Achieved' :
                         milestone.status === 'in-progress' ? 'In Progress' : 'Planned'}
                      </Tag>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title={t("Strategic Focus")} 
                headStyle={{ background: '#faf7f2', borderBottom: '2px solid #8B4513' }}>
            <Timeline
              items={[
                {
                  dot: <CoffeeOutlined style={{ fontSize: '16px', color: '#8B4513' }} />,
                  children: (
                    <div>
                      <Text strong>Quality First</Text>
                      <br />
                      <Text type="secondary">Maintain premium coffee standards</Text>
                    </div>
                  ),
                },
                {
                  dot: <CarOutlined style={{ fontSize: '16px', color: '#52c41a' }} />,
                  children: (
                    <div>
                      <Text strong>Drive-thru Focus</Text>
                      <br />
                      <Text type="secondary">Convenience for busy customers</Text>
                    </div>
                  ),
                },
                {
                  dot: <RiseOutlined style={{ fontSize: '16px', color: '#faad14' }} />,
                  children: (
                    <div>
                      <Text strong>Rapid Expansion</Text>
                      <br />
                      <Text type="secondary">100+ locations by 2025</Text>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Market Position */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title={t("Market Resilience & Strategy")} 
                headStyle={{ background: '#faf7f2', borderBottom: '2px solid #8B4513' }}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card size="small" style={{ background: '#f9f9f9' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#8B4513' }}>Economic Resilience</Text>
                    <Text style={{ fontSize: '13px' }}>
                      The food and beverage sector is highly robust. Even during COVID-19, 
                      food remained a top priority as an essential service.
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" style={{ background: '#f9f9f9' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#8B4513' }}>Convenience Focus</Text>
                    <Text style={{ fontSize: '13px' }}>
                      Al Jeri focuses on convenience for the consumer, with upscale sit-down 
                      as well as Drive-thru cafes.
                    </Text>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" style={{ background: '#f9f9f9' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ color: '#8B4513' }}>Regional Leadership</Text>
                    <Text style={{ fontSize: '13px' }}>
                      Aiming to become the instinctive choice for coffee in the region 
                      through consistent quality and service excellence.
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