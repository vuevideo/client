import { getApiMiddleware } from '../utils/proxy';

export default defineEventHandler(async (event) => {
  const apiProxyMiddleware = getApiMiddleware();

  try {
    await new Promise((resolve, reject) => {
      const next = (err?: unknown) => {
        if (err) {
          console.log(err);

          reject(err);
        } else {
          resolve(true);
        }
      };

      apiProxyMiddleware(event.node.req, event.node.res, next);
    });
  } catch (error) {
    console.log(error);
  }
});

