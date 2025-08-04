
import { Card, Row, Col, Typography, Table, Tag, Progress, Space, Statistic, Timeline, Divider } from 'antd';
import { 
  CarOutlined, 
  MobileOutlined, 
  DashboardOutlined,



  FireOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;

export const JOilPage = () => {
  const { t } = useTranslation();


  // Technology initiatives data
  const technologyData = [
    {
      key: '5A',
      actionNo: '5A',
      description: 'Enable Digital Customer Interaction Platforms',
      details: [
        'Launch mobile app and loyalty program: Develop a customer-facing mobile application integrated with a loyalty program to enhance engagement, enable digital transactions, and drive repeat visits. Include features such as station locator, fuel price updates, promotions, and rewards tracking.',
        'Set up CRM and account management process: Implement a CRM system to manage leads, proposals, customer data, conversion cycles and post-sale engagement (Also refer Strategic Initiatives under Sales and Marketing).'
      ],
      remarks: [
        'Under development – inhouse',
        'Will work with Sales team to define CRM workflows and integration points after Oracle EBS/DB upgrade.'
      ],
      period: ['Q4 2025', 'Q1 2026'],
      responsibility: 'CIO',
      status: 'In Development'
    },
    {
      key: '5B',
      actionNo: '5B',
      description: 'Strengthen Enterprise Visibility and Reporting',
      details: [
        'Establish centralized MIS and dashboards: Deploy real-time performance dashboards to monitor key KPIs across stations and regions. Integration with POS and operational systems will support faster, data-driven decision-making at all levels.',
        'Automate internal reporting for key functions: Create automated, role-specific reports for commercial, operations, and finance teams to improve performance tracking, support faster decisions, and reduce manual reporting efforts.'
      ],
      remarks: [
        'Oracle ECC Dashboards are part of Oracle EBS/DB upgrade project. After reviewing standard oracle ECC dashboards, we will go for customization if required',
        'Business stakeholders to finalize reporting needs; automation to follow'
      ],
      period: ['Q3 & Q4 2025', 'Q1 2026'],
      responsibility: 'CIO',
      status: 'Planning'
    }
  ];

  const columns = [
    {
      title: t('Action No.'),
      dataIndex: 'actionNo',
      key: 'actionNo',
      width: 100,
      render: (text: string) => <Tag color="orange" style={{ fontWeight: 'bold' }}>{text}</Tag>
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (text: string, record: any) => (
        <div>
          <Text strong>{text}</Text>
          <div style={{ marginTop: 8 }}>
            {record.details.map((detail: string, index: number) => (
              <div key={index} style={{ marginBottom: 4 }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>• {detail}</Text>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: t('CEO/J:Oil Management Remarks'),
      dataIndex: 'remarks',
      key: 'remarks',
      width: 250,
      render: (remarks: string[]) => (
        <div>
          {remarks.map((remark, index) => (
            <div key={index} style={{ marginBottom: 4 }}>
              <Text style={{ fontSize: '12px' }}>{index + 1}. {remark}</Text>
            </div>
          ))}
        </div>
      )
    },
    {
      title: t('Period / Date'),
      dataIndex: 'period',
      key: 'period',
      width: 150,
      render: (periods: string[]) => (
        <div>
          {periods.map((period, index) => (
            <div key={index} style={{ marginBottom: 2 }}>
              <Text style={{ fontSize: '12px' }}>{period}</Text>
            </div>
          ))}
        </div>
      )
    },
    {
      title: t('Responsibility'),
      dataIndex: 'responsibility',
      key: 'responsibility',
      width: 120,
      render: (text: string) => <Tag color="green">{text}</Tag>
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const color = status === 'In Development' ? 'processing' : 
                     status === 'Planning' ? 'warning' : 'default';
        return <Tag color={color}>{status}</Tag>;
      }
    }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col span={24}>
          <Card style={{ background: '#FF6B35', border: 'none' }}>
            <Row align="middle" gutter={24}>
              <Col flex="none">
                <img 
                  src="/JOIL-LOGO-2.png" 
                  alt="J:Oil Logo" 
                  style={{ height: '80px', width: 'auto' }}
                />
              </Col>
              <Col flex="auto">
                <Title level={1} style={{ color: 'white', margin: 0, fontSize: '42px' }}>
                  J:Oil Petroleum
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
                  Modern Petroleum Infrastructure, Keeping You on the Road
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
              title={t("Petrol Stations")}
              value={207}
              suffix="Stations"
              prefix={<CarOutlined style={{ color: '#FF6B35' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Fuel Types")}
              value={3}
              suffix="Types"
              prefix={<FireOutlined style={{ color: '#FF6B35' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              <Tag color="blue">Diesel</Tag>
              <Tag color="green">91 Octane</Tag>
              <Tag color="orange">95 Octane</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("RFID Integration")}
              value={85}
              suffix="%"
              prefix={<MobileOutlined style={{ color: '#FF6B35' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Daily Transactions")}
              value={15420}
              prefix={<DashboardOutlined style={{ color: '#FF6B35' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Business Overview */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} lg={16}>
          <Card title={t("Business Overview")} 
                headStyle={{ background: '#fff7f0', borderBottom: '2px solid #FF6B35' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                <Text strong>Powering the ambitions of today</Text>
              </Paragraph>
              <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                Among our earliest demonstrations of our commitment to serving the underserved, 
                our petrol stations stand out as one of the most influential in terms of connecting 
                some of the most remote regions of the country.
              </Paragraph>
              <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                Working closely with our Logistics company, Al Jeri Petroleum and Transport Services Company, 
                J:Oil owns and operates over <Text strong style={{ color: '#FF6B35' }}>207 petrol stations</Text>, 
                providing diesel, 91 and 95 octane unleaded.
              </Paragraph>
              
              <Divider />
              
              <Title level={4} style={{ color: '#0C085C' }}>Innovation Focus:</Title>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <Card size="small" style={{ background: '#fff7f0' }}>
                    <Space>
                      <MobileOutlined style={{ color: '#FF6B35' }} />
                      <div>
                        <Text strong>RFID Wireless Authentication System</Text>
                        <br />
                        <Text type="secondary">
                          We have begun implementing a wireless authentication system using RFID technology 
                          to fuel our customers' vehicles with the greatest of ease.
                        </Text>
                      </div>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title={t("Regional Coverage")} 
                headStyle={{ background: '#fff7f0', borderBottom: '2px solid #FF6B35' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <Progress 
                  type="circle" 
                  percent={75} 
                  strokeColor="#FF6B35"
                  format={() => "Remote Areas"}
                />
                <Text style={{ display: 'block', marginTop: '8px', fontSize: '14px' }}>
                  Serving Underserved Regions
                </Text>
              </div>
              
              <Divider />
              
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Urban Stations:</Text>
                  <Text strong>132</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Rural Stations:</Text>
                  <Text strong>75</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Highway Stations:</Text>
                  <Text strong>45</Text>
                </div>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Technology Initiatives */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title={
            <Space>
              <SettingOutlined style={{ color: '#FF6B35' }} />
              <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>
                Technology Strategic Initiatives
              </Text>
            </Space>
          } headStyle={{ background: '#fff7f0', borderBottom: '2px solid #FF6B35' }}>
            <Table
              columns={columns}
              dataSource={technologyData}
              pagination={false}
              scroll={{ x: 1200 }}
              size="middle"
              style={{ marginTop: '16px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Digital Roadmap */}
      <Row gutter={[24, 24]} style={{ marginTop: '32px' }}>
        <Col span={24}>
          <Card title={t("Digital Transformation Roadmap")} 
                headStyle={{ background: '#fff7f0', borderBottom: '2px solid #FF6B35' }}>
            <Timeline
              items={[
                {
                  dot: <MobileOutlined style={{ fontSize: '16px', color: '#FF6B35' }} />,
                  children: (
                    <div>
                      <Text strong>Q4 2025: Mobile App Launch</Text>
                      <br />
                      <Text type="secondary">Customer-facing app with loyalty program and station locator</Text>
                    </div>
                  ),
                },
                {
                  dot: <DashboardOutlined style={{ fontSize: '16px', color: '#52c41a' }} />,
                  children: (
                    <div>
                      <Text strong>Q1 2026: CRM Implementation</Text>
                      <br />
                      <Text type="secondary">Complete customer relationship management system</Text>
                    </div>
                  ),
                },
                {
                  dot: <SettingOutlined style={{ fontSize: '16px', color: '#faad14' }} />,
                  children: (
                    <div>
                      <Text strong>Q2 2026: Enterprise Dashboards</Text>
                      <br />
                      <Text type="secondary">Real-time performance monitoring across all stations</Text>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};