// صفحة التقارير والتحليلات / Reports & Analytics Page
import { FC, useState, useEffect } from 'react';
import {
  Card,
  Button,
  Upload,
  Table,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Tabs,
  Alert,
  Empty,
  Badge,
  Tooltip,
  Divider,
} from 'antd';
import {
  UploadOutlined,
  FileTextOutlined,
  DownloadOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  TrophyOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { UploadProps } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Dragger } = Upload;

// واجهة التقرير / Report Interface
interface Report {
  id: string;
  titleAr: string;
  titleEn: string;
  type: 'meeting' | 'financial' | 'project' | 'performance' | 'strategic';
  uploadedAt: string;
  uploadedBy: string;
  size: number;
  url: string;
  status: 'active' | 'archived';
  description?: string;
  tags: string[];
}

// بيانات المشاريع من Excel / Excel Project Data
interface ProjectData {
  id: string;
  nameAr: string;
  nameEn: string;
  status: string;
  progress: number;
  budget: number;
  startDate: string;
  endDate: string;
  manager: string;
  team: string[];
  phase: string;
  priority: 'high' | 'medium' | 'low';
}

export const ReportsPage: FC = () => {
  const { i18n } = useTranslation();
  const [reports, setReports] = useState<Report[]>([]);
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // بيانات وهمية للتقارير / Mock reports data
  const mockReports: Report[] = [
    {
      id: '1',
      titleAr: 'تقرير اجتماع مجلس الإدارة - الربع الرابع 2024',
      titleEn: 'Board Meeting Report - Q4 2024',
      type: 'meeting',
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      uploadedBy: 'أحمد المدير / Ahmed Manager',
      size: 2048000,
      url: '/reports/board-meeting-q4-2024.pdf',
      status: 'active',
      description: 'تقرير شامل عن اجتماع مجلس الإدارة للربع الرابع',
      tags: ['مجلس الإدارة', 'الربع الرابع', '2024'],
    },
    {
      id: '2',
      titleAr: 'التقرير المالي السنوي 2024',
      titleEn: 'Annual Financial Report 2024',
      type: 'financial',
      uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      uploadedBy: 'فاطمة المالية / Fatima Finance',
      size: 5120000,
      url: '/reports/annual-financial-2024.pdf',
      status: 'active',
      description: 'التقرير المالي السنوي الشامل للعام 2024',
      tags: ['مالي', 'سنوي', '2024'],
    },
    {
      id: '3',
      titleAr: 'تقرير أداء المشاريع الاستراتيجية',
      titleEn: 'Strategic Projects Performance Report',
      type: 'project',
      uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      uploadedBy: 'محمد المشاريع / Mohamed Projects',
      size: 3072000,
      url: '/reports/strategic-projects-performance.pdf',
      status: 'active',
      description: 'تحليل شامل لأداء جميع المشاريع الاستراتيجية',
      tags: ['مشاريع', 'استراتيجية', 'أداء'],
    },
  ];

  // بيانات وهمية للمشاريع / Mock project data
  const mockProjectData: ProjectData[] = [
    {
      id: 'proj-1',
      nameAr: 'التحول الرقمي',
      nameEn: 'Digital Transformation',
      status: 'في التنفيذ',
      progress: 75,
      budget: 2500000,
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      manager: 'أحمد التقنية',
      team: ['فريق التطوير', 'فريق التصميم', 'فريق الاختبار'],
      phase: 'المرحلة الثالثة',
      priority: 'high',
    },
    {
      id: 'proj-2',
      nameAr: 'توسيع السوق',
      nameEn: 'Market Expansion',
      status: 'مكتمل',
      progress: 100,
      budget: 1800000,
      startDate: '2024-03-01',
      endDate: '2024-11-30',
      manager: 'فاطمة التسويق',
      team: ['فريق التسويق', 'فريق المبيعات'],
      phase: 'مكتمل',
      priority: 'medium',
    },
    {
      id: 'proj-3',
      nameAr: 'مختبر الابتكار',
      nameEn: 'Innovation Lab',
      status: 'في البداية',
      progress: 25,
      budget: 1200000,
      startDate: '2024-06-01',
      endDate: '2025-05-31',
      manager: 'سارة الابتكار',
      team: ['فريق البحث', 'فريق التطوير'],
      phase: 'المرحلة الأولى',
      priority: 'high',
    },
  ];

  // بيانات المخططات / Charts data
  const monthlyData = [
    { month: 'يناير', revenue: 4200000, expenses: 3100000, profit: 1100000 },
    { month: 'فبراير', revenue: 4800000, expenses: 3300000, profit: 1500000 },
    { month: 'مارس', revenue: 5200000, expenses: 3500000, profit: 1700000 },
    { month: 'أبريل', revenue: 5800000, expenses: 3700000, profit: 2100000 },
    { month: 'مايو', revenue: 6200000, expenses: 3900000, profit: 2300000 },
    { month: 'يونيو', revenue: 6800000, expenses: 4100000, profit: 2700000 },
  ];

  const projectStatusData = [
    { name: 'مكتمل', value: 8, color: '#52c41a' },
    { name: 'في التنفيذ', value: 12, color: '#0C085C' },
    { name: 'معلق', value: 3, color: '#faad14' },
    { name: 'ملغى', value: 2, color: '#ff4d4f' },
  ];

  useEffect(() => {
    setReports(mockReports);
    setProjectData(mockProjectData);
  }, []);

  // رفع تقرير جديد / Upload new report
  const handleUploadReport = async (values: any) => {
    setLoading(true);
    try {
      const newReport: Report = {
        id: Date.now().toString(),
        titleAr: values.titleAr,
        titleEn: values.titleEn,
        type: values.type,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'المستخدم الحالي / Current User',
        size: 1024000, // حجم وهمي / Mock size
        url: `/reports/${values.titleEn.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        status: 'active',
        description: values.description,
        tags: values.tags ? values.tags.split(',').map((tag: string) => tag.trim()) : [],
      };

      setReports(prev => [newReport, ...prev]);
      setShowUploadModal(false);
      form.resetFields();

      message.success(
        i18n.language === 'ar'
          ? 'تم رفع التقرير بنجاح!'
          : 'Report uploaded successfully!'
      );
    } catch (error) {
      message.error(
        i18n.language === 'ar'
          ? 'حدث خطأ أثناء رفع التقرير'
          : 'Error uploading report'
      );
    } finally {
      setLoading(false);
    }
  };

  // تحميل تقرير / Download report
  const downloadReport = (report: Report) => {
    const link = document.createElement('a');
    link.href = report.url;
    link.download = i18n.language === 'ar' ? report.titleAr : report.titleEn;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success(
      i18n.language === 'ar'
        ? `تم تحميل ${report.titleAr}`
        : `Downloaded ${report.titleEn}`
    );
  };

  // حذف تقرير / Delete report
  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(report => report.id !== id));
    message.success(
      i18n.language === 'ar'
        ? 'تم حذف التقرير بنجاح'
        : 'Report deleted successfully'
    );
  };

  // خصائص رفع الملفات / Upload properties
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf,.doc,.docx,.xls,.xlsx',
    beforeUpload: () => false, // منع الرفع التلقائي
  };

  // أعمدة جدول التقارير / Reports table columns
  const reportsColumns = [
    {
      title: i18n.language === 'ar' ? 'العنوان' : 'Title',
      dataIndex: i18n.language === 'ar' ? 'titleAr' : 'titleEn',
      key: 'title',
      render: (text: string, record: Report) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: i18n.language === 'ar' ? 'النوع' : 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeColors = {
          meeting: '#0095CE',
          financial: '#52c41a',
          project: '#faad14',
          performance: '#722ed1',
          strategic: '#ff4d4f',
        };
        return <Tag color={typeColors[type as keyof typeof typeColors]}>{type}</Tag>;
      },
    },
    {
      title: i18n.language === 'ar' ? 'تاريخ الرفع' : 'Upload Date',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
      render: (date: string) => new Date(date).toLocaleDateString(
        i18n.language === 'ar' ? 'ar-SA' : 'en-US'
      ),
    },
    {
      title: i18n.language === 'ar' ? 'الحجم' : 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => `${(size / 1024 / 1024).toFixed(1)} MB`,
    },
    {
      title: i18n.language === 'ar' ? 'الإجراءات' : 'Actions',
      key: 'actions',
      render: (_: any, record: Report) => (
        <Space size="small">
          <Tooltip title={i18n.language === 'ar' ? 'عرض' : 'View'}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => setSelectedReport(record)}
            />
          </Tooltip>
          <Tooltip title={i18n.language === 'ar' ? 'تحميل' : 'Download'}>
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => downloadReport(record)}
            />
          </Tooltip>
          <Tooltip title={i18n.language === 'ar' ? 'حذف' : 'Delete'}>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => deleteReport(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // أعمدة جدول المشاريع / Projects table columns
  const projectsColumns = [
    {
      title: i18n.language === 'ar' ? 'اسم المشروع' : 'Project Name',
      dataIndex: i18n.language === 'ar' ? 'nameAr' : 'nameEn',
      key: 'name',
      render: (text: string, record: ProjectData) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.phase}
          </Text>
        </div>
      ),
    },
    {
      title: i18n.language === 'ar' ? 'الحالة' : 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusColors = {
          'مكتمل': '#52c41a',
          'في التنفيذ': '#0C085C',
          'معلق': '#faad14',
          'في البداية': '#722ed1',
        };
        return <Tag color={statusColors[status as keyof typeof statusColors]}>{status}</Tag>;
      },
    },
    {
      title: i18n.language === 'ar' ? 'التقدم' : 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} size="small" />
      ),
    },
    {
      title: i18n.language === 'ar' ? 'الميزانية' : 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      render: (budget: number) => `$${budget.toLocaleString()}`,
    },
    {
      title: i18n.language === 'ar' ? 'المدير' : 'Manager',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: i18n.language === 'ar' ? 'الأولوية' : 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const priorityColors = {
          high: '#ff4d4f',
          medium: '#faad14',
          low: '#52c41a',
        };
        const priorityText = {
          high: i18n.language === 'ar' ? 'عالية' : 'High',
          medium: i18n.language === 'ar' ? 'متوسطة' : 'Medium',
          low: i18n.language === 'ar' ? 'منخفضة' : 'Low',
        };
        return (
          <Tag color={priorityColors[priority as keyof typeof priorityColors]}>
            {priorityText[priority as keyof typeof priorityText]}
          </Tag>
        );
      },
    },
  ];

  // إحصائيات / Statistics
  const stats = {
    totalReports: reports.length,
    totalProjects: projectData.length,
    completedProjects: projectData.filter(p => p.status === 'مكتمل').length,
    totalBudget: projectData.reduce((sum, p) => sum + p.budget, 0),
  };

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* عنوان الصفحة / Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          style={{
            marginBottom: '24px',
            borderRadius: '16px',
                          background: '#0C085C',
            color: 'white',
            border: 'none',
          }}
          styles={{ body: { padding: '32px' } }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Title 
                level={1} 
                style={{ 
                  margin: 0, 
                  background: "#0C085C",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "42px",
                  fontWeight: "800"
                }}
              >
                {i18n.language === 'ar' ? 'التقارير والتحليلات' : 'Reports & Analytics'}
              </Title>
              <Text style={{ 
                fontSize: "16px", 
                color: "#0C085C",
                fontWeight: "600",
                opacity: 0.8
              }}>
                {i18n.language === 'ar'
                  ? 'إدارة التقارير التنفيذية وتحليل البيانات'
                  : 'Executive reports management and data analytics'}
              </Text>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowUploadModal(true)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  height: '48px',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                }}
              >
                {i18n.language === 'ar' ? 'رفع تقرير جديد' : 'Upload New Report'}
              </Button>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* إحصائيات سريعة / Quick Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={i18n.language === 'ar' ? 'إجمالي التقارير' : 'Total Reports'}
                value={stats.totalReports}
                prefix={<FileTextOutlined style={{ color: '#0095CE' }} />}
                valueStyle={{ color: '#0095CE' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={i18n.language === 'ar' ? 'إجمالي المشاريع' : 'Total Projects'}
                value={stats.totalProjects}
                prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={i18n.language === 'ar' ? 'المشاريع المكتملة' : 'Completed Projects'}
                value={stats.completedProjects}
                prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={i18n.language === 'ar' ? 'إجمالي الميزانية' : 'Total Budget'}
                value={stats.totalBudget}
                prefix={<DollarOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ color: '#722ed1' }}
                formatter={(value) => `$${Number(value).toLocaleString()}`}
              />
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* التبويبات الرئيسية / Main Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card style={{ borderRadius: '16px' }}>
          <Tabs defaultActiveKey="reports" size="large">
            {/* تبويب التقارير / Reports Tab */}
            <TabPane
              tab={
                <span>
                  <FileTextOutlined />
                  {i18n.language === 'ar' ? 'التقارير' : 'Reports'}
                </span>
              }
              key="reports"
            >
              <Table
                dataSource={reports}
                columns={reportsColumns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 800 }}
              />
            </TabPane>

            {/* تبويب المشاريع / Projects Tab */}
            <TabPane
              tab={
                <span>
                  <TeamOutlined />
                  {i18n.language === 'ar' ? 'بيانات المشاريع' : 'Project Data'}
                </span>
              }
              key="projects"
            >
              <Table
                dataSource={projectData}
                columns={projectsColumns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1000 }}
              />
            </TabPane>

            {/* تبويب التحليلات / Analytics Tab */}
            <TabPane
              tab={
                <span>
                  <BarChartOutlined />
                  {i18n.language === 'ar' ? 'التحليلات' : 'Analytics'}
                </span>
              }
              key="analytics"
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Card title={i18n.language === 'ar' ? 'الأداء المالي الشهري' : 'Monthly Financial Performance'}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#0C085C" name={i18n.language === 'ar' ? 'الإيرادات' : 'Revenue'} />
                        <Bar dataKey="profit" fill="#52c41a" name={i18n.language === 'ar' ? 'الأرباح' : 'Profit'} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title={i18n.language === 'ar' ? 'حالة المشاريع' : 'Project Status'}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={projectStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                          label
                        >
                          {projectStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      </motion.div>

      {/* نموذج رفع تقرير / Upload Report Modal */}
      <Modal
        title={
          <Space>
            <UploadOutlined />
            <span>{i18n.language === 'ar' ? 'رفع تقرير جديد' : 'Upload New Report'}</span>
          </Space>
        }
        open={showUploadModal}
        onCancel={() => {
          setShowUploadModal(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUploadReport}
          style={{ marginTop: '20px' }}
        >
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item
                name="titleAr"
                label={i18n.language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
                rules={[{ required: true, message: 'يرجى إدخال العنوان بالعربية!' }]}
              >
                <Input placeholder="مثال: تقرير اجتماع مجلس الإدارة" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="titleEn"
                label={i18n.language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}
                rules={[{ required: true, message: 'Please enter title in English!' }]}
              >
                <Input placeholder="Example: Board Meeting Report" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item
                name="type"
                label={i18n.language === 'ar' ? 'نوع التقرير' : 'Report Type'}
                rules={[{ required: true, message: 'يرجى اختيار نوع التقرير!' }]}
              >
                <Select placeholder={i18n.language === 'ar' ? 'اختر النوع' : 'Select Type'}>
                  <Option value="meeting">
                    {i18n.language === 'ar' ? 'اجتماع' : 'Meeting'}
                  </Option>
                  <Option value="financial">
                    {i18n.language === 'ar' ? 'مالي' : 'Financial'}
                  </Option>
                  <Option value="project">
                    {i18n.language === 'ar' ? 'مشروع' : 'Project'}
                  </Option>
                  <Option value="performance">
                    {i18n.language === 'ar' ? 'أداء' : 'Performance'}
                  </Option>
                  <Option value="strategic">
                    {i18n.language === 'ar' ? 'استراتيجي' : 'Strategic'}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tags"
                label={i18n.language === 'ar' ? 'العلامات' : 'Tags'}
              >
                <Input
                  placeholder={
                    i18n.language === 'ar'
                      ? 'مثال: مجلس الإدارة, الربع الرابع'
                      : 'Example: board, quarterly'
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label={i18n.language === 'ar' ? 'الوصف' : 'Description'}
          >
            <Input.TextArea
              rows={3}
              placeholder={
                i18n.language === 'ar'
                  ? 'وصف مختصر للتقرير...'
                  : 'Brief description of the report...'
              }
            />
          </Form.Item>

          <Form.Item
            label={i18n.language === 'ar' ? 'ملف التقرير' : 'Report File'}
            rules={[{ required: true, message: 'يرجى اختيار ملف!' }]}
          >
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: '#0095CE' }} />
              </p>
              <p className="ant-upload-text">
                {i18n.language === 'ar'
                  ? 'اضغط أو اسحب الملف إلى هنا للرفع'
                  : 'Click or drag file to this area to upload'}
              </p>
              <p className="ant-upload-hint">
                {i18n.language === 'ar'
                  ? 'دعم ملفات PDF, Word, Excel'
                  : 'Support for PDF, Word, Excel files'}
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginTop: '24px' }}>
            <Space>
              <Button onClick={() => setShowUploadModal(false)}>
                {i18n.language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  background: '#0C085C',
                  border: 'none',
                }}
              >
                {i18n.language === 'ar' ? 'رفع التقرير' : 'Upload Report'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* نموذج عرض التقرير / View Report Modal */}
      {selectedReport && (
        <Modal
          title={
            <Space>
              <EyeOutlined />
              <span>
                {i18n.language === 'ar' ? selectedReport.titleAr : selectedReport.titleEn}
              </span>
            </Space>
          }
          open={!!selectedReport}
          onCancel={() => setSelectedReport(null)}
          footer={[
            <Button key="download" type="primary" onClick={() => downloadReport(selectedReport)}>
              <DownloadOutlined />
              {i18n.language === 'ar' ? 'تحميل' : 'Download'}
            </Button>,
          ]}
          width={700}
        >
          <div style={{ padding: '20px 0' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong>{i18n.language === 'ar' ? 'الوصف:' : 'Description:'}</Text>
                <Paragraph style={{ marginTop: '8px' }}>
                  {selectedReport.description || (i18n.language === 'ar' ? 'لا يوجد وصف' : 'No description')}
                </Paragraph>
              </div>

              <Row gutter={[24, 24]}>
                <Col span={8}>
                  <Text strong>{i18n.language === 'ar' ? 'النوع:' : 'Type:'}</Text>
                  <br />
                  <Tag color="#0095CE">{selectedReport.type}</Tag>
                </Col>
                <Col span={8}>
                  <Text strong>{i18n.language === 'ar' ? 'الحجم:' : 'Size:'}</Text>
                  <br />
                  <Text>{(selectedReport.size / 1024 / 1024).toFixed(1)} MB</Text>
                </Col>
                <Col span={8}>
                  <Text strong>{i18n.language === 'ar' ? 'تم الرفع بواسطة:' : 'Uploaded by:'}</Text>
                  <br />
                  <Text>{selectedReport.uploadedBy}</Text>
                </Col>
              </Row>

              {selectedReport.tags.length > 0 && (
                <div>
                  <Text strong>{i18n.language === 'ar' ? 'العلامات:' : 'Tags:'}</Text>
                  <div style={{ marginTop: '8px' }}>
                    {selectedReport.tags.map((tag, index) => (
                      <Tag key={index} style={{ marginBottom: '4px' }}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </Space>
          </div>
        </Modal>
      )}
    </div>
  );
};