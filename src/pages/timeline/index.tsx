import React, { useState } from "react";
import { Card, Typography, Tag, Button, Space, Avatar, Tooltip, Modal, Input, Upload } from "antd";
import { 
  CalendarOutlined, 
  TeamOutlined, 
  FileTextOutlined,
  PlusOutlined,
  CommentOutlined,
  PaperClipOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Timeline Data - Strategic Projects and Milestones
const timelineData = [
  {
    id: 1,
    title: "Digital Transformation Initiative Launch",
    description: "Kickoff of company-wide digital transformation program with focus on AI integration and process automation.",
    date: "2024-01-15",
    status: "completed",
    type: "milestone",
    stakeholders: ["CEO", "CTO", "Board"],
    comments: 12,
    attachments: 5,
    priority: "high"
  },
  {
    id: 2,
    title: "Q1 Board Meeting - Strategic Review",
    description: "Quarterly board meeting to review financial performance, strategic initiatives, and market positioning.",
    date: "2024-03-20",
    status: "completed",
    type: "meeting",
    stakeholders: ["Board", "C-Suite"],
    comments: 8,
    attachments: 15,
    priority: "critical"
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

export const TimelinePage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");

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
      style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh" }}
    >
      {/* Beautiful Header with Gradient */}
      <motion.div variants={itemVariants} className="executive-header">
        <Title level={2} style={{ color: "white", margin: 0 }}>
          🌊 Strategic Timeline
        </Title>
        <Text style={{ color: "rgba(255, 255, 255, 0.9)" }}>
          Executive milestones and strategic project roadmap
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
            background: "linear-gradient(to bottom, #1e3a8a 0%, #93c5fd 100%)",
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
                background: `linear-gradient(135deg, ${getStatusColor(item.status)} 0%, ${getStatusColor(item.status)}cc 100%)`,
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
                [index % 2 === 0 ? "textAlign" : "textAlign"]: index % 2 === 0 ? "right" : "left",
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
                      {dayjs(item.date).format("MMM DD, YYYY")}
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
                    {item.status.replace("-", " ").toUpperCase()}
                  </Tag>
                  <Tag color="blue">
                    {item.type.toUpperCase()}
                  </Tag>
                </div>

                {/* Stakeholders */}
                <div style={{ marginBottom: "16px" }}>
                  <Text type="secondary" style={{ fontSize: "12px", display: "block", marginBottom: "8px" }}>
                    <TeamOutlined style={{ marginRight: "4px" }} />
                    STAKEHOLDERS
                  </Text>
                  <Avatar.Group maxCount={3} size="small">
                    {item.stakeholders.map((stakeholder, idx) => (
                      <Tooltip key={idx} title={stakeholder}>
                        <Avatar 
                          size="small" 
                          style={{ 
                            background: `linear-gradient(135deg, #1e3a8a ${idx * 20}%, #3b82f6 ${100 - idx * 20}%)`,
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
                      background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                      border: "none"
                    }}
                  >
                    View Details
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
            Add Executive Comment
          </div>
        }
        open={commentModalVisible}
        onOk={handleAddComment}
        onCancel={() => setCommentModalVisible(false)}
        okText="Add Comment"
        okButtonProps={{
          style: {
            background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
            border: "none"
          }
        }}
      >
        {selectedItem && (
          <div style={{ marginBottom: "16px" }}>
            <Text strong>{selectedItem.title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {dayjs(selectedItem.date).format("MMMM DD, YYYY")}
            </Text>
          </div>
        )}
        
        <TextArea
          rows={4}
          placeholder="Add your executive comment or strategic insight..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ marginBottom: "16px" }}
        />
        
        <Upload
          multiple
          showUploadList={false}
          beforeUpload={() => false}
        >
          <Button icon={<PaperClipOutlined />} type="dashed" block>
            Attach Documents
          </Button>
        </Upload>
      </Modal>
    </motion.div>
  );
};