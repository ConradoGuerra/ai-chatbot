import {
  createClient,
  type RedisClientType,
  type RedisDefaultModules,
} from 'redis';

export class RedisClient {
  private client: RedisClientType<RedisDefaultModules>;

  constructor(url: string = 'redis://127.0.0.1:6380') {
    this.client = createClient({ url });
    this.client.connect();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.client.setEx(key, ttl, value);
  }

  async close(): Promise<void> {
    await this.client.quit();
  }
}
