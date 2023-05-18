export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      proxyUrl: process.env.NUXT_PUBLIC_PROXY_URL || 'http://localhost:3001',
      apiKey: process.env.API_KEY || 'AIzaSyArsOCjWRM-TJum59OPczyR-K_8EvvlV7k',
      authDomain: process.env.AUTH_DOMAIN || 'vuevideo-dev.firebaseapp.com',
      projectId: process.env.PROJECT_ID || 'vuevideo-dev',
      storageBucket: process.env.STORAGE_BUCKET || 'vuevideo-dev.appspot.com',
      messagingSenderId: process.env.MESSAGEING_SENDER_ID || '1043788695407',
      appId: process.env.APP_ID || '1:1043788695407:web:f65e4316c22193a60c0a9a',
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
