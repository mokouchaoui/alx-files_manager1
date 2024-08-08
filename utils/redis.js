import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.redis = createClient();
    this.connected = false;

    this.redis.on('error', (err) => {
      console.log(err);
    });

    this.redis.on('connect', () => {
      this.connected = true;
    });
  }

  isAlive() {
    return this.connected;
  }

  async get(key) {
    const getAsync = promisify(this.redis.get).bind(this.redis);
    try {
      const val = await getAsync(key);
      return val;
    } catch (err) {
      console.error('Error fetching value', err);
      return null;
    }
  }

  async set(key, val, duration) {
    const setExAsync = promisify(this.redis.setex).bind(this.redis);
    try {
      await setExAsync(key, duration, val);
    } catch (err) {
      console.error('Error setting key', err);
    }
  }

  async del(key) {
    const delAsync = promisify(this.redis.del).bind(this.redis);
    try {
      delAsync(key);
    } catch (err) {
      console.error('Error deleting key', err);
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
