FROM node:lts-alpine

ENV VUE_APP_API_URL="http://<IP_ADDRESS>:8081"
ENV VUE_APP_SPOTIFY_CLIENT_ID="***"
ENV VUE_APP_SPOTIFY_CLIENT_SECRET="***"

RUN npm install -g http-server

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]