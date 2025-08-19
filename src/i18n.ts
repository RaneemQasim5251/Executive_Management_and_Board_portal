import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  ar: {
    translation: {
      // Navigation & Menu - التنقل والقوائم
      "Executive Overview": "النظرة العامة التنفيذية",
      "Board Mark": "توقيع المجلس",
      "Strategic Projects": "المشاريع الاستراتيجية",
      "Board Management": "إدارة مجلس الإدارة",
      "Reports & Analytics": "التقارير والتحليلات",
      "Executive Management Portal": "بوابة الإدارة التنفيذية",
      "Qarar Executive Portal": "بوابة قرار التنفيذية",
      "Board & C-Suite Command Center": "مركز قيادة مجلس الإدارة والإدارة العليا",
      "My Meetings": "جدول الأعمال",
      
      // Theme & Accessibility - الثيم وإمكانية الوصول
      "Theme & Accessibility Settings": "إعدادات الثيم وإمكانية الوصول",
      "Light Theme": "الثيم الفاتح",
      "Dark Theme": "الثيم الداكن",
      "Eye Comfort": "راحة العين",
      "Clean and bright interface": "واجهة نظيفة ومشرقة",
      "Easy on the eyes in low light": "مريح للعين في الإضاءة المنخفضة",
      "Optimized for extended use": "محسّن للاستخدام المطول",
      "Small (14px)": "صغير (14 بكسل)",
      "Medium (16px)": "متوسط (16 بكسل)",
      "Large (18px)": "كبير (18 بكسل)",
      "Extra Large (20px)": "كبير جداً (20 بكسل)",
      "Font Size": "حجم الخط",
      "Motion & Animations": "الحركة والرسوم المتحركة",
      "Full Animations": "رسوم متحركة كاملة",
      "Reduced Motion": "حركة مقللة",
      "No Animations": "بدون رسوم متحركة",
      "High Contrast": "تباين عالي",
      "Focus Ring Visible": "حلقة التركيز مرئية",
      "Reduced Transparency": "شفافية مقللة",
      "Color Blindness Support": "دعم عمى الألوان",
      "Improves text visibility": "يحسن رؤية النص",
      "Shows focus outline for keyboard navigation": "يُظهر حدود التركيز للتنقل بلوحة المفاتيح",
      "Removes transparent effects": "يزيل التأثيرات الشفافة",
      "Adjusts colors for better distinction": "يعدل الألوان لتمييز أفضل",
      "Reduce motion to prevent vestibular disorders": "قلل الحركة لمنع اضطرابات الدهليز",
      "Larger text improves readability and accessibility": "النص الأكبر يحسن القراءة وإمكانية الوصول",
      "WCAG AA Compliant": "متوافق مع WCAG AA",
      "Accessibility Can Be Improved": "يمكن تحسين إمكانية الوصول",
      "Your current settings meet accessibility guidelines": "إعداداتك الحالية تلبي إرشادات إمكانية الوصول",
      "Consider enabling high contrast or increasing font size": "فكر في تفعيل التباين العالي أو زيادة حجم الخط",
      "Accessibility Options": "خيارات إمكانية الوصول",
      "Accessibility Tips": "نصائح إمكانية الوصول",
      "Use keyboard Tab and Enter to navigate": "استخدم Tab و Enter للتنقل بلوحة المفاتيح",
      "Enable high contrast in bright environments": "فعّل التباين العالي في البيئات المشرقة",
      "Increase font size for comfortable reading": "زد حجم الخط للقراءة المريحة",
      "Reduce motion if you experience dizziness": "قلل الحركة إذا كنت تشعر بالدوار",
      "Reset": "إعادة تعيين",
      "Theme Mode": "وضع الثيم",
      
      // AI Assistant - مساعد الذكي الاصطناعي
      "AI Executive Assistant": "المساعد التنفيذي الذكي",
      "Powered by advanced analytics": "مدعوم بالتحليلات المتقدمة",
      "Hello! I'm your AI Executive Assistant. I can help you with insights, summaries, and analysis of your business data. Try asking me about revenue trends, project status, or any executive decisions you need support with.": "مرحباً! أنا مساعدك التنفيذي الذكي. يمكنني مساعدتك في الحصول على رؤى وملخصات وتحليلات لبيانات عملك. جرب أن تسألني عن اتجاهات الإيرادات أو حالة المشاريع أو أي قرارات تنفيذية تحتاج دعماً فيها.",
      "Give me a 3-line summary of revenue trend last quarter and two recommended actions": "أعطني ملخصاً من 3 أسطر عن اتجاه الإيرادات في الربع الماضي وإجراءين موصيين",
      "Which project milestones slipped in the last 30 days and why?": "ما هي معالم المشاريع التي تأخرت في الـ 30 يوماً الماضية ولماذا؟",
      "Show anomalies in team productivity for June 2025": "أظهر الشذوذات في إنتاجية الفريق لشهر يونيو 2025",
      "What are the top 3 risks in our current portfolio?": "ما هي أهم 3 مخاطر في محفظتنا الحالية؟",
      "Summarize board meeting preparation items": "لخص بنود التحضير لاجتماع مجلس الإدارة",
      "Clear conversation": "مسح المحادثة",
      "AI Insights": "رؤى الذكاء الاصطناعي",
      "confidence": "الثقة",
      "Try asking:": "جرب أن تسأل:",
      "AI is analyzing your request...": "الذكاء الاصطناعي يحلل طلبك...",
      "Ask me about revenue, projects, KPIs, or any executive insights...": "اسألني عن الإيرادات أو المشاريع أو مؤشرات الأداء الرئيسية أو أي رؤى تنفيذية...",
      "Send message (Enter)": "إرسال رسالة (Enter)",
      "AI Assistant is in demo mode": "المساعد الذكي في وضع التجريب",
      "Responses are simulated. In production, this will connect to real business intelligence systems.": "الردود محاكاة. في الإنتاج، سيتصل هذا بأنظمة الذكاء التجاري الحقيقية.",
      "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.": "أعتذر، لكنني أواجه بعض الصعوبات التقنية. يرجى المحاولة مرة أخرى بعد قليل.",
      
      // AI Response Content - محتوى ردود الذكاء الاصطناعي
      "Revenue Analysis Summary:": "ملخص تحليل الإيرادات:",
      "Key drivers:": "المحركات الرئيسية:",
      "Recommended Actions:": "الإجراءات الموصى بها:",
      "Accelerate JTC fleet expansion to capture growing demand": "تسريع توسع أسطول JTC للاستفادة من الطلب المتزايد",
      "Diversify energy portfolio to reduce seasonal volatility": "تنويع محفظة الطاقة لتقليل التقلبات الموسمية",
      "Project Status Analysis:": "تحليل حالة المشاريع:",
      "Primary cause:": "السبب الأساسي:",
      "Resource allocation conflicts": "تضارب في تخصيص الموارد",
      "Delayed Projects:": "المشاريع المتأخرة:",
      "Productivity Analysis": "تحليل الإنتاجية",
      "Overall productivity:": "الإنتاجية الإجمالية:",
      "Anomaly detected:": "تم اكتشاف شذوذ:",
      "Root cause:": "السبب الجذري:",
      "Positive trends:": "الاتجاهات الإيجابية:",
      "Positive Revenue Trend": "اتجاه إيرادات إيجابي",
      "Consistent 15-25% quarterly growth": "نمو ربع سنوي ثابت 15-25%",
      "Expand JTC Operations": "توسيع عمليات JTC",
      "High ROI opportunity in logistics sector": "فرصة عائد استثمار عالي في قطاع اللوجستيات",
      "Resource Allocation Issue": "مشكلة تخصيص الموارد",
      "Multiple projects competing for same resources": "مشاريع متعددة تتنافس على نفس الموارد",
      "Energy Sector Dip": "انخفاض قطاع الطاقة",
      "Temporary efficiency drop due to maintenance": "انخفاض مؤقت في الكفاءة بسبب الصيانة",
      "JTC Excellence": "تميز JTC",
      "Consistent operational improvements": "تحسينات تشغيلية ثابتة",
      
      // Navigation Accessibility - إمكانية الوصول للتنقل
      "Skip to main content": "تخطى إلى المحتوى الرئيسي",
      "Skip to navigation": "تخطى إلى التنقل",
      "Main Navigation": "التنقل الرئيسي",
      
      // Additional Arabic translations for full Arabic experience
      "Overview": "نظرة عامة",
      "Analytics": "التحليلات",
      "Management": "الإدارة",
      "Settings": "الإعدادات",
      "Profile": "الملف الشخصي",
      
      "Login": "تسجيل الدخول",
      "Welcome": "أهلاً وسهلاً",
      "Home": "الرئيسية",
      "About": "حول",
      "Contact": "اتصل بنا",
      "Help": "المساعدة",
      "Support": "الدعم",
      "Documentation": "الوثائق",
      "User Guide": "دليل المستخدم",
      "FAQ": "الأسئلة الشائعة",
      "Terms": "الشروط",
      "Privacy": "الخصوصية",
      "Legal": "القانونية",
      
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
      "Logout": "تسجيل الخروج",
      
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
      "Welcome back!": "أهلاً بك مرة أخرى!",
      "Please sign in to your executive account": "يرجى تسجيل الدخول إلى حسابك التنفيذي",
      "Enter your email": "أدخل بريدك الإلكتروني",
      "Enter your password": "أدخل كلمة المرور",
      "or": "أو",
      "Protected by SSL encryption and enterprise security": "محمي بواسطة تشفير SSL وأمان المؤسسات",
      "Secure Connection": "اتصال آمن",
      "Designed exclusively for C-Level executives and board members": "صُمم خصيصاً للقادة التنفيذيين ومجالس الإدارة",
      "Al Jeri Executive Board Platform": "منصة مجلس الإدارة التنفيذية لشركة الجري",
      "Executive Command & Board Center": "مركز القيادة التنفيذية ومجلس الإدارة",
      "Management Platform": "منصة الإدارة",
      "AL JERI": "شركة الجِري",
      "Executive Board Platform": "منصَّة مجلس الإدارة التنفيذية",
      
      
       
      
      // Dashboard - لوحة المعلومات
      "Welcome back": "أهلاً بك مرة أخرى",
      "Executive Command Center": "مركز القيادة التنفيذية",
      "Strategic overview and real-time performance insights": "نظرة عامة استراتيجية ورؤى الأداء في الوقت الفعلي",
      "Strategic Decision Making • Executive Intelligence • Board Governance": "اتخاذ القرارات الاستراتيجية • الذكاء التنفيذي • حوكمة مجلس الإدارة",
      "Total Revenue": "إجمالي الإيرادات",
      "Annual Revenue": "الإيرادات السنوية",
      "Active Projects": "المشاريع النشطة",
      "Team Members": "أعضاء المجلس", 
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
      
      // KPIs & Reports
      "All Reports": "جميع التقارير",
      "Operations": "العمليات",
      "Financial": "المالية", 
      "HR & Workforce": "الموارد البشرية والقوى العاملة",
      "Open in new tab": "فتح في تبويب جديد",
      "Loading Power BI Report...": "جاري تحميل تقرير Power BI...",
      "Refreshing report...": "جاري تحديث التقرير...",
      "Export to PDF": "تصدير إلى PDF",
      "Report refreshed successfully": "تم تحديث التقرير بنجاح",
      "Failed to refresh report": "فشل في تحديث التقرير",
      "Export started successfully": "بدأ التصدير بنجاح",
      "Failed to export report": "فشل في تصدير التقرير",
      
      // Navigation & Misc Additions
      "Executive Board": "مجلس الإدارة التنفيذي",
      "Search...": "بحث...",
      "Search by name or description...": "ابحث بالاسم أو الوصف...",
      "Executive": "المدير التنفيذي",
      
      // Dashboard Quick Actions & Labels
      "New Initiative": "مبادرة جديدة",
      "Team Review": "مراجعة الفريق",
      "Schedule Meeting": "جدولة اجتماع",
      "Send Update": "إرسال تحديث",
      "View Projects": "عرض المشاريع",
      "View Metrics": "عرض المقاييس",
      "Growth": "النمو",
      "Today": "اليوم",
      "Tomorrow": "غدًا",
      "Board Meeting Q4 Review": "اجتماع مجلس الإدارة - مراجعة الربع الرابع",
      "Digital Strategy Presentation": "عرض الاستراتيجية الرقمية",
      "Investor Relations Call": "مكالمة علاقات المستثمرين",
      
      // Secretary Workspace
      "Executive-Secretary Workspace": "مساحة عمل السكرتير التنفيذي",
      "Executive-Secretary Dashboard": "لوحة تحكم السكرتير التنفيذي",
      "Create Meeting Agenda": "إنشاء جدول أعمال الاجتماع",
      "Task Board": "لوحة المهام",
      "Board Resolutions": "قرارات مجلس الإدارة",
      "Recent Activity": "النشاط الحديث",
      "Quick Actions": "إجراءات سريعة",
      "Meeting Title": "عنوان الاجتماع",
      "Company": "الشركة",
      "Date": "التاريخ",
      "Time": "الوقت",
      "Location": "الموقع",
      "Description": "الوصف",
      "Attendees": "الحضور",
      "Agenda Items": "بنود جدول الأعمال",
      "Presentation Materials": "مواد العرض",
      "Add Attendee": "إضافة حاضر",
      "Add Item": "إضافة بند",
      "Create Meeting": "إنشاء اجتماع",
      "Edit Meeting": "تعديل الاجتماع",
      "Update Meeting": "تحديث الاجتماع",
      "Live Meeting Chat": "محادثة الاجتماع المباشرة",
      "Participants": "المشاركون",
      "Meeting Directives": "توجيهات الاجتماع",
      "Mark Resolved": "وضع علامة كمحلول",
      "Attendance Summary": "ملخص الحضور",
      "Attending": "حاضر",
      "Declined": "رفض",
      "Pending": "في الانتظار",
      "Your Response": "ردك",
      "Will you be attending this meeting?": "هل ستحضر هذا الاجتماع؟",
      "Attend": "حضور",
      "Decline": "رفض",
      "Voting Results": "نتائج التصويت",
      "Quarter Status": "حالة الربع",
      "Period": "الفترة",
      "Status": "الحالة",
      "Active": "نشط",
      "Closed": "مغلق",
      "Revenue": "الإيرادات",
      "Customer Satisfaction": "رضا العملاء",
      "Pending Directives": "التوجيهات المعلقة",
      "Tasks Completed": "المهام المكتملة",
      "Team Performance": "أداء الفريق",
      "Projects On Time": "المشاريع في الوقت المحدد",
      "Performance Overview": "نظرة عامة على الأداء",
      "Performance Target": "هدف الأداء",
      "All Clear": "كل شيء واضح",
      "Action Required": "مطلوب إجراء",
      
      // Secretary Workspace Additional Translations
      "attendance.notAttending": "غير حاضر",
      "attendance.pendingResponse": "في انتظار الرد",
      "attendance.approved": "موافق",
      "attendance.declined": "مرفوض",
      "attendance.joinedAt": "انضم في",
      "attendance.unknown": "غير معروف",
      "quarter.status": "حالة الربع",
      "quarter.activeMessage": "هذا الربع نشط حالياً. يتم تحديث مؤشرات الأداء في الوقت الفعلي.",
      "task.directives": "توجيه(ات)",
      
      // Task Board Component
      "task.priority.high": "عالية",
      "task.priority.medium": "متوسطة", 
      "task.priority.low": "منخفضة",
      "task.status.completed": "مكتملة",
      "task.status.inProgress": "قيد التنفيذ",
      "task.status.pending": "في الانتظار",
      "task.directivesCount": "{{count}} توجيه(ات)",
      
      // Live Chat Component
      "chat.title": "محادثة مباشرة",
      "chat.placeholder": "اكتب رسالتك...",
      "chat.send": "إرسال",
      "chat.directive": "توجيه",
      "chat.system": "نظام",
      "chat.message": "رسالة",
      "chat.markResolved": "وضع علامة كمحلول",
      "chat.resolved": "تم الحل",
      "chat.unresolved": "غير محلول",
      "chat.newDirective": "توجيه جديد",
      "chat.directiveResolved": "تم حل التوجيه",
      "chat.directiveUnresolved": "تم إلغاء حل التوجيه",
      
      // Timeline Component
      "timeline.addComment": "إضافة تعليق تنفيذي",
      "timeline.addExecutiveComment": "إضافة تعليق تنفيذي",
      "timeline.executiveCommentary": "التعليقات التنفيذية",
      "timeline.addCommentPlaceholder": "أضف تعليقك التنفيذي أو الرؤية الاستراتيجية...",
      "timeline.attachments": "المرفقات",
      "timeline.uploadFiles": "رفع الملفات",
      "timeline.supportedFormats": "الملفات المدعومة: PDF، صور، Word",
      "timeline.commentAdded": "تم إضافة التعليق بنجاح",
      "timeline.commentError": "فشل في إضافة التعليق",
      
      // Kanban Component
      "kanban.addStrategicInitiative": "إضافة مبادرة استراتيجية",
      "kanban.executiveCommentary": "التعليقات التنفيذية",
      "kanban.addExecutiveComment": "إضافة تعليق تنفيذي",
      "kanban.commentPlaceholder": "أضف تعليقك التنفيذي أو التوجيه الاستراتيجي...",
      "kanban.attachments": "المرفقات",
      "kanban.uploadFiles": "رفع الملفات",
      "kanban.supportedFormats": "الملفات المدعومة: PDF، صور، Word",
      "kanban.commentAdded": "تم إضافة التعليق بنجاح",
      "kanban.commentError": "فشل في إضافة التعليق",
      
      // 45degrees Cafe Page
      "cafe.title": "مقهى 45 درجة والخدمة من السيارة",
      "cafe.subtitle": "معايير دقيقة، لجودة في الوقت المناسب",
      "cafe.currentOutlets": "الفروع الحالية",
      "cafe.target2025": "الهدف 2025",
      "cafe.qualityRating": "تقييم الجودة",
      "cafe.dailyCustomers": "العملاء اليوميون",
      "cafe.businessOverview": "نظرة عامة على الأعمال",
      "cafe.economicDescription": "جزء منتج دائم من الاقتصاد",
      "cafe.visionDescription": "تسعى لأن تصبح الخيار البديهي للقهوة في المنطقة، يعتمد مقهى 45 درجة على الباريستا المدربين جيداً وعملية الاختيار الانتقائية للبن القهوة.",
      "cafe.qualityDescription": "البذور عالية الجودة تستحق معاملة عالية الجودة، وتقنية التحميص لدينا تنصف بذور أمريكا الجنوبية وأفريقيا في الحفاظ على طابعها ورائحتها، مما يوفر تجربة لذيذة في كل مرة، مضمونة.",
      "cafe.expansionDescription": "بناءً على مقهانا الرئيسي و6 خدمات من السيارة في الرياض، مقهى 45 درجة مستعد لتشغيل أكثر من 100 مقهى خدمة من السيارة في المملكة العربية السعودية بحلول عام 2025.",
      "cafe.coreAdvantages": "المزايا الأساسية",
      "cafe.premiumBeanSourcing": "مصادر البذور المتميزة",
      "cafe.advancedRoasting": "تقنية التحميص المتقدمة",
      "cafe.trainedBaristas": "الباريستا المدربون",
      "cafe.driveThruConvenience": "راحة الخدمة من السيارة",
      "cafe.qualityConsistency": "اتساق الجودة",
      "cafe.customerExperience": "تجربة العملاء",
      "cafe.coffeeSourcing": "مصادر القهوة",
      "cafe.southAmerica": "أمريكا الجنوبية",
      "cafe.africa": "أفريقيا",
      "cafe.premiumArabica": "أرابيكا متميز",
      "cafe.specialtyBlends": "خلطات متخصصة",
      "cafe.roastingExcellence": "التميز في التحميص",
      "cafe.preservingCharacter": "الحفاظ على الطابع والرائحة",
      "cafe.expansionTimeline": "جدول التوسع",
      "cafe.completed": "مكتمل",
      "cafe.expansionTarget": "هدف التوسع",
      "cafe.outlets": "الفروع",
      "cafe.achieved": "محقق",
      "cafe.expansionInProgress": "التوسع قيد التنفيذ",
      "cafe.expansionPlanned": "التوسع مخطط",
      "cafe.strategicFocus": "التركيز الاستراتيجي",
      "cafe.qualityFirst": "الجودة أولاً",
      "cafe.maintainStandards": "الحفاظ على معايير القهوة المتميزة",
      "cafe.driveThruFocus": "التركيز على الخدمة من السيارة",
      "cafe.convenienceFocus": "الراحة للعملاء المشغولين",
      "cafe.rapidExpansion": "التوسع السريع",
      "cafe.locations2025": "100+ موقع بحلول 2025",
      "cafe.marketResilience": "مرونة السوق والاستراتيجية",
      "cafe.economicResilience": "المرونة الاقتصادية",
      "cafe.covidDescription": "قطاع الطعام والمشروبات شديد القوة. حتى خلال كوفيد-19، ظل الطعام أولوية قصوى كخدمة أساسية.",
      "cafe.convenienceStrategy": "التركيز على الراحة",
      "cafe.alJeriFocus": "تركز الجري على الراحة للمستهلك، مع مقاهي الجلوس الفاخرة وكذلك مقاهي الخدمة من السيارة.",
      "cafe.regionalLeadership": "القيادة الإقليمية",
      "cafe.leadershipDescription": "تسعى لأن تصبح الخيار البديهي للقهوة في المنطقة من خلال الجودة المتسقة والتميز في الخدمة",
      
      // Notification System
      "notification.title": "مركز الإشعارات",
      "notification.markAllRead": "تحديد الكل كمقروء",
      "notification.noNotifications": "لا توجد إشعارات جديدة",
      "notification.new": "جديد",
      "notification.urgent": "عاجل",
      "notification.info": "معلومات",
      "notification.success": "نجح",
      "notification.warning": "تحذير",
      "notification.error": "خطأ",
      "notification.clearAll": "مسح الكل",
      "notification.loading": "جاري تحميل الإشعارات...",
      
      // Error Messages
      "error.general": "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
      "error.network": "خطأ في الشبكة. يرجى التحقق من اتصالك.",
      "error.unauthorized": "غير مصرح لك بالوصول إلى هذا المورد.",
      "error.forbidden": "ممنوع الوصول إلى هذا المورد.",
      "error.notFound": "المورد المطلوب غير موجود.",
      "error.server": "خطأ في الخادم. يرجى المحاولة لاحقاً.",
      "error.timeout": "انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.",
      
      // Success Messages
      "success.saved": "تم الحفظ بنجاح",
      "success.updated": "تم التحديث بنجاح",
      "success.deleted": "تم الحذف بنجاح",
      "success.created": "تم الإنشاء بنجاح",
      "success.uploaded": "تم الرفع بنجاح",
      "success.downloaded": "تم التحميل بنجاح",
      
      // Loading States
      "loading.general": "جاري التحميل...",
      "loading.saving": "جاري الحفظ...",
      "loading.uploading": "جاري الرفع...",
      "loading.downloading": "جاري التحميل...",
      "loading.processing": "جاري المعالجة...",
      "loading.connecting": "جاري الاتصال...",
      
      // Dashboard
      "dashboard.boardMembers": "أعضاء المجلس",
      
      // Buttons
      "buttons.attend": "حضور",
      "buttons.decline": "اعتذار",
      "buttons.viewRegister": "تأكيد الحضور",
      
      // Common Phrases in Dashboard
      
      
      "ECC - Coming Soon": "نظام ECC - قريبًا",
      "ECP - Coming Soon": "نظام ECP - قريبًا",
      "Agenda": "جدول الأعمال",
      "moreItems": "+{{count}} عناصر إضافية",
      "Meeting": "اجتماع",
      
      "Quick Overview": "نظرة سريعة",
      "Q1 2025: Strategic Review & Planning": "الربع 1 2025: المراجعة والتخطيط الاستراتيجي",
      "Q2 2025: Digital Transformation Phase 2": "الربع 2 2025: المرحلة الثانية من التحول الرقمي",
      "Q3 2025: Market Expansion Initiative": "الربع 3 2025: مبادرة التوسع في السوق",
      "Q4 2025: Innovation Lab Launch": "الربع 4 2025: إطلاق مختبر الابتكار",
      "📊 Key 2024 Achievements": "📊 أبرز إنجازات 2024",
      "📈 Year Summary": "📈 ملخص العام",
      "Outstanding Year!": "عام مميز!",
       
       // Executive Dashboard additions
       "Executive Dashboard": "لوحة القيادة التنفيذية",
       "Strategic overview and key performance indicators": "نظرة عامة استراتيجية ومؤشرات الأداء الرئيسية",
       "Strategic Project Distribution": "توزيع المشاريع الاستراتيجية",
       "Quarterly Performance Metrics": "مقاييس الأداء ربع السنوية",
       "Operational Efficiency (%)": "الكفاءة التشغيلية (%)",
       "Customer Satisfaction (%)": "رضا العملاء (%)",
       "Market Growth (%)": "نمو السوق (%)",
       "Actual Revenue": "الإيرادات الفعلية",
       
       "Strategic Insights": "رؤى استراتيجية",
       "Revenue Growth Acceleration": "تسارع نمو الإيرادات",
       "Q2 revenue exceeded targets by 14.3%, driven by digital transformation initiatives.": "تجاوزت إيرادات الربع الثاني الأهداف بنسبة 14.3% مدفوعة بمبادرات التحول الرقمي.",
       "Market Expansion Success": "نجاح التوسع في السوق",
       "New market penetration increased by 22%, with strong performance in APAC region.": "زادت نسبة اختراق الأسواق الجديدة بنسبة 22% مع أداء قوي في منطقة آسيا والمحيط الهادئ.",
       "Operational Excellence": "التميز التشغيلي",
       "Efficiency improvements of 9.2% achieved through AI-driven process optimization.": "تحسينات في الكفاءة بنسبة 9.2% تم تحقيقها من خلال تحسين العمليات المدعوم بالذكاء الاصطناعي.",
       "Strategic Priorities": "الأولويات الاستراتيجية",
       "Digital Innovation Pipeline": "مسار الابتكار الرقمي",
       "Launch 3 AI-powered products by Q4 to maintain competitive edge.": "إطلاق 3 منتجات مدعومة بالذكاء الاصطناعي بحلول الربع الرابع للحفاظ على الميزة التنافسية.",
       "Sustainability Goals": "أهداف الاستدامة",
       "Achieve carbon neutrality by 2025 through green technology investments.": "تحقيق الحياد الكربوني بحلول 2025 من خلال الاستثمارات في التقنيات الخضراء.",
       "Talent Acquisition": "اكتساب المواهب",
       "Scale engineering team by 35% to support global expansion plans.": "توسيع فريق الهندسة بنسبة 35% لدعم خطط التوسع العالمية.",
       
       // Months short
       "Jan": "يناير",
       "Feb": "فبراير",
       "Mar": "مارس",
       "Apr": "أبريل",
       "May": "مايو",
       "Jun": "يونيو",
       
       // Quarter
       "Q4": "الربع الرابع",
      
      // Relative time
      "Just now": "الآن",
      "time.minute": "قبل {{count}} دقيقة",
      "time.hour": "قبل {{count}} ساعة",
      "time.day": "قبل {{count}} يوم",
      
      // My Meetings extra
      "myMeetings.upcomingCount": "{{count}} اجتماع قادم",
      
      // My Meetings
      "myMeetings.title": "اجتماعاتي",
      "myMeetings.noMeetings": "لا توجد اجتماعات قادمة",
      "myMeetings.declineReason": "سبب الاعتذار",
      "myMeetings.reasonPlaceholder": "يرجى ذكر سبب عدم الحضور",
      "myMeetings.confirmAttendance": "تأكيد الحضور",
      "myMeetings.declineAttendance": "اعتذار عن الحضور",
      "myMeetings.attendanceConfirmed": "تم تأكيد حضورك!",
      "myMeetings.declineSubmitted": "تم تسجيل اعتذارك",
      "myMeetings.reasonRequired": "يجب ذكر سبب الاعتذار",
      "myMeetings.membersConfirmed": "الأعضاء الذين أكدوا الحضور",
      
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
      
      
      // Board Management  
      "Executive initiatives": "المبادرات التنفيذية",
      "Strategic tracking": "التتبع الاستراتيجي",
      "Add Task": "إضافة مهمة",
      "Edit Task": "تعديل المهمة",
      "Delete": "حذف",
      "Priority": "الأولوية",
      "Assignee": "المكلف",
      "Due Date": "تاريخ الاستحقاق",
      
      // 45degrees Cafe Page
      "Exacting Standards, for Quality in a Timely Fashion": "معايير دقيقة، لجودة في الوقت المناسب",
      "Current Outlets": "الفروع الحالية",
      "2025 Target": "هدف 2025",
      "Quality Rating": "تقييم الجودة",
      "Daily Customers": "العملاء اليوميون",
      "Business Overview": "نظرة عامة على الأعمال",
      "A perennially productive part of the economy": "جزء منتج دائم من الاقتصاد",
      "Aiming to become the instinctive choice for coffee in the region, 45degrees Cafe leans on our well trained baristas and highly selective sourcing process for coffee beans.": "تسعى لأن تصبح الخيار البديهي للقهوة في المنطقة، يعتمد مقهى 45 درجة على الباريستا المدربين جيداً وعملية اختيار حبوب البن الانتقائية للغاية.",
      "Quality beans deserve quality treatment, and our roasting technology does justice to our South American and African beans in preserving their character and aroma, delivering a flavourful experience every time, guaranteed.": "حبوب البن عالية الجودة تستحق معاملة عالية الجودة، وتقنية التحميص لدينا تنصف حبوب أمريكا الجنوبية وأفريقيا في الحفاظ على طابعها ورائحتها، مما يضمن تجربة غنية بالنكهة في كل مرة.",
      "Building on our flagship cafe and 6 drive-thrus in Riyadh, 45degrees is poised to operate over 100 drive-thru cafes in Saudi Arabia by 2025.": "بناءً على مقهىنا الرئيسي و6 فروع خدمة من السيارة في الرياض، 45 درجة مستعد لتشغيل أكثر من 100 مقهى خدمة من السيارة في المملكة العربية السعودية بحلول عام 2025.",
      "Core Advantages": "المزايا الأساسية",
      "Premium Bean Sourcing": "مصدر حبوب البن الممتازة",
      "Advanced Roasting Technology": "تقنية التحميص المتقدمة",
      "Trained Baristas": "الباريستا المدربون",
      "Drive-thru Convenience": "راحة الخدمة من السيارة",
      "Quality Consistency": "اتساق الجودة",
      "Customer Experience": "تجربة العملاء",
      "Coffee Sourcing": "مصدر القهوة",
      "South America": "أمريكا الجنوبية",
      "Africa": "أفريقيا",
      "Premium Arabica": "أرابيكا ممتازة",
      "Specialty Blends": "خلطات خاصة",
      "Roasting Excellence": "التميز في التحميص",
      "Preserving character & aroma": "الحفاظ على الطابع والرائحة",
      "Expansion Timeline": "الجدول الزمني للتوسع",
      "Completed": "مكتمل",
      "Expansion Target": "هدف التوسع",
      "Outlets": "الفروع",
      "Achieved": "محقق",
      "Expansion In Progress": "التوسع قيد التنفيذ",
      "Expansion Planned": "التوسع مخطط",
      "Strategic Focus": "التركيز الاستراتيجي",
      "Quality First": "الجودة أولاً",
      "Maintain premium coffee standards": "الحفاظ على معايير القهوة الممتازة",
      "Drive-thru Focus": "التركيز على الخدمة من السيارة",
      "Convenience for busy customers": "الراحة للعملاء المشغولين",
      "Rapid Expansion": "التوسع السريع",
      "100+ locations by 2025": "أكثر من 100 موقع بحلول 2025",
      "Market Resilience & Strategy": "مرونة السوق والاستراتيجية",
      "Economic Resilience": "المرونة الاقتصادية",
      "The food and beverage sector is highly robust. Even during COVID-19, food remained a top priority as an essential service.": "قطاع الطعام والمشروبات قوي للغاية. حتى خلال كوفيد-19، ظل الطعام أولوية قصوى كخدمة أساسية.",
      "Convenience Focus": "التركيز على الراحة",
      "Al Jeri focuses on convenience for the consumer, with upscale sit-down as well as Drive-thru cafes.": "تركز الجري على راحة المستهلك، مع مقاهي راقية للجلوس وكذلك الخدمة من السيارة.",
      "Regional Leadership": "القيادة الإقليمية",
      "Aiming to become the instinctive choice for coffee in the region through consistent quality and service excellence.": "تسعى لأن تصبح الخيار البديهي للقهوة في المنطقة من خلال الجودة المتسقة والتميز في الخدمة.",
      
      // JTC Transport & Logistics Page
      "Advanced Transportation Solutions, Delivering Tomorrow's Infrastructure": "حلول النقل المتقدمة، تقديم البنية التحتية للغد",
      "Fleet Size": "حجم الأسطول",
      "Trailers": "المقطورات",
      
      "Client Satisfaction": "رضا العملاء",
      "A client in motion stays in motion": "العميل في الحركة يبقى في الحركة",
      "Since our inception, our core business area has been industrial and commercial transportation. A sector poised for further growth with the expansion of the Saudi economy, and related development projects.": "منذ تأسيسنا، كان مجال عملنا الأساسي هو النقل الصناعي والتجاري. قطاع مستعد لمزيد من النمو مع توسع الاقتصاد السعودي والمشاريع التنموية ذات الصلة.",
      "We own and operate a service fleet of over 1250 trucks and 3000 trailers. The company transports asphalt, industrial and consumer grade fuels, cement, and general goods to our clients.": "نمتلك ونشغل أسطول خدمة من أكثر من 1250 شاحنة و3000 مقطورة. تنقل الشركة الإسفلت والوقود الصناعي ووقود المستهلكين والإسمنت والبضائع العامة لعملائنا.",
      "Services Include": "تشمل الخدمات",
      "Asphalt Transportation": "نقل الإسفلت",
      "Consumer Grade Fuels": "وقود المستهلكين",
      "Industrial Fuels (A1 Jet Fuel)": "الوقود الصناعي (وقود الطائرات A1)",
      
      "Cement Transportation": "نقل الإسمنت",
      "General Goods & Perishables": "البضائع العامة والقابلة للتلف",
      "Key Clients": "العملاء الرئيسيون",
      "Technology & Digital Transformation Action Plan": "خطة عمل التكنولوجيا والتحول الرقمي",
      "Implementation Timeline": "الجدول الزمني للتنفيذ",
      "Q3 2025: TMS Implementation": "الربع 3 2025: تنفيذ نظام إدارة النقل",
      "Finalize supplier selection and begin implementation": "إنهاء اختيار المورد وبدء التنفيذ",
      "Q4 2025: Process Automation": "الربع 4 2025: أتمتة العمليات",
      "Deploy workflow automation tools": "نشر أدوات أتمتة سير العمل",
      "Q1 2026: Digital Transformation": "الربع 1 2026: التحول الرقمي",
      "Full digital assessment and implementation": "التقييم الرقمي الكامل والتنفيذ",
      "Action No.": "رقم الإجراء",
      
      "CEO/JTC Management Remarks": "ملاحظات الإدارة التنفيذية/إدارة JTC",
      "Period / Date": "الفترة / التاريخ",
      "Responsibility": "المسؤولية",
      

      // Additional missing translations (removed duplicates)
      
      // Company Page Specific Translations
      "Operating": "تعمل",
      
      "Flagship Cafe": "المقهى الرئيسي",
      "Drive-thru Outlets": "فروع الخدمة من السيارة",
      "Planned Drive-thrus": "فروع الخدمة من السيارة المخططة",
      "Riyadh Central": "وسط الرياض",
      "Riyadh": "الرياض",
      "Saudi Arabia": "المملكة العربية السعودية",
      "Total": "إجمالي",
      
      "completed": "مكتمل",
      "in-progress": "قيد التنفيذ",
      "planned": "مخطط",
      "Trucks": "الشاحنات",
      "Fleet": "الأسطول",
      "Transportation": "النقل",
      "Logistics": "اللوجستيات",
      "Infrastructure": "البنية التحتية",
      "Industrial": "صناعي",
      "Commercial": "تجاري",
      "Asphalt": "الإسفلت",
      "Cement": "الإسمنت",
      "Fuels": "الوقود",
      "Jet Fuel": "وقود الطائرات",
      "Heavy Fuel Oil": "زيت الوقود الثقيل",
      "General Goods": "البضائع العامة",
      "Perishables": "القابلة للتلف",
      "CIO": "مدير تكنولوجيا المعلومات التنفيذي",
      
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
      "My Meetings": "My Meetings",
      
      // Theme & Accessibility
      "Theme & Accessibility Settings": "Theme & Accessibility Settings",
      "Light Theme": "Light Theme",
      "Dark Theme": "Dark Theme",
      "Eye Comfort": "Eye Comfort",
      "Clean and bright interface": "Clean and bright interface",
      "Easy on the eyes in low light": "Easy on the eyes in low light",
      "Optimized for extended use": "Optimized for extended use",
      "Small (14px)": "Small (14px)",
      "Medium (16px)": "Medium (16px)",
      "Large (18px)": "Large (18px)",
      "Extra Large (20px)": "Extra Large (20px)",
      "Font Size": "Font Size",
      "Motion & Animations": "Motion & Animations",
      "Full Animations": "Full Animations",
      "Reduced Motion": "Reduced Motion",
      "No Animations": "No Animations",
      "High Contrast": "High Contrast",
      "Focus Ring Visible": "Focus Ring Visible",
      "Reduced Transparency": "Reduced Transparency",
      "Color Blindness Support": "Color Blindness Support",
      "Improves text visibility": "Improves text visibility",
      "Shows focus outline for keyboard navigation": "Shows focus outline for keyboard navigation",
      "Removes transparent effects": "Removes transparent effects",
      "Adjusts colors for better distinction": "Adjusts colors for better distinction",
      "Reduce motion to prevent vestibular disorders": "Reduce motion to prevent vestibular disorders",
      "Larger text improves readability and accessibility": "Larger text improves readability and accessibility",
      "WCAG AA Compliant": "WCAG AA Compliant",
      "Accessibility Can Be Improved": "Accessibility Can Be Improved",
      "Your current settings meet accessibility guidelines": "Your current settings meet accessibility guidelines",
      "Consider enabling high contrast or increasing font size": "Consider enabling high contrast or increasing font size",
      "Accessibility Options": "Accessibility Options",
      "Accessibility Tips": "Accessibility Tips",
      "Use keyboard Tab and Enter to navigate": "Use keyboard Tab and Enter to navigate",
      "Enable high contrast in bright environments": "Enable high contrast in bright environments",
      "Increase font size for comfortable reading": "Increase font size for comfortable reading",
      "Reduce motion if you experience dizziness": "Reduce motion if you experience dizziness",
      "Reset": "Reset",
      "Theme Mode": "Theme Mode",
      
      // AI Assistant
      "AI Executive Assistant": "AI Executive Assistant",
      "Powered by advanced analytics": "Powered by advanced analytics",
      "Hello! I'm your AI Executive Assistant. I can help you with insights, summaries, and analysis of your business data. Try asking me about revenue trends, project status, or any executive decisions you need support with.": "Hello! I'm your AI Executive Assistant. I can help you with insights, summaries, and analysis of your business data. Try asking me about revenue trends, project status, or any executive decisions you need support with.",
      "Give me a 3-line summary of revenue trend last quarter and two recommended actions": "Give me a 3-line summary of revenue trend last quarter and two recommended actions",
      "Which project milestones slipped in the last 30 days and why?": "Which project milestones slipped in the last 30 days and why?",
      "Show anomalies in team productivity for June 2025": "Show anomalies in team productivity for June 2025",
      "What are the top 3 risks in our current portfolio?": "What are the top 3 risks in our current portfolio?",
      "Summarize board meeting preparation items": "Summarize board meeting preparation items",
      "Clear conversation": "Clear conversation",
      "AI Insights": "AI Insights",
      "confidence": "confidence",
      "Try asking:": "Try asking:",
      "AI is analyzing your request...": "AI is analyzing your request...",
      "Ask me about revenue, projects, KPIs, or any executive insights...": "Ask me about revenue, projects, KPIs, or any executive insights...",
      "Send message (Enter)": "Send message (Enter)",
      "AI Assistant is in demo mode": "AI Assistant is in demo mode",
      "Responses are simulated. In production, this will connect to real business intelligence systems.": "Responses are simulated. In production, this will connect to real business intelligence systems.",
      "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.": "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
      
      // AI Response Content
      "Revenue Analysis Summary:": "Revenue Analysis Summary:",
      "Key drivers:": "Key drivers:",
      "Recommended Actions:": "Recommended Actions:",
      "Accelerate JTC fleet expansion to capture growing demand": "Accelerate JTC fleet expansion to capture growing demand",
      "Diversify energy portfolio to reduce seasonal volatility": "Diversify energy portfolio to reduce seasonal volatility",
      "Project Status Analysis:": "Project Status Analysis:",
      "Primary cause:": "Primary cause:",
      "Resource allocation conflicts": "Resource allocation conflicts",
      "Delayed Projects:": "Delayed Projects:",
      "Productivity Analysis": "Productivity Analysis",
      "Overall productivity:": "Overall productivity:",
      "Anomaly detected:": "Anomaly detected:",
      "Root cause:": "Root cause:",
      "Positive trends:": "Positive trends:",
      "Positive Revenue Trend": "Positive Revenue Trend",
      "Consistent 15-25% quarterly growth": "Consistent 15-25% quarterly growth",
      "Expand JTC Operations": "Expand JTC Operations",
      "High ROI opportunity in logistics sector": "High ROI opportunity in logistics sector",
      "Resource Allocation Issue": "Resource Allocation Issue",
      "Multiple projects competing for same resources": "Multiple projects competing for same resources",
      "Energy Sector Dip": "Energy Sector Dip",
      "Temporary efficiency drop due to maintenance": "Temporary efficiency drop due to maintenance",
      "JTC Excellence": "JTC Excellence",
      "Consistent operational improvements": "Consistent operational improvements",
      
      // Navigation Accessibility
      "Skip to main content": "Skip to main content",
      "Skip to navigation": "Skip to navigation",
      "Main Navigation": "Main Navigation",
      
      // Navigation & Menu Items - English
      "Strategic Planning": "Strategic Planning",
      "Board Mark": "Board Mark",
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
      "Welcome back!": "Welcome back!",
      "Please sign in to your executive account": "Please sign in to your executive account",
      "Enter your email": "Enter your email",
      "Enter your password": "Enter your password",
      "or": "or",
      "Protected by SSL encryption and enterprise security": "Protected by SSL encryption and enterprise security",
      "Secure Connection": "Secure Connection",
      "Designed exclusively for C-Level executives and board members": "Designed exclusively for C-Level executives and board members",
      "Al Jeri Executive Board Platform": "Al Jeri Executive Board Platform",
      "Executive Command & Board Center": "Executive Command & Board Center",
      "Management Platform": "Management Platform",
      
      // Dashboard
      "Welcome back": "Welcome back",
      "Executive Command Center": "Executive Command Center",
      "Strategic overview and real-time performance insights": "Strategic overview and real-time performance insights",
      "Strategic Decision Making • Executive Intelligence • Board Governance": "Strategic Decision Making • Executive Intelligence • Board Governance",
      "Total Revenue": "Total Revenue",
      "Annual Revenue": "Annual Revenue",
      "Active Projects": "Active Projects",
      "Team Members": "Board Members",
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
      
      // KPIs & Reports
      "All Reports": "All Reports",
      "Operations": "Operations",
      "Financial": "Financial",
      "HR & Workforce": "HR & Workforce", 
      "Open in new tab": "Open in new tab",
      "Loading Power BI Report...": "Loading Power BI Report...",
      "Refreshing report...": "Refreshing report...",
      "Export to PDF": "Export to PDF",
      "Report refreshed successfully": "Report refreshed successfully",
      "Failed to refresh report": "Failed to refresh report",
      "Export started successfully": "Export started successfully",
      "Failed to export report": "Failed to export report",
      
      // Navigation & Misc Additions
      "Executive Board": "Executive Board",
      "Search...": "Search...",
      "Search by name or description...": "Search by name or description...",
      "Executive": "Executive",
      
      // Dashboard Quick Actions & Labels
      "New Initiative": "New Initiative",
      "Team Review": "Team Review",
      "Schedule Meeting": "Schedule Meeting",
      "Send Update": "Send Update",
      "View Details": "View Details",
      "View Projects": "View Projects",
      "View Metrics": "View Metrics",
      "Growth": "Growth",
      "Today": "Today",
      "Tomorrow": "Tomorrow",
      "Board Meeting Q4 Review": "Board Meeting Q4 Review",
      "Digital Strategy Presentation": "Digital Strategy Presentation",
      "Investor Relations Call": "Investor Relations Call",
      
      // Secretary Workspace
      "Executive-Secretary Workspace": "Executive-Secretary Workspace",
      "Executive-Secretary Dashboard": "Executive-Secretary Dashboard",
      "Create Meeting Agenda": "Create Meeting Agenda",
      "Task Board": "Task Board",
      "Board Resolutions": "Board Resolutions",
      "Recent Activity": "Recent Activity",
      "Quick Actions": "Quick Actions",
      "Meeting Title": "Meeting Title",
      "Company": "Company",
      "Date": "Date",
      "Time": "Time",
      "Location": "Location",
      "Description": "Description",
      "Attendees": "Attendees",
      "Agenda Items": "Agenda Items",
      "Presentation Materials": "Presentation Materials",
      "Add Attendee": "Add Attendee",
      "Add Item": "Add Item",
      "Create Meeting": "Create Meeting",
      "Edit Meeting": "Edit Meeting",
      "Update Meeting": "Update Meeting",
      "Live Meeting Chat": "Live Meeting Chat",
      "Participants": "Participants",
      "Meeting Directives": "Meeting Directives",
      "Mark Resolved": "Mark Resolved",
      "Attendance Summary": "Attendance Summary",
      "Attending": "Attending",
      "Declined": "Declined",
      "Pending": "Pending",
      "Your Response": "Your Response",
      "Will you be attending this meeting?": "Will you be attending this meeting?",
      "Attend": "Attend",
      "Decline": "Decline",
      "Voting Results": "Voting Results",
      "Quarter Status": "Quarter Status",
      "Period": "Period",
      "Status": "Status",
      "Active": "Active",
      "Closed": "Closed",
      "Revenue": "Revenue",
      "Customer Satisfaction": "Customer Satisfaction",
      "Pending Directives": "Pending Directives",
      "Tasks Completed": "Tasks Completed",
      "Team Performance": "Team Performance",
      "Projects On Time": "Projects On Time",
      "Performance Overview": "Performance Overview",
      "Target": "Target",
      "All Clear": "All Clear",
      "Action Required": "Action Required",
      
      // Secretary Workspace Additional Translations - English
      "attendance.notAttending": "Not Attending",
      "attendance.pendingResponse": "Pending Response",
      "attendance.approved": "approved",
      "attendance.declined": "declined",
      "attendance.joinedAt": "Joined at",
      "attendance.unknown": "Unknown",
      "quarter.status": "Quarter Status",
      "quarter.activeMessage": "This quarter is currently active. KPIs are updated in real-time.",
      "task.directives": "directive(s)",
      
      // Task Board Component
      "task.priority.high": "HIGH",
      "task.priority.medium": "MEDIUM", 
      "task.priority.low": "LOW",
      "task.status.completed": "COMPLETED",
      "task.status.inProgress": "IN PROGRESS",
      "task.status.pending": "PENDING",
      "task.directivesCount": "{{count}} directive(s)",
      
      // Live Chat Component
      "chat.title": "Live Chat",
      "chat.placeholder": "Type your message...",
      "chat.send": "Send",
      "chat.directive": "Directive",
      "chat.system": "System",
      "chat.message": "Message",
      "chat.markResolved": "Mark Resolved",
      "chat.resolved": "Resolved",
      "chat.unresolved": "Unresolved",
      "chat.newDirective": "New Directive",
      "chat.directiveResolved": "Directive Resolved",
      "chat.directiveUnresolved": "Directive Unresolved",
      
      // Timeline Component
      "timeline.addComment": "Add Executive Comment",
      "timeline.addExecutiveComment": "Add Executive Comment",
      "timeline.executiveCommentary": "Executive Commentary",
      "timeline.addCommentPlaceholder": "Add your executive comment or strategic insight...",
      "timeline.attachments": "Attachments",
      "timeline.uploadFiles": "Upload Files",
      "timeline.supportedFormats": "Supported files: PDF, images, Word",
      "timeline.commentAdded": "Comment added successfully",
      "timeline.commentError": "Failed to add comment",
      
      // Kanban Component
      "kanban.addStrategicInitiative": "Add Strategic Initiative",
      "kanban.executiveCommentary": "Executive Commentary",
      "kanban.addExecutiveComment": "Add Executive Comment",
      "kanban.commentPlaceholder": "Add your executive comment or strategic directive...",
      "kanban.attachments": "Attachments",
      "kanban.uploadFiles": "Upload Files",
      "kanban.supportedFormats": "Supported files: PDF, images, Word",
      "kanban.commentAdded": "Comment added successfully",
      "kanban.commentError": "Failed to add comment",
      
      // 45degrees Cafe Page - English
      "cafe.title": "45degrees Cafe & Drive-thru",
      "cafe.subtitle": "Exacting Standards, for Quality in a Timely Fashion",
      "cafe.currentOutlets": "Current Outlets",
      "cafe.target2025": "2025 Target",
      "cafe.qualityRating": "Quality Rating",
      "cafe.dailyCustomers": "Daily Customers",
      "cafe.businessOverview": "Business Overview",
      "cafe.economicDescription": "A perennially productive part of the economy",
      "cafe.visionDescription": "Aiming to become the instinctive choice for coffee in the region, 45degrees Cafe leans on our well trained baristas and highly selective sourcing process for coffee beans.",
      "cafe.qualityDescription": "Quality beans deserve quality treatment, and our roasting technology does justice to our South American and African beans in preserving their character and aroma, delivering a flavourful experience every time, guaranteed.",
      "cafe.expansionDescription": "Building on our flagship cafe and 6 drive-thrus in Riyadh, 45degrees is poised to operate over 100 drive-thru cafes in Saudi Arabia by 2025.",
      "cafe.coreAdvantages": "Core Advantages",
      "cafe.premiumBeanSourcing": "Premium Bean Sourcing",
      "cafe.advancedRoasting": "Advanced Roasting Technology",
      "cafe.trainedBaristas": "Trained Baristas",
      "cafe.driveThruConvenience": "Drive-thru Convenience",
      "cafe.qualityConsistency": "Quality Consistency",
      "cafe.customerExperience": "Customer Experience",
      "cafe.coffeeSourcing": "Coffee Sourcing",
      "cafe.southAmerica": "South America",
      "cafe.africa": "Africa",
      "cafe.premiumArabica": "Premium Arabica",
      "cafe.specialtyBlends": "Specialty Blends",
      "cafe.roastingExcellence": "Roasting Excellence",
      "cafe.preservingCharacter": "Preserving character & aroma",
      "cafe.expansionTimeline": "Expansion Timeline",
      "cafe.completed": "Completed",
      "cafe.expansionTarget": "Expansion Target",
      "cafe.outlets": "Outlets",
      "cafe.achieved": "Achieved",
      "cafe.expansionInProgress": "Expansion In Progress",
      "cafe.expansionPlanned": "Expansion Planned",
      "cafe.strategicFocus": "Strategic Focus",
      "cafe.qualityFirst": "Quality First",
      "cafe.maintainStandards": "Maintain premium coffee standards",
      "cafe.convenienceFocus": "Drive-thru Focus",
      "cafe.convenienceStrategy": "Convenience for busy customers",
      "cafe.rapidExpansion": "Rapid Expansion",
      "cafe.locations2025": "100+ locations by 2025",
      "cafe.marketResilience": "Market Resilience & Strategy",
      "cafe.economicResilience": "Economic Resilience",
      "cafe.covidDescription": "The food and beverage sector is highly robust. Even during COVID-19, food remained a top priority as an essential service.",
      "cafe.alJeriFocus": "Al Jeri focuses on convenience for the consumer, with upscale sit-down as well as Drive-thru cafes.",
      "cafe.regionalLeadership": "Regional Leadership",
      "cafe.leadershipDescription": "Aiming to become the instinctive choice for coffee in the region through consistent quality and service excellence",
      
      // Dashboard
      "dashboard.boardMembers": "Board Members",
      
      // Buttons
      "buttons.attend": "Attend",
      "buttons.decline": "Decline",
      "buttons.viewRegister": "View & Register",
      
      // Common Phrases in Dashboard
      "+12.5% vs last year": "+12.5% vs last year",
      "+3 new this quarter": "+3 new this quarter",
      "+8.2% growth rate": "+8.2% growth rate",
      "+2.1% improvement": "+2.1% improvement",
      "Upcoming Events": "Upcoming Events",
      "Need help? Check our Executive Guide": "Need help? Check our Executive Guide",
      "Export Report": "Export Report",
      "Share Dashboard": "Share Dashboard",
      "Full Screen": "Full Screen",
      "ECC - Coming Soon": "ECC - Coming Soon",
      "ECP - Coming Soon": "ECP - Coming Soon",
      "Agenda": "Agenda",
      "moreItems": "+{{count}} more items",
      "Meeting": "Meeting",
      "Strategic Initiatives Overview": "Strategic Initiatives Overview",
      "Completed Initiatives": "Completed Initiatives",
      "In Progress": "In Progress",
      "Planned": "Planned",
      "Quick Overview": "Quick Overview",
      "Q1 2025: Strategic Review & Planning": "Q1 2025: Strategic Review & Planning",
      "Q2 2025: Digital Transformation Phase 2": "Q2 2025: Digital Transformation Phase 2",
      "Q3 2025: Market Expansion Initiative": "Q3 2025: Market Expansion Initiative",
      "Q4 2025: Innovation Lab Launch": "Q4 2025: Innovation Lab Launch",
      "📊 Key 2024 Achievements": "📊 Key 2024 Achievements",
      "📈 Year Summary": "📈 Year Summary",
      "Outstanding Year!": "Outstanding Year!",
       
       // Executive Dashboard additions
       "Executive Dashboard": "Executive Dashboard",
       "Strategic overview and key performance indicators": "Strategic overview and key performance indicators",
       "Strategic Project Distribution": "Strategic Project Distribution",
       "Quarterly Performance Metrics": "Quarterly Performance Metrics",
       "Operational Efficiency (%)": "Operational Efficiency (%)",
       "Customer Satisfaction (%)": "Customer Satisfaction (%)",
       "Market Growth (%)": "Market Growth (%)",
       "Actual Revenue": "Actual Revenue",
       
       "Strategic Insights": "Strategic Insights",
       "Revenue Growth Acceleration": "Revenue Growth Acceleration",
       "Q2 revenue exceeded targets by 14.3%, driven by digital transformation initiatives.": "Q2 revenue exceeded targets by 14.3%, driven by digital transformation initiatives.",
       "Market Expansion Success": "Market Expansion Success",
       "New market penetration increased by 22%, with strong performance in APAC region.": "New market penetration increased by 22%, with strong performance in APAC region.",
       "Operational Excellence": "Operational Excellence",
       "Efficiency improvements of 9.2% achieved through AI-driven process optimization.": "Efficiency improvements of 9.2% achieved through AI-driven process optimization.",
       "Strategic Priorities": "Strategic Priorities",
       "Digital Innovation Pipeline": "Digital Innovation Pipeline",
       "Launch 3 AI-powered products by Q4 to maintain competitive edge.": "Launch 3 AI-powered products by Q4 to maintain competitive edge.",
       "Sustainability Goals": "Sustainability Goals",
       "Achieve carbon neutrality by 2025 through green technology investments.": "Achieve carbon neutrality by 2025 through green technology investments.",
       "Talent Acquisition": "Talent Acquisition",
       "Scale engineering team by 35% to support global expansion plans.": "Scale engineering team by 35% to support global expansion plans.",
       
       // Months short
       "Jan": "Jan",
       "Feb": "Feb",
       "Mar": "Mar",
       "Apr": "Apr",
       "May": "May",
       "Jun": "Jun",
       
       // Quarter
        "Q4": "Q4",
      
      // Relative time
      "Just now": "Just now",
      "time.minute": "{{count}}m ago",
      "time.hour": "{{count}}h ago",
      "time.day": "{{count}}d ago",
      
      // My Meetings extra
      "myMeetings.upcomingCount": "{{count}} upcoming meeting",
      
      // My Meetings
      "My Meetings": "My Meetings",
      "myMeetings.noMeetings": "No upcoming meetings",
      "myMeetings.declineReason": "Reason for declining",
      "myMeetings.reasonPlaceholder": "Please provide a reason for not attending",
      "myMeetings.confirmAttendance": "Confirm Attendance",
      "myMeetings.declineAttendance": "Decline Attendance",
      "myMeetings.attendanceConfirmed": "You're in!",
      "myMeetings.declineSubmitted": "Your decline has been recorded",
      "myMeetings.reasonRequired": "Reason is required",
      "myMeetings.membersConfirmed": "Members who confirmed attendance",
      
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
      "Assignee": "Assignee",
      "Due Date": "Due Date",
      
      // 45degrees Cafe Page - English
      "45degrees Cafe & Drive-thru": "45degrees Cafe & Drive-thru",
      "Exacting Standards, for Quality in a Timely Fashion": "Exacting Standards, for Quality in a Timely Fashion",
      "Current Outlets": "Current Outlets",
      "2025 Target": "2025 Target",
      "Quality Rating": "Quality Rating",
      "Daily Customers": "Daily Customers",
      "Business Overview": "Business Overview",
      "A perennially productive part of the economy": "A perennially productive part of the economy",
      "Aiming to become the instinctive choice for coffee in the region, 45degrees Cafe leans on our well trained baristas and highly selective sourcing process for coffee beans.": "Aiming to become the instinctive choice for coffee in the region, 45degrees Cafe leans on our well trained baristas and highly selective sourcing process for coffee beans.",
      "Quality beans deserve quality treatment, and our roasting technology does justice to our South American and African beans in preserving their character and aroma, delivering a flavourful experience every time, guaranteed.": "Quality beans deserve quality treatment, and our roasting technology does justice to our South American and African beans in preserving their character and aroma, delivering a flavourful experience every time, guaranteed.",
      "Building on our flagship cafe and 6 drive-thrus in Riyadh, 45degrees is poised to operate over 100 drive-thru cafes in Saudi Arabia by 2025.": "Building on our flagship cafe and 6 drive-thrus in Riyadh, 45degrees is poised to operate over 100 drive-thru cafes in Saudi Arabia by 2025.",
      "Core Advantages": "Core Advantages",
      "Premium Bean Sourcing": "Premium Bean Sourcing",
      "Advanced Roasting Technology": "Advanced Roasting Technology",
      "Trained Baristas": "Trained Baristas",
      "Drive-thru Convenience": "Drive-thru Convenience",
      "Quality Consistency": "Quality Consistency",
      "Customer Experience": "Customer Experience",
      "Coffee Sourcing": "Coffee Sourcing",
      "South America": "South America",
      "Africa": "Africa",
      "Premium Arabica": "Premium Arabica",
      "Specialty Blends": "Specialty Blends",
      "Roasting Excellence": "Roasting Excellence",
      "Preserving character & aroma": "Preserving character & aroma",
      "Expansion Timeline": "Expansion Timeline",
      "Completed": "Completed",
      "Expansion Target": "Expansion Target",
      "Outlets": "Outlets",
      "Achieved": "Achieved",
      "Expansion In Progress": "Expansion In Progress",
      "Expansion Planned": "Expansion Planned",
      "Strategic Focus": "Strategic Focus",
      "Quality First": "Quality First",
      "Maintain premium coffee standards": "Maintain premium coffee standards",
      "Drive-thru Focus": "Drive-thru Focus",
      "Convenience for busy customers": "Convenience for busy customers",
      "Rapid Expansion": "Rapid Expansion",
      "100+ locations by 2025": "100+ locations by 2025",
      "Market Resilience & Strategy": "Market Resilience & Strategy",
      "Economic Resilience": "Economic Resilience",
      "The food and beverage sector is highly robust. Even during COVID-19, food remained a top priority as an essential service.": "The food and beverage sector is highly robust. Even during COVID-19, food remained a top priority as an essential service.",
      "Convenience Focus": "Convenience Focus",
      "Al Jeri focuses on convenience for the consumer, with upscale sit-down as well as Drive-thru cafes.": "Al Jeri focuses on convenience for the consumer, with upscale sit-down as well as Drive-thru cafes.",
      "Regional Leadership": "Regional Leadership",
      "Aiming to become the instinctive choice for coffee in the region through consistent quality and service excellence.": "Aiming to become the instinctive choice for coffee in the region through consistent quality and service excellence",
      
      // Board Mark - Digital Signature System
      "board_mark.title": "Board Mark",
      "board_mark.create_resolution": "Create Resolution",
      "board_mark.meeting_date": "Meeting Date",
      "board_mark.agreement_details": "Agreement Details",
      "board_mark.preview_pdf": "Preview PDF",
      "board_mark.save_request": "Save & Request Signatures",
      "board_mark.resolution_list": "Board Resolutions",
      "board_mark.status.draft": "Draft",
      "board_mark.status.awaiting_signatures": "Awaiting Signatures",
      "board_mark.status.finalized": "Finalized",
      "board_mark.status.expired": "Time Limit Exceeded",
      "board_mark.messages.createSuccess": "Resolution created and signature requests sent",
      "board_mark.messages.createError": "Failed to create resolution",
      "board_mark.messages.signatureRequestSent": "Signature Requests Sent",
      "board_mark.messages.signatureRequestSentDescription": "Signature requests for resolution {{resolutionId}} have been initiated.",
      "board_mark.dabaja": "Board Minutes: Under the authority vested in the Board and in accordance with applicable laws and regulations, the following resolution was adopted:",
      "board_mark.preamble": "The matter was discussed and the Board resolved as follows:",
      "board_mark.sign.title": "Sign Resolution",
      "board_mark.sign.instructions": "Hello {{name}}, please review and sign resolution {{resolutionId}}.",
      "board_mark.sign.otpLabel": "Enter OTP",
      "board_mark.sign.otpRequired": "OTP is required",
      "board_mark.sign.otpPlaceholder": "Enter 6-digit OTP",
      "board_mark.sign.decisionLabel": "Decision",
      "board_mark.sign.approve": "Approve",
      "board_mark.sign.reject": "Reject",
      "board_mark.sign.reasonLabel": "Reason for Rejection",
      "board_mark.sign.reasonRequired": "Reason is required for rejection",
      "board_mark.sign.reasonPlaceholder": "Please provide a reason for rejecting this resolution",
      "board_mark.sign.submitButton": "Submit Signature",
      "board_mark.sign.success.signed": "Resolution signed successfully",
      "board_mark.sign.error.missingParams": "Missing required parameters",
      "board_mark.sign.error.fetchFailed": "Failed to fetch resolution",
      "board_mark.sign.error.notFound": "Resolution not found",
      "board_mark.sign.error.signatoryNotFound": "Signatory not found",
      "board_mark.sign.error.internalError": "Internal error occurred",
      "board_mark.sign.error.generic": "An error occurred while signing",
      "board_mark.sign.error.Invalidtoken": "Invalid token",
      "board_mark.sign.error.InvalidorexpiredOTP": "Invalid or expired OTP",
      "board_mark.sign.error.Signatorynotfound": "Signatory not found",
      "board_mark.sign.error.Missingrequiredfields": "Missing required fields",
      "loading": "Loading...",
      
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
    lng: "ar", // Default to Arabic
    fallbackLng: "ar",
    debug: false,
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'querystring', 'navigator'],
      lookupLocalStorage: 'selectedLanguage',
      lookupQuerystring: 'lng',
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