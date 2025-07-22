# Use your compose file explicitly
COMPOSE_FILE=compose.yaml

# Build the Docker images (primarily for your express service)
build:
	docker-compose -f $(COMPOSE_FILE) build

# Start services in detached mode
up:
	docker-compose -f $(COMPOSE_FILE) up -d

# Stop services but keep volumes
down:
	docker-compose -f $(COMPOSE_FILE) down

# Stop services and remove volumes (clean)
clean:
	docker-compose -f $(COMPOSE_FILE) down -v

# Open an interactive cqlsh terminal in Cassandra container
cqlsh:
	docker-compose -f $(COMPOSE_FILE) exec cassandra cqlsh

# Tail logs of all services
logs:
	docker-compose -f $(COMPOSE_FILE) logs -f

.PHONY: build up down clean cqlsh logs
