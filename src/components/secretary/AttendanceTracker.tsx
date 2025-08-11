import React from 'react';
import { Card, Avatar, Tag, Space, Button, Typography, Row, Col } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined,
  UserOutlined 
} from '@ant-design/icons';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Attendee, Vote } from '../../types/secretary';

const { Text, Title } = Typography;

const AttendeeCard = styled.div<{ status: string }>`
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: ${props => {
    switch (props.status) {
      case 'accepted': return '#f6ffed';
      case 'declined': return '#fff2f0';
      default: return '#f5f5f5';
    }
  }};
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'accepted': return '#52c41a';
      case 'declined': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  }};
`;

const VoteButton = styled(Button)<{ voteType: 'approve' | 'decline' }>`
  border-radius: 6px;
  font-weight: 600;
  
  &.approve {
    background: #52c41a;
    border-color: #52c41a;
    color: white;
    
    &:hover {
      background: #73d13d;
      border-color: #73d13d;
    }
  }
  
  &.decline {
    background: #ff4d4f;
    border-color: #ff4d4f;
    color: white;
    
    &:hover {
      background: #ff7875;
      border-color: #ff7875;
    }
  }
`;

interface AttendanceTrackerProps {
  attendees: Attendee[];
  votes: Vote[];
  onVote?: (vote: 'approve' | 'decline', comment?: string) => void;
  currentUserId?: string;
  canVote?: boolean;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  attendees,
  votes,
  onVote,
  currentUserId = 'user-1',
  canVote = true
}) => {
  const { t, i18n } = useTranslation();
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'declined':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return t('Attending');
      case 'declined': return t('Not Attending');
      default: return t('Pending Response');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'executive': return 'blue';
      case 'secretary': return 'green';
      case 'viewer': return 'orange';
      default: return 'default';
    }
  };

  const currentUserVote = votes.find(vote => vote.userId === currentUserId);
  // const approveCount = votes.filter(vote => vote.vote === 'approve').length;
  // const declineCount = votes.filter(vote => vote.vote === 'decline').length;
  // const totalVotes = votes.length;
  const attendingCount = attendees.filter(att => att.status === 'accepted').length;

  return (
    <div>
      {/* Voting Section */}
      {canVote && !currentUserVote && (
        <Card title={t('Your Response')} style={{ marginBottom: 16, borderRadius: 12 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text>{t('Will you be attending this meeting?')}</Text>
            <Space>
              <VoteButton
                voteType="approve"
                className="approve"
                icon={<CheckCircleOutlined />}
                onClick={() => onVote?.('approve')}
              >
                {t('Attend')}
              </VoteButton>
              <VoteButton
                voteType="decline"
                className="decline"
                icon={<CloseCircleOutlined />}
                onClick={() => onVote?.('decline')}
              >
                {t('Decline')}
              </VoteButton>
            </Space>
          </Space>
        </Card>
      )}

      {/* Vote Summary */}
      <Card title={t('Attendance Summary')} style={{ marginBottom: 16, borderRadius: 12 }}>
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                {attendingCount}
              </Title>
              <Text type="secondary">{t('Attending')}</Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ margin: 0, color: '#ff4d4f' }}>
                {attendees.filter(att => att.status === 'declined').length}
              </Title>
              <Text type="secondary">{t('Declined')}</Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ margin: 0, color: '#d9d9d9' }}>
                {attendees.filter(att => att.status === 'pending').length}
              </Title>
              <Text type="secondary">{t('Pending')}</Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Attendees List */}
      <Card title={t('Attendees')} style={{ borderRadius: 12 }}>
        <div>
          {attendees.map(attendee => (
            <AttendeeCard key={attendee.id} status={attendee.status}>
              <Space style={{ width: '100%' }} direction="vertical" size={4}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <div>
                      <Text strong>{attendee.name}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {attendee.email}
                      </Text>
                    </div>
                  </Space>
                  <Space direction="vertical" align="end" size={2}>
                    <Tag color={getRoleColor(attendee.role)} style={{ margin: 0 }}>
                      {attendee.role.toUpperCase()}
                    </Tag>
                    <Space size={4}>
                      {getStatusIcon(attendee.status)}
                      <Text style={{ fontSize: 12 }}>
                        {getStatusText(attendee.status)}
                      </Text>
                    </Space>
                  </Space>
                </div>
                
                {attendee.joinedAt && (
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Joined at {attendee.joinedAt.toLocaleTimeString()}
                  </Text>
                )}
              </Space>
            </AttendeeCard>
          ))}
        </div>
      </Card>

      {/* Voting Results */}
      {votes.length > 0 && (
        <Card title={t('Voting Results')} style={{ marginTop: 16, borderRadius: 12 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {votes.map(vote => (
              <div key={vote.id} style={{ 
                padding: 8, 
                background: vote.vote === 'approve' ? '#f6ffed' : '#fff2f0',
                borderRadius: 6,
                borderLeft: `3px solid ${vote.vote === 'approve' ? '#52c41a' : '#ff4d4f'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Space>
                    {vote.vote === 'approve' ? 
                      <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                    }
                    <Text strong>
                      {attendees.find(att => att.id === vote.userId)?.name || 'Unknown'}
                    </Text>
                    <Text type="secondary">
                      {vote.vote === 'approve' ? t('approved') : t('declined')}
                    </Text>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {vote.createdAt.toLocaleTimeString()}
                  </Text>
                </div>
                {vote.comment && (
                  <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                    "{vote.comment}"
                  </Text>
                )}
              </div>
            ))}
          </Space>
        </Card>
      )}
    </div>
  );
};