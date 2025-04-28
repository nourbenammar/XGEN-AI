import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.esprit.app",
  appName: "ESPRIT",
  webDir: "out",
  server: {
    androidScheme: "file",
    iosScheme: "file",
    cleartext: true,
  },
  ios: {
    contentInset: "always",
    allowsLinkPreview: false,
    backgroundColor: "#ffffff",
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
