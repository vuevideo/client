// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      proxyUrl: process.env.NUXT_PUBLIC_PROXY_URL || 'http://localhost:3001',
    },
  },
});

