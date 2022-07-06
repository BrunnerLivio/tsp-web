FROM ubuntu:16.04
MAINTAINER "keller.eric@gmail.com"

RUN apt-get update
RUN apt-get install -y  --no-install-recommends task-spooler nodejs nodejs-legacy npm

RUN mkdir -p /tsp
COPY . /tsp

ENV TS_SOCKET=/tsp/tsp-queue.socket
WORKDIR /tsp

RUN npm install
EXPOSE 3000
ENTRYPOINT ["/usr/bin/node", "index.js"]

