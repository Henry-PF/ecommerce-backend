FROM node:16.18.0

WORKDIR /usr/src/app/backend

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3002

CMD ["node", "index.js"]