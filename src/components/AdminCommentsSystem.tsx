// نظام التعليقات والمرفقات الإدارية / Admin Comments & File Attachments System
import React, { FC, useState, useEffect } from 'react';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Space,
  Typography,
  List,
  Avatar,
  Tag,
  Divider,
  message,
  Empty,
  Badge,
  Tooltip,
  Popconfirm,
  Row,
  Col,
  Progress,
  Alert,
  Select,
  Checkbox,
} from 'antd';
import {
  PlusOutlined,
  CommentOutlined,
  PaperClipOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  CalendarOutlined,
  FileOutlined,
  UploadOutlined,
  MessageOutlined,
  AdminPanelSettingsOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { UploadProps, UploadFile } from 'antd';

const { TextArea } = Input;
const { Text, Title, Paragraph } = Typography;
const { Dragger } = Upload;
const { Option } = Select;

// واجهة التعليق الإداري / Admin Comment Interface
export interface AdminComment {
  id: string;
  contentAr: string;
  contentEn: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  projectId: string;
  projectName: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'resolved' | 'archived';
  attachments: FileAttachment[];
  mentions?: string[];
  isPrivate: boolean;
  category: 'feedback' | 'concern' | 'approval' | 'instruction' | 'update';
}

// واجهة المرفق / File Attachment Interface
export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  description?: string;
}

interface AdminCommentsSystemProps {
  projectId: string;
  projectName: string;
  visible: boolean;
  onClose: () => void;
  userRole?: 'admin' | 'executive' | 'manager' | 'viewer';
}

export const AdminCommentsSystem: FC<AdminCommentsSystemProps> = ({
  projectId,
  projectName,
  visible,
  onClose,
  userRole = 'admin',
}) => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedComment, setSelectedComment] = useState<AdminComment | null>(null);

  // البيانات الوهمية / Mock data
  const mockComments: AdminComment[] = [
    {
      id: '1',
      contentAr: 'يرجى مراجعة التقدم في المشروع والتأكد من الالتزام بالجدول الزمني المحدد',
      contentEn: 'Please review project progress and ensure adherence to the specified timeline',
      authorId: 'admin-1',
      authorName: 'أحمد المدير / Ahmed Al-Manager',
      authorRole: 'مدير تنفيذي / Executive Manager',
      authorAvatar: '👨‍💼',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      projectId,
      projectName,
      priority: 'high',
      status: 'active',
      attachments: [
        {
          id: 'att-1',
          name: 'project-timeline.pdf',
          size: 2048000,
          type: 'application/pdf',
          url: '/files/project-timeline.pdf',
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'أحمد المدير / Ahmed Al-Manager',
          description: 'الجدول الزمني المحدث للمشروع / Updated project timeline',
        },
      ],
      isPrivate: false,
      category: 'instruction',
    },
    {
      id: '2',
      contentAr: 'تم اعتماد الميزانية الإضافية للمشروع. يمكن المتابعة وفقاً للخطة المقترحة',
      contentEn: 'Additional budget approved for the project. You can proceed according to the proposed plan',
      authorId: 'exec-1',
      authorName: 'فاطمة الرئيس / Fatima Al-President',
      authorRole: 'الرئيس التنفيذي / CEO',
      authorAvatar: '👩‍💼',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      projectId,
      projectName,
      priority: 'medium',
      status: 'resolved',
      attachments: [
        {
          id: 'att-2',
          name: 'budget-approval.xlsx',
          size: 1024000,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          url: '/files/budget-approval.xlsx',
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'فاطمة الرئيس / Fatima Al-President',
          description: 'موافقة الميزانية / Budget approval',
        },
      ],
      isPrivate: false,
      category: 'approval',
    },
    {
      id: '3',
      contentAr: 'ملاحظة خاصة: يرجى التنسيق مع قسم المالية قبل اتخاذ أي قرار يتعلق بالمصروفات',
      contentEn: 'Private note: Please coordinate with finance department before making any expense-related decisions',
      authorId: 'cfo-1',
      authorName: 'محمد المالي / Mohamed Al-Finance',
      authorRole: 'المدير المالي / CFO',
      authorAvatar: '💰',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      projectId,
      projectName,
      priority: 'high',
      status: 'active',
      attachments: [],
      isPrivate: true,
      category: 'concern',
    },
  ];

  useEffect(() => {
    setComments(mockComments);
  }, []);

  // إضافة تعليق جديد / Add new comment
  const handleAddComment = async (values: any) => {
    setLoading(true);
    try {
      // رفع الملفات / Upload files
      const uploadedAttachments: FileAttachment[] = await Promise.all(
        fileList.map(async (file) => ({
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: file.size || 0,
          type: file.type || 'application/octet-stream',
          url: `/files/${file.name}`,
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'المستخدم الحالي / Current User',
          description: values.fileDescription,
        }))
      );

      const newComment: AdminComment = {
        id: Date.now().toString(),
        contentAr: values.contentAr,
        contentEn: values.contentEn,
        authorId: 'current-user',
        authorName: 'المستخدم الحالي / Current User',
        authorRole: userRole === 'admin' ? 'مدير النظام / Admin' : 'مستخدم / User',
        authorAvatar: '👤',
        createdAt: new Date().toISOString(),
        projectId,
        projectName,
        priority: values.priority,
        status: 'active',
        attachments: uploadedAttachments,
        isPrivate: values.isPrivate || false,
        category: values.category,
      };

      setComments(prev => [newComment, ...prev]);
      setShowAddModal(false);
      form.resetFields();
      setFileList([]);

      message.success(
        i18n.language === 'ar'
          ? 'تم إضافة التعليق بنجاح!'
          : 'Comment added successfully!'
      );
    } catch (error) {
      message.error(
        i18n.language === 'ar'
          ? 'حدث خطأ أثناء إضافة التعليق'
          : 'Error adding comment'
      );
    } finally {
      setLoading(false);
    }
  };

  // حذف تعليق / Delete comment
  const deleteComment = (id: string) => {
    setComments(prev => prev.filter(comment => comment.id !== id));
    message.success(
      i18n.language === 'ar'
        ? 'تم حذف التعليق بنجاح'
        : 'Comment deleted successfully'
    );
  };

  // تحديث حالة التعليق / Update comment status
  const updateCommentStatus = (id: string, status: AdminComment['status']) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === id ? { ...comment, status } : comment
      )
    );

    message.success(
      i18n.language === 'ar'
        ? 'تم تحديث حالة التعليق'
        : 'Comment status updated'
    );
  };

  // تحميل ملف / Download file
  const downloadFile = (attachment: FileAttachment) => {
    // محاكاة تحميل الملف / Simulate file download
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success(
      i18n.language === 'ar'
        ? `تم تحميل ${attachment.name}`
        : `Downloaded ${attachment.name}`
    );
  };

  // الحصول على أيقونة نوع الملف / Get file type icon
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
    if (type.includes('image')) return <FileImageOutlined style={{ color: '#52c41a' }} />;
    if (type.includes('spreadsheet') || type.includes('excel'))
      return <FileExcelOutlined style={{ color: '#1890ff' }} />;
    if (type.includes('document') || type.includes('word'))
      return <FileWordOutlined style={{ color: '#1890ff' }} />;
    return <FileOutlined />;
  };

  // الحصول على لون الأولوية / Get priority color
  const getPriorityColor = (priority: AdminComment['priority']) => {
    const colorMap = {
      high: '#ff4d4f',
      medium: '#faad14',
      low: '#52c41a',
    };
    return colorMap[priority];
  };

  // الحصول على لون الحالة / Get status color
  const getStatusColor = (status: AdminComment['status']) => {
    const colorMap = {
      active: '#1890ff',
      resolved: '#52c41a',
      archived: '#d9d9d9',
    };
    return colorMap[status];
  };

  // خصائص رفع الملفات / Upload properties
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    onChange: ({ fileList }) => setFileList(fileList),
    beforeUpload: () => false, // منع الرفع التلقائي / Prevent auto upload
    onRemove: (file) => {
      setFileList(prev => prev.filter(item => item.uid !== file.uid));
    },
  };

  // إحصائيات التعليقات / Comment statistics
  const stats = {
    total: comments.length,
    active: comments.filter(c => c.status === 'active').length,
    resolved: comments.filter(c => c.status === 'resolved').length,
    high: comments.filter(c => c.priority === 'high').length,
  };

  return (
    <>
      <Modal
        title={
          <Space>
            <MessageOutlined style={{ color: '#1890ff' }} />
            <span>{t('Admin Comments')}</span>
            <Badge count={stats.total} style={{ backgroundColor: '#52c41a' }} />
          </Space>
        }
        open={visible}
        onCancel={onClose}
        footer={null}
        width={1000}
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
      >
        {/* إحصائيات سريعة / Quick Stats */}
        <Card size="small" style={{ marginBottom: 16, background: '#f8fafc' }}>
          <Row gutter={16}>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                  {stats.total}
                </div>
                <Text type="secondary">
                  {i18n.language === 'ar' ? 'المجموع' : 'Total'}
                </Text>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                  {stats.active}
                </div>
                <Text type="secondary">
                  {i18n.language === 'ar' ? 'نشطة' : 'Active'}
                </Text>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                  {stats.resolved}
                </div>
                <Text type="secondary">
                  {i18n.language === 'ar' ? 'محلولة' : 'Resolved'}
                </Text>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                  {stats.high}
                </div>
                <Text type="secondary">
                  {i18n.language === 'ar' ? 'عالية الأولوية' : 'High Priority'}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* زر إضافة تعليق جديد / Add New Comment Button */}
        {(userRole === 'admin' || userRole === 'executive') && (
          <div style={{ marginBottom: 16, textAlign: 'center' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowAddModal(true)}
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                borderRadius: '8px',
                height: '40px',
                paddingLeft: '24px',
                paddingRight: '24px',
              }}
            >
              {t('Add Comment')}
            </Button>
          </div>
        )}

        {/* قائمة التعليقات / Comments List */}
        {comments.length === 0 ? (
          <Empty
            description={
              i18n.language === 'ar'
                ? 'لا توجد تعليقات بعد'
                : 'No comments yet'
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            dataSource={comments.filter(comment => 
              !comment.isPrivate || userRole === 'admin' || userRole === 'executive'
            )}
            renderItem={(item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <List.Item
                  style={{
                    padding: '20px',
                    background: item.isPrivate ? '#fff7e6' : 'white',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    border: item.isPrivate 
                      ? '2px solid #faad14' 
                      : `2px solid ${getPriorityColor(item.priority)}30`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  actions={[
                    <Tooltip title={i18n.language === 'ar' ? 'تفاصيل' : 'Details'}>
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => setSelectedComment(item)}
                      />
                    </Tooltip>,
                    ...(userRole === 'admin' || userRole === 'executive' ? [
                      <Tooltip title={i18n.language === 'ar' ? 'حذف' : 'Delete'}>
                        <Popconfirm
                          title={
                            i18n.language === 'ar'
                              ? 'هل أنت متأكد من حذف هذا التعليق؟'
                              : 'Are you sure to delete this comment?'
                          }
                          onConfirm={() => deleteComment(item.id)}
                        >
                          <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </Tooltip>,
                    ] : []),
                    ...(item.status === 'active' ? [
                      <Button
                        type="text"
                        style={{ color: '#52c41a' }}
                        onClick={() => updateCommentStatus(item.id, 'resolved')}
                      >
                        {i18n.language === 'ar' ? 'تم الحل' : 'Resolve'}
                      </Button>,
                    ] : []),
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar size="large" style={{ backgroundColor: '#1890ff' }}>
                        {item.authorAvatar || <UserOutlined />}
                      </Avatar>
                    }
                    title={
                      <div>
                        <Space size="middle" wrap>
                          <Text strong style={{ fontSize: '16px' }}>
                            {item.authorName}
                          </Text>
                          <Tag color="#1890ff">{item.authorRole}</Tag>
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
                          <Tag color={getStatusColor(item.status)}>
                            {i18n.language === 'ar'
                              ? item.status === 'active'
                                ? 'نشط'
                                : item.status === 'resolved'
                                ? 'محلول'
                                : 'مؤرشف'
                              : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Tag>
                          {item.isPrivate && (
                            <Tag color="orange">
                              🔒 {i18n.language === 'ar' ? 'خاص' : 'Private'}
                            </Tag>
                          )}
                        </Space>
                      </div>
                    }
                    description={
                      <div style={{ marginTop: '12px' }}>
                        <Paragraph
                          style={{
                            marginBottom: '12px',
                            color: '#333',
                            fontSize: '14px',
                            lineHeight: '1.6',
                          }}
                        >
                          {i18n.language === 'ar' ? item.contentAr : item.contentEn}
                        </Paragraph>

                        {/* المرفقات / Attachments */}
                        {item.attachments.length > 0 && (
                          <div style={{ marginBottom: '12px' }}>
                            <Text strong style={{ color: '#666', fontSize: '12px' }}>
                              {i18n.language === 'ar' ? 'المرفقات:' : 'Attachments:'}
                            </Text>
                            <div style={{ marginTop: '8px' }}>
                              {item.attachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 12px',
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef',
                                    marginRight: '8px',
                                    marginBottom: '8px',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => downloadFile(attachment)}
                                >
                                  {getFileIcon(attachment.type)}
                                  <span style={{ fontSize: '12px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {attachment.name}
                                  </span>
                                  <Text type="secondary" style={{ fontSize: '10px' }}>
                                    ({(attachment.size / 1024 / 1024).toFixed(1)} MB)
                                  </Text>
                                  <DownloadOutlined style={{ color: '#1890ff' }} />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <Space size="middle" wrap>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            <CalendarOutlined /> {new Date(item.createdAt).toLocaleString(
                              i18n.language === 'ar' ? 'ar-SA' : 'en-US'
                            )}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            📁 {item.category}
                          </Text>
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

      {/* نموذج إضافة تعليق / Add Comment Modal */}
      <Modal
        title={
          <Space>
            <PlusOutlined />
            <span>{t('Add Comment')}</span>
          </Space>
        }
        open={showAddModal}
        onCancel={() => {
          setShowAddModal(false);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddComment}
          style={{ marginTop: '20px' }}
        >
          <Alert
            message={
              i18n.language === 'ar'
                ? 'ملاحظة: التعليقات الإدارية مرئية لجميع أعضاء الفريق ما لم تكن محددة كخاصة'
                : 'Note: Admin comments are visible to all team members unless marked as private'
            }
            type="info"
            showIcon
            style={{ marginBottom: '20px' }}
          />

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contentAr"
                label={i18n.language === 'ar' ? 'التعليق (عربي)' : 'Comment (Arabic)'}
                rules={[{ required: true, message: 'يرجى إدخال التعليق بالعربية!' }]}
              >
                <TextArea rows={4} placeholder="اكتب تعليقك هنا..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contentEn"
                label={i18n.language === 'ar' ? 'التعليق (إنجليزي)' : 'Comment (English)'}
                rules={[{ required: true, message: 'Please enter comment in English!' }]}
              >
                <TextArea rows={4} placeholder="Write your comment here..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="priority"
                label={i18n.language === 'ar' ? 'الأولوية' : 'Priority'}
                rules={[{ required: true, message: 'يرجى اختيار الأولوية!' }]}
              >
                <Select placeholder={i18n.language === 'ar' ? 'اختر الأولوية' : 'Select Priority'}>
                  <Option value="high">🔥 {i18n.language === 'ar' ? 'عالية' : 'High'}</Option>
                  <Option value="medium">⚡ {i18n.language === 'ar' ? 'متوسطة' : 'Medium'}</Option>
                  <Option value="low">📝 {i18n.language === 'ar' ? 'منخفضة' : 'Low'}</Option>
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
                  <Option value="feedback">{i18n.language === 'ar' ? 'تعليق' : 'Feedback'}</Option>
                  <Option value="concern">{i18n.language === 'ar' ? 'قلق' : 'Concern'}</Option>
                  <Option value="approval">{i18n.language === 'ar' ? 'موافقة' : 'Approval'}</Option>
                  <Option value="instruction">{i18n.language === 'ar' ? 'تعليمات' : 'Instruction'}</Option>
                  <Option value="update">{i18n.language === 'ar' ? 'تحديث' : 'Update'}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isPrivate"
                valuePropName="checked"
                style={{ marginTop: '30px' }}
              >
                <Checkbox>
                  🔒 {i18n.language === 'ar' ? 'تعليق خاص' : 'Private Comment'}
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>

          {/* رفع الملفات / File Upload */}
          <Form.Item
            label={
              <Space>
                <PaperClipOutlined />
                <span>{i18n.language === 'ar' ? 'المرفقات' : 'Attachments'}</span>
              </Space>
            }
          >
            <Dragger {...uploadProps} style={{ background: '#fafafa' }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text">
                {i18n.language === 'ar'
                  ? 'اضغط أو اسحب الملفات إلى هنا للرفع'
                  : 'Click or drag files to this area to upload'}
              </p>
              <p className="ant-upload-hint">
                {i18n.language === 'ar'
                  ? 'دعم رفع ملفات متعددة. PDF, Word, Excel, Images مدعومة'
                  : 'Support for multiple file upload. PDF, Word, Excel, Images supported'}
              </p>
            </Dragger>
          </Form.Item>

          {fileList.length > 0 && (
            <Form.Item
              name="fileDescription"
              label={i18n.language === 'ar' ? 'وصف المرفقات' : 'File Description'}
            >
              <Input
                placeholder={
                  i18n.language === 'ar'
                    ? 'وصف قصير للملفات المرفقة...'
                    : 'Brief description of attached files...'
                }
              />
            </Form.Item>
          )}

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
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  border: 'none',
                }}
              >
                {i18n.language === 'ar' ? 'إضافة التعليق' : 'Add Comment'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};