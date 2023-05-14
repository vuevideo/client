// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      proxyUrl: process.env.NUXT_PUBLIC_PROXY_URL || 'http://localhost:3001',
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGEING_SENDER_ID,
      appId: process.env.appId,
    },
  },
});
