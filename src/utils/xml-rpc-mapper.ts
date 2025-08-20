import { Campaign, Zone, Banner, Statistics } from '../types/revive.js';

/**
 * Maps XML-RPC responses from Revive Adserver to standardized MCP format
 */
export class XmlRpcMapper {
  
  /**
   * Map XML-RPC campaign response to Campaign interface
   */
  static mapCampaign(xmlData: any): Campaign {
    return {
      id: xmlData.campaignId || xmlData.id,
      name: xmlData.campaignName || xmlData.name,
      advertiserId: xmlData.advertiserId,
      budget: xmlData.budget ? parseFloat(xmlData.budget) : undefined,
      budgetType: xmlData.budgetType,
      status: xmlData.status,
      priority: xmlData.priority ? parseInt(xmlData.priority) : undefined,
      startDate: xmlData.startDate ? new Date(xmlData.startDate) : undefined,
      endDate: xmlData.endDate ? new Date(xmlData.endDate) : undefined,
      impressions: xmlData.impressions ? parseInt(xmlData.impressions) : 0,
      clicks: xmlData.clicks ? parseInt(xmlData.clicks) : 0,
      conversions: xmlData.conversions ? parseInt(xmlData.conversions) : 0,
      revenue: xmlData.revenue ? parseFloat(xmlData.revenue) : 0,
      createdAt: xmlData.updated ? new Date(xmlData.updated) : undefined,
      updatedAt: xmlData.updated ? new Date(xmlData.updated) : undefined
    };
  }

  /**
   * Map XML-RPC zone response to Zone interface
   */
  static mapZone(xmlData: any): Zone {
    return {
      id: xmlData.zoneId || xmlData.id,
      name: xmlData.zoneName || xmlData.name,
      websiteId: xmlData.websiteId || xmlData.publisherId,
      type: xmlData.type || xmlData.zoneType,
      width: xmlData.width ? parseInt(xmlData.width) : undefined,
      height: xmlData.height ? parseInt(xmlData.height) : undefined,
      description: xmlData.description,
      delivery: xmlData.delivery,
      frequencyCap: xmlData.frequencyCap ? {
        impressions: xmlData.frequencyCap.impressions,
        clicks: xmlData.frequencyCap.clicks,
        period: xmlData.frequencyCap.period
      } : undefined,
      targeting: xmlData.targeting,
      code: xmlData.code || xmlData.invocationCode,
      impressions: xmlData.impressions ? parseInt(xmlData.impressions) : 0,
      clicks: xmlData.clicks ? parseInt(xmlData.clicks) : 0,
      revenue: xmlData.revenue ? parseFloat(xmlData.revenue) : 0,
      createdAt: xmlData.updated ? new Date(xmlData.updated) : undefined,
      updatedAt: xmlData.updated ? new Date(xmlData.updated) : undefined
    };
  }

  /**
   * Map XML-RPC banner response to Banner interface
   */
  static mapBanner(xmlData: any): Banner {
    return {
      id: xmlData.bannerId || xmlData.id,
      name: xmlData.bannerName || xmlData.name,
      campaignId: xmlData.campaignId,
      storageType: xmlData.storageType,
      imageUrl: xmlData.imageUrl || xmlData.filename,
      htmlTemplate: xmlData.htmlTemplate || xmlData.htmlcode,
      width: xmlData.width ? parseInt(xmlData.width) : 0,
      height: xmlData.height ? parseInt(xmlData.height) : 0,
      weight: xmlData.weight ? parseInt(xmlData.weight) : 1,
      status: xmlData.status,
      clickUrl: xmlData.clickUrl || xmlData.url,
      targeting: xmlData.targeting,
      impressions: xmlData.impressions ? parseInt(xmlData.impressions) : 0,
      clicks: xmlData.clicks ? parseInt(xmlData.clicks) : 0,
      conversions: xmlData.conversions ? parseInt(xmlData.conversions) : 0,
      conversionRate: xmlData.conversionRate ? parseFloat(xmlData.conversionRate) : 0,
      revenue: xmlData.revenue ? parseFloat(xmlData.revenue) : 0,
      createdAt: xmlData.updated ? new Date(xmlData.updated) : undefined,
      updatedAt: xmlData.updated ? new Date(xmlData.updated) : undefined
    };
  }

  /**
   * Map XML-RPC statistics response to Statistics interface
   */
  static mapStatistics(xmlData: any): Statistics {
    return {
      entityType: xmlData.entityType || 'unknown',
      entityId: xmlData.entityId,
      date: xmlData.date ? new Date(xmlData.date) : new Date(),
      impressions: xmlData.impressions ? parseInt(xmlData.impressions) : 0,
      clicks: xmlData.clicks ? parseInt(xmlData.clicks) : 0,
      conversions: xmlData.conversions ? parseInt(xmlData.conversions) : 0,
      clickRate: xmlData.clickRate ? parseFloat(xmlData.clickRate) : 0,
      conversionRate: xmlData.conversionRate ? parseFloat(xmlData.conversionRate) : 0,
      revenue: xmlData.revenue ? parseFloat(xmlData.revenue) : 0,
      cost: xmlData.cost ? parseFloat(xmlData.cost) : 0,
      ecpm: xmlData.ecpm ? parseFloat(xmlData.ecpm) : 0,
      ecpc: xmlData.ecpc ? parseFloat(xmlData.ecpc) : 0,
      ecpa: xmlData.ecpa ? parseFloat(xmlData.ecpa) : 0
    };
  }

  /**
   * Map array of XML-RPC campaign responses
   */
  static mapCampaigns(xmlDataArray: any[]): Campaign[] {
    if (!Array.isArray(xmlDataArray)) {
      return [];
    }
    return xmlDataArray.map(item => this.mapCampaign(item));
  }

  /**
   * Map array of XML-RPC zone responses
   */
  static mapZones(xmlDataArray: any[]): Zone[] {
    if (!Array.isArray(xmlDataArray)) {
      return [];
    }
    return xmlDataArray.map(item => this.mapZone(item));
  }

  /**
   * Map array of XML-RPC banner responses
   */
  static mapBanners(xmlDataArray: any[]): Banner[] {
    if (!Array.isArray(xmlDataArray)) {
      return [];
    }
    return xmlDataArray.map(item => this.mapBanner(item));
  }

  /**
   * Map array of XML-RPC statistics responses
   */
  static mapStatisticsArray(xmlDataArray: any[]): Statistics[] {
    if (!Array.isArray(xmlDataArray)) {
      return [];
    }
    return xmlDataArray.map(item => this.mapStatistics(item));
  }

  /**
   * Safely parse integer values from XML-RPC responses
   */
  static parseInt(value: any, defaultValue: number = 0): number {
    if (typeof value === 'number') return Math.floor(value);
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  }

  /**
   * Safely parse float values from XML-RPC responses
   */
  static parseFloat(value: any, defaultValue: number = 0): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  }

  /**
   * Safely parse date values from XML-RPC responses
   */
  static parseDate(value: any): Date | undefined {
    if (!value) return undefined;
    
    if (value instanceof Date) return value;
    
    if (typeof value === 'string') {
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    
    return undefined;
  }

  /**
   * Create campaign data structure for XML-RPC requests
   */
  static createCampaignRequest(data: any): any {
    return {
      campaignName: data.name,
      advertiserId: data.advertiserId,
      budget: data.budget,
      budgetType: data.budgetType,
      startDate: data.startDate,
      endDate: data.endDate,
      priority: data.priority,
      status: data.status
    };
  }

  /**
   * Create zone data structure for XML-RPC requests
   */
  static createZoneRequest(data: any): any {
    return {
      zoneName: data.name,
      publisherId: data.websiteId,
      type: data.type,
      width: data.width,
      height: data.height,
      description: data.description,
      delivery: data.delivery
    };
  }

  /**
   * Create banner data structure for XML-RPC requests
   */
  static createBannerRequest(data: any): any {
    return {
      campaignId: data.campaignId,
      bannerName: data.name,
      storageType: data.storageType,
      filename: data.imageUrl,
      htmlcode: data.htmlTemplate,
      width: data.width,
      height: data.height,
      weight: data.weight || 1,
      url: data.clickUrl,
      status: data.status
    };
  }
}