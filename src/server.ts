#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { ReviveApiClient } from './client/revive-client.js';
import { Logger } from './utils/logger.js';
import {
  CreateCampaignArgs,
  UpdateCampaignArgs,
  ListCampaignsArgs,
  ConfigureZoneArgs,
  UpdateZoneArgs,
  UploadBannerArgs,
  UpdateBannerArgs,
  SetTargetingArgs,
  GenerateStatsArgs,
  McpToolResponse
} from './types/mcp.js';

class ReviveAdserverMcpServer {
  private server: Server;
  private reviveClient: ReviveApiClient;
  private logger: Logger;

  constructor() {
    this.server = new Server(
      {
        name: 'revive-adserver-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.logger = new Logger('ReviveMcpServer');
    this.reviveClient = new ReviveApiClient({
      apiUrl: process.env.REVIVE_API_URL || '',
      username: process.env.REVIVE_API_USERNAME || '',
      password: process.env.REVIVE_API_PASSWORD || '',
      databaseHost: process.env.REVIVE_DATABASE_HOST,
      databaseName: process.env.REVIVE_DATABASE_NAME,
    });

    this.setupErrorHandling();
    this.setupToolHandlers();
    this.setupResourceHandlers();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      this.logger.error('Server error:', error);
    };

    process.on('SIGINT', async () => {
      this.logger.info('Shutting down server...');
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'revive_campaign_create',
            description: 'Create a new advertising campaign in Revive Adserver',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Campaign name' },
                advertiserId: { type: 'number', description: 'Advertiser ID' },
                budget: { type: 'number', description: 'Campaign budget' },
                budgetType: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'total'], description: 'Budget type' },
                startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
                endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
                priority: { type: 'number', description: 'Campaign priority' }
              },
              required: ['name', 'advertiserId']
            }
          },
          {
            name: 'revive_campaign_list',
            description: 'List campaigns with optional filtering',
            inputSchema: {
              type: 'object',
              properties: {
                advertiserId: { type: 'number', description: 'Filter by advertiser ID' },
                status: { type: 'string', description: 'Filter by status' },
                limit: { type: 'number', description: 'Number of results to return' },
                offset: { type: 'number', description: 'Number of results to skip' },
                sortBy: { type: 'string', description: 'Sort field' },
                sortOrder: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order' }
              }
            }
          },
          {
            name: 'revive_campaign_update',
            description: 'Update an existing campaign',
            inputSchema: {
              type: 'object',
              properties: {
                campaignId: { type: 'number', description: 'Campaign ID to update' },
                name: { type: 'string', description: 'New campaign name' },
                budget: { type: 'number', description: 'New budget' },
                budgetType: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'total'], description: 'Budget type' },
                startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
                endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
                status: { type: 'string', description: 'Campaign status' },
                priority: { type: 'number', description: 'Campaign priority' }
              },
              required: ['campaignId']
            }
          },
          {
            name: 'revive_zone_configure',
            description: 'Create and configure an advertising zone',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Zone name' },
                websiteId: { type: 'number', description: 'Website ID' },
                type: { type: 'string', enum: ['banner', 'interstitial', 'popup', 'text', 'email'], description: 'Zone type' },
                width: { type: 'number', description: 'Zone width' },
                height: { type: 'number', description: 'Zone height' },
                description: { type: 'string', description: 'Zone description' },
                delivery: { type: 'string', enum: ['javascript', 'iframe', 'local', 'xmlhttprequest'], description: 'Delivery method' }
              },
              required: ['name', 'websiteId', 'type']
            }
          },
          {
            name: 'revive_zone_update',
            description: 'Update an existing zone configuration',
            inputSchema: {
              type: 'object',
              properties: {
                zoneId: { type: 'number', description: 'Zone ID to update' },
                name: { type: 'string', description: 'New zone name' },
                description: { type: 'string', description: 'Zone description' },
                frequencyCap: {
                  type: 'object',
                  properties: {
                    impressions: { type: 'number' },
                    clicks: { type: 'number' },
                    period: { type: 'string', enum: ['hour', 'day', 'week', 'month'] }
                  }
                }
              },
              required: ['zoneId']
            }
          },
          {
            name: 'revive_banner_upload',
            description: 'Upload and create a new banner/creative',
            inputSchema: {
              type: 'object',
              properties: {
                campaignId: { type: 'number', description: 'Campaign ID' },
                name: { type: 'string', description: 'Banner name' },
                storageType: { type: 'string', enum: ['web', 'sql', 'html', 'text'], description: 'Storage type' },
                imageUrl: { type: 'string', description: 'Image URL for web storage' },
                htmlTemplate: { type: 'string', description: 'HTML template for HTML banners' },
                width: { type: 'number', description: 'Banner width' },
                height: { type: 'number', description: 'Banner height' },
                weight: { type: 'number', description: 'Banner weight for rotation' },
                clickUrl: { type: 'string', description: 'Click destination URL' }
              },
              required: ['campaignId', 'name', 'storageType', 'width', 'height']
            }
          },
          {
            name: 'revive_banner_update',
            description: 'Update an existing banner',
            inputSchema: {
              type: 'object',
              properties: {
                bannerId: { type: 'number', description: 'Banner ID to update' },
                name: { type: 'string', description: 'Banner name' },
                weight: { type: 'number', description: 'Banner weight' },
                status: { type: 'string', enum: ['active', 'paused', 'inactive'], description: 'Banner status' },
                clickUrl: { type: 'string', description: 'Click destination URL' }
              },
              required: ['bannerId']
            }
          },
          {
            name: 'revive_targeting_set',
            description: 'Configure targeting rules for campaigns or banners',
            inputSchema: {
              type: 'object',
              properties: {
                entityType: { type: 'string', enum: ['campaign', 'banner'], description: 'Entity to target' },
                entityId: { type: 'number', description: 'Entity ID' },
                targeting: {
                  type: 'object',
                  properties: {
                    country: { type: 'array', items: { type: 'string' } },
                    region: { type: 'array', items: { type: 'string' } },
                    city: { type: 'array', items: { type: 'string' } },
                    language: { type: 'array', items: { type: 'string' } },
                    browser: { type: 'array', items: { type: 'string' } },
                    os: { type: 'array', items: { type: 'string' } },
                    device: { type: 'array', items: { type: 'string' } },
                    dayOfWeek: { type: 'array', items: { type: 'number' } },
                    hourOfDay: { type: 'array', items: { type: 'number' } },
                    keywords: { type: 'array', items: { type: 'string' } }
                  }
                }
              },
              required: ['entityType', 'entityId', 'targeting']
            }
          },
          {
            name: 'revive_stats_generate',
            description: 'Generate performance statistics and reports',
            inputSchema: {
              type: 'object',
              properties: {
                entityType: { type: 'string', enum: ['campaign', 'banner', 'zone', 'advertiser', 'publisher'], description: 'Entity type' },
                entityId: { type: 'number', description: 'Entity ID (optional for overall stats)' },
                startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
                endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
                granularity: { type: 'string', enum: ['hour', 'day', 'week', 'month'], description: 'Report granularity' },
                metrics: { type: 'array', items: { type: 'string' }, description: 'Metrics to include' }
              },
              required: ['entityType', 'startDate', 'endDate']
            }
          }
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'revive_campaign_create':
            return await this.handleCreateCampaign(args as unknown as CreateCampaignArgs);
          case 'revive_campaign_list':
            return await this.handleListCampaigns((args || {}) as unknown as ListCampaignsArgs);
          case 'revive_campaign_update':
            return await this.handleUpdateCampaign(args as unknown as UpdateCampaignArgs);
          case 'revive_zone_configure':
            return await this.handleConfigureZone(args as unknown as ConfigureZoneArgs);
          case 'revive_zone_update':
            return await this.handleUpdateZone(args as unknown as UpdateZoneArgs);
          case 'revive_banner_upload':
            return await this.handleUploadBanner(args as unknown as UploadBannerArgs);
          case 'revive_banner_update':
            return await this.handleUpdateBanner(args as unknown as UpdateBannerArgs);
          case 'revive_targeting_set':
            return await this.handleSetTargeting(args as unknown as SetTargetingArgs);
          case 'revive_stats_generate':
            return await this.handleGenerateStats(args as unknown as GenerateStatsArgs);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        this.logger.error(`Error handling tool ${name}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [{ type: 'text' as const, text: `Error: ${errorMessage}` }],
          isError: true,
        };
      }
    });
  }

  private setupResourceHandlers(): void {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'campaign://list',
            name: 'Campaign List',
            description: 'List of all campaigns',
            mimeType: 'application/json',
          },
          {
            uri: 'zone://list',
            name: 'Zone List',
            description: 'List of all zones',
            mimeType: 'application/json',
          },
          {
            uri: 'banner://list',
            name: 'Banner List',
            description: 'List of all banners',
            mimeType: 'application/json',
          },
        ],
      };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;

      try {
        const [scheme, path] = uri.split('://');
        
        switch (scheme) {
          case 'campaign':
            if (path === 'list') {
              const campaigns = await this.reviveClient.listCampaigns({});
              return {
                contents: [
                  {
                    uri,
                    mimeType: 'application/json',
                    text: JSON.stringify(campaigns, null, 2),
                  },
                ],
              };
            }
            break;
          case 'zone':
          case 'banner':
            return {
              contents: [
                {
                  uri,
                  mimeType: 'application/json',
                  text: JSON.stringify({ message: `Resource ${scheme} not yet implemented` }, null, 2),
                },
              ],
            };
          default:
            throw new McpError(
              ErrorCode.InvalidRequest,
              `Unknown resource scheme: ${scheme}`
            );
        }

        throw new McpError(
          ErrorCode.InvalidRequest,
          `Resource not found: ${uri}`
        );
      } catch (error) {
        this.logger.error(`Error reading resource ${uri}:`, error);
        throw new McpError(
          ErrorCode.InternalError,
          error instanceof Error ? error.message : 'Unknown error occurred'
        );
      }
    });
  }

  private async handleCreateCampaign(args: CreateCampaignArgs) {
    const result = await this.reviveClient.createCampaign(args);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
    };
  }

  private async handleListCampaigns(args: ListCampaignsArgs) {
    const result = await this.reviveClient.listCampaigns(args);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
    };
  }

  private async handleUpdateCampaign(args: UpdateCampaignArgs) {
    const result = await this.reviveClient.updateCampaign(args);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
    };
  }

  private async handleConfigureZone(args: ConfigureZoneArgs) {
    const result = await this.reviveClient.configureZone(args);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
    };
  }

  private async handleUpdateZone(args: UpdateZoneArgs) {
    const result = await this.reviveClient.updateZone(args);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
    };
  }

  private async handleUploadBanner(args: UploadBannerArgs) {
    const result = await this.reviveClient.uploadBanner(args);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
    };
  }

  private async handleUpdateBanner(args: UpdateBannerArgs) {
    const result = await this.reviveClient.updateBanner(args);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
    };
  }

  private async handleSetTargeting(args: SetTargetingArgs) {
    const result = await this.reviveClient.setTargeting(args);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
    };
  }

  private async handleGenerateStats(args: GenerateStatsArgs) {
    const result = await this.reviveClient.generateStats(args);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
    };
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info('Revive Adserver MCP server started');
  }
}

async function main(): Promise<void> {
  const server = new ReviveAdserverMcpServer();
  await server.start();
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}