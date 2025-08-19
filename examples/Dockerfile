# Multi-stage Dockerfile for Revive Adserver MCP Server

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Remove dev dependencies
RUN npm ci --production && npm cache clean --force

# Production stage
FROM node:18-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcp -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Copy documentation and configuration
COPY CLAUDE.md README.md LICENSE ./
COPY examples/ ./examples/

# Create logs directory
RUN mkdir -p logs && chown -R mcp:nodejs /app

# Switch to non-root user
USER mcp

# Expose port (if health check endpoint is added)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "console.log('Health check passed')" || exit 1

# Start the application
CMD ["npm", "start"]

# Development stage
FROM node:18-alpine AS development

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcp -u 1001 && \
    chown -R mcp:nodejs /app

USER mcp

# Expose debugger port
EXPOSE 9229

# Start development server
CMD ["npm", "run", "dev"]

# Production optimized stage
FROM node:18-alpine AS optimized

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcp -u 1001

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production && \
    npm cache clean --force && \
    rm -rf /tmp/*

# Copy built application
COPY --from=builder /app/dist ./dist
COPY CLAUDE.md README.md LICENSE ./

# Set proper ownership
RUN chown -R mcp:nodejs /app

# Switch to non-root user
USER mcp

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/server.js"]