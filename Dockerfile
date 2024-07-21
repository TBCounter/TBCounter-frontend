FROM node:18-alpine AS build
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
RUN yarn global add @quasar/cli
COPY . .
RUN quasar build
# EXPOSE 443
# RUN quasar serve dist/spa --history -p 8080
# CMD [ "quasar", "serve", "dist/spa",  "--history", "-p","443", "--https", "-C", "/certs/cert.pem", "-K", "/certs/key.pem"  ]

FROM nginx:1.19.0 AS serve
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist/spa ./

EXPOSE 80
