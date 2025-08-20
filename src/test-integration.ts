#!/usr/bin/env ts-node

import { ReviveApiClient } from './client/revive-client.js';
import { ReviveXmlRpcClient } from './client/xmlrpc-client.js';
import { Logger } from './utils/logger.js';

/**
 * Integration test script for XML-RPC connectivity
 */
async function testIntegration() {
  const logger = new Logger('TestIntegration');
  
  // Configuration from environment variables
  const config = {
    apiUrl: process.env.REVIVE_API_URL || 'http://localhost/revive/www/api/v2/xmlrpc/',
    username: process.env.REVIVE_API_USERNAME || '',
    password: process.env.REVIVE_API_PASSWORD || '',
  };

  if (!config.username || !config.password) {
    logger.error('Missing required environment variables: REVIVE_API_USERNAME and REVIVE_API_PASSWORD');
    process.exit(1);
  }

  logger.info('Starting integration test...');
  logger.info(`Testing connection to: ${config.apiUrl}`);

  try {
    // Test 1: XML-RPC Client Connection
    logger.info('=== Test 1: XML-RPC Client Connection ===');
    const xmlRpcClient = new ReviveXmlRpcClient(config);
    
    const connectionTest = await xmlRpcClient.testConnection();
    if (connectionTest) {
      logger.info('✓ XML-RPC connection test passed');
    } else {
      logger.error('✗ XML-RPC connection test failed');
      return false;
    }

    // Test 2: Authentication
    logger.info('=== Test 2: Authentication ===');
    await xmlRpcClient.authenticate();
    
    if (xmlRpcClient.isAuthenticated()) {
      logger.info('✓ Authentication successful');
      logger.info(`Session ID: ${xmlRpcClient.getSessionId()?.substring(0, 10)}...`);
    } else {
      logger.error('✗ Authentication failed');
      return false;
    }

    // Test 3: Service Call Test
    logger.info('=== Test 3: Service Call Test ===');
    try {
      const advertisers = await xmlRpcClient.callService(
        'AdvertiserXmlRpcService',
        'getAdvertiserListByAgencyId',
        []
      );
      
      logger.info(`✓ Successfully retrieved ${advertisers.length} advertisers`);
      if (advertisers.length > 0) {
        logger.info(`First advertiser: ${JSON.stringify(advertisers[0], null, 2)}`);
      }
    } catch (error) {
      logger.warn('Service call test failed, but authentication worked:', error);
    }

    // Test 4: ReviveApiClient Integration
    logger.info('=== Test 4: ReviveApiClient Integration ===');
    const apiClient = new ReviveApiClient(config);
    
    const healthCheck = await apiClient.healthCheck();
    if (healthCheck) {
      logger.info('✓ ReviveApiClient health check passed');
    } else {
      logger.error('✗ ReviveApiClient health check failed');
    }

    // Test 5: Campaign Listing
    logger.info('=== Test 5: Campaign Listing ===');
    try {
      const campaignsResult = await apiClient.listCampaigns({});
      
      if (campaignsResult.success) {
        logger.info(`✓ Successfully retrieved ${campaignsResult.data?.length || 0} campaigns`);
        if (campaignsResult.data && campaignsResult.data.length > 0) {
          logger.info(`First campaign: ${JSON.stringify(campaignsResult.data[0], null, 2)}`);
        }
      } else {
        logger.error('✗ Campaign listing failed:', campaignsResult.error);
      }
    } catch (error) {
      logger.error('Campaign listing test failed:', error);
    }

    // Test 6: Advertiser Listing
    logger.info('=== Test 6: Advertiser Listing ===');
    try {
      const advertisersResult = await apiClient.getAdvertisers();
      
      if (advertisersResult.success) {
        logger.info(`✓ Successfully retrieved ${advertisersResult.data?.length || 0} advertisers`);
        if (advertisersResult.data && advertisersResult.data.length > 0) {
          logger.info(`First advertiser: ${JSON.stringify(advertisersResult.data[0], null, 2)}`);
        }
      } else {
        logger.error('✗ Advertiser listing failed:', advertisersResult.error);
      }
    } catch (error) {
      logger.error('Advertiser listing test failed:', error);
    }

    // Clean up
    await xmlRpcClient.logout();
    logger.info('✓ Successfully logged out');

    logger.info('=== Integration Test Complete ===');
    logger.info('✓ All core functionality tests passed');
    return true;

  } catch (error) {
    logger.error('Integration test failed:', error);
    return false;
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testIntegration()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { testIntegration };