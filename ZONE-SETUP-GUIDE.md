# Zone Setup Guide for themusiccalendar.com

## Connection Issue Summary
The Revive Adserver at `https://ads.tafoyaventures.com` does not have XML-RPC properly configured or enabled. All attempts to connect to standard XML-RPC endpoints failed with "Invalid XML-RPC message" errors.

## Required Zones for themusiccalendar.com

The following zones need to be created through the Revive admin interface:

### 1. Desktop Top Banner (728x90 Leaderboard)
- **Name**: Desktop Top Banner
- **Size**: 728x90 pixels
- **Type**: Banner zone
- **Website**: themusiccalendar.com
- **Description**: Desktop Leaderboard banner at top of page
- **Position**: Header/top section

### 2. Mobile Top Banner (320x50 Mobile Banner)
- **Name**: Mobile Top Banner  
- **Size**: 320x50 pixels
- **Type**: Banner zone
- **Website**: themusiccalendar.com
- **Description**: Mobile banner at top of page
- **Position**: Header/top section (mobile)

### 3. Desktop Bottom Banner (728x90 Leaderboard)
- **Name**: Desktop Bottom Banner
- **Size**: 728x90 pixels
- **Type**: Banner zone
- **Website**: themusiccalendar.com
- **Description**: Desktop Leaderboard banner at bottom of page
- **Position**: Footer/bottom section

### 4. Mobile Bottom Banner (320x50 Mobile Banner)
- **Name**: Mobile Bottom Banner
- **Size**: 320x50 pixels
- **Type**: Banner zone
- **Website**: themusiccalendar.com
- **Description**: Mobile banner at bottom of page
- **Position**: Footer/bottom section (mobile)

## Manual Setup Steps

1. **Access Revive Admin Panel**
   - Go to: https://ads.tafoyaventures.com/admin/
   - Login with your credentials

2. **Create/Verify Publisher**
   - Navigate to: Inventory → Websites & Zones
   - Ensure "themusiccalendar.com" exists as a website/publisher
   - If not, create new website with:
     - Website: themusiccalendar.com
     - URL: https://themusiccalendar.com
     - Contact: admin@themusiccalendar.com

3. **Create Zones**
   - For each zone above:
     - Click "Add new Zone"
     - Select "Banner Zone" type
     - Fill in the name and dimensions
     - Add the description
     - Assign to themusiccalendar.com website
     - Save the zone

4. **Zone Code Generation**
   - After creating each zone, generate the invocation code
   - Choose appropriate delivery method (JavaScript recommended)
   - Copy the zone invocation code for website integration

## Alternative Solution: Enable XML-RPC

If you have admin access to the Revive server, you can enable XML-RPC:

1. **Check XML-RPC Status**
   - Admin → System Settings → General Settings
   - Look for "XML-RPC Services" section
   - Ensure it's enabled

2. **Verify XML-RPC Path**
   - Default path should be: `/www/api/v2/xmlrpc/`
   - Test access at: https://ads.tafoyaventures.com/www/api/v2/xmlrpc/

3. **Check User Permissions**
   - User account needs API access permissions
   - Admin → User Access → [Username] → API Access

## Next Steps

Once the zones are created manually or XML-RPC is enabled, you can:
- Retrieve zone IDs and invocation codes
- Test ad delivery
- Set up campaigns and banners
- Configure targeting rules
- Monitor performance statistics

## MCP Server Status

The Revive Adserver MCP server is ready to use once the connection issue is resolved. It provides tools for:
- Campaign management
- Zone configuration  
- Banner upload
- Targeting setup
- Statistics generation

**Current Status**: ❌ XML-RPC connection failed - manual setup required