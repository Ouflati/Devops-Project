# api-golang/Dockerfile
FROM golang:1.21-bullseye

WORKDIR /app

# Copy Go module files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy all source code
COPY . .



# Build the Go binary with CGO enabled
RUN CGO_ENABLED=1 go build -o api .  && ls -l /app

# Expose API port (adjust if needed)
EXPOSE 8080

# Run the binary
CMD ["./api"]
