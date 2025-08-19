import { logger } from '../utils/logger';

// Voice command types
export interface VoiceCommand {
  command: string;
  variations: string[];
  action: string;
  parameters?: Record<string, any>;
  category: 'navigation' | 'action' | 'query' | 'control';
  description: string;
  examples: string[];
}

export interface VoiceControlOptions {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  grammars?: SpeechGrammarList;
}

export interface VoiceControlCallbacks {
  onCommand: (command: VoiceCommand, transcript: string) => void;
  onError: (error: string) => void;
  onStart: () => void;
  onEnd: () => void;
  onResult: (transcript: string, confidence: number) => void;
}

// Executive voice commands in English and Arabic
const VOICE_COMMANDS: VoiceCommand[] = [
  // Navigation Commands
  {
    command: 'go_to_dashboard',
    variations: ['go to dashboard', 'open dashboard', 'show dashboard', 'dashboard', 'home'],
    action: 'navigate',
    parameters: { route: '/' },
    category: 'navigation',
    description: 'Navigate to executive dashboard',
    examples: ['Go to dashboard', 'Open dashboard', 'Show me the dashboard'],
  },
  {
    command: 'go_to_projects',
    variations: ['go to projects', 'open projects', 'show projects', 'projects', 'strategic projects'],
    action: 'navigate',
    parameters: { route: '/board' },
    category: 'navigation',
    description: 'Navigate to projects board',
    examples: ['Go to projects', 'Show me projects', 'Open strategic projects'],
  },
  {
    command: 'go_to_timeline',
    variations: ['go to timeline', 'open timeline', 'show timeline', 'timeline', 'strategic timeline'],
    action: 'navigate',
    parameters: { route: '/timeline' },
    category: 'navigation',
    description: 'Navigate to strategic timeline',
    examples: ['Go to timeline', 'Show timeline', 'Open strategic timeline'],
  },
  {
    command: 'go_to_reports',
    variations: ['go to reports', 'open reports', 'show reports', 'reports', 'analytics'],
    action: 'navigate',
    parameters: { route: '/reports' },
    category: 'navigation',
    description: 'Navigate to reports and analytics',
    examples: ['Go to reports', 'Show reports', 'Open analytics'],
  },
  {
    command: 'go_to_companies',
    variations: ['go to companies', 'open companies', 'show companies', 'companies', 'portfolio', 'investments'],
    action: 'navigate',
    parameters: { route: '/companies/jtc' },
    category: 'navigation',
    description: 'Navigate to company portfolio',
    examples: ['Go to companies', 'Show portfolio', 'Open investments'],
  },

  // Action Commands
  {
    command: 'open_ai_assistant',
    variations: ['open ai assistant', 'ai assistant', 'ask ai', 'artificial intelligence', 'smart assistant'],
    action: 'open_modal',
    parameters: { modal: 'ai_assistant' },
    category: 'action',
    description: 'Open AI executive assistant',
    examples: ['Open AI assistant', 'Ask AI', 'Smart assistant'],
  },
  {
    command: 'open_settings',
    variations: ['open settings', 'settings', 'preferences', 'configuration'],
    action: 'open_modal',
    parameters: { modal: 'theme_settings' },
    category: 'action',
    description: 'Open theme and accessibility settings',
    examples: ['Open settings', 'Show preferences', 'Configuration'],
  },
  {
    command: 'open_notifications',
    variations: ['open notifications', 'notifications', 'alerts', 'messages'],
    action: 'open_modal',
    parameters: { modal: 'notifications' },
    category: 'action',
    description: 'Open notification center',
    examples: ['Open notifications', 'Show alerts', 'Check messages'],
  },
  {
    command: 'switch_language',
    variations: ['switch language', 'change language', 'arabic', 'english', 'language'],
    action: 'switch_language',
    parameters: {},
    category: 'control',
    description: 'Switch between Arabic and English',
    examples: ['Switch language', 'Change to Arabic', 'English please'],
  },
  {
    command: 'switch_theme',
    variations: ['switch theme', 'change theme', 'dark mode', 'light mode', 'eye comfort'],
    action: 'switch_theme',
    parameters: {},
    category: 'control',
    description: 'Switch between light, dark, and eye-comfort themes',
    examples: ['Switch theme', 'Dark mode', 'Eye comfort mode'],
  },

  // Query Commands (for AI Assistant)
  {
    command: 'show_revenue',
    variations: ['show revenue', 'revenue report', 'financial performance', 'sales data'],
    action: 'ai_query',
    parameters: { query: 'Show me the latest revenue trends and analysis' },
    category: 'query',
    description: 'Query revenue and financial data',
    examples: ['Show revenue', 'Revenue report', 'Financial performance'],
  },
  {
    command: 'show_projects_status',
    variations: ['project status', 'project updates', 'how are projects', 'project progress'],
    action: 'ai_query',
    parameters: { query: 'Give me an update on all active projects and their current status' },
    category: 'query',
    description: 'Query project status and progress',
    examples: ['Project status', 'How are projects', 'Project updates'],
  },
  {
    command: 'show_kpis',
    variations: ['show kpis', 'key performance indicators', 'metrics', 'performance data'],
    action: 'ai_query',
    parameters: { query: 'Show me the current KPIs and performance metrics' },
    category: 'query',
    description: 'Query KPIs and performance metrics',
    examples: ['Show KPIs', 'Performance metrics', 'Key indicators'],
  },

  // Control Commands
  {
    command: 'scroll_up',
    variations: ['scroll up', 'go up', 'move up', 'page up'],
    action: 'scroll',
    parameters: { direction: 'up' },
    category: 'control',
    description: 'Scroll page up',
    examples: ['Scroll up', 'Go up', 'Move up'],
  },
  {
    command: 'scroll_down',
    variations: ['scroll down', 'go down', 'move down', 'page down'],
    action: 'scroll',
    parameters: { direction: 'down' },
    category: 'control',
    description: 'Scroll page down',
    examples: ['Scroll down', 'Go down', 'Move down'],
  },
  {
    command: 'refresh_page',
    variations: ['refresh', 'reload', 'update page', 'refresh page'],
    action: 'refresh',
    parameters: {},
    category: 'control',
    description: 'Refresh current page',
    examples: ['Refresh', 'Reload page', 'Update'],
  },
  {
    command: 'go_back',
    variations: ['go back', 'back', 'previous page', 'return'],
    action: 'navigate_back',
    parameters: {},
    category: 'navigation',
    description: 'Go to previous page',
    examples: ['Go back', 'Previous page', 'Return'],
  },

  // Help Commands
  {
    command: 'help',
    variations: ['help', 'what can i say', 'voice commands', 'how to use'],
    action: 'show_help',
    parameters: {},
    category: 'control',
    description: 'Show available voice commands',
    examples: ['Help', 'What can I say', 'Voice commands'],
  },
  {
    command: 'stop_listening',
    variations: ['stop listening', 'stop voice', 'disable voice', 'quiet'],
    action: 'stop_voice',
    parameters: {},
    category: 'control',
    description: 'Stop voice recognition',
    examples: ['Stop listening', 'Disable voice', 'Quiet'],
  },
];

// Arabic voice commands
const ARABIC_VOICE_COMMANDS: VoiceCommand[] = [
  {
    command: 'go_to_dashboard',
    variations: ['اذهب للوحة', 'افتح اللوحة', 'اظهر اللوحة', 'اللوحة الرئيسية', 'الرئيسية'],
    action: 'navigate',
    parameters: { route: '/' },
    category: 'navigation',
    description: 'الانتقال للوحة التحكم التنفيذية',
    examples: ['اذهب للوحة', 'افتح اللوحة', 'اظهر اللوحة الرئيسية'],
  },
  {
    command: 'go_to_projects',
    variations: ['اذهب للمشاريع', 'افتح المشاريع', 'اظهر المشاريع', 'المشاريع الاستراتيجية'],
    action: 'navigate',
    parameters: { route: '/board' },
    category: 'navigation',
    description: 'الانتقال لمجلس المشاريع',
    examples: ['اذهب للمشاريع', 'اظهر المشاريع', 'افتح المشاريع الاستراتيجية'],
  },
  {
    command: 'open_ai_assistant',
    variations: ['افتح المساعد الذكي', 'المساعد الذكي', 'اسأل الذكاء الاصطناعي', 'مساعد ذكي'],
    action: 'open_modal',
    parameters: { modal: 'ai_assistant' },
    category: 'action',
    description: 'فتح المساعد التنفيذي الذكي',
    examples: ['افتح المساعد الذكي', 'اسأل الذكاء الاصطناعي', 'مساعد ذكي'],
  },
  {
    command: 'switch_language',
    variations: ['غير اللغة', 'بدل اللغة', 'انجليزي', 'عربي', 'اللغة'],
    action: 'switch_language',
    parameters: {},
    category: 'control',
    description: 'التبديل بين العربية والإنجليزية',
    examples: ['غير اللغة', 'بدل للإنجليزي', 'عربي من فضلك'],
  },
  {
    command: 'help',
    variations: ['مساعدة', 'ماذا يمكنني أن أقول', 'أوامر صوتية', 'كيف أستخدم'],
    action: 'show_help',
    parameters: {},
    category: 'control',
    description: 'إظهار الأوامر الصوتية المتاحة',
    examples: ['مساعدة', 'ماذا يمكنني أن أقول', 'أوامر صوتية'],
  },
];

export class VoiceControlService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private currentLanguage: string = 'en-US';
  private callbacks: VoiceControlCallbacks | null = null;
  private commands: VoiceCommand[] = [];
  private confidenceThreshold: number = 0.7;
  private lastCommand: string = '';
  private commandHistory: string[] = [];

  constructor() {
    this.initializeSpeechRecognition();
    this.loadCommands();
  }

  private initializeSpeechRecognition() {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('❌ Speech Recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    
    // Configure recognition settings
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;
    this.recognition.lang = this.currentLanguage;

    // Event handlers
    this.recognition.onstart = () => {
      console.log('🎤 Voice recognition started');
      this.isListening = true;
      this.callbacks?.onStart();
    };

    this.recognition.onend = () => {
      console.log('🎤 Voice recognition ended');
      this.isListening = false;
      this.callbacks?.onEnd();
    };

    this.recognition.onerror = (event) => {
      console.error('❌ Voice recognition error:', event.error);
      this.isListening = false;
      
      let errorMessage = 'Voice recognition error';
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone access denied. Please allow microphone permissions.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access not allowed. Please enable microphone permissions.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service not allowed.';
          break;
        default:
          errorMessage = `Voice recognition error: ${event.error}`;
      }
      
      this.callbacks?.onError(errorMessage);
    };

    this.recognition.onresult = (event) => {
      const results = Array.from(event.results);
      const lastResult = results[results.length - 1];
      
      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript.trim().toLowerCase();
        const confidence = lastResult[0].confidence;
        
        console.log(`🎤 Voice input: "${transcript}" (confidence: ${confidence})`);
        
        this.callbacks?.onResult(transcript, confidence);
        
        if (confidence >= this.confidenceThreshold) {
          this.processCommand(transcript);
        } else {
          console.log(`⚠️ Low confidence (${confidence}), ignoring command`);
        }
      }
    };
  }

  private loadCommands() {
    // Load commands based on current language
    if (this.currentLanguage.startsWith('ar')) {
      this.commands = [...VOICE_COMMANDS, ...ARABIC_VOICE_COMMANDS];
    } else {
      this.commands = VOICE_COMMANDS;
    }
    
    console.log(`📝 Loaded ${this.commands.length} voice commands for language: ${this.currentLanguage}`);
  }

  private processCommand(transcript: string) {
    console.log(`🔍 Processing voice command: "${transcript}"`);
    console.log(`📚 Available commands: ${this.commands.length}`);
    
    const matchedCommand = this.findMatchingCommand(transcript);
    
    if (matchedCommand) {
      console.log(`✅ Command matched: ${matchedCommand.command}`);
      console.log(`📋 Command details:`, matchedCommand);
      this.lastCommand = transcript;
      this.commandHistory.push(transcript);
      
      // Keep only last 10 commands
      if (this.commandHistory.length > 10) {
        this.commandHistory.shift();
      }
      
      this.callbacks?.onCommand(matchedCommand, transcript);
    } else {
      console.log(`❌ No command matched for: "${transcript}"`);
      console.log(`🔍 Checking against ${this.commands.length} available commands...`);
      
      // Debug: show what commands we're checking against
      this.commands.slice(0, 5).forEach(cmd => {
        console.log(`   - ${cmd.command}: [${cmd.variations.join(', ')}]`);
      });
      
      this.callbacks?.onError(`Command not recognized: "${transcript}". Say "help" for available commands.`);
    }
  }

  private findMatchingCommand(transcript: string): VoiceCommand | null {
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    // Try exact matches first
    for (const command of this.commands) {
      for (const variation of command.variations) {
        if (normalizedTranscript === variation.toLowerCase()) {
          return command;
        }
      }
    }
    
    // Try partial matches (contains)
    for (const command of this.commands) {
      for (const variation of command.variations) {
        if (normalizedTranscript.includes(variation.toLowerCase()) || 
            variation.toLowerCase().includes(normalizedTranscript)) {
          return command;
        }
      }
    }
    
    // Try fuzzy matching for common variations
    for (const command of this.commands) {
      for (const variation of command.variations) {
        if (this.calculateSimilarity(normalizedTranscript, variation.toLowerCase()) > 0.8) {
          return command;
        }
      }
    }
    
    return null;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        if (str1[i - 1] === str2[j - 1]) {
          matrix[j][i] = matrix[j - 1][i - 1];
        } else {
          matrix[j][i] = Math.min(
            matrix[j - 1][i - 1] + 1,
            matrix[j][i - 1] + 1,
            matrix[j - 1][i] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Public methods
  public isSupported(): boolean {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    return !!SpeechRecognition;
  }

  public startListening(callbacks: VoiceControlCallbacks): void {
    if (!this.recognition) {
      callbacks.onError('Speech recognition not supported in this browser');
      return;
    }

    if (this.isListening) {
      console.log('🎤 Already listening...');
      return;
    }

    this.callbacks = callbacks;
    
    try {
      this.recognition.start();
      console.log('🎤 Starting voice recognition...');
    } catch (error) {
      console.error('❌ Failed to start voice recognition:', error);
      callbacks.onError('Failed to start voice recognition');
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      console.log('🎤 Stopping voice recognition...');
    }
  }

  public setLanguage(language: string): void {
    this.currentLanguage = language === 'ar' ? 'ar-SA' : 'en-US';
    
    if (this.recognition) {
      this.recognition.lang = this.currentLanguage;
    }
    
    this.loadCommands();
    console.log(`🌍 Voice language set to: ${this.currentLanguage}`);
  }

  public setConfidenceThreshold(threshold: number): void {
    this.confidenceThreshold = Math.max(0.1, Math.min(1.0, threshold));
    console.log(`🎯 Confidence threshold set to: ${this.confidenceThreshold}`);
  }

  public getAvailableCommands(): VoiceCommand[] {
    return this.commands;
  }

  public getCommandHistory(): string[] {
    return [...this.commandHistory];
  }

  public getLastCommand(): string {
    return this.lastCommand;
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  // Test voice synthesis (text-to-speech feedback)
  public speak(text: string, language?: string): void {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language || this.currentLanguage;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      // Find appropriate voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(utterance.lang.split('-')[0])
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.speak(utterance);
      console.log(`🔊 Speaking: "${text}"`);
    }
  }

  // Get microphone permission status
  public async checkMicrophonePermission(): Promise<'granted' | 'denied' | 'prompt'> {
    try {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return permission.state;
    } catch (error) {
      console.log('Permission API not supported, will prompt when needed');
      return 'prompt';
    }
  }
}

// Singleton instance
export const voiceControlService = new VoiceControlService();

export default voiceControlService;
