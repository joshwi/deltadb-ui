FROM node:14-alpine AS build
WORKDIR /app
ARG PROXY_URL
ARG AUTH0_SERVICE_HOST
ARG AUTH0_CLIENT_ID
ARG MAPBOX_API_KEY
ENV REACT_APP_PROXY_URL=${PROXY_URL}
ENV REACT_APP_AUTH0_SERVICE_HOST=${AUTH0_SERVICE_HOST}
ENV REACT_APP_AUTH0_CLIENT_ID=${AUTH0_CLIENT_ID}
ENV  REACT_APP_MAPBOX_API_KEY=${MAPBOX_API_KEY}
COPY app/ /app
RUN npm install --silent
RUN npm run build
FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 3000 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]