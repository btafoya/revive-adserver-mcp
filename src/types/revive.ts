export interface ReviveConfig {
  apiUrl: string;
  username: string;
  password: string;
  databaseHost?: string;
  databaseName?: string;
}

export interface ReviveApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Campaign {
  campaignId: number;
  campaignName: string;
  advertiserId: number;
  status: CampaignStatus;
  startDate?: string;
  endDate?: string;
  budget?: number;
  budgetType?: BudgetType;
  targetImpressions?: number;
  targetClicks?: number;
  weight?: number;
  priority?: number;
  createdAt: string;
  updatedAt: string;
}

export enum CampaignStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  PENDING = 'pending'
}

export enum BudgetType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  TOTAL = 'total'
}

export interface Zone {
  zoneId: number;
  zoneName: string;
  websiteId: number;
  zoneType: ZoneType;
  width?: number;
  height?: number;
  description?: string;
  delivery: DeliveryMethod;
  frequencyCap?: FrequencyCap;
  targeting?: TargetingRules;
  createdAt: string;
  updatedAt: string;
}

export enum ZoneType {
  BANNER = 'banner',
  INTERSTITIAL = 'interstitial',
  POPUP = 'popup',
  TEXT = 'text',
  EMAIL = 'email'
}

export enum DeliveryMethod {
  JAVASCRIPT = 'javascript',
  IFRAME = 'iframe',
  LOCAL = 'local',
  XMLHTTPREQUEST = 'xmlhttprequest'
}

export interface FrequencyCap {
  impressions?: number;
  clicks?: number;
  period: TimePeriod;
}

export enum TimePeriod {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month'
}

export interface Banner {
  bannerId: number;
  campaignId: number;
  bannerName: string;
  storageType: StorageType;
  imageUrl?: string;
  htmlTemplate?: string;
  width: number;
  height: number;
  weight: number;
  status: BannerStatus;
  clickUrl?: string;
  targeting?: TargetingRules;
  createdAt: string;
  updatedAt: string;
}

export enum StorageType {
  WEB = 'web',
  SQL = 'sql',
  HTML = 'html',
  TEXT = 'text'
}

export enum BannerStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  INACTIVE = 'inactive'
}

export interface TargetingRules {
  country?: string[];
  region?: string[];
  city?: string[];
  language?: string[];
  browser?: string[];
  os?: string[];
  device?: DeviceType[];
  dayOfWeek?: number[];
  hourOfDay?: number[];
  keywords?: string[];
  customVariables?: Record<string, string>;
}

export enum DeviceType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet'
}

export interface Statistics {
  entity: EntityType;
  entityId: number;
  period: ReportPeriod;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions?: number;
  conversionRate?: number;
  revenue?: number;
  cost?: number;
  ecpm?: number;
  startDate: string;
  endDate: string;
}

export enum EntityType {
  CAMPAIGN = 'campaign',
  BANNER = 'banner',
  ZONE = 'zone',
  ADVERTISER = 'advertiser',
  PUBLISHER = 'publisher'
}

export interface ReportPeriod {
  startDate: string;
  endDate: string;
  granularity: TimeGranularity;
}

export enum TimeGranularity {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month'
}

export interface ApiCredentials {
  sessionId?: string;
  token?: string;
  expiresAt?: Date;
}

export interface ConnectionPool {
  maxConnections: number;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}