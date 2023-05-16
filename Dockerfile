FROM node:18
MAINTAINER "livio.brunner.lb1@gmail.com"

RUN apt-get update
RUN apt-get install -y  --no-install-recommends task-spooler

RUN mkdir -p /tsp
COPY . /tsp

ENV TS_SOCKET=/tsp/tsp-queue.socket
WORKDIR /tsp

RUN npm ci
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/node", "index.js"]

