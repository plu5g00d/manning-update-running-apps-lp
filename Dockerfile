FROM mhart/alpine-node:14.17.3 As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

#RUN npm run build

CMD ["node", "app.js"] 