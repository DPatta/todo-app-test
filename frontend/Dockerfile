FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]

# docker-compose up --build 

# docker-compose up

#PORT DATABASE
#http://localhost:8080/

#PORT WEB
#http://localhost:3000/