import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  ar: {
    translation: {
      // Navigation & Menu - التنقل والقوائم
      "Executive Overview": "النظرة العامة التنفيذية",
      "Strategic Timeline": "الجدول الزمني الاستراتيجي", 
      "Strategic Projects": "المشاريع الاستراتيجية",
      "Board Management": "إدارة مجلس الإدارة",
      "Reports & Analytics": "التقارير والتحليلات",
      "Executive Management Portal": "بوابة الإدارة التنفيذية",
      "Board & C-Suite Command Center": "مركز قيادة مجلس الإدارة والإدارة العليا",
      
      // Login Page
      "Board of Directors & C-Suite Access": "دخول مجلس الإدارة والإدارة العليا",
      "Strategic Command Center": "مركز القيادة الاستراتيجية",
      "Email": "البريد الإلكتروني",
      "Password": "كلمة المرور",
      "Sign In": "تسجيل الدخول",
      "Remember me": "تذكرني",
      "Forgot Password?": "نسيت كلمة المرور؟",
      "Please input your email!": "يرجى إدخال البريد الإلكتروني!",
      "Please enter a valid email!": "يرجى إدخال بريد إلكتروني صحيح!",
      "Please input your password!": "يرجى إدخال كلمة المرور!",
      "Demo Credentials": "بيانات تجريبية",
      
      // Dashboard - لوحة المعلومات
      "Welcome back": "أهلاً بك مرة أخرى",
      "Executive Command Center": "مركز القيادة التنفيذية",
      "Strategic overview and real-time performance insights": "نظرة عامة استراتيجية ورؤى الأداء في الوقت الفعلي",
      "Total Revenue": "إجمالي الإيرادات",
      "Annual Revenue": "الإيرادات السنوية",
      "Active Projects": "المشاريع النشطة",
      "Team Members": "أعضاء الفريق", 
      "Success Rate": "معدل النجاح",
      "Efficiency Score": "درجة الكفاءة",
      "Revenue Performance vs Target": "أداء الإيرادات مقابل الهدف",
      "Strategic Initiatives": "المبادرات الاستراتيجية",
      "Digital Transformation": "التحول الرقمي",
      "Market Expansion": "التوسع في السوق",
      "Innovation Projects": "مشاريع الابتكار",
      "AI & Automation": "الذكاء الاصطناعي والأتمتة",
      "Innovation Lab": "مختبر الابتكار",
      
      // Timeline - الجدول الزمني  
      "Q1 Strategic Planning": "التخطيط الاستراتيجي ربع1",
      "Innovation Lab Launch": "إطلاق مختبر الابتكار",
      "Strategic Partnerships": "الشراكات الاستراتيجية",
      "IPO Preparation": "التحضير للطرح العام",
      
      "Jan 2024": "يناير 2024",
      "Feb - Apr 2024": "فبراير - أبريل 2024",
      "May - Aug 2024": "مايو - أغسطس 2024", 
      "Sep - Nov 2024": "سبتمبر - نوفمبر 2024",
      "Dec 2024 - Feb 2025": "ديسمبر 2024 - فبراير 2025",
      "Mar - Jun 2025": "مارس - يونيو 2025",
      
      "Comprehensive strategic review and 2025 roadmap development": "مراجعة استراتيجية شاملة وتطوير خارطة طريق 2025",
      "Enterprise-wide digital infrastructure modernization": "تحديث البنية التحتية الرقمية على مستوى المؤسسة",
      "Entry into European and Asian markets": "الدخول إلى الأسواق الأوروبية والآسيوية",
      "Establish R&D center for next-gen products": "إنشاء مركز للبحث والتطوير للمنتجات المستقبلية",
      "Form alliances with industry leaders": "تكوين تحالفات مع قادة الصناعة",
      "Prepare for public listing and regulatory compliance": "التحضير للطرح العام والامتثال التنظيمي",
      
      "5-Year Strategic Plan": "خطة استراتيجية لخمس سنوات",
      "Resource Allocation": "تخصيص الموارد", 
      "KPI Framework": "إطار مؤشرات الأداء الرئيسية",
      "Cloud Migration": "الهجرة السحابية",
      "AI Integration": "تكامل الذكاء الاصطناعي",
      "Process Automation": "أتمتة العمليات",
      "Market Research": "بحوث السوق",
      "Local Partnerships": "الشراكات المحلية", 
      "Revenue Growth": "نمو الإيرادات",
      "Innovation Center": "مركز الابتكار",
      "Patent Portfolio": "محفظة براءات الاختراع",
      "Product Prototypes": "نماذج أولية للمنتجات",
      "Partnership Agreements": "اتفاقيات الشراكة",
      "Joint Ventures": "المشاريع المشتركة",
      "Market Access": "الوصول للسوق",
      "SEC Filing": "تقديم هيئة الأوراق المالية",
      "Roadshow": "العرض التسويقي",
      "Public Trading": "التداول العام",
      
      "Executive roadmap and strategic milestones": "خارطة الطريق التنفيذية والمعالم الاستراتيجية",

      // KPI Cards - بطاقات مؤشرات الأداء الرئيسية
      "Excellent": "ممتاز",
      "Hot": "رائع",
      "Growth": "النمو",
      "Revenue": "الإيرادات",
      "Performance": "الأداء",
      "Alerts": "التنبيهات",
      "Alert": "تنبيه",
      "vs Target": "مقابل الهدف",
      "Target": "الهدف",
      
      // Notifications - الإشعارات
      "Notifications": "الإشعارات",
      "3 Alerts": "3 تنبيهات",
      "Mark all as read": "تعيين الكل كمقروء",
      "No notifications yet": "لا توجد إشعارات بعد",
      "New notification": "إشعار جديد",
      "لديك إشعار جديد": "لديك إشعار جديد",
      
      // Events - الأحداث
      "Upcoming Events": "الأحداث القادمة",
      "Board Meeting Q4 Review": "اجتماع مجلس الإدارة - مراجعة الربع الرابع",
      "Digital Strategy Presentation": "عرض الاستراتيجية الرقمية", 
      "Investor Relations Call": "مكالمة علاقات المستثمرين",
      "Today": "اليوم",
      "Tomorrow": "غداً",
      "Join Meeting": "انضم للاجتماع",
      "View Report": "عرض التقرير",
      "Review Budget": "مراجعة الميزانية",
      
      // Quick Actions - الإجراءات السريعة
      "Quick Actions": "الإجراءات السريعة",  
      "New Initiative": "مبادرة جديدة",
      "Team Review": "مراجعة الفريق", 
      "Schedule Meeting": "جدولة اجتماع",
      "Send Update": "إرسال تحديث",
      "Executive Guide": "دليل المدير التنفيذي",
      
      // Achievements - الإنجازات
      "Achievements": "الإنجازات",
      "Achievement Unlocked!": "تم فتح إنجاز!",
      "Total Points": "إجمالي النقاط",
      "Overall Progress": "التقدم العام",
      "Revenue Master": "سيد الإيرادات",
      "Team Builder": "بناء الفريق",
      "Innovation Champion": "بطل الابتكار",
      "Meeting Master": "سيد الاجتماعات",
      "Efficiency Expert": "خبير الكفاءة",
      "Strategic Visionary": "صاحب الرؤية الاستراتيجية",
      
      // Recommendations - التوصيات
      "Recommendations": "التوصيات",
      "Add Recommendation": "إضافة توصية",
      "Recommendation Title": "عنوان التوصية",
      "Recommendation Description": "وصف التوصية", 
      "Submit Recommendation": "تقديم التوصية",
      "Project Recommendations": "توصيات المشروع",
      
      // Board Management  
      "Executive initiatives": "المبادرات التنفيذية",
      "Strategic tracking": "التتبع الاستراتيجي",
      "Add Task": "إضافة مهمة",
      "Edit Task": "تعديل المهمة",
      "Delete": "حذف",
      "Priority": "الأولوية",
      "Status": "الحالة",
      "Assignee": "المكلف",
      "Due Date": "تاريخ الاستحقاق",
      
      // User Menu
      "Board Profile": "ملف مجلس الإدارة",
      "Executive Settings": "إعدادات الإدارة التنفيذية",
      "Logout": "تسجيل الخروج",
      "Profile": "الملف الشخصي",
      "Settings": "الإعدادات",
      
      // Kanban Board - لوحة كانبان
      "Strategic Planning": "التخطيط الاستراتيجي",
      "In Execution": "قيد التنفيذ",
      "Board Review": "مراجعة مجلس الإدارة",
      "Completed Tasks": "المهام المكتملة",
      "Add Strategic Initiative": "إضافة مبادرة استراتيجية",
      "Executive Commentary": "التعليق التنفيذي",
      "Add Executive Comment": "إضافة تعليق تنفيذي",
      "Executive Comment or Strategic Direction:": "تعليق تنفيذي أو توجيه استراتيجي:",
      "Add your executive insight, strategic direction, or board-level commentary...": "أضف رؤيتك التنفيذية أو التوجيه الاستراتيجي أو تعليق مستوى مجلس الإدارة...",
      "Visibility Level:": "مستوى الرؤية:",
      "C-Level Only": "الإدارة العليا فقط",
      "Board Members": "أعضاء مجلس الإدارة",
      "Senior Management": "الإدارة العليا",
      "2025 Vision & Strategy Document": "وثيقة الرؤية والاستراتيجية 2025",
      "Develop comprehensive strategic vision and roadmap for 2025-2027": "تطوير رؤية استراتيجية شاملة وخارطة طريق للفترة 2025-2027",
      "Market Analysis - Emerging Technologies": "تحليل السوق - التقنيات الناشئة",
      "Digital Transformation Phase 2": "المرحلة الثانية من التحول الرقمي",

      // Archive Pages - Arabic
      "Total Projects": "إجمالي المشاريع",
      "Revenue": "الإيرادات", 
      "Achievements": "الإنجازات",
      "Quarter": "الربع",
      "Current Projects": "المشاريع الحالية",
      "YTD Revenue": "إيرادات العام حتى التاريخ",
      "Goals Progress": "تقدم الأهداف",
      "Current Quarter": "الربع الحالي",
      "Year Summary": "ملخص العام",
      "Key Achievements": "الإنجازات الرئيسية",
      "Active Initiatives": "المبادرات النشطة",
      "APAC Market Expansion": "توسع السوق في منطقة آسيا والمحيط الهادئ",
      "Sustainability Initiative Rollout": "طرح مبادرة الاستدامة",
      
      // Timeline - الجدول الزمني
      "Digital Transformation Initiative Launch": "إطلاق مبادرة التحول الرقمي",
      "Q1 Board Meeting - Strategic Review": "اجتماع مجلس الإدارة للربع الأول - المراجعة الاستراتيجية",
      "Market Expansion - APAC Region": "توسع السوق - منطقة آسيا والمحيط الهادئ",
      "Official launch of operations in Asia-Pacific region": "الإطلاق الرسمي للعمليات في منطقة آسيا والمحيط الهادئ",
      
      // Priority levels - مستويات الأولوية
      "critical": "حرج",
      "Critical": "حرج",
      "high": "عالي",
      "High": "عالي", 
      "medium": "متوسط",
      "Medium": "متوسط",
      "low": "منخفض",
      "Low": "منخفض",
      
      // Status - الحالة
      "completed": "مكتمل",
      "in-progress": "قيد التنفيذ", 
      "In Progress": "قيد التنفيذ",
      "active": "نشط",
      "upcoming": "قادم",
      "delayed": "متأخر",
      "Planned": "مخطط",
      
      // Common
      "Save": "حفظ",
      "Cancel": "إلغاء",
      "Edit": "تعديل",
      "View": "عرض",
      "Search": "بحث",
      "Filter": "تصفية",
      "Export": "تصدير",
      "Import": "استيراد",
      "Refresh": "تحديث",
      "Loading": "جاري التحميل",
      "Loading Executive Dashboard...": "جاري تحميل لوحة القيادة التنفيذية...",
      "No data": "لا توجد بيانات",
      "Success": "نجح",
      "Error": "خطأ",
      "Warning": "تحذير",
      "Info": "معلومات",
      "Due": "تاريخ الاستحقاق",
      "Comments Count": "عدد التعليقات",
      "Attachments": "المرفقات",
      "Add": "إضافة",
      "Close": "إغلاق",
      
      // Timeline Categories - فئات الجدول الزمني  
      "strategic": "استراتيجي",
      "operational": "تشغيلي",
      "partnership": "شراكة",
      
      // Strategic Planning & Archives  
      "Archives": "الأرشيف",
      "2024 Archive": "أرشيف 2024",
      "2025 Current": "العام الحالي 2025",

      // Timeline - الجدول الزمني (NEW TIMELINE TRANSLATIONS)
      "Board-level milestones and strategic initiatives roadmap": "معالم مستوى مجلس الإدارة وخارطة طريق المبادرات الاستراتيجية",

    }
  },
  en: {
    translation: {
      // Complete English translations
      "Executive Overview": "Executive Overview",
      "Strategic Timeline": "Strategic Timeline",
      
      // Timeline - English
      "Q1 Strategic Planning": "Q1 Strategic Planning",
      "Innovation Lab Launch": "Innovation Lab Launch",
      "Strategic Partnerships": "Strategic Partnerships",
      "IPO Preparation": "IPO Preparation",
      
      "Jan 2024": "Jan 2024",
      "Feb - Apr 2024": "Feb - Apr 2024",
      "May - Aug 2024": "May - Aug 2024", 
      "Sep - Nov 2024": "Sep - Nov 2024",
      "Dec 2024 - Feb 2025": "Dec 2024 - Feb 2025",
      "Mar - Jun 2025": "Mar - Jun 2025",
      
      "Comprehensive strategic review and 2025 roadmap development": "Comprehensive strategic review and 2025 roadmap development",
      "Enterprise-wide digital infrastructure modernization": "Enterprise-wide digital infrastructure modernization",
      "Entry into European and Asian markets": "Entry into European and Asian markets",
      "Establish R&D center for next-gen products": "Establish R&D center for next-gen products",
      "Form alliances with industry leaders": "Form alliances with industry leaders",
      "Prepare for public listing and regulatory compliance": "Prepare for public listing and regulatory compliance",
      
      "5-Year Strategic Plan": "5-Year Strategic Plan",
      "Resource Allocation": "Resource Allocation", 
      "KPI Framework": "KPI Framework",
      "Cloud Migration": "Cloud Migration",
      "AI Integration": "AI Integration",
      "Process Automation": "Process Automation",
      "Market Research": "Market Research",
      "Local Partnerships": "Local Partnerships", 
      "Revenue Growth": "Revenue Growth",
      "Innovation Center": "Innovation Center",
      "Patent Portfolio": "Patent Portfolio",
      "Product Prototypes": "Product Prototypes",
      "Partnership Agreements": "Partnership Agreements",
      "Joint Ventures": "Joint Ventures",
      "Market Access": "Market Access",
      "SEC Filing": "SEC Filing",
      "Roadshow": "Roadshow",
      "Public Trading": "Public Trading",
      "Strategic Projects": "Strategic Projects",
      "Board Management": "Board Management",
      "Reports & Analytics": "Reports & Analytics",
      "Executive Management Portal": "Executive Management Portal",
      "Board & C-Suite Command Center": "Board & C-Suite Command Center",
      
      // Login Page
      "Board of Directors & C-Suite Access": "Board of Directors & C-Suite Access",
      "Strategic Command Center": "Strategic Command Center",
      "Email": "Email",
      "Password": "Password",
      "Sign In": "Sign In",
      "Remember me": "Remember me",
      "Forgot Password?": "Forgot Password?",
      "Please input your email!": "Please input your email!",
      "Please enter a valid email!": "Please enter a valid email!",
      "Please input your password!": "Please input your password!",
      "Demo Credentials": "Demo Credentials",
      
      // Dashboard
      "Welcome back": "Welcome back",
      "Executive Command Center": "Executive Command Center",
      "Strategic overview and real-time performance insights": "Strategic overview and real-time performance insights",
      "Total Revenue": "Total Revenue",
      "Annual Revenue": "Annual Revenue",
      "Active Projects": "Active Projects",
      "Team Members": "Team Members", 
      "Success Rate": "Success Rate",
      "Efficiency Score": "Efficiency Score",
      "Revenue Performance vs Target": "Revenue Performance vs Target",
      "Strategic Initiatives": "Strategic Initiatives",
      "Digital Transformation": "Digital Transformation",
      "Market Expansion": "Market Expansion",
      "Innovation Projects": "Innovation Projects",
      "AI & Automation": "AI & Automation",
      "Innovation Lab": "Innovation Lab",
      
      // Notifications
      "Notifications": "Notifications",
      "3 Alerts": "3 Alerts",
      "Mark all as read": "Mark all as read",
      "No notifications yet": "No notifications yet",
      "New notification": "New notification",
      "لديك إشعار جديد": "You have a new notification",
      
      // Events
      "Upcoming Events": "Upcoming Events",
      "Board Meeting Q4 Review": "Board Meeting Q4 Review",
      "Digital Strategy Presentation": "Digital Strategy Presentation", 
      "Investor Relations Call": "Investor Relations Call",
      "Today": "Today",
      "Tomorrow": "Tomorrow",
      "Join Meeting": "Join Meeting",
      "View Report": "View Report",
      "Review Budget": "Review Budget",
      
      // Quick Actions
      "Quick Actions": "Quick Actions",  
      "New Initiative": "New Initiative",
      "Team Review": "Team Review", 
      "Schedule Meeting": "Schedule Meeting",
      "Send Update": "Send Update",
      "Executive Guide": "Executive Guide",
      
      // Achievements
      "Achievements": "Achievements",
      "Achievement Unlocked!": "Achievement Unlocked!",
      "Total Points": "Total Points",
      "Overall Progress": "Overall Progress",
      "Revenue Master": "Revenue Master",
      "Team Builder": "Team Builder",
      "Innovation Champion": "Innovation Champion",
      "Meeting Master": "Meeting Master",
      "Efficiency Expert": "Efficiency Expert",
      "Strategic Visionary": "Strategic Visionary",
      
      // Recommendations
      "Recommendations": "Recommendations",
      "Add Recommendation": "Add Recommendation",
      "Recommendation Title": "Recommendation Title",
      "Recommendation Description": "Recommendation Description", 
      "Submit Recommendation": "Submit Recommendation",
      "Project Recommendations": "Project Recommendations",
      
      // Timeline
      "Completed": "Completed",
      "In Progress": "In Progress",
      "Planned": "Planned",
      "Critical": "Critical",
      "High": "High",
      "Medium": "Medium",
      "Low": "Low",
      
      // Board Management  
      "Executive initiatives": "Executive initiatives",
      "Strategic tracking": "Strategic tracking",
      "Add Task": "Add Task",
      "Edit Task": "Edit Task",
      "Delete": "Delete",
      "Priority": "Priority",
      "Status": "Status",
      "Assignee": "Assignee",
      "Due Date": "Due Date",
      
      // User Menu
      "Board Profile": "Board Profile",
      "Executive Settings": "Executive Settings",
      "Logout": "Logout",
      "Profile": "Profile",
      "Settings": "Settings",
      
      // Common
      "Save": "Save",
      "Cancel": "Cancel",
      "Edit": "Edit",
      "View": "View",
      "Search": "Search",
      "Filter": "Filter",
      "Export": "Export",
      "Import": "Import",
      "Refresh": "Refresh",
      "Loading": "Loading",
      "No data": "No data",
      "Success": "Success",
      "Error": "Error",
      "Warning": "Warning",
      "Info": "Info",
      
      // Timeline Categories - English
      "strategic": "strategic",
      "operational": "operational", 
      "partnership": "partnership",
      
      // Strategic Planning & Archives - English
      "Strategic Planning": "Strategic Planning",
      "Archives": "Archives",
      "2024 Archive": "2024 Archive",
      "2025 Current": "2025 Current",

      // Archive Pages - English
      "Total Projects": "Total Projects",
      "Revenue": "Revenue",
      "Achievements": "Achievements",
      "Quarter": "Quarter",
      "Current Projects": "Current Projects",
      "YTD Revenue": "YTD Revenue",
      "Goals Progress": "Goals Progress",
      "Current Quarter": "Current Quarter",

      // Timeline - English (CLEAN VERSION)
      "Board-level milestones and strategic initiatives roadmap": "Board-level milestones and strategic initiatives roadmap",
      "Add Executive Comment": "Add Executive Comment",
      "Add Comment": "Add Comment",
      "Add your executive comment or strategic insight...": "Add your executive comment or strategic insight...",
      "Attach Documents": "Attach Documents"
    }
  }
};

// Direction mapping for languages
const getDirection = (language: string) => {
  return language === 'ar' ? 'rtl' : 'ltr';
};

// Update document direction and language attributes
const updateDocumentDirection = (language: string) => {
  const direction = getDirection(language);
  document.documentElement.setAttribute('dir', direction);
  document.documentElement.setAttribute('lang', language);
  document.body.style.fontFamily = language === 'ar' 
    ? "'Noto Sans Arabic', 'Cairo', 'Amiri', system-ui, -apple-system, sans-serif"
    : "'Inter', system-ui, -apple-system, sans-serif";
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // Remove hardcoded lng - let LanguageDetector handle it
    fallbackLng: "ar",
    debug: false,
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lng',
      lookupLocalStorage: 'selectedLanguage',
      caches: ['localStorage'],
      checkWhitelist: true
    }
  });

// Listen for language changes and update document direction
i18n.on('languageChanged', (lng) => {
  updateDocumentDirection(lng);
});

// Initialize direction on load
updateDocumentDirection(i18n.language);

export default i18n;
export { i18n, getDirection, updateDocumentDirection };