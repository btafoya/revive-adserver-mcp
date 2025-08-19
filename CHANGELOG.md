# Changelog

All notable changes to the Revive Adserver MCP server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Nothing yet

### Changed
- Nothing yet

### Deprecated
- Nothing yet

### Removed
- Nothing yet

### Fixed
- Nothing yet

### Security
- Nothing yet

## [1.0.0] - 2024-08-19

### Added
- **Initial release** of Revive Adserver MCP server
- **Campaign Management Tools**
  - `revive_campaign_create` - Create new advertising campaigns
  - `revive_campaign_list` - List campaigns with filtering and pagination
  - `revive_campaign_update` - Update existing campaign properties
- **Zone Management Tools**
  - `revive_zone_configure` - Create and configure advertising zones
  - `revive_zone_update` - Update zone settings and frequency capping
- **Banner Management Tools**
  - `revive_banner_upload` - Upload and create banner creatives
  - `revive_banner_update` - Update banner properties and targeting
- **Targeting System**
  - `revive_targeting_set` - Configure audience targeting rules
  - Support for geographic, device, browser, and time-based targeting
  - Custom keyword and variable targeting
- **Analytics and Reporting**
  - `revive_stats_generate` - Generate performance statistics
  - Customizable date ranges and granularity
  - Support for multiple entity types (campaigns, banners, zones)
- **Robust API Client**
  - Automatic authentication and token refresh
  - Connection pooling and retry logic
  - Comprehensive error handling with exponential backoff
- **TypeScript Support**
  - Complete type definitions for all Revive entities
  - Strongly typed MCP tool interfaces
  - IntelliSense support for development
- **Structured Logging**
  - Configurable log levels (DEBUG, INFO, WARN, ERROR)
  - Correlation IDs for request tracking
  - Performance metrics and timing
- **Comprehensive Documentation**
  - Complete usage guide with examples
  - Configuration reference for all environments
  - Tools reference with detailed parameter documentation
  - Troubleshooting guide with common issues and solutions
- **Security Features**
  - Environment variable configuration for credentials
  - Input validation and sanitization
  - Safe error messages without credential exposure
- **Development Tools**
  - TypeScript configuration with strict mode
  - Development server with hot reload
  - Comprehensive test setup
  - Linting and formatting configuration

### Technical Details
- **Node.js 18+** requirement for modern JavaScript features
- **MCP SDK 0.5.0** integration for Claude Code compatibility
- **Axios** for HTTP client with interceptors
- **TypeScript 5.0+** for type safety and development experience
- **ESM modules** for modern JavaScript ecosystem compatibility

### Architecture
- **Modular design** with separate concerns for API client, server, and utilities
- **Error boundary pattern** for graceful failure handling
- **Observer pattern** for logging and monitoring
- **Factory pattern** for API client configuration
- **Strategy pattern** for different authentication methods

### Performance
- **Connection pooling** for efficient HTTP connections
- **Request batching** capabilities for bulk operations
- **Response caching** with configurable TTL
- **Automatic retry** with exponential backoff and jitter

### Compatibility
- **Revive Adserver 5.0+** with API v2 support
- **Claude Code** with MCP support
- **Cross-platform** support (Windows, macOS, Linux)
- **Docker** deployment ready

[Unreleased]: https://github.com/btafoya/revive-adserver-mcp/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/btafoya/revive-adserver-mcp/releases/tag/v1.0.0