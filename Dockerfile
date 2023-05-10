FROM node:16
WORKDIR /usr/src/Lanesmash2023
COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 4000

CMD [ "node", "bin/www" ]
