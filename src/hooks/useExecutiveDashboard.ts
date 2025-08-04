import { useState, useEffect } from 'react';
import { useAppState, useAppDispatch, AppActionTypes } from '../contexts/AppStateProvider';
import { notificationService } from '../services/notificationService';

// Custom hook for Executive Dashboard functionality
export const useExecutiveDashboard = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [dashboardData, setDashboardData] = useState({
    revenue: {
      current: 2500000,
      target: 3000000,
      growth: 12.5,
      trend: 'up' as 'up' | 'down' | 'stable'
    },
    projects: {
      total: 24,
      active: 18,
      completed: 6,
      onTrack: 15,
      delayed: 3
    },
    team: {
      totalMembers: 156,
      executives: 12,
      managers: 24,
      specialists: 120,
      satisfaction: 87
    },
    performance: {
      efficiency: 94,
      quality: 91,
      innovation: 88,
      collaboration: 93
    }
  });

  // Load initial data
  useEffect(() => {
    loadDashboardData();
    initializeNotifications();
  }, []);

  const loadDashboardData = async () => {
    dispatch({ type: AppActionTypes.SET_LOADING, payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update metrics in global state
      dispatch({ 
        type: AppActionTypes.SET_EXECUTIVE_METRICS, 
        payload: {
          totalRevenue: dashboardData.revenue.current,
          activeProjects: dashboardData.projects.active,
          teamMembers: dashboardData.team.totalMembers,
          successRate: dashboardData.performance.quality,
          efficiencyScore: dashboardData.performance.efficiency,
          revenueTarget: dashboardData.revenue.target,
          growthRate: dashboardData.revenue.growth
        }
      });
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      notificationService.notifySystem('Failed to load dashboard data', 'error');
    } finally {
      dispatch({ type: AppActionTypes.SET_LOADING, payload: false });
    }
  };

  const initializeNotifications = () => {
    // Load demo notifications
    const demoNotifications = notificationService.generateDemoNotifications();
    dispatch({ type: AppActionTypes.SET_NOTIFICATIONS, payload: demoNotifications });
    
    // Subscribe to new notifications
    const unsubscribe = notificationService.subscribe((notification) => {
      dispatch({ type: AppActionTypes.ADD_NOTIFICATION, payload: notification });
    });

    return unsubscribe;
  };

  const refreshData = () => {
    loadDashboardData();
    notificationService.notifySystem('Dashboard data refreshed', 'success');
  };

  const updateRevenue = (newRevenue: number) => {
    setDashboardData(prev => ({
      ...prev,
      revenue: {
        ...prev.revenue,
        current: newRevenue,
        growth: ((newRevenue - prev.revenue.target) / prev.revenue.target) * 100
      }
    }));
    
    // Notify about revenue update
    if (newRevenue > dashboardData.revenue.target) {
      notificationService.notifyExecutive(
        `Revenue target exceeded! Current: $${newRevenue.toLocaleString()}`,
        'success'
      );
    }
  };

  const createStrategicInitiative = (title: string, description: string) => {
    const initiative = {
      id: Date.now().toString(),
      title,
      description,
      status: 'Strategic Planning' as const,
      priority: 'high' as const,
      createdBy: state.user?.id || 'demo-user',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    dispatch({ type: AppActionTypes.ADD_BOARD_TASK, payload: initiative });
    notificationService.notifyExecutive(`New strategic initiative created: ${title}`, 'info');
  };

  return {
    dashboardData,
    loading: state.loading,
    metrics: state.executiveMetrics,
    notifications: state.notifications,
    refreshData,
    updateRevenue,
    createStrategicInitiative
  };
};

// Hook for real-time updates simulation
export const useRealTimeUpdates = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Simulate real-time metric updates
    const interval = setInterval(() => {
      // Random metric fluctuations for demo
      const updates = {
        efficiencyScore: Math.floor(Math.random() * 5) + 90, // 90-95%
        successRate: Math.floor(Math.random() * 8) + 88,     // 88-96%
        growthRate: (Math.random() * 4) + 10                 // 10-14%
      };
      
      dispatch({ 
        type: AppActionTypes.SET_EXECUTIVE_METRICS, 
        payload: updates
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
};

// Hook for executive alerts and monitoring
export const useExecutiveAlerts = () => {
  const state = useAppState();

  useEffect(() => {
    // Monitor critical metrics
    // Mock metrics data
    const metrics = {
      totalRevenue: 68200000,
      activeProjects: 24,
      teamMembers: 1247,
      successRate: 94.2,
      efficiencyScore: 92
    };
    
    // Alert if efficiency drops below threshold
    if (metrics.efficiencyScore < 85) {
      notificationService.notifyExecutive(
        `Efficiency score dropped to ${metrics.efficiencyScore}%. Immediate attention required.`,
        'warning',
        true
      );
    }
    
    // Alert if success rate is low
    if (metrics.successRate < 80) {
      notificationService.notifyExecutive(
        `Success rate at ${metrics.successRate}%. Review strategic initiatives.`,
        'error',
        true
      );
    }
    
    // Positive alerts for good performance
    if (metrics.efficiencyScore > 95) {
      notificationService.notifyStrategicMilestone(
        `Exceptional efficiency achieved: ${metrics.efficiencyScore}%!`
      );
    }
    
  }, [state.executiveMetrics]);

  return null;
};