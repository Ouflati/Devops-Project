# ─────────────────────────────────────────────────────────────
#  1. DEV: Mode développement (Hot reload)
# ─────────────────────────────────────────────────────────────
.PHONY: dev
dev: prepare
	@echo "Starting full stack, using local SQLite (dev.db)"
	@echo "   React  → http://localhost:5173"
	@echo "   Node   → http://localhost:3000"
	@echo "   Go     → http://localhost:8080"
	@make -j4 run-client-react run-api-node run-api-golang run-sqlite

# --- Sous-tâches pour DEV ---

.PHONY: run-sqlite
run-sqlite:
	@echo "SQLite database → ./dev.db (auto-created, git-ignored)"

.PHONY: run-api-node
run-api-node:
	@echo Starting node api
	cd api-node && npm run dev

.PHONY: run-api-golang
run-api-golang:
	@echo Starting golang api
	@# Fix Windows: on active CGO avant le run
	cd api-golang && go env -w CGO_ENABLED=1 && go run main.go

.PHONY: run-client-react
run-client-react:
	@echo Starting react client
	cd client-react && npm run dev


# ─────────────────────────────────────────────────────────────
#  2. INSTALL: Installe toutes les dépendances
# ─────────────────────────────────────────────────────────────
.PHONY: install
install:
	@echo "Installation des dépendances pour Node, React et Go..."
	@make -j3 install-api-node install-client-react install-api-golang
	@echo "Terminé ! Tout est installé."

# --- Sous-tâches pour INSTALL ---

.PHONY: install-api-node
install-api-node:
	@echo "Installation modules Node..."
	cd api-node && npm install

.PHONY: install-client-react
install-client-react:
	@echo "Installation modules React..."
	cd client-react && npm install

.PHONY: install-api-golang
install-api-golang:
	@echo "Téléchargement modules Go..."
	cd api-golang && go mod download


# ─────────────────────────────────────────────────────────────
#  3. BUILD: Construit la version Production (Optimisée)
# ─────────────────────────────────────────────────────────────
.PHONY: build
build: clean
	@echo "Construction pour la Production..."
	@make -j2 build-react build-go
	@echo "Build terminé."

# --- Sous-tâches pour BUILD ---

.PHONY: build-react
build-react:
	@echo " [React] Construction du dossier dist..."
	cd client-react && npm run build

.PHONY: build-go
build-go:
	@echo " [Go] Compilation en .exe..."
	cd api-golang && go env -w CGO_ENABLED=1 && go build -o main.exe main.go


# ─────────────────────────────────────────────────────────────
#  4. START: Lance la version Production
# ─────────────────────────────────────────────────────────────
.PHONY: start
start:
	@echo "Démarrage en mode PRODUCTION..."
	@echo "   React (Preview) → http://localhost:4173"
	@make -j3 start-react-prod start-node-prod start-go-prod

# --- Sous-tâches pour START ---

.PHONY: start-react-prod
start-react-prod:
	cd client-react && npm run preview

.PHONY: start-node-prod
start-node-prod:
	cd api-node && node src/index.js

.PHONY: start-go-prod
start-go-prod:
	cd api-golang && ./main.exe


# ─────────────────────────────────────────────────────────────
#  UTILITAIRES (Clean, Restart, Status)
# ─────────────────────────────────────────────────────────────

.PHONY: clean
clean:
	@echo "Nettoyage du projet..."
	-rm -rf client-react/dist
	-rm -f dev.db
	-rm -f api-golang/main.exe
	@echo "Nettoyage terminé."

.PHONY: restart
restart: clean dev

.PHONY: status
status:
	@echo "Vérification des ports (3000, 8080, 5173)..."
	netstat -an | findstr "3000 8080 5173"
# ─────────────────────────────────────────────────────────────
#  0. PRÉPARATION AUTOMATIQUE (ENV + DATABASE)
#  - Vérifie que le fichier .env existe
#  - Lance la migration SQLite (création des tables)
# ─────────────────────────────────────────────────────────────

.PHONY: prepare
prepare: check-env migrate-db
	@echo "Préparation terminée (env + database OK)"

# Vérifie que le fichier .env existe
.PHONY: check-env
check-env:
	@if [ ! -f api-node/.env ]; then \
		echo "❌ ERREUR: api-node/.env manquant"; \
		echo "➡️  Crée le fichier api-node/.env avant de continuer"; \
		exit 1; \
	else \
		echo "✅ .env trouvé"; \
	fi

# Lance la migration SQLite (création des tables)
.PHONY: migrate-db
migrate-db:
	@echo "🗄️ Création des tables SQLite"
	cd api-node && node src/database/migrate.js



