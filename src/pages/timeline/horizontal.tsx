import { FC, useState, useEffect } from "react";
import { 
  Card, 
  Typography, 
  Space, 
  Tag, 
  Progress, 
  Avatar, 
  Button, 
  Row, 
  Col,
  Tooltip,
  Badge,
  Divider,
  Upload,
  message
} from "antd";
import {
  RocketOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  DollarOutlined,
  TrophyOutlined,
  StarOutlined,
  FireOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  BulbOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const { Title, Text, Paragraph } = Typography;

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'active' | 'upcoming' | 'delayed';
  progress: number;
  budget?: string;
  team?: string[];
  category: 'strategic' | 'operational' | 'innovation' | 'partnership';
  priority: 'high' | 'medium' | 'low';
  icon?: React.ReactNode;
  outcomes?: string[];
}

// Timeline data with translations
const getTimelineEvents = (t: any): TimelineEvent[] => [
  {
    id: '1',
    title: t('Q1 Strategic Planning'),
    description: t('Comprehensive strategic review and 2025 roadmap development'),
    date: t('Jan 2024'),
    status: 'completed',
    progress: 100,
    budget: '$2.5M',
    team: ['CEO', 'CFO', 'Strategy Team'],
    category: 'strategic',
    priority: 'high',
    icon: <TrophyOutlined />,
    outcomes: [t('5-Year Strategic Plan'), t('Resource Allocation'), t('KPI Framework')]
  },
  {
    id: '2',
    title: t('Digital Transformation'),
    description: t('Enterprise-wide digital infrastructure modernization'),
    date: t('Feb - Apr 2024'),
    status: 'completed',
    progress: 95,
    budget: '$8.2M',
    team: ['CTO', 'Dev Team', 'IT Ops'],
    category: 'operational',
    priority: 'high',
    icon: <ThunderboltOutlined />,
    outcomes: [t('Cloud Migration'), t('AI Integration'), t('Process Automation')]
  },
  {
    id: '3',
    title: t('Market Expansion'),
    description: t('Entry into European and Asian markets'),
    date: t('May - Aug 2024'),
    status: 'active',
    progress: 75,
    budget: '$12.5M',
    team: ['CMO', 'Sales VP', 'Regional Heads'],
    category: 'strategic',
    priority: 'high',
    icon: <RocketOutlined />,
    outcomes: [t('Market Research'), t('Local Partnerships'), t('Revenue Growth')]
  },
  {
    id: '4',
    title: t('Innovation Lab Launch'),
    description: t('Establish R&D center for next-gen products'),
    date: t('Sep - Nov 2024'),
    status: 'active',
    progress: 45,
    budget: '$5.8M',
    team: ['Chief Innovation', 'R&D Team', 'Product'],
    category: 'innovation',
    priority: 'medium',
    icon: <BulbOutlined />,
    outcomes: [t('Innovation Center'), t('Patent Portfolio'), t('Product Prototypes')]
  },
  {
    id: '5',
    title: t('Strategic Partnerships'),
    description: t('Form alliances with industry leaders'),
    date: t('Dec 2024 - Feb 2025'),
    status: 'upcoming',
    progress: 15,
    budget: '$3.2M',
    team: ['CEO', 'BD Team', 'Legal'],
    category: 'partnership',
    priority: 'high',
    icon: <TeamOutlined />,
    outcomes: [t('Partnership Agreements'), t('Joint Ventures'), t('Market Access')]
  },
  {
    id: '6',
    title: t('IPO Preparation'),
    description: t('Prepare for public listing and regulatory compliance'),
    date: t('Mar - Jun 2025'),
    status: 'upcoming',
    progress: 5,
    budget: '$15.0M',
    team: ['CFO', 'Legal', 'Investment Banks'],
    category: 'strategic',
    priority: 'high',
    icon: <StarOutlined />,
    outcomes: [t('SEC Filing'), t('Roadshow'), t('Public Trading')]
  }
];

export const HorizontalTimeline: FC = () => {
  const { t } = useTranslation();
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [activeIndex, setActiveIndex] = useState(2); // Current active phase
  
  // Get timeline events with translations
  const timelineEvents = getTimelineEvents(t);

  useEffect(() => {
    // Auto-scroll animation
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % timelineEvents.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [timelineEvents.length]);

  const getStatusColor = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'active': return '#F59E0B';
      case 'upcoming': return '#6B7280';
      case 'delayed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getCategoryColor = (category: TimelineEvent['category']) => {
    switch (category) {
      case 'strategic': return '#8B5CF6';
      case 'operational': return '#06B6D4';
      case 'innovation': return '#10B981';
      case 'partnership': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ 
        padding: "24px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh"
      }}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <Card 
          style={{ 
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            marginBottom: "32px",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}
          styles={{ body: { padding: "32px" } }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space direction="vertical" size="small">
                <Title 
                  level={1} 
                  style={{ 
                    margin: 0, 
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: "42px",
                    fontWeight: "800"
                  }}
                >
                  🚀 {t("Strategic Timeline")}
                </Title>
                <Text style={{ fontSize: "16px", color: "#666" }}>
                  {t("Board-level milestones")} {t("Strategic initiatives roadmap")}
                </Text>
              </Space>
            </Col>
            <Col>
              <Space size="large">
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10B981" }}>
                    {timelineEvents.filter(e => e.status === 'completed').length}
                  </div>
                  <Text style={{ fontSize: "12px", color: "#666" }}>Completed</Text>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#F59E0B" }}>
                    {timelineEvents.filter(e => e.status === 'active').length}
                  </div>
                  <Text style={{ fontSize: "12px", color: "#666" }}>Active</Text>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#6B7280" }}>
                    {timelineEvents.filter(e => e.status === 'upcoming').length}
                  </div>
                  <Text style={{ fontSize: "12px", color: "#666" }}>Upcoming</Text>
                </div>
              </Space>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Horizontal Timeline */}
      <motion.div variants={itemVariants}>
        <Card
          className="timeline-container"
          style={{
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            marginBottom: "24px"
          }}
          styles={{ body: { padding: "40px 32px" } }}
        >
          {/* Timeline Track */}
          <div style={{ position: "relative", marginBottom: "60px" }}>
            {/* Background Line */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "0",
              right: "0",
              height: "4px",
              background: "linear-gradient(90deg, #e5e7eb 0%, #d1d5db 100%)",
              borderRadius: "2px",
              zIndex: 1
            }} />
            
            {/* Progress Line */}
            <motion.div 
              style={{
                position: "absolute",
                top: "50%",
                left: "0",
                height: "4px",
                background: "linear-gradient(90deg, #10B981 0%, #F59E0B 50%, #667eea 100%)",
                borderRadius: "2px",
                zIndex: 2
              }}
              initial={{ width: "0%" }}
              animate={{ width: `${(activeIndex + 1) * (100 / timelineEvents.length)}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Timeline Events */}
            <div 
              className="timeline-events"
              style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-start",
                position: "relative", 
                zIndex: 3,
                gap: "16px",
                overflowX: "auto",
                paddingBottom: "20px",
                width: "100%"
              }}>
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1 
                  }}
                  transition={{ 
                    delay: index * 0.15,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedEvent(event)}
                  className="timeline-event"
                  style={{ 
                    cursor: "pointer",
                    textAlign: "center",
                    minWidth: "200px",
                    maxWidth: "220px",
                    flex: "1 1 200px",
                    padding: "0 8px"
                  }}
                >
                  {/* Progress Circle */}
                  <div style={{ position: "relative", marginBottom: "16px" }}>
                    {event.status === 'completed' ? (
                      <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #10B981, #059669)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "28px",
                        margin: "0 auto",
                        boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)",
                        border: "4px solid white"
                      }}>
                        <CheckCircleOutlined />
                      </div>
                    ) : event.status === 'active' ? (
                      <div style={{ position: "relative" }}>
                        <Progress
                          type="circle"
                          percent={event.progress}
                          size={80}
                          strokeColor={{
                            '0%': '#667eea',
                            '100%': '#764ba2',
                          }}
                          trailColor="#f3f4f6"
                          showInfo={false}
                        />
                        <div style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#667eea"
                        }}>
                          {event.progress}%
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "#f9fafb",
                        border: "3px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#9ca3af",
                        fontSize: "24px",
                        margin: "0 auto"
                      }}>
                        <ClockCircleOutlined />
                      </div>
                    )}
                  </div>

                  {/* Event Title */}
                  <div style={{ 
                    marginBottom: "8px",
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Text strong className="timeline-title" style={{ 
                      fontSize: "15px", 
                      color: "#1f2937",
                      display: "block",
                      lineHeight: "1.3",
                      textAlign: "center",
                      wordWrap: "break-word",
                      hyphens: "auto",
                      maxWidth: "100%"
                    }}>
                      {event.title}
                    </Text>
                  </div>

                  {/* Event Date */}
                  <div style={{ 
                    marginBottom: "12px",
                    minHeight: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Text className="timeline-date" style={{ 
                      fontSize: "12px", 
                      color: "#6b7280",
                      display: "block",
                      textAlign: "center"
                    }}>
                      {event.date}
                    </Text>
                  </div>
                  
                  {/* Progress percentage for active items */}
                  {event.status === 'active' && (
                    <div style={{ marginBottom: "8px" }}>
                      <Text style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#f59e0b"
                      }}>
                        {event.progress}%
                      </Text>
                    </div>
                  )}

                  {/* Category Tag */}
                  <div style={{ 
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "24px"
                  }}>
                    <Tag 
                      color={
                        event.category === 'strategic' ? 'purple' :
                        event.category === 'operational' ? 'cyan' :
                        event.category === 'innovation' ? 'green' :
                        event.category === 'partnership' ? 'orange' : 'default'
                      }
                      style={{ 
                        borderRadius: "12px",
                        fontSize: "10px",
                        padding: "2px 6px",
                        textAlign: "center"
                      }}
                    >
                      {t(event.category)}
                    </Tag>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Event Details */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              title={
                <Space>
                  <div style={{ 
                    color: getCategoryColor(selectedEvent.category),
                    fontSize: "20px"
                  }}>
                    {selectedEvent.icon}
                  </div>
                  <span>{selectedEvent.title}</span>
                  <Tag color={getStatusColor(selectedEvent.status)}>
                    {selectedEvent.status.toUpperCase()}
                  </Tag>
                </Space>
              }
              extra={
                <Button 
                  type="text" 
                  onClick={() => setSelectedEvent(null)}
                  style={{ color: "#6b7280" }}
                >
                  ✕
                </Button>
              }
              style={{
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)"
              }}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} md={16}>
                  <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <div>
                      <Text style={{ fontSize: "16px", lineHeight: "1.6" }}>
                        {selectedEvent.description}
                      </Text>
                    </div>

                    {selectedEvent.status === 'active' && (
                      <div>
                        <Text strong style={{ display: "block", marginBottom: "8px" }}>
                          Progress: {selectedEvent.progress}%
                        </Text>
                        <Progress 
                          percent={selectedEvent.progress}
                          strokeColor={getStatusColor(selectedEvent.status)}
                          trailColor="#f0f0f0"
                          size="default"
                        />
                      </div>
                    )}

                    {selectedEvent.outcomes && (
                      <div>
                        <Text strong style={{ display: "block", marginBottom: "12px" }}>
                          Key Outcomes:
                        </Text>
                        <Space direction="vertical" size="small">
                          {selectedEvent.outcomes.map((outcome, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <CheckCircleOutlined style={{ color: "#10B981", fontSize: "16px" }} />
                              <Text>{outcome}</Text>
                            </div>
                          ))}
                        </Space>
                      </div>
                    )}
                  </Space>
                </Col>

                <Col xs={24} md={8}>
                  <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <Card size="small" style={{ background: "#f8fafc" }}>
                      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        <div>
                          <Text type="secondary" style={{ fontSize: "12px" }}>Timeline</Text>
                          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                            {selectedEvent.date}
                          </div>
                        </div>

                        <div>
                          <Text type="secondary" style={{ fontSize: "12px" }}>Budget</Text>
                          <div style={{ fontSize: "16px", fontWeight: "bold", color: "#10B981" }}>
                            {selectedEvent.budget}
                          </div>
                        </div>

                        <div>
                          <Text type="secondary" style={{ fontSize: "12px" }}>Priority</Text>
                          <Tag color={selectedEvent.priority === 'high' ? 'red' : selectedEvent.priority === 'medium' ? 'orange' : 'green'}>
                            {selectedEvent.priority.toUpperCase()}
                          </Tag>
                        </div>
                      </Space>
                    </Card>

                    <div>
                      <Text strong style={{ display: "block", marginBottom: "12px" }}>
                        Team Members:
                      </Text>
                      <Avatar.Group max={{ count: 4 }} size="large">
                        {selectedEvent.team?.map((member, index) => (
                          <Tooltip key={index} title={member}>
                            <Avatar style={{ backgroundColor: getCategoryColor(selectedEvent.category) }}>
                              {member.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                          </Tooltip>
                        ))}
                      </Avatar.Group>
                    </div>
                  </Space>
                </Col>
              </Row>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};