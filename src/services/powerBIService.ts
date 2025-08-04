import { models } from 'powerbi-client';

export interface PowerBIConfig {
  reportId: string;
  embedUrl: string;
  accessToken?: string;
  groupId?: string;
}

export class PowerBIService {
  private static instance: PowerBIService;
  private baseUrl = 'https://app.powerbi.com/reportEmbed';
  
  // Configuration from environment variables  
  private config = {
    clientId: import.meta.env.VITE_POWERBI_CLIENT_ID || 'ab13106b-99f4-416d-aa53-a0ca9d3175ca',
    tenantId: import.meta.env.VITE_POWERBI_TENANT_ID || 'ba2cab20-721a-44f0-bec4-f2e784ba3c23',
    // In a real application, never store access tokens in frontend code
    // This should be fetched from your secure backend service
    demoAccessToken: import.meta.env.VITE_POWERBI_ACCESS_TOKEN || ''
  };

  public static getInstance(): PowerBIService {
    if (!PowerBIService.instance) {
      PowerBIService.instance = new PowerBIService();
    }
    return PowerBIService.instance;
  }

  /**
   * Creates embed configuration for Power BI reports
   * @param reportConfig - Report configuration including ID and embed URL
   * @returns Embed configuration object
   */
  public createEmbedConfig(reportConfig: PowerBIConfig) {
    return {
      type: 'report',
      id: reportConfig.reportId,
      embedUrl: reportConfig.embedUrl,
      accessToken: reportConfig.accessToken || this.config.demoAccessToken,
      tokenType: models.TokenType.Embed,
      settings: {
        panes: {
          filters: {
            expanded: false,
            visible: true
          },
          pageNavigation: {
            visible: true
          }
        },
        background: models.BackgroundType.Transparent,
        bars: {
          statusBar: {
            visible: false
          }
        }
      },
      permissions: models.Permissions.All
    };
  }

  /**
   * Creates dashboard embed configuration
   * @param dashboardConfig - Dashboard configuration
   * @returns Dashboard embed configuration
   */
  public createDashboardEmbedConfig(dashboardConfig: PowerBIConfig) {
    return {
      type: 'dashboard',
      id: dashboardConfig.reportId,
      embedUrl: dashboardConfig.embedUrl,
      accessToken: dashboardConfig.accessToken || this.config.demoAccessToken,
      tokenType: models.TokenType.Embed,
      settings: {
        background: models.BackgroundType.Transparent
      }
    };
  }

  /**
   * Generates embed URL for a report
   * @param reportId - Power BI report ID
   * @param groupId - Optional workspace/group ID
   * @returns Generated embed URL
   */
  public generateEmbedUrl(reportId: string, groupId?: string): string {
    const baseUrl = this.baseUrl;
    const params = new URLSearchParams({
      reportId,
      autoAuth: 'true',
      ctid: this.config.tenantId
    });

    if (groupId) {
      params.append('groupId', groupId);
    }

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * In a production environment, this method would make an API call 
   * to your backend service to obtain a fresh access token
   * @returns Promise<string> - Access token
   */
  public async getAccessToken(): Promise<string> {
    try {
      // TODO: Replace with actual API call to your backend
      // const response = await fetch('/api/powerbi/token', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${userToken}`
      //   }
      // });
      // const data = await response.json();
      // return data.accessToken;

      // For demo purposes, return the demo token
      // In production, remove this and implement proper token fetching
      return this.config.demoAccessToken;
    } catch (error) {
      console.error('Failed to fetch Power BI access token:', error);
      throw new Error('Unable to authenticate with Power BI service');
    }
  }

  /**
   * Event handlers for Power BI embed events
   */
  public getEventHandlers() {
    return new Map([
      ['loaded', () => {
        console.log('Power BI Report loaded successfully');
      }],
      ['rendered', () => {
        console.log('Power BI Report rendered successfully');
      }],
      ['error', (event: any) => {
        console.error('Power BI Error:', event.detail);
        // In production, you might want to send this to your error tracking service
      }],
      ['dataSelected', (event: any) => {
        console.log('Data selected in Power BI:', event.detail);
      }],
      ['pageChanged', (event: any) => {
        console.log('Power BI page changed:', event.detail);
      }]
    ]);
  }

  /**
   * Refresh a Power BI report
   * @param embeddedReport - The embedded report instance
   */
  public async refreshReport(embeddedReport: any): Promise<void> {
    try {
      await embeddedReport.refresh();
      console.log('Report refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh report:', error);
      throw error;
    }
  }

  /**
   * Apply filters to a Power BI report
   * @param embeddedReport - The embedded report instance
   * @param filters - Array of filters to apply
   */
  public async applyFilters(embeddedReport: any, filters: any[]): Promise<void> {
    try {
      await embeddedReport.setFilters(filters);
      console.log('Filters applied successfully');
    } catch (error) {
      console.error('Failed to apply filters:', error);
      throw error;
    }
  }

  /**
   * Export Power BI report to PDF
   * @param embeddedReport - The embedded report instance
   */
  public async exportToPDF(embeddedReport: any): Promise<void> {
    try {
      // Note: Export functionality requires proper permissions and may need server-side implementation
      if (embeddedReport && embeddedReport.print) {
        await embeddedReport.print();
        console.log('Print dialog initiated');
      } else {
        console.log('Export feature not available');
        throw new Error('Export feature not available');
      }
    } catch (error) {
      console.error('Failed to export to PDF:', error);
      throw error;
    }
  }
}

export default PowerBIService.getInstance();