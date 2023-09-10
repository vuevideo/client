import { getUser } from '~/utils/modules/user/service';

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const { auth } = useFirebase();

    const { status, set, clear } = useUser();

    status(true);

    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        clear();
        status(false);
        return navigateTo('/login');
      } else {
        const serverUser = await getUser();
        set(serverUser.data!);
        status(false);
        return navigateTo(to);
      }
    });
  }
});