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
      title: 'Q4 Board Review',
      date: new Date('2024-12-15T10:00:00'),
      companyId: '1',
      quarterId: 'q4-2024',
      agenda: [
        {
          id: 'agenda-1',
          title: 'Financial Performance Review',
          start: new Date('2024-12-15T10:00:00'),
          end: new Date('2024-12-15T10:30:00'),
          owner: 'CFO',
          status: 'pending',
          priority: 'high',
          directives: []
        },
        {
          id: 'agenda-2',
          title: 'Strategic Initiatives Update',
          start: new Date('2024-12-15T10:30:00'),
          end: new Date('2024-12-15T11:00:00'),
          owner: 'CEO',
          status: 'pending',
          priority: 'high',
          directives: []
        }
      ],
      status: 'scheduled',
      location: 'Board Room A',
      description: 'Quarterly board meeting to review performance and strategic initiatives.',
      attendees: [
        {
          id: 'att-1',
          name: 'Board Member 1',
          email: 'member1@company.com',
          role: 'executive',
          status: 'pending'
        },
        {
          id: 'att-2',
          name: 'Board Member 2',
          email: 'member2@company.com',
          role: 'executive',
          status: 'accepted'
        }
      ],
      votes: []
    },
    {
      id: 'meeting-2',
      title: 'Strategic Planning Session',
      date: new Date('2024-12-20T14:00:00'),
      companyId: '2',
      quarterId: 'q4-2024',
      agenda: [
        {
          id: 'agenda-3',
          title: '2025 Strategy Discussion',
          start: new Date('2024-12-20T14:00:00'),
          end: new Date('2024-12-20T16:00:00'),
          owner: 'Strategy Director',
          status: 'pending',
          priority: 'high',
          directives: []
        }
      ],
      status: 'scheduled',
      location: 'Conference Room B',
      description: 'Planning session for 2025 strategic initiatives and goals.',
      attendees: [
        {
          id: 'att-3',
          name: 'Board Member 1',
          email: 'member1@company.com',
          role: 'executive',
          status: 'pending'
        }
      ],
      votes: []
    }
  ];

  // Filter meetings for current user and future dates
  const userMeetings = mockMeetings.filter(meeting => 
    meeting.date >= new Date() && 
    meeting.attendees.some(att => att.email === user?.email)
  );

  const { mutateAsync: updateMeeting } = useUpdate();

  const handleAttend = async (meeting: Meeting) => {
    setLoading(true);
    try {
      // Update attendee status to accepted
      const updatedAttendees = meeting.attendees.map(att => 
        att.email === user?.email 
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
        att.email === user?.email 
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
    const userAttendee = meeting.attendees.find(att => att.email === user?.email);
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