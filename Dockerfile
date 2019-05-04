FROM node:10-alpine
RUN apk update && \
    apk add --no-cache make python && \
    apk add --virtual  build-dependencies build-base gcc && \
    python -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip install --upgrade pip setuptools && \
    mkdir /app
WORKDIR /app
# core-node_modules
COPY package-core.json package.json
RUN npm install
# full-node_modules & cleanup
COPY package.json package.json
RUN npm install && \
    apk del build-dependencies && \
    rm -r /root/.cache && \
    rm -rf /var/cache/apk/*
# map app source & exclude node_modules from mapping
VOLUME [ "/app", "/app/node_modules" ]
EXPOSE 80
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV=development
ENV DEV_ENV=docker
ENV CHOKIDAR_USEPOLLING=true
# start app
CMD [ "npm", "run", "start:dev:docker" ]