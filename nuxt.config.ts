// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxthub/core",
    "@nuxt/eslint",
    "@nuxt/ui",
    "nuxt-auth-utils",
    "@nuxt/test-utils/module",
    "@pinia/nuxt",
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
    "/dashboard/**": {
      ssr: false,
    },
  },
  pinia: {
    storesDirs: ["./app/stores/**"],
  },
});

