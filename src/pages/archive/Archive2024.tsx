import React from 'react';
import { Card, Typography, Row, Col, Statistic, Tag, List, Avatar } from 'antd';
import { FileTextOutlined, CalendarOutlined, TrophyOutlined, BarChartOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export const Archive2024: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh', overflow: 'auto' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Title 
          level={1} 
          style={{ 
            margin: 0, 
            background: "#0C085C",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "42px",
            fontWeight: "800",
            textAlign: "center",
            marginBottom: "32px"
          }}
        >
          {t("2024 Archive")}
        </Title>
        
        <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Total Projects")}
              value={156}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1e3a8a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Revenue")}
              value={85.2}
              suffix="M USD"
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Achievements")}
              value={89}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t("Quarter")}
              value="Q4"
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#0C085C' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="📊 Key 2024 Achievements" style={{ height: '400px' }}>
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  title: 'Digital Transformation Initiative Completed',
                  description: 'Successfully implemented AI and automation across all departments',
                  date: 'Dec 2024',
                  status: 'completed'
                },
                {
                  title: 'APAC Market Expansion',
                  description: 'Launched operations in Singapore, Tokyo, and Sydney',
                  date: 'Nov 2024',
                  status: 'completed'
                },
                {
                  title: 'Revenue Growth Target Exceeded',
                  description: '125% of annual target achieved',
                  date: 'Dec 2024',
                  status: 'success'
                }
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#1e3a8a' }}>{item.title.charAt(0)}</Avatar>}
                    title={item.title}
                    description={
                      <div>
                        <Text type="secondary">{item.description}</Text>
                        <br />
                        <Tag color="blue" style={{ marginTop: '8px' }}>{item.date}</Tag>
                        <Tag color="green">{item.status}</Tag>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="📈 Year Summary" style={{ height: '400px' }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Title level={3} style={{ color: '#10b981' }}>Outstanding Year!</Title>
              <Text type="secondary">
                2024 was a remarkable year for our organization with significant achievements in digital transformation, market expansion, and financial performance.
              </Text>
              <div style={{ marginTop: '20px' }}>
                <Tag color="gold" style={{ margin: '4px' }}>Best Revenue Year</Tag>
                <Tag color="blue" style={{ margin: '4px' }}>Innovation Leader</Tag>
                <Tag color="green" style={{ margin: '4px' }}>Market Expansion</Tag>
                <Tag style={{ margin: '4px', backgroundColor: '#0C085C', color: 'white' }}>Team Growth</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      </div>
    </div>
  );
};