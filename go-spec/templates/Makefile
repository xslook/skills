.PHONY: all build clean test race lint vet cover tidy run help

APP_NAME ?= app
BIN_DIR ?= ./bin
MAIN_PATH ?= ./cmd/server/main.go
GO ?= go

all: lint test race build

## help: Display all available make commands
help:
	@echo "Available make commands:"
	@sed -n 's/^##//p' $(MAKEFILE_LIST) | column -t -s ':' | sed -e 's/^/ /'

## tidy: Prune and download dependencies in go.mod
tidy:
	$(GO) mod tidy
	$(GO) mod verify

## fmt: Format codebase with gofumpt
fmt:
	$(GO) run mvdan.cc/gofumpt@latest -l -w .

## vet: Run go vet static analysis
vet:
	$(GO) vet ./...

## lint: Run golangci-lint
lint:
	golangci-lint run --timeout=5m

## test: Run unit tests
test:
	$(GO) test -v ./...

## race: Run unit tests with race detection
race:
	$(GO) test -race -timeout 60s ./...

## cover: Run tests and generate coverage report
cover:
	$(GO) test -coverprofile=coverage.out -covermode=atomic ./...
	$(GO) tool cover -func=coverage.out
	@echo "Run '$(GO) tool cover -html=coverage.out' to open HTML report in browser"

## build: Compile static binary
build:
	@mkdir -p $(BIN_DIR)
	CGO_ENABLED=0 $(GO) build -ldflags="-s -w" -o $(BIN_DIR)/$(APP_NAME) $(MAIN_PATH)

## run: Run application locally
run:
	$(GO) run $(MAIN_PATH)

## clean: Remove binaries and test artifacts
clean:
	rm -rf $(BIN_DIR) coverage.out
