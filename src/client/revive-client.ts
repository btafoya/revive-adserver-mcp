import {
  ReviveConfig,
  ReviveApiResponse,
  Campaign,
  Zone,
  Banner,
  Statistics,
} from '../types/revive.js';
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
} from '../types/mcp.js';
import { Logger } from '../utils/logger.js';
import { ReviveXmlRpcClient } from './xmlrpc-client.js';
import { XmlRpcMapper } from '../utils/xml-rpc-mapper.js';

export class ReviveApiClient {
  private config: ReviveConfig;
  private xmlRpcClient: ReviveXmlRpcClient;
  private logger: Logger;

  constructor(config: ReviveConfig) {
    this.config = config;
    this.logger = new Logger('ReviveApiClient');
    this.xmlRpcClient = new ReviveXmlRpcClient(config);
  }

  async createCampaign(args: CreateCampaignArgs): Promise<ReviveApiResponse<Campaign>> {
    try {
      this.logger.info(`Creating campaign: ${args.name}`);
      
      const campaignData = XmlRpcMapper.createCampaignRequest(args);
      const response = await this.xmlRpcClient.callService(
        'CampaignXmlRpcService',
        'addCampaign',
        [campaignData]
      );

      const campaign = XmlRpcMapper.mapCampaign(response);
      
      return {
        success: true,
        data: campaign,
      };
    } catch (error) {
      this.logger.error('Error creating campaign:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create campaign',
      };
    }
  }

  async listCampaigns(args: ListCampaignsArgs): Promise<ReviveApiResponse<Campaign[]>> {
    try {
      this.logger.info('Listing campaigns with filters:', args);
      
      let campaigns: any[] = [];
      
      if (args.advertiserId) {
        // Get campaigns for specific advertiser
        campaigns = await this.xmlRpcClient.callService(
          'CampaignXmlRpcService',
          'getCampaignListByAdvertiserId',
          [args.advertiserId]
        );
      } else {
        // Get all campaigns (requires getting all advertisers first)
        const advertisers = await this.xmlRpcClient.callService(
          'AdvertiserXmlRpcService',
          'getAdvertiserListByAgencyId',
          []
        );
        
        for (const advertiser of advertisers) {
          const advertiserCampaigns = await this.xmlRpcClient.callService(
            'CampaignXmlRpcService',
            'getCampaignListByAdvertiserId',
            [advertiser.advertiserId]
          );
          campaigns.push(...advertiserCampaigns);
        }
      }

      // Apply client-side filtering and sorting
      let filteredCampaigns = campaigns;
      
      if (args.status) {
        filteredCampaigns = filteredCampaigns.filter(c => c.status === args.status);
      }
      
      if (args.sortBy) {
        filteredCampaigns.sort((a, b) => {
          const aVal = a[args.sortBy!];
          const bVal = b[args.sortBy!];
          const order = args.sortOrder === 'desc' ? -1 : 1;
          return aVal < bVal ? -order : aVal > bVal ? order : 0;
        });
      }
      
      // Apply pagination
      if (args.offset || args.limit) {
        const start = args.offset || 0;
        const end = args.limit ? start + args.limit : undefined;
        filteredCampaigns = filteredCampaigns.slice(start, end);
      }

      const mappedCampaigns = XmlRpcMapper.mapCampaigns(filteredCampaigns);

      return {
        success: true,
        data: mappedCampaigns,
      };
    } catch (error) {
      this.logger.error('Error listing campaigns:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list campaigns',
      };
    }
  }

  async updateCampaign(args: UpdateCampaignArgs): Promise<ReviveApiResponse<Campaign>> {
    try {
      this.logger.info(`Updating campaign ${args.campaignId}`);
      
      // First get the existing campaign
      const existingCampaign = await this.xmlRpcClient.callService(
        'CampaignXmlRpcService',
        'getCampaign',
        [args.campaignId]
      );
      
      // Merge updates with existing data
      const updateData = {
        ...existingCampaign,
        ...XmlRpcMapper.createCampaignRequest(args)
      };

      const response = await this.xmlRpcClient.callService(
        'CampaignXmlRpcService',
        'modifyCampaign',
        [updateData]
      );

      const campaign = XmlRpcMapper.mapCampaign(response);

      return {
        success: true,
        data: campaign,
      };
    } catch (error) {
      this.logger.error('Error updating campaign:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update campaign',
      };
    }
  }

  async configureZone(args: ConfigureZoneArgs): Promise<ReviveApiResponse<Zone>> {
    try {
      this.logger.info(`Configuring zone: ${args.name}`);
      
      const zoneData = XmlRpcMapper.createZoneRequest(args);
      const response = await this.xmlRpcClient.callService(
        'ZoneXmlRpcService',
        'addZone',
        [zoneData]
      );

      const zone = XmlRpcMapper.mapZone(response);

      return {
        success: true,
        data: zone,
      };
    } catch (error) {
      this.logger.error('Error configuring zone:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to configure zone',
      };
    }
  }

  async updateZone(args: UpdateZoneArgs): Promise<ReviveApiResponse<Zone>> {
    try {
      this.logger.info(`Updating zone ${args.zoneId}`);
      
      // First get the existing zone
      const existingZone = await this.xmlRpcClient.callService(
        'ZoneXmlRpcService',
        'getZone',
        [args.zoneId]
      );
      
      // Merge updates with existing data
      const updateData = {
        ...existingZone,
        ...XmlRpcMapper.createZoneRequest(args)
      };

      const response = await this.xmlRpcClient.callService(
        'ZoneXmlRpcService',
        'modifyZone',
        [updateData]
      );

      const zone = XmlRpcMapper.mapZone(response);

      return {
        success: true,
        data: zone,
      };
    } catch (error) {
      this.logger.error('Error updating zone:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update zone',
      };
    }
  }

  async uploadBanner(args: UploadBannerArgs): Promise<ReviveApiResponse<Banner>> {
    try {
      this.logger.info(`Uploading banner: ${args.name}`);
      
      const bannerData = XmlRpcMapper.createBannerRequest(args);
      const response = await this.xmlRpcClient.callService(
        'BannerXmlRpcService',
        'addBanner',
        [bannerData]
      );

      const banner = XmlRpcMapper.mapBanner(response);

      return {
        success: true,
        data: banner,
      };
    } catch (error) {
      this.logger.error('Error uploading banner:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload banner',
      };
    }
  }

  async updateBanner(args: UpdateBannerArgs): Promise<ReviveApiResponse<Banner>> {
    try {
      this.logger.info(`Updating banner ${args.bannerId}`);
      
      // First get the existing banner
      const existingBanner = await this.xmlRpcClient.callService(
        'BannerXmlRpcService',
        'getBanner',
        [args.bannerId]
      );
      
      // Merge updates with existing data
      const updateData = {
        ...existingBanner,
        ...XmlRpcMapper.createBannerRequest(args)
      };

      const response = await this.xmlRpcClient.callService(
        'BannerXmlRpcService',
        'modifyBanner',
        [updateData]
      );

      const banner = XmlRpcMapper.mapBanner(response);

      return {
        success: true,
        data: banner,
      };
    } catch (error) {
      this.logger.error('Error updating banner:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update banner',
      };
    }
  }

  async setTargeting(args: SetTargetingArgs): Promise<ReviveApiResponse<any>> {
    try {
      this.logger.info(`Setting targeting for ${args.entityType} ${args.entityId}`);
      
      if (args.entityType === 'campaign') {
        // For campaigns, targeting is usually applied to individual banners
        const banners = await this.xmlRpcClient.callService(
          'BannerXmlRpcService',
          'getBannerListByCampaignId',
          [args.entityId]
        );
        
        const results = [];
        for (const banner of banners) {
          const result = await this.xmlRpcClient.callService(
            'BannerXmlRpcService',
            'setBannerTargeting',
            [banner.bannerId, args.targeting]
          );
          results.push(result);
        }
        
        return {
          success: true,
          data: { appliedToBanners: results.length, results },
        };
      } else {
        // Direct banner targeting
        const result = await this.xmlRpcClient.callService(
          'BannerXmlRpcService',
          'setBannerTargeting',
          [args.entityId, args.targeting]
        );

        return {
          success: true,
          data: result,
        };
      }
    } catch (error) {
      this.logger.error('Error setting targeting:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to set targeting',
      };
    }
  }

  async generateStats(args: GenerateStatsArgs): Promise<ReviveApiResponse<Statistics[]>> {
    try {
      this.logger.info(`Generating stats for ${args.entityType} from ${args.startDate} to ${args.endDate}`);
      
      let statisticsData: any[] = [];
      
      switch (args.entityType) {
        case 'campaign':
          if (args.entityId) {
            statisticsData = await this.xmlRpcClient.callService(
              'CampaignXmlRpcService',
              'getCampaignStatistics',
              [args.entityId, args.startDate, args.endDate]
            );
          }
          break;
          
        case 'banner':
          if (args.entityId) {
            statisticsData = await this.xmlRpcClient.callService(
              'BannerXmlRpcService',
              'getBannerStatistics',
              [args.entityId, args.startDate, args.endDate]
            );
          }
          break;
          
        case 'zone':
          if (args.entityId) {
            statisticsData = await this.xmlRpcClient.callService(
              'ZoneXmlRpcService',
              'getZoneStatistics',
              [args.entityId, args.startDate, args.endDate]
            );
          }
          break;
          
        case 'advertiser':
          if (args.entityId) {
            statisticsData = await this.xmlRpcClient.callService(
              'AdvertiserXmlRpcService',
              'getAdvertiserStatistics',
              [args.entityId, args.startDate, args.endDate]
            );
          }
          break;
          
        case 'publisher':
          if (args.entityId) {
            statisticsData = await this.xmlRpcClient.callService(
              'PublisherXmlRpcService',
              'getPublisherStatistics',
              [args.entityId, args.startDate, args.endDate]
            );
          }
          break;
          
        default:
          throw new Error(`Unsupported entity type: ${args.entityType}`);
      }

      const statistics = XmlRpcMapper.mapStatisticsArray(statisticsData);

      return {
        success: true,
        data: statistics,
      };
    } catch (error) {
      this.logger.error('Error generating stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate statistics',
      };
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      return await this.xmlRpcClient.testConnection();
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Get list of advertisers (useful for campaign management)
   */
  async getAdvertisers(): Promise<ReviveApiResponse<any[]>> {
    try {
      const advertisers = await this.xmlRpcClient.callService(
        'AdvertiserXmlRpcService',
        'getAdvertiserListByAgencyId',
        []
      );

      return {
        success: true,
        data: advertisers,
      };
    } catch (error) {
      this.logger.error('Error getting advertisers:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get advertisers',
      };
    }
  }

  /**
   * Get list of publishers (useful for zone management)
   */
  async getPublishers(): Promise<ReviveApiResponse<any[]>> {
    try {
      const publishers = await this.xmlRpcClient.callService(
        'PublisherXmlRpcService',
        'getPublisherListByAgencyId',
        []
      );

      return {
        success: true,
        data: publishers,
      };
    } catch (error) {
      this.logger.error('Error getting publishers:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get publishers',
      };
    }
  }

  /**
   * Get banners for a specific campaign
   */
  async getBannersByCampaign(campaignId: number): Promise<ReviveApiResponse<Banner[]>> {
    try {
      const banners = await this.xmlRpcClient.callService(
        'BannerXmlRpcService',
        'getBannerListByCampaignId',
        [campaignId]
      );

      const mappedBanners = XmlRpcMapper.mapBanners(banners);

      return {
        success: true,
        data: mappedBanners,
      };
    } catch (error) {
      this.logger.error('Error getting banners:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get banners',
      };
    }
  }

  /**
   * Get zones for a specific publisher
   */
  async getZonesByPublisher(publisherId: number): Promise<ReviveApiResponse<Zone[]>> {
    try {
      const zones = await this.xmlRpcClient.callService(
        'ZoneXmlRpcService',
        'getZoneListByPublisherId',
        [publisherId]
      );

      const mappedZones = XmlRpcMapper.mapZones(zones);

      return {
        success: true,
        data: mappedZones,
      };
    } catch (error) {
      this.logger.error('Error getting zones:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get zones',
      };
    }
  }
}