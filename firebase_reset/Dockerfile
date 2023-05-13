# Build Step
FROM node:19.8.1-alpine as NODE_BUILD

WORKDIR /usr/app/script

COPY package*.json ./

RUN npm install

COPY . ./
ENV GOOGLE_APPLICATION_CREDENTIALS="/secrets/service-account.json"

CMD ["npm", "run", "delete:users"]