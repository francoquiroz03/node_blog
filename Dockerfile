FROM node:12-alpine

WORKDIR /home/node/app

COPY . ./

COPY .env_example ./.env

RUN npm install

EXPOSE 8000

CMD [ "npm", "start" ]
