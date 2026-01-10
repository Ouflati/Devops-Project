.PHONY: dev
dev:
	@echo "Starting full stack via Docker..."
	@echo "React  → http://localhost:5173"
	@echo "Node   → http://localhost:5000"
	@echo "Go     → http://localhost:8080"
	docker-compose up --build

.PHONY: down
down:
	docker-compose down

.PHONY: clean
clean:
	docker-compose down -v
	@echo "Containers and Volumes cleared."