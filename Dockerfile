FROM node:18-alpine
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
RUN yarn global add @quasar/cli
COPY . .
RUN quasar build
EXPOSE 8080
# RUN quasar serve dist/spa --history -p 8080
CMD [ "quasar", "serve", "dist/spa", "--history", "-p","8080"]
