FROM node:alpine

COPY ./app /app

WORKDIR /app

ENTRYPOINT ["npm", "start"];