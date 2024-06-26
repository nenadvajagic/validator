help: ## Prints help for targets with comments
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

build: ## Builds docker stack
	mkdir -p node_modules
	docker compose -f docker-compose.yml build

up: ## Brings Docker stack up
	mkdir -p node_modules
	docker compose up -d -V --force-recreate

down: ## Brings Docker stack down
	docker compose down --remove-orphans

build-ci: ## Builds ci docker stack
	docker compose -f docker-compose.ci.yml build

up-ci: ## Brings ci docker stack up
	docker compose -f docker-compose.ci.yml up -d

down-ci: ## Brings ci docker stack down
	docker compose -f docker-compose.ci.yml down

node-sh: ## Opens shell inside running node container
	docker exec -it octo_validator_backend sh

console:
	docker exec -it octo_validator_backend sh -c "npm run console $(filter-out $@,$(MAKECMDGOALS))"

fix: ## Runs all auto fixes
	docker exec -it octo_validator_backend sh -c "npm run fix"

fix-staged: ## Runs all auto fixes
	docker exec octo_validator_backend sh -c "npm run fix:staged:docker"

test: ## Runs all tests
	docker exec -it octo_validator_backend sh -c "npm run test"

test-coverage: ## Runs all tests with coverage
	docker exec -it octo_validator_backend sh -c "npm run test:coverage"