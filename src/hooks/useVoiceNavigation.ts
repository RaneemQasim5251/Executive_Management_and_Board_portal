import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotification } from '@refinedev/core';

export const useVoiceNavigation = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { open: notification } = useNotification();

  // Simple command mapping for reliable navigation
  const navigationCommands: Record<string, string> = {
    // English
    'dashboard': '/',
    'home': '/',
    'main': '/',
    'projects': '/board',
    'board': '/board',
    'kanban': '/board',
    'timeline': '/timeline',
    'schedule': '/timeline',
    'reports': '/reports',
    'analytics': '/reports',
    'companies': '/companies/jtc',
    'portfolio': '/companies/jtc',
    'investments': '/companies/jtc',
    
    // Arabic
    'اللوحة': '/',
    'الرئيسية': '/',
    'المشاريع': '/board',
    'الجدول': '/timeline',
    'التقارير': '/reports',
    'الشركات': '/companies/jtc',
  };

  const executeVoiceNavigation = useCallback((command: string) => {
    const route = navigationCommands[command.toLowerCase()];
    
    if (route) {
      console.log(`🎤 Voice navigation: "${command}" → ${route}`);
      
      // Use window.location for reliable navigation
      window.location.href = route;
      
      // Show success notification
      notification?.({
        type: 'success',
        message: t('Voice Navigation'),
        description: `"${command}" → ${route}`,
        duration: 2,
      });
      
      // Voice feedback
      if ('speechSynthesis' in window) {
        const message = i18n.language === 'ar' 
          ? `الانتقال إلى ${command}`
          : `Navigating to ${command}`;
        
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
      }
      
      return true;
    }
    
    return false;
  }, [navigation, t, i18n.language]);

  const startSimpleVoiceControl = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      notification?.({
        type: 'error',
        message: t('Not Supported'),
        description: t('Voice recognition not supported'),
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = i18n.language === 'ar' ? 'ar-SA' : 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log(`🎤 Simple voice heard: "${transcript}"`);
      
      // Try to execute navigation
      const success = executeVoiceNavigation(transcript);
      
      if (!success) {
        notification?.({
          type: 'warning',
          message: t('Command Not Found'),
          description: t('Try: dashboard, projects, timeline, reports'),
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error('❌ Simple voice error:', event.error);
    };

    try {
      recognition.start();
      console.log('🎤 Simple voice recognition started');
    } catch (error) {
      console.error('❌ Failed to start simple voice recognition:', error);
    }
  }, [executeVoiceNavigation, i18n.language, notification, t]);

  return {
    isSupported: (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition,
    startVoiceControl: startSimpleVoiceControl,
    executeVoiceNavigation,
    availableCommands: Object.keys(navigationCommands),
  };
};

export default useVoiceNavigation;
