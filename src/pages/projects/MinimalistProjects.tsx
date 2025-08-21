import React from 'react';
import { Typography, Button, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MinimalistLayout } from '../../components/layout/MinimalistLayout';
import '../../styles/minimalist.css';

const { Title, Text } = Typography;

// Essential project data only
const projects = [
  {
    id: 1,
    name: 'Digital Transformation',
    status: 'In Progress',
    progress: 65,
    budget: '$2.5M',
    deadline: 'Dec 2024',
  },
  {
    id: 2,
    name: 'JTC Fleet Expansion',
    status: 'Planning',
    progress: 25,
    budget: '$1.8M',
    deadline: 'Mar 2025',
  },
  {
    id: 3,
    name: 'Energy Infrastructure',
    status: 'In Progress',
    progress: 80,
    budget: '$3.2M',
    deadline: 'Jun 2024',
  },
  {
    id: 4,
    name: 'Board Portal Enhancement',
    status: 'Completed',
    progress: 100,
    budget: '$0.5M',
    deadline: 'Jan 2024',
  },
];

export const MinimalistProjects: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <MinimalistLayout>
      <div style={{ 
        padding: '48px',
        background: '#ffffff',
        minHeight: '100vh',
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Title level={1} style={{ 
            margin: 0, 
            color: '#000000', 
            fontSize: '24px',
            fontWeight: 600,
          }}>
            {t('Minimalist Strategic Projects')}
          </Title>
          <Text style={{ 
            color: '#666666', 
            fontSize: '16px',
            display: 'block',
            marginTop: '8px',
          }}>
            {projects.length} {t('active initiatives')}
          </Text>
        </div>

        {/* Projects Table - Minimal */}
        <div style={{ 
          border: '1px solid #f0f0f0',
          background: '#ffffff',
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 80px 100px 100px',
            gap: '16px',
            padding: '16px',
            background: '#fafafa',
            borderBottom: '1px solid #f0f0f0',
            fontSize: '14px',
            fontWeight: 600,
            color: '#000000',
          }}>
            <div>{t('Project')}</div>
            <div>{t('Status')}</div>
            <div>{t('Progress')}</div>
            <div>{t('Budget')}</div>
            <div>{t('Deadline')}</div>
          </div>

          {/* Table Rows */}
          {projects.map((project, index) => (
            <div
              key={project.id}
              onClick={() => navigate(`/board`)}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 80px 100px 100px',
                gap: '16px',
                padding: '16px',
                borderBottom: index < projects.length - 1 ? '1px solid #f8f8f8' : 'none',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8f8f8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div>
                <Text style={{ 
                  fontSize: '15px', 
                  color: '#000000',
                  fontWeight: 500,
                  display: 'block',
                  lineHeight: 1.4,
                }}>
                  {project.name}
                </Text>
              </div>
              <div>
                <span style={{
                  fontSize: '12px',
                  color: project.status === 'Completed' ? '#52c41a' : 
                         project.status === 'In Progress' ? '#1890ff' : '#666666',
                  fontWeight: 500,
                  padding: '2px 8px',
                  background: project.status === 'Completed' ? '#f6ffed' : 
                             project.status === 'In Progress' ? '#f0f9ff' : '#f8f8f8',
                  border: `1px solid ${project.status === 'Completed' ? '#d9f7be' : 
                                      project.status === 'In Progress' ? '#bae7ff' : '#f0f0f0'}`,
                }}>
                  {project.status}
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#000000', fontWeight: 500 }}>
                {project.progress}%
              </div>
              <div style={{ fontSize: '14px', color: '#000000' }}>
                {project.budget}
              </div>
              <div style={{ fontSize: '14px', color: '#666666' }}>
                {project.deadline}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons - Essential Only */}
        <div style={{ 
          marginTop: '32px',
          display: 'flex',
          gap: '16px',
          justifyContent: 'flex-start',
        }}>
          <Button
            onClick={() => navigate('/timeline')}
            style={{
              height: '40px',
              background: '#0C085C',
              border: 'none',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 500,
              padding: '0 24px',
            }}
          >
            {t('View Timeline')}
          </Button>
          <Button
            onClick={() => navigate('/reports')}
            style={{
              height: '40px',
              background: 'transparent',
              border: '1px solid #000000',
              color: '#000000',
              fontSize: '14px',
              fontWeight: 500,
              padding: '0 24px',
            }}
          >
            {t('View Reports')}
          </Button>
        </div>
      </div>
    </MinimalistLayout>
  );
};

export default MinimalistProjects;
