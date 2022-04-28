FROM node:14-alpine AS build
WORKDIR /app
ARG AUTH0_SERVICE_HOST
ARG AUTH0_CLIENT_ID
ENV REACT_APP_AUTH0_SERVICE_HOST=${AUTH0_SERVICE_HOST}
ENV REACT_APP_AUTH0_CLIENT_ID=${AUTH0_CLIENT_ID}
COPY app/ /app
RUN npm install --silent
RUN npm run build
FROM nginx:alpine
COPY ./entrypoint.sh ./entrypoint.sh
RUN chmod 755 ./entrypoint.sh
COPY nginx/nginx.conf.template /etc/nginx/nginx.conf.template
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80 443
CMD ["./entrypoint.sh"]