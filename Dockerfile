FROM node:alpine

COPY ./app /app

WORKDIR /app

ENTRYPOINT ["docker-entrypoint.sh"];