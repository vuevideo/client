export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const { auth } = useFirebase();

    auth.onAuthStateChanged((user) => {
      if (!user) {
        return navigateTo('/login');
      }
    });
  }
});

