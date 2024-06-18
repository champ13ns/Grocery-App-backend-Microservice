FROM node:16-alpine

WORKDIR /src

COPY . .

RUN npm install

EXPOSE 8000

CMD [ "node", "src/index.js" ]