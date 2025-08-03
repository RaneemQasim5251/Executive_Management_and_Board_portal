import React from 'react';
import { Card, Button, Space, Typography } from 'antd';
import { CalendarOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const { Text, Paragraph } = Typography;

export const TimelineAccess: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card 
      title={
        <Space>
          <CalendarOutlined style={{ color: '#1890ff' }} />
          {t("Strategic Timeline")}
        </Space>
      }
      extra={
        <Button 
          type="primary" 
          icon={<ArrowRightOutlined />}
          onClick={() => navigate('/timeline')}
          size="small"
        >
          {t("View Timeline")}
        </Button>
      }
      size="small"
      style={{ marginBottom: 16 }}
    >
      <Paragraph style={{ margin: 0, fontSize: '13px' }}>
        {t("Access the comprehensive strategic timeline (الجدول الزمني الاستراتيجي) showing all major milestones and initiatives.")}
      </Paragraph>
    </Card>
  );
};