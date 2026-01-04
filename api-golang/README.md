Voici la version mise à jour de votre fichier **README.md**, incluant la section Docker, tout en conservant une structure professionnelle et sans aucun emoji.

---

# Calendar API - Go + Gin + SQLite

Cette API REST permet de gérer un calendrier d'événements. Elle est développée en Go avec le framework Gin et utilise SQLite pour le stockage des données.

## Fonctionnalités

L'API permet d'effectuer les opérations CRUD complètes sur les événements :
- Création d'événements
- Lecture (liste complète ou par identifiant unique)
- Modification d'événements existants
- Suppression d'événements

---

## Installation et Lancement

### Prérequis
- Go (version 1.18 ou supérieure)
- Docker (optionnel)

### Lancement local
1. Installer les dépendances :
```bash
go mod download
```

2. Démarrer l'API :
```bash
go run main.go
```
Par défaut, l'API est accessible sur : `http://localhost:8080`

### Lancement avec Docker

**Build de l'image :**
```bash
docker build -t calendar-api .
```

**Lancement du conteneur :**
```bash
docker run -p 8080:8080 --name calendar-container calendar-api
```

**Arrêt du conteneur :**
```bash
docker stop calendar-container
```

**Suppression du conteneur :**
```bash
docker rm calendar-container
```

---

## Documentation des Endpoints

### Santé de l'API
Vérifier que le service est opérationnel.

**GET /**

Exemple de réponse :
```json
{
  "api": "golang",
  "now": "2026-01-04T10:30:00Z"
}
```

### Gestion du Calendrier

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /calendar | Récupérer tous les événements |
| GET | /calendar/:id | Récupérer un événement par son ID |
| POST | /calendar | Créer un nouvel événement |
| PUT | /calendar/:id | Modifier un événement existant |
| DELETE | /calendar/:id | Supprimer un événement |

---

## Détails des Requêtes

### Créer un événement
**POST /calendar**

En-têtes : `Content-Type: application/json`

Corps de la requête :
```json
{
  "title": "Cours DevOps",
  "description": "Chapitre Docker",
  "start_date": "2026-01-10",
  "end_date": "2026-01-11",
  "user_id": 1
}
```

---

## Validation et Gestion des Erreurs

L'API applique les règles de validation suivantes :

- **title** : Obligatoire (minimum 3 caractères).
- **start_date** : Obligatoire.
- **end_date** : Obligatoire.
- **user_id** : Obligatoire.
- **Logique** : La date de début (start_date) doit être chronologiquement antérieure à la date de fin (end_date).

En cas d'erreur, l'API retourne un code HTTP 400 avec le format suivant :
```json
{
  "error": "invalid fields",
  "details": "..."
}
```

---

## Base de données

L'API utilise SQLite. Le fichier de base de données est généré automatiquement lors du premier lancement.

- **Fichier** : `dev.db`
- **Table** : `calendar`