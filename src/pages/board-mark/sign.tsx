import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, Typography, message, Spin, Radio } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { boardMarkService } from "../../services/boardMarkService";
import { BoardResolution } from "../../types/boardMark";
import { useTranslation } from "react-i18next";
import { supabase } from "../../supabase"; // Import supabase client

const { Title, Text } = Typography;

const SignResolutionPage: React.FC = () => {
  const { id: resolutionId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const signatoryId = searchParams.get("sid");
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [resolution, setResolution] = useState<BoardResolution | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [decision, setDecision] = useState<'approved' | 'rejected'>('approved');

  useEffect(() => {
    const fetchResolution = async () => {
      if (!resolutionId || !signatoryId || !token) {
        message.error(t("board_mark.sign.error.missingParams"));
        setLoading(false);
        return;
      }
      try {
        const fetchedResolution = await boardMarkService.getResolution(resolutionId);
        setResolution(fetchedResolution);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch resolution:", error);
        message.error(t("board_mark.sign.error.fetchFailed"));
        setLoading(false);
      }
    };
    fetchResolution();
  }, [resolutionId, signatoryId, token, t]);

  const handleSign = async (values: { otp: string; reason?: string }) => {
    if (!resolutionId || !signatoryId || !token || !supabase) {
      message.error(t("board_mark.sign.error.internalError"));
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('sign', {
        body: {
          resolutionId,
          signatoryId,
          token,
          otp: values.otp,
          decision,
          reason: values.reason,
        },
      });

      if (error) {
        console.error("Error from Supabase function:", error);
        message.error(t(`board_mark.sign.error.${error.message.replace(/ /g, '')}`) || t("board_mark.sign.error.generic"));
        setSubmitting(false);
        return;
      }

      message.success(t("board_mark.sign.success.signed"));
      // Optionally refresh resolution details or navigate away
      navigate(`/board-mark`); // Redirect to dashboard or resolution list
    } catch (error) {
      console.error("Failed to sign resolution:", error);
      message.error(t("board_mark.sign.error.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <Spin tip={t("loading")}>
          <div style={{ height: 200 }} />
        </Spin>
      </Card>
    );
  }

  if (!resolution) {
    return (
      <Card>
        <Title level={4}>{t("board_mark.sign.title")}</Title>
        <Text type="danger">{t("board_mark.sign.error.notFound")}</Text>
      </Card>
    );
  }

  const currentSignatory = resolution.signatories.find(s => s.id === signatoryId);

  if (!currentSignatory) {
    return (
      <Card>
        <Title level={4}>{t("board_mark.sign.title")}</Title>
        <Text type="danger">{t("board_mark.sign.error.signatoryNotFound")}</Text>
      </Card>
    );
  }

  return (
    <Card>
      <Title level={4}>{t("board_mark.sign.title")}</Title>
      <Text>{t("board_mark.sign.instructions", { name: currentSignatory.name, resolutionId: resolution.id })}</Text>

      <Form form={form} layout="vertical" onFinish={handleSign} style={{ marginTop: 20 }}>
        <Form.Item
          name="otp"
          label={t("board_mark.sign.otpLabel")}
          rules={[{ required: true, message: t("board_mark.sign.otpRequired") }]}
        >
          <Input.Password placeholder={t("board_mark.sign.otpPlaceholder")} />
        </Form.Item>

        <Form.Item name="decision" label={t("board_mark.sign.decisionLabel")}>
          <Radio.Group onChange={(e) => setDecision(e.target.value as 'approved' | 'rejected')} value={decision}>
            <Radio value="approved">
              <CheckCircleOutlined style={{ color: "green" }} /> {t("board_mark.sign.approve")}
            </Radio>
            <Radio value="rejected">
              <CloseCircleOutlined style={{ color: "red" }} /> {t("board_mark.sign.reject")}
            </Radio>
          </Radio.Group>
        </Form.Item>

        {decision === 'rejected' && (
          <Form.Item
            name="reason"
            label={t("board_mark.sign.reasonLabel")}
            rules={[{ required: true, message: t("board_mark.sign.reasonRequired") }]}
          >
            <Input.TextArea rows={4} placeholder={t("board_mark.sign.reasonPlaceholder")} />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {t("board_mark.sign.submitButton")}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SignResolutionPage;


