import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.atra',
  appName: 'Atra',
  webDir: 'hosting',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    CapacitorHttp: {},
  },
};

export default config;
