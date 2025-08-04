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
import { App as AntdApp, ConfigProvider, theme } from "antd";
import { Routes, Route, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import arEG from 'antd/locale/ar_EG';
import enUS from 'antd/locale/en_US';
import { 
  DashboardOutlined, 
  TeamOutlined, 
  AimOutlined, 
  ClockCircleOutlined,
  BarChartOutlined,
  FileTextOutlined,
  FolderOutlined,

  RiseOutlined,
  TruckOutlined,
  CarOutlined,
  CoffeeOutlined,
  ThunderboltOutlined,
  FireOutlined,
  SettingOutlined,
  LineChartOutlined,
  DatabaseOutlined
} from '@ant-design/icons';


import { supabaseAuthProvider } from "./providers/supabaseAuthProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";

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
import { AppStateProvider } from "./contexts/AppStateProvider";
import { Header } from "./components/layout";
import { ModernExecutiveDashboard } from "./pages/dashboard/modern.tsx";
import { HorizontalTimeline } from "./pages/timeline/horizontal.tsx";
import { KanbanPage } from "./pages/kanban/index.tsx";
import { Login } from "./pages/login";
import { ReportsPage } from "./pages/reports/index.tsx";
import { StrategicPlanningPage } from "./pages/strategic-planning/index.tsx";
import { Archive2024 } from "./pages/archive/Archive2024.tsx";
import { Archive2025 } from "./pages/archive/Archive2025.tsx";
import { JTCPage, JOilPage, ShaheenPage, FortyFiveDegreesPage, EnergyPage } from "./pages/companies";
import KPIsERP from "./pages/enterprise-systems/KPIsERP";

import "./App.css";

function App() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return (
    <ErrorBoundary>
      <ConfigProvider
      locale={isRTL ? arEG : enUS}
      direction={isRTL ? 'rtl' : 'ltr'}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1e3a8a',
          fontFamily: isRTL 
            ? "'Noto Sans Arabic', 'Cairo', 'Amiri', system-ui, -apple-system, sans-serif"
            : "'Inter', system-ui, -apple-system, sans-serif",
        },
      }}
    >
      <AntdApp>
        <RefineKbarProvider>
          <ColorModeContextProvider>
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
                list: "/systems/ecc",
                parentName: "enterprise-systems",
                meta: {
                  label: t("ECC"),
                  icon: <DatabaseOutlined />,
                  parent: "enterprise-systems",
                },
              },
              {
                name: "ecp",
                list: "/systems/ecp",
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
            <Routes>
              <Route
                element={
                  <ThemedLayoutV2
                    Header={() => <Header sticky />}
                    Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                  >
                    <Outlet />
                  </ThemedLayoutV2>
                }
              >
                <Route index element={<ModernExecutiveDashboard />} />
                <Route path="/board" element={<KanbanPage />} />
                <Route path="/board/strategic-planning" element={<StrategicPlanningPage />} />
                <Route path="/timeline" element={<HorizontalTimeline />} />
                <Route path="/archive/2024" element={<Archive2024 />} />
                <Route path="/archive/2025" element={<Archive2025 />} />
                <Route path="/reports" element={<ReportsPage />} />
                
                {/* Al Jeri Companies */}
                <Route path="/companies/jtc" element={<JTCPage />} />
                <Route path="/companies/joil" element={<JOilPage />} />
                <Route path="/companies/shaheen" element={<ShaheenPage />} />
                <Route path="/companies/45degrees" element={<FortyFiveDegreesPage />} />
                <Route path="/companies/energy" element={<EnergyPage />} />
                
                {/* Enterprise Systems */}
                <Route path="/systems/ecc" element={<div style={{padding: '24px', textAlign: 'center'}}><h2>ECC - Coming Soon</h2></div>} />
                <Route path="/systems/ecp" element={<div style={{padding: '24px', textAlign: 'center'}}><h2>ECP - Coming Soon</h2></div>} />
                <Route path="/systems/kpi-erp" element={<KPIsERP />} />

                <Route path="*" element={<ErrorComponent />} />
              </Route>
                              <Route
                  element={<Login />}
                  path="/login"
                />
            </Routes>

            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </AppStateProvider>
      </ColorModeContextProvider>
    </RefineKbarProvider>
  </AntdApp>
</ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;