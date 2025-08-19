# Troubleshooting Guide

Comprehensive troubleshooting guide for the Revive Adserver MCP server with Claude Code.

## Quick Diagnostics

### Health Check Commands
```bash
# Test server compilation
npm run build

# Test server startup
npm run test

# Validate configuration
node dist/server.js --validate-config

# Check API connectivity
curl -X GET "https://your-revive-instance.com/api/health"
```

### Log Analysis
```bash
# Enable debug logging
export LOG_LEVEL=DEBUG

# Monitor real-time logs
tail -f logs/revive-mcp.log

# Search for specific errors
grep -i "error" logs/revive-mcp.log | tail -20
```

---

## Common Issues & Solutions

### 1. Server Won't Start

#### Symptom
```
Error: Cannot find module '@modelcontextprotocol/sdk'
```

#### Cause
Missing dependencies or incomplete installation.

#### Solution
```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild TypeScript
npm run build

# Verify installation
npm run test
```

#### Symptom
```
Error: ENOENT: no such file or directory, open 'dist/server.js'
```

#### Cause
TypeScript compilation failed or dist directory missing.

#### Solution
```bash
# Compile TypeScript
npm run build

# Check for compilation errors
npm run lint

# Verify output
ls -la dist/
```

---

### 2. Authentication Issues

#### Symptom
```
Error: Failed to authenticate with Revive Adserver: Invalid credentials
```

#### Cause
Incorrect API credentials or expired authentication.

#### Diagnosis
```bash
# Test credentials manually
curl -X POST "https://your-revive-instance.com/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'
```

#### Solutions

**Check Environment Variables**:
```bash
echo $REVIVE_API_URL
echo $REVIVE_API_USERNAME
# Don't echo password in production
```

**Update Credentials**:
```bash
export REVIVE_API_USERNAME="correct_username"
export REVIVE_API_PASSWORD="correct_password"
```

**Test API Access**:
```bash
# Verify API endpoint accessibility
curl -I "https://your-revive-instance.com/api/health"
```

---

### 3. Connection Problems

#### Symptom
```
Error: connect ECONNREFUSED 127.0.0.1:80
```

#### Cause
Revive server is unreachable or URL is incorrect.

#### Diagnosis
```bash
# Test network connectivity
ping your-revive-instance.com

# Test HTTPS connectivity
curl -I "https://your-revive-instance.com"

# Check DNS resolution
nslookup your-revive-instance.com
```

#### Solutions

**Verify API URL**:
```bash
# Ensure HTTPS and correct path
export REVIVE_API_URL="https://your-revive-instance.com/api"
```

**Check Firewall/Network**:
```bash
# Test from different network
curl -I "https://your-revive-instance.com/api"

# Check corporate proxy settings
export HTTPS_PROXY="http://your-proxy:8080"
```

---

### 4. Claude Code Integration Issues

#### Symptom
MCP server not appearing in Claude Code tools list.

#### Diagnosis
1. Check Claude Code MCP configuration
2. Verify server path in configuration
3. Check Claude Code logs for MCP errors

#### Solutions

**Verify MCP Configuration**:
```json
{
  "mcpServers": {
    "revive-adserver": {
      "command": "node",
      "args": ["/absolute/path/to/revive-adserver-mcp/dist/server.js"],
      "env": {
        "REVIVE_API_URL": "https://your-instance.com/api"
      }
    }
  }
}
```

**Test Server Independently**:
```bash
# Run server directly
node dist/server.js

# Should show: "Revive Adserver MCP server started"
```

**Check Permissions**:
```bash
# Ensure executable permissions
chmod +x dist/server.js

# Check file ownership
ls -la dist/server.js
```

---

### 5. API Rate Limiting

#### Symptom
```
Error: API rate limit exceeded. Please retry in 60 seconds
```

#### Cause
Too many requests to Revive API in short time period.

#### Solutions

**Configure Rate Limiting**:
```bash
export REVIVE_RETRY_DELAY=2000      # Increase delay between retries
export REVIVE_RETRY_ATTEMPTS=3      # Reduce retry attempts
export REVIVE_MAX_CONNECTIONS=5     # Limit concurrent connections
```

**Implement Request Queuing**:
```bash
# Enable request batching
export REVIVE_ENABLE_BATCHING=true
export REVIVE_BATCH_SIZE=5
export REVIVE_BATCH_TIMEOUT=1000
```

---

### 6. Memory Issues

#### Symptom
```
Error: JavaScript heap out of memory
```

#### Cause
Large datasets or memory leaks in processing.

#### Solutions

**Increase Node.js Memory**:
```bash
# In MCP configuration
{
  "command": "node",
  "args": ["--max-old-space-size=4096", "dist/server.js"]
}
```

**Enable Memory Monitoring**:
```bash
export MEMORY_MONITORING=true
export MEMORY_WARNING_THRESHOLD=80
```

**Optimize Caching**:
```bash
export MEMORY_CACHE_SIZE=50MB       # Reduce cache size
export CACHE_TTL=300               # Shorter cache TTL
```

---

### 7. Performance Issues

#### Symptom
Slow response times or timeouts.

#### Diagnosis
```bash
# Enable performance monitoring
export LOG_LEVEL=DEBUG
export METRICS_ENABLED=true

# Monitor response times
grep "duration" logs/revive-mcp.log
```

#### Solutions

**Optimize API Timeouts**:
```bash
export REVIVE_API_TIMEOUT=10000     # Reduce timeout
export REVIVE_CONNECTION_TIMEOUT=5000
```

**Enable Caching**:
```bash
export REVIVE_ENABLE_CACHE=true
export REVIVE_CACHE_TTL=900         # 15 minutes
```

**Use Connection Pooling**:
```bash
export REVIVE_MAX_CONNECTIONS=20
export REVIVE_MIN_CONNECTIONS=5
export REVIVE_CONNECTION_IDLE_TIMEOUT=30000
```

---

## Advanced Troubleshooting

### Debug Mode Setup

**Enable Full Debugging**:
```bash
export LOG_LEVEL=DEBUG
export REVIVE_DEBUG_API_REQUESTS=true
export REVIVE_DEBUG_RESPONSES=true
export REVIVE_DEBUG_AUTHENTICATION=true
export NODE_ENV=development
```

**Debug with Inspector**:
```json
{
  "mcpServers": {
    "revive-adserver-debug": {
      "command": "node",
      "args": ["--inspect=0.0.0.0:9229", "dist/server.js"],
      "env": {
        "LOG_LEVEL": "DEBUG"
      }
    }
  }
}
```

### Network Debugging

**Test API Endpoints**:
```bash
# Test authentication
curl -X POST "https://your-revive.com/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'

# Test campaign listing
curl -X GET "https://your-revive.com/api/campaigns" \
  -H "Authorization: Bearer your-token"
```

**Monitor Network Traffic**:
```bash
# Using tcpdump
sudo tcpdump -i any host your-revive-instance.com

# Using netstat
netstat -an | grep :443
```

### Database Debugging

**Check Database Connection**:
```bash
# If using database features
export REVIVE_DATABASE_HOST=localhost
export REVIVE_DATABASE_NAME=revive_db
export REVIVE_DATABASE_DEBUG=true
```

**Monitor Database Queries**:
```sql
-- Enable query logging in MySQL
SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'table';
SELECT * FROM mysql.general_log WHERE command_type = 'Query';
```

---

## Error Code Reference

### MCP Server Errors

| Code | Message | Cause | Solution |
|------|---------|-------|----------|
| 1001 | Authentication failed | Invalid API credentials | Check username/password |
| 1002 | Connection timeout | Network/server issues | Check connectivity, increase timeout |
| 1003 | Invalid request format | Malformed API request | Validate request parameters |
| 1004 | Rate limit exceeded | Too many requests | Implement rate limiting |
| 1005 | Resource not found | Invalid ID in request | Verify resource exists |
| 1006 | Permission denied | Insufficient API permissions | Check user permissions |
| 1007 | Server unavailable | Revive server down | Check server status |

### API Response Codes

| HTTP Code | Meaning | Common Causes |
|-----------|---------|---------------|
| 400 | Bad Request | Invalid parameters, malformed JSON |
| 401 | Unauthorized | Invalid or expired credentials |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Revive server issue |
| 502 | Bad Gateway | Proxy/load balancer issue |
| 503 | Service Unavailable | Server maintenance |

---

## Diagnostic Tools

### Log Analysis Scripts

**Error Summary**:
```bash
#!/bin/bash
# error-summary.sh
echo "=== Error Summary ==="
grep -c "ERROR" logs/revive-mcp.log
echo "=== Recent Errors ==="
grep "ERROR" logs/revive-mcp.log | tail -5
```

**Performance Analysis**:
```bash
#!/bin/bash
# performance-check.sh
echo "=== Average Response Times ==="
grep "duration" logs/revive-mcp.log | \
  awk '{print $NF}' | \
  sed 's/ms//' | \
  awk '{sum+=$1; count++} END {print "Average:", sum/count "ms"}'
```

### Health Check Script

```bash
#!/bin/bash
# health-check.sh

echo "=== Revive MCP Health Check ==="

# Check dependencies
echo "1. Checking Node.js version..."
node --version

# Check TypeScript compilation
echo "2. Testing TypeScript compilation..."
npm run build

# Check environment variables
echo "3. Checking environment variables..."
if [ -z "$REVIVE_API_URL" ]; then
  echo "❌ REVIVE_API_URL not set"
else
  echo "✅ REVIVE_API_URL: $REVIVE_API_URL"
fi

# Test API connectivity
echo "4. Testing API connectivity..."
if curl -s -I "$REVIVE_API_URL" >/dev/null; then
  echo "✅ API endpoint reachable"
else
  echo "❌ API endpoint unreachable"
fi

# Test server startup
echo "5. Testing server startup..."
timeout 10s npm run test >/dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Server starts successfully"
else
  echo "❌ Server startup failed"
fi

echo "=== Health Check Complete ==="
```

### Configuration Validator

```bash
#!/bin/bash
# validate-config.sh

echo "=== Configuration Validation ==="

# Required environment variables
REQUIRED_VARS=("REVIVE_API_URL" "REVIVE_API_USERNAME" "REVIVE_API_PASSWORD")

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing required variable: $var"
    exit 1
  else
    echo "✅ $var is set"
  fi
done

# Validate URL format
if [[ $REVIVE_API_URL =~ ^https?:// ]]; then
  echo "✅ REVIVE_API_URL format valid"
else
  echo "❌ REVIVE_API_URL must start with http:// or https://"
  exit 1
fi

# Test API authentication
echo "Testing API authentication..."
RESPONSE=$(curl -s -X POST "$REVIVE_API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$REVIVE_API_USERNAME\",\"password\":\"$REVIVE_API_PASSWORD\"}")

if echo "$RESPONSE" | grep -q "success.*true"; then
  echo "✅ API authentication successful"
else
  echo "❌ API authentication failed"
  echo "Response: $RESPONSE"
  exit 1
fi

echo "=== Configuration Valid ==="
```

---

## Support Escalation

### Information to Collect

Before seeking support, collect the following information:

1. **Environment Details**:
   - Node.js version: `node --version`
   - MCP server version: Check package.json
   - Operating system: `uname -a`
   - Claude Code version

2. **Configuration**:
   - MCP server configuration (sanitized)
   - Environment variables (without passwords)
   - Network setup details

3. **Error Information**:
   - Complete error messages
   - Stack traces from logs
   - Reproduction steps
   - When the issue started

4. **Logs**:
   - MCP server logs (last 50 lines)
   - Claude Code logs (if accessible)
   - Network/proxy logs if relevant

### Support Channels

1. **Technical Documentation**: Review official Revive Adserver API docs
2. **Community Forums**: Check Claude Code community for MCP issues
3. **Issue Tracking**: Submit detailed bug reports with logs
4. **Emergency Issues**: For production-critical problems, include impact assessment