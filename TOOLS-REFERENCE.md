# Revive Adserver MCP - Tools Reference

Complete reference guide for all available MCP tools with detailed examples and use cases.

## Tool Categories

- [Campaign Management](#campaign-management)
- [Zone Management](#zone-management)
- [Banner Management](#banner-management)
- [Targeting](#targeting)
- [Statistics & Reporting](#statistics--reporting)

---

## Campaign Management

### `revive_campaign_create`

**Purpose**: Create new advertising campaigns in Revive Adserver

**Arguments**:
```typescript
{
  name: string;           // Campaign name (required)
  advertiserId: number;   // Advertiser ID (required)
  budget?: number;        // Campaign budget
  budgetType?: string;    // "daily" | "weekly" | "monthly" | "total"
  startDate?: string;     // Start date (YYYY-MM-DD)
  endDate?: string;       // End date (YYYY-MM-DD)
  priority?: number;      // Campaign priority (1-10)
}
```

**Examples**:

*Basic Campaign*:
```
Create a new campaign called "Spring Sale 2024" for advertiser ID 5
```

*Campaign with Budget*:
```
Create campaign "Mobile App Promotion" for advertiser 3 with $500 daily budget starting March 1st
```

*Full Configuration*:
```
Create campaign "Holiday Special" for advertiser 7 with $2000 weekly budget, priority 8, running from 2024-12-01 to 2024-12-31
```

**Response**:
```json
{
  "success": true,
  "data": {
    "campaignId": 123,
    "campaignName": "Spring Sale 2024",
    "advertiserId": 5,
    "status": "active",
    "budget": 1000,
    "budgetType": "daily",
    "priority": 5,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### `revive_campaign_list`

**Purpose**: Retrieve campaigns with optional filtering and pagination

**Arguments**:
```typescript
{
  advertiserId?: number;     // Filter by advertiser
  status?: string;          // Filter by status
  limit?: number;           // Number of results (default: 50)
  offset?: number;          // Pagination offset (default: 0)
  sortBy?: string;          // Sort field
  sortOrder?: "asc" | "desc"; // Sort direction
}
```

**Examples**:

*All Campaigns*:
```
List all campaigns
```

*Filtered by Advertiser*:
```
Show all campaigns for advertiser 5
```

*Active Campaigns with Sorting*:
```
Show active campaigns sorted by name ascending, limit 20 results
```

*Paginated Results*:
```
Show campaigns 21-40 sorted by creation date descending
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "campaignId": 123,
      "campaignName": "Spring Sale 2024",
      "advertiserId": 5,
      "status": "active",
      "budget": 1000,
      "budgetType": "daily",
      "startDate": "2024-03-01",
      "endDate": "2024-03-31",
      "priority": 5,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:15:00Z"
    }
  ]
}
```

---

### `revive_campaign_update`

**Purpose**: Update existing campaign properties

**Arguments**:
```typescript
{
  campaignId: number;       // Campaign ID to update (required)
  name?: string;           // New campaign name
  budget?: number;         // New budget amount
  budgetType?: string;     // New budget type
  startDate?: string;      // New start date
  endDate?: string;        // New end date
  status?: string;         // New status
  priority?: number;       // New priority
}
```

**Examples**:

*Update Budget*:
```
Update campaign 123 to increase budget to $1500
```

*Pause Campaign*:
```
Pause campaign 456
```

*Extend Campaign Dates*:
```
Update campaign 789 to extend end date to 2024-04-30 and increase priority to 8
```

**Response**:
```json
{
  "success": true,
  "data": {
    "campaignId": 123,
    "campaignName": "Spring Sale 2024",
    "budget": 1500,
    "budgetType": "daily",
    "status": "active",
    "updatedAt": "2024-01-22T16:45:00Z"
  }
}
```

---

## Zone Management

### `revive_zone_configure`

**Purpose**: Create and configure advertising zones on websites

**Arguments**:
```typescript
{
  name: string;             // Zone name (required)
  websiteId: number;        // Website ID (required)
  type: string;            // Zone type (required)
  width?: number;          // Zone width in pixels
  height?: number;         // Zone height in pixels
  description?: string;    // Zone description
  delivery?: string;       // Delivery method
}
```

**Zone Types**: `"banner"`, `"interstitial"`, `"popup"`, `"text"`, `"email"`
**Delivery Methods**: `"javascript"`, `"iframe"`, `"local"`, `"xmlhttprequest"`

**Examples**:

*Standard Banner Zone*:
```
Create a banner zone called "Homepage Leaderboard" on website 10 with 728x90 dimensions
```

*Mobile Banner Zone*:
```
Configure mobile banner zone "Mobile Top" on website 15, size 320x50, javascript delivery
```

*Interstitial Zone*:
```
Create interstitial zone "Article Interstitial" on website 20 for full-page ads
```

**Response**:
```json
{
  "success": true,
  "data": {
    "zoneId": 456,
    "zoneName": "Homepage Leaderboard",
    "websiteId": 10,
    "zoneType": "banner",
    "width": 728,
    "height": 90,
    "delivery": "javascript",
    "createdAt": "2024-01-15T11:00:00Z"
  }
}
```

---

### `revive_zone_update`

**Purpose**: Update existing zone configuration

**Arguments**:
```typescript
{
  zoneId: number;           // Zone ID to update (required)
  name?: string;           // New zone name
  description?: string;    // Zone description
  frequencyCap?: {         // Frequency capping settings
    impressions?: number;  // Max impressions per period
    clicks?: number;       // Max clicks per period
    period: string;        // "hour" | "day" | "week" | "month"
  };
  targeting?: TargetingRules; // Targeting configuration
}
```

**Examples**:

*Add Frequency Capping*:
```
Update zone 456 to limit users to 3 impressions per day
```

*Update Description*:
```
Update zone 789 description to "Premium sidebar position with high visibility"
```

*Set Frequency Cap with Clicks*:
```
Configure zone 123 with frequency cap of 5 impressions and 2 clicks per hour
```

**Response**:
```json
{
  "success": true,
  "data": {
    "zoneId": 456,
    "zoneName": "Homepage Leaderboard",
    "description": "Main banner position on homepage",
    "frequencyCap": {
      "impressions": 3,
      "period": "day"
    },
    "updatedAt": "2024-01-22T12:30:00Z"
  }
}
```

---

## Banner Management

### `revive_banner_upload`

**Purpose**: Upload and create new banner creatives

**Arguments**:
```typescript
{
  campaignId: number;       // Campaign ID (required)
  name: string;            // Banner name (required)
  storageType: string;     // Storage type (required)
  imageUrl?: string;       // Image URL for web storage
  htmlTemplate?: string;   // HTML code for HTML banners
  width: number;           // Banner width (required)
  height: number;          // Banner height (required)
  weight?: number;         // Banner weight for rotation
  clickUrl?: string;       // Click destination URL
}
```

**Storage Types**: `"web"`, `"sql"`, `"html"`, `"text"`

**Examples**:

*Image Banner from URL*:
```
Upload banner "Summer Sale Main" for campaign 123, web storage, image from https://cdn.example.com/banner.jpg, size 300x250, click URL https://store.example.com/sale
```

*HTML Banner*:
```
Create HTML banner "Interactive Ad" for campaign 456, size 728x90, with HTML template including animations
```

*Text Banner*:
```
Upload text banner "Simple CTA" for campaign 789, size 160x600, weight 3
```

**Response**:
```json
{
  "success": true,
  "data": {
    "bannerId": 789,
    "campaignId": 123,
    "bannerName": "Summer Sale Main",
    "storageType": "web",
    "imageUrl": "https://cdn.example.com/banner.jpg",
    "width": 300,
    "height": 250,
    "weight": 1,
    "clickUrl": "https://store.example.com/sale",
    "status": "active",
    "createdAt": "2024-01-15T13:45:00Z"
  }
}
```

---

### `revive_banner_update`

**Purpose**: Update existing banner properties

**Arguments**:
```typescript
{
  bannerId: number;         // Banner ID to update (required)
  name?: string;           // New banner name
  weight?: number;         // New banner weight
  status?: string;         // New banner status
  clickUrl?: string;       // New click URL
  targeting?: TargetingRules; // Banner-specific targeting
}
```

**Banner Status**: `"active"`, `"paused"`, `"inactive"`

**Examples**:

*Pause Low-Performing Banner*:
```
Pause banner 789
```

*Adjust Banner Weight*:
```
Update banner 456 to increase weight to 5 for more frequent display
```

*Change Click URL*:
```
Update banner 123 click URL to https://example.com/new-landing-page
```

**Response**:
```json
{
  "success": true,
  "data": {
    "bannerId": 789,
    "bannerName": "Summer Sale Main",
    "weight": 5,
    "status": "active",
    "clickUrl": "https://example.com/new-landing-page",
    "updatedAt": "2024-01-22T15:20:00Z"
  }
}
```

---

## Targeting

### `revive_targeting_set`

**Purpose**: Configure audience targeting rules for campaigns or banners

**Arguments**:
```typescript
{
  entityType: "campaign" | "banner"; // Entity to target (required)
  entityId: number;                  // Entity ID (required)
  targeting: {                       // Targeting rules (required)
    country?: string[];              // Country codes
    region?: string[];               // Region names
    city?: string[];                 // City names
    language?: string[];             // Language codes
    browser?: string[];              // Browser names
    os?: string[];                   // Operating systems
    device?: string[];               // Device types
    dayOfWeek?: number[];            // Days of week (0-6)
    hourOfDay?: number[];            // Hours of day (0-23)
    keywords?: string[];             // Target keywords
    customVariables?: Record<string, string>; // Custom targeting
  }
}
```

**Examples**:

*Geographic Targeting*:
```
Set targeting for campaign 123 to show only to users in US, Canada, and UK
```

*Device and Time Targeting*:
```
Configure banner 456 to target mobile users on weekdays between 9 AM and 5 PM
```

*Complex Multi-Criteria Targeting*:
```
Set targeting for campaign 789: English speakers in North America, using Chrome or Safari, on desktop devices, with keywords "sports" and "fitness"
```

*Business Hours Targeting*:
```
Target campaign 321 to show Monday through Friday, 8 AM to 6 PM, desktop users in major US cities
```

**Response**:
```json
{
  "success": true,
  "data": {
    "entityType": "campaign",
    "entityId": 123,
    "targeting": {
      "country": ["US", "CA", "UK"],
      "device": ["mobile"],
      "dayOfWeek": [1, 2, 3, 4, 5],
      "hourOfDay": [9, 10, 11, 12, 13, 14, 15, 16, 17],
      "language": ["en"],
      "keywords": ["sports", "fitness"]
    },
    "updatedAt": "2024-01-22T16:00:00Z"
  }
}
```

---

## Statistics & Reporting

### `revive_stats_generate`

**Purpose**: Generate performance statistics and reports

**Arguments**:
```typescript
{
  entityType: string;       // Entity type (required)
  entityId?: number;        // Specific entity ID (optional)
  startDate: string;        // Start date YYYY-MM-DD (required)
  endDate: string;          // End date YYYY-MM-DD (required)
  granularity?: string;     // Report granularity
  metrics?: string[];       // Specific metrics to include
}
```

**Entity Types**: `"campaign"`, `"banner"`, `"zone"`, `"advertiser"`, `"publisher"`
**Granularity**: `"hour"`, `"day"`, `"week"`, `"month"`
**Metrics**: `"impressions"`, `"clicks"`, `"ctr"`, `"conversions"`, `"revenue"`, `"cost"`

**Examples**:

*Campaign Performance Report*:
```
Generate performance report for campaign 123 from January 1st to January 31st with daily breakdown
```

*Banner Comparison Report*:
```
Show statistics for all banners in campaign 456 for the last 7 days
```

*Zone Performance Analysis*:
```
Generate hourly statistics for zone 789 for yesterday to analyze peak performance times
```

*Advertiser Overview*:
```
Create monthly performance report for advertiser 5 for Q4 2023 including all metrics
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "entity": "campaign",
      "entityId": 123,
      "period": {
        "startDate": "2024-01-01",
        "endDate": "2024-01-31",
        "granularity": "day"
      },
      "impressions": 150000,
      "clicks": 3500,
      "ctr": 2.33,
      "conversions": 185,
      "conversionRate": 5.29,
      "revenue": 2750.00,
      "cost": 1200.00,
      "ecpm": 8.00
    }
  ]
}
```

---

## Advanced Usage Patterns

### Bulk Operations

*Create Multiple Banners*:
```
For campaign 123, create three banners:
1. "Desktop Banner" 728x90 from https://cdn.example.com/desktop.jpg
2. "Mobile Banner" 320x50 from https://cdn.example.com/mobile.jpg  
3. "Square Banner" 300x300 from https://cdn.example.com/square.jpg
```

*Update Multiple Campaigns*:
```
Pause campaigns 100, 101, and 102, then generate performance report for each from last week
```

### A/B Testing Workflow

```
1. Create campaign "Product Launch A/B Test" for advertiser 5
2. Upload banner A "Version A" with weight 50
3. Upload banner B "Version B" with weight 50
4. Set identical targeting for both banners to US mobile users
5. Run for 7 days then generate comparative statistics
```

### Seasonal Campaign Management

```
1. Create "Holiday Sale 2024" campaign with $2000 daily budget
2. Configure start date December 1st, end date December 31st
3. Upload holiday-themed banners for different sizes
4. Set targeting to exclude users who clicked in last 24 hours
5. Generate weekly performance reports
```

### Performance Optimization Workflow

```
1. Generate last 30 days statistics for all active campaigns
2. Identify campaigns with CTR below 1%
3. Pause underperforming banners
4. Increase budget for campaigns with CTR above 3%
5. Update targeting to focus on best-performing demographics
```

## Error Handling Examples

### Common Error Responses

*Invalid Campaign ID*:
```json
{
  "success": false,
  "error": "Campaign not found: ID 999"
}
```

*Missing Required Field*:
```json
{
  "success": false,
  "error": "Missing required parameter: advertiserId"
}
```

*Authentication Error*:
```json
{
  "success": false,
  "error": "Failed to authenticate with Revive Adserver: Invalid credentials"
}
```

*Rate Limit Error*:
```json
{
  "success": false,
  "error": "API rate limit exceeded. Please retry in 60 seconds"
}
```

### Error Recovery Patterns

*Retry Failed Operations*:
```
If campaign creation fails, retry with adjusted parameters or check advertiser ID validity
```

*Validate Before Bulk Operations*:
```
Before updating multiple campaigns, verify each campaign ID exists
```

*Graceful Degradation*:
```
If targeting update fails, campaign remains active with previous targeting rules
```