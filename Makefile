# ─────────────────────────────────────────────────────────────
# One single command students will use every day
# ─────────────────────────────────────────────────────────────
.PHONY: dev
dev:
	@echo "Starting full stack, using local SQLite (dev.db)"
	@echo "   React  → http://localhost:5173"
	@echo "   Node   → http://localhost:3000"
	@echo "   Go     → http://localhost:8080"
	@make -j4 run-client-react run-api-node run-api-golang run-postgres-sqlite

# ─────────────────────────────────────────────────────────────
# Fake target just to show a nice message (no Postgres container)
# ─────────────────────────────────────────────────────────────
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
	cd api-golang && go run main.go

.PHONY: run-client-react
run-client-react:
	@echo Starting react client
	cd client-react && npm run dev
