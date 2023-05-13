FROM node:19.8.1-alpine as NODE_BUILD

WORKDIR /usr/app/script

COPY package*.json ./

RUN npm install

COPY . ./

ENV BACKEND_URL="http://vuevideo_server:3000"

CMD ["npm", "run", "add:users"]