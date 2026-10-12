.PHONY: all check build clean test race lint vet cover tidy run help fix fmt vuln

APP_NAME ?= app
BIN_DIR ?= ./bin
MAIN_PATH ?= ./cmd/server
GO ?= go

# Tool dependencies are pinned in go.mod via the `tool` directive (Go 1.24+), e.g.:
#   go get -tool golang.org/x/vuln/cmd/govulncheck@latest
# golangci-lint is installed as a standalone binary (its recommended install method):
#   https://golangci-lint.run/docs/welcome/install/

all: check build

## check: Full quality gate (same order as CI)
check: tidy fix fmt vet lint race vuln

## help: Display all available make commands
help:
	@echo "Available make commands:"
	@sed -n 's/^##//p' $(MAKEFILE_LIST) | column -t -s ':' | sed -e 's/^/ /'

## tidy: Prune dependencies and verify module checksums
tidy:
	$(GO) mod tidy
	$(GO) mod verify

## fix: Rewrite code to modern idioms and APIs (Go 1.26+ modernizers); run before fmt
fix:
	$(GO) fix ./...

## fmt: Format code with the formatters configured in .golangci.yml (gofumpt + goimports)
fmt:
	golangci-lint fmt

## vet: Run go vet static analysis
vet:
	$(GO) vet ./...

## lint: Run golangci-lint
lint:
	golangci-lint run

## test: Run unit tests
test:
	$(GO) test ./...

## race: Run unit tests with race detection and shuffled order
race:
	$(GO) test -race -shuffle=on -timeout 5m ./...

## vuln: Scan for known reachable vulnerabilities
vuln:
	$(GO) tool govulncheck ./...

## cover: Run tests and generate coverage report
cover:
	$(GO) test -coverprofile=coverage.out -covermode=atomic ./...
	$(GO) tool cover -func=coverage.out
	@echo "Run '$(GO) tool cover -html=coverage.out' to open HTML report in browser"

## build: Compile static, reproducible binary
build:
	@mkdir -p $(BIN_DIR)
	CGO_ENABLED=0 $(GO) build -trimpath -ldflags="-s -w" -o $(BIN_DIR)/$(APP_NAME) $(MAIN_PATH)

## run: Run application locally
run:
	$(GO) run $(MAIN_PATH)

## clean: Remove binaries and test artifacts
clean:
	rm -rf $(BIN_DIR) coverage.out
