/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POWERBI_CLIENT_ID: string
  readonly VITE_POWERBI_TENANT_ID: string
  readonly VITE_POWERBI_CLIENT_SECRET: string
  readonly VITE_APP_JTC_REPORT_ID: string
  readonly VITE_APP_ALJERI_REPORT_ID: string
  readonly VITE_APP_JOIL_REPORT_ID: string
  readonly VITE_APP_TIME_ATTENDANCE_REPORT_ID: string
  readonly VITE_APP_45DEGREES_REPORT_ID: string
  readonly VITE_APP_SHAHEEN_REPORT_ID: string
  readonly VITE_APP_REVENUE_REPORT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}