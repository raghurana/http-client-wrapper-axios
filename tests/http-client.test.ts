import { HttpClient } from '../src/http-client';

describe('HttpClient', () => {
  const BASE_URL = 'https://jsonplaceholder.typicode.com';

  test('should fetch a post using GET', async () => {
    const httpClient = new HttpClient(BASE_URL);
    const response = await httpClient.get('/posts/1');
    expect(response.status).toBe(200);
    expect(response.headers).toMatchObject({
      'content-type': expect.stringContaining('application/json'),
    });
    expect(response.error).toBeUndefined();
    expect(response.data).toMatchObject({
      id: 1,
      title: expect.any(String),
      body: expect.any(String),
    });
  });
});
