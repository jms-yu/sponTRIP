import type { ExpoConfig, ConfigContext } from "expo/config";

/**
 * Dynamic Expo config. Reads EXPO_PUBLIC_ENV to select bundle
 * id/scheme/name per tier (dev/stage/prod), per .spark/environment.md's
 * three-tier mobile recipe. EAS build profiles (eas.json) set
 * EXPO_PUBLIC_ENV per profile so this file needs no separate flag.
 *
 * IMPORTANT: only EXPO_PUBLIC_* variables may be referenced here for
 * anything that ends up in the built app — see
 * ci/scripts/check-bundle-keys.ts (SEC-3), which fails CI if a
 * SERVICE/SECRET-named var is ever exposed this way.
 */

type Env = "dev" | "stage" | "prod";

function resolveEnv(): Env {
  const raw = process.env.EXPO_PUBLIC_ENV;
  if (raw === "stage" || raw === "prod") return raw;
  return "dev";
}

const ENV = resolveEnv();

const APP_NAME: Record<Env, string> = {
  dev: "SponTRIP (Dev)",
  stage: "SponTRIP (Staging)",
  prod: "SponTRIP",
};

const BUNDLE_ID: Record<Env, string> = {
  dev: "com.sponTRIP.app.dev",
  stage: "com.sponTRIP.app.stage",
  prod: "com.sponTRIP.app",
};

const SCHEME: Record<Env, string> = {
  dev: "sponTRIP-dev",
  stage: "sponTRIP-stage",
  prod: "sponTRIP",
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME[ENV],
  slug: "sponTRIP",
  scheme: SCHEME[ENV],
  version: "0.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic", // M1's SHELL-4 (dark mode) needs OS-driven light/dark support wired at the app config level from the start
  ios: {
    supportsTablet: true,
    bundleIdentifier: BUNDLE_ID[ENV],
  },
  android: {
    package: BUNDLE_ID[ENV],
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: "./assets/favicon.png",
    bundler: "metro",
  },
  extra: {
    sponTRIPEnv: ENV,
  },
  plugins: ["@sentry/react-native"],
});
