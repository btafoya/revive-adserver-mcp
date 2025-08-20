import { ReviveConfig } from '../types/revive.js';
import { Logger } from '../utils/logger.js';

export class ReviveRestClient {
  private config: ReviveConfig;
  private logger: Logger;
  private baseUrl: string;

  constructor(config: ReviveConfig) {
    this.config = config;
    this.logger = new Logger('ReviveRestClient');
    
    // Try different base URL patterns for Revive 5.5.2 REST API
    this.baseUrl = this.config.apiUrl.replace('/api', '/www/api/v2');
    this.logger.info(`REST API client initialized for ${this.baseUrl}`);
  }

  private getAuthHeader(): string {
    const credentials = `${this.config.username}:${this.config.password}`;
    return `Basic ${Buffer.from(credentials).toString('base64')}`;
  }

  async makeRequest(method: string, endpoint: string, data?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      this.logger.debug(`${method} ${url}`);
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      this.logger.error(`REST API call failed for ${method} ${endpoint}:`, error);
      throw error;
    }
  }

  // Test different API endpoints to find the correct one
  async testConnection(): Promise<boolean> {
    const testEndpoints = [
      '/campaign',
      '/campaigns', 
      '/advertiser',
      '/advertisers',
      '/affiliate',
      '/affiliates',
      '/zone',
      '/zones'
    ];

    for (const endpoint of testEndpoints) {
      try {
        this.logger.debug(`Testing endpoint: ${endpoint}`);
        await this.makeRequest('GET', endpoint);
        this.logger.info(`✅ SUCCESS: Found working endpoint ${endpoint}`);
        return true;
      } catch (error) {
        this.logger.debug(`❌ Failed endpoint ${endpoint}: ${(error as Error).message}`);
        continue;
      }
    }

    // Try alternative base URLs
    const baseUrls = [
      this.config.apiUrl.replace('/api', '/api/v2'),
      this.config.apiUrl.replace('/api', '/openads/api/v2'), 
      this.config.apiUrl.replace('/api', '/revive/api/v2'),
      this.config.apiUrl + '/v2'
    ];

    for (const baseUrl of baseUrls) {
      try {
        const tempClient = new ReviveRestClient({...this.config, apiUrl: baseUrl});
        for (const endpoint of ['/campaigns', '/campaign']) {
          try {
            await tempClient.makeRequest('GET', endpoint);
            this.baseUrl = baseUrl;
            this.logger.info(`✅ SUCCESS: Found working base URL ${baseUrl}`);
            return true;
          } catch (error) {
            continue;
          }
        }
      } catch (error) {
        continue;
      }
    }

    return false;
  }

  // Campaign methods
  async getCampaigns(): Promise<any[]> {
    try {
      return await this.makeRequest('GET', '/campaigns');
    } catch (error) {
      // Try alternative endpoint
      return await this.makeRequest('GET', '/campaign');
    }
  }

  async createCampaign(campaignData: any): Promise<any> {
    try {
      return await this.makeRequest('POST', '/campaigns', campaignData);
    } catch (error) {
      // Try alternative endpoint
      return await this.makeRequest('POST', '/campaign', campaignData);
    }
  }

  // Zone methods
  async getZones(): Promise<any[]> {
    try {
      return await this.makeRequest('GET', '/zones');
    } catch (error) {
      // Try alternative endpoint
      return await this.makeRequest('GET', '/zone');
    }
  }

  async createZone(zoneData: any): Promise<any> {
    try {
      return await this.makeRequest('POST', '/zones', zoneData);
    } catch (error) {
      // Try alternative endpoint
      return await this.makeRequest('POST', '/zone', zoneData);
    }
  }

  // Publisher/Affiliate methods
  async getPublishers(): Promise<any[]> {
    try {
      return await this.makeRequest('GET', '/affiliates');
    } catch (error) {
      // Try alternative endpoint
      return await this.makeRequest('GET', '/affiliate');
    }
  }

  async createPublisher(publisherData: any): Promise<any> {
    try {
      return await this.makeRequest('POST', '/affiliates', publisherData);
    } catch (error) {
      // Try alternative endpoint  
      return await this.makeRequest('POST', '/affiliate', publisherData);
    }
  }

  // Advertiser methods
  async getAdvertisers(): Promise<any[]> {
    try {
      return await this.makeRequest('GET', '/advertisers');
    } catch (error) {
      // Try alternative endpoint
      return await this.makeRequest('GET', '/advertiser');
    }
  }
}