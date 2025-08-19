import React, { useState, useEffect } from 'react';
import { Badge, Tooltip } from 'antd';
import { AudioOutlined, SoundOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { voiceControlService } from '../services/voiceControlService';

interface VoiceStatusIndicatorProps {
  style?: React.CSSProperties;
  size?: 'small' | 'default' | 'large';
}

export const VoiceStatusIndicator: React.FC<VoiceStatusIndicatorProps> = ({ 
  style, 
  size = 'default' 
}) => {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const checkSupport = () => {
      setIsSupported(voiceControlService.isSupported());
    };
    
    const checkListening = () => {
      setIsListening(voiceControlService.isCurrentlyListening());
    };

    checkSupport();
    
    // Check listening status periodically
    const interval = setInterval(checkListening, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!isSupported) {
    return null;
  }

  return (
    <div style={style}>
      <Tooltip title={isListening ? t('Voice Control Active') : t('Voice Control Available')}>
        <Badge 
          dot={isListening} 
          color={isListening ? '#52c41a' : '#1890ff'}
        >
          <motion.div
            animate={isListening ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {isListening ? (
              <SoundOutlined 
                style={{ 
                  color: '#52c41a', 
                  fontSize: size === 'large' ? '18px' : size === 'small' ? '12px' : '14px' 
                }} 
              />
            ) : (
              <AudioOutlined 
                style={{ 
                  color: '#1890ff', 
                  fontSize: size === 'large' ? '18px' : size === 'small' ? '12px' : '14px' 
                }} 
              />
            )}
          </motion.div>
        </Badge>
      </Tooltip>
      
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute',
              top: '-24px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(82, 196, 26, 0.9)',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '8px',
              fontSize: '10px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              zIndex: 1001,
            }}
          >
            🎤 {t('Listening')}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceStatusIndicator;
