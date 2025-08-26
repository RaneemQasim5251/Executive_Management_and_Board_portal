# Board-Intelligence Style UI Setup Guide

This guide covers the implementation of the Board-Intelligence-style bookcase system with agenda planning, AI sidekick, and compliance features.

## 🚀 What's Been Implemented

### PR-01: Database Schema & RLS
- **Multi-tenant architecture** with clients, entities, committees
- **Row Level Security (RLS)** policies for granular access control
- **Audit trail** and signature request tracking
- **Role-based permissions** (Admin, PackCompiler, Approver, Distributor, Director)

### PR-02: Theme & Styling
- **Federal Blue (#0B1E6B)** primary color scheme
- **Gold accents** for shelf bars and highlights
- **Dotted arc backgrounds** for bookcase and stats pages
- **Custom CSS classes** for pack ribbons and shelf styling

### PR-03: Bookcase Home UI
- **Multi-shelf layout** organized by committee (Main Board, Exec, Audit)
- **Pack cards** with status ribbons (NEW PACK / UPDATED)
- **Hover actions** (Open, Timeline, Sign, Publish, Permissions)
- **Search and filtering** capabilities

### PR-04: Agenda Planner with Statistics
- **Drag-and-drop agenda** items with auto-reordering
- **Live statistics** panel showing:
  - Meeting length calculation
  - Stakeholder perspective percentages
  - Six conversation buckets (Steering, Supervising, Strategy, Performance, Governance)
- **Editable fields** for minutes, tags, and stakeholder assignments

### PR-05: Pack Reader + AI Sidekick
- **Three-pane layout**: Contents, Document Viewer, AI Panel
- **AI Insight Driver**: Summarize packs, flag risks, suggest questions
- **AI Minute Writer**: Draft meeting minutes from agenda and decisions
- **Provider-agnostic AI layer** for easy integration

### PR-06: Signatures & Compliance
- **Signature request management** (stub implementation)
- **Audit timeline** showing all pack activities
- **Compliance page** with ISO badges and data residency info
- **Security posture** documentation

## 🛠️ Setup Instructions

### 1. Database Migration

Run the SQL migration in your Supabase project:

```sql
-- Copy and paste the contents of:
-- supabase/migrations/2025-01-PR01-core.sql
```

This creates all tables, enables RLS, and sets up basic policies.

### 2. Environment Variables

Add these to your `.env.local`:

```bash
# Required
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional (for AI features)
OPENAI_API_KEY=your-openai-key
```

### 3. Dependencies

The required packages have been installed:

```bash
npm install recharts @hello-pangea/dnd
```

### 4. Theme Integration

Wrap your app with the Board-Intelligence theme:

```tsx
// In your main App.tsx or main.tsx
import { ConfigProvider } from 'antd';
import { biTheme } from './styles/antTheme';

export default function AppRoot() {
  return (
    <ConfigProvider theme={biTheme}>
      <AppRoutes />
    </ConfigProvider>
  );
}
```

### 5. Routing

Add these routes to your router:

```tsx
<Route path="/bookcases" element={<BookcasesPage />} />
<Route path="/agenda/:meetingId" element={<AgendaPage />} />
<Route path="/pack/:packId" element={<PackReaderPage />} />
<Route path="/compliance" element={<CompliancePage />} />
```

### 6. API Integration

If using the lightweight Express API, wire up the AI routes:

```tsx
// In src/api/server.ts
import { aiRoutes } from './routes';

// Add to your router
router.use('/api', aiRoutes);
```

## 🎯 Key Features

### Bookcase Home (`/bookcases`)
- **Shelf organization** by committee type
- **Status ribbons** (NEW PACK / UPDATED)
- **Gold shelf bars** with professional styling
- **Quick actions** on hover
- **Compliance badges** display

### Agenda Planner (`/agenda/:meetingId`)
- **Left panel**: Editable agenda grid with drag-and-drop
- **Right panel**: Live statistics and charts
- **Auto-calculation** of meeting length and stakeholder percentages
- **Six conversation buckets** for strategic planning

### Pack Reader (`/pack/:packId`)
- **Three-pane layout** for optimal workflow
- **AI Sidekick** with Insight Driver and Minute Writer
- **Document management** and table of contents
- **Timeline integration** for audit trail

### Compliance (`/compliance`)
- **Security certifications** display
- **Data residency** information
- **Sub-processor** transparency
- **ISO 27001** and Cyber Essentials badges

## 🔧 Customization

### Colors & Styling
- Modify `src/styles/antTheme.ts` for Ant Design tokens
- Update `src/styles/global.css` for custom CSS classes
- Adjust Federal Blue (#0B1E6B) and Gold (#C88A00) as needed

### AI Integration
- Replace OpenAI calls in `src/api/routes/ai.ts` with your preferred provider
- Customize prompts for Insight Driver and Minute Writer
- Add language support (Arabic/English) to AI responses

### Document Viewer
- Integrate your existing PDF/Office viewer in the Pack Reader
- Add annotation support tied to the `annotations` table
- Implement page mapping for note preservation across versions

## 🚀 Next Steps

### Phase 1: Core Functionality
- [x] Database schema and RLS
- [x] Bookcase UI and pack management
- [x] Agenda planner with statistics
- [x] AI sidekick scaffolding

### Phase 2: Enhanced Features
- [ ] Document viewer integration
- [ ] Annotation system
- [ ] E-signature workflow
- [ ] Offline caching

### Phase 3: Advanced Capabilities
- [ ] Power BI integration with RLS
- [ ] Voice control enhancements
- [ ] Mobile optimization
- [ ] Advanced analytics

## 🐛 Troubleshooting

### Common Issues

1. **RLS Policies**: Ensure user has proper memberships in the database
2. **AI Endpoints**: Check OpenAI API key and rate limits
3. **Drag & Drop**: Verify @hello-pangea/dnd is properly installed
4. **Charts**: Ensure Recharts components are wrapped in ResponsiveContainer

### Database Queries

Test basic access:

```sql
-- Check if user can see packs
SELECT * FROM packs LIMIT 5;

-- Verify memberships
SELECT * FROM memberships WHERE user_id = auth.uid();
```

## 📚 Additional Resources

- **Supabase RLS**: [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- **Ant Design**: [Theme Customization](https://ant.design/docs/react/customize-theme)
- **Recharts**: [Chart Components](https://recharts.org/en-US/api)
- **Drag & Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)

## 🤝 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the database migration for RLS policies
3. Verify environment variables are set correctly
4. Test with a simple pack creation workflow

---

**Built with ❤️ for Executive Excellence**
