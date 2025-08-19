# Revive Adserver MCP - Claude Code Usage Guide

Complete usage instructions for integrating the Revive Adserver MCP server with Claude Code.

## Quick Start

### 1. Prerequisites
- Claude Code with MCP support
- Node.js 18+ 
- Access to Revive Adserver instance with API credentials

### 2. Installation
```bash
git clone <repository>
cd revive-adserver-mcp
npm install
npm run build
```

### 3. Configuration
Create environment variables or `.env` file:
```bash
export REVIVE_API_URL="https://your-revive-instance.com/api"
export REVIVE_API_USERNAME="your_api_username" 
export REVIVE_API_PASSWORD="your_api_password"
export REVIVE_DATABASE_HOST="localhost"        # Optional
export REVIVE_DATABASE_NAME="revive_db"        # Optional
export LOG_LEVEL="INFO"                        # Optional: DEBUG, INFO, WARN, ERROR
```

### 4. Claude Code Integration
Add to your Claude Code MCP configuration (`.mcp.json` or Claude Code settings):
```json
{
  "mcpServers": {
    "revive-adserver": {
      "command": "node",
      "args": ["/path/to/revive-adserver-mcp/dist/server.js"],
      "env": {
        "REVIVE_API_URL": "https://your-revive-instance.com/api",
        "REVIVE_API_USERNAME": "your_username",
        "REVIVE_API_PASSWORD": "your_password"
      }
    }
  }
}
```

### 5. Verification
Start Claude Code and verify the MCP server is available:
```
List available MCP tools for Revive Adserver
```

## Available Tools

### Campaign Management

#### Create Campaign
```
Create a new banner campaign called "Summer Sale 2024" for advertiser ID 5 with $1000 budget
```
**Tool**: `revive_campaign_create`
**Arguments**:
- `name` (required): Campaign name
- `advertiserId` (required): Advertiser ID number
- `budget` (optional): Campaign budget amount
- `budgetType` (optional): "daily", "weekly", "monthly", "total"
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)
- `priority` (optional): Campaign priority level

#### List Campaigns
```
Show all active campaigns for advertiser 5, sorted by name
```
**Tool**: `revive_campaign_list`
**Arguments**:
- `advertiserId` (optional): Filter by advertiser ID
- `status` (optional): Filter by status
- `limit` (optional): Number of results
- `offset` (optional): Pagination offset
- `sortBy` (optional): Sort field
- `sortOrder` (optional): "asc" or "desc"

#### Update Campaign
```
Update campaign 123 to pause it and change budget to $2000
```
**Tool**: `revive_campaign_update`
**Arguments**:
- `campaignId` (required): Campaign ID to update
- `name` (optional): New campaign name
- `budget` (optional): New budget amount
- `budgetType` (optional): Budget type
- `startDate` (optional): New start date
- `endDate` (optional): New end date
- `status` (optional): Campaign status
- `priority` (optional): Campaign priority

### Zone Management

#### Configure Zone
```
Create a leaderboard banner zone "Homepage Top" on website 10 with 728x90 dimensions
```
**Tool**: `revive_zone_configure`
**Arguments**:
- `name` (required): Zone name
- `websiteId` (required): Website ID
- `type` (required): "banner", "interstitial", "popup", "text", "email"
- `width` (optional): Zone width in pixels
- `height` (optional): Zone height in pixels
- `description` (optional): Zone description
- `delivery` (optional): "javascript", "iframe", "local", "xmlhttprequest"

#### Update Zone
```
Update zone 456 to add frequency capping of 3 impressions per day
```
**Tool**: `revive_zone_update`
**Arguments**:
- `zoneId` (required): Zone ID to update
- `name` (optional): New zone name
- `description` (optional): Zone description
- `frequencyCap` (optional): Frequency capping settings
  - `impressions`: Maximum impressions
  - `clicks`: Maximum clicks
  - `period`: "hour", "day", "week", "month"

### Banner Management

#### Upload Banner
```
Upload a new banner for campaign 123 called "Sale Banner" with image from https://example.com/banner.jpg, 300x250 size
```
**Tool**: `revive_banner_upload`
**Arguments**:
- `campaignId` (required): Campaign ID
- `name` (required): Banner name
- `storageType` (required): "web", "sql", "html", "text"
- `imageUrl` (optional): Image URL for web storage
- `htmlTemplate` (optional): HTML code for HTML banners
- `width` (required): Banner width
- `height` (required): Banner height
- `weight` (optional): Banner weight for rotation
- `clickUrl` (optional): Click destination URL

#### Update Banner
```
Update banner 789 to change its weight to 5 and set click URL to https://example.com/promo
```
**Tool**: `revive_banner_update`
**Arguments**:
- `bannerId` (required): Banner ID to update
- `name` (optional): Banner name
- `weight` (optional): Banner weight
- `status` (optional): "active", "paused", "inactive"
- `clickUrl` (optional): Click destination URL

### Targeting

#### Set Targeting Rules
```
Set targeting for campaign 123 to show only to users in US and Canada on mobile devices
```
**Tool**: `revive_targeting_set`
**Arguments**:
- `entityType` (required): "campaign" or "banner"
- `entityId` (required): Entity ID
- `targeting` (required): Targeting rules object
  - `country`: Array of country codes
  - `region`: Array of region names
  - `city`: Array of city names
  - `language`: Array of language codes
  - `browser`: Array of browser names
  - `os`: Array of operating systems
  - `device`: Array of device types ("desktop", "mobile", "tablet")
  - `dayOfWeek`: Array of days (0-6)
  - `hourOfDay`: Array of hours (0-23)
  - `keywords`: Array of keywords

### Statistics & Reporting

#### Generate Statistics
```
Generate performance report for campaign 123 from 2024-01-01 to 2024-01-31 with daily breakdown
```
**Tool**: `revive_stats_generate`
**Arguments**:
- `entityType` (required): "campaign", "banner", "zone", "advertiser", "publisher"
- `entityId` (optional): Specific entity ID (omit for overall stats)
- `startDate` (required): Start date (YYYY-MM-DD)
- `endDate` (required): End date (YYYY-MM-DD)
- `granularity` (optional): "hour", "day", "week", "month"
- `metrics` (optional): Array of specific metrics to include

## Common Usage Patterns

### Complete Campaign Setup
```
1. Create a new campaign for summer promotion with $500 daily budget
2. Upload 3 banner creatives (300x250, 728x90, 160x600) for the campaign
3. Set targeting to show ads only to users in North America on weekdays
4. Generate initial performance report to verify setup
```

### Performance Optimization
```
1. Generate performance report for all active campaigns last 7 days
2. Identify top performing banners by CTR
3. Update low-performing banners to pause them
4. Increase budget for high-performing campaigns
```

### Zone Management Workflow
```
1. Configure new zones for website homepage (leaderboard, sidebar, footer)
2. Set frequency capping to 5 impressions per user per day
3. Link active campaigns to new zones
4. Monitor zone performance with daily reports
```

### A/B Testing Setup
```
1. Create campaign with 2 banners (A and B variants)
2. Set equal weight (50/50) for both banners
3. Set targeting to same audience for both
4. Run for 1 week and generate comparative performance report
5. Update weights based on performance (pause low performer)
```

## Resources

### Available Resources
- `campaign://list` - List of all campaigns
- `zone://list` - List of all zones (placeholder)
- `banner://list` - List of all banners (placeholder)

### Access Resources
```
Show me the campaign list resource
```
Claude Code will automatically fetch and display campaign data.

## Error Handling

The MCP server provides detailed error messages for common issues:

### Authentication Errors
```
Error: Failed to authenticate with Revive Adserver: Invalid credentials
```
**Solution**: Verify `REVIVE_API_USERNAME` and `REVIVE_API_PASSWORD` environment variables.

### Connection Errors
```
Error: Connection timeout to Revive API
```
**Solution**: Check `REVIVE_API_URL` and network connectivity to Revive server.

### Invalid Arguments
```
Error: Missing required parameter: campaignId
```
**Solution**: Ensure all required arguments are provided with correct data types.

### Rate Limiting
```
Error: API rate limit exceeded
```
**Solution**: The client automatically retries with exponential backoff. For persistent issues, reduce request frequency.

## Advanced Configuration

### Custom Logging
Set log level for detailed debugging:
```bash
export LOG_LEVEL=DEBUG
```

### Connection Tuning
Environment variables for advanced configuration:
```bash
export REVIVE_API_TIMEOUT=30000      # Request timeout in milliseconds
export REVIVE_RETRY_ATTEMPTS=3       # Number of retry attempts
export REVIVE_RETRY_DELAY=1000       # Retry delay in milliseconds
```

### Health Monitoring
The server includes automatic health checking and reconnection logic. Monitor logs for connection status:
```
2024-01-01T10:00:00.000Z INFO [ReviveApiClient] Authentication successful
2024-01-01T10:00:00.000Z INFO [ReviveMcpServer] Revive Adserver MCP server started
```

## Troubleshooting

### Server Won't Start
1. Check Node.js version (requires 18+)
2. Verify all dependencies installed: `npm install`
3. Ensure TypeScript compiled successfully: `npm run build`
4. Check environment variables are set correctly

### Tools Not Available in Claude Code
1. Verify MCP server configuration in Claude Code settings
2. Check server logs for startup errors
3. Ensure server path is correct in MCP configuration
4. Restart Claude Code after configuration changes

### API Errors
1. Test Revive API connectivity manually
2. Verify API credentials and permissions
3. Check Revive server logs for authentication issues
4. Ensure API endpoints are accessible from MCP server

### Performance Issues
1. Enable DEBUG logging to identify bottlenecks
2. Check network latency to Revive server
3. Monitor memory usage during large operations
4. Consider implementing request caching for frequently accessed data

## Support

For issues specific to this MCP server:
1. Check server logs for detailed error messages
2. Verify Revive Adserver API documentation for parameter requirements
3. Test individual API calls outside of Claude Code to isolate issues
4. Review MCP configuration and environment variables

For Claude Code integration issues:
1. Consult Claude Code MCP documentation
2. Verify MCP server registration and configuration
3. Check Claude Code logs for MCP-related errors