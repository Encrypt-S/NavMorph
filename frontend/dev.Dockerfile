FROM node:8.9.4-alpine

RUN mkdir -p /app
WORKDIR /app

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN npm install -g @angular/cli

EXPOSE 4200/tcp

CMD ["/bin/bash"]
