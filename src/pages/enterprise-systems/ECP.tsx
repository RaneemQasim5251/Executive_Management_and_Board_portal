import React from 'react';
import { Card, Typography, Row, Col, Progress, Statistic } from 'antd';
import { useTranslation } from 'react-i18next';
import { 
  CloudServerOutlined, 
  DatabaseOutlined, 
  SecurityScanOutlined, 
  RocketOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

const ECPPage: React.FC = () => {
  const { t } = useTranslation();

  const platformStats = [
    {
      title: t('Cloud Infrastructure'),
      value: '98.7%',
      icon: <CloudServerOutlined />,
      color: '#0C085C'
    },
    {
      title: t('Data Security'),
      value: '99.9%',
      icon: <SecurityScanOutlined />,
      color: '#363692'
    },
    {
      title: t('System Performance'),
      value: '96.5%',
      icon: <RocketOutlined />,
      color: '#0095CE'
    }
  ];

  const enterpriseIntegrations = [
    {
      title: t('KPI Management'),
      progress: 85,
      status: 'active'
    },
    {
      title: t('Resource Planning'),
      progress: 65,
      status: 'normal'
    },
    {
      title: t('Business Intelligence'),
      progress: 95,
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
        {t('Enterprise Control Platform (ECP)')}
      </Title>

      <Row gutter={[16, 16]}>
        {platformStats.map((stat, index) => (
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
        {t('Enterprise Integrations')}
      </Title>

      <Row gutter={[16, 16]}>
        {enterpriseIntegrations.map((integration, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card 
              style={{ 
                borderRadius: '12px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
              }}
            >
              <Title level={4} style={{ margin: 0, marginBottom: '12px' }}>
                {integration.title}
              </Title>
              <Progress 
                percent={integration.progress} 
                status={integration.status} 
                strokeColor="#0C085C"
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ECPPage;
