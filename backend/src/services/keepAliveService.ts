/**
 * Keep-Alive Service
 * Prevents Render free tier from sleeping by pinging the database and health endpoint
 * Runs every 5 minutes to keep services active
 */

import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

class KeepAliveService {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly PING_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly HEALTH_CHECK_URL = process.env.BASE_URL 
    ? `${process.env.BASE_URL}/api/health`
    : process.env.FRONTEND_URL 
    ? `${process.env.FRONTEND_URL}/api/health`
    : null;

  /**
   * Start the keep-alive service
   */
  start() {
    if (this.intervalId) {
      console.log('⚠️  Keep-alive service already running');
      return;
    }

    console.log('🔄 Starting keep-alive service...');
    console.log(`   Interval: ${this.PING_INTERVAL / 1000} seconds`);
    console.log(`   Health check URL: ${this.HEALTH_CHECK_URL || 'Not configured'}`);

    // Run immediately on start
    this.ping();

    // Then run every 5 minutes
    this.intervalId = setInterval(() => {
      this.ping();
    }, this.PING_INTERVAL);

    console.log('✅ Keep-alive service started');
  }

  /**
   * Stop the keep-alive service
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('🛑 Keep-alive service stopped');
    }
  }

  /**
   * Ping database and health endpoint
   */
  private async ping() {
    try {
      const timestamp = new Date().toISOString();
      console.log(`🔔 Keep-alive ping at ${timestamp}`);

      // Ping database with a simple query
      await this.pingDatabase();

      // Ping health endpoint if configured
      if (this.HEALTH_CHECK_URL) {
        await this.pingHealthEndpoint();
      }

      console.log('✅ Keep-alive ping successful');
    } catch (error) {
      console.error('❌ Keep-alive ping failed:', error instanceof Error ? error.message : error);
    }
  }

  /**
   * Ping database with a lightweight query
   */
  private async pingDatabase() {
    try {
      // Use a lightweight query that doesn't require much processing
      await prisma.$queryRaw`SELECT 1`;
      console.log('   ✅ Database ping successful');
    } catch (error) {
      console.error('   ❌ Database ping failed:', error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Ping health endpoint to keep Render service awake
   */
  private async pingHealthEndpoint() {
    if (!this.HEALTH_CHECK_URL) {
      return;
    }

    try {
      const response = await axios.get(this.HEALTH_CHECK_URL, {
        timeout: 10000, // 10 second timeout
        validateStatus: (status) => status < 500 // Accept 2xx, 3xx, 4xx
      });
      console.log(`   ✅ Health endpoint ping successful (${response.status})`);
    } catch (error) {
      // Don't throw - health endpoint ping failure shouldn't stop the service
      if (axios.isAxiosError(error)) {
        console.warn(`   ⚠️  Health endpoint ping failed: ${error.message}`);
      } else {
        console.warn('   ⚠️  Health endpoint ping failed:', error);
      }
    }
  }
}

// Create singleton instance
const keepAliveService = new KeepAliveService();

// Auto-start in production
if (process.env.NODE_ENV === 'production') {
  // Start after a short delay to ensure server is ready
  setTimeout(() => {
    keepAliveService.start();
  }, 30000); // 30 seconds after server starts
}

export default keepAliveService;

