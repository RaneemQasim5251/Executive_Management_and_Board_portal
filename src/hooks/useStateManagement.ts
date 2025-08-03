import { useCallback } from 'react';
import { useAppState, useAppDispatch, AppActionTypes } from '../contexts/AppStateProvider';
import { useLocalStorage } from './useLocalStorage';

// Comprehensive state management hooks for different aspects of the application

// Authentication state management
export const useAuthState = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const login = useCallback((user: any) => {
    dispatch({ type: AppActionTypes.SET_USER, payload: user });
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch({ type: AppActionTypes.SET_USER, payload: null });
  }, [dispatch]);

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    login,
    logout
  };
};

// UI state management
export const useUIState = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: AppActionTypes.SET_LOADING, payload: loading });
  }, [dispatch]);

  const setLanguage = useCallback((language: 'ar' | 'en') => {
    dispatch({ type: AppActionTypes.SET_LANGUAGE, payload: language });
  }, [dispatch]);

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    dispatch({ type: AppActionTypes.SET_THEME, payload: theme });
  }, [dispatch]);

  const toggleSidebar = useCallback(() => {
    dispatch({ 
      type: AppActionTypes.SET_SIDEBAR_COLLAPSED, 
      payload: !state.sidebarCollapsed 
    });
  }, [dispatch, state.sidebarCollapsed]);

  return {
    loading: state.loading,
    language: state.language,
    theme: state.theme,
    sidebarCollapsed: state.sidebarCollapsed,
    setLoading,
    setLanguage,
    setTheme,
    toggleSidebar
  };
};

// Project management state
export const useProjectState = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const setActiveProject = useCallback((projectId: string | null) => {
    dispatch({ type: AppActionTypes.SET_ACTIVE_PROJECT, payload: projectId });
  }, [dispatch]);

  return {
    activeProject: state.activeProject,
    setActiveProject
  };
};

// Persistent state management with localStorage
export const usePersistentState = () => {
  const [preferences, setPreferences] = useLocalStorage('appPreferences', {
    language: 'ar',
    theme: 'light',
    sidebarCollapsed: false,
    dashboardLayout: 'modern'
  });

  const dispatch = useAppDispatch();

  const updatePreference = useCallback((key: string, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    
    // Update global state as well
    switch (key) {
      case 'language':
        dispatch({ type: AppActionTypes.SET_LANGUAGE, payload: value });
        break;
      case 'theme':
        dispatch({ type: AppActionTypes.SET_THEME, payload: value });
        break;
      case 'sidebarCollapsed':
        dispatch({ type: AppActionTypes.SET_SIDEBAR_COLLAPSED, payload: value });
        break;
    }
  }, [preferences, setPreferences, dispatch]);

  return {
    preferences,
    updatePreference
  };
};

// Data synchronization hook
export const useDataSync = () => {
  const dispatch = useAppDispatch();

  const syncData = useCallback(async () => {
    try {
      dispatch({ type: AppActionTypes.SET_LOADING, payload: true });
      
      // Simulate API calls for different data types
      const [boardTasks, timelineEvents, metrics] = await Promise.all([
        fetchBoardTasks(),
        fetchTimelineEvents(),
        fetchExecutiveMetrics()
      ]);

      dispatch({ type: AppActionTypes.SET_BOARD_TASKS, payload: boardTasks });
      dispatch({ type: AppActionTypes.SET_TIMELINE_EVENTS, payload: timelineEvents });
      dispatch({ type: AppActionTypes.SET_EXECUTIVE_METRICS, payload: metrics });

    } catch (error) {
      console.error('Data synchronization failed:', error);
    } finally {
      dispatch({ type: AppActionTypes.SET_LOADING, payload: false });
    }
  }, [dispatch]);

  return { syncData };
};

// Mock API functions (replace with real API calls)
const fetchBoardTasks = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    {
      id: '1',
      title: '2025 Strategic Vision Document',
      description: 'Develop comprehensive strategic vision and roadmap for 2025-2027',
      status: 'Strategic Planning' as const,
      priority: 'critical' as const,
      createdBy: 'ceo@company.com',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Digital Transformation Phase 2',
      description: 'Enterprise-wide digital infrastructure modernization',
      status: 'In Execution' as const,
      priority: 'high' as const,
      createdBy: 'cto@company.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
};

const fetchTimelineEvents = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    {
      id: '1',
      title: 'Q1 Strategic Planning',
      description: 'Comprehensive strategic review and 2025 roadmap development',
      date: new Date('2025-01-15'),
      status: 'planned' as const,
      priority: 'critical' as const,
      category: 'strategic' as const
    },
    {
      id: '2',
      title: 'Innovation Lab Launch',
      description: 'Establish R&D center for next-gen products',
      date: new Date('2025-03-01'),
      status: 'in-progress' as const,
      priority: 'high' as const,
      category: 'strategic' as const
    }
  ];
};

const fetchExecutiveMetrics = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    totalRevenue: 2500000,
    activeProjects: 18,
    teamMembers: 156,
    successRate: 91,
    efficiencyScore: 94,
    revenueTarget: 3000000,
    growthRate: 12.5
  };
};

// State validation and error handling
export const useStateValidation = () => {
  const state = useAppState();

  const validateState = useCallback(() => {
    const errors: string[] = [];

    // Validate user state
    if (state.isAuthenticated && !state.user) {
      errors.push('Authenticated state without user data');
    }

    // Validate metrics
    if (state.executiveMetrics.efficiencyScore < 0 || state.executiveMetrics.efficiencyScore > 100) {
      errors.push('Invalid efficiency score range');
    }

    // Validate notifications
    const invalidNotifications = state.notifications.filter(n => !n.id || !n.title);
    if (invalidNotifications.length > 0) {
      errors.push(`${invalidNotifications.length} invalid notifications found`);
    }

    return errors;
  }, [state]);

  return { validateState };
};