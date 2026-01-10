# api-node/Dockerfile
FROM node:20-bullseye

WORKDIR /app

# Install build tools for sqlite3
RUN apt-get update && apt-get install -y python3 g++ make

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]

