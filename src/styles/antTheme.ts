import type { ThemeConfig } from 'antd/es/config-provider/context';

export const biTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0B1E6B',  // Federal Blue
    colorInfo: '#0B1E6B',
    colorWarning: '#C88A00',  // Gold accent
    colorError: '#C62828',
    colorSuccess: '#2E7D32',
    borderRadius: 12,
    fontFamily: 'Inter, Cairo, system-ui',
  },
  components: {
    Card: { boxShadow: '0 10px 28px rgba(11,30,107,.08)' },
    Button: { controlHeight: 40, borderRadius: 12 },
    Tag: { borderRadiusSM: 12, fontSizeSM: 12 },
  }
};
