import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Typography, Alert, Tag, Progress } from 'antd';
import { AudioOutlined, AudioMutedOutlined, SoundOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNotification } from '@refinedev/core';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;

interface SimpleVoiceControlProps {
  style?: React.CSSProperties;
}

export const SimpleVoiceControl: React.FC<SimpleVoiceControlProps> = ({ style }) => {
  const { t, i18n } = useTranslation();
  const { open: notification } = useNotification();
  
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  // Simple command mapping for direct navigation
  const simpleCommands: Record<string, { route: string; description: string }> = {
    // English commands
    'dashboard': { route: '/', description: 'Executive Dashboard' },
    'home': { route: '/', description: 'Executive Dashboard' },
    'projects': { route: '/board', description: 'Strategic Projects' },
    'board': { route: '/board', description: 'Strategic Projects' },
    'timeline': { route: '/timeline', description: 'Strategic Timeline' },
    'reports': { route: '/reports', description: 'Reports & Analytics' },
    'companies': { route: '/companies/jtc', description: 'Company Portfolio' },
    'portfolio': { route: '/companies/jtc', description: 'Company Portfolio' },
    
    // Arabic commands
    'اللوحة': { route: '/', description: 'اللوحة التنفيذية' },
    'الرئيسية': { route: '/', description: 'اللوحة التنفيذية' },
    'المشاريع': { route: '/board', description: 'المشاريع الاستراتيجية' },
    'الجدول': { route: '/timeline', description: 'الجدول الزمني الاستراتيجي' },
    'التقارير': { route: '/reports', description: 'التقارير والتحليلات' },
    'الشركات': { route: '/companies/jtc', description: 'محفظة الشركات' },
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
      
      recognitionInstance.onstart = () => {
        console.log('🎤 Simple voice control started');
        setIsListening(true);
        setCurrentTranscript('');
      };
      
      recognitionInstance.onend = () => {
        console.log('🎤 Simple voice control ended');
        setIsListening(false);
      };
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        const confidence = event.results[0][0].confidence;
        
        console.log(`🎤 Voice heard: "${transcript}" (confidence: ${confidence})`);
        setCurrentTranscript(transcript);
        
        // Process the command immediately
        processSimpleCommand(transcript);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('❌ Voice recognition error:', event.error);
        setIsListening(false);
        
        notification?.({
          type: 'error',
          message: t('Voice Error'),
          description: event.error === 'not-allowed' 
            ? t('Microphone permission denied')
            : t('Voice recognition failed'),
        });
      };
      
      setRecognition(recognitionInstance);
    }
  }, [i18n.language, notification, t]);

  const processSimpleCommand = (transcript: string) => {
    console.log(`🔍 Processing simple command: "${transcript}"`);
    
    // Check for direct command matches
    for (const [command, config] of Object.entries(simpleCommands)) {
      if (transcript.includes(command)) {
        console.log(`✅ Simple command matched: ${command} → ${config.route}`);
        
        // Navigate immediately using window.location for reliability
        console.log(`🧭 Navigating to: ${config.route}`);
        window.location.href = config.route;
        
        // Show success notification
        notification?.({
          type: 'success',
          message: t('Voice Navigation'),
          description: `${transcript} → ${config.description}`,
          duration: 3,
        });
        
        // Speak confirmation
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(
            i18n.language === 'ar' 
              ? `الانتقال إلى ${config.description}`
              : `Navigating to ${config.description}`
          );
          utterance.lang = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
          speechSynthesis.speak(utterance);
        }
        
        return;
      }
    }
    
    console.log(`❌ No simple command matched for: "${transcript}"`);
    notification?.({
      type: 'warning',
      message: t('Command Not Recognized'),
      description: t('Try: "dashboard", "projects", "timeline", "reports"'),
      duration: 4,
    });
  };

  const startListening = () => {
    if (!isSupported) {
      notification?.({
        type: 'error',
        message: t('Not Supported'),
        description: t('Voice recognition not supported in this browser'),
      });
      return;
    }

    if (!recognition) {
      notification?.({
        type: 'error',
        message: t('Error'),
        description: t('Voice recognition not initialized'),
      });
      return;
    }

    try {
      recognition.start();
      console.log('🎤 Starting simple voice recognition...');
    } catch (error) {
      console.error('❌ Failed to start voice recognition:', error);
      notification?.({
        type: 'error',
        message: t('Voice Error'),
        description: t('Failed to start voice recognition'),
      });
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Card
      size="small"
      style={{ 
        ...style,
        background: isListening ? '#f6ffed' : '#fafafa',
        border: isListening ? '1px solid #52c41a' : '1px solid #d9d9d9',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space>
            <motion.div
              animate={isListening ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {isListening ? (
                <SoundOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
              ) : (
                <AudioOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
              )}
            </motion.div>
            <Text strong style={{ color: isListening ? '#52c41a' : '#1890ff' }}>
              {t('Quick Voice Control')}
            </Text>
          </Space>
          
          <Button
            type={isListening ? "default" : "primary"}
            size="small"
            icon={isListening ? <AudioMutedOutlined /> : <AudioOutlined />}
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? t('Stop') : t('Listen')}
          </Button>
        </div>

        {isListening && (
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {t('Say')}: "dashboard", "projects", "timeline", "reports"
            </Text>
            {currentTranscript && (
              <div style={{ marginTop: '8px' }}>
                <Text style={{ fontSize: '13px', color: '#52c41a' }}>
                  🎤 "{currentTranscript}"
                </Text>
              </div>
            )}
          </div>
        )}

        {!isListening && (
          <div>
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {t('Click Listen and say a command like "dashboard" or "projects"')}
            </Text>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default SimpleVoiceControl;
