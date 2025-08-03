import React, { createContext, useReducer, useContext, ReactNode } from 'react';

// Action Types
export enum AppActionTypes {
  SET_USER = 'SET_USER',
  SET_LOADING = 'SET_LOADING',
  SET_NOTIFICATIONS = 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION = 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION',
  SET_LANGUAGE = 'SET_LANGUAGE',
  SET_THEME = 'SET_THEME',
  SET_SIDEBAR_COLLAPSED = 'SET_SIDEBAR_COLLAPSED',
  SET_ACTIVE_PROJECT = 'SET_ACTIVE_PROJECT',
  SET_BOARD_TASKS = 'SET_BOARD_TASKS',
  ADD_BOARD_TASK = 'ADD_BOARD_TASK',
  UPDATE_BOARD_TASK = 'UPDATE_BOARD_TASK',
  DELETE_BOARD_TASK = 'DELETE_BOARD_TASK',
  SET_TIMELINE_EVENTS = 'SET_TIMELINE_EVENTS',
  ADD_TIMELINE_EVENT = 'ADD_TIMELINE_EVENT',
  UPDATE_TIMELINE_EVENT = 'UPDATE_TIMELINE_EVENT',
  DELETE_TIMELINE_EVENT = 'DELETE_TIMELINE_EVENT',
  SET_REPORTS_DATA = 'SET_REPORTS_DATA',
  SET_EXECUTIVE_METRICS = 'SET_EXECUTIVE_METRICS'
}

// Interfaces
export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'CEO' | 'Board Member' | 'Executive' | 'Manager';
  permissions: string[];
}

export interface INotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  urgent?: boolean;
}

export interface IBoardTask {
  id: string;
  title: string;
  description: string;
  status: 'Strategic Planning' | 'In Execution' | 'Board Review' | 'Completed Tasks';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  dueDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  attachments?: string[];
  comments?: IComment[];
}

export interface IComment {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  visibility: 'C-Level Only' | 'Board Members' | 'Senior Management';
}

export interface ITimelineEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  status: 'completed' | 'in-progress' | 'planned';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'strategic' | 'operational' | 'partnership';
  milestones?: string[];
  stakeholders?: string[];
}

export interface IExecutiveMetrics {
  totalRevenue: number;
  activeProjects: number;
  teamMembers: number;
  successRate: number;
  efficiencyScore: number;
  revenueTarget: number;
  growthRate: number;
}

export interface IReportsData {
  quarterlyReports: any[];
  performanceMetrics: any[];
  financialData: any[];
  strategicInsights: any[];
}

export interface IAppState {
  // User & Authentication
  user: IUser | null;
  isAuthenticated: boolean;
  
  // UI State
  loading: boolean;
  language: 'ar' | 'en';
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  
  // Notifications
  notifications: INotification[];
  unreadNotifications: number;
  
  // Business Logic State
  activeProject: string | null;
  boardTasks: IBoardTask[];
  timelineEvents: ITimelineEvent[];
  reportsData: IReportsData;
  executiveMetrics: IExecutiveMetrics;
}

export interface IAction {
  type: AppActionTypes;
  payload?: any;
}

// Initial State
const initialState: IAppState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  language: 'ar', // Default to Arabic
  theme: 'light',
  sidebarCollapsed: false,
  notifications: [],
  unreadNotifications: 0,
  activeProject: null,
  boardTasks: [],
  timelineEvents: [],
  reportsData: {
    quarterlyReports: [],
    performanceMetrics: [],
    financialData: [],
    strategicInsights: []
  },
  executiveMetrics: {
    totalRevenue: 0,
    activeProjects: 0,
    teamMembers: 0,
    successRate: 0,
    efficiencyScore: 0,
    revenueTarget: 0,
    growthRate: 0
  }
};

// Context Types
type Dispatch = (action: IAction) => void;

// Create separate contexts for state and dispatch to optimize performance
const AppStateContext = createContext<IAppState | undefined>(undefined);
const AppDispatchContext = createContext<Dispatch | undefined>(undefined);

// Custom hooks for accessing state and dispatch
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

export const useAppDispatch = () => {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within an AppStateProvider');
  }
  return context;
};

// Reducer function
const appReducer = (state: IAppState, action: IAction): IAppState => {
  switch (action.type) {
    case AppActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload
      };

    case AppActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case AppActionTypes.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload
      };

    case AppActionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };

    case AppActionTypes.SET_SIDEBAR_COLLAPSED:
      return {
        ...state,
        sidebarCollapsed: action.payload
      };

    case AppActionTypes.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        unreadNotifications: action.payload.filter((n: INotification) => !n.read).length
      };

    case AppActionTypes.ADD_NOTIFICATION:
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications,
        unreadNotifications: newNotifications.filter(n => !n.read).length
      };

    case AppActionTypes.REMOVE_NOTIFICATION:
      const filteredNotifications = state.notifications.filter(n => n.id !== action.payload);
      return {
        ...state,
        notifications: filteredNotifications,
        unreadNotifications: filteredNotifications.filter(n => !n.read).length
      };

    case AppActionTypes.SET_ACTIVE_PROJECT:
      return {
        ...state,
        activeProject: action.payload
      };

    case AppActionTypes.SET_BOARD_TASKS:
      return {
        ...state,
        boardTasks: action.payload
      };

    case AppActionTypes.ADD_BOARD_TASK:
      return {
        ...state,
        boardTasks: [...state.boardTasks, action.payload]
      };

    case AppActionTypes.UPDATE_BOARD_TASK:
      return {
        ...state,
        boardTasks: state.boardTasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        )
      };

    case AppActionTypes.DELETE_BOARD_TASK:
      return {
        ...state,
        boardTasks: state.boardTasks.filter(task => task.id !== action.payload)
      };

    case AppActionTypes.SET_TIMELINE_EVENTS:
      return {
        ...state,
        timelineEvents: action.payload
      };

    case AppActionTypes.ADD_TIMELINE_EVENT:
      return {
        ...state,
        timelineEvents: [...state.timelineEvents, action.payload]
      };

    case AppActionTypes.UPDATE_TIMELINE_EVENT:
      return {
        ...state,
        timelineEvents: state.timelineEvents.map(event =>
          event.id === action.payload.id ? { ...event, ...action.payload } : event
        )
      };

    case AppActionTypes.DELETE_TIMELINE_EVENT:
      return {
        ...state,
        timelineEvents: state.timelineEvents.filter(event => event.id !== action.payload)
      };

    case AppActionTypes.SET_REPORTS_DATA:
      return {
        ...state,
        reportsData: action.payload
      };

    case AppActionTypes.SET_EXECUTIVE_METRICS:
      return {
        ...state,
        executiveMetrics: action.payload
      };

    default:
      return state;
  }
};

// Provider Component
interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

// Utility functions and custom hooks for complex operations
export const useNotifications = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const addNotification = (notification: Omit<INotification, 'id' | 'timestamp'>) => {
    const newNotification: INotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    dispatch({ type: AppActionTypes.ADD_NOTIFICATION, payload: newNotification });
  };

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = state.notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    dispatch({ type: AppActionTypes.SET_NOTIFICATIONS, payload: updatedNotifications });
  };

  const removeNotification = (notificationId: string) => {
    dispatch({ type: AppActionTypes.REMOVE_NOTIFICATION, payload: notificationId });
  };

  return {
    notifications: state.notifications,
    unreadNotifications: state.unreadNotifications,
    addNotification,
    markAsRead,
    removeNotification
  };
};

export const useBoardTasks = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const addTask = (task: Omit<IBoardTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: IBoardTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    dispatch({ type: AppActionTypes.ADD_BOARD_TASK, payload: newTask });
  };

  const updateTask = (taskId: string, updates: Partial<IBoardTask>) => {
    const updatedTask = {
      ...updates,
      id: taskId,
      updatedAt: new Date()
    };
    dispatch({ type: AppActionTypes.UPDATE_BOARD_TASK, payload: updatedTask });
  };

  const deleteTask = (taskId: string) => {
    dispatch({ type: AppActionTypes.DELETE_BOARD_TASK, payload: taskId });
  };

  const getTasksByStatus = (status: IBoardTask['status']) => {
    return state.boardTasks.filter(task => task.status === status);
  };

  return {
    tasks: state.boardTasks,
    addTask,
    updateTask,
    deleteTask,
    getTasksByStatus
  };
};

export const useTimelineEvents = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const addEvent = (event: Omit<ITimelineEvent, 'id'>) => {
    const newEvent: ITimelineEvent = {
      ...event,
      id: Date.now().toString()
    };
    dispatch({ type: AppActionTypes.ADD_TIMELINE_EVENT, payload: newEvent });
  };

  const updateEvent = (eventId: string, updates: Partial<ITimelineEvent>) => {
    const updatedEvent = {
      ...updates,
      id: eventId
    };
    dispatch({ type: AppActionTypes.UPDATE_TIMELINE_EVENT, payload: updatedEvent });
  };

  const deleteEvent = (eventId: string) => {
    dispatch({ type: AppActionTypes.DELETE_TIMELINE_EVENT, payload: eventId });
  };

  const getEventsByCategory = (category: ITimelineEvent['category']) => {
    return state.timelineEvents.filter(event => event.category === category);
  };

  const getEventsByStatus = (status: ITimelineEvent['status']) => {
    return state.timelineEvents.filter(event => event.status === status);
  };

  return {
    events: state.timelineEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByCategory,
    getEventsByStatus
  };
};

export const useExecutiveMetrics = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const updateMetrics = (metrics: Partial<IExecutiveMetrics>) => {
    const updatedMetrics = {
      ...state.executiveMetrics,
      ...metrics
    };
    dispatch({ type: AppActionTypes.SET_EXECUTIVE_METRICS, payload: updatedMetrics });
  };

  return {
    metrics: state.executiveMetrics,
    updateMetrics
  };
};