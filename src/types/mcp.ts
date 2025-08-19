import { Campaign, Zone, Banner, Statistics, ReportPeriod, TargetingRules } from './revive.js';

export interface CreateCampaignArgs {
  name: string;
  advertiserId: number;
  budget?: number;
  budgetType?: string;
  startDate?: string;
  endDate?: string;
  priority?: number;
}

export interface UpdateCampaignArgs {
  campaignId: number;
  name?: string;
  budget?: number;
  budgetType?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  priority?: number;
}

export interface ListCampaignsArgs {
  advertiserId?: number;
  status?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ConfigureZoneArgs {
  name: string;
  websiteId: number;
  type: string;
  width?: number;
  height?: number;
  description?: string;
  delivery?: string;
  frequencyCap?: {
    impressions?: number;
    clicks?: number;
    period: string;
  };
}

export interface UpdateZoneArgs {
  zoneId: number;
  name?: string;
  description?: string;
  frequencyCap?: {
    impressions?: number;
    clicks?: number;
    period: string;
  };
  targeting?: TargetingRules;
}

export interface UploadBannerArgs {
  campaignId: number;
  name: string;
  storageType: string;
  imageUrl?: string;
  htmlTemplate?: string;
  width: number;
  height: number;
  weight?: number;
  clickUrl?: string;
}

export interface UpdateBannerArgs {
  bannerId: number;
  name?: string;
  weight?: number;
  status?: string;
  clickUrl?: string;
  targeting?: TargetingRules;
}

export interface SetTargetingArgs {
  entityType: 'campaign' | 'banner';
  entityId: number;
  targeting: TargetingRules;
}

export interface GenerateStatsArgs {
  entityType: 'campaign' | 'banner' | 'zone' | 'advertiser' | 'publisher';
  entityId?: number;
  startDate: string;
  endDate: string;
  granularity?: string;
  metrics?: string[];
}

export interface McpToolResponse<T = any> {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}

export interface CampaignResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

export interface ZoneResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

export interface BannerResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

export interface ReportResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}