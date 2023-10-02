export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      proxyUrl: process.env.NUXT_PUBLIC_PROXY_URL,
      apiKey: process.env.NUXT_PUBLIC_API_KEY,
      authDomain: process.env.NUXT_PUBLIC_AUTH_DOMAIN,
      projectId: process.env.NUXT_PUBLIC_PROJECT_ID,
      storageBucket: process.env.NUXT_PUBLIC_STORAGE_BUCKET,
      messagingSenderId: process.env.NUXT_PUBLIC_MESSAGING_SENDER_ID,
      appId: process.env.NUXT_PUBLIC_APP_ID,
    },
  },
  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
});
