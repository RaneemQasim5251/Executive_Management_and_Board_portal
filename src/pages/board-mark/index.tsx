import { FC, useEffect, useMemo, useState } from 'react';
import { Card, Form, Input, DatePicker, Button, Space, Typography, Row, Col, Table, Tag, Modal, message, Select, Alert } from 'antd';
import arEG from 'antd/es/date-picker/locale/ar_EG';
import { FilePdfOutlined, SendOutlined, SafetyCertificateOutlined, BarcodeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import updateLocale from 'dayjs/plugin/updateLocale';
import { boardMarkService } from '../../services/boardMarkService';
import { BoardResolution, CreateResolutionInput } from '../../types/boardMark';
import { generateResolutionPDF } from '../../utils/pdf';
// Supabase invokes are disabled during local fallback to avoid 404s
// import { supabase } from '../../supabase';
// import { notificationService } from '../../services/notificationService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const DABAJA_AR = 'محضر مجلس الإدارة: بناءً على الصلاحيات المخولة للمجلس ووفقاً للأنظمة واللوائح المعمول بها، تم اتخاذ القرار التالي:';
const DABAJA_EN = 'Board Minutes: Under the authority vested in the Board and in accordance with applicable laws and regulations, the following resolution was adopted:';
// const PREAMBLE_AR = 'تمت مناقشة الموضوع واتخاذ القرار التالي:';
// const PREAMBLE_EN = 'The matter was discussed and the Board resolved as follows:';

export const BoardMarkPage: FC = () => {
  const { i18n, t } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [form] = Form.useForm<CreateResolutionInput>();
  const [resolutions, setResolutions] = useState<BoardResolution[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewPdf, setPreviewPdf] = useState<string | null>(null);
  const [previewResolution, setPreviewResolution] = useState<BoardResolution | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await boardMarkService.listResolutions();
      setResolutions(data);
    } catch (e) {
      // ignore for now
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Ensure Dayjs uses proper locale and short weekday labels in Arabic to avoid header overlap
  useEffect(() => {
    dayjs.extend(updateLocale);
    if (isAr) {
      dayjs.updateLocale('ar', {
        // Short two/three-letter labels prevent overlap in DatePicker header
        weekdaysMin: ['أح', 'إث', 'ثل', 'أر', 'خ', 'جم', 'سب']
      });
      dayjs.locale('ar');
    } else {
      dayjs.locale('en');
    }
  }, [isAr]);

  const columns = useMemo(() => [
    {
      title: isAr ? 'المرجع' : 'Reference',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: isAr ? 'تاريخ الاجتماع' : 'Meeting Date',
      dataIndex: 'meetingDate',
      key: 'meetingDate',
      render: (d: string) => new Date(d).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')
    },
    {
      title: isAr ? 'الحالة' : 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => {
        const color = s === 'finalized' ? 'green' : s === 'expired' ? 'red' : s === 'awaiting_signatures' ? 'blue' : 'default';
        const labelMap: Record<string, string> = {
          finalized: isAr ? 'نهائي' : 'Finalized',
          expired: isAr ? 'انتهى الوقت' : 'Expired',
          awaiting_signatures: isAr ? 'بانتظار التوقيعات' : 'Awaiting Signatures',
          draft: isAr ? 'مسودة' : 'Draft',
        };
        return <Tag color={color}>{labelMap[s] || s}</Tag>;
      }
    },
    {
      title: isAr ? 'الموقعون' : 'Signatories',
      dataIndex: 'signatories',
      key: 'signatories',
      render: (signatories: any[]) => (
        <div>
          {signatories?.map((s: any) => (
            <div key={s.id} style={{ marginBottom: 4 }}>
              <Tag color={s.signedAt ? (s.decision === 'approved' ? 'green' : 'red') : 'default'}>
                {s.name}: {s.signedAt ? (s.decision === 'approved' ? '✅' : '❌') : '⏳'}
              </Tag>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: isAr ? 'الموعد النهائي' : 'Deadline',
      dataIndex: 'deadlineAt',
      key: 'deadlineAt',
      render: (d: string, r: BoardResolution) => {
        const overdue = new Date(d).getTime() < Date.now() && r.status !== 'finalized';
        return <span style={{ color: overdue ? '#ff4d4f' : undefined }}>{new Date(d).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</span>;
      }
    },
    {
      title: isAr ? 'إجراءات' : 'Actions',
      key: 'actions',
      render: (_: any, r: BoardResolution) => (
        <Space>
          <Button size="small" icon={<FilePdfOutlined />} onClick={() => handlePreview(r)}>
            {isAr ? 'عرض' : 'Preview'}
          </Button>
          {r.status === 'awaiting_signatures' && (
            <Button size="small" type="primary" icon={<SendOutlined />} onClick={() => handleRemind(r.id)}>
              {isAr ? 'تذكير' : 'Remind'}
            </Button>
          )}
        </Space>
      )
    }
  ], [isAr]);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const md = values.meetingDate;
      const meetingDateIso = (md && (dayjs as any).isDayjs?.(md)) ? (md as any).toDate().toISOString() : new Date(md).toISOString();
      const payload: CreateResolutionInput = {
        meetingDate: meetingDateIso,
        agreementDetails: values.agreementDetails,
        deadlineDays: values.deadlineDays,
        meetingLocation: values.meetingLocation,
        presidentName: values.presidentName,
        attendees: values.attendees,
        absentees: values.absentees,
        sessionNumberOverride: values.sessionNumberOverride,
        fiscalYearOverride: values.fiscalYearOverride,
        gregOverride: values.gregOverride,
        hijriOverride: values.hijriOverride,
        timeOverride: values.timeOverride,
      };
      setLoading(true);
      await boardMarkService.createResolution(payload);

      message.success(t('board_mark.messages.createSuccess'));
      form.resetFields();
      await load();
    } catch (e) {
      // validation error or server error
    } finally {
      setLoading(false);
    }
  };

  const handleRemind = async (id: string) => {
    try {
      await boardMarkService.requestSignatures(id);
      message.success(isAr ? 'تم إرسال التذكير للموقعين' : 'Reminder sent to signatories');
    } catch (e) {
      message.error(isAr ? 'تعذر إرسال التذكير' : 'Failed to send reminder');
    }
  };

  const handlePreview = async (r: BoardResolution) => {
    // Force Arabic rasterization to ensure Arabic text renders reliably
    const url = await generateResolutionPDF(r, 'ar');
    setPreviewPdf(url);
    setPreviewResolution(r);
  };

  const arPickerLocale = useMemo(() => (
    isAr ? { ...arEG, shortWeekDays: ['أح','إث','ثل','أر','خ','جم','سب'] } : undefined
  ), [isAr]);

  return (
    <div className="board-mark-page" style={{ padding: 24 }}>
      {isAr && (
        <style>
          {`
            /* Prevent weekday header overlap in Arabic DatePicker */
            .ar-datepicker-fix .ant-picker-content table { table-layout: fixed; width: 100%; }
            .ar-datepicker-fix .ant-picker-content th { font-size: 12px; padding: 0 4px; white-space: nowrap; text-align: center; }
            .ar-datepicker-fix .ant-picker-content th span { display: inline-block; }
          `}
        </style>
      )}
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card className="executive-card">
            <Row align="middle" justify="space-between">
              <Col>
                <Space align="center">
                  <SafetyCertificateOutlined style={{ color: 'var(--primary-color)' }} />
                  <Title level={3} style={{ margin: 0 }}>
                    {isAr ? 'توقيع المجلس - قرارات مجلس الإدارة' : 'Board Mark - Board Resolutions'}
                  </Title>
                </Space>
              </Col>
              <Col>
                <Tag color="blue"><BarcodeOutlined /> {isAr ? 'توثيق آمن' : 'Secure Documentation'}</Tag>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title={isAr ? 'إنشاء قرار جديد' : 'Create New Resolution'} className="executive-card">
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
              message={isAr ? 'ديباجة ثابتة' : 'Fixed Preamble'}
              description={isAr ? DABAJA_AR : DABAJA_EN}
            />
            <Form form={form} layout="vertical" disabled={loading} initialValues={{ meetingDate: dayjs(), deadlineDays: 7 }}>
              <Form.Item name="meetingDate" label={isAr ? 'تاريخ الاجتماع' : 'Meeting Date'} rules={[{ required: true }]}> 
                <DatePicker 
                  style={{ width: '100%' }} 
                  locale={arPickerLocale}
                  popupClassName={isAr ? 'ar-datepicker-fix' : undefined}
                />
              </Form.Item>
              {/* Secretary-fillable placeholders */}
              <Form.Item name="meetingLocation" label={isAr ? 'المكان/المدينة' : 'Location/City'}>
                <Input placeholder={isAr ? 'مثال: الرياض - المقر الرئيسي' : 'e.g., Riyadh - HQ'} />
              </Form.Item>
              <Form.Item name="presidentName" label={isAr ? 'اسم رئيس الجلسة' : 'Session President Name'}>
                <Input placeholder={isAr ? 'اسم الرئيس' : 'President name'} />
              </Form.Item>
              <Form.Item name="attendees" label={isAr ? 'أسماء الحضور' : 'Attendees Names'}>
                <TextArea rows={3} placeholder={isAr ? 'اكتب أسماء الحضور مفصولة بفواصل' : 'Comma-separated attendees'} />
              </Form.Item>
              <Form.Item name="absentees" label={isAr ? 'الاعتذار/الغياب' : 'Absent / Excused'}>
                <TextArea rows={2} placeholder={isAr ? 'إن وجد' : 'If any'} />
              </Form.Item>
              {/* Optional overrides for auto fields */}
              <Form.Item name="sessionNumberOverride" label={isAr ? 'رقم الجلسة (اختياري)' : 'Session Number (optional)'}>
                <Input placeholder={isAr ? 'اتركه فارغًا للتوليد التلقائي' : 'Leave empty for auto'} />
              </Form.Item>
              <Form.Item name="fiscalYearOverride" label={isAr ? 'السنة المالية (اختياري)' : 'Fiscal Year (optional)'}>
                <Input placeholder={isAr ? 'اتركه فارغًا للتوليد التلقائي' : 'Leave empty for auto'} />
              </Form.Item>
              <Form.Item name="gregOverride" label={isAr ? 'التاريخ الميلادي (اختياري)' : 'Gregorian Date (optional)'}>
                <Input placeholder={isAr ? 'اتركه فارغًا للتوليد التلقائي' : 'Leave empty for auto'} />
              </Form.Item>
              <Form.Item name="hijriOverride" label={isAr ? 'التاريخ الهجري (اختياري)' : 'Hijri Date (optional)'}>
                <Input placeholder={isAr ? 'اتركه فارغًا للتوليد التلقائي' : 'Leave empty for auto'} />
              </Form.Item>
              <Form.Item name="timeOverride" label={isAr ? 'الوقت (اختياري)' : 'Time (optional)'}>
                <Input placeholder={isAr ? 'اتركه فارغًا للتوليد التلقائي' : 'Leave empty for auto'} />
              </Form.Item>
              <Form.Item name="agreementDetails" label={isAr ? 'التفاصيل المتفق عليها' : 'Agreement Details'} rules={[{ required: true, min: 5 }]}> 
                <TextArea rows={6} placeholder={isAr ? 'اكتب تفاصيل القرار هنا' : 'Write resolution details here'} />
              </Form.Item>
              <Form.Item name="deadlineDays" label={isAr ? 'المهلة (أيام)' : 'Deadline (days)'}>
                <Select options={[7, 10, 14].map(v => ({ value: v, label: v }))} />
              </Form.Item>
              <Space>
                <Button type="primary" icon={<SendOutlined />} onClick={handleCreate}>{isAr ? 'حفظ وإرسال للتوقيع' : 'Save & Request Signatures'}</Button>
              </Space>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card title={isAr ? 'القرارات' : 'Resolutions'} className="executive-card">
            <Table
              loading={loading}
              dataSource={Array.isArray(resolutions) ? resolutions : []}
              rowKey="id"
              columns={columns as any}
              pagination={{ pageSize: 10 }}
              size="middle"
              className="resolutions-table"
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={isAr ? 'معاينة PDF' : 'PDF Preview'}
        open={!!previewPdf}
        onCancel={() => setPreviewPdf(null)}
        width={900}
        footer={null}
      >
        {previewPdf && (
          <>
            <iframe title="pdf-preview" src={previewPdf} style={{ width: '100%', height: 700, border: 'none' }} />
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">{isAr ? 'إذا لم يظهر ملف PDF أعلاه، افتحه في نافذة جديدة.' : 'If the PDF does not appear above, open it in a new tab.'}</Text>
              <Button type="primary" onClick={() => window.open(previewPdf, '_blank')}>{isAr ? 'فتح في نافذة جديدة' : 'Open in new tab'}</Button>
            </div>
          </>
        )}
        {previewResolution && previewResolution.status !== 'finalized' && (
          <Alert style={{ marginTop: 12 }} type="warning" showIcon message={isAr ? 'هذه نسخة أولية قبل التوقيع النهائي' : 'This is a preliminary copy before final signatures'} />
        )}
      </Modal>
    </div>
  );
};

export default BoardMarkPage;


