import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { App as AntdApp } from "antd";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { 
  DashboardOutlined, 
  TeamOutlined, 
  AimOutlined, 
  ClockCircleOutlined,
  BarChartOutlined,
  FileTextOutlined,
  FolderOutlined,
  CalendarOutlined,
  RiseOutlined,
  TruckOutlined,
  CarOutlined,
  CoffeeOutlined,
  ThunderboltOutlined,
  FireOutlined,
  SettingOutlined,
  LineChartOutlined,
  DatabaseOutlined,
  TrophyOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';


import { supabaseAuthProvider } from "./providers/supabaseAuthProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import PortalThemeProvider from './contexts/PortalThemeContext';

// Demo data provider for development
const createDemoDataProvider = () => {
    const isDemoMode = !(import.meta as any).env?.VITE_SUPABASE_URL ||
                    (import.meta as any).env?.VITE_SUPABASE_URL === "https://demo.supabase.co" ||
                    (import.meta as any).env?.VITE_SUPABASE_ANON_KEY === "demo-anon-key";
  
  if (isDemoMode) {
    // Simple in-memory data provider for demo
    return {
      getList: async () => ({ data: [], total: 0 }),
      getOne: async () => ({ data: {} }),
      create: async () => ({ data: {} }),
      update: async () => ({ data: {} }),
      deleteOne: async () => ({ data: {} }),
      getApiUrl: () => "demo://localhost"
    };
  }
  
  try {
    // Use real data provider with Supabase
    return dataProvider("https://api.fake-rest.refine.dev");
  } catch (error) {
    console.warn("Failed to create real data provider, falling back to demo mode");
    // Fallback to demo mode on error
    return {
      getList: async () => ({ data: [], total: 0 }),
      getOne: async () => ({ data: {} }),
      create: async () => ({ data: {} }),
      update: async () => ({ data: {} }),
      deleteOne: async () => ({ data: {} }),
      getApiUrl: () => "demo://localhost"
    };
  }
};
import { ColorModeContextProvider } from "./contexts/color-mode";
import { ThemeProvider } from "./contexts/theme/ThemeProvider";
import { AppStateProvider } from "./contexts/AppStateProvider";
import { Header } from "./components/layout";
import { Login } from "./pages/login";
import { SkipNavigation } from "./components/SkipLink";
import { VoiceControlButton } from "./components/VoiceControl";

import "./App.css";
import "./styles/accessibility.css";

// Route-level code splitting
const ModernExecutiveDashboard = lazy(() => import("./pages/dashboard/modern.tsx").then(m => ({ default: m.ModernExecutiveDashboard })));
const ExecutiveDashboard = lazy(() => import("./pages/dashboard/index.tsx").then(m => ({ default: m.ExecutiveDashboard })));
const HorizontalTimeline = lazy(() => import("./pages/timeline/horizontal.tsx").then(m => ({ default: m.HorizontalTimeline })));
const KanbanPage = lazy(() => import("./pages/kanban/index.tsx").then(m => ({ default: m.KanbanPage })));
const ReportsPage = lazy(() => import("./pages/reports/index.tsx").then(m => ({ default: m.ReportsPage })));
const StrategicPlanningPage = lazy(() => import("./pages/strategic-planning/index.tsx").then(m => ({ default: m.StrategicPlanningPage })));
const Archive2024 = lazy(() => import("./pages/archive/Archive2024.tsx").then(m => ({ default: m.Archive2024 })));
const Archive2025 = lazy(() => import("./pages/archive/Archive2025.tsx").then(m => ({ default: m.Archive2025 })));
const JTCPage = lazy(() => import("./pages/companies/JTC.tsx").then(m => ({ default: m.JTCPage })));
const JOilPage = lazy(() => import("./pages/companies/JOil.tsx").then(m => ({ default: m.JOilPage })));
const ShaheenPage = lazy(() => import("./pages/companies/Shaheen.tsx").then(m => ({ default: m.ShaheenPage })));
const FortyFiveDegreesPage = lazy(() => import("./pages/companies/FortyFiveDegrees.tsx").then(m => ({ default: m.FortyFiveDegreesPage })));
const EnergyPage = lazy(() => import("./pages/companies/Energy.tsx").then(m => ({ default: m.EnergyPage })));
const KPIsERP = lazy(() => import("./pages/enterprise-systems/KPIsERP"));
const SecretaryWorkspace = lazy(() => import("./pages/secretary-workspace").then(m => ({ default: m.SecretaryWorkspace })));
const MyMeetings = lazy(() => import("./pages/MyMeetings").then(m => ({ default: m.MyMeetings })));
const DemoSidebarPage = lazy(() => import("./pages/demo-sidebar").then(m => ({ default: m.DemoSidebarPage })));
const BoardMarkPage = lazy(() => import("./pages/board-mark/index"));
const BoardMarkSignPage = lazy(() => import("./pages/board-mark/sign"));
const SimplifiedPortal = lazy(() => import("./pages/SimplifiedPortal"));
const SimplifiedLogin = lazy(() => import("./pages/login/SimplifiedLogin"));
const MinimalistPortal = lazy(() => import("./pages/MinimalistPortal"));
const MinimalistLogin = lazy(() => import("./pages/login/MinimalistLogin"));

// Import the new pages
import ECCPage from './pages/enterprise-systems/ECC';
import ECPPage from './pages/enterprise-systems/ECP';
import BookcasesPage from './pages/bookcases/BookcasesPage.tsx';
import AgendaPage from './pages/agenda/AgendaPage';
import PackReaderPage from './pages/pack/PackReaderPage';
import CompliancePage from './pages/compliance/CompliancePage';
import TestPage from './pages/TestPage';

// Import world-class dashboard
const WorldClassDashboard = lazy(() => import('./pages/world-class/WorldClassDashboard'));

// Import world-class login
const WorldClassLogin = lazy(() => import('./pages/world-class/WorldClassLogin'));

function App() {
  const { t } = useTranslation();

  return (
    <ErrorBoundary>
      <SkipNavigation />
      <PortalThemeProvider>
        <ColorModeContextProvider>
          <ThemeProvider>
            <AntdApp>
              <RefineKbarProvider>
                <AppStateProvider>
                <Refine
              dataProvider={createDemoDataProvider() as any}
              notificationProvider={useNotificationProvider}
              authProvider={supabaseAuthProvider}
              routerProvider={routerBindings}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: {
                    label: t("Executive Overview"),
                    icon: <DashboardOutlined />,
                  },
                },
                {
                  name: "executive-board",
                  list: "/executive-board",
                  meta: {
                    label: t("Executive Board"),
                    icon: <TrophyOutlined />,
                  },
                },
                {
                  name: "board",
                  list: "/board",
                  create: "/board/create",
                  edit: "/board/edit/:id",
                  show: "/board/show/:id",
                  meta: {
                    label: t("Board Management"),
                    icon: <TeamOutlined />,
                  },
                },
                {
                  name: "strategic-planning",
                  list: "/board/strategic-planning",
                  meta: {
                    label: t("Strategic Planning"),
                    icon: <AimOutlined />,
                  },
                },
                {
                  name: "timeline",
                  list: "/timeline",
                  create: "/timeline/create",
                  edit: "/timeline/edit/:id",
                  show: "/timeline/show/:id",
                  meta: {
                    label: t("Strategic Timeline"),
                    icon: <ClockCircleOutlined />,
                  },
                },
                {
                  name: "reports",
                  list: "/reports",
                  meta: {
                    label: t("Reports & Analytics"),
                    icon: <BarChartOutlined />,
                  },
                },
                {
                  name: "executive-reports",
                  list: "/reports",
                  parentName: "reports",
                  meta: {
                    label: t("Executive Reports"),
                    icon: <FileTextOutlined />,
                    parent: "reports",
                  },
                },
                {
                  name: "archive-2024",
                  list: "/archive/2024",
                  parentName: "reports",
                  meta: {
                    label: t("2024 Archive"),
                    icon: <FolderOutlined />,
                    parent: "reports",
                  },
                },
                {
                  name: "archive-2025",
                  list: "/archive/2025",
                  parentName: "reports",
                  meta: {
                    label: t("2025 Current"),
                    icon: <RiseOutlined />,
                    parent: "reports",
                  },
                },
                // Secretary Workspace
                {
                  name: "secretary-workspace",
                  list: "/secretary",
                  meta: {
                    label: t("Executive-Secretary Workspace"),
                    icon: <TeamOutlined />,
                  },
                },
                // My Meetings
                {
                  name: "my-meetings",
                  list: "/my-meetings",
                  meta: {
                    label: t("My Meetings"),
                    icon: <CalendarOutlined />,
                  },
                },
                // Investment Portfolio Management
                {
                  name: "portfolio",
                  list: "/portfolio",
                  meta: {
                    label: t("Investment Portfolio"),
                    icon: <RiseOutlined />,
                  },
                },
                {
                  name: "board-mark",
                  list: "/board-mark",
                  meta: {
                    label: t("Board Mark"),
                    icon: <SafetyCertificateOutlined />,
                  },
                },
                {
                  name: "jtc",
                  list: "/companies/jtc",
                  parentName: "portfolio",
                  meta: {
                    label: t("JTC Transport & Logistics"),
                    icon: <TruckOutlined />,
                    parent: "portfolio",
                  },
                },
                {
                  name: "joil",
                  list: "/companies/joil",
                  parentName: "portfolio",
                  meta: {
                    label: t("J:Oil Petroleum"),
                    icon: <FireOutlined />,
                    parent: "portfolio",
                  },
                },
                {
                  name: "shaheen",
                  list: "/companies/shaheen",
                  parentName: "portfolio",
                  meta: {
                    label: t("Shaheen Rent a Car"),
                    icon: <CarOutlined />,
                    parent: "portfolio",
                  },
                },
                {
                  name: "45degrees",
                  list: "/companies/45degrees",
                  parentName: "portfolio",
                  meta: {
                    label: t("45degrees Cafe"),
                    icon: <CoffeeOutlined />,
                    parent: "portfolio",
                  },
                },
                {
                  name: "energy",
                  list: "/companies/energy",
                  parentName: "portfolio",
                  meta: {
                    label: t("Al Jeri Energy"),
                    icon: <ThunderboltOutlined />,
                    parent: "portfolio",
                  },
                },
                // Enterprise Technology Systems
                {
                  name: "enterprise-systems",
                  list: "/systems",
                  meta: {
                    label: t("Enterprise Systems"),
                    icon: <SettingOutlined />,
                  },
                },
                {
                  name: "ecc",
                  list: "/enterprise-systems/ecc",
                  parentName: "enterprise-systems",
                  meta: {
                    label: t("ECC"),
                    icon: <DatabaseOutlined />,
                    parent: "enterprise-systems",
                  },
                },
                {
                  name: "ecp",
                  list: "/enterprise-systems/ecp",
                  parentName: "enterprise-systems",
                  meta: {
                    label: t("ECP"),
                    icon: <LineChartOutlined />,
                    parent: "enterprise-systems",
                  },
                },
                {
                  name: "kpi-erp",
                  list: "/systems/kpi-erp",
                  parentName: "enterprise-systems",
                  meta: {
                    label: t("KPIs → ERP"),
                    icon: <DatabaseOutlined />,
                    parent: "enterprise-systems",
                  },
                },
                {
                  name: "bookcases",
                  list: BookcasesPage,
                  meta: {
                    label: t("Bookcase"),
                    icon: <FolderOutlined />,
                  },
                },
                {
                  name: "agenda",
                  list: AgendaPage,
                  meta: {
                    label: t("Agenda Planner"),
                    icon: <CalendarOutlined />,
                  },
                },
                {
                  name: "pack",
                  list: PackReaderPage,
                  meta: {
                    label: t("Pack Reader"),
                    icon: <FileTextOutlined />,
                  },
                },
                {
                  name: "compliance",
                  list: CompliancePage,
                  meta: {
                    label: t("Security & Compliance"),
                    icon: <SafetyCertificateOutlined />,
                  },
                },
                {
                  name: "test",
                  list: "/test",
                  meta: {
                    label: t("Test Page"),
                    icon: <FileTextOutlined />,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "executive-portal",
                title: {
                  text: t("Executive Management Portal"),
                  icon: "🏢",
                },
              }}
            >
              <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
              <Routes>
                <Route
                  element={
                    <ThemedLayoutV2
                      Header={() => <Header sticky />}
                      Sider={(props) => <ThemedSiderV2 {...props} fixed width={600} collapsedWidth={80} />}
                    >
                      <main id="main-content" role="main" tabIndex={-1}>
                        <Outlet />
                      </main>
                    </ThemedLayoutV2>
                  }
                >
                  <Route index element={<ModernExecutiveDashboard />} />
                  <Route path="/executive-board" element={<ExecutiveDashboard />} />
                  <Route path="/board" element={<KanbanPage />} />
                  <Route path="/board/strategic-planning" element={<StrategicPlanningPage />} />
                  <Route path="/timeline" element={<HorizontalTimeline />} />
                  <Route path="/archive/2024" element={<Archive2024 />} />
                  <Route path="/archive/2025" element={<Archive2025 />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/board-mark" element={<BoardMarkPage />} />
                  <Route path="/board-mark/:id/sign" element={<BoardMarkSignPage />} />
                  
                  {/* Al Jeri Companies */}
                  <Route path="/companies/jtc" element={<JTCPage />} />
                  <Route path="/companies/joil" element={<JOilPage />} />
                  <Route path="/companies/shaheen" element={<ShaheenPage />} />
                  <Route path="/companies/45degrees" element={<FortyFiveDegreesPage />} />
                  <Route path="/companies/energy" element={<EnergyPage />} />
                  
                  {/* Enterprise Systems */}
                  <Route path="/enterprise-systems/ecc" element={<ECCPage />} />
                  <Route path="/enterprise-systems/ecp" element={<ECPPage />} />
                  <Route path="/systems/kpi-erp" element={<KPIsERP />} />
                  
                  {/* Secretary Workspace */}
                  <Route path="/secretary" element={<SecretaryWorkspace />} />
                  
                  {/* My Meetings */}
                  <Route path="/my-meetings" element={<MyMeetings />} />
                  
                  {/* Demo Sidebar */}
                  <Route path="/demo-sidebar" element={<DemoSidebarPage />} />

                  {/* Simplified Portal Demo */}
                  <Route path="/simplified" element={<SimplifiedPortal />} />

                  {/* Minimalist Portal Demo */}
                  <Route path="/minimalist" element={<MinimalistPortal />} />

                  {/* World-Class Dashboard */}
                  <Route path="/world-class" element={<WorldClassDashboard />} />

                  {/* Explicit demo routes to guarantee visibility */}
                  <Route path="/bookcases" element={<BookcasesPage />} />
                  <Route path="/agenda/:meetingId" element={<AgendaPage />} />
                  <Route path="/agenda" element={<Navigate to="/agenda/1" replace />} />
                  <Route path="/pack/:packId" element={<PackReaderPage />} />
                  <Route path="/pack" element={<Navigate to="/pack/1" replace />} />
                  <Route path="/compliance" element={<CompliancePage />} />

                  <Route path="/test" element={<TestPage />} />

                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                
                {/* Simplified Login Route */}
                <Route
                  element={<SimplifiedLogin />}
                  path="/login-simplified"
                />
                
                {/* Minimalist Login Route */}
                <Route
                  element={<MinimalistLogin />}
                  path="/login-minimalist"
                />
                
                {/* World-Class Login Route */}
                <Route
                  element={<WorldClassLogin />}
                  path="/login-world-class"
                />
                
                <Route
                  element={<Login />}
                  path="/login"
                />
              </Routes>
              </Suspense>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
              
              {/* Floating Voice Control Button */}
              <VoiceControlButton onOpen={() => console.log('Voice control opened via floating button')} />
            </Refine>
                </AppStateProvider>
              </RefineKbarProvider>
            </AntdApp>
          </ThemeProvider>
        </ColorModeContextProvider>
      </PortalThemeProvider>
    </ErrorBoundary>
  );
}

export default App;