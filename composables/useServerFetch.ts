import type { UseFetchOptions } from 'nuxt/app';

export const useServerFetch = <DataT>(
  url: string,
  options?: UseFetchOptions<DataT>
) => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.proxyUrl;

  return useFetch(`${baseUrl}${url}`, options);
};

