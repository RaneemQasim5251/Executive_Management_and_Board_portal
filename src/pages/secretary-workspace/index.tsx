import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Button, 
  Select, 
  Typography, 
  Row, 
  Col, 
  Badge, 
  Avatar, 
  Dropdown, 
  Space,
  Statistic,
  Progress,
  notification
} from 'antd';
import { 
  CalendarOutlined, 
  UserOutlined, 
  BellOutlined,
  PlusOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import styled from 'styled-components';
import { useTranslate } from '@refinedev/core';
import { MeetingModal } from '../../components/secretary/MeetingModal';
import { LiveChat } from '../../components/secretary/LiveChat';
import { QuarterlyKPIs } from '../../components/secretary/QuarterlyKPIs';
import { TaskBoard } from '../../components/secretary/TaskBoard';
import { AttendanceTracker } from '../../components/secretary/AttendanceTracker';
import { Meeting, Quarter, Company, Task, SecretaryWorkspaceState } from '../../types/secretary';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

// Styled Components with Brand Colors
const WorkspaceContainer = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(135deg, #0C085C 0%, #363692 50%, #0095CE 100%);
`;

const StyledSider = styled(Sider)`
  background: rgba(12, 8, 92, 0.95) !important;
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  
  .ant-layout-sider-children {
    padding: 24px 16px;
  }
`;

const StyledContent = styled(Content)`
  padding: 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px 0 0 0;
  margin-left: 0;
`;

const HeaderCard = styled(Card)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  margin-bottom: 24px;
  
  .ant-card-body {
    padding: 16px 24px;
  }
`;

const CalendarCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  .fc {
    font-family: inherit;
  }
  
  .fc-event {
    background: #0095CE;
    border: none;
    border-radius: 8px;
    padding: 4px 8px;
  }
  
  .fc-event:hover {
    background: #363692;
  }
  
  .fc-daygrid-day-number {
    color: #0C085C;
    font-weight: 600;
  }
  
  .fc-day-today {
    background: rgba(0, 149, 206, 0.1) !important;
  }
`;

const SidebarCard = styled(Card)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  margin-bottom: 16px;
  
  .ant-card-body {
    padding: 16px;
  }
  
  .ant-card-head {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .ant-card-head-title {
      color: white;
      font-weight: 600;
    }
  }
`;

const ActionButton = styled(Button)`
  border-radius: 8px;
  height: 40px;
  font-weight: 600;
  
  &.primary {
    background: #0095CE;
    border-color: #0095CE;
    
    &:hover {
      background: #363692;
      border-color: #363692;
    }
  }
  
  &.danger {
    background: #FF2424;
    border-color: #FF2424;
    
    &:hover {
      background: #CC1D1D;
      border-color: #CC1D1D;
    }
  }
`;

export const SecretaryWorkspace: React.FC = () => {
  const t = useTranslate();
  const [state, setState] = useState<SecretaryWorkspaceState>({
    selectedDate: new Date(),
    selectedQuarter: {
      id: 'q3-2024',
      year: 2024,
      label: 'Q3',
      closed: false,
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-09-30')
    },
    meetings: [],
    tasks: [],
    companies: [
      { id: '1', name: 'JTC', sector: 'Transport & Logistics' },
      { id: '2', name: 'Al Jeri Investment', sector: 'Investment' },
      { id: '3', name: 'J:Oil', sector: 'Petroleum' },
      { id: '4', name: '45 Degrees', sector: 'Food & Beverage' },
      { id: '5', name: 'Shaheen', sector: 'Automotive' }
    ],
    quarters: [
      { id: 'q3-2024', year: 2024, label: 'Q3', closed: false, startDate: new Date('2024-07-01'), endDate: new Date('2024-09-30') },
      { id: 'q2-2024', year: 2024, label: 'Q2', closed: true, startDate: new Date('2024-04-01'), endDate: new Date('2024-06-30') },
      { id: 'q1-2024', year: 2024, label: 'Q1', closed: true, startDate: new Date('2024-01-01'), endDate: new Date('2024-03-31') }
    ],
    currentUser: {
      id: 'user-1',
      name: 'Executive Secretary',
      role: 'secretary',
      avatar: '/avatars/secretary.jpg'
    }
  });

  const [isMeetingModalVisible, setIsMeetingModalVisible] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isChatVisible, setIsChatVisible] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockMeetings: Meeting[] = [
      {
        id: 'meeting-1',
        title: 'Q3 Board Meeting',
        date: new Date('2024-04-24'),
        companyId: '1',
        quarterId: 'q3-2024',
        agenda: [],
        status: 'scheduled',
        attendees: [
          { id: 'att-1', name: 'CEO', email: 'ceo@company.com', role: 'executive', status: 'pending' },
          { id: 'att-2', name: 'CFO', email: 'cfo@company.com', role: 'executive', status: 'accepted' }
        ],
        votes: []
      }
    ];

    setState(prev => ({ ...prev, meetings: mockMeetings }));
  }, []);

  const handleDateClick = (arg: any) => {
    setState(prev => ({ ...prev, selectedDate: new Date(arg.date) }));
    setSelectedMeeting(null);
    setIsMeetingModalVisible(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const meeting = state.meetings.find(m => m.id === clickInfo.event.id);
    if (meeting) {
      setSelectedMeeting(meeting);
      setIsMeetingModalVisible(true);
    }
  };

  const handleCreateMeeting = (meetingData: Partial<Meeting>) => {
    const newMeeting: Meeting = {
      id: `meeting-${Date.now()}`,
      title: meetingData.title || 'New Meeting',
      date: meetingData.date || state.selectedDate,
      companyId: meetingData.companyId || '1',
      quarterId: state.selectedQuarter.id,
      agenda: meetingData.agenda || [],
      status: 'scheduled',
      attendees: meetingData.attendees || [],
      votes: []
    };

    setState(prev => ({
      ...prev,
      meetings: [...prev.meetings, newMeeting]
    }));

    notification.success({
      message: 'Meeting Created',
      description: 'Meeting has been successfully scheduled.'
    });

    setIsMeetingModalVisible(false);
  };

  const calendarEvents = state.meetings.map(meeting => ({
    id: meeting.id,
    title: meeting.title,
    date: meeting.date,
    backgroundColor: meeting.status === 'completed' ? '#52c41a' : 
                    meeting.status === 'in-progress' ? '#1890ff' : '#0095CE',
    borderColor: 'transparent'
  }));

  const pendingDirectivesCount = 4; // Mock data
  const upcomingMeetingsCount = state.meetings.filter(m => 
    m.date > new Date() && m.status === 'scheduled'
  ).length;

  return (
    <WorkspaceContainer>
      <StyledSider width={280} collapsible={false}>
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ 
            width: 60, 
            height: 60, 
            background: 'white', 
            borderRadius: 12, 
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{ color: '#0C085C', fontWeight: 'bold', fontSize: 16 }}>Logo</Text>
          </div>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            Executive-Secretary<br />Workspace
          </Title>
        </div>

        {/* Quick Actions */}
        <SidebarCard title="Quick Actions" size="small">
          <Space direction="vertical" style={{ width: '100%' }} size={8}>
            <ActionButton 
              type="primary" 
              icon={<PlusOutlined />} 
              block
              className="primary"
              onClick={() => setIsMeetingModalVisible(true)}
            >
              Create Meeting Agenda
            </ActionButton>
            <ActionButton 
              type="default" 
              icon={<CalendarOutlined />} 
              block
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Task Board
            </ActionButton>
            <ActionButton 
              type="default" 
              icon={<MessageOutlined />} 
              block
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              onClick={() => setIsChatVisible(true)}
            >
              Board Resolutions
            </ActionButton>
          </Space>
        </SidebarCard>

        {/* Recent Activity */}
        <SidebarCard title="Recent Activity" size="small">
          <Space direction="vertical" style={{ width: '100%' }} size={8}>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              <Avatar size={24} style={{ marginRight: 8 }} />
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                Nuka Ming - Rolling Thatmade (Conf)
              </Text>
              <div style={{ fontSize: 10, opacity: 0.6 }}>11:28</div>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              <Avatar size={24} style={{ marginRight: 8, background: '#1890ff' }} />
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                Zrd WarFornio - Frdsetcoaanmexcosrpagamal
              </Text>
              <div style={{ fontSize: 10, opacity: 0.6 }}>10:58</div>
            </div>
          </Space>
        </SidebarCard>
      </StyledSider>

      <StyledContent>
        {/* Header */}
        <HeaderCard>
          <Row justify="space-between" align="middle">
            <Col>
              <Space align="center">
                <Title level={3} style={{ margin: 0, color: 'white' }}>
                  Executive-Secretary Dashboard
                </Title>
                <Badge count={pendingDirectivesCount} style={{ backgroundColor: '#FF2424' }}>
                  <BellOutlined style={{ fontSize: 20, color: 'white' }} />
                </Badge>
              </Space>
            </Col>
            <Col>
              <Space align="center">
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Tuesday, April 23, 2024
                </Text>
                <Avatar src="/avatars/user.jpg" />
              </Space>
            </Col>
          </Row>
        </HeaderCard>

        <Row gutter={[24, 24]}>
          {/* Main Calendar */}
          <Col xs={24} lg={16}>
            <CalendarCard>
              <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                  <Space>
                    <ActionButton 
                      type="primary" 
                      className="primary"
                      onClick={() => setIsMeetingModalVisible(true)}
                    >
                      Attend
                    </ActionButton>
                    <ActionButton 
                      type="default" 
                      className="danger"
                    >
                      Decline
                    </ActionButton>
                  </Space>
                </Col>
                <Col>
                  <Select defaultValue="april-2024" style={{ minWidth: 120 }}>
                    <Option value="april-2024">April 2024</Option>
                    <Option value="march-2024">March 2024</Option>
                    <Option value="may-2024">May 2024</Option>
                  </Select>
                </Col>
              </Row>
              
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                events={calendarEvents}
                height="auto"
                headerToolbar={{
                  left: 'prev,next',
                  center: 'title',
                  right: ''
                }}
              />
            </CalendarCard>
          </Col>

          {/* Quarterly Overview */}
          <Col xs={24} lg={8}>
            <Card title="Quarter" extra={<Select defaultValue="q3" style={{ minWidth: 80 }}>
              <Option value="q3">Q3</Option>
              <Option value="q2">Q2</Option>
              <Option value="q1">Q1</Option>
            </Select>}>
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                <div>
                  <Row justify="space-between">
                    <Text>Q3</Text>
                    <Text>Closed</Text>
                  </Row>
                  <Row justify="space-between" style={{ marginTop: 8 }}>
                    <Text type="secondary">Previous Rating</Text>
                    <Text>3.7</Text>
                  </Row>
                  <Row justify="space-between" align="middle" style={{ marginTop: 8 }}>
                    <Text>
                      <ExclamationCircleOutlined style={{ color: '#FF2424', marginRight: 4 }} />
                      Pending Directives
                    </Text>
                    <Text strong>4.0</Text>
                  </Row>
                </div>

                <div>
                  <Row justify="space-between">
                    <Text>Q2</Text>
                    <Text style={{ color: '#FF2424' }}>Pending</Text>
                  </Row>
                  <Row justify="space-between" style={{ marginTop: 8 }}>
                    <Text type="secondary">Previous Rating</Text>
                    <Text>4.0</Text>
                  </Row>
                  <Row justify="space-between" align="middle" style={{ marginTop: 8 }}>
                    <Text>
                      <ExclamationCircleOutlined style={{ color: '#FF2424', marginRight: 4 }} />
                      Pending Directives
                    </Text>
                    <Text strong>4.0</Text>
                  </Row>
                </div>

                <div>
                  <Row justify="space-between">
                    <Text>Q1</Text>
                    <Text>Closed</Text>
                  </Row>
                  <Row justify="space-between" style={{ marginTop: 8 }}>
                    <Text type="secondary">Previous Rating</Text>
                    <Text>3.5</Text>
                  </Row>
                  <Row justify="space-between" align="middle" style={{ marginTop: 8 }}>
                    <Text>
                      <ExclamationCircleOutlined style={{ color: '#FF2424', marginRight: 4 }} />
                      Pending Directives
                    </Text>
                    <Text strong>4.0</Text>
                  </Row>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Modals */}
        <MeetingModal
          visible={isMeetingModalVisible}
          onCancel={() => setIsMeetingModalVisible(false)}
          onSubmit={handleCreateMeeting}
          meeting={selectedMeeting}
          companies={state.companies}
          selectedDate={state.selectedDate}
        />

        <LiveChat
          visible={isChatVisible}
          onClose={() => setIsChatVisible(false)}
          meetingId={selectedMeeting?.id}
        />
      </StyledContent>
    </WorkspaceContainer>
  );
};