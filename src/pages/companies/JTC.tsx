import React from 'react';
import { Card, Row, Col, Typography, Table, Tag, Progress, Space, Statistic, Timeline, Divider } from 'antd';
import { 
  TruckOutlined, 
  RiseOutlined, 
  SafetyOutlined,
  GlobalOutlined,
  TeamOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;

export const JTCPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Action tracking data
  const actionData = [
    {
      key: '2A',
      actionNo: '2A',
      description: 'Implementation of Transportation Management System (TMS)',
      details: [
        'Assess and Select a Suitable TMS: Evaluate leading TMS providers based on JTC\'s logistics needs, scalability, and integration capabilities through an external consultant',
        'Develop TMS Implementation Roadmap: Define implementation phases, covering order management, route optimization, load planning, and tracking.',
        'Ensure seamless integration with ERP, fleet tracking, invoicing, and customer portals.'
      ],
      remarks: [
        'Three suppliers under assessment and waiting to finalize the technical and commercial proposals',
        'will work with business owners to finalize it',
        'will be assessed after upgrade'
      ],
      period: ['Starting 1- August 25', '2- mid July 25', '3- TBD'],
      responsibility: 'CIO',
      status: 'In Progress'
    },
    {
      key: '2B',
      actionNo: '2B',
      description: 'Process Automation',
      details: [
        'Identify Manual Processes for Automation: Conduct an assessment of high-impact manual tasks across operations, finance, HR, sales, and logistics.',
        'Deploy workflow automation tools for trip approvals, contract processing, payroll, and HR requests etc. identified above.',
        'Ensure seamless integration of automated processes with existing Oracle ERP, Transportation Management System (TMS), and finance modules.'
      ],
      remarks: [
        'will work with the business to identify the list of required automations',
        'action plan for implementing the automation tools',
        'will be assessed after upgrade'
      ],
      period: ['1. End of August 2025', '2. Start - December 25', '3. TBD'],
      responsibility: 'CIO',
      status: 'Planning'
    },
    {
      key: '2C',
      actionNo: '2C',
      description: 'Digital Transformation',
      details: [
        'Conduct a Digital Tools Assessment: Evaluate the need for Digital tools for transformation like Driver Management System, Plant Maintenance System, Truck Lifecycle Management, Fleet Management System, and Environment Compliance System.',
        'Implement appropriate tools relevant to the nature and size of operations based on the results of the assessment.'
      ],
      remarks: [
        'we need a specialized external consultant to conduct Digital transformation assessment'
      ],
      period: ['Start Q1 2026'],
      responsibility: 'CIO',
      status: 'Future'
    },
    {
      key: '3B',
      actionNo: '3B',
      description: 'Budgeting & MIS Functions',
      details: [
        'Standardize & Automate Financial Reports & MIS Packs: Create a single-source financial reporting system to eliminate inconsistencies in board/MIS reports.',
        'Implement Periodic Financial Review & Management Meetings: Establish monthly & quarterly financial review meetings with structured reporting templates and documented minutes.'
      ],
      remarks: [
        'after the oracle upgrade we will have dashboard for finance reporting',
        'Monthly meeting will be conducted on third week of each month'
      ],
      period: ['1. Q1 26 – complete', '2. July 25 (clarification required)', '3. Q1 26 (Not available in table)'],
      responsibility: 'CIO',
      status: 'In Progress'
    }
  ];

  const columns = [
    {
      title: t('Action No.'),
      dataIndex: 'actionNo',
      key: 'actionNo',
      width: 100,
      render: (text: string) => <Tag color="blue" style={{ fontWeight: 'bold' }}>{text}</Tag>
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
      title: t('CEO/JTC Management Remarks'),
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
        const color = status === 'In Progress' ? 'processing' : 
                     status === 'Planning' ? 'warning' : 'default';
        return <Tag color={color}>{status}</Tag>;
      }
    }
  ];

  // Key clients data
  const clients = [
    { name: 'Saudi Electricity Company', logo: 'saudi-electricity-company-logo-5870D69B9B-seeklogo 1' },
    { name: 'Saudi Aramco', logo: 'saudi_aramco' },
    { name: 'SABIC', logo: 'SABIC_Logo_RGB_PNG_tcm1010-2093 1' },
    { name: 'Petromin', logo: 'petromin-logo-41FFFD3B0E-seeklogo 1' },
    { name: 'Rally Dakar', logo: null },
    { name: 'Shell', logo: null },
    { name: 'Maaden', logo: null }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col span={24}>
          <Card style={{ background: 'linear-gradient(135deg, #0C085C 0%, #0095CE 100%)', border: 'none' }}>
            <Row align="middle" gutter={24}>
              <Col flex="none">
                <img 
                  src="/al-Jeri-Transpo-2.png" 
                  alt="JTC Logo" 
                  style={{ height: '80px', width: 'auto' }}
                />
              </Col>
              <Col flex="auto">
                <Title level={1} style={{ color: 'white', margin: 0, fontSize: '42px' }}>
                  JTC Transport & Logistics
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
                  Advanced Transportation Solutions, Delivering Tomorrow's Infrastructure
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
              title={t("Fleet Size")}
              value={1250}
              suffix="Trucks"
              prefix={<TruckOutlined style={{ color: '#0095CE' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Trailers")}
              value={3000}
              suffix="Units"
              prefix={<SafetyOutlined style={{ color: '#0095CE' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Active Projects")}
              value={47}
              prefix={<RiseOutlined style={{ color: '#0095CE' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Client Satisfaction")}
              value={98.5}
              suffix="%"
              prefix={<GlobalOutlined style={{ color: '#0095CE' }} />}
              valueStyle={{ color: '#0C085C', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Business Overview */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} lg={16}>
          <Card title={t("Business Overview")} 
                headStyle={{ background: '#f8f9ff', borderBottom: '2px solid #0095CE' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                <Text strong>A client in motion stays in motion</Text>
              </Paragraph>
              <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                Since our inception, our core business area has been industrial and commercial transportation. 
                A sector poised for further growth with the expansion of the Saudi economy, and related development projects.
              </Paragraph>
              <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                We own and operate a service fleet of over <Text strong style={{ color: '#0C085C' }}>1250 trucks</Text> and 
                <Text strong style={{ color: '#0C085C' }}> 3000 trailers</Text>. The company transports asphalt, 
                industrial and consumer grade fuels, cement, and general goods to our clients.
              </Paragraph>
              
              <Divider />
              
              <Title level={4} style={{ color: '#0C085C' }}>Services Include:</Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Tag color="blue">Asphalt Transportation</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="green">Consumer Grade Fuels</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="orange">Industrial Fuels (A1 Jet Fuel)</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="purple">Heavy Fuel Oil</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="cyan">Cement Transportation</Tag>
                </Col>
                <Col span={12}>
                  <Tag color="volcano">General Goods & Perishables</Tag>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title={t("Key Clients")} 
                headStyle={{ background: '#f8f9ff', borderBottom: '2px solid #0095CE' }}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {clients.map((client, index) => (
                <div key={index} style={{ 
                  padding: '8px 12px', 
                  border: '1px solid #e8e8e8', 
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <GlobalOutlined style={{ color: '#0095CE', marginRight: '8px' }} />
                  <Text style={{ fontSize: '14px' }}>{client.name}</Text>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Strategic Action Plan */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title={
            <Space>
              <SettingOutlined style={{ color: '#0095CE' }} />
              <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>
                Technology & Digital Transformation Action Plan
              </Text>
            </Space>
          } headStyle={{ background: '#f8f9ff', borderBottom: '2px solid #0095CE' }}>
            <Table
              columns={columns}
              dataSource={actionData}
              pagination={false}
              scroll={{ x: 1200 }}
              size="middle"
              style={{ marginTop: '16px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Progress Timeline */}
      <Row gutter={[24, 24]} style={{ marginTop: '32px' }}>
        <Col span={24}>
          <Card title={t("Implementation Timeline")} 
                headStyle={{ background: '#f8f9ff', borderBottom: '2px solid #0095CE' }}>
            <Timeline
              items={[
                {
                  dot: <ClockCircleOutlined style={{ fontSize: '16px', color: '#0095CE' }} />,
                  children: (
                    <div>
                      <Text strong>Q3 2025: TMS Implementation</Text>
                      <br />
                      <Text type="secondary">Finalize supplier selection and begin implementation</Text>
                    </div>
                  ),
                },
                {
                  dot: <SettingOutlined style={{ fontSize: '16px', color: '#52c41a' }} />,
                  children: (
                    <div>
                      <Text strong>Q4 2025: Process Automation</Text>
                      <br />
                      <Text type="secondary">Deploy workflow automation tools</Text>
                    </div>
                  ),
                },
                {
                  dot: <RiseOutlined style={{ fontSize: '16px', color: '#faad14' }} />,
                  children: (
                    <div>
                      <Text strong>Q1 2026: Digital Transformation</Text>
                      <br />
                      <Text type="secondary">Full digital assessment and implementation</Text>
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