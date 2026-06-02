import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Auto-connect in production or development if needed
if (process.env.NODE_ENV === 'production') {
  redisClient.connect().catch(console.error);
} else {
  // Safe helper to run operations even if not fully connected
  if (!redisClient.isOpen) {
    redisClient.connect().catch(() => {
      console.warn('Could not connect to Redis. Using fallback mode.');
    });
  }
}
