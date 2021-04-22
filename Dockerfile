FROM node:alpine3.13

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json package-lock.json ./
RUN npm install -g npm@7.10.0
RUN npm install

COPY src ./src
COPY public ./public

CMD ["npm", "start"]