import { useState, useCallback, useRef } from 'react';
import { message } from 'antd';
import { PowerBIService, PowerBIConfig } from '../services/powerBIService';

export interface UsePowerBIReturn {
  loading: boolean;
  error: string | null;
  embeddedReports: Map<string, any>;
  refreshReport: (reportId: string) => Promise<void>;
  applyFilters: (reportId: string, filters: any[]) => Promise<void>;
  exportToPDF: (reportId: string) => Promise<void>;
  getEmbedConfig: (config: PowerBIConfig) => any;
  handleEmbedded: (reportId: string, embeddedComponent: any) => void;
  getEventHandlers: () => Map<string, Function>;
}

export const usePowerBI = (): UsePowerBIReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const embeddedReportsRef = useRef<Map<string, any>>(new Map());
  const powerBIService = PowerBIService.getInstance();

  const handleEmbedded = useCallback((reportId: string, embeddedComponent: any) => {
    embeddedReportsRef.current.set(reportId, embeddedComponent);
    console.log(`Report ${reportId} embedded successfully`);
  }, []);

  const refreshReport = useCallback(async (reportId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const embeddedReport = embeddedReportsRef.current.get(reportId);
      if (!embeddedReport) {
        throw new Error(`Report ${reportId} not found`);
      }
      
      await powerBIService.refreshReport(embeddedReport);
      message.success('Report refreshed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh report';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [powerBIService]);

  const applyFilters = useCallback(async (reportId: string, filters: any[]): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const embeddedReport = embeddedReportsRef.current.get(reportId);
      if (!embeddedReport) {
        throw new Error(`Report ${reportId} not found`);
      }
      
      await powerBIService.applyFilters(embeddedReport, filters);
      message.success('Filters applied successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to apply filters';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [powerBIService]);

  const exportToPDF = useCallback(async (reportId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const embeddedReport = embeddedReportsRef.current.get(reportId);
      if (!embeddedReport) {
        throw new Error(`Report ${reportId} not found`);
      }
      
      await powerBIService.exportToPDF(embeddedReport);
      message.success('Export initiated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export report';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [powerBIService]);

  const getEmbedConfig = useCallback((config: PowerBIConfig) => {
    return powerBIService.createEmbedConfig(config);
  }, [powerBIService]);

  const getEventHandlers = useCallback(() => {
    return powerBIService.getEventHandlers();
  }, [powerBIService]);

  return {
    loading,
    error,
    embeddedReports: embeddedReportsRef.current,
    refreshReport,
    applyFilters,
    exportToPDF,
    getEmbedConfig,
    handleEmbedded,
    getEventHandlers
  };
};