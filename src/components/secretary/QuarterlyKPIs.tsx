import React from 'react';
import { Card, Row, Col, Statistic, Progress, Typography, Space, Tag } from 'antd';
import { 
  TrophyOutlined, 
  DollarOutlined, 
  TeamOutlined, 
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { Quarter, KPI } from '../../types/secretary';

const { Title, Text } = Typography;

const KPICard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  
  .ant-card-head {
    background: linear-gradient(135deg, #0C085C 0%, #363692 100%);
    border-bottom: none;
    
    .ant-card-head-title {
      color: white;
      font-weight: 600;
    }
  }
`;

const MetricCard = styled.div<{ status: 'good' | 'warning' | 'danger' }>`
  background: ${props => {
    switch (props.status) {
      case 'good': return 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)';
      case 'warning': return 'linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)';
      case 'danger': return 'linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)';
      default: return '#ffffff';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'good': return '#b7eb8f';
      case 'warning': return '#ffe58f';
      case 'danger': return '#ffa39e';
      default: return '#d9d9d9';
    }
  }};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
`;

interface QuarterlyKPIsProps {
  quarter: Quarter;
  kpis?: KPI[];
}

export const QuarterlyKPIs: React.FC<QuarterlyKPIsProps> = ({ quarter, kpis = [] }) => {
  // Mock KPI data
  const mockKPIs = {
    revenue: { value: 2.4, target: 2.0, unit: 'M SAR', growth: 12.5 },
    customerSatisfaction: { value: 4.2, target: 4.0, unit: '/5', growth: 8.2 },
    pendingDirectives: { value: 4, target: 0, unit: 'items', growth: -20 },
    completedTasks: { value: 87, target: 90, unit: '%', growth: 5.3 },
    teamPerformance: { value: 3.8, target: 4.0, unit: '/5', growth: -2.1 },
    projectsOnTime: { value: 92, target: 95, unit: '%', growth: 3.2 }
  };

  const getStatusColor = (value: number, target: number, isInverse = false) => {
    const ratio = value / target;
    if (isInverse) {
      if (ratio <= 0.5) return 'good';
      if (ratio <= 1) return 'warning';
      return 'danger';
    } else {
      if (ratio >= 1) return 'good';
      if (ratio >= 0.8) return 'warning';
      return 'danger';
    }
  };

  const formatGrowth = (growth: number) => {
    const color = growth >= 0 ? '#52c41a' : '#ff4d4f';
    const icon = growth >= 0 ? '↗' : '↘';
    return (
      <Text style={{ color, fontSize: 12, fontWeight: 600 }}>
        {icon} {Math.abs(growth)}%
      </Text>
    );
  };

  return (
    <div>
      <KPICard title={`${quarter.label} ${quarter.year} Performance Overview`}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <MetricCard status={getStatusColor(mockKPIs.revenue.value, mockKPIs.revenue.target)}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space justify="space-between" style={{ width: '100%' }}>
                  <DollarOutlined style={{ fontSize: 20, color: '#0095CE' }} />
                  {formatGrowth(mockKPIs.revenue.growth)}
                </Space>
                <Statistic
                  title="Revenue"
                  value={mockKPIs.revenue.value}
                  suffix={mockKPIs.revenue.unit}
                  precision={1}
                  valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
                />
                <Progress
                  percent={(mockKPIs.revenue.value / mockKPIs.revenue.target) * 100}
                  showInfo={false}
                  strokeColor="#0095CE"
                  size="small"
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Target: {mockKPIs.revenue.target}{mockKPIs.revenue.unit}
                </Text>
              </Space>
            </MetricCard>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <MetricCard status={getStatusColor(mockKPIs.customerSatisfaction.value, mockKPIs.customerSatisfaction.target)}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space justify="space-between" style={{ width: '100%' }}>
                  <TrophyOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                  {formatGrowth(mockKPIs.customerSatisfaction.growth)}
                </Space>
                <Statistic
                  title="Customer Satisfaction"
                  value={mockKPIs.customerSatisfaction.value}
                  suffix={mockKPIs.customerSatisfaction.unit}
                  precision={1}
                  valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
                />
                <Progress
                  percent={(mockKPIs.customerSatisfaction.value / 5) * 100}
                  showInfo={false}
                  strokeColor="#52c41a"
                  size="small"
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Target: {mockKPIs.customerSatisfaction.target}{mockKPIs.customerSatisfaction.unit}
                </Text>
              </Space>
            </MetricCard>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <MetricCard status={getStatusColor(mockKPIs.pendingDirectives.value, 1, true)}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space justify="space-between" style={{ width: '100%' }}>
                  <ExclamationCircleOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />
                  {formatGrowth(mockKPIs.pendingDirectives.growth)}
                </Space>
                <Statistic
                  title="Pending Directives"
                  value={mockKPIs.pendingDirectives.value}
                  suffix={mockKPIs.pendingDirectives.unit}
                  valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
                />
                <div style={{ height: 6 }}>
                  {mockKPIs.pendingDirectives.value === 0 ? (
                    <Tag color="success" style={{ margin: 0 }}>All Clear</Tag>
                  ) : (
                    <Tag color="warning" style={{ margin: 0 }}>Action Required</Tag>
                  )}
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Target: 0 items
                </Text>
              </Space>
            </MetricCard>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <MetricCard status={getStatusColor(mockKPIs.completedTasks.value, mockKPIs.completedTasks.target)}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space justify="space-between" style={{ width: '100%' }}>
                  <CheckCircleOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  {formatGrowth(mockKPIs.completedTasks.growth)}
                </Space>
                <Statistic
                  title="Tasks Completed"
                  value={mockKPIs.completedTasks.value}
                  suffix={mockKPIs.completedTasks.unit}
                  valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
                />
                <Progress
                  percent={mockKPIs.completedTasks.value}
                  showInfo={false}
                  strokeColor="#1890ff"
                  size="small"
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Target: {mockKPIs.completedTasks.target}{mockKPIs.completedTasks.unit}
                </Text>
              </Space>
            </MetricCard>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <MetricCard status={getStatusColor(mockKPIs.teamPerformance.value, mockKPIs.teamPerformance.target)}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space justify="space-between" style={{ width: '100%' }}>
                  <TeamOutlined style={{ fontSize: 20, color: '#722ed1' }} />
                  {formatGrowth(mockKPIs.teamPerformance.growth)}
                </Space>
                <Statistic
                  title="Team Performance"
                  value={mockKPIs.teamPerformance.value}
                  suffix={mockKPIs.teamPerformance.unit}
                  precision={1}
                  valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
                />
                <Progress
                  percent={(mockKPIs.teamPerformance.value / 5) * 100}
                  showInfo={false}
                  strokeColor="#722ed1"
                  size="small"
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Target: {mockKPIs.teamPerformance.target}{mockKPIs.teamPerformance.unit}
                </Text>
              </Space>
            </MetricCard>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <MetricCard status={getStatusColor(mockKPIs.projectsOnTime.value, mockKPIs.projectsOnTime.target)}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space justify="space-between" style={{ width: '100%' }}>
                  <ClockCircleOutlined style={{ fontSize: 20, color: '#fa8c16' }} />
                  {formatGrowth(mockKPIs.projectsOnTime.growth)}
                </Space>
                <Statistic
                  title="Projects On Time"
                  value={mockKPIs.projectsOnTime.value}
                  suffix={mockKPIs.projectsOnTime.unit}
                  valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
                />
                <Progress
                  percent={mockKPIs.projectsOnTime.value}
                  showInfo={false}
                  strokeColor="#fa8c16"
                  size="small"
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Target: {mockKPIs.projectsOnTime.target}{mockKPIs.projectsOnTime.unit}
                </Text>
              </Space>
            </MetricCard>
          </Col>
        </Row>
      </KPICard>

      {/* Quarter Status */}
      <Card title="Quarter Status" style={{ borderRadius: 12 }}>
        <Row gutter={16} align="middle">
          <Col span={12}>
            <Space direction="vertical">
              <Text strong>Period</Text>
              <Text>
                {quarter.startDate.toLocaleDateString()} - {quarter.endDate.toLocaleDateString()}
              </Text>
            </Space>
          </Col>
          <Col span={12}>
            <Space direction="vertical">
              <Text strong>Status</Text>
              <Tag color={quarter.closed ? 'success' : 'processing'}>
                {quarter.closed ? 'Closed' : 'Active'}
              </Tag>
            </Space>
          </Col>
        </Row>
        
        {!quarter.closed && (
          <div style={{ marginTop: 16 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              This quarter is currently active. KPIs are updated in real-time.
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
};