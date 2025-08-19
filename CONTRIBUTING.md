# Contributing to Revive Adserver MCP

We welcome contributions to the Revive Adserver MCP server! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Issues
- **Search existing issues** before creating a new one
- **Use the issue template** to provide necessary information
- **Include reproduction steps** for bugs
- **Provide system information** (Node.js version, OS, Revive version)

### Suggesting Features
- **Check the roadmap** to see if the feature is already planned
- **Open a discussion** before implementing large features
- **Provide use cases** and examples
- **Consider backward compatibility**

### Code Contributions
1. **Fork the repository** and create a feature branch
2. **Follow coding standards** and conventions
3. **Add tests** for new functionality
4. **Update documentation** as needed
5. **Submit a pull request** with clear description

## 🏗️ Development Setup

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager
- Access to Revive Adserver test instance
- Git for version control

### Local Development
```bash
# Clone your fork
git clone https://github.com/your-username/revive-adserver-mcp.git
cd revive-adserver-mcp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your test Revive instance details

# Start development server
npm run dev

# Run tests
npm test

# Build project
npm run build
```

### Environment Setup
Create `.env` file with test environment variables:
```bash
REVIVE_API_URL=https://test-revive.example.com/api
REVIVE_API_USERNAME=test_user
REVIVE_API_PASSWORD=test_password
LOG_LEVEL=DEBUG
```

## 📝 Coding Standards

### TypeScript Guidelines
- **Use strict mode** with all type checking enabled
- **Prefer interfaces** over types for object definitions
- **Use explicit return types** for public functions
- **Add JSDoc comments** for public APIs
- **Use meaningful variable names** and avoid abbreviations

### Code Style
- **Follow ESLint rules** configured in the project
- **Use Prettier** for code formatting
- **2 spaces indentation** for consistency
- **Semicolons required** at statement ends
- **Single quotes** for strings

### Example Code Style
```typescript
/**
 * Creates a new campaign in Revive Adserver
 * @param args Campaign creation arguments
 * @returns Promise resolving to campaign response
 */
export async function createCampaign(
  args: CreateCampaignArgs
): Promise<ReviveApiResponse<Campaign>> {
  const logger = new Logger('CampaignManager');
  
  try {
    logger.info(`Creating campaign: ${args.name}`);
    const response = await this.apiClient.post('/campaigns', args);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    logger.error('Failed to create campaign:', error);
    throw new Error(`Campaign creation failed: ${error.message}`);
  }
}
```

## 🧪 Testing Guidelines

### Test Structure
- **Unit tests** for individual functions and classes
- **Integration tests** for API client functionality
- **End-to-end tests** for complete workflows
- **Mock external dependencies** in unit tests

### Writing Tests
```typescript
describe('CampaignManager', () => {
  let campaignManager: CampaignManager;
  let mockApiClient: jest.Mocked<ApiClient>;

  beforeEach(() => {
    mockApiClient = createMockApiClient();
    campaignManager = new CampaignManager(mockApiClient);
  });

  describe('createCampaign', () => {
    it('should create campaign with valid arguments', async () => {
      const args: CreateCampaignArgs = {
        name: 'Test Campaign',
        advertiserId: 1,
        budget: 1000,
      };

      mockApiClient.post.mockResolvedValue({
        data: { campaignId: 123, ...args },
      });

      const result = await campaignManager.createCampaign(args);

      expect(result.success).toBe(true);
      expect(result.data.campaignId).toBe(123);
      expect(mockApiClient.post).toHaveBeenCalledWith('/campaigns', args);
    });
  });
});
```

### Test Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- campaign.test.ts
```

## 📋 Pull Request Process

### Before Submitting
1. **Ensure all tests pass** locally
2. **Run linting and formatting** checks
3. **Update documentation** if needed
4. **Test with real Revive instance** if possible
5. **Rebase on latest main** branch

### Pull Request Template
```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (change affecting existing functionality)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Tested with real Revive instance
- [ ] All existing tests pass

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console.log statements left in code
```

### Review Process
1. **Automated checks** must pass (tests, linting, build)
2. **At least one maintainer review** required
3. **Address feedback** promptly
4. **Keep PR scope focused** on single feature/fix
5. **Update PR description** if scope changes

## 🏷️ Commit Message Guidelines

### Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring without functionality changes
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates

### Examples
```bash
feat(api): add campaign targeting configuration

fix(auth): handle expired token refresh properly

docs(readme): update installation instructions

test(client): add unit tests for banner upload
```

## 🚀 Release Process

### Versioning
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
1. **Update version** in package.json
2. **Update CHANGELOG.md** with new features and fixes
3. **Ensure all tests pass** in CI
4. **Create release tag** with version number
5. **Publish to npm** (maintainers only)

## 🔒 Security Guidelines

### Reporting Security Issues
- **DO NOT** open public issues for security vulnerabilities
- **Email maintainers** directly with security concerns
- **Follow responsible disclosure** practices
- **Allow time for fixes** before public disclosure

### Security Best Practices
- **Never commit credentials** or API keys
- **Use environment variables** for sensitive configuration
- **Validate all inputs** from external sources
- **Follow least privilege** principle for API access
- **Keep dependencies updated** for security patches

## 📚 Documentation Guidelines

### Documentation Types
- **README.md**: Project overview and quick start
- **API Documentation**: Tool reference and examples
- **Configuration Guide**: Setup and environment configuration
- **Troubleshooting**: Common issues and solutions

### Writing Guidelines
- **Use clear, concise language**
- **Include working examples**
- **Keep documentation up-to-date** with code changes
- **Use consistent formatting** and structure
- **Add screenshots** where helpful

## 💬 Communication

### Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and community discussion
- **Pull Request Comments**: Code review and feedback

### Guidelines
- **Be respectful** and constructive
- **Provide context** for questions and issues
- **Use clear, descriptive titles**
- **Follow up on conversations**
- **Help others** when you can

## 🎯 Project Goals

### Core Principles
- **Ease of use**: Simple integration with Claude Code
- **Reliability**: Robust error handling and recovery
- **Performance**: Efficient API usage and caching
- **Security**: Safe credential handling and validation
- **Maintainability**: Clean, well-documented code

### Roadmap Priorities
1. **Enhanced Error Handling**: Better error messages and recovery
2. **Performance Optimization**: Caching and connection pooling
3. **Extended API Coverage**: More Revive Adserver features
4. **Testing Infrastructure**: Comprehensive test coverage
5. **Documentation**: Complete examples and tutorials

## 🙏 Recognition

Contributors will be recognized in:
- **CONTRIBUTORS.md** file listing all contributors
- **Release notes** for significant contributions
- **GitHub contributor graphs** and statistics

Thank you for contributing to Revive Adserver MCP! 🎉