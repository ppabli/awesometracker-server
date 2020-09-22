FROM node

WORKDIR /awesometracker.ddns.net

COPY ./awesometracker.ddns.net/client/dist ./client
COPY ./awesometracker.ddns.net/server ./server

RUN npm install

CMD ["node", "./MiBOT.js"