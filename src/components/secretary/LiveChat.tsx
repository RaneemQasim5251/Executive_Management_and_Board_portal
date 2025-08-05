import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  Input,
  Button,
  Avatar,
  Typography,
  Space,
  Badge,
  Card,
  Tooltip,
  notification
} from 'antd';
import {
  SendOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  MessageOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, Directive } from '../../types/secretary';

const { Text, Title } = Typography;
const { TextArea } = Input;

const StyledDrawer = styled(Drawer)`
  .ant-drawer-content {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }
  
  .ant-drawer-header {
    background: linear-gradient(135deg, #0C085C 0%, #363692 100%);
    border-bottom: none;
    
    .ant-drawer-title {
      color: white;
      font-weight: 600;
    }
  }
  
  .ant-drawer-close {
    color: white;
    
    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }
`;

const ChatContainer = styled.div`
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
`;

const MessageBubble = styled.div<{ isOwn: boolean; type: 'message' | 'directive' | 'system' }>`
  margin-bottom: 12px;
  display: flex;
  justify-content: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  
  .message-content {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 16px;
    background: ${props => {
      if (props.type === 'directive') return '#fff2e8';
      if (props.type === 'system') return '#f6f6f6';
      return props.isOwn ? '#0095CE' : '#ffffff';
    }};
    color: ${props => {
      if (props.type === 'directive') return '#d46b08';
      if (props.type === 'system') return '#666666';
      return props.isOwn ? 'white' : '#333333';
    }};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: ${props => props.type === 'directive' ? '1px solid #ffd591' : 'none'};
    
    .message-text {
      margin: 0;
      word-wrap: break-word;
    }
    
    .message-time {
      font-size: 11px;
      opacity: 0.7;
      margin-top: 4px;
      text-align: ${props => props.isOwn ? 'right' : 'left'};
    }
  }
`;

const InputContainer = styled.div`
  padding: 16px;
  background: white;
  border-top: 1px solid #e8e8e8;
  border-radius: 16px 16px 0 0;
  margin-top: auto;
`;

const DirectiveCard = styled(Card)`
  margin-bottom: 12px;
  border-radius: 12px;
  border-left: 4px solid #fa8c16;
  
  &.resolved {
    border-left-color: #52c41a;
    background: #f6ffed;
  }
  
  .ant-card-body {
    padding: 12px 16px;
  }
`;

const ParticipantsList = styled.div`
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
`;

interface LiveChatProps {
  visible: boolean;
  onClose: () => void;
  meetingId?: string;
}

export const LiveChat: React.FC<LiveChatProps> = ({
  visible,
  onClose,
  meetingId = 'meeting-1'
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [directives, setDirectives] = useState<Directive[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = {
    id: 'user-1',
    name: 'Executive Secretary',
    avatar: '/avatars/secretary.jpg'
  };

  // Mock participants
  const participants = [
    { id: 'user-1', name: 'Executive Secretary', role: 'secretary', online: true },
    { id: 'user-2', name: 'CEO', role: 'executive', online: true },
    { id: 'user-3', name: 'CFO', role: 'executive', online: false },
    { id: 'user-4', name: 'Board Member', role: 'viewer', online: true }
  ];

  // Initialize socket connection
  useEffect(() => {
    if (visible && meetingId) {
      // In a real app, this would connect to your socket server
      // const newSocket = io(`${process.env.REACT_APP_SOCKET_URL}/meetings/${meetingId}`);
      
      // Mock socket for demonstration
      const mockSocket = {
        emit: (event: string, data: any) => {
          console.log('Socket emit:', event, data);
        },
        on: (event: string, callback: Function) => {
          console.log('Socket listener added:', event);
        },
        disconnect: () => {
          console.log('Socket disconnected');
        }
      } as any;

      setSocket(mockSocket);

      // Mock initial data
      loadMockData();

      return () => {
        mockSocket.disconnect();
      };
    }
  }, [visible, meetingId]);

  const loadMockData = () => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        meetingId,
        userId: 'user-2',
        userName: 'CEO',
        message: 'Good morning everyone, shall we begin the quarterly review?',
        timestamp: new Date(Date.now() - 300000),
        type: 'message'
      },
      {
        id: '2',
        meetingId,
        userId: 'user-1',
        userName: 'Executive Secretary',
        message: '/directive Review Q3 financial performance metrics by next Friday',
        timestamp: new Date(Date.now() - 240000),
        type: 'directive'
      },
      {
        id: '3',
        meetingId,
        userId: 'user-3',
        userName: 'CFO',
        message: 'The revenue numbers look promising this quarter.',
        timestamp: new Date(Date.now() - 180000),
        type: 'message'
      }
    ];

    const mockDirectives: Directive[] = [
      {
        id: 'dir-1',
        meetingId,
        text: 'Review Q3 financial performance metrics by next Friday',
        createdBy: 'Executive Secretary',
        resolved: false,
        createdAt: new Date(Date.now() - 240000)
      },
      {
        id: 'dir-2',
        meetingId,
        text: 'Prepare market analysis report for board presentation',
        createdBy: 'CEO',
        resolved: true,
        createdAt: new Date(Date.now() - 86400000),
        resolvedAt: new Date(Date.now() - 43200000)
      }
    ];

    setMessages(mockMessages);
    setDirectives(mockDirectives);
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim() || !socket) return;

    const isDirective = inputValue.startsWith('/directive ');
    const messageText = isDirective ? inputValue.substring(11) : inputValue;
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      meetingId,
      userId: currentUser.id,
      userName: currentUser.name,
      message: inputValue,
      timestamp: new Date(),
      type: isDirective ? 'directive' : 'message'
    };

    setMessages(prev => [...prev, newMessage]);

    if (isDirective) {
      const newDirective: Directive = {
        id: `dir-${Date.now()}`,
        meetingId,
        text: messageText,
        createdBy: currentUser.name,
        resolved: false,
        createdAt: new Date()
      };

      setDirectives(prev => [...prev, newDirective]);
      
      notification.success({
        message: 'Directive Created',
        description: 'New directive has been added to the meeting.',
        duration: 3
      });
    }

    // Emit to socket
    socket.emit('message', newMessage);
    
    setInputValue('');
  };

  const resolveDirective = (directiveId: string) => {
    setDirectives(prev => prev.map(dir => 
      dir.id === directiveId 
        ? { ...dir, resolved: true, resolvedAt: new Date() }
        : dir
    ));

    notification.success({
      message: 'Directive Resolved',
      description: 'Directive has been marked as resolved.',
      duration: 3
    });
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <StyledDrawer
      title={
        <Space>
          <MessageOutlined />
          Live Meeting Chat
          <Badge count={messages.length} style={{ backgroundColor: '#0095CE' }} />
        </Space>
      }
      placement="right"
      width={400}
      open={visible}
      onClose={onClose}
    >
      <ChatContainer>
        {/* Participants */}
        <ParticipantsList>
          <Title level={5} style={{ margin: '0 0 8px 0', fontSize: 14 }}>
            Participants ({participants.filter(p => p.online).length} online)
          </Title>
          <Space wrap>
            {participants.map(participant => (
              <Tooltip key={participant.id} title={`${participant.name} (${participant.role})`}>
                <Badge 
                  status={participant.online ? 'success' : 'default'} 
                  dot
                  offset={[-2, 2]}
                >
                  <Avatar 
                    size="small" 
                    icon={<UserOutlined />}
                    style={{ 
                      background: participant.role === 'executive' ? '#1890ff' : 
                                 participant.role === 'secretary' ? '#52c41a' : '#fa8c16'
                    }}
                  />
                </Badge>
              </Tooltip>
            ))}
          </Space>
        </ParticipantsList>

        {/* Directives Panel */}
        {directives.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Title level={5} style={{ margin: '0 0 12px 0', fontSize: 14 }}>
              Meeting Directives
            </Title>
            {directives.map(directive => (
              <DirectiveCard 
                key={directive.id} 
                size="small"
                className={directive.resolved ? 'resolved' : ''}
                extra={
                  !directive.resolved ? (
                    <Button 
                      type="link" 
                      size="small"
                      onClick={() => resolveDirective(directive.id)}
                      style={{ padding: 0 }}
                    >
                      Mark Resolved
                    </Button>
                  ) : (
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  )
                }
              >
                <Text style={{ fontSize: 12 }}>{directive.text}</Text>
                <div style={{ marginTop: 4, fontSize: 10, opacity: 0.7 }}>
                  By {directive.createdBy} • {formatTime(directive.createdAt)}
                  {directive.resolved && directive.resolvedAt && (
                    <span> • Resolved {formatTime(directive.resolvedAt)}</span>
                  )}
                </div>
              </DirectiveCard>
            ))}
          </div>
        )}

        {/* Messages */}
        <MessagesContainer>
          {messages.map(message => (
            <MessageBubble
              key={message.id}
              isOwn={message.userId === currentUser.id}
              type={message.type}
            >
              <div className="message-content">
                {!message.userId === currentUser.id && (
                  <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4 }}>
                    {message.userName}
                  </div>
                )}
                <div className="message-text">
                  {message.type === 'directive' ? (
                    <div>
                      <ExclamationCircleOutlined style={{ marginRight: 4 }} />
                      <strong>Directive:</strong> {message.message.substring(11)}
                    </div>
                  ) : (
                    message.message
                  )}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </MessageBubble>
          ))}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        {/* Input */}
        <InputContainer>
          <Space.Compact style={{ width: '100%' }}>
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message... Use '/directive' to create a directive"
              autoSize={{ minRows: 1, maxRows: 3 }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              style={{ borderRadius: '8px 0 0 8px' }}
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              onClick={sendMessage}
              style={{ 
                background: '#0095CE', 
                borderColor: '#0095CE',
                borderRadius: '0 8px 8px 0'
              }}
            />
          </Space.Compact>
          <div style={{ marginTop: 8, fontSize: 11, color: '#666' }}>
            <Text type="secondary">
              💡 Tip: Start your message with "/directive" to create a meeting directive
            </Text>
          </div>
        </InputContainer>
      </ChatContainer>
    </StyledDrawer>
  );
};