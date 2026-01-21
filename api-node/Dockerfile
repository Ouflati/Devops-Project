# syntax=docker/dockerfile:1

FROM node:18-bullseye-slim AS base
WORKDIR /app

# Install deps first for better caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Expose port and run
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "src/index.js"]
