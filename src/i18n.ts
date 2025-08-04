import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  ar: {
    translation: {
      // Navigation & Menu - التنقل والقوائم
      "Executive Overview": "النظرة العامة التنفيذية",
      "Strategic Projects": "المشاريع الاستراتيجية",
      "Board Management": "إدارة مجلس الإدارة",
      "Reports & Analytics": "التقارير والتحليلات",
      "Executive Management Portal": "بوابة الإدارة التنفيذية",
      "Qarar Executive Portal": "بوابة قرار التنفيذية",
      "Board & C-Suite Command Center": "مركز قيادة مجلس الإدارة والإدارة العليا",
      
      // Navigation & Menu Items - الملاحة وعناصر القائمة
      "Strategic Planning": "التخطيط الاستراتيجي",
      "Strategic Timeline": "الجدول الزمني الاستراتيجي",
      "Investment Portfolio": "محفظة الاستثمار",
      "Enterprise Systems": "الأنظمة المؤسسية",
      
      // Companies - الشركات
      "JTC Transport & Logistics": "شركة الجري للنقل واللوجستيات",
      "J:Oil Petroleum": "جي أويل للبترول",
      "Shaheen Rent a Car": "شاهين لتأجير السيارات",
      "45degrees Cafe": "مقهى 45 درجة",
      "Al Jeri Energy": "الجري للطاقة",
      
      // Enterprise Systems - الأنظمة المؤسسية
      "ECC": "نظام التحكم المؤسسي",
      "ECP": "منصة التحكم المؤسسية",
      "KPIs → ERP": "مؤشرات الأداء ← تخطيط موارد المؤسسة",
      
      // Archive Pages - Arabic
      "Executive Reports": "التقارير التنفيذية",
      "2024 Archive": "أرشيف 2024",
      "2025 Current": "الحالية 2025",
      "Total Projects": "إجمالي المشاريع",
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
      "Strategic Decision Making • Executive Intelligence • Board Governance": "اتخاذ القرارات الاستراتيجية • الذكاء التنفيذي • حوكمة مجلس الإدارة",
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
      
      // User Menu
      "Board Profile": "ملف مجلس الإدارة",
      "Executive Settings": "إعدادات الإدارة التنفيذية",
      "Logout": "تسجيل الخروج",
      "Profile": "الملف الشخصي",
      "Settings": "الإعدادات",
      
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
    }
  },
  en: {
    translation: {
      // Navigation & Menu
      "Executive Overview": "Executive Overview",
      "Strategic Projects": "Strategic Projects",
      "Board Management": "Board Management",
      "Reports & Analytics": "Reports & Analytics",
      "Executive Management Portal": "Executive Management Portal",
      "Qarar Executive Portal": "Qarar Executive Portal",
      "Board & C-Suite Command Center": "Board & C-Suite Command Center",
      
      // Navigation & Menu Items - English
      "Strategic Planning": "Strategic Planning",
      "Strategic Timeline": "Strategic Timeline",
      "Investment Portfolio": "Investment Portfolio",
      "Enterprise Systems": "Enterprise Systems",
      
      // Companies - English
      "JTC Transport & Logistics": "JTC Transport & Logistics",
      "J:Oil Petroleum": "J:Oil Petroleum",
      "Shaheen Rent a Car": "Shaheen Rent a Car",
      "45degrees Cafe": "45degrees Cafe",
      "Al Jeri Energy": "Al Jeri Energy",
      
      // Enterprise Systems - English
      "ECC": "ECC",
      "ECP": "ECP",
      "KPIs → ERP": "KPIs → ERP",
      
      // Archive Pages - English
      "Executive Reports": "Executive Reports",
      "2024 Archive": "2024 Archive",
      "2025 Current": "2025 Current",
      "Total Projects": "Total Projects",
      "Quarter": "Quarter",
      "Current Projects": "Current Projects",
      "YTD Revenue": "YTD Revenue",
      "Goals Progress": "Goals Progress",
      "Current Quarter": "Current Quarter",
      "Year Summary": "Year Summary",
      "Key Achievements": "Key Achievements",
      "Active Initiatives": "Active Initiatives",
      "APAC Market Expansion": "APAC Market Expansion",
      "Sustainability Initiative Rollout": "Sustainability Initiative Rollout",
      
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
      "Strategic Decision Making • Executive Intelligence • Board Governance": "Strategic Decision Making • Executive Intelligence • Board Governance",
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
      
      // Timeline
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
      "Loading Executive Dashboard...": "Loading Executive Dashboard...",
      "No data": "No data",
      "Success": "Success",
      "Error": "Error",
      "Warning": "Warning",
      "Info": "Info",
      "Due": "Due",
      "Comments Count": "Comments Count",
      "Attachments": "Attachments",
      "Add": "Add",
      "Close": "Close",
      
      // User Menu
      "Board Profile": "Board Profile",
      "Executive Settings": "Executive Settings",
      "Logout": "Logout",
      "Profile": "Profile",
      "Settings": "Settings",
      
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
    }
  }
};

// Get direction based on language
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
      caches: ['localStorage']
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