import { Credentials } from '~/utils/models/credentials.model';

const user = ref<Credentials | null>(null);
const loading = ref<boolean>(true);

export const useUser = () => {
  const status = (load: boolean) => {
    loading.value = load;
  };

  const set = (setUser: Credentials) => {
    user.value = setUser;
  };

  const clear = () => {
    user.value = null;
  };

  return {
    user,
    loading,
    status,
    set,
    clear,
  };
};

