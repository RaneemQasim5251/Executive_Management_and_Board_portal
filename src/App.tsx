import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  AuthPage,
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import routerBindings, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { App as AntdApp } from "antd";
import { useTranslation } from "react-i18next";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

import { authProvider } from "./providers/authProvider";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { Header } from "./components/layout";
import { ExecutiveDashboard } from "./pages/dashboard";
import { TimelinePage } from "./pages/timeline";
import { KanbanPage } from "./pages/kanban";

import "./App.css";

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <AntdApp>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <Refine
            dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
            notificationProvider={useNotificationProvider}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
            routerProvider={routerBindings}
            resources={[
              {
                name: "dashboard",
                list: "/",
                meta: {
                  label: "Executive Dashboard",
                  icon: "📊",
                },
              },
              {
                name: "timeline",
                list: "/timeline",
                meta: {
                  label: "Strategic Timeline",
                  icon: "🌊",
                },
              },
              {
                name: "kanban",
                list: "/kanban",
                meta: {
                  label: "Board Tasks",
                  icon: "📋",
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "executive-portal",
              title: {
                text: "Executive Portal",
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
                <Route
                  index
                  element={<NavigateToResource resource="dashboard" />}
                />
                <Route path="/dashboard" element={<ExecutiveDashboard />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/kanban" element={<KanbanPage />} />
                <Route path="*" element={<ErrorComponent />} />
              </Route>
              <Route
                element={
                  <AuthPage
                    type="login"
                    title={
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                          🏢
                        </div>
                        <h1 style={{ color: "#1e3a8a", marginBottom: "8px" }}>
                          Executive Portal
                        </h1>
                        <p style={{ color: "#6b7280", fontSize: "14px" }}>
                          C-Level Access Only
                        </p>
                      </div>
                    }
                    formProps={{
                      initialValues: {
                        email: "executive@company.com",
                        password: "executive123",
                      },
                    }}
                  />
                }
                path="/login"
              />
            </Routes>

            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </AntdApp>
  );
}

export default App;