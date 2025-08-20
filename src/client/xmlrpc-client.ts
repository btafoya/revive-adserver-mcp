import * as xmlrpc from 'xmlrpc';
import { Logger } from '../utils/logger.js';
import { ReviveConfig } from '../types/revive.js';

export interface XmlRpcCredentials {
  sessionId?: string;
  expiresAt?: Date;
}

export class ReviveXmlRpcClient {
  private client: xmlrpc.Client;
  private credentials: XmlRpcCredentials = {};
  private config: ReviveConfig;
  private logger: Logger;

  constructor(config: ReviveConfig) {
    this.config = config;
    this.logger = new Logger('ReviveXmlRpcClient');

    // Parse the XML-RPC endpoint URL
    const url = new URL(this.config.apiUrl);
    
    this.client = xmlrpc.createClient({
      host: url.hostname,
      port: url.port ? parseInt(url.port) : (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      headers: {
        'User-Agent': 'Revive Adserver MCP Client/1.0'
      }
    });

    this.logger.info(`XML-RPC client initialized for ${this.config.apiUrl}`);
  }

  /**
   * Authenticate with Revive Adserver using LogonXmlRpcService
   */
  async authenticate(): Promise<void> {
    try {
      this.logger.info('Authenticating with Revive Adserver XML-RPC API...');
      
      const sessionId = await this.methodCall('LogonXmlRpcService.logon', [
        this.config.username,
        this.config.password
      ]);

      if (!sessionId) {
        throw new Error('Authentication failed: No session ID returned');
      }

      this.credentials = {
        sessionId: sessionId as string,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      };

      this.logger.info('XML-RPC authentication successful');
    } catch (error) {
      this.logger.error('XML-RPC authentication failed:', error);
      throw new Error(`Failed to authenticate with Revive Adserver: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensure we have a valid session, authenticate if needed
   */
  async ensureAuthenticated(): Promise<void> {
    if (!this.credentials.sessionId) {
      await this.authenticate();
      return;
    }

    if (this.credentials.expiresAt && new Date() >= this.credentials.expiresAt) {
      this.logger.info('Session expired, re-authenticating...');
      await this.authenticate();
    }
  }

  /**
   * Make an XML-RPC method call
   */
  private async methodCall(method: string, params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.methodCall(method, params, (error: any, value: any) => {
        if (error) {
          this.logger.error(`XML-RPC call failed for ${method}:`, error);
          reject(error);
        } else {
          this.logger.debug(`XML-RPC call successful for ${method}`);
          resolve(value);
        }
      });
    });
  }

  /**
   * Make an authenticated XML-RPC service call
   */
  async callService(serviceName: string, methodName: string, params: any[] = []): Promise<any> {
    await this.ensureAuthenticated();
    
    const fullMethodName = `${serviceName}.${methodName}`;
    const serviceParams = [this.credentials.sessionId, ...params];
    
    try {
      return await this.methodCall(fullMethodName, serviceParams);
    } catch (error) {
      // Check if it's an authentication error and retry once
      if (error instanceof Error && error.message.includes('authentication')) {
        this.logger.info('Authentication error detected, retrying with fresh session...');
        this.credentials = {}; // Clear credentials
        await this.ensureAuthenticated();
        const retryParams = [this.credentials.sessionId, ...params];
        return await this.methodCall(fullMethodName, retryParams);
      }
      throw error;
    }
  }

  /**
   * Logout and clear session
   */
  async logout(): Promise<void> {
    if (this.credentials.sessionId) {
      try {
        await this.methodCall('LogonXmlRpcService.logoff', [this.credentials.sessionId]);
        this.logger.info('Successfully logged out from Revive Adserver');
      } catch (error) {
        this.logger.warn('Error during logout:', error);
      }
      this.credentials = {};
    }
  }

  /**
   * Test the connection to the XML-RPC server
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try to get API version or call a simple method
      await this.methodCall('system.listMethods', []);
      return true;
    } catch (error) {
      this.logger.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get the current session ID
   */
  getSessionId(): string | undefined {
    return this.credentials.sessionId;
  }

  /**
   * Check if we have valid credentials
   */
  isAuthenticated(): boolean {
    return !!(this.credentials.sessionId && 
             (!this.credentials.expiresAt || new Date() < this.credentials.expiresAt));
  }
}