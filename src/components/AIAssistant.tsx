import React, { useState, useRef, useEffect } from 'react';
import {
  Drawer,
  Input,
  Button,
  Space,
  Typography,
  Card,
  Avatar,
  List,
  Spin,
  Alert,
  Tag,
  Divider,
  Tooltip,
} from 'antd';
import {
  RobotOutlined,
  SendOutlined,
  ClearOutlined,
  BulbOutlined,
  BarChartOutlined,
  RiseOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  insights?: {
    type: 'trend' | 'anomaly' | 'recommendation' | 'alert';
    title: string;
    description: string;
    confidence: number;
  }[];
}

interface AIAssistantProps {
  visible: boolean;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample queries for executives
  const sampleQueries = [
    t("Give me a 3-line summary of revenue trend last quarter and two recommended actions"),
    t("Which project milestones slipped in the last 30 days and why?"),
    t("Show anomalies in team productivity for June 2025"),
    t("What are the top 3 risks in our current portfolio?"),
    t("Summarize board meeting preparation items"),
  ];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (visible && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        type: 'assistant',
        content: t("Hello! I'm your AI Executive Assistant. I can help you with insights, summaries, and analysis of your business data. Try asking me about revenue trends, project status, or any executive decisions you need support with."),
        timestamp: new Date(),
        suggestions: sampleQueries.slice(0, 3),
      };
      setMessages([welcomeMessage]);
    }
  }, [visible, messages.length, t, sampleQueries]);

  const handleSendMessage = async (query?: string) => {
    const messageContent = query || inputValue.trim();
    if (!messageContent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response - In Phase D, this will connect to real AI backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponse = generateMockResponse(messageContent);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: t("I apologize, but I'm experiencing some technical difficulties. Please try again in a moment."),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (query: string): Message => {
    // Mock AI responses based on query patterns
    let content = '';
    let insights: Message['insights'] = [];

    if (query.toLowerCase().includes('revenue')) {
      content = t("Revenue Analysis Summary:\n• Q4 2024: 23% growth vs Q3, reaching $18.5M\n• Key drivers: JTC logistics expansion (+$2.1M), Energy sector growth (+$1.8M)\n\nRecommended Actions:\n1. Accelerate JTC fleet expansion to capture growing demand\n2. Diversify energy portfolio to reduce seasonal volatility");
      insights = [
        {
          type: 'trend',
          title: t('Positive Revenue Trend'),
          description: t('Consistent 15-25% quarterly growth'),
          confidence: 0.92,
        },
        {
          type: 'recommendation',
          title: t('Expand JTC Operations'),
          description: t('High ROI opportunity in logistics sector'),
          confidence: 0.87,
        },
      ];
    } else if (query.toLowerCase().includes('project') || query.toLowerCase().includes('milestone')) {
      content = t("Project Status Analysis:\n• 3 milestones delayed in December 2024\n• Primary cause: Resource allocation conflicts between JTC expansion and Energy infrastructure\n\nDelayed Projects:\n1. JTC Fleet Management System (2 weeks behind)\n2. Energy Facility Upgrade (1 week behind)\n3. Board Portal Enhancement (3 days behind)");
      insights = [
        {
          type: 'alert',
          title: t('Resource Allocation Issue'),
          description: t('Multiple projects competing for same resources'),
          confidence: 0.89,
        },
      ];
    } else if (query.toLowerCase().includes('anomal') || query.toLowerCase().includes('productiv')) {
      content = t("Productivity Analysis - June 2025:\n• Overall productivity: 8% above baseline\n• Anomaly detected: 15% drop in Energy sector efficiency on June 15-18\n• Root cause: Equipment maintenance overlap\n\nPositive trends:\n• JTC operations: 12% efficiency improvement\n• 45degrees: Record customer satisfaction (4.8/5)");
      insights = [
        {
          type: 'anomaly',
          title: t('Energy Sector Dip'),
          description: t('Temporary efficiency drop due to maintenance'),
          confidence: 0.94,
        },
        {
          type: 'trend',
          title: t('JTC Excellence'),
          description: t('Consistent operational improvements'),
          confidence: 0.91,
        },
      ];
    } else {
      content = t("I understand you're looking for executive insights. I can help you with:\n\n• Financial performance analysis\n• Project status and milestone tracking\n• Operational efficiency metrics\n• Risk assessment and recommendations\n• Strategic decision support\n\nPlease ask me a specific question about your business operations or try one of the suggested queries below.");
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content,
      timestamp: new Date(),
      insights,
      suggestions: content.includes('try one of') ? sampleQueries.slice(0, 2) : undefined,
    };
  };

  const clearChat = () => {
    setMessages([]);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <RiseOutlined style={{ color: '#52c41a' }} />;
      case 'anomaly':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'recommendation':
        return <BulbOutlined style={{ color: '#1890ff' }} />;
      case 'alert':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <BarChartOutlined />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend':
        return '#52c41a';
      case 'anomaly':
        return '#faad14';
      case 'recommendation':
        return '#1890ff';
      case 'alert':
        return '#ff4d4f';
      default:
        return '#666666';
    }
  };

  return (
    <Drawer
      title={
        <Space>
          <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {t('AI Executive Assistant')}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {t('Powered by advanced analytics')}
            </Text>
          </div>
        </Space>
      }
      placement="right"
      width={500}
      open={visible}
      onClose={onClose}
      extra={
        <Button
          type="text"
          icon={<ClearOutlined />}
          onClick={clearChat}
          title={t('Clear conversation')}
        />
      }
      styles={{
        body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%' },
      }}
    >
      {/* Messages Area */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '16px',
        maxHeight: 'calc(100vh - 200px)' 
      }}>
        <List
          dataSource={messages}
          renderItem={(message) => (
            <List.Item style={{ border: 'none', padding: '8px 0' }}>
              <div style={{ width: '100%' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: message.type === 'user' 
                      ? 'var(--primary-color)' 
                      : '#f5f5f5',
                    color: message.type === 'user' ? 'white' : 'inherit',
                  }}>
                    <div style={{ whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                      {message.content}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      opacity: 0.7, 
                      marginTop: '4px',
                      textAlign: 'right'
                    }}>
                      <ClockCircleOutlined style={{ marginRight: '4px' }} />
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                {message.insights && message.insights.length > 0 && (
                  <Card size="small" style={{ marginBottom: '8px', background: '#fafafa' }}>
                    <Title level={5} style={{ margin: '0 0 8px 0' }}>
                      {t('AI Insights')}
                    </Title>
                    {message.insights.map((insight, index) => (
                      <div key={index} style={{ marginBottom: '8px' }}>
                        <Space align="start">
                          {getInsightIcon(insight.type)}
                          <div style={{ flex: 1 }}>
                            <Text strong style={{ color: getInsightColor(insight.type) }}>
                              {insight.title}
                            </Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {insight.description}
                            </Text>
                            <br />
                            <Tag color={getInsightColor(insight.type)} style={{ fontSize: '10px' }}>
                              {Math.round(insight.confidence * 100)}% {t('confidence')}
                            </Tag>
                          </div>
                        </Space>
                      </div>
                    ))}
                  </Card>
                )}

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {t('Try asking:')}
                    </Text>
                    <div style={{ marginTop: '4px' }}>
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          type="link"
                          size="small"
                          onClick={() => handleSendMessage(suggestion)}
                          style={{ 
                            padding: '2px 0', 
                            height: 'auto',
                            fontSize: '12px',
                            display: 'block',
                            textAlign: 'left'
                          }}
                        >
                          • {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </List.Item>
          )}
        />
        
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <Spin size="small" />
            <Text type="secondary" style={{ marginLeft: '8px', fontSize: '12px' }}>
              {t('AI is analyzing your request...')}
            </Text>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ 
        padding: '16px', 
        borderTop: '1px solid #f0f0f0',
        background: 'white'
      }}>
        <Space.Compact style={{ width: '100%' }}>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('Ask me about revenue, projects, KPIs, or any executive insights...')}
            autoSize={{ minRows: 1, maxRows: 3 }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <Tooltip title={t('Send message (Enter)')}>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => handleSendMessage()}
              loading={isLoading}
              disabled={!inputValue.trim()}
            />
          </Tooltip>
        </Space.Compact>
        
        <Alert
          message={t('AI Assistant is in demo mode')}
          description={t('Responses are simulated. In production, this will connect to real business intelligence systems.')}
          type="info"
          showIcon
          style={{ marginTop: '8px', fontSize: '11px' }}
          banner
        />
      </div>
    </Drawer>
  );
};

export default AIAssistant;
