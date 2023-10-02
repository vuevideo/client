import { createProxyMiddleware } from 'http-proxy-middleware';

export const getApiMiddleware = (): any => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.proxyUrl;

  const options = {
    target: baseUrl,
    changeOrigin: true,
    ws: true,
    logger: console,
  };

  return createProxyMiddleware(options);
};
