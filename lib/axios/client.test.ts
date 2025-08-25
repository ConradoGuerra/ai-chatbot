import { createAxiosInstance } from './client';

describe('createAxiosInstance', () => {
  it('should create an instance with the correct baseURL and headers', () => {
    const baseURL = 'https://api.test.com';
    const headers = { 'X-Test-Header': 'test' };
    const instance = createAxiosInstance({ baseURL, headers });

    expect(instance.defaults.baseURL).toBe(baseURL);
    expect(instance.defaults.headers['X-Test-Header']).toBe('test');
  });
});
