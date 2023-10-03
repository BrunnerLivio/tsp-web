install:
	go mod download

build:
	go build -o ./.bin/tsp-web ./main.go

dev:
	gow -e=go,mod,html,css,js run main.go
