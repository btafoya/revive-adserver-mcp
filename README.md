# Revive Adserver MCP Server

> **Model Context Protocol (MCP) server for seamless Revive Adserver integration with Claude Code**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

Automate your Revive Adserver operations through natural language conversations with Claude Code. Manage campaigns, zones, banners, targeting, and analytics seamlessly.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Claude Code with MCP support
- Revive Adserver instance with API access

### Installation
```bash
git clone https://github.com/btafoya/revive-adserver-mcp.git
cd revive-adserver-mcp
npm install
npm run build
```

### Configuration
```bash
# Set environment variables
export REVIVE_API_URL="https://your-revive-instance.com/api"
export REVIVE_API_USERNAME="your_username"
export REVIVE_API_PASSWORD="your_password"
```

### Claude Code Integration
Add to your MCP configuration:
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

## ✨ Features

### 🎯 Campaign Management
- Create campaigns with budgets and scheduling
- List and filter campaigns by status/advertiser
- Update campaign settings and performance

### 🏗️ Zone Configuration
- Configure advertising zones on websites
- Set frequency capping and targeting rules
- Manage zone dimensions and delivery methods

### 🎨 Banner Management
- Upload image and HTML banners
- Manage banner weights for A/B testing
- Update click URLs and targeting

### 🎪 Advanced Targeting
- Geographic targeting (country, region, city)
- Device and browser targeting
- Time-based targeting (day/hour)
- Custom keyword targeting

### 📊 Analytics & Reporting
- Performance statistics and metrics
- Customizable date ranges and granularity
- Campaign, banner, and zone analytics

## 💬 Usage Examples

### Natural Language Interface
Simply describe what you want to accomplish:

```
Create a new campaign "Summer Sale 2024" for advertiser 5 with $1000 daily budget
```

```
Upload a banner for campaign 123 using image from https://cdn.example.com/sale.jpg, size 300x250
```

```
Generate performance report for campaign 456 from last week with daily breakdown
```

```
Set targeting for banner 789 to show only to mobile users in US and Canada
```

### Advanced Workflows

**A/B Testing Setup**:
```
1. Create campaign with $500 budget
2. Upload two banner variants with equal weight
3. Set identical targeting for both banners
4. Generate comparative performance reports after 1 week
```

**Seasonal Campaign Management**:
```
1. Create holiday campaign with date restrictions
2. Upload multiple creative sizes
3. Configure frequency capping to 3 impressions per day
4. Set up geographic targeting for North America
```

## 🛠️ Available Tools

| Tool | Purpose | Example Usage |
|------|---------|---------------|
| `revive_campaign_create` | Create new campaigns | Create campaign with budget and dates |
| `revive_campaign_list` | List campaigns | Show active campaigns for advertiser |
| `revive_campaign_update` | Update campaigns | Change budget or pause campaign |
| `revive_zone_configure` | Configure zones | Create leaderboard zone 728x90 |
| `revive_zone_update` | Update zones | Add frequency capping |
| `revive_banner_upload` | Upload banners | Add creative from URL or HTML |
| `revive_banner_update` | Update banners | Change weight or click URL |
| `revive_targeting_set` | Configure targeting | Set geographic/device targeting |
| `revive_stats_generate` | Generate reports | Performance analytics with date range |

## 📚 Documentation

- **[📖 Usage Guide](USAGE.md)** - Complete integration and usage examples
- **[⚙️ Configuration](MCP-CONFIG.md)** - Detailed setup and environment configuration
- **[🔧 Tools Reference](TOOLS-REFERENCE.md)** - Complete tool documentation with examples
- **[🩺 Troubleshooting](TROUBLESHOOTING.md)** - Problem-solving and diagnostic guide

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Claude Code   │◄──►│  MCP Server      │◄──►│ Revive Adserver │
│                 │    │                  │    │                 │
│ Natural Language│    │ • Authentication │    │ • Campaigns     │
│ Interface       │    │ • Tool Registry  │    │ • Zones         │
│                 │    │ • Error Handling │    │ • Banners       │
│                 │    │ • Logging        │    │ • Statistics    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Core Components

- **MCP Server** - Handles tool registration and Claude Code communication
- **API Client** - Manages authentication and HTTP requests to Revive
- **Type System** - Complete TypeScript definitions for all entities
- **Logger** - Structured logging with correlation IDs
- **Error Handler** - Comprehensive error processing and recovery

## 🔒 Security

- **Credential Management** - Environment variable configuration
- **API Authentication** - Automatic token refresh and session management
- **Input Validation** - Parameter validation and sanitization
- **Error Handling** - Safe error messages without credential exposure

## ⚡ Performance

- **Connection Pooling** - Efficient HTTP connection management
- **Request Batching** - Optimized API call patterns
- **Caching** - Response caching for frequently accessed data
- **Rate Limiting** - Automatic retry with exponential backoff

## 🧪 Development

### Prerequisites
- Node.js 18+
- TypeScript 5.0+
- Access to Revive Adserver test instance

### Setup
```bash
# Clone repository
git clone https://github.com/btafoya/revive-adserver-mcp.git
cd revive-adserver-mcp

# Install dependencies
npm install

# Development mode
npm run dev

# Build and test
npm run build
npm run test
```

### Project Structure
```
src/
├── server.ts              # MCP server implementation
├── client/
│   └── revive-client.ts   # Revive API client
├── types/
│   ├── revive.ts          # Revive entity types
│   └── mcp.ts             # MCP tool types
└── utils/
    └── logger.ts          # Logging utilities
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Add tests for new features
- Update documentation
- Use conventional commit messages

## 📋 Requirements

### System Requirements
- **Node.js**: 18.0.0 or higher
- **Memory**: Minimum 512MB RAM
- **Storage**: 100MB for dependencies

### Revive Adserver Requirements
- **Version**: 5.0+ (API v2 support)
- **API Access**: Valid user credentials
- **Permissions**: Campaign, zone, banner management access

### Claude Code Requirements
- **Version**: Latest with MCP support
- **Configuration**: MCP server registration capability

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/btafoya/revive-adserver-mcp/issues)
- **Documentation**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Discussions**: [GitHub Discussions](https://github.com/btafoya/revive-adserver-mcp/discussions)

## 🙏 Acknowledgments

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) - Protocol specification
- [Revive Adserver](https://www.revive-adserver.com/) - Open source ad server
- [Claude Code](https://claude.ai/code) - AI-powered development environment

---

**Made with ❤️ for the advertising and development community**