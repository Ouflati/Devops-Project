# ========= BUILD =========
FROM golang:1.23-alpine AS builder

RUN apk update && apk add --no-cache gcc musl-dev sqlite-dev

ENV CGO_ENABLED=1


WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o api

# ========= RUN =========
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/api .

EXPOSE 8080

CMD ["./api"]
