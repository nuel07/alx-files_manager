import { createClient } from 'redis'
import { promisify } from 'node:util'
/**
 * RedisClient: Represents a redis client
 */
class RedisClient{
  /**
   * creates a new RedisClient instance
   */
  constructor(){
    this.client = createClient()
    this.clientIsConnected = true
    this.client.on('error', err => {
      console.error('Redis client failed to connnect: ', err.message || err.toString())
      this.clientIsConnected = false
    })
    this.client.on('connect', () => this.clientIsConnected = true) 
  }

  /**
   * returns true when the connection to Redis is a success
   *  otherwise, false
   * @returns {boolean}
   */
  isAlive(){
    return this.clientIsConnected
  }

  async get(key){
    return promisify(this.client.GET).bind(this.client)(key)
  }

  async set(key, value, duration){
    await promisify(this.client.SETEX)
      .bind(this.client)(key, value, duration)
  }

  async del(key){
    await promisify(this.client.DEL).bind(this.client)(key)
  }
}

export const redisClient = new RedisClient();
export default redisClient;