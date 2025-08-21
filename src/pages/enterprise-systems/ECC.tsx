import React from 'react';
import { Card, Typography, Row, Col, Statistic, Progress } from 'antd';
import { useTranslation } from 'react-i18next';
import { 
  DashboardOutlined, 
  ProjectOutlined, 
  TeamOutlined, 
  GlobalOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

const ECCPage: React.FC = () => {
  const { t } = useTranslation();

  const systemStats = [
    {
      title: t('Enterprise Systems'),
      value: 12,
      icon: <GlobalOutlined />,
      color: '#0C085C'
    },
    {
      title: t('Active Projects'),
      value: 45,
      icon: <ProjectOutlined />,
      color: '#363692'
    },
    {
      title: t('Team Members'),
      value: 256,
      icon: <TeamOutlined />,
      color: '#0095CE'
    }
  ];

  const strategicInitiatives = [
    {
      title: t('Digital Transformation'),
      progress: 75,
      status: 'active'
    },
    {
      title: t('AI Integration'),
      progress: 45,
      status: 'normal'
    },
    {
      title: t('Cloud Migration'),
      progress: 90,
      status: 'success'
    }
  ];

  return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh' 
    }}>
      <Title level={2} style={{ 
        color: '#0C085C', 
        marginBottom: '24px' 
      }}>
        {t('Enterprise Control Center (ECC)')}
      </Title>

      <Row gutter={[16, 16]}>
        {systemStats.map((stat, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card 
              hoverable 
              style={{ 
                borderRadius: '12px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}>
                <div>
                  <Title level={4} style={{ margin: 0, color: stat.color }}>
                    {stat.title}
                  </Title>
                  <Text style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: stat.color 
                  }}>
                    {stat.value}
                  </Text>
                </div>
                {React.cloneElement(stat.icon, { 
                  style: { 
                    fontSize: '48px', 
                    color: stat.color, 
                    opacity: 0.3 
                  } 
                })}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Title level={3} style={{ 
        marginTop: '24px', 
        marginBottom: '16px', 
        color: '#0C085C' 
      }}>
        {t('Strategic Initiatives')}
      </Title>

      <Row gutter={[16, 16]}>
        {strategicInitiatives.map((initiative, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card 
              style={{ 
                borderRadius: '12px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
              }}
            >
              <Title level={4} style={{ margin: 0, marginBottom: '12px' }}>
                {initiative.title}
              </Title>
              <Progress 
                percent={initiative.progress} 
                status={initiative.status} 
                strokeColor="#0C085C"
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ECCPage;
