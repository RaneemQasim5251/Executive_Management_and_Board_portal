import React, { useState } from 'react';
import { Card, Button, Space, Typography, Input, Alert } from 'antd';
import { BugOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { voiceControlService } from '../services/voiceControlService';

const { Title, Text } = Typography;

export const VoiceDebugger: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [testCommand, setTestCommand] = useState('go to dashboard');
  const [debugOutput, setDebugOutput] = useState<string[]>([]);

  const addDebugLog = (message: string) => {
    setDebugOutput(prev => [
      `${new Date().toLocaleTimeString()}: ${message}`,
      ...prev.slice(0, 9)
    ]);
  };

  const testManualCommand = () => {
    addDebugLog(`Testing command: "${testCommand}"`);
    
    // Get available commands
    const commands = voiceControlService.getAvailableCommands();
    addDebugLog(`Available commands: ${commands.length}`);
    
    // Try to find matching command
    const normalizedInput = testCommand.toLowerCase().trim();
    let matchedCommand = null;
    
    for (const command of commands) {
      for (const variation of command.variations) {
        if (normalizedInput === variation.toLowerCase() || 
            normalizedInput.includes(variation.toLowerCase()) ||
            variation.toLowerCase().includes(normalizedInput)) {
          matchedCommand = command;
          break;
        }
      }
      if (matchedCommand) break;
    }
    
    if (matchedCommand) {
      addDebugLog(`✅ Command matched: ${matchedCommand.command}`);
      addDebugLog(`Action: ${matchedCommand.action}`);
      addDebugLog(`Parameters: ${JSON.stringify(matchedCommand.parameters)}`);
      
      // Execute the command
      if (matchedCommand.action === 'navigate') {
        const route = matchedCommand.parameters?.route || '/';
        addDebugLog(`🧭 Navigating to: ${route}`);
        
        try {
          navigate(route);
          addDebugLog(`✅ React Router navigation attempted`);
          
          // Check if navigation worked after a delay
          setTimeout(() => {
            if (window.location.pathname !== route) {
              addDebugLog(`🔄 React Router didn't work, using window.location`);
              window.location.href = route;
            } else {
              addDebugLog(`✅ Navigation successful to ${route}`);
            }
          }, 300);
        } catch (error) {
          addDebugLog(`❌ React Router error: ${error}`);
          addDebugLog(`🔄 Using window.location fallback`);
          window.location.href = route;
        }
      }
    } else {
      addDebugLog(`❌ No command matched for: "${testCommand}"`);
      addDebugLog(`Available navigation commands:`);
      commands.filter(c => c.category === 'navigation').forEach(cmd => {
        addDebugLog(`  - ${cmd.variations[0]} → ${cmd.parameters?.route}`);
      });
    }
  };

  const testDirectNavigation = () => {
    addDebugLog('🧪 Testing direct navigation to dashboard');
    addDebugLog(`Current path: ${window.location.pathname}`);
    
    try {
      navigate('/');
      addDebugLog('✅ React Router navigate() called');
      
      // Check if it worked after a delay
      setTimeout(() => {
        addDebugLog(`Path after navigate(): ${window.location.pathname}`);
        if (window.location.pathname !== '/') {
          addDebugLog('🔄 React Router failed, using window.location');
          window.location.href = '/';
        } else {
          addDebugLog('✅ React Router navigation successful');
        }
      }, 300);
    } catch (error) {
      addDebugLog(`❌ React Router error: ${error}`);
      addDebugLog('🔄 Using window.location fallback');
      window.location.href = '/';
    }
  };

  return (
    <Card
      title={
        <Space>
          <BugOutlined style={{ color: '#faad14' }} />
          <span>{t('Voice Control Debugger')}</span>
        </Space>
      }
      size="small"
      style={{ margin: '16px 0' }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        
        <Alert
          message={t('Debug Mode')}
          description={t('Use this panel to test voice commands and diagnose navigation issues')}
          type="info"
          showIcon
        />

        {/* Manual Command Test */}
        <div>
          <Text strong>{t('Test Voice Command')}:</Text>
          <Space.Compact style={{ width: '100%', marginTop: '8px' }}>
            <Input
              value={testCommand}
              onChange={(e) => setTestCommand(e.target.value)}
              placeholder={t('Enter command to test')}
              onPressEnter={testManualCommand}
            />
            <Button 
              type="primary" 
              icon={<PlayCircleOutlined />}
              onClick={testManualCommand}
            >
              {t('Test')}
            </Button>
          </Space.Compact>
        </div>

        {/* Direct Navigation Test */}
        <div>
          <Text strong>{t('Direct Navigation Test')}:</Text>
          <div style={{ marginTop: '8px' }}>
            <Button 
              size="small"
              onClick={testDirectNavigation}
            >
              {t('Test Navigate to Dashboard')}
            </Button>
          </div>
        </div>

        {/* Debug Output */}
        {debugOutput.length > 0 && (
          <div>
            <Text strong>{t('Debug Output')}:</Text>
            <div style={{ 
              background: '#000', 
              color: '#0f0', 
              padding: '8px', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '11px',
              maxHeight: '200px',
              overflowY: 'auto',
              marginTop: '8px'
            }}>
              {debugOutput.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <Text strong>{t('Quick Actions')}:</Text>
          <Space wrap style={{ marginTop: '8px' }}>
            <Button size="small" onClick={() => {
              addDebugLog('Checking voice service status...');
              addDebugLog(`Supported: ${voiceControlService.isSupported()}`);
              addDebugLog(`Listening: ${voiceControlService.isCurrentlyListening()}`);
              addDebugLog(`Commands loaded: ${voiceControlService.getAvailableCommands().length}`);
            }}>
              {t('Check Status')}
            </Button>
            <Button size="small" onClick={() => {
              setDebugOutput([]);
            }}>
              {t('Clear Log')}
            </Button>
            <Button size="small" onClick={() => {
              const commands = voiceControlService.getAvailableCommands();
              commands.filter(c => c.category === 'navigation').forEach(cmd => {
                addDebugLog(`${cmd.command}: [${cmd.variations.join(', ')}] → ${cmd.parameters?.route}`);
              });
            }}>
              {t('Show Navigation Commands')}
            </Button>
          </Space>
        </div>
      </Space>
    </Card>
  );
};

export default VoiceDebugger;
