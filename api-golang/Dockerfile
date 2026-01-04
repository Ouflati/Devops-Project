# 🏗️ STAGE 1 — Build
FROM golang:1.22-alpine AS builder

WORKDIR /app

# dépendances nécessaires pour sqlite + build
RUN apk add --no-cache build-base sqlite

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# important : activer CGO
ENV CGO_ENABLED=1

RUN go build -o app main.go


# 🚀 STAGE 2 — Runtime léger
FROM alpine:3.20

WORKDIR /app

RUN apk add --no-cache ca-certificates sqlite

# copier le binaire
COPY --from=builder /app/app .

# créer fichier DB si absent
RUN touch dev.db

EXPOSE 8080

CMD ["./app"]
