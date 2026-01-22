# Étape 1 : Build de l'app React
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Construit les fichiers statiques dans le dossier 'dist' (Vite par défaut)
RUN npm run build

# Étape 2 : Serveur Web Nginx
FROM nginx:alpine

# Copier le build React vers le dossier par défaut de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copier ta configuration Nginx personnalisée (si elle est à la racine de src)
# Assure-toi que ton fichier nginx.conf est bien configuré pour le SPA (Single Page App)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]