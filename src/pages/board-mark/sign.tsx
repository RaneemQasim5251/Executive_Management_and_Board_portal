import { FC, useEffect, useState } from 'react';
import { Card, Typography, Space, Button, Input, Form, message, Alert, Row, Col, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { boardMarkService } from '../../services/boardMarkService';
import { BoardResolution } from '../../types/boardMark';
import { SafetyCertificateOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const BoardMarkSignPage: FC = () => {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [form] = Form.useForm();
  const [res, setRes] = useState<BoardResolution | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const r = await boardMarkService.getResolution(id);
      setRes(r);
    };
    load();
  }, [id]);

  const handleSign = async () => {
    try {
      const values = await form.validateFields();
      if (!id) return;
      setLoading(true);
      await boardMarkService.sign({
        resolutionId: id,
        signatoryId: values.signatoryId,
        otp: values.otp,
      });
      message.success(isAr ? 'تم التوقيع بنجاح' : 'Signed successfully');
      const r = await boardMarkService.getResolution(id);
      setRes(r);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card className="executive-card">
        <Space align="center">
          <SafetyCertificateOutlined style={{ color: 'var(--primary-color)' }} />
          <Title level={3} style={{ margin: 0 }}>
            {isAr ? 'توقيع القرار' : 'Sign Resolution'}
          </Title>
        </Space>
      </Card>

      <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title={isAr ? 'القرار' : 'Resolution'} className="executive-card">
            {res ? (
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong>{isAr ? 'المعرف:' : 'ID:'} {res.id}</Text>
                <Text>{isAr ? res.preambleAr : res.preambleEn}</Text>
                <Text>{res.agreementDetails}</Text>
                <div>
                  <Text strong>{isAr ? 'الموقعون' : 'Signatories'}:</Text>
                  <div style={{ marginTop: 8 }}>
                    {res.signatories.map(s => (
                      <div key={s.id} style={{ marginBottom: 6 }}>
                        <Tag color={s.signedAt ? 'green' : 'default'}>
                          {s.name} {s.signedAt && <CheckCircleOutlined />}
                        </Tag>
                      </div>
                    ))}
                  </div>
                </div>
              </Space>
            ) : (
              <Alert type="info" showIcon message={isAr ? 'جاري التحميل...' : 'Loading...'} />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={isAr ? 'نموذج التوقيع' : 'Signature Form'} className="executive-card">
            <Alert type="warning" showIcon style={{ marginBottom: 12 }} message={isAr ? 'لحماية إضافية، أدخل رمز OTP إذا طُلب' : 'For extra security, enter OTP if requested'} />
            <Form form={form} layout="vertical" disabled={loading}>
              <Form.Item name="signatoryId" label={isAr ? 'معرف العضو' : 'Member ID'} rules={[{ required: true }]}> 
                <Input placeholder={isAr ? 'أدخل معرفك' : 'Enter your ID'} />
              </Form.Item>
              <Form.Item name="otp" label="OTP"> 
                <Input placeholder="123456" />
              </Form.Item>
              <Button type="primary" onClick={handleSign}>{isAr ? 'توقيع' : 'Sign'}</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BoardMarkSignPage;


