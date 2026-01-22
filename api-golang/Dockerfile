# Étape 1 : Build
FROM golang:1.21-alpine AS builder

WORKDIR /app

# IMPORTANT : Installer gcc et musl-dev pour que SQLite fonctionne
RUN apk add --no-cache gcc musl-dev

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go mod tidy

# IMPORTANT : Activer CGO pour SQLite
ENV CGO_ENABLED=1

RUN go build -o main .

# Étape 2 : Runtime
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .

EXPOSE 8080
CMD ["./main"]