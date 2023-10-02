FROM golang:1.19 AS build-stage

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . ./

RUN CGO_ENABLED=0 GOOS=linux go build -o /tsp-web ./main.go

# Run the tests in the container
FROM build-stage AS run-test-stage
RUN go test -v ./...

# Deploy the application binary into a lean image
FROM debian:stable-slim AS build-release-stage

WORKDIR /

RUN apt-get update && apt-get install -y task-spooler

COPY --from=build-stage /tsp-web /tsp-web

# USER nonroot:nonroot

EXPOSE 3000

ENTRYPOINT ["/tsp-web"]