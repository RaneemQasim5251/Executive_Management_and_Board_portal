import React from 'react';
import { Card, Typography, Space, Button, Tag } from 'antd';
import { CustomLayout } from '../components/layout';

const { Title, Paragraph, Text } = Typography;

export const DemoSidebarPage: React.FC = () => {
  return (
    <CustomLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2} style={{ color: '#0C085C', marginBottom: '24px' }}>
          🎯 MUI-Style Sidebar Demo
        </Title>
        
        <Paragraph style={{ fontSize: '16px', marginBottom: '32px' }}>
          This page demonstrates the new responsive sidebar layout inspired by the 
          <a href="https://github.com/adminmart/react-mui-sidebar" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '4px' }}>
            react-mui-sidebar
          </a> library. The sidebar is collapsible, responsive, and includes all your existing navigation items.
        </Paragraph>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="✨ Features" style={{ borderRadius: '12px' }}>
            <Space direction="vertical" size="middle">
              <div>
                <Text strong>🎨 MUI-Inspired Design:</Text>
                <br />
                <Text type="secondary">Clean, modern interface with smooth animations and hover effects</Text>
              </div>
              <div>
                <Text strong>📱 Responsive Layout:</Text>
                <br />
                <Text type="secondary">Automatically adapts to mobile devices with collapsible sidebar</Text>
              </div>
              <div>
                <Text strong>🔍 Search Functionality:</Text>
                <br />
                <Text type="secondary">Integrated search bar with icon and focus states</Text>
              </div>
              <div>
                <Text strong>👤 User Profile:</Text>
                <br />
                <Text type="secondary">User avatar and information display in the sidebar footer</Text>
              </div>
              <div>
                <Text strong>📊 Badge Support:</Text>
                <br />
                <Text type="secondary">Notification badges on menu items (e.g., Secretary Workspace)</Text>
              </div>
            </Space>
          </Card>

          <Card title="🎛️ Controls" style={{ borderRadius: '12px' }}>
            <Space direction="vertical" size="middle">
              <div>
                <Text strong>Toggle Sidebar:</Text>
                <br />
                <Text type="secondary">Click the hamburger button in the top-right corner of the sidebar</Text>
              </div>
              <div>
                <Text strong>Hover to Expand:</Text>
                <br />
                <Text type="secondary">Hover over the collapsed sidebar to temporarily expand it</Text>
              </div>
              <div>
                <Text strong>Mobile Responsive:</Text>
                <br />
                <Text type="secondary">On mobile devices, the sidebar becomes a slide-out menu</Text>
              </div>
            </Space>
          </Card>

          <Card title="🎨 Theme Integration" style={{ borderRadius: '12px' }}>
            <Space direction="vertical" size="middle">
              <div>
                <Text strong>Dark/Light Mode:</Text>
                <br />
                <Text type="secondary">The sidebar automatically adapts to your current theme setting</Text>
              </div>
              <div>
                <Text strong>RTL Support:</Text>
                <br />
                <Text type="secondary">Full right-to-left language support for Arabic</Text>
              </div>
              <div>
                <Text strong>Brand Colors:</Text>
                <br />
                <Text type="secondary">Uses your brand colors: Federal Blue (#0C085C), Egyptian Blue (#363692)</Text>
              </div>
            </Space>
          </Card>

          <Card title="🔗 Navigation Items" style={{ borderRadius: '12px' }}>
            <Space wrap>
              <Tag color="blue">Home</Tag>
              <Tag color="blue">Dashboard</Tag>
              <Tag color="green">Enterprise Systems</Tag>
              <Tag color="orange">Companies</Tag>
              <Tag color="purple">Secretary Workspace</Tag>
              <Tag color="cyan">Strategic Planning</Tag>
              <Tag color="magenta">Reports</Tag>
              <Tag color="volcano">Kanban</Tag>
              <Tag color="geekblue">Timeline</Tag>
              <Tag color="lime">My Meetings</Tag>
            </Space>
            <Paragraph style={{ marginTop: '16px', marginBottom: 0 }}>
              <Text type="secondary">
                All your existing navigation items are preserved and enhanced with the new sidebar design.
                Submenus are supported (e.g., Companies → JTC, Energy, JOIL, etc.)
              </Text>
            </Paragraph>
          </Card>
        </Space>
      </div>
    </CustomLayout>
  );
};
