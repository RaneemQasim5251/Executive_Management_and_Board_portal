// نظام التوصيات / Recommendations System  
import { FC, useState, useEffect } from 'react';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Typography,
  List,
  Avatar,
  Tag,
  Rate,
  Divider,
  message,
  Empty,
  Badge,
  Tooltip,
  Popconfirm,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  BulbOutlined,
  StarOutlined,
  UserOutlined,
  CalendarOutlined,

  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,

  EyeOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;
const { Option } = Select;
const { Text, Paragraph } = Typography;

// واجهة التوصية / Recommendation Interface
export interface Recommendation {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  priority: 'high' | 'medium' | 'low';
  category: 'strategic' | 'operational' | 'financial' | 'technical' | 'hr';
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  rating: number; // 1-5 stars
  submittedBy: string;
  submittedAt: string;
  projectId?: string;
  projectName?: string;
  expectedImpact: 'high' | 'medium' | 'low';
  estimatedCost?: string;
  timeline?: string;
  approvedBy?: string;
  approvedAt?: string;
  implementedAt?: string;
  feedback?: string;
}

interface RecommendationSystemProps {
  projectId?: string;
  projectName?: string;
  visible: boolean;
  onClose: () => void;
}

export const RecommendationSystem: FC<RecommendationSystemProps> = ({
  projectId,
  projectName,
  visible,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);

  // بيانات وهمية للتوصيات / Mock recommendations data
  const mockRecommendations: Recommendation[] = [
    {
      id: '1',
      titleAr: 'تطبيق تقنيات الذكاء الاصطناعي',
      titleEn: 'Implement AI Technologies',
      descriptionAr: 'استخدام الذكاء الاصطناعي لتحسين عملية اتخاذ القرارات وزيادة الكفاءة التشغيلية',
      descriptionEn: 'Use AI to improve decision-making processes and increase operational efficiency',
      priority: 'high',
      category: 'technical',
      status: 'pending',
      rating: 5,
      submittedBy: 'أحمد محمد / Ahmed Mohamed',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      projectId: projectId || 'proj-1',
      projectName: projectName || 'التحول الرقمي',
      expectedImpact: 'high',
      estimatedCost: '$250,000',
      timeline: '6 أشهر / 6 months',
    },
    {
      id: '2',
      titleAr: 'تحسين واجهات المستخدم',
      titleEn: 'Improve User Interfaces',
      descriptionAr: 'إعادة تصميم واجهات المستخدم لتكون أكثر سهولة في الاستخدام وجاذبية',
      descriptionEn: 'Redesign user interfaces to be more user-friendly and attractive',
      priority: 'medium',
      category: 'operational',
      status: 'approved',
      rating: 4,
      submittedBy: 'فاطمة أحمد / Fatima Ahmed',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      approvedBy: 'مدير المشروع / Project Manager',
      approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      expectedImpact: 'medium',
      estimatedCost: '$75,000',
      timeline: '3 أشهر / 3 months',
    },
    {
      id: '3',
      titleAr: 'برنامج تدريب الموظفين',
      titleEn: 'Employee Training Program',
      descriptionAr: 'إنشاء برنامج تدريب شامل لرفع مهارات الموظفين في التقنيات الحديثة',
      descriptionEn: 'Create comprehensive training program to upskill employees in modern technologies',
      priority: 'high',
      category: 'hr',
      status: 'implemented',
      rating: 5,
      submittedBy: 'سارة علي / Sarah Ali',
      submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      approvedBy: 'مدير الموارد البشرية / HR Manager',
      approvedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      implementedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      expectedImpact: 'high',
      estimatedCost: '$150,000',
      timeline: '4 أشهر / 4 months',
      feedback: 'تم تنفيذ البرنامج بنجاح وحقق نتائج ممتازة / Program implemented successfully with excellent results',
    },
  ];

  useEffect(() => {
    setRecommendations(mockRecommendations);
  }, []);

  // إضافة توصية جديدة / Add new recommendation
  const handleAddRecommendation = async (values: any) => {
    setLoading(true);
    try {
      const newRecommendation: Recommendation = {
        id: Date.now().toString(),
        titleAr: values.titleAr,
        titleEn: values.titleEn,
        descriptionAr: values.descriptionAr,
        descriptionEn: values.descriptionEn,
        priority: values.priority,
        category: values.category,
        status: 'pending',
        rating: values.rating || 3,
        submittedBy: 'المستخدم الحالي / Current User',
        submittedAt: new Date().toISOString(),
        projectId: projectId,
        projectName: projectName,
        expectedImpact: values.expectedImpact,
        estimatedCost: values.estimatedCost,
        timeline: values.timeline,
      };

      setRecommendations(prev => [newRecommendation, ...prev]);
      setShowAddModal(false);
      form.resetFields();
      
      message.success(
        i18n.language === 'ar' 
          ? 'تم إضافة التوصية بنجاح!'
          : 'Recommendation added successfully!'
      );
    } catch (error) {
      message.error(
        i18n.language === 'ar'
          ? 'حدث خطأ أثناء إضافة التوصية'
          : 'Error adding recommendation'
      );
    } finally {
      setLoading(false);
    }
  };

  // تحديث حالة التوصية / Update recommendation status
  const updateRecommendationStatus = (id: string, status: Recommendation['status']) => {
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === id
          ? {
              ...rec,
              status,
              ...(status === 'approved' && {
                approvedBy: 'المدير التنفيذي / Executive Manager',
                approvedAt: new Date().toISOString(),
              }),
              ...(status === 'implemented' && {
                implementedAt: new Date().toISOString(),
              }),
            }
          : rec
      )
    );

    message.success(
      i18n.language === 'ar'
        ? `تم تحديث حالة التوصية إلى ${getStatusText(status)}`
        : `Recommendation status updated to ${status}`
    );
  };

  // حذف توصية / Delete recommendation
  const deleteRecommendation = (id: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
    message.success(
      i18n.language === 'ar'
        ? 'تم حذف التوصية بنجاح'
        : 'Recommendation deleted successfully'
    );
  };

  // الحصول على نص الحالة / Get status text
  const getStatusText = (status: Recommendation['status']) => {
    const statusMap = {
      pending: i18n.language === 'ar' ? 'معلقة' : 'Pending',
      approved: i18n.language === 'ar' ? 'موافق عليها' : 'Approved',
      rejected: i18n.language === 'ar' ? 'مرفوضة' : 'Rejected',
      implemented: i18n.language === 'ar' ? 'منفذة' : 'Implemented',
    };
    return statusMap[status];
  };

  // الحصول على لون الحالة / Get status color
  const getStatusColor = (status: Recommendation['status']) => {
    const colorMap = {
      pending: '#faad14',
      approved: '#52c41a',
      rejected: '#ff4d4f',
      implemented: '#0C085C',
    };
    return colorMap[status];
  };

  // الحصول على لون الأولوية / Get priority color
  const getPriorityColor = (priority: Recommendation['priority']) => {
    const colorMap = {
      high: '#ff4d4f',
      medium: '#faad14',
      low: '#52c41a',
    };
    return colorMap[priority];
  };

  // إحصائيات التوصيات / Recommendation statistics
  const stats = {
    total: recommendations.length,
    pending: recommendations.filter(r => r.status === 'pending').length,
    approved: recommendations.filter(r => r.status === 'approved').length,
    implemented: recommendations.filter(r => r.status === 'implemented').length,
  };

  return (
    <>
      <Modal
        title={
          <Space>
            <BulbOutlined style={{ color: '#faad14' }} />
            <span>{t('Project Recommendations')}</span>
            <Badge count={stats.total} style={{ backgroundColor: '#52c41a' }} />
          </Space>
        }
        open={visible}
        onCancel={onClose}
        footer={null}
        width={900}
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
      >
        {/* إحصائيات سريعة / Quick Stats */}
        <Card size="small" style={{ marginBottom: 16, background: '#f8fafc' }}>
          <Row gutter={[24, 24]}>
            <Col span={6}>
              <Statistic
                title={i18n.language === 'ar' ? 'المجموع' : 'Total'}
                value={stats.total}
                valueStyle={{ color: '#0095CE' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title={i18n.language === 'ar' ? 'معلقة' : 'Pending'}
                value={stats.pending}
                valueStyle={{ color: '#faad14' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title={i18n.language === 'ar' ? 'موافق عليها' : 'Approved'}
                value={stats.approved}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title={i18n.language === 'ar' ? 'منفذة' : 'Implemented'}
                value={stats.implemented}
                valueStyle={{ color: '#0095CE' }}
              />
            </Col>
          </Row>
        </Card>

        {/* زر إضافة توصية جديدة / Add New Recommendation Button */}
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowAddModal(true)}
            style={{
              background: '#0C085C',
              border: 'none',
              borderRadius: '8px',
              height: '40px',
              paddingLeft: '24px',
              paddingRight: '24px',
            }}
          >
            {t('Add Recommendation')}
          </Button>
        </div>

        {/* قائمة التوصيات / Recommendations List */}
        {recommendations.length === 0 ? (
          <Empty
            description={
              i18n.language === 'ar'
                ? 'لا توجد توصيات بعد'
                : 'No recommendations yet'
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            dataSource={recommendations}
            renderItem={(item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <List.Item
                  style={{
                    padding: '16px',
                    background: 'white',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                  actions={[
                    <Tooltip title={i18n.language === 'ar' ? 'تفاصيل' : 'Details'}>
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => setSelectedRecommendation(item)}
                      />
                    </Tooltip>,
                    <Tooltip title={i18n.language === 'ar' ? 'حذف' : 'Delete'}>
                      <Popconfirm
                        title={
                          i18n.language === 'ar'
                            ? 'هل أنت متأكد من حذف هذه التوصية؟'
                            : 'Are you sure to delete this recommendation?'
                        }
                        onConfirm={() => deleteRecommendation(item.id)}
                      >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Tooltip>,
                    ...(item.status === 'pending'
                      ? [
                          <Button
                            type="text"
                            style={{ color: '#52c41a' }}
                            icon={<CheckCircleOutlined />}
                            onClick={() => updateRecommendationStatus(item.id, 'approved')}
                          >
                            {i18n.language === 'ar' ? 'موافقة' : 'Approve'}
                          </Button>,
                          <Button
                            type="text"
                            danger
                            icon={<CloseCircleOutlined />}
                            onClick={() => updateRecommendationStatus(item.id, 'rejected')}
                          >
                            {i18n.language === 'ar' ? 'رفض' : 'Reject'}
                          </Button>,
                        ]
                      : []),
                    ...(item.status === 'approved'
                      ? [
                          <Button
                            type="text"
                            style={{ color: '#0095CE' }}
                            icon={<CheckCircleOutlined />}
                            onClick={() => updateRecommendationStatus(item.id, 'implemented')}
                          >
                            {i18n.language === 'ar' ? 'تنفيذ' : 'Implement'}
                          </Button>,
                        ]
                      : []),
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: getPriorityColor(item.priority),
                          color: 'white',
                        }}
                        icon={<BulbOutlined />}
                      />
                    }
                    title={
                      <div>
                        <Space size="middle">
                          <Text strong style={{ fontSize: '16px' }}>
                            {i18n.language === 'ar' ? item.titleAr : item.titleEn}
                          </Text>
                          <Tag color={getStatusColor(item.status)}>
                            {getStatusText(item.status)}
                          </Tag>
                          <Tag color={getPriorityColor(item.priority)}>
                            {item.priority === 'high' ? '🔥' : item.priority === 'medium' ? '⚡' : '📝'}
                            {' '}
                            {i18n.language === 'ar'
                              ? item.priority === 'high'
                                ? 'عالية'
                                : item.priority === 'medium'
                                ? 'متوسطة'
                                : 'منخفضة'
                              : item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                          </Tag>
                          <Rate disabled value={item.rating} style={{ fontSize: '14px' }} />
                        </Space>
                      </div>
                    }
                    description={
                      <div>
                        <Paragraph
                          ellipsis={{ rows: 2, expandable: true }}
                          style={{ marginBottom: '8px', color: '#666' }}
                        >
                          {i18n.language === 'ar' ? item.descriptionAr : item.descriptionEn}
                        </Paragraph>
                        <Space size="middle" wrap>
                          <Text type="secondary">
                            <UserOutlined /> {item.submittedBy}
                          </Text>
                          <Text type="secondary">
                            <CalendarOutlined />{' '}
                            {new Date(item.submittedAt).toLocaleDateString(
                              i18n.language === 'ar' ? 'ar-SA' : 'en-US'
                            )}
                          </Text>
                          {item.estimatedCost && (
                            <Text type="secondary">💰 {item.estimatedCost}</Text>
                          )}
                          {item.timeline && (
                            <Text type="secondary">⏰ {item.timeline}</Text>
                          )}
                        </Space>
                      </div>
                    }
                  />
                </List.Item>
              </motion.div>
            )}
          />
        )}
      </Modal>

      {/* نموذج إضافة توصية / Add Recommendation Modal */}
      <Modal
        title={
          <Space>
            <PlusOutlined />
            <span>{t('Add Recommendation')}</span>
          </Space>
        }
        open={showAddModal}
        onCancel={() => {
          setShowAddModal(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddRecommendation}
          style={{ marginTop: '20px' }}
        >
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item
                name="titleAr"
                label={i18n.language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
                rules={[{ required: true, message: 'يرجى إدخال العنوان بالعربية!' }]}
              >
                <Input placeholder="مثال: تحسين الأداء" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="titleEn"
                label={i18n.language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}
                rules={[{ required: true, message: 'Please enter title in English!' }]}
              >
                <Input placeholder="Example: Performance Improvement" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item
                name="descriptionAr"
                label={i18n.language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
                rules={[{ required: true, message: 'يرجى إدخال الوصف بالعربية!' }]}
              >
                <TextArea rows={3} placeholder="وصف مفصل للتوصية..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="descriptionEn"
                label={i18n.language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}
                rules={[{ required: true, message: 'Please enter description in English!' }]}
              >
                <TextArea rows={3} placeholder="Detailed description of recommendation..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Form.Item
                name="priority"
                label={i18n.language === 'ar' ? 'الأولوية' : 'Priority'}
                rules={[{ required: true, message: 'يرجى اختيار الأولوية!' }]}
              >
                <Select placeholder={i18n.language === 'ar' ? 'اختر الأولوية' : 'Select Priority'}>
                  <Option value="high">
                    🔥 {i18n.language === 'ar' ? 'عالية' : 'High'}
                  </Option>
                  <Option value="medium">
                    ⚡ {i18n.language === 'ar' ? 'متوسطة' : 'Medium'}
                  </Option>
                  <Option value="low">
                    📝 {i18n.language === 'ar' ? 'منخفضة' : 'Low'}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="category"
                label={i18n.language === 'ar' ? 'الفئة' : 'Category'}
                rules={[{ required: true, message: 'يرجى اختيار الفئة!' }]}
              >
                <Select placeholder={i18n.language === 'ar' ? 'اختر الفئة' : 'Select Category'}>
                  <Option value="strategic">
                    {i18n.language === 'ar' ? 'استراتيجية' : 'Strategic'}
                  </Option>
                  <Option value="operational">
                    {i18n.language === 'ar' ? 'تشغيلية' : 'Operational'}
                  </Option>
                  <Option value="financial">
                    {i18n.language === 'ar' ? 'مالية' : 'Financial'}
                  </Option>
                  <Option value="technical">
                    {i18n.language === 'ar' ? 'تقنية' : 'Technical'}
                  </Option>
                  <Option value="hr">
                    {i18n.language === 'ar' ? 'موارد بشرية' : 'Human Resources'}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="expectedImpact"
                label={i18n.language === 'ar' ? 'التأثير المتوقع' : 'Expected Impact'}
                rules={[{ required: true, message: 'يرجى اختيار التأثير المتوقع!' }]}
              >
                <Select
                  placeholder={i18n.language === 'ar' ? 'اختر التأثير' : 'Select Impact'}
                >
                  <Option value="high">
                    {i18n.language === 'ar' ? 'عالي' : 'High'}
                  </Option>
                  <Option value="medium">
                    {i18n.language === 'ar' ? 'متوسط' : 'Medium'}
                  </Option>
                  <Option value="low">
                    {i18n.language === 'ar' ? 'منخفض' : 'Low'}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Form.Item
                name="estimatedCost"
                label={i18n.language === 'ar' ? 'التكلفة المقدرة' : 'Estimated Cost'}
              >
                <Input placeholder="$50,000" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="timeline"
                label={i18n.language === 'ar' ? 'الإطار الزمني' : 'Timeline'}
              >
                <Input
                  placeholder={
                    i18n.language === 'ar' ? '3 أشهر' : '3 months'
                  }
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="rating"
                label={i18n.language === 'ar' ? 'التقييم' : 'Rating'}
              >
                <Rate />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: 'center', marginTop: '24px' }}>
            <Space>
              <Button onClick={() => setShowAddModal(false)}>
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
                {t('Submit Recommendation')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* نموذج تفاصيل التوصية / Recommendation Details Modal */}
      {selectedRecommendation && (
        <Modal
          title={
            <Space>
              <StarOutlined style={{ color: '#faad14' }} />
              <span>
                {i18n.language === 'ar'
                  ? selectedRecommendation.titleAr
                  : selectedRecommendation.titleEn}
              </span>
            </Space>
          }
          open={!!selectedRecommendation}
          onCancel={() => setSelectedRecommendation(null)}
          footer={null}
          width={700}
        >
          <div style={{ marginTop: '20px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* معلومات أساسية / Basic Information */}
              <Card size="small" title={i18n.language === 'ar' ? 'معلومات أساسية' : 'Basic Information'}>
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Text strong>{i18n.language === 'ar' ? 'الحالة:' : 'Status:'}</Text>
                    <br />
                    <Tag color={getStatusColor(selectedRecommendation.status)}>
                      {getStatusText(selectedRecommendation.status)}
                    </Tag>
                  </Col>
                  <Col span={12}>
                    <Text strong>{i18n.language === 'ar' ? 'الأولوية:' : 'Priority:'}</Text>
                    <br />
                    <Tag color={getPriorityColor(selectedRecommendation.priority)}>
                      {i18n.language === 'ar'
                        ? selectedRecommendation.priority === 'high'
                          ? 'عالية'
                          : selectedRecommendation.priority === 'medium'
                          ? 'متوسطة'
                          : 'منخفضة'
                        : selectedRecommendation.priority}
                    </Tag>
                  </Col>
                </Row>
                <Divider />
                <Text strong>{i18n.language === 'ar' ? 'الوصف:' : 'Description:'}</Text>
                <Paragraph style={{ marginTop: '8px' }}>
                  {i18n.language === 'ar'
                    ? selectedRecommendation.descriptionAr
                    : selectedRecommendation.descriptionEn}
                </Paragraph>
              </Card>

              {/* تفاصيل المشروع / Project Details */}
              <Card size="small" title={i18n.language === 'ar' ? 'تفاصيل التنفيذ' : 'Implementation Details'}>
                <Row gutter={[24, 24]}>
                  <Col span={8}>
                    <Text strong>{i18n.language === 'ar' ? 'التكلفة المقدرة:' : 'Estimated Cost:'}</Text>
                    <br />
                    <Text>{selectedRecommendation.estimatedCost || 'غير محدد / Not specified'}</Text>
                  </Col>
                  <Col span={8}>
                    <Text strong>{i18n.language === 'ar' ? 'الإطار الزمني:' : 'Timeline:'}</Text>
                    <br />
                    <Text>{selectedRecommendation.timeline || 'غير محدد / Not specified'}</Text>
                  </Col>
                  <Col span={8}>
                    <Text strong>{i18n.language === 'ar' ? 'التأثير المتوقع:' : 'Expected Impact:'}</Text>
                    <br />
                    <Tag color={getPriorityColor(selectedRecommendation.expectedImpact)}>
                      {i18n.language === 'ar'
                        ? selectedRecommendation.expectedImpact === 'high'
                          ? 'عالي'
                          : selectedRecommendation.expectedImpact === 'medium'
                          ? 'متوسط'
                          : 'منخفض'
                        : selectedRecommendation.expectedImpact}
                    </Tag>
                  </Col>
                </Row>
              </Card>

              {/* تفاصيل التقديم / Submission Details */}
              <Card size="small" title={i18n.language === 'ar' ? 'تفاصيل التقديم' : 'Submission Details'}>
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Text strong>{i18n.language === 'ar' ? 'مقدم بواسطة:' : 'Submitted by:'}</Text>
                    <br />
                    <Text>{selectedRecommendation.submittedBy}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>{i18n.language === 'ar' ? 'تاريخ التقديم:' : 'Submitted on:'}</Text>
                    <br />
                    <Text>
                      {new Date(selectedRecommendation.submittedAt).toLocaleDateString(
                        i18n.language === 'ar' ? 'ar-SA' : 'en-US'
                      )}
                    </Text>
                  </Col>
                </Row>
                <Divider />
                <div>
                  <Text strong>{i18n.language === 'ar' ? 'التقييم:' : 'Rating:'}</Text>
                  <br />
                  <Rate disabled value={selectedRecommendation.rating} />
                </div>
              </Card>

              {/* الملاحظات / Feedback */}
              {selectedRecommendation.feedback && (
                <Card size="small" title={i18n.language === 'ar' ? 'الملاحظات' : 'Feedback'}>
                  <Paragraph>{selectedRecommendation.feedback}</Paragraph>
                </Card>
              )}
            </Space>
          </div>
        </Modal>
      )}
    </>
  );
};