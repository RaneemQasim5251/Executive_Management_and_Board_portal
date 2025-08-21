import React, { useState, useCallback } from 'react';
import { Button, Modal, Typography, Space, Card, message } from 'antd';
import { 
  AudioOutlined, 
  CloseOutlined, 
  CustomerServiceOutlined 
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { VoiceStatusIndicator } from './VoiceStatusIndicator';

const { Title, Text, Paragraph } = Typography;

interface VoiceControlProps {
  visible: boolean;
  onClose: () => void;
  onOpenAI?: () => void;
  onOpenThemeSettings?: () => void;
  onOpenNotifications?: () => void;
  onLanguageSwitch?: () => void;
  onThemeSwitch?: () => void;
}

export const VoiceControl: React.FC<VoiceControlProps> = ({ 
  visible, 
  onClose, 
  onOpenAI, 
  onOpenThemeSettings, 
  onOpenNotifications, 
  onLanguageSwitch, 
  onThemeSwitch 
}) => {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);

  const handleStartListening = useCallback(() => {
    // Simulated voice recognition start
    setIsListening(true);
    message.info(t('Voice Control Active'));
    
    // TODO: Implement actual voice recognition logic
    // This could involve:
    // 1. Checking browser support
    // 2. Requesting microphone permissions
    // 3. Starting voice recognition service
  }, [t]);

  const handleStopListening = useCallback(() => {
    // Stop voice recognition
    setIsListening(false);
    message.success(t('Voice Control Stopped'));
  }, [t]);

  return (
    <Modal
      title={
        <Space>
          {t('Voice Control Center')}
          <VoiceStatusIndicator 
            isListening={isListening} 
            size="small" 
          />
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      closeIcon={<CloseOutlined />}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Title level={4}>{t('Executive Voice Control')}</Title>
            <Text type="secondary">
              {t('Control the entire portal with your voice. Perfect for busy executives who need hands-free navigation during meetings or while reviewing documents.')}
            </Text>
          </div>
        </Card>

        <Card>
          <div style={{ textAlign: 'center' }}>
            {!isListening ? (
              <Button 
                type="primary" 
                icon={<CustomerServiceOutlined />} 
                size="large"
                onClick={handleStartListening}
              >
                {t('Start Listening')}
              </Button>
            ) : (
              <Button 
                danger 
                icon={<CloseOutlined />} 
                size="large"
                onClick={handleStopListening}
              >
                {t('Stop Listening')}
              </Button>
            )}
          </div>
          
          {isListening && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Text strong type="success">{t('Listening...')}</Text>
              <Paragraph type="secondary">
                {t('Say "help" or click the help button to see available commands')}
              </Paragraph>
            </div>
          )}
        </Card>

        <Card>
          <Title level={5}>{t('Voice Control Tips')}</Title>
          <ul>
            <li><Text>{t('Speak clearly and at normal pace')}</Text></li>
            <li><Text>{t('Wait for the microphone icon to appear')}</Text></li>
            <li><Text>{t('Use natural language - say "go to dashboard" or "open projects"')}</Text></li>
            <li><Text>{t('Say "help" anytime to see available commands')}</Text></li>
            <li><Text>{t('Say "stop listening" to disable voice control')}</Text></li>
          </ul>
        </Card>
      </Space>
    </Modal>
  );
};

// Keep the floating button component as a separate export
export const VoiceControlButton: React.FC<{ onOpen?: () => void }> = ({ onOpen }) => {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 90, 
      right: 20, 
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <div style={{ position: 'relative' }}>
        <Button 
          type="primary" 
          icon={<AudioOutlined />} 
          onClick={() => {
            onOpen?.();
          }}
          style={{
            borderRadius: '12px',
            width: 180,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-primary-dark-blue)',
            borderColor: 'var(--color-primary-dark-blue)',
            boxShadow: '0 4px 12px rgba(12, 8, 92, 0.25)'
          }}
        >
          {t('Quick Voice Control')}
        </Button>
        <VoiceStatusIndicator 
          isListening={isListening}
          style={{ 
            position: 'absolute', 
            top: '-4px', 
            right: '-4px' 
          }} 
          size="small" 
        />
      </div>
      
      <div style={{ position: 'relative' }}>
        <Button 
          type="default" 
          icon={<CustomerServiceOutlined />}
          style={{
            borderRadius: '50%',
            width: 50,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--color-primary-dark-blue)',
            color: 'var(--color-primary-dark-blue)'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            backgroundColor: '#FF2424',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          3
        </div>
      </div>
    </div>
  );
};

export default VoiceControl;
