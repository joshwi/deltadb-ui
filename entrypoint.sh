#!/usr/bin/env ash
export DOLLAR='$'
envsubst '$$DELTADB_HOST' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
nginx -g "daemon off;"