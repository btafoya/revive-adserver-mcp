#!/usr/bin/env node

import { ReviveXmlRpcClient } from './client/xmlrpc-client.js';
import { Logger } from './utils/logger.js';

async function testReviveConnection() {
    const logger = new Logger('IntegrationTest');
    
    const config = {
        apiUrl: process.env.REVIVE_API_URL || '',
        username: process.env.REVIVE_API_USERNAME || '',
        password: process.env.REVIVE_API_PASSWORD || '',
    };

    logger.info('Testing Revive Adserver connection...');
    logger.info(`API URL: ${config.apiUrl}`);
    logger.info(`Username: ${config.username}`);

    // Try different API URL formats
    const urlVariants = [
        config.apiUrl,
        config.apiUrl.replace('/api', '/www/api/v2/xmlrpc'),
        config.apiUrl.replace('/api', '/www/api/v1/xmlrpc'),
        config.apiUrl.replace('/api', '/api/v2/xmlrpc'),
        config.apiUrl.replace('/api', '/api/xmlrpc'),
        config.apiUrl + '/v2/xmlrpc',
        config.apiUrl + '/xmlrpc'
    ];

    for (const url of urlVariants) {
        try {
            logger.info(`\nTrying URL: ${url}`);
            const client = new ReviveXmlRpcClient({
                ...config,
                apiUrl: url
            });
            
            const isConnected = await client.testConnection();
            
            if (isConnected) {
                logger.info(`✅ SUCCESS: Connected to Revive at ${url}`);
                return;
            } else {
                logger.info(`❌ FAILED: Could not connect to ${url}`);
            }
        } catch (error) {
            logger.error(`❌ ERROR with ${url}:`, (error as Error).message);
        }
    }

    logger.error('Could not connect to Revive Adserver with any URL variant');
}

if (require.main === module) {
    testReviveConnection().catch(console.error);
}

export { testReviveConnection };