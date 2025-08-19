# MCP Server Configuration Guide

Detailed configuration instructions for the Revive Adserver MCP server with Claude Code.

## Configuration Methods

### Method 1: Claude Code Settings UI
1. Open Claude Code
2. Navigate to Settings → MCP Servers
3. Add new server configuration:
   - **Name**: `revive-adserver`
   - **Command**: `node`
   - **Args**: `["/absolute/path/to/revive-adserver-mcp/dist/server.js"]`
   - **Environment Variables**: See environment section below

### Method 2: MCP Configuration File
Create or edit `.mcp.json` in your project directory:
```json
{
  "mcpServers": {
    "revive-adserver": {
      "command": "node",
      "args": ["/absolute/path/to/revive-adserver-mcp/dist/server.js"],
      "env": {
        "REVIVE_API_URL": "https://your-revive-instance.com/api",
        "REVIVE_API_USERNAME": "your_username",
        "REVIVE_API_PASSWORD": "your_password",
        "LOG_LEVEL": "INFO"
      }
    }
  }
}
```

### Method 3: Claude Code CLI Configuration
```bash
claude-code config add-mcp-server revive-adserver \
  --command node \
  --args "/path/to/revive-adserver-mcp/dist/server.js" \
  --env REVIVE_API_URL=https://your-revive.com/api \
  --env REVIVE_API_USERNAME=username \
  --env REVIVE_API_PASSWORD=password
```

## Environment Variables

### Required Variables
```bash
# Revive Adserver API endpoint
REVIVE_API_URL="https://your-revive-instance.com/api"

# API authentication credentials
REVIVE_API_USERNAME="your_api_username"
REVIVE_API_PASSWORD="your_api_password"
```

### Optional Variables
```bash
# Database connection (for advanced features)
REVIVE_DATABASE_HOST="localhost"
REVIVE_DATABASE_NAME="revive_adserver"
REVIVE_DATABASE_USER="revive_user"
REVIVE_DATABASE_PASSWORD="db_password"

# Logging configuration
LOG_LEVEL="INFO"  # DEBUG, INFO, WARN, ERROR

# API client configuration
REVIVE_API_TIMEOUT="30000"        # Request timeout (ms)
REVIVE_RETRY_ATTEMPTS="3"         # Number of retry attempts
REVIVE_RETRY_DELAY="1000"         # Initial retry delay (ms)

# Connection pool settings
REVIVE_MAX_CONNECTIONS="10"       # Maximum concurrent connections
REVIVE_POOL_TIMEOUT="30000"       # Connection pool timeout (ms)

# Cache configuration
REVIVE_CACHE_TTL="900"            # Cache TTL in seconds (15 minutes)
REVIVE_ENABLE_CACHE="true"        # Enable response caching
```

## Security Considerations

### Credential Management
1. **Never commit credentials to version control**
2. Use environment variables or secure credential stores
3. Consider using API tokens instead of passwords when available
4. Rotate credentials regularly

### Network Security
```bash
# Use HTTPS for API endpoints
REVIVE_API_URL="https://revive.example.com/api"  # ✅ Secure
REVIVE_API_URL="http://revive.example.com/api"   # ❌ Insecure

# Consider VPN or private network access for production
REVIVE_API_URL="https://internal-revive.company.local/api"
```

### Access Control
```bash
# Create dedicated API user with minimal permissions
REVIVE_API_USERNAME="mcp_integration_user"

# Use read-only credentials for reporting-only scenarios
REVIVE_READONLY_MODE="true"
```

## Environment-Specific Configurations

### Development Environment
```json
{
  "mcpServers": {
    "revive-adserver-dev": {
      "command": "npm",
      "args": ["run", "dev"],
      "cwd": "/path/to/revive-adserver-mcp",
      "env": {
        "REVIVE_API_URL": "https://dev-revive.example.com/api",
        "REVIVE_API_USERNAME": "dev_user",
        "REVIVE_API_PASSWORD": "dev_password",
        "LOG_LEVEL": "DEBUG"
      }
    }
  }
}
```

### Staging Environment
```json
{
  "mcpServers": {
    "revive-adserver-staging": {
      "command": "node",
      "args": ["/path/to/dist/server.js"],
      "env": {
        "REVIVE_API_URL": "https://staging-revive.example.com/api",
        "REVIVE_API_USERNAME": "staging_user",
        "REVIVE_API_PASSWORD": "staging_password",
        "LOG_LEVEL": "INFO",
        "REVIVE_CACHE_TTL": "300"
      }
    }
  }
}
```

### Production Environment
```json
{
  "mcpServers": {
    "revive-adserver-prod": {
      "command": "node",
      "args": ["/path/to/dist/server.js"],
      "env": {
        "REVIVE_API_URL": "https://revive.example.com/api",
        "REVIVE_API_USERNAME": "prod_mcp_user",
        "REVIVE_API_PASSWORD": "secure_production_password",
        "LOG_LEVEL": "WARN",
        "REVIVE_MAX_CONNECTIONS": "20",
        "REVIVE_CACHE_TTL": "600",
        "REVIVE_ENABLE_CACHE": "true"
      }
    }
  }
}
```

## Docker Configuration

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --production

COPY dist/ ./dist/
COPY CLAUDE.md README.md ./

EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  revive-mcp:
    build: .
    environment:
      - REVIVE_API_URL=https://revive.example.com/api
      - REVIVE_API_USERNAME=mcp_user
      - REVIVE_API_PASSWORD=secure_password
      - LOG_LEVEL=INFO
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
```

### Claude Code with Docker
```json
{
  "mcpServers": {
    "revive-adserver": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "--env-file", ".env.revive",
        "revive-mcp:latest"
      ]
    }
  }
}
```

## Load Balancing & High Availability

### Multiple Instance Configuration
```json
{
  "mcpServers": {
    "revive-adserver-primary": {
      "command": "node",
      "args": ["/path/to/dist/server.js"],
      "env": {
        "REVIVE_API_URL": "https://revive-primary.example.com/api",
        "REVIVE_API_USERNAME": "primary_user",
        "REVIVE_API_PASSWORD": "primary_password"
      }
    },
    "revive-adserver-secondary": {
      "command": "node",
      "args": ["/path/to/dist/server.js"],
      "env": {
        "REVIVE_API_URL": "https://revive-secondary.example.com/api",
        "REVIVE_API_USERNAME": "secondary_user",
        "REVIVE_API_PASSWORD": "secondary_password"
      }
    }
  }
}
```

### Health Check Configuration
```bash
# Enable health check endpoint
REVIVE_HEALTH_CHECK_ENABLED="true"
REVIVE_HEALTH_CHECK_INTERVAL="30000"  # 30 seconds
REVIVE_HEALTH_CHECK_TIMEOUT="5000"    # 5 seconds
```

## Monitoring & Observability

### Structured Logging
```bash
# Enable structured JSON logging
LOG_FORMAT="json"
LOG_CORRELATION_ID="true"

# Log rotation
LOG_MAX_SIZE="10MB"
LOG_MAX_FILES="5"
```

### Metrics Collection
```bash
# Enable metrics collection
METRICS_ENABLED="true"
METRICS_PORT="9090"
METRICS_PATH="/metrics"

# Custom metrics
METRICS_COLLECT_API_LATENCY="true"
METRICS_COLLECT_CACHE_STATS="true"
```

### Tracing
```bash
# OpenTelemetry configuration
OTEL_EXPORTER_OTLP_ENDPOINT="https://your-otel-collector.com"
OTEL_SERVICE_NAME="revive-adserver-mcp"
OTEL_SERVICE_VERSION="1.0.0"
```

## Troubleshooting Configuration

### Debug Mode
```json
{
  "mcpServers": {
    "revive-adserver-debug": {
      "command": "node",
      "args": ["--inspect=0.0.0.0:9229", "/path/to/dist/server.js"],
      "env": {
        "LOG_LEVEL": "DEBUG",
        "NODE_ENV": "development"
      }
    }
  }
}
```

### Verbose Logging
```bash
# Enable maximum verbosity
LOG_LEVEL="DEBUG"
REVIVE_DEBUG_API_REQUESTS="true"
REVIVE_DEBUG_RESPONSES="true"
REVIVE_DEBUG_AUTHENTICATION="true"
```

### Connection Testing
```bash
# Test configuration without Claude Code
node dist/server.js --test-connection
```

## Performance Optimization

### Caching Configuration
```bash
# Redis cache (optional)
REDIS_URL="redis://localhost:6379"
REDIS_KEY_PREFIX="revive_mcp:"
REDIS_TTL="900"

# In-memory cache
MEMORY_CACHE_SIZE="100MB"
MEMORY_CACHE_TTL="300"
```

### Connection Pooling
```bash
# Optimize for high throughput
REVIVE_MAX_CONNECTIONS="50"
REVIVE_MIN_CONNECTIONS="5"
REVIVE_CONNECTION_IDLE_TIMEOUT="30000"
REVIVE_CONNECTION_ACQUIRE_TIMEOUT="10000"
```

### Request Optimization
```bash
# Batch requests when possible
REVIVE_ENABLE_BATCHING="true"
REVIVE_BATCH_SIZE="10"
REVIVE_BATCH_TIMEOUT="100"

# Compression
REVIVE_ENABLE_COMPRESSION="true"
REVIVE_COMPRESSION_LEVEL="6"
```

## Configuration Validation

### Startup Validation
The server performs comprehensive configuration validation on startup:

1. **Environment Variables**: Verifies all required variables are set
2. **API Connectivity**: Tests connection to Revive Adserver
3. **Authentication**: Validates API credentials
4. **Permissions**: Checks API user permissions
5. **Tool Registration**: Verifies all tools are properly registered

### Configuration Schema
```json
{
  "type": "object",
  "required": ["REVIVE_API_URL", "REVIVE_API_USERNAME", "REVIVE_API_PASSWORD"],
  "properties": {
    "REVIVE_API_URL": {
      "type": "string",
      "format": "uri",
      "pattern": "^https://"
    },
    "REVIVE_API_USERNAME": {
      "type": "string",
      "minLength": 1
    },
    "REVIVE_API_PASSWORD": {
      "type": "string",
      "minLength": 8
    },
    "LOG_LEVEL": {
      "type": "string",
      "enum": ["DEBUG", "INFO", "WARN", "ERROR"]
    }
  }
}
```

### Health Check Endpoint
Access `http://localhost:3000/health` to verify configuration:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "revive_connection": "connected",
  "tools_registered": 9,
  "uptime": "00:05:23"
}
```