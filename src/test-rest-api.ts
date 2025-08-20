#!/usr/bin/env node

import { ReviveRestClient } from './client/rest-client.js';
import { Logger } from './utils/logger.js';

async function testRestApi() {
    const logger = new Logger('RestApiTest');
    
    const config = {
        apiUrl: process.env.REVIVE_API_URL || '',
        username: process.env.REVIVE_API_USERNAME || '',
        password: process.env.REVIVE_API_PASSWORD || '',
    };

    logger.info('Testing Revive REST API connection...');
    logger.info(`Base URL: ${config.apiUrl}`);
    logger.info(`Username: ${config.username}`);

    const client = new ReviveRestClient(config);

    try {
        // Test connection
        const connected = await client.testConnection();
        
        if (connected) {
            logger.info('✅ REST API connection successful!');
            
            // Try to get publishers
            try {
                const publishers = await client.getPublishers();
                logger.info(`Found ${publishers.length} publishers`);
                publishers.forEach((pub: any) => {
                    logger.info(`  • ${pub.name || pub.websitename || pub.affiliatename} (ID: ${pub.affiliateid || pub.id})`);
                });
            } catch (error) {
                logger.error('Could not fetch publishers:', (error as Error).message);
            }
            
            // Try to get zones  
            try {
                const zones = await client.getZones();
                logger.info(`Found ${zones.length} zones`);
                zones.forEach((zone: any) => {
                    logger.info(`  • ${zone.zonename || zone.name} (${zone.width}x${zone.height}) - ID: ${zone.zoneid || zone.id}`);
                });
            } catch (error) {
                logger.error('Could not fetch zones:', (error as Error).message);
            }
            
        } else {
            logger.error('❌ Could not connect to Revive REST API');
        }
        
    } catch (error) {
        logger.error('REST API test failed:', error);
    }
}

if (require.main === module) {
    testRestApi().catch(console.error);
}

export { testRestApi };