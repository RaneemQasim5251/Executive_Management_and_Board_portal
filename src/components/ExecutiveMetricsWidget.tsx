import React from 'react';
import { Card, Statistic, Row, Col, Progress, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useAppState } from '../contexts/AppStateProvider';
import { useTranslation } from 'react-i18next';

interface MetricCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  color?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  tooltip?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  suffix,
  prefix,
  color = '#1890ff',
  trend,
  trendValue,
  tooltip
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
    if (trend === 'down') return <ArrowDownOutlined style={{ color: '#ff4d4f' }} />;
    return null;
  };

  return (
    <Card size="small" style={{ height: '100%' }}>
      <Statistic
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {title}
            {tooltip && (
              <Tooltip title={tooltip}>
                <InfoCircleOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
              </Tooltip>
            )}
          </div>
        }
        value={value}
        suffix={suffix}
        prefix={prefix}
        valueStyle={{ color }}
      />
      {trend && trendValue && (
        <div style={{ marginTop: 8, fontSize: 12 }}>
          {getTrendIcon()}
          <span style={{ marginLeft: 4 }}>
            {trendValue > 0 ? '+' : ''}{trendValue}%
          </span>
        </div>
      )}
    </Card>
  );
};

export const ExecutiveMetricsWidget: React.FC = () => {
  const { metrics, loading } = useAppState();
  const { t } = useTranslation();

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <MetricCard
            title={t("Total Revenue")}
            value={metrics.totalRevenue}
            prefix="$"
            color="#52c41a"
            trend="up"
            trendValue={12.5}
            tooltip="Current year revenue performance"
          />
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <MetricCard
            title={t("Active Projects")}
            value={metrics.activeProjects}
            color="#1890ff"
            trend="up"
            trendValue={8.3}
            tooltip="Strategic projects currently in execution"
          />
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <MetricCard
            title={t("Team Members")}
            value={metrics.teamMembers}
            color="#722ed1"
            trend="up"
            trendValue={5.2}
            tooltip="Total team members across all departments"
          />
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <MetricCard
            title={t("Success Rate")}
            value={metrics.successRate}
            suffix="%"
            color="#fa541c"
            trend="up"
            trendValue={2.1}
            tooltip="Project completion success rate"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title={t("Efficiency Score")} size="small">
            <Progress
              type="circle"
              percent={metrics.efficiencyScore}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              format={percent => `${percent}%`}
            />
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <span style={{ color: '#8c8c8c' }}>
                {metrics.efficiencyScore >= 90 ? 'Excellent' : 
                 metrics.efficiencyScore >= 75 ? 'Good' : 
                 metrics.efficiencyScore >= 60 ? 'Average' : 'Needs Improvement'}
              </span>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title={t("Revenue Performance vs Target")} size="small">
            <Progress
              percent={(metrics.totalRevenue / metrics.revenueTarget) * 100}
              status={metrics.totalRevenue >= metrics.revenueTarget ? 'success' : 'active'}
              strokeColor={metrics.totalRevenue >= metrics.revenueTarget ? '#52c41a' : '#1890ff'}
            />
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                Current: ${metrics.totalRevenue.toLocaleString()}
              </span>
              <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                Target: ${metrics.revenueTarget.toLocaleString()}
              </span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};