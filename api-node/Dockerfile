# Utiliser une image légère de Node
FROM node:18-alpine

# Créer le dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
# --production permet d'éviter d'installer les dépendances de dev (comme jest)
RUN npm install --production

# Copier le reste du code source
COPY . .

# Exposer le port (par défaut 3000 pour Express souvent)
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]