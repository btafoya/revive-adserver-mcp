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
  id: number;
  name: string;
  advertiserId: number;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  budgetType?: string;
  priority?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  revenue?: number;
  createdAt?: Date;
  updatedAt?: Date;
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
  id: number;
  name: string;
  websiteId: number;
  type: string;
  width?: number;
  height?: number;
  description?: string;
  delivery?: string;
  frequencyCap?: FrequencyCap;
  targeting?: TargetingRules;
  code?: string;
  impressions?: number;
  clicks?: number;
  revenue?: number;
  createdAt?: Date;
  updatedAt?: Date;
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
  id: number;
  name: string;
  campaignId: number;
  storageType: string;
  imageUrl?: string;
  htmlTemplate?: string;
  width: number;
  height: number;
  weight: number;
  status?: string;
  clickUrl?: string;
  targeting?: TargetingRules;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  conversionRate?: number;
  revenue?: number;
  createdAt?: Date;
  updatedAt?: Date;
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
  entityType: string;
  entityId?: number;
  date: Date;
  impressions: number;
  clicks: number;
  conversions: number;
  clickRate: number;
  conversionRate: number;
  revenue: number;
  cost: number;
  ecpm: number;
  ecpc: number;
  ecpa: number;
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