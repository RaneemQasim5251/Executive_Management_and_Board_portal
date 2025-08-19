import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Drawer,
  Space,
  Typography,
  Card,
  List,
  Avatar,
  Tag,
  Alert,
  Progress,
  Row,
  Col,
  Switch,
  Slider,
  Divider,
  Modal,
} from 'antd';
import {
  AudioOutlined,
  AudioMutedOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  SoundOutlined,
  CloseOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNotification } from '@refinedev/core';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { voiceControlService, VoiceCommand } from '../services/voiceControlService';
import { VoiceDebugger } from './VoiceDebugger';

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
  onThemeSwitch,
}) => {
  const { t, i18n } = useTranslation();
  const { open: notification } = useNotification();
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Check voice support on mount
  useEffect(() => {
    const checkSupport = async () => {
      const supported = voiceControlService.isSupported();
      setIsSupported(supported);
      
      if (supported) {
        const permission = await voiceControlService.checkMicrophonePermission();
        setMicrophonePermission(permission);
        
        // Set language based on current i18n language
        voiceControlService.setLanguage(i18n.language);
        voiceControlService.setConfidenceThreshold(confidenceThreshold);
      }
    };
    
    checkSupport();
  }, [i18n.language, confidenceThreshold]);

  // Handle voice commands
  const handleVoiceCommand = useCallback((command: VoiceCommand, transcript: string) => {
    console.log(`🎤 Executing command: ${command.command}`);
    console.log(`📍 Command action: ${command.action}`);
    console.log(`🎯 Command parameters:`, command.parameters);
    
    setLastCommand(transcript);
    setCommandHistory(prev => [transcript, ...prev.slice(0, 9)]);

    switch (command.action) {
      case 'navigate':
        const route = command.parameters?.route || '/';
        console.log(`🧭 Navigating to route: ${route}`);
        
        try {
          // Try React Router navigation first
          navigate(route);
          console.log(`✅ React Router navigation attempted to: ${route}`);
        } catch (error) {
          console.log(`❌ React Router failed, using window.location: ${error}`);
          // Fallback to window.location for more reliable navigation
          window.location.href = route;
        }
        
        voiceControlService.speak(t('Navigating to') + ' ' + command.description);
        
        // Show immediate feedback
        notification?.({
          type: 'success',
          message: t('Navigation'),
          description: `Going to ${route}`,
          duration: 2,
        });
        
        // Force navigation after a short delay if React Router didn't work
        setTimeout(() => {
          if (window.location.pathname !== route) {
            console.log(`🔄 Force navigation to ${route} using window.location`);
            window.location.href = route;
          }
        }, 500);
        break;
        
      case 'open_modal':
        switch (command.parameters?.modal) {
          case 'ai_assistant':
            onOpenAI?.();
            voiceControlService.speak(t('Opening AI assistant'));
            break;
          case 'theme_settings':
            onOpenThemeSettings?.();
            voiceControlService.speak(t('Opening settings'));
            break;
          case 'notifications':
            onOpenNotifications?.();
            voiceControlService.speak(t('Opening notifications'));
            break;
        }
        break;
        
      case 'switch_language':
        onLanguageSwitch?.();
        voiceControlService.speak(t('Switching language'));
        break;
        
      case 'switch_theme':
        onThemeSwitch?.();
        voiceControlService.speak(t('Switching theme'));
        break;
        
      case 'ai_query':
        onOpenAI?.();
        // In a real implementation, this would send the query to AI
        setTimeout(() => {
          voiceControlService.speak(t('AI assistant is ready for your query'));
        }, 500);
        break;
        
      case 'scroll':
        const direction = command.parameters?.direction;
        if (direction === 'up') {
          window.scrollBy(0, -300);
        } else if (direction === 'down') {
          window.scrollBy(0, 300);
        }
        break;
        
      case 'refresh':
        window.location.reload();
        break;
        
      case 'navigate_back':
        window.history.back();
        break;
        
      case 'show_help':
        setHelpModalVisible(true);
        voiceControlService.speak(t('Showing voice commands help'));
        break;
        
      case 'stop_voice':
        stopListening();
        voiceControlService.speak(t('Voice control disabled'));
        break;
        
      default:
        console.log(`❓ Unknown action: ${command.action}`);
    }

    // Show success notification
    notification?.({
      type: 'success',
      message: t('Voice Command Executed'),
      description: `"${transcript}" → ${command.description}`,
      duration: 2,
    });
  }, [navigate, onOpenAI, onOpenThemeSettings, onOpenNotifications, onLanguageSwitch, onThemeSwitch, t, notification]);

  const handleVoiceError = useCallback((error: string) => {
    console.error('🎤 Voice error:', error);
    notification?.({
      type: 'error',
      message: t('Voice Control Error'),
      description: error,
    });
  }, [notification, t]);

  const handleVoiceStart = useCallback(() => {
    setIsListening(true);
    setCurrentTranscript('');
  }, []);

  const handleVoiceEnd = useCallback(() => {
    setIsListening(false);
  }, []);

  const handleVoiceResult = useCallback((transcript: string, conf: number) => {
    setCurrentTranscript(transcript);
    setConfidence(conf);
  }, []);

  const startListening = () => {
    if (!isSupported) {
      notification?.({
        type: 'error',
        message: t('Not Supported'),
        description: t('Voice recognition is not supported in this browser'),
      });
      return;
    }

    setVoiceEnabled(true);
    voiceControlService.startListening({
      onCommand: handleVoiceCommand,
      onError: handleVoiceError,
      onStart: handleVoiceStart,
      onEnd: handleVoiceEnd,
      onResult: handleVoiceResult,
    });
  };

  const stopListening = () => {
    setVoiceEnabled(false);
    setIsListening(false);
    voiceControlService.stopListening();
  };

  const testVoiceCommand = (command: VoiceCommand) => {
    handleVoiceCommand(command, command.variations[0]);
  };

  const getCommandsByCategory = (category: string) => {
    return voiceControlService.getAvailableCommands().filter(cmd => cmd.category === category);
  };

  const getMicrophoneStatusColor = () => {
    switch (microphonePermission) {
      case 'granted': return '#52c41a';
      case 'denied': return '#ff4d4f';
      default: return '#faad14';
    }
  };

  const getMicrophoneStatusText = () => {
    switch (microphonePermission) {
      case 'granted': return t('Microphone Access Granted');
      case 'denied': return t('Microphone Access Denied');
      default: return t('Microphone Permission Required');
    }
  };

  return (
    <>
      <Drawer
        title={
          <Space>
            <AudioOutlined style={{ color: '#1890ff' }} />
            <span>{t('Voice Control Center')}</span>
            {isListening && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Tag color="green">{t('Listening')}</Tag>
              </motion.div>
            )}
          </Space>
        }
        placement="right"
        width={500}
        open={visible}
        onClose={onClose}
        extra={
          <Space>
            <Button
              type="text"
              icon={<QuestionCircleOutlined />}
              onClick={() => setHelpModalVisible(true)}
              title={t('Voice Commands Help')}
            />
          </Space>
        }
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          
          {/* Voice Status */}
          <Card size="small">
            <Row align="middle" justify="space-between">
              <Col>
                <Space direction="vertical" size={0}>
                  <Text strong>{t('Voice Control')}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {getMicrophoneStatusText()}
                  </Text>
                </Space>
              </Col>
              <Col>
                <Switch
                  checked={voiceEnabled}
                  onChange={voiceEnabled ? stopListening : startListening}
                  checkedChildren={<AudioOutlined />}
                  unCheckedChildren={<AudioMutedOutlined />}
                  disabled={!isSupported || microphonePermission === 'denied'}
                />
              </Col>
            </Row>
          </Card>

          {/* Live Transcript */}
          {isListening && (
            <Card size="small" style={{ background: '#f6ffed', border: '1px solid #52c41a' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text strong style={{ color: '#52c41a' }}>
                    <SoundOutlined style={{ marginRight: '8px' }} />
                    {t('Listening...')}
                  </Text>
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    🎤
                  </motion.div>
                </div>
                
                {currentTranscript && (
                  <div>
                    <Text style={{ fontSize: '14px' }}>"{currentTranscript}"</Text>
                    <br />
                    <Progress 
                      percent={Math.round(confidence * 100)} 
                      size="small"
                      strokeColor={confidence > 0.7 ? '#52c41a' : '#faad14'}
                      format={(percent) => `${percent}% ${t('confidence')}`}
                    />
                  </div>
                )}
                
                {/* Debug Info */}
                <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>
                  <Text type="secondary">
                    Language: {i18n.language} | Commands: {voiceControlService.getAvailableCommands().length}
                  </Text>
                </div>
              </Space>
            </Card>
          )}

          {/* Settings */}
          <Card size="small" title={t('Voice Settings')}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row align="middle" justify="space-between">
                <Col span={12}>
                  <Text>{t('Confidence Threshold')}</Text>
                </Col>
                <Col span={12}>
                  <Slider
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    value={confidenceThreshold}
                    onChange={(value) => {
                      setConfidenceThreshold(value);
                      voiceControlService.setConfidenceThreshold(value);
                    }}
                    tooltip={{ formatter: (value) => `${Math.round((value || 0) * 100)}%` }}
                  />
                </Col>
              </Row>
            </Space>
          </Card>

          {/* Quick Commands */}
          <Card size="small" title={t('Quick Commands')}>
            <Row gutter={[8, 8]}>
              {getCommandsByCategory('navigation').slice(0, 4).map((command, index) => (
                <Col span={12} key={index}>
                  <Button
                    size="small"
                    block
                    onClick={() => {
                      console.log(`🧪 Testing command: ${command.command}`);
                      testVoiceCommand(command);
                    }}
                    style={{ textAlign: 'left', height: 'auto', padding: '8px 12px' }}
                  >
                    <div>
                      <Text strong style={{ fontSize: '12px' }}>
                        "{command.variations[0]}"
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '10px' }}>
                        {command.description}
                      </Text>
                    </div>
                  </Button>
                </Col>
              ))}
            </Row>
            
            {/* Debug Navigation Test */}
            <Divider style={{ margin: '12px 0' }} />
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Text strong style={{ fontSize: '12px' }}>{t('Direct Navigation Test')}:</Text>
              </Col>
              <Col span={8}>
                <Button 
                  size="small" 
                  block
                  onClick={() => {
                    console.log('🧪 Direct navigation test to dashboard');
                    navigate('/');
                  }}
                >
                  Dashboard
                </Button>
              </Col>
              <Col span={8}>
                <Button 
                  size="small" 
                  block
                  onClick={() => {
                    console.log('🧪 Direct navigation test to projects');
                    navigate('/board');
                  }}
                >
                  Projects
                </Button>
              </Col>
              <Col span={8}>
                <Button 
                  size="small" 
                  block
                  onClick={() => {
                    console.log('🧪 Direct navigation test to timeline');
                    navigate('/timeline');
                  }}
                >
                  Timeline
                </Button>
              </Col>
            </Row>
          </Card>

          {/* Command History */}
          {commandHistory.length > 0 && (
            <Card size="small" title={t('Recent Commands')}>
              <List
                size="small"
                dataSource={commandHistory.slice(0, 5)}
                renderItem={(item, index) => (
                  <List.Item style={{ padding: '8px 0' }}>
                    <Space>
                      <Avatar size="small" style={{ background: '#52c41a' }}>
                        {index + 1}
                      </Avatar>
                      <Text style={{ fontSize: '13px' }}>"{item}"</Text>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          )}

          {/* Debug Panel */}
          <VoiceDebugger />

          {/* Support Status */}
          <Alert
            message={isSupported ? t('Voice Control Available') : t('Voice Control Not Supported')}
            description={
              isSupported 
                ? t('Say "help" or click the help button to see available commands')
                : t('Your browser does not support voice recognition. Please use a modern browser like Chrome or Edge.')
            }
            type={isSupported ? 'success' : 'warning'}
            showIcon
            icon={isSupported ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
          />

        </Space>
      </Drawer>

      {/* Voice Commands Help Modal */}
      <Modal
        title={
          <Space>
            <QuestionCircleOutlined style={{ color: '#1890ff' }} />
            <span>{t('Voice Commands Guide')}</span>
          </Space>
        }
        open={helpModalVisible}
        onCancel={() => setHelpModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setHelpModalVisible(false)}>
            {t('Got It')}
          </Button>
        ]}
        width={700}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          
          <Alert
            message={t('Executive Voice Control')}
            description={t('Control the entire portal with your voice. Perfect for busy executives who need hands-free navigation during meetings or while reviewing documents.')}
            type="info"
            showIcon
            icon={<RobotOutlined />}
          />

          {/* Command Categories */}
          {[
            { key: 'navigation', title: t('Navigation Commands'), icon: '🧭' },
            { key: 'action', title: t('Action Commands'), icon: '⚡' },
            { key: 'query', title: t('Query Commands'), icon: '🤖' },
            { key: 'control', title: t('Control Commands'), icon: '🎛️' },
          ].map(category => (
            <Card key={category.key} size="small">
              <Title level={5} style={{ marginBottom: '12px' }}>
                {category.icon} {category.title}
              </Title>
              <List
                size="small"
                dataSource={getCommandsByCategory(category.key)}
                renderItem={(command) => (
                  <List.Item
                    style={{ padding: '8px 0' }}
                    actions={[
                      <Button
                        type="link"
                        size="small"
                        icon={<PlayCircleOutlined />}
                        onClick={() => testVoiceCommand(command)}
                      >
                        {t('Test')}
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space wrap>
                          {command.variations.slice(0, 3).map((variation, index) => (
                            <Tag key={index} color="blue" style={{ fontSize: '11px' }}>
                              "{variation}"
                            </Tag>
                          ))}
                        </Space>
                      }
                      description={
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {command.description}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          ))}

          {/* Usage Tips */}
          <Card size="small" style={{ background: '#f0f9ff', border: '1px solid #1890ff' }}>
            <Title level={5} style={{ color: '#1890ff', marginBottom: '8px' }}>
              💡 {t('Voice Control Tips')}
            </Title>
            <ul style={{ paddingLeft: '16px', marginBottom: 0 }}>
              <li><Text style={{ fontSize: '12px' }}>{t('Speak clearly and at normal pace')}</Text></li>
              <li><Text style={{ fontSize: '12px' }}>{t('Wait for the microphone icon to appear')}</Text></li>
              <li><Text style={{ fontSize: '12px' }}>{t('Use natural language - say "go to dashboard" or "open projects"')}</Text></li>
              <li><Text style={{ fontSize: '12px' }}>{t('Say "help" anytime to see available commands')}</Text></li>
              <li><Text style={{ fontSize: '12px' }}>{t('Say "stop listening" to disable voice control')}</Text></li>
            </ul>
          </Card>

        </Space>
      </Modal>
    </>
  );
};

// Floating Voice Control Button Component
export const VoiceControlButton: React.FC<{
  onOpen: () => void;
  isListening?: boolean;
}> = ({ onOpen, isListening = false }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={
          <motion.div
            animate={isListening ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {isListening ? <SoundOutlined /> : <AudioOutlined />}
          </motion.div>
        }
        onClick={onOpen}
        style={{
          width: '56px',
          height: '56px',
          background: isListening 
            ? 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)'
            : 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title={t('Voice Control')}
      />
      
      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'absolute',
            top: '-40px',
            right: '0',
            background: 'rgba(82, 196, 26, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}
        >
          {t('Listening...')}
        </motion.div>
      )}
    </motion.div>
  );
};

export default VoiceControl;
