FROM node:18-alpine AS drones

RUN apk add --no-cache --update \
    npm

WORKDIR /app

COPY package*.json ./

RUN npm install glob rimraf
RUN npm install

COPY . .

RUN npm run build
