# Executive Management & Board Portal

Modern executive and board portal with dashboards, Power BI embedding, Arabic/English i18n, voice control, biometric authentication (WebAuthn), and Supabase integration.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646cff?logo=vite)](https://vitejs.dev/)
[![Ant Design](https://img.shields.io/badge/AntD-5.x-1677ff?logo=antdesign)](https://ant.design/)

## Key Features

- Executive dashboards and KPIs (`src/pages/dashboard`)
- Embedded Microsoft Power BI with secure token flow (`src/services/powerBIService.ts`)
- Arabic and English with RTL support (`src/i18n.ts`)
- Biometric/WebAuthn demo and services (`src/components/BiometricAuth.tsx`, `src/api/services/webAuthnService.ts`)
- Voice command navigation (`src/hooks/useVoiceNavigation.ts`, `src/components/VoiceControl.tsx`)
- Multiple layouts (Minimalist, Simplified, World-Class) under `src/components/layout`
- Supabase auth provider and utilities (`src/providers/supabaseAuthProvider.ts`, `src/supabase.ts`)
- Secretary workspace, board mark flow, and enterprise systems pages

## Monorepo Structure (single app with API folder)

```
Executive-Management-Portal/
├─ src/
│  ├─ api/                  # Lightweight Node API (Express) used for auth/biometric/health
│  ├─ components/           # UI components (auth, voice, biometric, layouts, widgets)
│  ├─ hooks/                # Reusable hooks (voice, PowerBI, state)
│  ├─ pages/                # App pages (dashboard, reports, secretary workspace, login, etc.)
│  ├─ providers/            # Auth providers (Supabase)
│  ├─ services/             # Client services (PowerBI, notifications, voice)
│  ├─ styles/               # CSS themes (minimalist, simplified, world-class)
│  ├─ utils/                # Helpers (pdf export, language utils)
│  └─ i18n.ts               # i18next configuration (AR/EN)
├─ supabase/functions/      # Edge functions (e.g., sign/request-signatures)
├─ Dockerfile               # Frontend container
├─ Dockerfile.api           # API container
├─ env.example              # Example env vars
├─ README-BACKEND.md        # Detailed backend/API docs
└─ README_ARABIC.md         # Arabic overview
```

## Quick Start

Prerequisites: Node.js 18+, npm 9+, modern browser. For Power BI, an Azure AD app and workspace setup may be required.

1) Clone and install
```bash
git clone https://github.com/RaneemQasim5251/-Executive_Management_and_Board_portal.git
cd Executive-Management-Portal
npm install
```

2) Configure environment
```bash
cp env.example .env.local
# Update values as needed
```

Minimum commonly used variables:
```bash
VITE_APP_TITLE=Executive Management Portal
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
# Optional Power BI
VITE_POWERBI_TENANT_ID=...
VITE_POWERBI_CLIENT_ID=...
VITE_POWERBI_WORKSPACE_ID=...
VITE_POWERBI_REPORT_ID=...
```

3) Run the app
```bash
npm run dev
# open http://localhost:5173
```

Build and preview:
```bash
npm run build
npm run preview
```

## NPM Scripts

- dev: start Vite dev server
- build: production build
- preview: local preview of build
- lint: run ESLint

## Power BI

- Setup guides: `POWERBI_SETUP.md`, `POWERBI_WORKSPACE_SETUP.md`, `POWERBI_TOKEN_SETUP.md`, `powerbi-api-guide.md`, `POWERBI_ERROR_FIX.md`
- Helpers: `get-powerbi-token.js`, `get-powerbi-pages.ps1`, `get-pages-simple.ps1`
- Frontend service: `src/services/powerBIService.ts` and hook `src/hooks/usePowerBI.ts`
- Ensure Azure AD app permissions and embed tokens per guides above.

## Authentication and Biometric

- Supabase auth provider: `src/providers/supabaseAuthProvider.ts`
- Traditional login pages under `src/pages/login`
- WebAuthn/Biometric demo: `src/components/BiometricAuth.tsx`, API service `src/api/services/webAuthnService.ts`
- See `BIOMETRIC_AUTHENTICATION_GUIDE.md` for setup.

## Internationalization (AR/EN)

- i18n configured in `src/i18n.ts`
- Arabic RTL support baked into layouts and styles
- Additional Arabic overview: `README_ARABIC.md`

## Layouts and Theming

- Layouts: `MinimalistLayout`, `SimplifiedLayout`, `MainLayout`, etc. in `src/components/layout`
- Theme switcher and settings components available under `src/components`
- Brand guideline summary: `BRAND_IMPLEMENTATION_SUMMARY.md`
- Primary palette: Federal Blue, Black, Egyptian Blue, Red, Celestial Blue

## Lightweight API (optional)

- Node API in `src/api` (Express): routes for auth, biometric, and health
- Start with your preferred process manager or containerize with `Dockerfile.api`
- Detailed docs: `README-BACKEND.md`

## Deployment

- Vercel/Netlify for frontend; Docker and Kubernetes supported
- Nginx config provided (`nginx.conf`) for static hosting
- See `DEPLOYMENT.md` and `BOARD_MARK_DEPLOYMENT_GUIDE.md`

## Contributing

PRs welcome. Please follow ESLint/TypeScript standards and keep designs consistent with the executive theme. For backend/API specifics, see `README-BACKEND.md`.

## License

MIT © Raneem Althaqafi
