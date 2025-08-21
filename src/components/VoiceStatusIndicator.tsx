import React from 'react';
import { Badge } from 'antd';
import { AudioOutlined } from '@ant-design/icons';

interface VoiceStatusIndicatorProps {
  isListening?: boolean;
  size?: 'default' | 'small';
  style?: React.CSSProperties;
}

export const VoiceStatusIndicator: React.FC<VoiceStatusIndicatorProps> = ({ 
  isListening = false, 
  size = 'default',
  style 
}) => {
  return (
    <Badge 
      dot
      status={isListening ? 'processing' : 'default'}
      offset={[-5, 5]}
      styles={{
        dot: {
          backgroundColor: isListening ? '#52c41a' : 'transparent',
          boxShadow: isListening 
            ? '0 0 0 2px rgba(82, 196, 26, 0.2)' 
            : 'none'
        }
      }}
    >
      <div 
        style={{ 
          width: size === 'small' ? 24 : 32, 
          height: size === 'small' ? 24 : 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          backgroundColor: isListening 
            ? 'rgba(82, 196, 26, 0.1)' 
            : 'transparent'
        }}
      >
        <AudioOutlined 
          style={{ 
            color: isListening ? '#52c41a' : '#6b7280',
            fontSize: size === 'small' ? 14 : 18 
          }} 
        />
      </div>
    </Badge>
  );
};

export default VoiceStatusIndicator;
