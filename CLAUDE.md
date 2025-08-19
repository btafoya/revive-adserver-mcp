# Revive Adserver MCP Server

A Model Context Protocol (MCP) server for managing Revive Adserver instances through Claude Code.

## Project Overview

This MCP server provides seamless integration between Claude Code and Revive Adserver, enabling automated management of ad campaigns, zones, banners, and reporting through natural language interactions.

## Development Setup

### Prerequisites
- Node.js 18+ with TypeScript support
- Access to Revive Adserver instance with API credentials
- Claude Code with MCP support

### Dependencies
- `@modelcontextprotocol/sdk` - Core MCP TypeScript SDK
- `typescript` - TypeScript compiler and runtime
- `@types/node` - Node.js type definitions

### Installation Commands
```bash
npm install @modelcontextprotocol/sdk typescript @types/node
npm install --save-dev ts-node nodemon
```

### Development Scripts
```json
{
  "scripts": {
    "build": "tsc",
    "dev": "nodemon --exec ts-node src/server.ts",
    "start": "node dist/server.js",
    "test": "npm run build && node dist/server.js",
    "lint": "tsc --noEmit"
  }
}
```

## Architecture

### Core Components
1. **Connection Manager** - Handles Revive API authentication and connection pooling
2. **Campaign Manager** - CRUD operations for advertising campaigns
3. **Zone Manager** - Website zone configuration and management
4. **Banner Manager** - Creative asset management and optimization
5. **Reporting Engine** - Analytics and performance metrics
6. **Statistics Aggregator** - Real-time performance data collection

### MCP Tools Implementation
- `revive_campaign_create` - Create new advertising campaigns
- `revive_campaign_list` - Retrieve campaign listings with filters
- `revive_campaign_update` - Modify existing campaign parameters
- `revive_zone_configure` - Set up advertising zones on websites
- `revive_banner_upload` - Upload and manage creative assets
- `revive_stats_generate` - Generate performance reports
- `revive_targeting_set` - Configure audience targeting rules

### Resources
- `campaign://[id]` - Individual campaign configuration and status
- `zone://[id]` - Zone settings and performance metrics
- `banner://[id]` - Creative asset metadata and statistics
- `report://[type]/[period]` - Generated analytics reports

## Configuration

### Environment Variables
```bash
REVIVE_API_URL=https://your-revive-instance.com/api
REVIVE_API_USERNAME=api_user
REVIVE_API_PASSWORD=secure_password
REVIVE_DATABASE_HOST=localhost
REVIVE_DATABASE_NAME=revive_db
```

### MCP Server Registration
Add to `.mcp.json`:
```json
{
  "mcpServers": {
    "revive-adserver": {
      "command": "node",
      "args": ["dist/server.js"],
      "env": {
        "REVIVE_API_URL": "https://your-revive-instance.com/api"
      }
    }
  }
}
```

## API Integration Patterns

### Authentication Flow
1. Validate API credentials on server startup
2. Implement token refresh mechanism for long-running sessions
3. Handle authentication errors gracefully with retry logic

### Rate Limiting Strategy
- Implement exponential backoff for API requests
- Queue management for bulk operations
- Respect Revive API rate limits (typically 100 requests/minute)

### Error Handling
- Comprehensive error mapping from Revive API responses
- Graceful degradation for partial service availability
- User-friendly error messages with actionable suggestions

## Usage Examples

### Campaign Management
```
Create a new banner campaign for summer sales with $1000 budget targeting mobile users
```

### Zone Configuration
```
Set up a leaderboard zone on homepage with 728x90 dimensions and frequency capping
```

### Performance Analysis
```
Generate monthly performance report for all active campaigns showing CTR and conversions
```

### Banner Optimization
```
Upload new creative assets and run A/B test against existing banners
```

## Testing Strategy

### Unit Tests
- API client functionality and error handling
- Data transformation and validation logic
- MCP protocol compliance verification

### Integration Tests
- End-to-end workflow validation with test Revive instance
- Performance testing under various load conditions
- Error recovery and failover scenarios

### Test Commands
```bash
npm run test:unit
npm run test:integration
npm run test:performance
```

## Performance Optimization

### Caching Strategy
- Campaign and zone metadata caching (TTL: 15 minutes)
- Banner asset metadata caching (TTL: 1 hour)
- Statistics caching with intelligent invalidation

### Connection Pooling
- Maintain persistent connections to Revive API
- Connection pool sizing based on expected concurrent users
- Automatic connection health monitoring

### Resource Management
- Efficient memory usage for large datasets
- Streaming support for bulk data operations
- Lazy loading of non-critical data

## Security Considerations

### API Security
- Encrypted credential storage using environment variables
- API key rotation support and automated refresh
- Request signing and validation

### Data Privacy
- PII data handling compliance (GDPR/CCPA)
- Audit logging for sensitive operations
- Data retention policy enforcement

## Deployment

### Production Build
```bash
npm run build
npm run start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["npm", "start"]
```

### Health Monitoring
- `/health` endpoint for service status
- Metrics collection for performance monitoring
- Automated alerting for service degradation

## Documentation References

### Official Documentation
- [Revive Adserver Documentation](https://revive-adserver.atlassian.net/wiki/spaces/DOCS/overview)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Revive API Reference](https://revive-adserver.atlassian.net/wiki/spaces/DOCS/pages/API)

### Development Resources
- TypeScript configuration best practices
- MCP server implementation patterns
- Revive database schema documentation

## Documentation

### Complete Usage Guides
- **[USAGE.md](USAGE.md)** - Comprehensive Claude Code integration guide with examples
- **[MCP-CONFIG.md](MCP-CONFIG.md)** - Detailed MCP server configuration and setup
- **[TOOLS-REFERENCE.md](TOOLS-REFERENCE.md)** - Complete tool reference with examples  
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Comprehensive troubleshooting guide

### Quick Start
1. Install dependencies: `npm install`
2. Build project: `npm run build`
3. Configure environment variables (see MCP-CONFIG.md)
4. Add to Claude Code MCP configuration
5. Verify tools are available in Claude Code

### Available Tools
- Campaign management (create, list, update)
- Zone configuration and management
- Banner upload and optimization
- Targeting rule configuration
- Performance statistics generation

See TOOLS-REFERENCE.md for detailed examples and usage patterns.

## Contributing

### Development Workflow
1. Fork repository and create feature branch
2. Implement changes with comprehensive tests
3. Run linting and type checking
4. Submit pull request with detailed description

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for consistent formatting
- Comprehensive JSDoc documentation