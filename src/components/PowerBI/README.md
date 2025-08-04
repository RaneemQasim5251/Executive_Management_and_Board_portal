# Power BI Components

## Overview
This directory contains Power BI integration components for the Executive Management Portal.

## Components Architecture

### Core Files
- `powerBIService.ts` - Main service for Power BI operations
- `usePowerBI.ts` - React hook for Power BI functionality
- `KPIsERP.tsx` - Main dashboard page with embedded reports

### Key Features

#### 🔧 PowerBIService
- Embed configuration management
- Token handling and authentication
- Event handlers for Power BI events
- Export and refresh functionality
- Error handling and recovery

#### 🎣 usePowerBI Hook
- React state management for Power BI components
- Async operations handling
- Error state management
- Loading states
- Report instance management

#### 📊 KPIsERP Dashboard
- Multi-report integration (7 business units)
- Tabbed interface with categories
- Real-time refresh controls
- Export to PDF functionality
- Responsive design for all devices
- Bilingual support (Arabic/English)

## Usage Example

```tsx
import { usePowerBI } from '../../hooks/usePowerBI';
import { PowerBIEmbed } from 'powerbi-client-react';

const MyDashboard = () => {
  const {
    getEmbedConfig,
    handleEmbedded,
    getEventHandlers,
    refreshReport
  } = usePowerBI();

  const reportConfig = {
    reportId: 'your-report-id',
    embedUrl: 'your-embed-url'
  };

  return (
    <PowerBIEmbed
      embedConfig={getEmbedConfig(reportConfig)}
      eventHandlers={getEventHandlers()}
      getEmbeddedComponent={(component) => handleEmbedded('report-id', component)}
    />
  );
};
```

## Security Notes

⚠️ **Important**: Never store access tokens or client secrets in frontend code. Always use your backend service to generate embed tokens securely.

## Integration Checklist

- [ ] Azure AD app registration completed
- [ ] API permissions configured
- [ ] Backend authentication service implemented
- [ ] Environment variables configured
- [ ] CORS policies set up
- [ ] Token refresh mechanism implemented
- [ ] Error handling tested
- [ ] Responsive design verified
- [ ] Bilingual support working

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check backend token generation
   - Verify Azure AD permissions
   - Ensure proper CORS configuration

2. **Loading Issues**
   - Verify report IDs and embed URLs
   - Check network connectivity
   - Review browser console for errors

3. **Display Problems**
   - Check responsive CSS
   - Verify container dimensions
   - Review Power BI service status

### Debug Mode

Enable debug logging:
```typescript
// In powerBIService.ts
console.log('Power BI Debug:', {
  reportId,
  embedUrl,
  hasToken: !!accessToken
});
```

## Performance Optimization

- Reports use lazy loading
- Embed tokens are cached appropriately
- Event handlers are optimized
- Responsive loading states
- Error boundaries implemented

---

For detailed setup instructions, see `POWERBI_SETUP.md` in the project root.