import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Button,
  Row,
  Col,
  Space,
  Typography,
  Divider,
  Upload,
  Tag
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { Meeting, Company, Attendee } from '../../types/secretary';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

// Validation Schema
const meetingSchema = z.object({
  title: z.string().min(1, 'Meeting title is required'),
  description: z.string().optional(),
  date: z.date(),
  time: z.string(),
  companyId: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  attendees: z.array(z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    role: z.enum(['secretary', 'executive', 'viewer'])
  })).min(1, 'At least one attendee is required'),
  agenda: z.array(z.object({
    title: z.string().min(1, 'Agenda item title is required'),
    duration: z.number().min(5, 'Minimum 5 minutes'),
    owner: z.string().min(1, 'Owner is required')
  })).optional()
});

type MeetingFormData = z.infer<typeof meetingSchema>;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
  }
  
  .ant-modal-header {
    background: linear-gradient(135deg, #0C085C 0%, #363692 100%);
    border-bottom: none;
    
    .ant-modal-title {
      color: white;
      font-weight: 600;
    }
  }
  
  .ant-modal-close {
    color: white;
    
    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }
`;

const AgendaItem = styled.div`
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border-left: 4px solid #0095CE;
`;

const AttendeeTag = styled(Tag)`
  margin-bottom: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  
  &.executive {
    background: #e6f7ff;
    border-color: #1890ff;
    color: #1890ff;
  }
  
  &.secretary {
    background: #f6ffed;
    border-color: #52c41a;
    color: #52c41a;
  }
  
  &.viewer {
    background: #fff7e6;
    border-color: #fa8c16;
    color: #fa8c16;
  }
`;

interface MeetingModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: Partial<Meeting>) => void;
  meeting?: Meeting | null;
  companies: Company[];
  selectedDate: Date;
}

export const MeetingModal: React.FC<MeetingModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  meeting,
  companies,
  selectedDate
}) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.toLowerCase().startsWith('ar');
  const T = (key: string) => {
    const map: Record<string, string> = {
      'Create New Meeting': 'إنشاء اجتماع جديد',
      'Edit Meeting': 'تعديل الاجتماع',
      'Update Meeting': 'تحديث الاجتماع',
      'Create Meeting': 'إنشاء الاجتماع',
      'Cancel': 'إلغاء',
      'Meeting Title': 'عنوان الاجتماع',
      'Enter meeting title': 'أدخل عنوان الاجتماع',
      'Company': 'الشركة',
      'Select company': 'اختر الشركة',
      'Date': 'التاريخ',
      'Time': 'الوقت',
      'Location': 'الموقع',
      'Meeting location (optional)': 'موقع الاجتماع (اختياري)',
      'Description': 'الوصف',
      'Meeting description (optional)': 'وصف الاجتماع (اختياري)',
      'Attendees': 'الحضور',
      'Add Attendee': 'إضافة حاضر',
      'Name': 'الاسم',
      'Email': 'البريد الإلكتروني',
      'Secretary': 'سكرتير',
      'Executive': 'تنفيذي',
      'Viewer': 'مشاهد',
      'Agenda Items': 'بنود جدول الأعمال',
      'Add Item': 'إضافة بند',
      'Agenda item title': 'عنوان بند الجدول',
      'Minutes': 'الدقائق',
      'Owner': 'المسؤول',
      'Presentation Materials': 'مواد العرض',
      'Upload Files': 'رفع الملفات',
      'Supported formats: PDF, PPT, PPTX, DOC, DOCX (Max 10MB each)': 'الصيغ المدعومة: PDF, PPT, PPTX, DOC, DOCX (الحد الأقصى 10MB لكل ملف)',
      'Executive Secretary': 'السكرتير التنفيذي',
    };
    return isArabic && map[key] ? map[key] : key;
  };
  const [form] = Form.useForm();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      title: '',
      description: '',
      date: selectedDate,
      time: '09:00',
      companyId: '',
      location: '',
      attendees: [
        {
          name: 'Executive Secretary',
          email: 'secretary@company.com',
          role: 'secretary'
        }
      ],
      agenda: []
    }
  });

  const watchedAttendees = watch('attendees', []);
  const watchedAgenda = watch('agenda', []);

  useEffect(() => {
    if (meeting) {
      reset({
        title: meeting.title,
        description: meeting.description || '',
        date: meeting.date,
        time: dayjs(meeting.date).format('HH:mm'),
        companyId: meeting.companyId,
        location: meeting.location || '',
        attendees: meeting.attendees.map(att => ({
          name: att.name,
          email: att.email,
          role: att.role
        })),
        agenda: meeting.agenda.map(task => ({
          title: task.title,
          duration: 30, // Default duration
          owner: task.owner
        }))
      });
    } else {
      reset({
        title: '',
        description: '',
        date: selectedDate,
        time: '09:00',
        companyId: '',
        location: '',
        attendees: [
          {
            name: 'Executive Secretary',
            email: 'secretary@company.com',
            role: 'secretary'
          }
        ],
        agenda: []
      });
    }
  }, [meeting, selectedDate, reset]);

  const onFormSubmit = (data: MeetingFormData) => {
    const meetingData: Partial<Meeting> = {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      companyId: data.companyId,
      location: data.location,
      attendees: data.attendees.map((att, index) => ({
        id: `att-${index}`,
        name: att.name,
        email: att.email,
        role: att.role,
        status: 'pending'
      })),
      agenda: data.agenda?.map((item, index) => ({
        id: `task-${index}`,
        title: item.title,
        start: new Date(data.date),
        end: new Date(new Date(data.date).getTime() + item.duration * 60000),
        owner: item.owner,
        status: 'pending',
        priority: 'medium',
        directives: []
      })) || []
    };

    onSubmit(meetingData);
  };

  const addAttendee = () => {
    const currentAttendees = watchedAttendees;
    setValue('attendees', [
      ...currentAttendees,
      { name: '', email: '', role: 'viewer' }
    ]);
  };

  const removeAttendee = (index: number) => {
    const currentAttendees = watchedAttendees;
    setValue('attendees', currentAttendees.filter((_, i) => i !== index));
  };

  const addAgendaItem = () => {
    const currentAgenda = watchedAgenda;
    setValue('agenda', [
      ...currentAgenda,
      { title: '', duration: 30, owner: '' }
    ]);
  };

  const removeAgendaItem = (index: number) => {
    const currentAgenda = watchedAgenda;
    setValue('agenda', currentAgenda.filter((_, i) => i !== index));
  };

  return (
    <StyledModal
      title={meeting ? T('Edit Meeting') : T('Create New Meeting')}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {T('Cancel')}
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmit(onFormSubmit)}
          style={{ background: '#0095CE', borderColor: '#0095CE' }}
        >
          {meeting ? T('Update Meeting') : T('Create Meeting')}
        </Button>
      ]}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item 
              label={T('Meeting Title')} 
              validateStatus={errors.title ? 'error' : ''}
              help={errors.title?.message}
            >
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input 
                    {...field} 
                    placeholder={T('Enter meeting title')}
                    size="large"
                  />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item 
              label={T('Company')}
              validateStatus={errors.companyId ? 'error' : ''}
              help={errors.companyId?.message}
            >
              <Controller
                name="companyId"
                control={control}
                render={({ field }) => (
                  <Select 
                    {...field} 
                    placeholder={T('Select company')}
                    size="large"
                  >
                    {companies.map(company => (
                      <Option key={company.id} value={company.id}>
                        {company.name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              label={T('Date')}
              validateStatus={errors.date ? 'error' : ''}
              help={errors.date?.message}
            >
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker 
                    {...field}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.toDate())}
                    style={{ width: '100%' }}
                    size="large"
                  />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label={T('Time')}
              validateStatus={errors.time ? 'error' : ''}
              help={errors.time?.message}
            >
              <Controller
                name="time"
                control={control}
                render={({ field }) => (
                  <TimePicker 
                    {...field}
                    value={field.value ? dayjs(field.value, 'HH:mm') : null}
                    onChange={(time) => field.onChange(time?.format('HH:mm'))}
                    format="HH:mm"
                    style={{ width: '100%' }}
                    size="large"
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={T('Location')}>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Input 
                {...field} 
                placeholder={T('Meeting location (optional)')}
                size="large"
              />
            )}
          />
        </Form.Item>

        <Form.Item label={T('Description')}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea 
                {...field} 
                placeholder={T('Meeting description (optional)')}
                rows={3}
              />
            )}
          />
        </Form.Item>

        <Divider />

        {/* Attendees Section */}
        <div style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Title level={5} style={{ margin: 0 }}>{T('Attendees')}</Title>
            <Button 
              type="dashed" 
              icon={<UserAddOutlined />} 
              onClick={addAttendee}
              size="small"
            >
              {T('Add Attendee')}
            </Button>
          </Row>

          {watchedAttendees.map((attendee, index) => (
            <Row key={index} gutter={8} style={{ marginBottom: 12 }}>
              <Col span={8}>
                <Controller
                  name={`attendees.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <Input 
                      {...field} 
                      placeholder={T('Name')}
                      size="small"
                    />
                  )}
                />
              </Col>
              <Col span={8}>
                <Controller
                  name={`attendees.${index}.email`}
                  control={control}
                  render={({ field }) => (
                    <Input 
                      {...field} 
                      placeholder={T('Email')}
                      size="small"
                    />
                  )}
                />
              </Col>
              <Col span={6}>
                <Controller
                  name={`attendees.${index}.role`}
                  control={control}
                  render={({ field }) => (
                    <Select 
                      {...field} 
                      size="small"
                      style={{ width: '100%' }}
                    >
                      <Option value="secretary">{T('Secretary')}</Option>
                      <Option value="executive">{T('Executive')}</Option>
                      <Option value="viewer">{T('Viewer')}</Option>
                    </Select>
                  )}
                />
              </Col>
              <Col span={2}>
                {index > 0 && (
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => removeAttendee(index)}
                    size="small"
                  />
                )}
              </Col>
            </Row>
          ))}
        </div>

        <Divider />

        {/* Agenda Section */}
        <div>
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Title level={5} style={{ margin: 0 }}>{T('Agenda Items')}</Title>
            <Button 
              type="dashed" 
              icon={<PlusOutlined />} 
              onClick={addAgendaItem}
              size="small"
            >
              {T('Add Item')}
            </Button>
          </Row>

          {watchedAgenda.map((item, index) => (
            <AgendaItem key={index}>
              <Row gutter={8} align="middle">
                <Col span={12}>
                  <Controller
                    name={`agenda.${index}.title`}
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        placeholder={T('Agenda item title')}
                        size="small"
                      />
                    )}
                  />
                </Col>
                <Col span={4}>
                  <Controller
                    name={`agenda.${index}.duration`}
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        type="number"
                        placeholder={T('Minutes')}
                        size="small"
                        addonAfter="min"
                      />
                    )}
                  />
                </Col>
                <Col span={6}>
                  <Controller
                    name={`agenda.${index}.owner`}
                    control={control}
                    render={({ field }) => (
                      <Input 
                        {...field} 
                        placeholder={T('Owner')}
                        size="small"
                      />
                    )}
                  />
                </Col>
                <Col span={2}>
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => removeAgendaItem(index)}
                    size="small"
                  />
                </Col>
              </Row>
            </AgendaItem>
          ))}
        </div>

        {/* Presentation Upload */}
        <Divider />
        <Form.Item label={T('Presentation Materials')}>
          <Upload
            multiple
            listType="text"
            beforeUpload={() => false} // Prevent auto upload
          >
            <Button icon={<UploadOutlined />}>{T('Upload Files')}</Button>
          </Upload>
          <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
            {T('Supported formats: PDF, PPT, PPTX, DOC, DOCX (Max 10MB each)')}
          </Text>
        </Form.Item>
      </Form>
    </StyledModal>
  );
};