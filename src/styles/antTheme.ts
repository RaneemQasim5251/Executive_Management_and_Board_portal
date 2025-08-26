import type { ThemeConfig } from 'antd/es/config-provider/context';

export const biTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0B1E6B',          // Federal Blue
    colorInfo: '#0B1E6B',
    colorTextBase: '#0F172A',
    colorTextSecondary: '#64748B',
    colorBgBase: '#FFFFFF',
    colorBorder: 'rgba(2, 6, 23, .08)',
    colorFillSecondary: 'rgba(11,30,107,.06)',
    borderRadius: 14,
    fontFamily: "Inter, 'Cairo', system-ui, -apple-system, Segoe UI, Roboto",
    boxShadow: '0 10px 28px rgba(11,30,107,.08)'
  },
  components: {
    Card: { 
      borderRadiusLG: 16, 
      boxShadow: '0 12px 32px rgba(2, 6, 23, .08)' 
    },
    Button: { controlHeight: 40, borderRadius: 12, fontWeight: 600 },
    Tag: { borderRadiusSM: 999, fontSizeSM: 12 },
    Tabs: { titleFontSizeLG: 16 }
  }
};
