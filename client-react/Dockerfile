# syntax=docker/dockerfile:1

# Build stage
FROM node:18-bullseye-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Serve stage
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
# Use provided nginx.conf if exists
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
