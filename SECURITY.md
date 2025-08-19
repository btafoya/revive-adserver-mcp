# Security Policy

## Supported Versions

We provide security updates for the following versions of the Revive Adserver MCP server:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

### How to Report

If you discover a security vulnerability in the Revive Adserver MCP server, please report it responsibly:

1. **DO NOT** open a public GitHub issue for security vulnerabilities
2. **Email** the security team directly at: [security@example.com](mailto:security@example.com)
3. **Include** detailed information about the vulnerability
4. **Allow** reasonable time for investigation and resolution

### What to Include

When reporting a security vulnerability, please provide:

- **Description** of the vulnerability and its potential impact
- **Steps to reproduce** the issue
- **Affected versions** of the MCP server
- **Environment details** (Node.js version, OS, etc.)
- **Proof of concept** code (if applicable)
- **Suggested remediation** (if known)

### Response Timeline

- **Initial response**: Within 24 hours of report
- **Vulnerability assessment**: Within 72 hours
- **Resolution timeline**: Provided within 1 week
- **Public disclosure**: After fix is available and deployed

## Security Best Practices

### For Users

#### Credential Management
```bash
# ✅ Use environment variables
export REVIVE_API_USERNAME="secure_user"
export REVIVE_API_PASSWORD="strong_password"

# ❌ Never hardcode in configuration files
{
  "env": {
    "REVIVE_API_USERNAME": "my_username",  // Don't do this
    "REVIVE_API_PASSWORD": "my_password"   // Don't do this
  }
}
```

#### Secure Configuration
```json
{
  "mcpServers": {
    "revive-adserver": {
      "command": "node",
      "args": ["/path/to/server.js"],
      "env": {
        "REVIVE_API_URL": "https://revive.example.com/api",
        "LOG_LEVEL": "INFO"
      }
    }
  }
}
```

#### Network Security
- **Use HTTPS** for all Revive API connections
- **Implement firewall rules** to restrict MCP server network access
- **Use VPN or private networks** for production deployments
- **Regularly update** Node.js and dependencies

#### Access Control
```bash
# Create dedicated API user with minimal permissions
REVIVE_API_USERNAME="mcp_readonly_user"

# Use read-only credentials when possible
REVIVE_READONLY_MODE="true"

# Rotate credentials regularly
# Schedule: Every 90 days minimum
```

### For Developers

#### Code Security
- **Input validation** for all user-provided data
- **Output sanitization** to prevent injection attacks
- **Error handling** without exposing sensitive information
- **Dependency scanning** for known vulnerabilities

#### Authentication Security
```typescript
// ✅ Secure credential handling
const credentials = {
  username: process.env.REVIVE_API_USERNAME,
  password: process.env.REVIVE_API_PASSWORD,
};

// ✅ Automatic token refresh
if (this.tokenExpired()) {
  await this.refreshToken();
}

// ❌ Never log credentials
logger.debug('Authenticating...', { 
  username: credentials.username,
  // password: credentials.password  // Don't log passwords
});
```

#### API Security
```typescript
// ✅ Request validation
export function validateCampaignArgs(args: CreateCampaignArgs): void {
  if (!args.name || typeof args.name !== 'string') {
    throw new ValidationError('Campaign name is required');
  }
  
  if (args.name.length > 255) {
    throw new ValidationError('Campaign name too long');
  }
  
  // Sanitize inputs
  args.name = args.name.trim();
}

// ✅ Rate limiting
const rateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60000, // 1 minute
});
```

## Security Features

### Built-in Protections

#### Authentication
- **Automatic token refresh** prevents expired credential issues
- **Session management** with secure token storage
- **Retry logic** with exponential backoff prevents brute force
- **Connection pooling** limits concurrent authentication attempts

#### Input Validation
- **Parameter validation** for all MCP tool inputs
- **Type checking** with TypeScript for compile-time safety
- **Sanitization** of user-provided strings
- **Range validation** for numeric inputs

#### Error Handling
- **Safe error messages** without credential exposure
- **Stack trace sanitization** in production
- **Correlation IDs** for secure debugging
- **Rate limit handling** with automatic backoff

#### Logging Security
```typescript
// ✅ Secure logging patterns
logger.info('Campaign created', {
  campaignId: result.campaignId,
  advertiserId: args.advertiserId,
  correlationId: this.correlationId,
});

// ❌ Don't log sensitive data
logger.debug('API response', {
  // data: apiResponse,  // May contain sensitive info
  status: apiResponse.status,
  correlationId: this.correlationId,
});
```

### Configuration Security

#### Environment Variables
```bash
# Required security environment variables
REVIVE_API_URL="https://secure-revive.example.com/api"
REVIVE_API_USERNAME="secure_api_user"
REVIVE_API_PASSWORD="strong_random_password"

# Optional security enhancements
REVIVE_API_TIMEOUT="10000"        # Prevent long-running requests
REVIVE_MAX_CONNECTIONS="5"        # Limit resource usage
REVIVE_ENABLE_CACHE="false"       # Disable caching for sensitive data
LOG_LEVEL="WARN"                  # Reduce log verbosity in production
```

#### File Permissions
```bash
# Secure file permissions
chmod 600 .env                    # Environment file readable by owner only
chmod 755 dist/server.js          # Server executable by owner, readable by others
chmod 644 *.md                    # Documentation readable by all
```

## Vulnerability Management

### Dependency Security
```bash
# Regular security audits
npm audit

# Fix known vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated

# Update dependencies
npm update
```

### Automated Security Scanning
```yaml
# GitHub Actions security workflow
name: Security Scan
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Security Audit
        run: npm audit
      - name: Run Vulnerability Scan
        uses: securecodewarrior/github-action-add-sarif@v1
```

### Security Testing
```typescript
// Security test examples
describe('Security Tests', () => {
  it('should not expose credentials in error messages', async () => {
    const invalidCredentials = {
      username: 'invalid',
      password: 'wrong',
    };
    
    try {
      await client.authenticate(invalidCredentials);
    } catch (error) {
      expect(error.message).not.toContain('wrong');
      expect(error.message).not.toContain('invalid');
    }
  });
  
  it('should validate input parameters', () => {
    expect(() => {
      validateCampaignArgs({ name: '../../../etc/passwd' });
    }).toThrow('Invalid campaign name');
  });
});
```

## Incident Response

### If You Suspect a Security Issue

1. **Immediately isolate** the affected system
2. **Stop the MCP server** if compromise is suspected
3. **Collect logs** for forensic analysis
4. **Change credentials** for Revive API access
5. **Report the incident** following the vulnerability reporting process

### Recovery Steps

1. **Update** to the latest patched version
2. **Rotate all credentials** used by the MCP server
3. **Review logs** for suspicious activity
4. **Verify configuration** security settings
5. **Monitor** for ongoing issues

## Security Contacts

- **Security Team**: [security@example.com](mailto:security@example.com)
- **Primary Maintainer**: [maintainer@example.com](mailto:maintainer@example.com)
- **Emergency Contact**: [emergency@example.com](mailto:emergency@example.com)

## Security Resources

### External Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Advisories](https://www.npmjs.com/advisories)
- [Revive Adserver Security](https://www.revive-adserver.com/security/)

### Internal Documentation
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development security guidelines
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Security-related troubleshooting
- [MCP-CONFIG.md](MCP-CONFIG.md) - Secure configuration examples

---

**Note**: This security policy is a living document and will be updated as the project evolves. Please check back regularly for updates.