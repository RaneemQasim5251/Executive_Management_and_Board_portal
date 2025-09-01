import { FC, useState } from "react";
import { TimelineAccess } from "../../components/TimelineAccess";
import { Card, Typography, Tag, Avatar, Button, Space, Modal, Input, Select, Upload, Tooltip } from "antd";
import {
  PlusOutlined,
  CommentOutlined,
  PaperClipOutlined,
  TeamOutlined,
  CalendarOutlined,
  FlagOutlined,

  EyeOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Board Management Data - will be moved inside component
const getBoardData = (t: any) => ({
    "strategic-planning": {
      title: t("Strategic Planning"),
      color: "#0C085C",
    tasks: [
      {
        id: "sp-1",
        title: t("2025 Vision & Strategy Document"),
        description: t("Develop comprehensive strategic vision and roadmap for 2025-2027"),
        priority: t("critical"),
        assignees: [t("CEO"), t("Strategy Team")],
        dueDate: "2024-08-15",
        comments: 8,
        attachments: 12,
        tags: [t("Vision"), t("Strategy"), t("Planning")]
      },
      {
        id: "sp-2", 
        title: t("Market Analysis - Emerging Technologies"),
        description: t("Deep dive analysis of AI, IoT, and blockchain market opportunities"),
        priority: t("high"),
        assignees: [t("CTO"), t("Research Team")],
        dueDate: "2024-07-30",
        comments: 5,
        attachments: 7,
        tags: [t("Research"), t("Technology"), t("Market")]
      }
    ]
  },
  "in-execution": {
    title: t("In Execution"),
    color: "#FF2424",
    tasks: [
      {
        id: "ie-1",
        title: t("Digital Transformation Phase 2"),
        description: t("Implementation of AI-driven automation across core business processes"),
        priority: t("critical"),
        assignees: [t("CTO"), t("COO"), t("IT Team")],
        dueDate: "2024-09-30",
        comments: 24,
        attachments: 18,
        tags: [t("Digital"), t("Automation"), t("AI")]
      },
      {
        id: "ie-2",
        title: t("APAC Market Expansion"),
        description: t("Establish operations in Singapore, Tokyo, and Sydney markets"),
        priority: t("high"),
        assignees: [t("CEO"), t("Regional VP")],
        dueDate: "2024-08-20",
        comments: 15,
        attachments: 9,
        tags: [t("Expansion"), t("APAC"), t("Operations")]
      },
      {
        id: "ie-3",
        title: t("Sustainability Initiative Rollout"), 
        description: t("Company-wide carbon neutrality program implementation"),
        priority: t("medium"),
        assignees: [t("CSO"), t("Operations")],
        dueDate: "2024-10-15",
        comments: 6,
        attachments: 4,
        tags: [t("Sustainability"), t("Green"), t("CSR")]
      }
    ]
  },
  "review-approval": {
    title: t("Board Review"),
    color: "#363692",
    tasks: [
      {
        id: "ra-1",
        title: t("Q3 Financial Performance Review"),
        description: t("Comprehensive quarterly financial analysis and board presentation"),
        priority: t("critical"),
        assignees: [t("CFO"), t("Finance Team")],
        dueDate: "2024-07-25",
        comments: 12,
        attachments: 25,
        tags: [t("Finance"), t("Quarterly"), t("Board")]
      },
      {
        id: "ra-2",
        title: t("Risk Management Framework Update"),
        description: t("Updated enterprise risk assessment and mitigation strategies"),
        priority: t("high"), 
        assignees: [t("CRO"), t("Legal Team")],
        dueDate: "2024-08-10",
        comments: 7,
        attachments: 14,
        tags: [t("Risk"), t("Compliance"), t("Legal")]
      }
    ]
  },
  "completed": {
    title: t("Completed Tasks"),
    color: "#0095CE",
    tasks: [
      {
        id: "c-1",
        title: t("Q2 Board Meeting Execution"),
        description: t("Successful quarterly board meeting with strategic updates"),
        priority: t("critical"),
        assignees: [t("CEO"), t("All C-Suite")],
        dueDate: "2024-06-20",
        comments: 18,
        attachments: 22,
        tags: [t("Board"), t("Meeting"), t("Strategic")]
      },
      {
        id: "c-2",
        title: t("Product Launch - AI Suite v2.0"),
        description: t("Successfully launched next-generation AI product suite"),
        priority: t("high"),
        assignees: [t("CPO"), t("Engineering")],
        dueDate: "2024-06-15",
        comments: 31,
        attachments: 16,
        tags: [t("Product"), t("AI"), t("Launch")]
      }
    ]
  }
});

const getPriorityColor = (priority: string, t: any) => {
  // Handle both English and translated priorities
  const priorityKey = priority === t("critical") ? "critical" :
                     priority === t("high") ? "high" :
                     priority === t("medium") ? "medium" :
                     priority === t("low") ? "low" : priority;
                     
  switch (priorityKey) {
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

export const KanbanPage: FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  
  // RTL support
  const isRTL = i18n.language === 'ar';

  // Get kanban data with translations
  const kanbanData = getBoardData(t);

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
      style={{ 
        padding: "24px",
        background: "#0C085C",
        minHeight: "100vh",
        direction: isRTL ? 'rtl' : 'ltr',
        fontFamily: isRTL 
          ? "'Noto Sans Arabic', 'Cairo', 'Amiri', system-ui, -apple-system, sans-serif"
          : "'Inter', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* Executive Header */}
      <motion.div variants={columnVariants}>
        <Card 
          style={{ 
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)",
            marginBottom: "24px"
          }}
          styles={{ body: { padding: "32px" } }}
        >
          <Space direction="vertical" size="small">
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
              {t("Board Management")}
            </Title>
            <Text style={{ fontSize: "16px", color: "#666" }}>
              {t("Executive initiatives and board-level strategic tracking")}
            </Text>
          </Space>
        </Card>
      </motion.div>

      {/* Kanban Board */}
      <div className="kanban-board" style={{ 
        display: "flex", 
        gap: "24px", 
        overflowX: "auto", 
        paddingBottom: "24px",
        minHeight: "600px",
        direction: isRTL ? 'rtl' : 'ltr',
        flexDirection: isRTL ? 'row-reverse' : 'row'
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
              direction: isRTL ? 'rtl' : 'ltr',
            }}
          >
            {/* Column Header */}
            <div
              className="kanban-column-header"
              style={{
                padding: "16px",
                marginBottom: "20px",
                background: column.color,
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
                {column.tasks.length} {column.tasks.length === 1 ? t('task') : t('tasks')}
              </Text>
            </div>

            {/* Timeline Access - Only show in Strategic Planning column */}
            {column.title === t("Strategic Planning") && (
              <div style={{ marginBottom: "16px" }}>
                <TimelineAccess />
              </div>
            )}

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
                      direction: isRTL ? 'rtl' : 'ltr',
                      textAlign: isRTL ? 'right' : 'left',
                    }}
                    hoverable
                    onClick={() => handleTaskClick(task)}
                  >
                    {/* Task Header */}
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <Tag 
                          color={getPriorityColor(task.priority, t)} 
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
                      
                      <Title level={5} style={{ margin: 0, color: "#000000", fontSize: "14px", lineHeight: "1.4" }}>
                        {task.title}
                      </Title>
                    </div>

                    {/* Task Description */}
                    <Paragraph 
                      style={{ 
                        color: "#666666", 
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
                        {t("ASSIGNED TO")}
                      </Text>
                      <Avatar.Group max={{ count: 2 }} size="small">
                        {task.assignees.map((assignee, idx) => (
                          <Tooltip key={idx} title={assignee}>
                            <Avatar 
                              size="small" 
                              style={{ 
                                background: column.color,
                                fontSize: "10px",
                                fontWeight: 600
                              }}
                            >
                              {assignee.split(' ').map((n: string) => n[0]).join('')}
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
                        {t("View")}
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
                  {t("kanban.addStrategicInitiative")}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Executive Comment Modal */}
      <Modal
        title={
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px",
            direction: isRTL ? 'rtl' : 'ltr',
            justifyContent: isRTL ? 'flex-end' : 'flex-start'
          }}>
            <CommentOutlined style={{ color: "#0C085C" }} />
            <span>{t("kanban.executiveCommentary")}</span>
          </div>
        }
        open={commentModalVisible}
        onOk={handleAddComment}
        onCancel={() => setCommentModalVisible(false)}
        okText={t("kanban.addExecutiveComment")}
        width={600}
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        okButtonProps={{
          style: {
            background: "#0C085C",
            border: "none",
            fontWeight: 600
          }
        }}
      >
        {selectedTask && (
          <div style={{ marginBottom: "20px", padding: "16px", background: "#f8fafc", borderRadius: "8px" }}>
            <Title level={5} style={{ margin: 0, color: "#0C085C" }}>
              {selectedTask.title}
            </Title>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {t("Due")}: {dayjs(selectedTask.dueDate).format("MMMM DD, YYYY")} • 
              {t("Priority")}: <Tag color={getPriorityColor(selectedTask.priority, t)} style={{ margin: "0 0 0 4px" }}>
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
            {t("Executive Comment or Strategic Direction:")}
          </Text>
          <TextArea
            rows={4}
            placeholder={t("Add your executive insight, strategic direction, or board-level commentary...")}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ borderRadius: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            {t("Visibility Level:")}
          </Text>
          <Select defaultValue="c-level" style={{ width: "100%" }}>
            <Option value="c-level">{t("C-Level Only")}</Option>
            <Option value="board">{t("Board Members")}</Option>
            <Option value="senior-management">{t("Senior Management")}</Option>
          </Select>
        </div>
        
        <Upload
          multiple
          showUploadList={false}
          beforeUpload={() => false}
        >
          <Button icon={<PaperClipOutlined />} type="dashed" block style={{ borderRadius: "8px" }}>
            {t("Attach Executive Documents")}
          </Button>
        </Upload>
      </Modal>
    </motion.div>
  );
};