import React from 'react';
import { Card, Typography, Row, Col, Statistic, Tag, List, Avatar } from 'antd';
import { FileTextOutlined, CalendarOutlined, TrophyOutlined, BarChartOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export const Archive2024: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.toLowerCase().startsWith('ar');
  const T = (key: string) => {
    const map: Record<string, string> = {
      '2024 Archive': 'أرشيف 2024',
      'Total Projects': 'إجمالي المشاريع',
      'Revenue': 'الإيرادات',
      'Achievements': 'الإنجازات',
      'Quarter': 'الربع',
      '📊 Key 2024 Achievements': '📊 أبرز إنجازات 2024',
      'Digital Transformation Initiative Completed': 'اكتمال مبادرة التحول الرقمي',
      'Successfully implemented AI and automation across all departments': 'تم تنفيذ الذكاء الاصطناعي والأتمتة بنجاح عبر جميع الإدارات',
      'APAC Market Expansion': 'التوسع في أسواق آسيا والمحيط الهادئ',
      'Launched operations in Singapore, Tokyo, and Sydney': 'تم إطلاق العمليات في سنغافورة وطوكيو وسيدني',
      'Revenue Growth Target Exceeded': 'تجاوز هدف نمو الإيرادات',
      '125% of annual target achieved': 'تحقيق 125% من الهدف السنوي',
      'completed': 'مكتمل',
      'success': 'نجاح',
      '📈 Year Summary': '📈 ملخص العام',
      'Outstanding Year!': 'عام مميز!',
      '2024 was a remarkable year for our organization with significant achievements in digital transformation, market expansion, and financial performance.': 'كان عام 2024 عاماً مميزاً لمؤسستنا مع إنجازات بارزة في التحول الرقمي والتوسع في السوق والأداء المالي.',
      'Best Revenue Year': 'أفضل عام للإيرادات',
      'Innovation Leader': 'ريادة في الابتكار',
      'Market Expansion': 'التوسع في السوق',
      'Team Growth': 'نمو الفريق',
    };
    return isArabic && map[key] ? map[key] : t(key);
  };

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
          {T("2024 Archive")}
        </Title>
        
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={T("Total Projects")}
              value={156}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1e3a8a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={T("Revenue")}
              value={85.2}
              suffix={isArabic ? "مليون دولار" : "M USD"}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={T("Achievements")}
              value={89}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={T("Quarter")}
              value={isArabic ? "الرابع" : "Q4"}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#0C085C' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title={T('📊 Key 2024 Achievements')} style={{ height: '400px' }}>
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  title: T('Digital Transformation Initiative Completed'),
                  description: T('Successfully implemented AI and automation across all departments'),
                  date: isArabic ? 'ديسمبر 2024' : 'Dec 2024',
                  status: isArabic ? T('completed') : 'completed'
                },
                {
                  title: T('APAC Market Expansion'),
                  description: T('Launched operations in Singapore, Tokyo, and Sydney'),
                  date: isArabic ? 'نوفمبر 2024' : 'Nov 2024',
                  status: isArabic ? T('completed') : 'completed'
                },
                {
                  title: T('Revenue Growth Target Exceeded'),
                  description: T('125% of annual target achieved'),
                  date: isArabic ? 'ديسمبر 2024' : 'Dec 2024',
                  status: isArabic ? T('success') : 'success'
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
          <Card title={T('📈 Year Summary')} style={{ height: '400px' }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Title level={3} style={{ color: '#10b981' }}>{T('Outstanding Year!')}</Title>
              <Text type="secondary">
                {T('2024 was a remarkable year for our organization with significant achievements in digital transformation, market expansion, and financial performance.')}
              </Text>
              <div style={{ marginTop: '20px' }}>
                <Tag color="gold" style={{ margin: '4px' }}>{T('Best Revenue Year')}</Tag>
                <Tag color="blue" style={{ margin: '4px' }}>{T('Innovation Leader')}</Tag>
                <Tag color="green" style={{ margin: '4px' }}>{T('Market Expansion')}</Tag>
                <Tag style={{ margin: '4px', backgroundColor: '#0C085C', color: 'white' }}>{T('Team Growth')}</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      </div>
    </div>
  );
};