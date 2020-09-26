FROM node

WORKDIR /awesometracker.ddns.net/

COPY ./awesometracker.ddns.net/client/dist/ ./client/
COPY ./awesometracker.ddns.net/server/ ./server/

WORKDIR /awesometracker.ddns.net/server/

RUN npm install

WORKDIR /awesometracker.ddns.net/server/src

CMD ["node", "./main.js"]