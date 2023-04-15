# Build Step
FROM node:19.8.1-alpine as NODE_BUILD

WORKDIR /usr/app/client

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# Prod Step
FROM node:19.8.1-alpine as PROD

WORKDIR /usr/app/client

COPY --from=NODE_BUILD /usr/app/client/.output ./output
COPY --from=NODE_BUILD /usr/app/client/node_modules ./node_modules
COPY --from=NODE_BUILD /usr/app/client/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE ${PORT}

CMD [ "node", "./output/server/index.mjs" ]