#!/usr/bin/env node

import { ReviveApiClient } from './client/revive-client.js';
import { Logger } from './utils/logger.js';

async function setupMusicCalendarZones() {
    const logger = new Logger('MusicCalendarSetup');
    
    // Load environment variables
    const config = {
        apiUrl: process.env.REVIVE_API_URL || '',
        username: process.env.REVIVE_API_USERNAME || '',
        password: process.env.REVIVE_API_PASSWORD || '',
    };

    if (!config.apiUrl || !config.username || !config.password) {
        logger.error('Missing required environment variables');
        logger.info('Required: REVIVE_API_URL, REVIVE_API_USERNAME, REVIVE_API_PASSWORD');
        return;
    }

    // Initialize Revive client
    const client = new ReviveApiClient(config);

    try {
        logger.info('Starting Music Calendar zone setup...');

        // Step 1: Get publishers to find or create one for themusiccalendar.com
        logger.info('Getting publishers...');
        const publishersResponse = await client.getPublishers();
        
        if (!publishersResponse.success) {
            logger.error('Failed to get publishers:', publishersResponse.error);
            return;
        }

        const publishers = publishersResponse.data || [];
        logger.info(`Found ${publishers.length} publishers`);

        // Find existing publisher or create new one
        let targetPublisher = publishers.find((p: any) => 
            p.website === 'themusiccalendar.com' || 
            p.websitename === 'themusiccalendar.com' ||
            p.name === 'The Music Calendar'
        );

        let publisherId: number;

        if (targetPublisher) {
            publisherId = parseInt(targetPublisher.publisherid || targetPublisher.affiliateid);
            logger.info(`Found existing publisher: ${targetPublisher.website || targetPublisher.name} (ID: ${publisherId})`);
        } else {
            logger.info('No existing publisher found for themusiccalendar.com');
            logger.info('You may need to create a publisher first through the Revive admin interface');
            logger.info('Using publisherId = 1 as default for testing...');
            publisherId = 1;
        }

        // Step 2: Create zones
        const zones = [
            {
                name: 'Desktop Top Banner',
                websiteId: publisherId,
                type: 'banner',
                width: 728,
                height: 90,
                description: 'Desktop Leaderboard banner (728x90) at top of page'
            },
            {
                name: 'Mobile Top Banner', 
                websiteId: publisherId,
                type: 'banner',
                width: 320,
                height: 50,
                description: 'Mobile banner (320x50) at top of page'
            },
            {
                name: 'Desktop Bottom Banner',
                websiteId: publisherId,
                type: 'banner', 
                width: 728,
                height: 90,
                description: 'Desktop Leaderboard banner (728x90) at bottom of page'
            },
            {
                name: 'Mobile Bottom Banner',
                websiteId: publisherId,
                type: 'banner',
                width: 320,
                height: 50,
                description: 'Mobile banner (320x50) at bottom of page'
            }
        ];

        const createdZones = [];

        for (const zone of zones) {
            logger.info(`Creating zone: ${zone.name} (${zone.width}x${zone.height})`);
            
            try {
                const response = await client.configureZone(zone);
                
                if (response.success && response.data) {
                    createdZones.push(response.data);
                    logger.info(`✅ Successfully created zone: ${zone.name} (ID: ${response.data.id})`);
                } else {
                    logger.error(`❌ Failed to create zone ${zone.name}: ${response.error}`);
                }
            } catch (error) {
                logger.error(`❌ Error creating zone ${zone.name}:`, error);
            }
        }

        // Summary
        logger.info(`\n=== SETUP COMPLETE ===`);
        logger.info(`Created ${createdZones.length} out of ${zones.length} zones for themusiccalendar.com`);
        
        if (createdZones.length > 0) {
            logger.info('\n📋 Successfully created zones:');
            createdZones.forEach((zone: any) => {
                logger.info(`   • ${zone.name} (ID: ${zone.id}) - ${zone.width}x${zone.height}`);
            });
        }

        if (createdZones.length < zones.length) {
            logger.info('\n⚠️  Some zones failed to create. Check the errors above.');
        }

    } catch (error) {
        logger.error('Setup failed:', error);
    }
}

// Run if called directly
if (require.main === module) {
    setupMusicCalendarZones().catch(console.error);
}

export { setupMusicCalendarZones };