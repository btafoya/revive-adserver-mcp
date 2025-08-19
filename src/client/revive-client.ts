import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ReviveConfig,
  ReviveApiResponse,
  Campaign,
  Zone,
  Banner,
  Statistics,
  ApiCredentials,
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

export class ReviveApiClient {
  private config: ReviveConfig;
  private httpClient: AxiosInstance;
  private credentials: ApiCredentials = {};
  private logger: Logger;

  constructor(config: ReviveConfig) {
    this.config = config;
    this.logger = new Logger('ReviveApiClient');

    this.httpClient = axios.create({
      baseURL: this.config.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupRequestInterceptors();
    this.setupResponseInterceptors();
  }

  private setupRequestInterceptors(): void {
    this.httpClient.interceptors.request.use(
      async (config) => {
        await this.ensureAuthenticated();
        
        if (this.credentials.sessionId) {
          config.headers['X-OpenX-Session-Id'] = this.credentials.sessionId;
        }
        
        if (this.credentials.token) {
          config.headers['Authorization'] = `Bearer ${this.credentials.token}`;
        }

        this.logger.debug(`Making request to ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );
  }

  private setupResponseInterceptors(): void {
    this.httpClient.interceptors.response.use(
      (response: AxiosResponse) => {
        this.logger.debug(`Response ${response.status} from ${response.config.url}`);
        return response;
      },
      async (error) => {
        this.logger.error('Response error:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
          this.logger.info('Authentication expired, attempting to re-authenticate...');
          this.credentials = {};
          
          try {
            await this.authenticate();
            const originalRequest = error.config;
            if (originalRequest && !originalRequest._retry) {
              originalRequest._retry = true;
              return this.httpClient(originalRequest);
            }
          } catch (authError) {
            this.logger.error('Re-authentication failed:', authError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  private async ensureAuthenticated(): Promise<void> {
    if (!this.credentials.sessionId && !this.credentials.token) {
      await this.authenticate();
    }

    if (this.credentials.expiresAt && new Date() >= this.credentials.expiresAt) {
      this.logger.info('Credentials expired, re-authenticating...');
      await this.authenticate();
    }
  }

  private async authenticate(): Promise<void> {
    try {
      this.logger.info('Authenticating with Revive Adserver...');
      
      const response = await axios.post(
        `${this.config.apiUrl}/auth/login`,
        {
          username: this.config.username,
          password: this.config.password,
        },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;
      
      if (data.success) {
        this.credentials = {
          sessionId: data.sessionId,
          token: data.token,
          expiresAt: data.expiresIn ? new Date(Date.now() + data.expiresIn * 1000) : undefined,
        };
        this.logger.info('Authentication successful');
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      this.logger.error('Authentication failed:', error);
      throw new Error(`Failed to authenticate with Revive Adserver: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createCampaign(args: CreateCampaignArgs): Promise<ReviveApiResponse<Campaign>> {
    try {
      this.logger.info(`Creating campaign: ${args.name}`);
      
      const response = await this.httpClient.post('/campaigns', {
        campaignName: args.name,
        advertiserId: args.advertiserId,
        budget: args.budget,
        budgetType: args.budgetType,
        startDate: args.startDate,
        endDate: args.endDate,
        priority: args.priority,
      });

      return {
        success: true,
        data: response.data,
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
      
      const params = new URLSearchParams();
      if (args.advertiserId) params.append('advertiserId', args.advertiserId.toString());
      if (args.status) params.append('status', args.status);
      if (args.limit) params.append('limit', args.limit.toString());
      if (args.offset) params.append('offset', args.offset.toString());
      if (args.sortBy) params.append('sortBy', args.sortBy);
      if (args.sortOrder) params.append('sortOrder', args.sortOrder);

      const response = await this.httpClient.get(`/campaigns?${params.toString()}`);

      return {
        success: true,
        data: response.data,
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
      
      const updateData: any = {};
      if (args.name) updateData.campaignName = args.name;
      if (args.budget) updateData.budget = args.budget;
      if (args.budgetType) updateData.budgetType = args.budgetType;
      if (args.startDate) updateData.startDate = args.startDate;
      if (args.endDate) updateData.endDate = args.endDate;
      if (args.status) updateData.status = args.status;
      if (args.priority) updateData.priority = args.priority;

      const response = await this.httpClient.put(`/campaigns/${args.campaignId}`, updateData);

      return {
        success: true,
        data: response.data,
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
      
      const response = await this.httpClient.post('/zones', {
        zoneName: args.name,
        websiteId: args.websiteId,
        zoneType: args.type,
        width: args.width,
        height: args.height,
        description: args.description,
        delivery: args.delivery,
        frequencyCap: args.frequencyCap,
      });

      return {
        success: true,
        data: response.data,
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
      
      const updateData: any = {};
      if (args.name) updateData.zoneName = args.name;
      if (args.description) updateData.description = args.description;
      if (args.frequencyCap) updateData.frequencyCap = args.frequencyCap;
      if (args.targeting) updateData.targeting = args.targeting;

      const response = await this.httpClient.put(`/zones/${args.zoneId}`, updateData);

      return {
        success: true,
        data: response.data,
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
      
      const response = await this.httpClient.post('/banners', {
        campaignId: args.campaignId,
        bannerName: args.name,
        storageType: args.storageType,
        imageUrl: args.imageUrl,
        htmlTemplate: args.htmlTemplate,
        width: args.width,
        height: args.height,
        weight: args.weight || 1,
        clickUrl: args.clickUrl,
      });

      return {
        success: true,
        data: response.data,
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
      
      const updateData: any = {};
      if (args.name) updateData.bannerName = args.name;
      if (args.weight !== undefined) updateData.weight = args.weight;
      if (args.status) updateData.status = args.status;
      if (args.clickUrl) updateData.clickUrl = args.clickUrl;
      if (args.targeting) updateData.targeting = args.targeting;

      const response = await this.httpClient.put(`/banners/${args.bannerId}`, updateData);

      return {
        success: true,
        data: response.data,
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
      
      const endpoint = args.entityType === 'campaign' ? 'campaigns' : 'banners';
      const response = await this.httpClient.post(`/${endpoint}/${args.entityId}/targeting`, {
        targeting: args.targeting,
      });

      return {
        success: true,
        data: response.data,
      };
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
      
      const params = new URLSearchParams({
        entityType: args.entityType,
        startDate: args.startDate,
        endDate: args.endDate,
      });
      
      if (args.entityId) params.append('entityId', args.entityId.toString());
      if (args.granularity) params.append('granularity', args.granularity);
      if (args.metrics) params.append('metrics', args.metrics.join(','));

      const response = await this.httpClient.get(`/statistics?${params.toString()}`);

      return {
        success: true,
        data: response.data,
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
      await this.httpClient.get('/health');
      return true;
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return false;
    }
  }
}