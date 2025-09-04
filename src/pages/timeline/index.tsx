import { FC, useState } from "react";
import { Card, Typography, Tag, Button, Space, Avatar, Tooltip, Modal, Input, Upload } from "antd";
import { 
  CalendarOutlined, 
  TeamOutlined, 
  CommentOutlined,
  PaperClipOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Executive Timeline Data - Strategic Initiatives & Board Milestones
const timelineData = [
  {
    id: 1,
    title: "Digital Transformation Initiative Launch",
    description: "Board-approved company-wide digital transformation program with focus on AI integration and process automation. Strategic investment of $2.5M approved.",
    date: "2024-01-15",
    status: "completed",
    type: "strategic-initiative",
    stakeholders: ["CEO", "CTO", "Board of Directors"],
    comments: 12,
    attachments: 5,
    priority: "critical",
    boardApproval: true,
    budget: "$2.5M"
  },
  {
    id: 2,
    title: "Q1 Board Meeting - Strategic Review",
    description: "Quarterly board meeting: 23% revenue growth approved, strategic initiatives reviewed, and market expansion strategy finalized for APAC region.",
    date: "2024-03-20",
    status: "completed",
    type: "board-meeting",
    stakeholders: ["Board of Directors", "C-Suite Leadership"],
    comments: 8,
    attachments: 15,
    priority: "critical",
    boardApproval: true,
    outcomes: ["Revenue targets exceeded", "APAC expansion approved", "Digital roadmap confirmed"]
  },
  {
    id: 3,
    title: "Market Expansion - APAC Region",
    description: "Official launch of operations in Asia-Pacific region with new offices in Singapore and Tokyo.",
    date: "2024-05-10",
    status: "in-progress",
    type: "project",
    stakeholders: ["CEO", "COO", "Regional VPs"],
    comments: 24,
    attachments: 8,
    priority: "high"
  },
  {
    id: 4,
    title: "AI-Powered Product Suite Release",
    description: "Launch of next-generation AI-powered products targeting enterprise customers.",
    date: "2024-07-30",
    status: "upcoming",
    type: "product",
    stakeholders: ["CTO", "CPO", "Engineering"],
    comments: 6,
    attachments: 12,
    priority: "high"
  },
  {
    id: 5,
    title: "Sustainability Goals Milestone",
    description: "Achievement of 50% carbon footprint reduction and implementation of green technology initiatives.",
    date: "2024-09-15",
    status: "upcoming",
    type: "milestone",
    stakeholders: ["CEO", "CSO", "Operations"],
    comments: 3,
    attachments: 4,
    priority: "medium"
  },
  {
    id: 6,
    title: "Annual Strategic Planning Session",
    description: "Executive retreat for 2025 strategic planning, budget allocation, and long-term vision setting.",
    date: "2024-11-20",
    status: "upcoming",
    type: "planning",
    stakeholders: ["All C-Suite", "Board"],
    comments: 0,
    attachments: 2,
    priority: "critical"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "#10b981";
    case "in-progress": return "#f59e0b";
    case "upcoming": return "#3b82f6";
    default: return "#6b7280";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircleOutlined />;
    case "in-progress": return <ClockCircleOutlined />;
    case "upcoming": return <ExclamationCircleOutlined />;
    default: return <ClockCircleOutlined />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical": return "#ef4444";
    case "high": return "#f59e0b";
    case "medium": return "#3b82f6";
    case "low": return "#10b981";
    default: return "#6b7280";
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export const TimelinePage: FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const isRTL = i18n.language?.toLowerCase().startsWith('ar');

  const isArabic = isRTL;
  const T = (key: string) => {
    const map: Record<string, string> = {
      // Titles
      'Digital Transformation Initiative Launch': 'إطلاق مبادرة التحول الرقمي',
      'Q1 Board Meeting - Strategic Review': 'اجتماع مجلس الإدارة للربع الأول – مراجعة استراتيجية',
      'Market Expansion - APAC Region': 'التوسع في السوق – منطقة آسيا والمحيط الهادئ',
      'AI-Powered Product Suite Release': 'إطلاق حزمة منتجات مدعومة بالذكاء الاصطناعي',
      'Sustainability Goals Milestone': 'إنجاز أهداف الاستدامة',
      'Annual Strategic Planning Session': 'جلسة التخطيط الاستراتيجي السنوية',

      // Descriptions
      'Board-approved company-wide digital transformation program with focus on AI integration and process automation. Strategic investment of $2.5M approved.': 'برنامج تحول رقمي على مستوى الشركة مع التركيز على دمج الذكاء الاصطناعي وأتمتة العمليات. تمت الموافقة على استثمار استراتيجي بقيمة 2.5 مليون دولار.',
      'Quarterly board meeting: 23% revenue growth approved, strategic initiatives reviewed, and market expansion strategy finalized for APAC region.': 'اجتماع مجلس الإدارة ربع السنوي: تمت الموافقة على نمو الإيرادات بنسبة 23%، ومراجعة المبادرات الاستراتيجية، واعتماد استراتيجية التوسع في منطقة آسيا والمحيط الهادئ.',
      'Official launch of operations in Asia-Pacific region with new offices in Singapore and Tokyo.': 'الإطلاق الرسمي للعمليات في منطقة آسيا والمحيط الهادئ مع افتتاح مكاتب جديدة في سنغافورة وطوكيو.',
      'Launch of next-generation AI-powered products targeting enterprise customers.': 'إطلاق الجيل الجديد من المنتجات المدعومة بالذكاء الاصطناعي والموجهة لعملاء المؤسسات.',
      'Achievement of 50% carbon footprint reduction and implementation of green technology initiatives.': 'تحقيق خفض بنسبة 50% في البصمة الكربونية وتنفيذ مبادرات التكنولوجيا الخضراء.',
      'Executive retreat for 2025 strategic planning, budget allocation, and long-term vision setting.': 'ملتقى تنفيذي للتخطيط الاستراتيجي لعام 2025 وتخصيص الميزانية ووضع الرؤية طويلة المدى.',

      // Dates
      'Q1 2024': 'الربع الأول 2024',
      'Q2 2024': 'الربع الثاني 2024',
      'Q3 2024': 'الربع الثالث 2024',
      'Q4 2024': 'الربع الرابع 2024',

      // Types
      'strategic-initiative': 'مبادرة استراتيجية',
      'board-meeting': 'اجتماع مجلس الإدارة',
      'project': 'مشروع',
      'product': 'منتج',
      'milestone': 'معلَم',
      'planning': 'تخطيط',

      // Stakeholders & Labels
      'CEO': 'المدير التنفيذي',
      'CTO': 'المدير التقني',
      'CPO': 'مدير المنتج',
      'COO': 'المدير التشغيلي',
      'CSO': 'مسؤول الاستدامة',
      'Engineering': 'الهندسة',
      'Board of Directors': 'مجلس الإدارة',
      'C-Suite Leadership': 'القيادة التنفيذية',
      'Regional VPs': 'نواب الرؤساء الإقليميون',
      'All C-Suite': 'جميع أعضاء الإدارة التنفيذية',
      'STAKEHOLDERS': 'أصحاب المصلحة',

      // Header
      'Strategic Timeline': 'الجدول الزمني الاستراتيجي',
      'Board-level milestones and strategic initiatives roadmap': 'محطات على مستوى مجلس الإدارة وخارطة طريق المبادرات الاستراتيجية',

      // Summary chips and counts
      'Completed': 'مكتمل',
      'Active': 'نشِط',
      'Upcoming': 'قادمة',

      // Categories/labels
      'strategic': 'استراتيجي',
      'operational': 'تشغيلي',
      'innovation': 'ابتكار',
      'partnership': 'شراكة',
      'UPCOMING': 'قادمة',
      'Key Outcomes:': 'النتائج الرئيسية:',

      // Meta sections
      'Timeline': 'الجدول الزمني',
      'Budget': 'الميزانية',
      'Priority': 'الأولوية',
      'HIGH': 'عالٍ',
      'MEDIUM': 'متوسط',
      'LOW': 'منخفض',

      // Team
      'Team Members:': 'أعضاء الفريق:',
      'meeting': 'اجتماع',
      'financial': 'مالي',
      'project': 'مشروع',
    };
    return isArabic && map[key] ? map[key] : t(key);
  };

  // Timeline data with translation and Arabic fallbacks
  const timelineData = [
    {
      id: 1,
      title: T("Digital Transformation Initiative Launch"),
      description: T("Board-approved company-wide digital transformation program with focus on AI integration and process automation. Strategic investment of $2.5M approved."),
      date: T("Q1 2024"),
      status: "completed",
      type: T("strategic-initiative"),
      stakeholders: [T("CEO"), T("CTO"), T("Board of Directors")],
      comments: 12,
      attachments: 5,
      priority: isArabic ? 'حرِج' : 'critical',
      boardApproval: true,
      budget: "$2.5M"
    },
    {
      id: 2,
      title: T("Q1 Board Meeting - Strategic Review"),
      description: T("Quarterly board meeting: 23% revenue growth approved, strategic initiatives reviewed, and market expansion strategy finalized for APAC region."),
      date: T("Q1 2024"),
      status: "completed",
      type: T("board-meeting"),
      stakeholders: [T("Board of Directors"), T("C-Suite Leadership")],
      comments: 8,
      attachments: 15,
      priority: isArabic ? 'حرِج' : 'critical',
      boardApproval: true,
      outcomes: [t("Revenue targets exceeded"), t("APAC expansion approved"), t("Digital roadmap confirmed")]
    },
    {
      id: 3,
      title: T("Market Expansion - APAC Region"),
      description: T("Official launch of operations in Asia-Pacific region with new offices in Singapore and Tokyo."),
      date: T("Q2 2024"),
      status: "in-progress",
      type: T("project"),
      stakeholders: [T("CEO"), T("COO"), T("Regional VPs")],
      comments: 24,
      attachments: 8,
      priority: isArabic ? 'عالٍ' : 'high'
    },
    {
      id: 4,
      title: T("AI-Powered Product Suite Release"),
      description: T("Launch of next-generation AI-powered products targeting enterprise customers."),
      date: T("Q3 2024"),
      status: "upcoming",
      type: T("product"),
      stakeholders: [T("CTO"), T("CPO"), T("Engineering")],
      comments: 6,
      attachments: 12,
      priority: isArabic ? 'عالٍ' : 'high'
    },
    {
      id: 5,
      title: T("Sustainability Goals Milestone"),
      description: T("Achievement of 50% carbon footprint reduction and implementation of green technology initiatives."),
      date: T("Q3 2024"),
      status: "upcoming",
      type: T("milestone"),
      stakeholders: [T("CEO"), T("CSO"), T("Operations")],
      comments: 3,
      attachments: 4,
      priority: isArabic ? 'متوسط' : 'medium'
    },
    {
      id: 6,
      title: T("Annual Strategic Planning Session"),
      description: T("Executive retreat for 2025 strategic planning, budget allocation, and long-term vision setting."),
      date: T("Q4 2024"),
      status: "upcoming",
      type: T("planning"),
      stakeholders: [T("All C-Suite"), T("Board")],
      comments: 0,
      attachments: 2,
      priority: isArabic ? 'حرِج' : 'critical'
    }
  ];

  const handleAddComment = () => {
    // In real app, this would save to backend
    console.log("Adding comment:", newComment);
    setNewComment("");
    setCommentModalVisible(false);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh", direction: isRTL ? 'rtl' : 'ltr', fontFamily: isRTL ? "'Noto Sans Arabic', 'Cairo', 'Amiri', system-ui, -apple-system, sans-serif" : "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* Beautiful Header with Gradient */}
      <motion.div variants={itemVariants} className="executive-header">
        <Title level={2} style={{ color: "white", margin: 0 }}>
          🚀 {t("Strategic Timeline")}
        </Title>
        <Text style={{ color: "rgba(255, 255, 255, 0.9)" }}>
          {t("Board-level milestones and strategic initiatives roadmap")}
        </Text>
      </motion.div>

      {/* Timeline Container with Beautiful Gradient Line */}
      <div className="timeline-container" style={{ position: "relative", padding: "48px 0" }}>
        {/* Gradient Timeline Line (Dark Blue → Light Blue) */}
        <div 
          className="timeline-line"
          style={{
            position: "absolute",
            left: "50%",
            top: "0",
            bottom: "0",
            width: "6px",
            background: "#0C085C",
            transform: "translateX(-50%)",
            borderRadius: "3px",
            boxShadow: "0 0 20px rgba(30, 58, 138, 0.3)",
          }}
        />

        {/* Timeline Items */}
        {timelineData.map((item, index) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="timeline-item"
            style={{
              position: "relative",
              marginBottom: "48px",
              padding: "0 32px",
            }}
          >
            {/* Timeline Marker with Gradient */}
            <div
              className="timeline-marker"
              style={{
                position: "absolute",
                left: "50%",
                top: "24px",
                width: "20px",
                height: "20px",
                background: getStatusColor(item.status),
                border: "4px solid white",
                borderRadius: "50%",
                transform: "translateX(-50%)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "10px",
              }}
            >
              {getStatusIcon(item.status)}
            </div>

            {/* Timeline Content - Alternating Sides */}
            <div
              className="timeline-content"
              style={{
                [index % 2 === 0 ? "marginRight" : "marginLeft"]: "50%",
                [index % 2 === 0 ? "paddingRight" : "paddingLeft"]: "40px",
                [index % 2 === 0 ? "textAlign" : "textAlign"]: index % 2 === 0 ? (isRTL ? "left" : "right") : (isRTL ? "right" : "left"),
              }}
            >
              <Card
                className="executive-card"
                style={{
                  background: "white",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                  border: "1px solid #e5e7eb",
                  transition: "all 0.3s ease",
                }}
                hoverable
                onClick={() => setSelectedItem(item)}
              >
                {/* Card Header */}
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <Tag color={getPriorityColor(item.priority)} style={{ textTransform: "uppercase", fontWeight: 600 }}>
                      {item.priority}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      <CalendarOutlined style={{ marginRight: "4px" }} />
                      {item.date}
                    </Text>
                  </div>
                  <Title level={4} style={{ margin: 0, color: "#1e3a8a" }}>
                    {item.title}
                  </Title>
                </div>

                {/* Card Body */}
                <Paragraph style={{ color: "#6b7280", marginBottom: "16px" }}>
                  {item.description}
                </Paragraph>

                {/* Status and Type */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                  <Tag color={getStatusColor(item.status)} icon={getStatusIcon(item.status)}>
                    {isArabic ? (item.status === 'completed' ? 'مكتمل' : item.status === 'in-progress' ? 'قيد التنفيذ' : 'قادمة') : t(item.status.replace("-", " ").toLowerCase())}
                  </Tag>
                  <Tag color="blue">
                    {isArabic ? T(String(item.type)) : String(item.type)}
                  </Tag>
                </div>

                {/* Stakeholders */}
                <div style={{ marginBottom: "16px" }}>
                  <Text type="secondary" style={{ fontSize: "12px", display: "block", marginBottom: "8px" }}>
                    <TeamOutlined style={{ marginRight: "4px" }} />
                    {t("STAKEHOLDERS")}
                  </Text>
                  <Avatar.Group max={{ count: 3 }} size="small">
                    {item.stakeholders.map((stakeholder, idx) => (
                      <Tooltip key={idx} title={stakeholder}>
                        <Avatar 
                          size="small" 
                          style={{ 
                            background: "#0C085C",
                            fontSize: "10px"
                          }}
                        >
                          {stakeholder.charAt(0)}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </Avatar.Group>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Space size="small">
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<CommentOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                        setCommentModalVisible(true);
                      }}
                    >
                      {item.comments}
                    </Button>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<PaperClipOutlined />}
                    >
                      {item.attachments}
                    </Button>
                  </Space>
                  <Button 
                    type="primary" 
                    size="small"
                    style={{ 
                      background: "#0C085C",
                      border: "none"
                    }}
                  >
                    {t("View Details")}
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comment Modal */}
      <Modal
        title={
          <div>
            <CommentOutlined style={{ marginRight: "8px", color: "#1e3a8a" }} />
            {t("Add Executive Comment")}
          </div>
        }
        open={commentModalVisible}
        onOk={handleAddComment}
        onCancel={() => setCommentModalVisible(false)}
        okText={t("Add Comment")}
        okButtonProps={{
          style: {
            background: "#0C085C",
            border: "none"
          }
        }}
      >
        {selectedItem && (
          <div style={{ marginBottom: "16px" }}>
            <Text strong>{selectedItem.title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {selectedItem.date}
            </Text>
          </div>
        )}
        <TextArea
          rows={4}
          placeholder={t("Add your executive comment or strategic insight...")}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ marginBottom: "16px" }}
        />
        <Upload
          multiple
          showUploadList={true}
          beforeUpload={(file) => {
            const isValidType = file.type === 'application/pdf' || 
                              file.type.startsWith('image/') ||
                              file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                              file.type === 'application/msword';
            if (!isValidType) {
              console.error('Only PDF, images, and Word documents are allowed');
              return false;
            }
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
              console.error('File must be smaller than 10MB');
              return false;
            }
            console.log(`${file.name} attached successfully`);
            return false; // Prevent actual upload in demo mode
          }}
          accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx"
        >
          <Button icon={<PaperClipOutlined />} type="dashed" block>
            {t("Attach Documents")} (PDF, Images, Word - Max 10MB)
          </Button>
        </Upload>
      </Modal>
    </motion.div>
  );
};