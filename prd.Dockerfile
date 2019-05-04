FROM nginx AS base
RUN rm /usr/share/nginx/html/index.html /etc/nginx/conf.d/default.conf
COPY base/docker/ /
EXPOSE 80

FROM node:10-alpine AS core
RUN apk update && \
    apk add --no-cache make python && \
    apk add --virtual  build-dependencies build-base gcc && \
    python -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip install --upgrade pip setuptools && \
    mkdir /app && mkdir /app/bin
WORKDIR /app
COPY package-core.json package.json
ENV NODE_ENV=development
# node_modules for core & cleanup
RUN npm install && \
    apk del build-dependencies && \
    rm -r /root/.cache && \
    rm -rf /var/cache/apk/*
ENV PATH /app/node_modules/.bin:$PATH

FROM core AS package
COPY package.json package.json
RUN npm install
ENV NODE_ENV=production
ENV DEV_ENV=docker

FROM package AS publish
COPY ./ .
RUN npm run build:prd

FROM base AS final
COPY --from=publish /app/bin/prd/ /usr/share/nginx/html/
RUN mv /usr/share/nginx/html/config.js /config-template.js && cat /config-template.js
CMD ["./startup.sh"]