FROM node:17-alpine3.12 AS build
WORKDIR /app
ARG PROXY_URL
ENV REACT_APP_PROXY_URL=${PROXY_URL}
COPY app/ /app
RUN npm install
RUN npm run build
FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 3000 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]