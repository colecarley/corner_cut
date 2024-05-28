FROM node:20

WORKDIR /corner_cut

COPY . .
COPY package*.json ./

RUN npm install 

EXPOSE 3000

CMD ["node", "src", "index.js"]