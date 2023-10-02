install:
	go mod download

build:
	go build -o ./.bin/tsp-web ./main.go

dev:
	gow run main.go
