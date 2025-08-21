import React from 'react';
import { Row, Col, Typography, Space, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../../styles/minimalist.css';

const { Title, Text } = Typography;

// Essential data only - no decorative elements
const executiveMetrics = [
  { label: 'Revenue', value: '$82M', change: '+12%', route: '/reports' },
  { label: 'Projects', value: '45', change: '+7', route: '/board' },
  { label: 'Team', value: '284', change: '+12', route: '/companies/jtc' },
  { label: 'Efficiency', value: '96%', change: '+4%', route: '/reports' },
];

const todaysPriorities = [
  'Board Meeting Q2 Review - 09:00',
  'JTC Strategic Planning - 14:00', 
  'Energy Sector Update - 16:30',
];

const criticalUpdates = [
  'Q2 Revenue target exceeded by 12%',
  'JTC project milestone completed',
  'Board agenda ready for review',
];

export const MinimalistDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{ 
      padding: '48px',
      background: '#ffffff',
      minHeight: '100vh',
      maxWidth: '1000px',
      margin: '0 auto',
    }}>
      
      {/* Executive Greeting - Minimal */}
      <div style={{ marginBottom: '48px' }}>
        <Title level={1} style={{ 
          margin: 0, 
          color: '#000000', 
          fontSize: '24px',
          fontWeight: 600,
          lineHeight: 1.2,
        }}>
          {t('Minimalist Executive Overview')}
        </Title>
        <Text style={{ 
          color: '#666666', 
          fontSize: '16px',
          display: 'block',
          marginTop: '8px',
        }}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </div>

      {/* Key Metrics - Pure Numbers */}
      <div style={{ marginBottom: '48px' }}>
        <Row gutter={[32, 32]}>
          {executiveMetrics.map((metric, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <div
                onClick={() => navigate(metric.route)}
                style={{
                  padding: '24px',
                  border: '1px solid #f0f0f0',
                  background: '#ffffff',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#f0f0f0';
                }}
              >
                <div style={{
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#000000',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}>
                  {metric.value}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666666',
                  marginBottom: '4px',
                }}>
                  {metric.label}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: metric.change.startsWith('+') ? '#52c41a' : '#ff4d4f',
                  fontWeight: 500,
                }}>
                  {metric.change}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Today's Priorities - Essential Only */}
      <Row gutter={[48, 48]}>
        <Col xs={24} lg={12}>
          <div style={{ marginBottom: '32px' }}>
            <Title level={3} style={{ 
              margin: '0 0 16px 0', 
              color: '#000000', 
              fontSize: '18px',
              fontWeight: 600,
            }}>
              {t('Today')}
            </Title>
            <div style={{ 
              border: '1px solid #f0f0f0',
              background: '#ffffff',
            }}>
              {todaysPriorities.map((priority, index) => (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    borderBottom: index < todaysPriorities.length - 1 ? '1px solid #f8f8f8' : 'none',
                  }}
                >
                  <Text style={{ 
                    fontSize: '15px', 
                    color: '#000000',
                    lineHeight: 1.4,
                  }}>
                    {priority}
                  </Text>
                </div>
              ))}
            </div>
            <Button
              block
              onClick={() => navigate('/my-meetings')}
              style={{
                marginTop: '16px',
                height: '40px',
                background: 'transparent',
                border: '1px solid #000000',
                color: '#000000',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              {t('View Schedule')}
            </Button>
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <div style={{ marginBottom: '32px' }}>
            <Title level={3} style={{ 
              margin: '0 0 16px 0', 
              color: '#000000', 
              fontSize: '18px',
              fontWeight: 600,
            }}>
              {t('Updates')}
            </Title>
            <div style={{ 
              border: '1px solid #f0f0f0',
              background: '#ffffff',
            }}>
              {criticalUpdates.map((update, index) => (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    borderBottom: index < criticalUpdates.length - 1 ? '1px solid #f8f8f8' : 'none',
                  }}
                >
                  <Text style={{ 
                    fontSize: '15px', 
                    color: '#000000',
                    lineHeight: 1.4,
                  }}>
                    {update}
                  </Text>
                </div>
              ))}
            </div>
            <Button
              block
              onClick={() => navigate('/reports')}
              style={{
                marginTop: '16px',
                height: '40px',
                background: 'transparent',
                border: '1px solid #000000',
                color: '#000000',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              {t('View Reports')}
            </Button>
          </div>
        </Col>
      </Row>

      {/* Quick Navigation - Essential Actions Only */}
      <div style={{ 
        marginTop: '48px',
        paddingTop: '32px',
        borderTop: '1px solid #f0f0f0',
      }}>
        <Row gutter={[16, 16]}>
          {[
            { label: t('Projects'), route: '/board' },
            { label: t('Timeline'), route: '/timeline' },
            { label: t('Companies'), route: '/companies/jtc' },
            { label: t('Reports'), route: '/reports' },
          ].map((action, index) => (
            <Col xs={12} sm={6} key={index}>
              <Button
                block
                onClick={() => navigate(action.route)}
                style={{
                  height: '48px',
                  background: index === 0 ? '#0C085C' : 'transparent',
                  border: `1px solid ${index === 0 ? '#0C085C' : '#000000'}`,
                  color: index === 0 ? '#ffffff' : '#000000',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {action.label}
              </Button>
            </Col>
          ))}
        </Row>
      </div>

      {/* Language Toggle - Bottom Corner */}
      <div style={{ 
        position: 'fixed',
        bottom: '24px',
        left: '24px',
      }}>
        <button
          onClick={toggleLanguage}
          style={{
            background: 'transparent',
            border: '1px solid #e0e0e0',
            color: '#666666',
            fontSize: '12px',
            padding: '8px 12px',
            cursor: 'pointer',
          }}
        >
          {i18n.language === 'ar' ? 'EN' : 'ع'}
        </button>
      </div>

      {/* Voice Control - Bottom Right */}
      <div style={{ 
        position: 'fixed',
        bottom: '24px',
        right: '24px',
      }}>
        <button
          onClick={() => {
            // Simple voice control activation
            if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance(
                t('Voice control activated. Say dashboard, projects, timeline, or reports.')
              );
              speechSynthesis.speak(utterance);
            }
          }}
          style={{
            width: '48px',
            height: '48px',
            background: '#0C085C',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={t('Voice Control')}
        >
          🎤
        </button>
      </div>
    </div>
  );
};

export default MinimalistDashboard;
