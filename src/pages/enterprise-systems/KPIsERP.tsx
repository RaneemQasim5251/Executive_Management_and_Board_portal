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

  Tooltip,
  Drawer,
  Switch,
  Slider,
  Input,
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
  PrinterOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  RiseOutlined,
  LineChartOutlined,
  GlobalOutlined,
  SunOutlined,
  MoonOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
// Power BI React component imports for advanced integration
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

const { Title, Text, Paragraph } = Typography;
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
  const [selectedReport, setSelectedReport] = useState<string>('home');
  const [localLoading, setLocalLoading] = useState<{[key: string]: boolean}>({});
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState<boolean>(false);
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState<boolean>(false);
  // Hold embedded references if needed (no state to avoid unused warnings)
  
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

  // Environment variables for report configuration - all using the same report ID as per provided URLs
  const getReportId = (reportType: string): string => {
    const reportIds = {
      'home': import.meta.env.VITE_APP_HOME_REPORT_ID || 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      'jtc': import.meta.env.VITE_APP_JTC_REPORT_ID || 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      'aljeri': import.meta.env.VITE_APP_ALJERI_REPORT_ID || 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      'joil': import.meta.env.VITE_APP_JOIL_REPORT_ID || 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      'timeAttendance': import.meta.env.VITE_APP_TIME_ATTENDANCE_REPORT_ID || 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      '45degrees': import.meta.env.VITE_APP_45DEGREES_REPORT_ID || 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      'shaheen': import.meta.env.VITE_APP_SHAHEEN_REPORT_ID || 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      'mawten': import.meta.env.VITE_APP_MAWTEN_REPORT_ID || 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      'group': import.meta.env.VITE_APP_GROUP_REPORT_ID || 'de40b238-ed32-4ca6-abe5-7383e5785ddf',
      'development': import.meta.env.VITE_APP_DEVELOPMENT_REPORT_ID || 'de40b238-ed32-4ca6-abe5-7383e5785ddf'
    };
    return reportIds[reportType as keyof typeof reportIds] || 'de40b238-ed32-4ca6-abe5-7383e5785ddf';
  };

  // Convert Power BI URLs to proper embed format for React component
  const convertToEmbedUrl = (powerBiUrl: string): string => {
    try {
      const url = new URL(powerBiUrl);
      const pathParts = url.pathname.split('/');
      const reportId = pathParts[4];
      const pageId = pathParts[5] || '';

      const tenantId = import.meta.env.VITE_POWERBI_TENANT_ID;
      const groupId = (url.searchParams.get('groupId') || import.meta.env.VITE_POWERBI_GROUP_ID || '').trim();

      // Base embed URL
      let embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${reportId}`;

      // Preserve page when available
      if (pageId && pageId !== 'ReportSection' && !pageId.includes('?')) {
        embedUrl += `&pageName=${encodeURIComponent(pageId)}`;
      }

      // Add tenant context id to prevent cross-tenant prompts
      if (tenantId) {
        embedUrl += `&ctid=${encodeURIComponent(tenantId)}`;
      }

      // If workspace id is known, include it
      if (groupId) {
        embedUrl += `&groupId=${encodeURIComponent(groupId)}`;
      }

      // Enable auto auth where supported
      embedUrl += `&autoAuth=true`;

      console.log(`Converting URL: ${powerBiUrl} -> ${embedUrl}`);
      return embedUrl;
    } catch (error) {
      console.warn('Failed to convert Power BI URL:', powerBiUrl, error);
      const tenantId = import.meta.env.VITE_POWERBI_TENANT_ID;
      return `https://app.powerbi.com/reportEmbed?reportId=de40b238-ed32-4ca6-abe5-7383e5785ddf${tenantId ? `&ctid=${encodeURIComponent(tenantId)}` : ''}&autoAuth=true`;
    }
  };

  // Use the direct URLs provided for each report and convert to embed format
  const getDirectEmbedUrl = (reportType: string): string => {
    const directUrls = {
      'home': 'https://app.powerbi.com/groups/me/reports/de40b238-ed32-4ca6-abe5-7383e5785ddf/ReportSection3e96be44e454c086a4e0?ctid=ba2cab20-721a-44f0-bec4-f2e784ba3c23&experience=power-bi',
      'jtc': 'https://app.powerbi.com/groups/me/reports/de40b238-ed32-4ca6-abe5-7383e5785ddf/ReportSection?ctid=ba2cab20-721a-44f0-bec4-f2e784ba3c23&experience=power-bi',
      'aljeri': 'https://app.powerbi.com/groups/me/reports/de40b238-ed32-4ca6-abe5-7383e5785ddf/30ec31e819e3392e9f58?ctid=ba2cab20-721a-44f0-bec4-f2e784ba3c23&experience=power-bi',
      'joil': 'https://app.powerbi.com/groups/me/reports/de40b238-ed32-4ca6-abe5-7383e5785ddf/ReportSectiond1d12d6317c2c238440e?ctid=ba2cab20-721a-44f0-bec4-f2e784ba3c23&experience=power-bi',
      'timeAttendance': 'https://app.powerbi.com/groups/me/reports/de40b238-ed32-4ca6-abe5-7383e5785ddf/655342c1efa3f551194b?ctid=ba2cab20-721a-44f0-bec4-f2e784ba3c23&experience=power-bi',
      '45degrees': 'https://app.powerbi.com/groups/me/reports/de40b238-ed32-4ca6-abe5-7383e5785ddf/78ca1ee3e6eac3e44c07?ctid=ba2cab20-721a-44f0-bec4-f2e784ba3c23&experience=power-bi',
      'shaheen': 'https://app.powerbi.com/groups/me/reports/de40b238-ed32-4ca6-abe5-7383e5785ddf/a6dbb31281ee1b23007e?ctid=ba2cab20-721a-44f0-bec4-f2e784ba3c23&experience=power-bi',
      'mawten': 'https://app.powerbi.com/groups/me/reports/de40b238-ed32-4ca6-abe5-7383e5785ddf/5ee3cb8ab6e0b4b4e6db?ctid=ba2cab20-721a-44f0-bec4-f2e784ba3c23&experience=power-bi',
      'group': 'https://app.powerbi.com/groups/me/reports/de40b238-ed32-4ca6-abe5-7383e5785ddf/f4532bde7dc4ff968e01?ctid=ba2cab20-721a-44f0-bec4-f2e784ba3c23&experience=power-bi',
      'development': 'https://app.powerbi.com/groups/me/reports/de40b238-ed32-4ca6-abe5-7383e5785ddf/350d06dcf15f86c99c1e?ctid=ba2cab20-721a-44f0-bec4-f2e784ba3c23&experience=power-bi'
    };
    const originalUrl = directUrls[reportType as keyof typeof directUrls] || directUrls['home'];
    return convertToEmbedUrl(originalUrl);
  };



  const reports: PowerBIReport[] = [
    {
      id: 'jtc',
      title: 'JTC Fleet Status',
      titleAr: 'حالة أسطول الجري للنقل',
      description: 'Real-time fleet monitoring and logistics KPIs',
      descriptionAr: 'مراقبة الأسطول في الوقت الفعلي ومؤشرات اللوجستيات',
      embedUrl: getDirectEmbedUrl('jtc'),
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
      embedUrl: getDirectEmbedUrl('aljeri'),
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
      embedUrl: getDirectEmbedUrl('joil'),
      reportId: getReportId('joil'),
      icon: <DashboardOutlined />,
      category: 'operational',
      company: 'J:Oil',
      lastUpdated: new Date(),
      status: 'active',
      priority: 'medium',
      tags: ['petroleum', 'fuel-stations', 'distribution'],
      metrics: []
    },
    {
      id: 'timeattendance',
      title: 'Time & Attendance',
      titleAr: 'الوقت والحضور',
      description: 'Employee attendance tracking and workforce analytics',
      descriptionAr: 'تتبع حضور الموظفين وتحليلات القوى العاملة',
      embedUrl: getDirectEmbedUrl('timeAttendance'),
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
      embedUrl: getDirectEmbedUrl('45degrees'),
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
      embedUrl: getDirectEmbedUrl('shaheen'),
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
      id: 'mawten',
      title: 'Mawten Rent A Car',
      titleAr: 'موطن لتأجير السيارات',
      description: 'Car rental operations and fleet management analytics',
      descriptionAr: 'عمليات تأجير السيارات وتحليلات إدارة الأسطول',
      embedUrl: getDirectEmbedUrl('mawten'),
      reportId: getReportId('mawten'),
      icon: <CarOutlined />,
      category: 'operational',
      company: 'Mawten',
      lastUpdated: new Date(),
      status: 'active',
      priority: 'medium',
      tags: ['car-rental', 'fleet-management', 'automotive'],
      metrics: []
    },
    {
      id: 'group',
      title: 'Group Dashboard',
      titleAr: 'لوحة المجموعة',
      description: 'Consolidated group performance and strategic overview',
      descriptionAr: 'أداء المجموعة الموحد والنظرة الاستراتيجية',
      embedUrl: getDirectEmbedUrl('group'),
      reportId: getReportId('group'),
      icon: <DashboardOutlined />,
      category: 'financial',
      company: 'Al Jeri Group',
      lastUpdated: new Date(),
      status: 'active',
      priority: 'high',
      tags: ['group-performance', 'strategic', 'overview'],
      metrics: []
    },
    {
      id: 'development',
      title: 'Under Development',
      titleAr: 'تحت التطوير',
      description: 'New features and reports in development',
      descriptionAr: 'ميزات وتقارير جديدة قيد التطوير',
      embedUrl: getDirectEmbedUrl('development'),
      reportId: getReportId('development'),
      icon: <ProjectOutlined />,
      category: 'operational',
      company: 'Al Jeri Group',
      lastUpdated: new Date(),
      status: 'maintenance',
      priority: 'low',
      tags: ['development', 'beta', 'preview'],
      metrics: []
    }
  ];

  // Removed unused Power BI client functions



  // Power BI Event Handlers handled inline where used

  // Get embedded component reference
  const getEmbeddedComponent = (reportId: string) => (embeddedReport: any) => {
    console.log('Embedded component ready:', reportId);
    // Get page-level filters example
    if (embeddedReport && embeddedReport.getPages) {
      embeddedReport.getPages().then((pages: any[]) => {
        if (pages && pages[0] && pages[0].getFilters) {
          pages[0].getFilters().then((filters: any) => {
            console.log("Page-level Filters:", filters);
          });
        }
      });
    }
  };

  // Check if we have a valid access token
  const hasValidAccessToken = () => {
    const token = import.meta.env.VITE_POWERBI_ACCESS_TOKEN;
    return token && token.trim() !== '' && token !== 'your-access-token-here';
  };

  // Force iframe mode to avoid React component issues temporarily
  const shouldUseIframeMode = () => {
    // You can set this to true to force iframe mode for debugging
    const forceIframe = import.meta.env.VITE_FORCE_IFRAME_MODE === 'true';
    return forceIframe || !hasValidAccessToken();
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
            onClick={() => handleExport('pdf')}
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
      styles={{ body: { padding: '12px' } }}
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
        
        {!shouldUseIframeMode() ? (
          /* Advanced Power BI React Component with Authentication */
          <div>
            <div style={{ 
              padding: '16px', 
              background: '#f0f8ff', 
              border: '1px solid #0095ce', 
              borderRadius: '4px', 
              marginBottom: '16px',
              fontSize: '12px'
            }}>
              🔧 Debug Info: Using embed URL: {report.embedUrl}
            </div>
            <PowerBIEmbed
              embedConfig={{
                type: 'report',
                id: report.reportId,
                embedUrl: report.embedUrl,
                accessToken: import.meta.env.VITE_POWERBI_ACCESS_TOKEN,
                tokenType: models.TokenType.Embed,
                settings: {
                  panes: {
                    filters: {
                      expanded: false,
                      visible: false
                    },
                    pageNavigation: {
                      visible: true
                    }
                  },
                  background: models.BackgroundType.Transparent,
                  bars: {
                    statusBar: {
                      visible: false
                    }
                  }
                }
              }}
              eventHandlers={new Map([
                ['loaded', function () {
                  console.log('Report loaded successfully:', report.id);
                  message.success(t('Power BI report loaded successfully'), 2);
                }],
                ['rendered', function () {
                  console.log('Report rendered:', report.id);
                }],
                ['error', function (event: any) {
                  console.error('Power BI Error for report', report.id, ':', event.detail);
                  message.error(`Failed to load ${report.title}: ${event.detail?.message || 'Unknown error'}`, 5);
                }]
              ])}
              cssClassName="powerbi-report-container"
              getEmbeddedComponent={getEmbeddedComponent(report.id)}
            />
          </div>
        ) : (
          /* Fallback to iframe when no access token is available */
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
              setTimeout(() => {
                setLocalLoading(prev => ({ ...prev, [report.id]: false }));
              }, 500);
            }}
          />
        )}
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
    <>
      <style>{`
        .powerbi-report-container {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .powerbi-report-container iframe {
          border: none !important;
          border-radius: 8px;
        }
        .powerbi-report-container .powerbi-embed-wrapper {
          border-radius: 8px;
        }
      `}</style>
      <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Advanced Header with Controls */}
      <Card 
        style={{ 
          marginBottom: 24, 
          background: 'linear-gradient(135deg, #0C085C 0%, #363692 100%)',
          border: 'none',
          borderRadius: '16px'
        }}
        styles={{ body: { padding: '32px' } }}
      >
        <Row justify="space-between" align="middle">
          <Col xs={24} md={12}>
            <div style={{ color: 'white' }}>
              <Title level={1} style={{ margin: 0, color: 'white', fontSize: '36px', fontWeight: 'bold' }}>
                <ProjectOutlined style={{ marginRight: 16 }} />
                {t("Enterprise System")}
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
                  menu={{
                    items: [
                      {
                        key: 'pdf',
                        icon: <FilePdfOutlined />,
                        label: t("Export to PDF"),
                        onClick: () => handleExport('pdf')
                      },
                      {
                        key: 'excel',
                        icon: <FileExcelOutlined />,
                        label: t("Export to Excel"),
                        onClick: () => handleExport('excel')
                      },
                      {
                        key: 'ppt',
                        icon: <PrinterOutlined />,
                        label: t("Export to PowerPoint"),
                        onClick: () => handleExport('ppt')
                      }
                    ]
                  }}
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
        description={
          shouldUseIframeMode() 
            ? (i18n.language === 'ar' 
                ? '🛡️ وضع الحماية: يتم استخدام iframe للعرض الآمن. هذا يتجنب مشاكل التوافق ويضمن عمل التقارير بشكل مستقر.'
                : '🛡️ Safe mode: Using secure iframe embedding. This avoids compatibility issues and ensures stable report viewing.')
            : (i18n.language === 'ar' 
                ? '✅ تم تفعيل التكامل المتقدم مع Power BI بنجاح. يمكنك الآن الاستفادة من جميع الميزات المتقدمة.'
                : '✅ Advanced Power BI integration is active. You can now access all advanced features and APIs.')
        }
        type={shouldUseIframeMode() ? "info" : "success"}
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
        items={[
          {
            key: 'home',
            label: (
              <Space>
                <GlobalOutlined />
                {t("Home")}
              </Space>
            ),
            children: (
              <>
                <Alert
                  message={i18n.language === 'ar' ? 'الصفحة الرئيسية' : 'Home Dashboard'}
                  description={i18n.language === 'ar' 
                    ? 'النظرة العامة الرئيسية مع روابط التنقل لجميع الشركات والتقارير'
                    : 'Main overview with navigation links to all companies and reports'
                  }
                  type="info"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
                <Row gutter={[24, 24]}>
                  <Col xs={24}>
                    {renderPowerBIReport({
                      id: 'home',
                      title: 'Executive Dashboard Home',
                      titleAr: 'الصفحة الرئيسية للوحة التنفيذية',
                      description: 'Main navigation dashboard with links to all company reports',
                      descriptionAr: 'لوحة التنقل الرئيسية مع روابط لجميع تقارير الشركات',
                      embedUrl: getDirectEmbedUrl('home'),
                      reportId: getReportId('home'),
                      icon: <GlobalOutlined />,
                      category: 'operational' as const,
                      company: 'Al Jeri Group',
                      lastUpdated: new Date(),
                      status: 'active' as const,
                      priority: 'high' as const,
                      tags: ['home', 'navigation', 'overview'],
                      metrics: []
                    })}
                  </Col>
                </Row>
              </>
            )
          },
          {
            key: 'all',
            label: (
              <Space>
                <DashboardOutlined />
                {t("All Reports")}
              </Space>
            ),
            children: (
              <>
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
              </>
            )
          },
          {
            key: 'operational',
            label: (
              <Space>
                <TruckOutlined />
                {t("Operations")}
              </Space>
            ),
            children: (
              <>
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
              </>
            )
          },
          {
            key: 'financial',
            label: (
              <Space>
                <DollarOutlined />
                {t("Financial")}
              </Space>
            ),
            children: (
              <>
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
              </>
            )
          },
          {
            key: 'hr',
            label: (
              <Space>
                <TeamOutlined />
                {t("HR & Workforce")}
              </Space>
            ),
            children: (
              <>
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
              </>
            )
          }
        ]}
      />

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
    </>
  );
};

export default KPIsERP;