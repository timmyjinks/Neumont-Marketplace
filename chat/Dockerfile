FROM node:20

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 10101

CMD [ "node", "index.js" ]
