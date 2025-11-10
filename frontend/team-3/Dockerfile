# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:24-alpine

WORKDIR /app

# Install a simple HTTP server to serve the built files
RUN npm install -g serve

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1003 appuser && adduser -D -u 1003 -G appuser appuser
USER appuser

EXPOSE 83

# Serve the application
CMD ["serve", "-s", "dist", "-l", "83"]

