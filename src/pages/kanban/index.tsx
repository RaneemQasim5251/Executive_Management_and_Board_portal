import React, { useState } from "react";
import { Card, Typography, Tag, Avatar, Button, Space, Modal, Input, Select, Upload, Tooltip } from "antd";
import {
  PlusOutlined,
  CommentOutlined,
  PaperClipOutlined,
  TeamOutlined,
  CalendarOutlined,
  FlagOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Strategic Kanban Data - C-Level Tasks
const kanbanData = {
  "strategic-planning": {
    title: "Strategic Planning",
    color: "#1e3a8a",
    tasks: [
      {
        id: "sp-1",
        title: "2025 Vision & Strategy Document",
        description: "Develop comprehensive strategic vision and roadmap for 2025-2027",
        priority: "critical",
        assignees: ["CEO", "Strategy Team"],
        dueDate: "2024-08-15",
        comments: 8,
        attachments: 12,
        tags: ["Vision", "Strategy", "Planning"]
      },
      {
        id: "sp-2", 
        title: "Market Analysis - Emerging Technologies",
        description: "Deep dive analysis of AI, IoT, and blockchain market opportunities",
        priority: "high",
        assignees: ["CTO", "Research Team"],
        dueDate: "2024-07-30",
        comments: 5,
        attachments: 7,
        tags: ["Research", "Technology", "Market"]
      }
    ]
  },
  "in-execution": {
    title: "In Execution",
    color: "#f59e0b",
    tasks: [
      {
        id: "ie-1",
        title: "Digital Transformation Phase 2",
        description: "Implementation of AI-driven automation across core business processes",
        priority: "critical",
        assignees: ["CTO", "COO", "IT Team"],
        dueDate: "2024-09-30",
        comments: 24,
        attachments: 18,
        tags: ["Digital", "Automation", "AI"]
      },
      {
        id: "ie-2",
        title: "APAC Market Expansion",
        description: "Establish operations in Singapore, Tokyo, and Sydney markets",
        priority: "high",
        assignees: ["CEO", "Regional VP"],
        dueDate: "2024-08-20",
        comments: 15,
        attachments: 9,
        tags: ["Expansion", "APAC", "Operations"]
      },
      {
        id: "ie-3",
        title: "Sustainability Initiative Rollout", 
        description: "Company-wide carbon neutrality program implementation",
        priority: "medium",
        assignees: ["CSO", "Operations"],
        dueDate: "2024-10-15",
        comments: 6,
        attachments: 4,
        tags: ["Sustainability", "Green", "CSR"]
      }
    ]
  },
  "review-approval": {
    title: "Board Review",
    color: "#8b5cf6",
    tasks: [
      {
        id: "ra-1",
        title: "Q3 Financial Performance Review",
        description: "Comprehensive quarterly financial analysis and board presentation",
        priority: "critical",
        assignees: ["CFO", "Finance Team"],
        dueDate: "2024-07-25",
        comments: 12,
        attachments: 25,
        tags: ["Finance", "Quarterly", "Board"]
      },
      {
        id: "ra-2",
        title: "Risk Management Framework Update",
        description: "Updated enterprise risk assessment and mitigation strategies",
        priority: "high", 
        assignees: ["CRO", "Legal Team"],
        dueDate: "2024-08-10",
        comments: 7,
        attachments: 14,
        tags: ["Risk", "Compliance", "Legal"]
      }
    ]
  },
  "completed": {
    title: "Completed",
    color: "#10b981",
    tasks: [
      {
        id: "c-1",
        title: "Q2 Board Meeting Execution",
        description: "Successful quarterly board meeting with strategic updates",
        priority: "critical",
        assignees: ["CEO", "All C-Suite"],
        dueDate: "2024-06-20",
        comments: 18,
        attachments: 22,
        tags: ["Board", "Meeting", "Strategic"]
      },
      {
        id: "c-2",
        title: "Product Launch - AI Suite v2.0",
        description: "Successfully launched next-generation AI product suite",
        priority: "high",
        assignees: ["CPO", "Engineering"],
        dueDate: "2024-06-15",
        comments: 31,
        attachments: 16,
        tags: ["Product", "AI", "Launch"]
      }
    ]
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
      staggerChildren: 0.1,
    },
  },
};

const columnVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const taskVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 150,
    },
  },
};

export const KanbanPage: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
  };

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
      {/* Executive Header */}
      <motion.div variants={columnVariants} className="executive-header">
        <Title level={2} style={{ color: "white", margin: 0 }}>
          📋 Strategic Kanban Board
        </Title>
        <Text style={{ color: "rgba(255, 255, 255, 0.9)" }}>
          C-Level task management and strategic initiative tracking
        </Text>
      </motion.div>

      {/* Kanban Board */}
      <div className="kanban-board" style={{ 
        display: "flex", 
        gap: "24px", 
        overflowX: "auto", 
        paddingBottom: "24px",
        minHeight: "600px" 
      }}>
        {Object.entries(kanbanData).map(([columnId, column]) => (
          <motion.div
            key={columnId}
            variants={columnVariants}
            className="kanban-column"
            style={{
              flex: "0 0 320px",
              background: "#ffffff",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Column Header */}
            <div
              className="kanban-column-header"
              style={{
                padding: "16px",
                marginBottom: "20px",
                background: `linear-gradient(135deg, ${column.color} 0%, ${column.color}cc 100%)`,
                color: "white",
                borderRadius: "12px",
                fontWeight: 600,
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            >
              <Title level={5} style={{ color: "white", margin: 0 }}>
                {column.title}
              </Title>
              <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "12px" }}>
                {column.tasks.length} {column.tasks.length === 1 ? 'task' : 'tasks'}
              </Text>
            </div>

            {/* Tasks */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {column.tasks.map((task) => (
                <motion.div
                  key={task.id}
                  variants={taskVariants}
                  whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="kanban-task"
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    hoverable
                    onClick={() => handleTaskClick(task)}
                  >
                    {/* Task Header */}
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <Tag 
                          color={getPriorityColor(task.priority)} 
                          icon={<FlagOutlined />}
                          style={{ textTransform: "uppercase", fontWeight: 600, fontSize: "10px" }}
                        >
                          {task.priority}
                        </Tag>
                        <Text type="secondary" style={{ fontSize: "11px" }}>
                          <CalendarOutlined style={{ marginRight: "4px" }} />
                          {dayjs(task.dueDate).format("MMM DD")}
                        </Text>
                      </div>
                      
                      <Title level={5} style={{ margin: 0, color: "#1f2937", fontSize: "14px", lineHeight: "1.4" }}>
                        {task.title}
                      </Title>
                    </div>

                    {/* Task Description */}
                    <Paragraph 
                      style={{ 
                        color: "#6b7280", 
                        fontSize: "12px", 
                        marginBottom: "12px",
                        lineHeight: "1.4"
                      }}
                      ellipsis={{ rows: 2 }}
                    >
                      {task.description}
                    </Paragraph>

                    {/* Task Tags */}
                    <div style={{ marginBottom: "12px" }}>
                      <Space size={[4, 4]} wrap>
                        {task.tags.map((tag, idx) => (
                          <Tag key={idx} color="blue" style={{ fontSize: "10px", margin: 0 }}>
                            {tag}
                          </Tag>
                        ))}
                      </Space>
                    </div>

                    {/* Task Assignees */}
                    <div style={{ marginBottom: "12px" }}>
                      <Text type="secondary" style={{ fontSize: "10px", display: "block", marginBottom: "6px" }}>
                        <TeamOutlined style={{ marginRight: "4px" }} />
                        ASSIGNED TO
                      </Text>
                      <Avatar.Group maxCount={2} size="small">
                        {task.assignees.map((assignee, idx) => (
                          <Tooltip key={idx} title={assignee}>
                            <Avatar 
                              size="small" 
                              style={{ 
                                background: `linear-gradient(135deg, ${column.color} ${idx * 30}%, ${column.color}aa ${100 - idx * 30}%)`,
                                fontSize: "10px",
                                fontWeight: 600
                              }}
                            >
                              {assignee.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                          </Tooltip>
                        ))}
                      </Avatar.Group>
                    </div>

                    {/* Task Actions - C-Level View Only */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid #f3f4f6" }}>
                      <Space size="small">
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<CommentOutlined />}
                          style={{ fontSize: "11px", color: "#6b7280" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                            setCommentModalVisible(true);
                          }}
                        >
                          {task.comments}
                        </Button>
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<PaperClipOutlined />}
                          style={{ fontSize: "11px", color: "#6b7280" }}
                        >
                          {task.attachments}
                        </Button>
                      </Space>
                      
                      <Button 
                        type="text"
                        size="small"
                        icon={<EyeOutlined />}
                        style={{ 
                          fontSize: "11px",
                          color: column.color,
                          fontWeight: 600
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {/* Add Task Button - For Executive Use */}
              <motion.div variants={taskVariants}>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  style={{
                    height: "50px",
                    borderRadius: "12px",
                    borderColor: column.color,
                    color: column.color,
                    fontWeight: 600,
                  }}
                  block
                >
                  Add Strategic Initiative
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Executive Comment Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CommentOutlined style={{ color: "#1e3a8a" }} />
            <span>Executive Commentary</span>
          </div>
        }
        open={commentModalVisible}
        onOk={handleAddComment}
        onCancel={() => setCommentModalVisible(false)}
        okText="Add Executive Comment"
        width={600}
        okButtonProps={{
          style: {
            background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
            border: "none",
            fontWeight: 600
          }
        }}
      >
        {selectedTask && (
          <div style={{ marginBottom: "20px", padding: "16px", background: "#f8fafc", borderRadius: "8px" }}>
            <Title level={5} style={{ margin: 0, color: "#1e3a8a" }}>
              {selectedTask.title}
            </Title>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Due: {dayjs(selectedTask.dueDate).format("MMMM DD, YYYY")} • 
              Priority: <Tag color={getPriorityColor(selectedTask.priority)} style={{ margin: "0 0 0 4px" }}>
                {selectedTask.priority.toUpperCase()}
              </Tag>
            </Text>
            <Paragraph style={{ marginTop: "8px", marginBottom: 0, fontSize: "13px" }}>
              {selectedTask.description}
            </Paragraph>
          </div>
        )}
        
        <div style={{ marginBottom: "16px" }}>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Executive Comment or Strategic Direction:
          </Text>
          <TextArea
            rows={4}
            placeholder="Add your executive insight, strategic direction, or board-level commentary..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ borderRadius: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Visibility Level:
          </Text>
          <Select defaultValue="c-level" style={{ width: "100%" }}>
            <Option value="c-level">C-Level Only</Option>
            <Option value="board">Board Members</Option>
            <Option value="senior-management">Senior Management</Option>
          </Select>
        </div>
        
        <Upload
          multiple
          showUploadList={false}
          beforeUpload={() => false}
        >
          <Button icon={<PaperClipOutlined />} type="dashed" block style={{ borderRadius: "8px" }}>
            Attach Executive Documents
          </Button>
        </Upload>
      </Modal>
    </motion.div>
  );
};