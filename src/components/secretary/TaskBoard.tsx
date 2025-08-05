import React from 'react';
import { Card, List, Tag, Avatar, Button, Space, Typography } from 'antd';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Task } from '../../types/secretary';

const { Text } = Typography;

const TaskCard = styled(Card)`
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  .ant-card-body {
    padding: 12px;
  }
`;

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onTaskClick }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#fa8c16';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'processing';
      case 'pending': return 'default';
      default: return 'default';
    }
  };

  return (
    <List
      dataSource={tasks}
      renderItem={(task) => (
        <TaskCard size="small" onClick={() => onTaskClick?.(task)}>
          <Space direction="vertical" style={{ width: '100%' }} size={4}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text strong style={{ fontSize: 14 }}>{task.title}</Text>
              <Tag color={getPriorityColor(task.priority)} style={{ margin: 0 }}>
                {task.priority.toUpperCase()}
              </Tag>
            </div>
            
            <Space size={8}>
              <Avatar size="small" icon={<UserOutlined />} />
              <Text type="secondary" style={{ fontSize: 12 }}>{task.owner}</Text>
            </Space>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space size={4}>
                <ClockCircleOutlined style={{ fontSize: 12, color: '#999' }} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {task.start.toLocaleDateString()}
                </Text>
              </Space>
              <Tag color={getStatusColor(task.status)} style={{ margin: 0, fontSize: 10 }}>
                {task.status.replace('-', ' ').toUpperCase()}
              </Tag>
            </div>
            
            {task.directives.length > 0 && (
              <Text type="secondary" style={{ fontSize: 11 }}>
                {task.directives.length} directive(s)
              </Text>
            )}
          </Space>
        </TaskCard>
      )}
    />
  );
};