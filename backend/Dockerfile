FROM node:14.15.5-slim

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

RUN apt-get update && apt-get install -y libssl-dev

RUN apt-get update && apt-get install -y libcurl3

RUN yarn install

COPY . ./

EXPOSE 5000
ENTRYPOINT ["yarn", "dev"]
