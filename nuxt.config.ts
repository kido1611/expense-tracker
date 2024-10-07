// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxthub/core", "@nuxt/eslint", "@nuxt/ui", "nuxt-auth-utils"],
  future: {
    compatibilityVersion: 4,
  },
  hub: {
    blob: true,
    database: true,
  },
  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 24, // 2 Hours
    },
  },
  colorMode: {
    preference: "dark",
  },
});
