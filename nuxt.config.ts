// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxthub/core",
    "@nuxt/ui",
    "nuxt-auth-utils",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "nuxt-security",
  ],
  future: {
    compatibilityVersion: 4,
  },
  hub: {
    blob: true,
    database: true,
  },
  nitro: {
    experimental: {
      openAPI: true,
    },
  },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    session: {
      password: "", // change value in env NUXT_SESSION_PASSWORD
      maxAge: 60 * 60 * 24, // 2 Hours
    },
  },
  colorMode: {
    preference: "dark",
  },
  routeRules: {
    "/": {
      redirect: "/dashboard",
    },
    "/dashboard/**": {
      ssr: false,
    },
  },
  pinia: {
    storesDirs: ["./app/stores/**"],
  },
  security: {
    headers: {
      contentSecurityPolicy: {
        "img-src": ["'self'", "data:", "https://ui-avatars.com"],
      },
    },
  },
});
