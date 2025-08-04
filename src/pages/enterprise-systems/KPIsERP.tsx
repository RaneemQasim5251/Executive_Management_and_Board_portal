import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Tabs,
  Select,
  Space,
  Button,
  Spin,
  Alert,
  message
} from 'antd';
import {
  DashboardOutlined,
  BarChartOutlined,
  TeamOutlined,
  DollarOutlined,
  TruckOutlined,
  CoffeeOutlined,
  CarOutlined,
  ClockCircleOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { PowerBIEmbed } from 'powerbi-client-react';
import { usePowerBI } from '../../hooks/usePowerBI';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface PowerBIReport {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  embedUrl: string;
  reportId: string;
  icon: React.ReactElement;
  category: 'operational' | 'financial' | 'hr';
}

const KPIsERP: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedReport, setSelectedReport] = useState<string>('all');
  const [localLoading, setLocalLoading] = useState<{[key: string]: boolean}>({});
  const [refreshKey, setRefreshKey] = useState<number>(0);
  
  const {
    loading: powerBILoading,
    error: powerBIError,
    refreshReport,
    exportToPDF,
    getEmbedConfig,
    handleEmbedded,
    getEventHandlers
  } = usePowerBI();

  const reports: PowerBIReport[] = [
    {
      id: 'jtc',
      title: 'JTC Fleet Status',
      titleAr: 'حالة أسطول الجري للنقل',
      description: 'Real-time fleet monitoring and logistics KPIs',
      descriptionAr: 'مراقبة الأسطول في الوقت الفعلي ومؤشرات اللوجستيات',
      embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=de40b238-ed32-4ca6-abe5-7383e5785ddf&autoAuth=true&ctid=ba2cab20-721a-44f0-bec4-f2e784ba3c23',
      reportId: 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      icon: <TruckOutlined />,
      category: 'operational'
    },
    {
      id: 'aljeri',
      title: 'Al Jeri Investment Portfolio',
      titleAr: 'محفظة استثمارات الجري',
      description: 'Consolidated investment performance and ROI analytics',
      descriptionAr: 'أداء الاستثمارات الموحد وتحليلات العائد على الاستثمار',
      embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=de40b238-ed32-4ca6-abe5-7383e5785ddf&autoAuth=true&ctid=ba2cab20-721a-44f0-bec4-f2e784ba3c23',
      reportId: 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      icon: <BarChartOutlined />,
      category: 'financial'
    },
    {
      id: 'joil',
      title: 'J:Oil Petroleum Operations',
      titleAr: 'عمليات جي أويل للبترول',
      description: 'Fuel station performance and petroleum distribution metrics',
      descriptionAr: 'أداء محطات الوقود ومقاييس توزيع البترول',
      embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=de40b238-ed32-4ca6-abe5-7383e5785ddf&autoAuth=true&ctid=ba2cab20-721a-44f0-bec4-f2e784ba3c23',
      reportId: 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      icon: <DashboardOutlined />,
      category: 'operational'
    },
    {
      id: 'timeattendance',
      title: 'Time & Attendance',
      titleAr: 'الوقت والحضور',
      description: 'Employee attendance tracking and workforce analytics',
      descriptionAr: 'تتبع حضور الموظفين وتحليلات القوى العاملة',
      embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=de40b238-ed32-4ca6-abe5-7383e5785ddf&autoAuth=true&ctid=ba2cab20-721a-44f0-bec4-f2e784ba3c23',
      reportId: 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      icon: <ClockCircleOutlined />,
      category: 'hr'
    },
    {
      id: 'fortyfive',
      title: '45 Degrees Cafe Analytics',
      titleAr: 'تحليلات مقهى 45 درجة',
      description: 'Cafe operations, sales trends and customer insights',
      descriptionAr: 'عمليات المقهى واتجاهات المبيعات ورؤى العملاء',
      embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=de40b238-ed32-4ca6-abe5-7383e5785ddf&autoAuth=true&ctid=ba2cab20-721a-44f0-bec4-f2e784ba3c23',
      reportId: 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      icon: <CoffeeOutlined />,
      category: 'operational'
    },
    {
      id: 'shaheen',
      title: 'Shaheen Rent a Car',
      titleAr: 'شاهين لتأجير السيارات',
      description: 'Vehicle rental fleet utilization and revenue tracking',
      descriptionAr: 'استخدام أسطول تأجير المركبات وتتبع الإيرادات',
      embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=de40b238-ed32-4ca6-abe5-7383e5785ddf&autoAuth=true&ctid=ba2cab20-721a-44f0-bec4-f2e784ba3c23',
      reportId: 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      icon: <CarOutlined />,
      category: 'operational'
    },
    {
      id: 'revenue',
      title: 'Group Revenue Dashboard',
      titleAr: 'لوحة إيرادات المجموعة',
      description: 'Consolidated group revenue analysis and financial performance',
      descriptionAr: 'تحليل إيرادات المجموعة الموحد والأداء المالي',
      embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=de40b238-ed32-4ca6-abe5-7383e5785ddf&autoAuth=true&ctid=ba2cab20-721a-44f0-bec4-f2e784ba3c23',
      reportId: 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      icon: <DollarOutlined />,
      category: 'financial'
    }
  ];

  const handleReportLoad = (reportId: string) => {
    setLocalLoading(prev => ({ ...prev, [reportId]: true }));
    setTimeout(() => {
      setLocalLoading(prev => ({ ...prev, [reportId]: false }));
    }, 3000);
  };

  const handleRefreshReport = async (reportId: string) => {
    setRefreshKey(prev => prev + 1);
    handleReportLoad(reportId);
    try {
      await refreshReport(reportId);
      message.success(t("Report refreshed successfully"));
    } catch (error) {
      message.error(t("Failed to refresh report"));
    }
  };

  const handleExportToPDF = async (reportId: string) => {
    try {
      await exportToPDF(reportId);
      message.success(t("Export started successfully"));
    } catch (error) {
      message.error(t("Failed to export report"));
    }
  };

  const openFullscreen = (embedUrl: string) => {
    window.open(embedUrl, '_blank', 'fullscreen=yes,scrollbars=yes,resizable=yes');
  };

  const eventHandlersMap = getEventHandlers();

  const renderPowerBIReport = (report: PowerBIReport) => (
    <Card
      key={`${report.id}-${refreshKey}`}
      title={
        <Space>
          {report.icon}
          <span>{i18n.language === 'ar' ? report.titleAr : report.title}</span>
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => handleRefreshReport(report.id)}
            title={t("Refresh")}
            loading={powerBILoading}
          />
          <Button
            type="text"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleExportToPDF(report.id)}
            title={t("Export to PDF")}
          />
          <Button
            type="text"
            size="small"
            icon={<FullscreenOutlined />}
            onClick={() => openFullscreen(report.embedUrl)}
            title={t("Open in new tab")}
          />
        </Space>
      }
      style={{
        marginBottom: 24,
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '2px solid #f0f0f0'
      }}
      bodyStyle={{ padding: '12px' }}
    >
      <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
        {i18n.language === 'ar' ? report.descriptionAr : report.description}
      </Text>
      
      <div style={{ position: 'relative', height: '600px', background: '#f8f9fa', borderRadius: '8px' }}>
        {(localLoading[report.id] || powerBILoading) && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            borderRadius: '8px'
          }}>
            <Spin size="large" tip={t("Loading Power BI Report...")} />
          </div>
        )}
        
        {powerBIError && (
          <Alert
            message="Power BI Error"
            description={powerBIError}
            type="error"
            showIcon
            style={{ margin: '16px 0' }}
          />
        )}
        
        {/* Power BI Embed Component */}
        <PowerBIEmbed
          embedConfig={getEmbedConfig({
            reportId: report.reportId,
            embedUrl: report.embedUrl
          })}
          eventHandlers={eventHandlersMap}
          cssClassName={`powerbi-report-${report.id}`}
          getEmbeddedComponent={(embeddedComponent) => handleEmbedded(report.id, embeddedComponent)}
          style={{
            height: '600px',
            width: '100%',
            border: 'none',
            borderRadius: '8px'
          }}
        />
      </div>
    </Card>
  );

  const operationalReports = reports.filter(r => r.category === 'operational');
  const financialReports = reports.filter(r => r.category === 'financial');
  const hrReports = reports.filter(r => r.category === 'hr');

  return (
    <div style={{ padding: '24px' }}>
      {/* Header Section */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#0C085C' }}>
            {t("KPIs → ERP")}
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            {i18n.language === 'ar' 
              ? 'مؤشرات الأداء الرئيسية ونظام تخطيط موارد المؤسسة - تكامل متقدم مع Power BI'
              : 'Key Performance Indicators & Enterprise Resource Planning - Advanced Power BI Integration'
            }
          </Text>
        </Col>
        <Col>
          <Space>
            <Select
              defaultValue="all"
              style={{ width: 200 }}
              value={selectedReport}
              onChange={setSelectedReport}
            >
              <Option value="all">{t("All Reports")}</Option>
              <Option value="operational">{t("Operations")}</Option>
              <Option value="financial">{t("Financial")}</Option>
              <Option value="hr">{t("HR & Workforce")}</Option>
            </Select>
          </Space>
        </Col>
      </Row>

      {/* Enhanced Info Alert */}
      <Alert
        message={i18n.language === 'ar' ? 'تكامل Power BI المتقدم' : 'Advanced Power BI Integration'}
        description={i18n.language === 'ar' 
          ? 'يستخدم هذا النظام مكتبات Power BI الرسمية للتكامل المتقدم مع لوحات المعلومات. جميع التقارير محمية بالمصادقة الآمنة ومحدثة في الوقت الفعلي.'
          : 'This system uses official Power BI libraries for advanced dashboard integration. All reports are secured with authentication and updated in real-time.'
        }
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
        action={
          <Button size="small" type="primary">
            {i18n.language === 'ar' ? 'تعرف على المزيد' : 'Learn More'}
          </Button>
        }
      />

      {/* Quick Stats */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={8}>
          <Card style={{ textAlign: 'center', background: '#0C085C', color: '#fff', border: 'none' }}>
            <DashboardOutlined style={{ fontSize: '32px', marginBottom: 8 }} />
            <Title level={3} style={{ color: '#fff', margin: 0 }}>{reports.length}</Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
              {i18n.language === 'ar' ? 'التقارير النشطة' : 'Active Reports'}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ textAlign: 'center', background: '#10B981', color: '#fff', border: 'none' }}>
            <BarChartOutlined style={{ fontSize: '32px', marginBottom: 8 }} />
            <Title level={3} style={{ color: '#fff', margin: 0 }}>24/7</Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
              {i18n.language === 'ar' ? 'المراقبة المستمرة' : 'Real-time Monitoring'}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ textAlign: 'center', background: '#F59E0B', color: '#fff', border: 'none' }}>
            <TeamOutlined style={{ fontSize: '32px', marginBottom: 8 }} />
            <Title level={3} style={{ color: '#fff', margin: 0 }}>5</Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
              {i18n.language === 'ar' ? 'الشركات التابعة' : 'Business Units'}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Power BI Reports */}
      <Tabs
        activeKey={selectedReport}
        size="large"
        style={{ background: '#fff', borderRadius: '12px', padding: '16px' }}
        onChange={setSelectedReport}
      >
        <TabPane tab={
          <Space>
            <DashboardOutlined />
            {t("All Reports")}
          </Space>
        } key="all">
          <Alert
            message={i18n.language === 'ar' ? 'جميع التقارير' : 'All Reports'}
            description={i18n.language === 'ar' 
              ? 'عرض شامل لجميع مؤشرات الأداء الرئيسية عبر المجموعة باستخدام تكامل Power BI المتقدم'
              : 'Comprehensive view of all KPIs across the group using advanced Power BI integration'
            }
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <Row gutter={[24, 24]}>
            {reports.map(report => (
              <Col xs={24} key={report.id}>
                {renderPowerBIReport(report)}
              </Col>
            ))}
          </Row>
        </TabPane>

        <TabPane tab={
          <Space>
            <TruckOutlined />
            {t("Operations")}
          </Space>
        } key="operational">
          <Alert
            message={i18n.language === 'ar' ? 'التقارير التشغيلية' : 'Operational Reports'}
            description={i18n.language === 'ar' 
              ? 'مراقبة الأداء التشغيلي للشركات التابعة مع تحليلات متقدمة'
              : 'Monitor operational performance across subsidiaries with advanced analytics'
            }
            type="success"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <Row gutter={[24, 24]}>
            {operationalReports.map(report => (
              <Col xs={24} key={report.id}>
                {renderPowerBIReport(report)}
              </Col>
            ))}
          </Row>
        </TabPane>

        <TabPane tab={
          <Space>
            <DollarOutlined />
            {t("Financial")}
          </Space>
        } key="financial">
          <Alert
            message={i18n.language === 'ar' ? 'التقارير المالية' : 'Financial Reports'}
            description={i18n.language === 'ar' 
              ? 'تحليل الأداء المالي والإيرادات مع مؤشرات الربحية'
              : 'Financial performance and revenue analysis with profitability indicators'
            }
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <Row gutter={[24, 24]}>
            {financialReports.map(report => (
              <Col xs={24} key={report.id}>
                {renderPowerBIReport(report)}
              </Col>
            ))}
          </Row>
        </TabPane>

        <TabPane tab={
          <Space>
            <TeamOutlined />
            {t("HR & Workforce")}
          </Space>
        } key="hr">
          <Alert
            message={i18n.language === 'ar' ? 'تقارير الموارد البشرية' : 'HR & Workforce Reports'}
            description={i18n.language === 'ar' 
              ? 'إدارة الموارد البشرية والحضور والغياب مع تحليلات الأداء'
              : 'Human resources management and attendance tracking with performance analytics'
            }
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <Row gutter={[24, 24]}>
            {hrReports.map(report => (
              <Col xs={24} key={report.id}>
                {renderPowerBIReport(report)}
              </Col>
            ))}
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default KPIsERP;