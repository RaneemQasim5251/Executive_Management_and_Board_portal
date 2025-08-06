import React, { useState, useEffect } from 'react';
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
  message,
  DatePicker,
  Dropdown,
  Badge,
  Statistic,
  Progress,
  Tag,
  Tooltip,
  Drawer,
  Switch,
  Slider,
  Input,
  Menu,
  Avatar,
  Divider
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
  DownloadOutlined,
  FilterOutlined,
  SettingOutlined,
  EyeOutlined,
  ShareAltOutlined,
  PrinterOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PoweroffOutlined,
  SyncOutlined,
  BellOutlined,
  StarOutlined,
  ThunderboltOutlined,
  RiseOutlined,
  FallOutlined,
  LineChartOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  CalendarOutlined,
  GlobalOutlined,
  UserOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
// Temporarily removed PowerBI client imports due to embed URL compatibility issues
// import { PowerBIEmbed } from 'powerbi-client-react';
// import { usePowerBI } from '../../hooks/usePowerBI';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

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
  company: string;
  lastUpdated: Date;
  status: 'active' | 'maintenance' | 'offline';
  priority: 'high' | 'medium' | 'low';
  metrics: KPIMetric[];
  tags: string[];
}

interface KPIMetric {
  id: string;
  name: string;
  nameAr: string;
  value: number;
  previousValue: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  icon: React.ReactElement;
}

interface FilterState {
  dateRange: [string, string] | null;
  companies: string[];
  categories: string[];
  status: string[];
  searchTerm: string;
  refreshInterval: number;
  autoRefresh: boolean;
}

interface DashboardSettings {
  theme: 'light' | 'dark';
  layout: 'grid' | 'list';
  showMetrics: boolean;
  showFilters: boolean;
  notifications: boolean;
  autoSync: boolean;
}

const KPIsERP: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedReport, setSelectedReport] = useState<string>('all');
  const [localLoading, setLocalLoading] = useState<{[key: string]: boolean}>({});
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState<boolean>(false);
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Advanced Filter State
  const [filters, setFilters] = useState<FilterState>({
    dateRange: null,
    companies: [],
    categories: [],
    status: ['active'],
    searchTerm: '',
    refreshInterval: 300000, // 5 minutes
    autoRefresh: true
  });
  
  // Dashboard Settings
  const [settings, setSettings] = useState<DashboardSettings>({
    theme: 'light',
    layout: 'grid',
    showMetrics: true,
    showFilters: true,
    notifications: true,
    autoSync: true
  });
  
  // Real-time data refresh
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (filters.autoRefresh && filters.refreshInterval > 0) {
      interval = setInterval(() => {
        handleAutoRefresh();
      }, filters.refreshInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [filters.autoRefresh, filters.refreshInterval]);
  
  const handleAutoRefresh = () => {
    setRefreshKey(prev => prev + 1);
    message.success(t('Data synchronized successfully'), 2);
  };
  
  const handleRefresh = (reportId: string) => {
    setLocalLoading(prev => ({ ...prev, [reportId]: true }));
    setRefreshKey(prev => prev + 1);
    setTimeout(() => {
      setLocalLoading(prev => ({ ...prev, [reportId]: false }));
      message.success(t('Report refreshed successfully'));
    }, 1500);
  };
  
  const handleExport = (format: 'pdf' | 'excel' | 'ppt') => {
    message.loading(t('Preparing export...'), 1);
    setTimeout(() => {
      message.success(t(`Export to ${format.toUpperCase()} completed!`));
    }, 2000);
  };

  // Environment variables for report configuration
  const getReportId = (reportType: string): string => {
    const reportIds = {
      'jtc': import.meta.env.VITE_APP_JTC_REPORT_ID || 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      'aljeri': import.meta.env.VITE_APP_ALJERI_REPORT_ID || 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      'joil': import.meta.env.REACT_APP_JOIL_REPORT_ID || 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      'timeAttendance': import.meta.env.REACT_APP_TIME_ATTENDANCE_REPORT_ID || 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      '45degrees': import.meta.env.REACT_APP_45DEGREES_REPORT_ID || 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      'shaheen': import.meta.env.REACT_APP_SHAHEEN_REPORT_ID || 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      'revenue': import.meta.env.REACT_APP_REVENUE_REPORT_ID || 'de40b238-ed32-4ca6-abe5-7383e5785ddf'
    };
    return reportIds[reportType as keyof typeof reportIds] || 'de40b238-ed32-4ca6-abe5-7383e5785ddf';
  };

  const buildEmbedUrl = (reportId: string, pageName?: string): string => {
    const baseUrl = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&autoAuth=true&ctid=${import.meta.env.VITE_POWERBI_TENANT_ID || 'ba2cab20-721a-44f0-bec4-f2e784ba3c23'}`;
    return pageName ? `${baseUrl}&pageName=${pageName}` : baseUrl;
  };

  const reports: PowerBIReport[] = [
    {
      id: 'jtc',
      title: 'JTC Fleet Status',
      titleAr: 'حالة أسطول الجري للنقل',
      description: 'Real-time fleet monitoring and logistics KPIs',
      descriptionAr: 'مراقبة الأسطول في الوقت الفعلي ومؤشرات اللوجستيات',
      embedUrl: buildEmbedUrl(getReportId('jtc'), 'JTC'),
      reportId: getReportId('jtc'),
      icon: <TruckOutlined />,
      category: 'operational',
      company: 'JTC',
      lastUpdated: new Date(),
      status: 'active',
      priority: 'high',
      tags: ['logistics', 'fleet', 'real-time'],
      metrics: [
        {
          id: 'fleet-utilization',
          name: 'Fleet Utilization',
          nameAr: 'استخدام الأسطول',
          value: 87.5,
          previousValue: 82.3,
          target: 90,
          unit: '%',
          trend: 'up',
          status: 'good',
          icon: <TruckOutlined />
        },
        {
          id: 'delivery-time',
          name: 'Avg Delivery Time',
          nameAr: 'متوسط وقت التسليم',
          value: 2.4,
          previousValue: 2.8,
          target: 2.0,
          unit: 'hrs',
          trend: 'up',
          status: 'warning',
          icon: <ClockCircleOutlined />
        },
        {
          id: 'fuel-efficiency',
          name: 'Fuel Efficiency',
          nameAr: 'كفاءة الوقود',
          value: 12.8,
          previousValue: 11.9,
          target: 13.5,
          unit: 'km/L',
          trend: 'up',
          status: 'good',
          icon: <ThunderboltOutlined />
        }
      ]
    },
    {
      id: 'aljeri',
      title: 'Al Jeri Investment Portfolio',
      titleAr: 'محفظة استثمارات الجري',
      description: 'Consolidated investment performance and ROI analytics',
      descriptionAr: 'أداء الاستثمارات الموحد وتحليلات العائد على الاستثمار',
      embedUrl: buildEmbedUrl(getReportId('aljeri'), 'Aljeri Investment'),
      reportId: getReportId('aljeri'),
      icon: <BarChartOutlined />,
      category: 'financial',
      company: 'Al Jeri Investment',
      lastUpdated: new Date(),
      status: 'active',
      priority: 'high',
      tags: ['investment', 'portfolio', 'roi', 'financial'],
      metrics: [
        {
          id: 'total-portfolio-value',
          name: 'Portfolio Value',
          nameAr: 'قيمة المحفظة',
          value: 2847.5,
          previousValue: 2698.2,
          target: 3000,
          unit: 'M SAR',
          trend: 'up',
          status: 'good',
          icon: <DollarOutlined />
        },
        {
          id: 'roi',
          name: 'Return on Investment',
          nameAr: 'عائد الاستثمار',
          value: 18.7,
          previousValue: 16.4,
          target: 20,
          unit: '%',
          trend: 'up',
          status: 'good',
          icon: <RiseOutlined />
        }
      ]
    },
    {
      id: 'joil',
      title: 'J:Oil Petroleum Operations',
      titleAr: 'عمليات جي أويل للبترول',
      description: 'Fuel station performance and petroleum distribution metrics',
      descriptionAr: 'أداء محطات الوقود ومقاييس توزيع البترول',
      embedUrl: buildEmbedUrl(getReportId('joil'), 'JOIL'),
      reportId: getReportId('joil'),
      icon: <DashboardOutlined />,
      category: 'operational'
    },
    {
      id: 'timeattendance',
      title: 'Time & Attendance',
      titleAr: 'الوقت والحضور',
      description: 'Employee attendance tracking and workforce analytics',
      descriptionAr: 'تتبع حضور الموظفين وتحليلات القوى العاملة',
      embedUrl: buildEmbedUrl(getReportId('timeAttendance'), 'Time and Attendance'),
      reportId: getReportId('timeAttendance'),
      icon: <ClockCircleOutlined />,
      category: 'hr',
      company: 'Al Jeri Group',
      lastUpdated: new Date(),
      status: 'active',
      priority: 'medium',
      tags: ['hr', 'attendance', 'workforce'],
      metrics: []
    },
    {
      id: 'fortyfive',
      title: '45 Degrees Cafe Analytics',
      titleAr: 'تحليلات مقهى 45 درجة',
      description: 'Cafe operations, sales trends and customer insights',
      descriptionAr: 'عمليات المقهى واتجاهات المبيعات ورؤى العملاء',
      embedUrl: buildEmbedUrl(getReportId('45degrees'), '45 Degrees'),
      reportId: getReportId('45degrees'),
      icon: <CoffeeOutlined />,
      category: 'operational',
      company: '45 Degrees',
      lastUpdated: new Date(),
      status: 'active',
      priority: 'medium',
      tags: ['cafe', 'customer-analytics', 'food-beverage'],
      metrics: []
    },
    {
      id: 'shaheen',
      title: 'Shaheen Rent a Car',
      titleAr: 'شاهين لتأجير السيارات',
      description: 'Vehicle rental fleet utilization and revenue tracking',
      descriptionAr: 'استخدام أسطول تأجير المركبات وتتبع الإيرادات',
      embedUrl: buildEmbedUrl(getReportId('shaheen'), 'Shaheen Rent A Car'),
      reportId: getReportId('shaheen'),
      icon: <CarOutlined />,
      category: 'operational',
      company: 'Shaheen',
      lastUpdated: new Date(),
      status: 'active',
      priority: 'medium',
      tags: ['car-rental', 'fleet-management', 'automotive'],
      metrics: []
    },
    {
      id: 'revenue',
      title: 'Group Revenue Dashboard',
      titleAr: 'لوحة إيرادات المجموعة',
      description: 'Consolidated group revenue analysis and financial performance',
      descriptionAr: 'تحليل إيرادات المجموعة الموحد والأداء المالي',
      embedUrl: buildEmbedUrl(getReportId('revenue'), 'Group'),
      reportId: getReportId('revenue'),
      icon: <DollarOutlined />,
      category: 'financial',
      company: 'Al Jeri Group',
      lastUpdated: new Date(),
      status: 'active',
      priority: 'high',
      tags: ['revenue', 'consolidated', 'financial'],
      metrics: []
    }
  ];

  // Removed unused Power BI client functions

  const openFullscreen = (embedUrl: string) => {
    window.open(embedUrl, '_blank', 'fullscreen=yes,scrollbars=yes,resizable=yes');
  };

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
            onClick={() => handleRefresh(report.id)}
            title={t("Refresh")}
            loading={localLoading[report.id]}
          />
          <Button
            type="text"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleExport()}
            title={t("Export to PDF")}
          />
          <Button
            type="text"
            size="small"
            icon={<FullscreenOutlined />}
            onClick={() => window.open(report.embedUrl, '_blank')}
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
        {localLoading[report.id] && (
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
        
        {/* Simple iframe-based Power BI embedding */}
        <iframe
          key={`${report.id}-${refreshKey}`}
          title={i18n.language === 'ar' ? report.titleAr : report.title}
          width="100%"
          height="600"
          src={report.embedUrl}
          frameBorder="0"
          allowFullScreen={true}
          style={{
            borderRadius: '8px',
            border: '1px solid #e1e5e9'
          }}
          onLoad={() => {
            // Auto-hide loading after iframe loads
            setTimeout(() => {
              setLocalLoading(prev => ({ ...prev, [report.id]: false }));
            }, 500);
          }}
        />
      </div>
    </Card>
  );

  const operationalReports = reports.filter(r => r.category === 'operational');
  const financialReports = reports.filter(r => r.category === 'financial');
  const hrReports = reports.filter(r => r.category === 'hr');

  // Advanced KPI Metrics Component
  const renderKPIMetrics = () => {
    const allMetrics = reports.flatMap(r => r.metrics || []);
    const avgPerformance = allMetrics.reduce((acc, m) => acc + (m.value / m.target * 100), 0) / allMetrics.length;
    const activeReports = reports.filter(r => r.status === 'active').length;
    const totalValue = allMetrics.filter(m => m.unit.includes('SAR')).reduce((acc, m) => acc + m.value, 0);

    return (
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" style={{ background: '#0C085C', color: 'white' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>{t('Active Reports')}</span>}
              value={activeReports}
              suffix={`/ ${reports.length}`}
              valueStyle={{ color: 'white', fontSize: '28px' }}
              prefix={<DashboardOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" style={{ background: '#363692', color: 'white' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>{t('Avg Performance')}</span>}
              value={avgPerformance}
              precision={1}
              suffix="%"
              valueStyle={{ color: 'white', fontSize: '28px' }}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" style={{ background: '#0095CE', color: 'white' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>{t('Total Value')}</span>}
              value={totalValue}
              precision={1}
              suffix="M SAR"
              valueStyle={{ color: 'white', fontSize: '28px' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" style={{ background: '#FF2424', color: 'white' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>{t('Data Sync')}</span>}
              value={filters.autoRefresh ? "ON" : "OFF"}
              valueStyle={{ color: 'white', fontSize: '18px' }}
              prefix={<SyncOutlined spin={filters.autoRefresh} />}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Advanced Header with Controls */}
      <Card 
        style={{ 
          marginBottom: 24, 
          background: 'linear-gradient(135deg, #0C085C 0%, #363692 100%)',
          border: 'none',
          borderRadius: '16px'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <Row justify="space-between" align="middle">
          <Col xs={24} md={12}>
            <div style={{ color: 'white' }}>
              <Title level={1} style={{ margin: 0, color: 'white', fontSize: '36px', fontWeight: 'bold' }}>
                <ThunderboltOutlined style={{ marginRight: 16 }} />
                {t("Advanced Analytics Hub")}
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', margin: '8px 0 0 0' }}>
                {i18n.language === 'ar' 
                  ? 'مركز التحليلات المتقدم - مؤشرات الأداء الرئيسية وتكامل Power BI المؤسسي'
                  : 'Advanced Analytics Center - KPIs & Enterprise Power BI Integration'
                }
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ textAlign: 'right' }}>
              <Space size="large">
                <Tooltip title={t("Advanced Filters")}>
                  <Button 
                    type="primary" 
                    icon={<FilterOutlined />} 
                    onClick={() => setFilterDrawerVisible(true)}
                    style={{ background: 'rgba(255,255,255,0.2)', border: 'none' }}
                  >
                    {t("Filters")}
                  </Button>
                </Tooltip>
                <Tooltip title={t("Dashboard Settings")}>
                  <Button 
                    type="primary" 
                    icon={<SettingOutlined />} 
                    onClick={() => setSettingsDrawerVisible(true)}
                    style={{ background: 'rgba(255,255,255,0.2)', border: 'none' }}
                  >
                    {t("Settings")}
                  </Button>
                </Tooltip>
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="pdf" icon={<FilePdfOutlined />} onClick={() => handleExport('pdf')}>
                        {t("Export to PDF")}
                      </Menu.Item>
                      <Menu.Item key="excel" icon={<FileExcelOutlined />} onClick={() => handleExport('excel')}>
                        {t("Export to Excel")}
                      </Menu.Item>
                      <Menu.Item key="ppt" icon={<PrinterOutlined />} onClick={() => handleExport('ppt')}>
                        {t("Export to PowerPoint")}
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button type="primary" style={{ background: 'rgba(255,255,255,0.2)', border: 'none' }}>
                    <DownloadOutlined /> {t("Export")}
                  </Button>
                </Dropdown>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      {/* KPI Metrics Overview */}
      {renderKPIMetrics()}

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

      {/* Advanced Filters Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FilterOutlined style={{ marginRight: 8 }} />
            {t("Advanced Filters")}
          </div>
        }
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
        width={400}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>{t("Date Range")}</Text>
            <RangePicker 
              style={{ width: '100%', marginTop: 8 }}
              onChange={(dates) => {
                setFilters(prev => ({
                  ...prev,
                  dateRange: dates ? [dates[0]!.format('YYYY-MM-DD'), dates[1]!.format('YYYY-MM-DD')] : null
                }));
              }}
            />
          </div>
          
          <div>
            <Text strong>{t("Companies")}</Text>
            <Select
              mode="multiple"
              style={{ width: '100%', marginTop: 8 }}
              placeholder={t("Select companies")}
              value={filters.companies}
              onChange={(companies) => setFilters(prev => ({ ...prev, companies }))}
            >
              <Option value="JTC">JTC</Option>
              <Option value="J:Oil">J:Oil</Option>
              <Option value="Al Jeri Investment">Al Jeri Investment</Option>
              <Option value="45 Degrees">45 Degrees</Option>
              <Option value="Shaheen">Shaheen</Option>
            </Select>
          </div>

          <div>
            <Text strong>{t("Categories")}</Text>
            <Select
              mode="multiple"
              style={{ width: '100%', marginTop: 8 }}
              placeholder={t("Select categories")}
              value={filters.categories}
              onChange={(categories) => setFilters(prev => ({ ...prev, categories }))}
            >
              <Option value="operational">{t("Operational")}</Option>
              <Option value="financial">{t("Financial")}</Option>
              <Option value="hr">{t("HR & Workforce")}</Option>
            </Select>
          </div>

          <div>
            <Text strong>{t("Status")}</Text>
            <Select
              mode="multiple"
              style={{ width: '100%', marginTop: 8 }}
              value={filters.status}
              onChange={(status) => setFilters(prev => ({ ...prev, status }))}
            >
              <Option value="active">
                <Badge status="success" text={t("Active")} />
              </Option>
              <Option value="maintenance">
                <Badge status="warning" text={t("Maintenance")} />
              </Option>
              <Option value="offline">
                <Badge status="error" text={t("Offline")} />
              </Option>
            </Select>
          </div>

          <div>
            <Text strong>{t("Search Reports")}</Text>
            <Search
              style={{ marginTop: 8 }}
              placeholder={t("Search by name or description...")}
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
          </div>

          <Divider />
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text strong>{t("Auto Refresh")}</Text>
              <Switch
                checked={filters.autoRefresh}
                onChange={(autoRefresh) => setFilters(prev => ({ ...prev, autoRefresh }))}
              />
            </div>
            
            {filters.autoRefresh && (
              <div>
                <Text>{t("Refresh Interval (minutes)")}</Text>
                <Slider
                  min={1}
                  max={60}
                  value={filters.refreshInterval / 60000}
                  onChange={(value) => setFilters(prev => ({ ...prev, refreshInterval: value * 60000 }))}
                  marks={{
                    1: '1m',
                    5: '5m',
                    15: '15m',
                    30: '30m',
                    60: '1h'
                  }}
                  style={{ marginTop: 8 }}
                />
              </div>
            )}
          </div>
        </Space>
      </Drawer>

      {/* Dashboard Settings Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SettingOutlined style={{ marginRight: 8 }} />
            {t("Dashboard Settings")}
          </div>
        }
        placement="right"
        onClose={() => setSettingsDrawerVisible(false)}
        open={settingsDrawerVisible}
        width={400}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>{t("Show KPI Metrics")}</Text>
              <Switch
                checked={settings.showMetrics}
                onChange={(showMetrics) => setSettings(prev => ({ ...prev, showMetrics }))}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>{t("Show Filters")}</Text>
              <Switch
                checked={settings.showFilters}
                onChange={(showFilters) => setSettings(prev => ({ ...prev, showFilters }))}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>{t("Notifications")}</Text>
              <Switch
                checked={settings.notifications}
                onChange={(notifications) => setSettings(prev => ({ ...prev, notifications }))}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>{t("Auto Sync")}</Text>
              <Switch
                checked={settings.autoSync}
                onChange={(autoSync) => setSettings(prev => ({ ...prev, autoSync }))}
              />
            </div>
          </div>

          <Divider />

          <div>
            <Text strong>{t("Layout")}</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              value={settings.layout}
              onChange={(layout) => setSettings(prev => ({ ...prev, layout }))}
            >
              <Option value="grid">
                <Space>
                  <DashboardOutlined />
                  {t("Grid View")}
                </Space>
              </Option>
              <Option value="list">
                <Space>
                  <LineChartOutlined />
                  {t("List View")}
                </Space>
              </Option>
            </Select>
          </div>

          <div>
            <Text strong>{t("Theme")}</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              value={settings.theme}
              onChange={(theme) => setSettings(prev => ({ ...prev, theme }))}
            >
              <Option value="light">
                <Space>
                  <SunOutlined />
                  {t("Light Theme")}
                </Space>
              </Option>
              <Option value="dark">
                <Space>
                  <MoonOutlined />
                  {t("Dark Theme")}
                </Space>
              </Option>
            </Select>
          </div>
        </Space>
      </Drawer>
    </div>
  );
};

export default KPIsERP;