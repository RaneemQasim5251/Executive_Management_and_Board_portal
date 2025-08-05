// خدمة بيانات Excel / Excel Data Service
import * as XLSX from 'xlsx';

// واجهة بيانات المشروع من Excel / Excel Project Data Interface
export interface ExcelProjectData {
  id: string;
  projectNameAr: string;
  projectNameEn: string;
  status: string;
  progress: number;
  budget: number;
  startDate: string;
  endDate: string;
  manager: string;
  team: string;
  phase: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  description: string;
  risks: string;
  objectives: string;
  milestones: string;
}

class ExcelDataService {
  private static instance: ExcelDataService;
  private cachedData: ExcelProjectData[] = [];

  public static getInstance(): ExcelDataService {
    if (!ExcelDataService.instance) {
      ExcelDataService.instance = new ExcelDataService();
    }
    return ExcelDataService.instance;
  }

  // قراءة ملف Excel / Read Excel file
  async readExcelFile(file: File): Promise<ExcelProjectData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // تحويل البيانات إلى JSON / Convert data to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // معالجة البيانات / Process data
          const processedData = this.processExcelData(jsonData as any[][]);
          this.cachedData = processedData;
          
          resolve(processedData);
        } catch (error) {
          reject(new Error('Failed to read Excel file: ' + error));
        }
      };
       
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsBinaryString(file);
    });
  }

  // تحميل البيانات من مسار ملف / Load data from file path
  async loadDataFromPath(_filePath: string): Promise<ExcelProjectData[]> {
    try {
      // محاكاة تحميل الملف من المسار / Simulate loading file from path
      // في التطبيق الحقيقي، ستحتاج إلى استخدام API لتحميل الملف
      const mockData = await this.getMockProjectData();
      this.cachedData = mockData;
      return mockData;
    } catch (error) {
      throw new Error('Failed to load Excel data: ' + error);
    }
  }

  // معالجة بيانات Excel / Process Excel data
  private processExcelData(rawData: any[][]): ExcelProjectData[] {
    if (rawData.length < 2) {
      throw new Error('Excel file must contain headers and data');
    }

    const headers = rawData[0];
    const dataRows = rawData.slice(1);

    // تحديد مؤشرات الأعمدة / Determine column indices
    const columnMapping = this.createColumnMapping(headers);

    return dataRows
      .filter(row => row && row.length > 0 && row[0]) // تصفية الصفوف الفارغة
      .map((row, index) => {
        try {
          return {
            id: row[columnMapping.id] || `proj-${index + 1}`,
            projectNameAr: row[columnMapping.projectNameAr] || `مشروع ${index + 1}`,
            projectNameEn: row[columnMapping.projectNameEn] || `Project ${index + 1}`,
            status: row[columnMapping.status] || 'في التخطيط',
            progress: this.parseNumber(row[columnMapping.progress]) || 0,
            budget: this.parseNumber(row[columnMapping.budget]) || 0,
            startDate: this.parseDate(row[columnMapping.startDate]) || new Date().toISOString().split('T')[0],
            endDate: this.parseDate(row[columnMapping.endDate]) || new Date().toISOString().split('T')[0],
            manager: row[columnMapping.manager] || 'غير محدد',
            team: row[columnMapping.team] || 'فريق المشروع',
            phase: row[columnMapping.phase] || 'المرحلة الأولى',
            priority: this.parsePriority(row[columnMapping.priority]) || 'medium',
            category: row[columnMapping.category] || 'عام',
            description: row[columnMapping.description] || '',
            risks: row[columnMapping.risks] || '',
            objectives: row[columnMapping.objectives] || '',
            milestones: row[columnMapping.milestones] || '',
          };
        } catch (error) {
          console.warn(`Error processing row ${index + 1}:`, error);
          return null;
        }
      })
      .filter((item): item is ExcelProjectData => item !== null);
  }

  // إنشاء خريطة الأعمدة / Create column mapping
  private createColumnMapping(headers: string[]): Record<string, number> {
    const mapping: Record<string, number> = {};
    
    headers.forEach((header, index) => {
      const lowerHeader = header.toLowerCase().trim();
      
      // تحديد نوع العمود بناءً على الاسم / Determine column type based on name
      if (lowerHeader.includes('id') || lowerHeader === 'معرف') {
        mapping.id = index;
      } else if (lowerHeader.includes('name') && lowerHeader.includes('ar') || lowerHeader === 'الاسم العربي') {
        mapping.projectNameAr = index;
      } else if (lowerHeader.includes('name') && lowerHeader.includes('en') || lowerHeader === 'الاسم الإنجليزي') {
        mapping.projectNameEn = index;
      } else if (lowerHeader.includes('status') || lowerHeader === 'الحالة') {
        mapping.status = index;
      } else if (lowerHeader.includes('progress') || lowerHeader === 'التقدم') {
        mapping.progress = index;
      } else if (lowerHeader.includes('budget') || lowerHeader === 'الميزانية') {
        mapping.budget = index;
      } else if (lowerHeader.includes('start') || lowerHeader === 'تاريخ البداية') {
        mapping.startDate = index;
      } else if (lowerHeader.includes('end') || lowerHeader === 'تاريخ النهاية') {
        mapping.endDate = index;
      } else if (lowerHeader.includes('manager') || lowerHeader === 'المدير') {
        mapping.manager = index;
      } else if (lowerHeader.includes('team') || lowerHeader === 'الفريق') {
        mapping.team = index;
      } else if (lowerHeader.includes('phase') || lowerHeader === 'المرحلة') {
        mapping.phase = index;
      } else if (lowerHeader.includes('priority') || lowerHeader === 'الأولوية') {
        mapping.priority = index;
      } else if (lowerHeader.includes('category') || lowerHeader === 'الفئة') {
        mapping.category = index;
      } else if (lowerHeader.includes('description') || lowerHeader === 'الوصف') {
        mapping.description = index;
      } else if (lowerHeader.includes('risk') || lowerHeader === 'المخاطر') {
        mapping.risks = index;
      } else if (lowerHeader.includes('objective') || lowerHeader === 'الأهداف') {
        mapping.objectives = index;
      } else if (lowerHeader.includes('milestone') || lowerHeader === 'المعالم') {
        mapping.milestones = index;
      }
    });

    return mapping;
  }

  // تحليل الأرقام / Parse numbers
  private parseNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^\d.-]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  // تحليل التواريخ / Parse dates
  private parseDate(value: any): string | null {
    if (!value) return null;
    
    try {
      if (typeof value === 'number') {
        // Excel date serial number
        const date = new Date((value - 25569) * 86400 * 1000);
        return date.toISOString().split('T')[0];
      } else if (typeof value === 'string') {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      }
    } catch (error) {
      console.warn('Error parsing date:', value, error);
    }
    
    return null;
  }

  // تحليل الأولوية / Parse priority
  private parsePriority(value: any): 'high' | 'medium' | 'low' {
    if (!value) return 'medium';
    
    const str = value.toString().toLowerCase().trim();
    
    if (str.includes('high') || str.includes('عالي') || str.includes('مرتفع')) {
      return 'high';
    } else if (str.includes('low') || str.includes('منخفض') || str.includes('قليل')) {
      return 'low';
    }
    
    return 'medium';
  }

  // الحصول على البيانات المخزنة مؤقتاً / Get cached data
  getCachedData(): ExcelProjectData[] {
    return [...this.cachedData];
  }

  // تصفية البيانات / Filter data
  filterData(filters: {
    status?: string[];
    priority?: string[];
    manager?: string;
    dateRange?: [string, string];
  }): ExcelProjectData[] {
    let filtered = [...this.cachedData];

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(item => filters.status!.includes(item.status));
    }

    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(item => filters.priority!.includes(item.priority));
    }

    if (filters.manager) {
      filtered = filtered.filter(item => 
        item.manager.toLowerCase().includes(filters.manager!.toLowerCase())
      );
    }

    if (filters.dateRange) {
      const [start, end] = filters.dateRange;
      filtered = filtered.filter(item => 
        item.startDate >= start && item.startDate <= end
      );
    }

    return filtered;
  }

  // تصدير البيانات إلى Excel / Export data to Excel
  exportToExcel(data: ExcelProjectData[], filename: string = 'projects-export.xlsx'): void {
    const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
      'معرف المشروع': item.id,
      'اسم المشروع (عربي)': item.projectNameAr,
      'اسم المشروع (إنجليزي)': item.projectNameEn,
      'الحالة': item.status,
      'نسبة التقدم': `${item.progress}%`,
      'الميزانية': item.budget,
      'تاريخ البداية': item.startDate,
      'تاريخ النهاية': item.endDate,
      'المدير': item.manager,
      'الفريق': item.team,
      'المرحلة': item.phase,
      'الأولوية': item.priority,
      'الفئة': item.category,
      'الوصف': item.description,
      'المخاطر': item.risks,
      'الأهداف': item.objectives,
      'المعالم': item.milestones,
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'المشاريع');
    
    XLSX.writeFile(workbook, filename);
  }

  // إحصائيات البيانات / Data statistics
  getStatistics(): {
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    avgProgress: number;
    totalBudget: number;
    upcomingDeadlines: ExcelProjectData[];
  } {
    const data = this.cachedData;
    
    const byStatus = data.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byPriority = data.reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgProgress = data.reduce((sum, item) => sum + item.progress, 0) / data.length || 0;
    const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);

    // المشاريع التي تنتهي خلال 30 يوماً / Projects ending within 30 days
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const upcomingDeadlines = data.filter(item => {
      const endDate = new Date(item.endDate);
      return endDate >= now && endDate <= thirtyDaysFromNow;
    });

    return {
      total: data.length,
      byStatus,
      byPriority,
      avgProgress: Math.round(avgProgress),
      totalBudget,
      upcomingDeadlines,
    };
  }

  // بيانات وهمية للاختبار / Mock data for testing
  private async getMockProjectData(): Promise<ExcelProjectData[]> {
    return [
      {
        id: 'proj-001',
        projectNameAr: 'منصة التحول الرقمي',
        projectNameEn: 'Digital Transformation Platform',
        status: 'في التنفيذ',
        progress: 75,
        budget: 2500000,
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        manager: 'أحمد محمد التقني',
        team: 'فريق التطوير التقني',
        phase: 'المرحلة الثالثة - التطوير',
        priority: 'high',
        category: 'تقنية المعلومات',
        description: 'تطوير منصة شاملة للتحول الرقمي في الشركة',
        risks: 'تأخير في التطوير، نقص الموارد التقنية',
        objectives: 'أتمتة العمليات، تحسين الكفاءة، تقليل التكاليف',
        milestones: 'تحليل المتطلبات، التصميم، التطوير، الاختبار، النشر',
      },
      {
        id: 'proj-002',
        projectNameAr: 'توسيع السوق الإقليمي',
        projectNameEn: 'Regional Market Expansion',
        status: 'مكتمل',
        progress: 100,
        budget: 1800000,
        startDate: '2024-03-01',
        endDate: '2024-11-30',
        manager: 'فاطمة عبدالله التسويق',
        team: 'فريق التسويق والمبيعات',
        phase: 'مكتمل بنجاح',
        priority: 'medium',
        category: 'التسويق والمبيعات',
        description: 'توسيع نطاق العمل في الأسواق الإقليمية الجديدة',
        risks: 'منافسة شديدة، تحديات ثقافية',
        objectives: 'زيادة الحصة السوقية، تنويع مصادر الدخل',
        milestones: 'دراسة السوق، استراتيجية الدخول، التنفيذ، المتابعة',
      },
      {
        id: 'proj-003',
        projectNameAr: 'مختبر الابتكار والبحث',
        projectNameEn: 'Innovation & Research Lab',
        status: 'في البداية',
        progress: 25,
        budget: 1200000,
        startDate: '2024-06-01',
        endDate: '2025-05-31',
        manager: 'سارة أحمد الابتكار',
        team: 'فريق البحث والتطوير',
        phase: 'المرحلة الأولى - التخطيط',
        priority: 'high',
        category: 'البحث والتطوير',
        description: 'إنشاء مختبر متطور للابتكار والبحث العلمي',
        risks: 'صعوبة الحصول على المواهب، تكاليف المعدات',
        objectives: 'تطوير منتجات جديدة، تعزيز القدرات البحثية',
        milestones: 'التخطيط، البناء، التجهيز، التشغيل التجريبي',
      },
      {
        id: 'proj-004',
        projectNameAr: 'نظام إدارة الموارد البشرية',
        projectNameEn: 'HR Management System',
        status: 'معلق',
        progress: 40,
        budget: 800000,
        startDate: '2024-04-01',
        endDate: '2024-10-31',
        manager: 'محمد علي الموارد',
        team: 'فريق الموارد البشرية والتقنية',
        phase: 'المرحلة الثانية - متوقف مؤقتاً',
        priority: 'medium',
        category: 'الموارد البشرية',
        description: 'تطوير نظام متكامل لإدارة الموارد البشرية',
        risks: 'تغيير المتطلبات، مقاومة التغيير',
        objectives: 'أتمتة عمليات الموارد البشرية، تحسين الخدمات',
        milestones: 'تحليل المتطلبات، التصميم، التطوير، التدريب',
      },
      {
        id: 'proj-005',
        projectNameAr: 'مبادرة الاستدامة البيئية',
        projectNameEn: 'Environmental Sustainability Initiative',
        status: 'في التنفيذ',
        progress: 55,
        budget: 950000,
        startDate: '2024-02-15',
        endDate: '2024-08-15',
        manager: 'ليلى سالم البيئة',
        team: 'فريق الاستدامة والعمليات',
        phase: 'المرحلة الثانية - التنفيذ',
        priority: 'low',
        category: 'الاستدامة',
        description: 'تطبيق ممارسات الاستدامة البيئية في جميع العمليات',
        risks: 'تكاليف إضافية، تعقيد التنفيذ',
        objectives: 'تقليل البصمة الكربونية، تحسين الصورة المؤسسية',
        milestones: 'التقييم البيئي، وضع الخطة، التنفيذ، المراقبة',
      },
    ];
  }

  // تحديث بيانات مشروع / Update project data
  updateProject(projectId: string, updates: Partial<ExcelProjectData>): boolean {
    const index = this.cachedData.findIndex(project => project.id === projectId);
    if (index !== -1) {
      this.cachedData[index] = { ...this.cachedData[index], ...updates };
      return true;
    }
    return false;
  }

  // إضافة مشروع جديد / Add new project
  addProject(project: ExcelProjectData): void {
    this.cachedData.unshift(project);
  }

  // حذف مشروع / Delete project
  deleteProject(projectId: string): boolean {
    const initialLength = this.cachedData.length;
    this.cachedData = this.cachedData.filter(project => project.id !== projectId);
    return this.cachedData.length < initialLength;
  }
}

// تصدير المثيل الوحيد / Export singleton instance
export const excelDataService = ExcelDataService.getInstance();