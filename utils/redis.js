import { createClient } from 'redis';
import { promisify } from 'node:util';

/**
 * RedisClient: Represents a redis client
 */
class RedisClient {
  /**
   * creates a new RedisClient instance
   */
  constructor() {
    this.client = createClient();
    this.clientIsConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connnect: ', err.message || err.toString());
      this.clientIsConnected = false;
    });
    this.client.on('connect', () => { this.clientIsConnected = true; });
  }

  /**
   * returns true when the connection to Redis is a success
   *  otherwise, false
   * @returns {Boolean}
   */
  isAlive() {
    return this.clientIsConnected;
  }

  /**
   * Gets value from redis using a key
   * @param {String} key key of the item to retrieve
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * stores a key and its value along with the expiration time
   * @param {String} key key of the item to retrieve
   * @param {String | Number | Boolean} value the item to store
   * @param {Number} duration expiration time of the item in seconds
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, value, duration);
  }

  /**
   * removes the value of a given key
   * @param {String} key Key of the item to delete
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
