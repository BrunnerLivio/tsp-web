install:
	go mod download

build:
	go build -o ./.bin/tsp-web ./cmd/tsp-web/tsp-web.go

dev:
	gow run cmd/tsp-web/tsp-web.go
