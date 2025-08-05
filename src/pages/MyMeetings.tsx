import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Typography, 
  Space, 
  Tag, 
  Modal, 
  Input, 
  notification,
  Empty,
  Tooltip,
  Avatar
} from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  CheckOutlined, 
  CloseOutlined,
  UserOutlined,
  EnvironmentOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useList, useUpdate, useGetIdentity } from '@refinedev/core';
import { useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { Meeting, Attendee } from '../types/secretary';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const PageContainer = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
`;

const MeetingCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    
    .ant-card-head-title {
      color: #0C085C;
      font-weight: 600;
      font-size: 16px;
    }
  }
`;

const AttendButton = styled(Button)`
  background: #0095CE;
  border-color: #0095CE;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  
  &:hover {
    background: #363692;
    border-color: #363692;
    color: white;
  }
  
  &:focus {
    background: #363692;
    border-color: #363692;
    color: white;
  }
`;

const DeclineButton = styled(Button)`
  background: #FF2424;
  border-color: #FF2424;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  
  &:hover {
    background: #CC1D1D;
    border-color: #CC1D1D;
    color: white;
  }
  
  &:focus {
    background: #CC1D1D;
    border-color: #CC1D1D;
    color: white;
  }
`;

const StatusTag = styled(Tag)<{ status: string }>`
  border-radius: 12px;
  font-weight: 500;
  padding: 4px 12px;
  
  &.pending {
    background: #fff7e6;
    border-color: #ffd591;
    color: #d46b08;
  }
  
  &.accepted {
    background: #f6ffed;
    border-color: #b7eb8f;
    color: #389e0d;
  }
  
  &.declined {
    background: #fff2f0;
    border-color: #ffccc7;
    color: #cf1322;
  }
`;

export const MyMeetings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [loading, setLoading] = useState(false);

  // Get current user
  const { data: user } = useGetIdentity<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>();

  // Mock data for meetings - in real app, this would fetch from API
  const mockMeetings: Meeting[] = [
    {
      id: 'meeting-1',
      title: 'Q4 2024 Board Review - Al Jeri Investment',
      date: new Date('2024-12-25T10:00:00'),
      companyId: '1',
      quarterId: 'q4-2024',
      agenda: [
        {
          id: 'agenda-1',
          title: 'Financial Performance Review Q4',
          start: new Date('2024-12-15T10:00:00'),
          end: new Date('2024-12-15T10:45:00'),
          owner: 'CFO - Ahmed Al-Rashid',
          status: 'pending',
          priority: 'high',
          directives: []
        },
        {
          id: 'agenda-2',
          title: 'JTC Transport Performance Update',
          start: new Date('2024-12-15T10:45:00'),
          end: new Date('2024-12-15T11:15:00'),
          owner: 'JTC General Manager',
          status: 'pending',
          priority: 'high',
          directives: []
        },
        {
          id: 'agenda-3',
          title: 'J:Oil Expansion Strategy Discussion',
          start: new Date('2024-12-15T11:15:00'),
          end: new Date('2024-12-15T11:45:00'),
          owner: 'J:Oil Operations Director',
          status: 'pending',
          priority: 'medium',
          directives: []
        },
        {
          id: 'agenda-4',
          title: '45 Degrees Cafe Growth Plan 2025',
          start: new Date('2024-12-15T11:45:00'),
          end: new Date('2024-12-15T12:15:00'),
          owner: 'F&B Division Head',
          status: 'pending',
          priority: 'medium',
          directives: []
        }
      ],
      status: 'scheduled',
      location: 'Al Jeri Executive Board Room - 42nd Floor',
      description: 'Comprehensive quarterly review covering all business units: JTC Transport (1250+ trucks), J:Oil (207 stations), Shaheen Rent-a-Car, 45 Degrees Cafe, and Energy Division. Key focus on Q4 performance, 2025 strategic planning, and digital transformation initiatives.',
      attendees: [
        {
          id: 'att-1',
          name: 'Dr. Khalid Al-Jeri',
          email: 'khalid.aljeri@aljeri.com',
          role: 'executive',
          status: 'accepted'
        },
        {
          id: 'att-2',
          name: 'Sarah Al-Mansouri',
          email: 'sarah.mansouri@aljeri.com',
          role: 'executive',
          status: 'pending'
        },
        {
          id: 'att-3',
          name: 'Mohammed Al-Rashid',
          email: 'mohammed.rashid@aljeri.com',
          role: 'executive',
          status: 'accepted'
        },
        {
          id: 'att-4',
          name: 'Fatima Al-Zahra',
          email: 'fatima.zahra@aljeri.com',
          role: 'executive',
          status: 'pending'
        },
        {
          id: 'att-demo',
          name: 'Demo User',
          email: 'demo@aljeri.com',
          role: 'executive',
          status: 'pending'
        }
      ],
      votes: []
    },
    {
      id: 'meeting-2',
      title: '2025 Strategic Planning & Digital Transformation',
      date: new Date('2024-12-30T14:00:00'),
      companyId: '2',
      quarterId: 'q1-2025',
      agenda: [
        {
          id: 'agenda-5',
          title: 'Digital Transformation Roadmap',
          start: new Date('2024-12-20T14:00:00'),
          end: new Date('2024-12-20T15:00:00'),
          owner: 'CTO - Technology Division',
          status: 'pending',
          priority: 'high',
          directives: []
        },
        {
          id: 'agenda-6',
          title: 'Market Expansion Strategy - UAE & Jordan',
          start: new Date('2024-12-20T15:00:00'),
          end: new Date('2024-12-20T15:45:00'),
          owner: 'Head of Business Development',
          status: 'pending',
          priority: 'high',
          directives: []
        },
        {
          id: 'agenda-7',
          title: 'Sustainability & Green Energy Initiatives',
          start: new Date('2024-12-20T15:45:00'),
          end: new Date('2024-12-20T16:30:00'),
          owner: 'Al Jeri Energy Director',
          status: 'pending',
          priority: 'medium',
          directives: []
        }
      ],
      status: 'scheduled',
      location: 'Al Jeri Innovation Center - Conference Hall',
      description: 'Strategic planning session for 2025 focusing on digital transformation across all business units, market expansion into UAE and Jordan, and sustainability initiatives. Discussion on TMS implementation for JTC, CRM systems for J:Oil, and renewable energy projects.',
      attendees: [
        {
          id: 'att-5',
          name: 'Dr. Khalid Al-Jeri',
          email: 'khalid.aljeri@aljeri.com',
          role: 'executive',
          status: 'accepted'
        },
        {
          id: 'att-6',
          name: 'Sarah Al-Mansouri',
          email: 'sarah.mansouri@aljeri.com',
          role: 'executive',
          status: 'pending'
        },
        {
          id: 'att-7',
          name: 'Omar Al-Fahad',
          email: 'omar.fahad@aljeri.com',
          role: 'executive',
          status: 'pending'
        },
        {
          id: 'att-demo2',
          name: 'Demo User',
          email: 'demo@aljeri.com',
          role: 'executive',
          status: 'pending'
        }
      ],
      votes: []
    },
    {
      id: 'meeting-3',
      title: 'Emergency Board Meeting - Market Response Strategy',
      date: new Date('2024-12-28T16:00:00'),
      companyId: '1',
      quarterId: 'q4-2024',
      agenda: [
        {
          id: 'agenda-8',
          title: 'Market Volatility Response Plan',
          start: new Date('2024-12-12T16:00:00'),
          end: new Date('2024-12-12T16:30:00'),
          owner: 'Chief Strategy Officer',
          status: 'pending',
          priority: 'critical',
          directives: []
        },
        {
          id: 'agenda-9',
          title: 'Risk Management Assessment',
          start: new Date('2024-12-12T16:30:00'),
          end: new Date('2024-12-12T17:00:00'),
          owner: 'Risk Management Director',
          status: 'pending',
          priority: 'critical',
          directives: []
        }
      ],
      status: 'scheduled',
      location: 'Virtual Meeting - Microsoft Teams',
      description: 'Urgent board meeting to address recent market developments and their impact on Al Jeri Investment portfolio. Focus on immediate response strategies and risk mitigation across all business units.',
      attendees: [
        {
          id: 'att-8',
          name: 'Dr. Khalid Al-Jeri',
          email: 'khalid.aljeri@aljeri.com',
          role: 'executive',
          status: 'accepted'
        },
        {
          id: 'att-9',
          name: 'Sarah Al-Mansouri',
          email: 'sarah.mansouri@aljeri.com',
          role: 'executive',
          status: 'declined',
          reason: 'Traveling for JTC expansion meetings in UAE'
        },
        {
          id: 'att-10',
          name: 'Mohammed Al-Rashid',
          email: 'mohammed.rashid@aljeri.com',
          role: 'executive',
          status: 'pending'
        },
        {
          id: 'att-demo3',
          name: 'Demo User',
          email: 'demo@aljeri.com',
          role: 'executive',
          status: 'pending'
        }
      ],
      votes: []
    }
  ];

  // Demo user email for testing - in real app, this comes from auth
  const demoUserEmail = user?.email || 'demo@aljeri.com';
  
  // Filter meetings for current user and future dates
  const userMeetings = mockMeetings.filter(meeting => 
    meeting.date >= new Date() && 
    meeting.attendees.some(att => att.email === demoUserEmail)
  );

  const { mutateAsync: updateMeeting } = useUpdate();

  const handleAttend = async (meeting: Meeting) => {
    setLoading(true);
    try {
      // Update attendee status to accepted
      const updatedAttendees = meeting.attendees.map(att => 
        att.email === demoUserEmail 
          ? { ...att, status: 'accepted' as const, reason: undefined }
          : att
      );

      await updateMeeting({
        resource: 'meetings',
        id: meeting.id,
        values: {
          attendees: updatedAttendees
        }
      });

      // Invalidate queries to update dashboard
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      
      notification.success({
        message: t('myMeetings.attendanceConfirmed'),
        description: `${meeting.title}`,
        duration: 3
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to confirm attendance',
        duration: 3
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setDeclineModalVisible(true);
    setDeclineReason('');
  };

  const submitDecline = async () => {
    if (!declineReason.trim()) {
      notification.warning({
        message: t('myMeetings.reasonRequired'),
        duration: 3
      });
      return;
    }

    if (!selectedMeeting) return;

    setLoading(true);
    try {
      // Update attendee status to declined with reason
      const updatedAttendees = selectedMeeting.attendees.map(att => 
        att.email === demoUserEmail 
          ? { ...att, status: 'declined' as const, reason: declineReason }
          : att
      );

      await updateMeeting({
        resource: 'meetings',
        id: selectedMeeting.id,
        values: {
          attendees: updatedAttendees
        }
      });

      // Invalidate queries to update dashboard
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      
      notification.success({
        message: t('myMeetings.declineSubmitted'),
        description: `${selectedMeeting.title}`,
        duration: 3
      });

      setDeclineModalVisible(false);
      setSelectedMeeting(null);
      setDeclineReason('');
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to submit decline',
        duration: 3
      });
    } finally {
      setLoading(false);
    }
  };

  const getAttendeeStatus = (meeting: Meeting): 'pending' | 'accepted' | 'declined' => {
    const userAttendee = meeting.attendees.find(att => att.email === demoUserEmail);
    return userAttendee?.status || 'pending';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return t('buttons.attend');
      case 'declined': return t('buttons.decline');
      default: return 'Pending';
    }
  };

  return (
    <PageContainer>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: '#0C085C', margin: 0 }}>
          {t('myMeetings.title')}
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          {userMeetings.length} upcoming meeting{userMeetings.length !== 1 ? 's' : ''}
        </Text>
      </div>

      {userMeetings.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Empty
            description={t('myMeetings.noMeetings')}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      ) : (
        <Row gutter={[24, 24]}>
          {userMeetings.map(meeting => {
            const status = getAttendeeStatus(meeting);
            const isActionable = status === 'pending';
            
            return (
              <Col xs={24} lg={12} xl={8} key={meeting.id}>
                <MeetingCard
                  title={meeting.title}
                  extra={
                    <StatusTag status={status} className={status}>
                      {getStatusText(status)}
                    </StatusTag>
                  }
                  actions={isActionable ? [
                    <AttendButton
                      key="attend"
                      icon={<CheckOutlined />}
                      onClick={() => handleAttend(meeting)}
                      loading={loading}
                    >
                      {t('buttons.attend')}
                    </AttendButton>,
                    <DeclineButton
                      key="decline"
                      icon={<CloseOutlined />}
                      onClick={() => handleDecline(meeting)}
                      loading={loading}
                    >
                      {t('buttons.decline')}
                    </DeclineButton>
                  ] : undefined}
                >
                  <Space direction="vertical" style={{ width: '100%' }} size={12}>
                    {/* Date and Time */}
                    <div>
                      <Space>
                        <CalendarOutlined style={{ color: '#0095CE' }} />
                        <Text strong>{formatDate(meeting.date)}</Text>
                      </Space>
                      <br />
                      <Space style={{ marginTop: 4 }}>
                        <ClockCircleOutlined style={{ color: '#0095CE' }} />
                        <Text>{formatTime(meeting.date)}</Text>
                      </Space>
                    </div>

                    {/* Location */}
                    {meeting.location && (
                      <Space>
                        <EnvironmentOutlined style={{ color: '#52c41a' }} />
                        <Text>{meeting.location}</Text>
                      </Space>
                    )}

                    {/* Description */}
                    {meeting.description && (
                      <Paragraph 
                        ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
                        style={{ margin: 0, color: '#666' }}
                      >
                        {meeting.description}
                      </Paragraph>
                    )}

                    {/* Agenda Summary */}
                    {meeting.agenda.length > 0 && (
                      <div>
                        <Space style={{ marginBottom: 8 }}>
                          <FileTextOutlined style={{ color: '#fa8c16' }} />
                          <Text strong>Agenda ({meeting.agenda.length} items)</Text>
                        </Space>
                        <div style={{ paddingLeft: 20 }}>
                          {meeting.agenda.slice(0, 2).map((item, index) => (
                            <div key={item.id} style={{ marginBottom: 4 }}>
                              <Text style={{ fontSize: 12, color: '#666' }}>
                                {index + 1}. {item.title}
                              </Text>
                            </div>
                          ))}
                          {meeting.agenda.length > 2 && (
                            <Text style={{ fontSize: 12, color: '#999' }}>
                              +{meeting.agenda.length - 2} more items
                            </Text>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Attendees */}
                    <div>
                      <Text strong style={{ fontSize: 12, color: '#666' }}>
                        Attendees ({meeting.attendees.length})
                      </Text>
                      <div style={{ marginTop: 8 }}>
                        <Avatar.Group maxCount={4} size="small">
                          {meeting.attendees.map(attendee => (
                            <Tooltip key={attendee.id} title={`${attendee.name} (${attendee.status})`}>
                              <Avatar 
                                icon={<UserOutlined />}
                                style={{ 
                                  backgroundColor: attendee.status === 'accepted' ? '#52c41a' : 
                                                 attendee.status === 'declined' ? '#ff4d4f' : '#d9d9d9'
                                }}
                              />
                            </Tooltip>
                          ))}
                        </Avatar.Group>
                      </div>
                    </div>
                  </Space>
                </MeetingCard>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Decline Modal */}
      <Modal
        title={t('myMeetings.declineReason')}
        open={declineModalVisible}
        onCancel={() => setDeclineModalVisible(false)}
        onOk={submitDecline}
        confirmLoading={loading}
        okText={t('myMeetings.declineAttendance')}
        cancelText={t('Cancel')}
        okButtonProps={{ danger: true }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text>
            Meeting: <strong>{selectedMeeting?.title}</strong>
          </Text>
        </div>
        <TextArea
          value={declineReason}
          onChange={(e) => setDeclineReason(e.target.value)}
          placeholder={t('myMeetings.reasonPlaceholder')}
          rows={4}
          maxLength={500}
          showCount
        />
      </Modal>
    </PageContainer>
  );
};