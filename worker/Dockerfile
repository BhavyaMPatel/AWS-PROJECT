FROM node:20.12.1-slim
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm init -y && npm install
COPY index.js index.js
COPY aws.js aws.js

CMD [ "node","index.js" ]