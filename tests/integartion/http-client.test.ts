import { AxiosError } from 'axios';
import { HttpClient } from '../../src/http-client';

describe('HttpClient Integration Tests', () => {
  const BASE_URL = 'https://jsonplaceholder.typicode.com';

  test('should fetch a single post using GET', async () => {
    const httpClient = new HttpClient(BASE_URL);
    const response = await httpClient.get<Post>('/posts/1');
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

  test('should fetch multiple posts using GET', async () => {
    const httpClient = new HttpClient(BASE_URL);
    const response = await httpClient.get<Post[]>('/posts');
    expect(response.status).toBe(200);
    expect(response.headers).toMatchObject({
      'content-type': expect.stringContaining('application/json'),
    });
    expect(response.error).toBeUndefined();
    expect(response.data).toBeInstanceOf(Array);
    expect(response.data).toHaveLength(100);
  });

  test('should return 404 when fetching a non-existent post', async () => {
    const httpClient = new HttpClient(BASE_URL);
    const response = await httpClient.get('/posts/-1');
    expect(response.status).toBe(404);
    expect(response.headers).toMatchObject({
      'content-type': expect.stringContaining('application/json'),
    });
    expect(response.status).toBe(404);
    expect(response.headers).toMatchObject({
      'content-type': expect.stringContaining('application/json'),
    });
    expect(response.data).toBeUndefined();
    expect(response.error).toBeInstanceOf(AxiosError);
    const axiosError = response.error as AxiosError;
    expect(axiosError.toJSON()).toMatchObject({
      status: 404,
      code: 'ERR_BAD_REQUEST',
      message: 'Request failed with status code 404',
    });
  });

  test('when a wrong url is provided, it should throw an error', async () => {
    const httpClient = new HttpClient('https://jsonplaceholder.XXX.com');
    const response = await httpClient.get('/posts/1');
    expect(response.status).toBe(500);
    expect(response.headers).toMatchObject({});
    expect(response.error).toBeInstanceOf(AxiosError);
    const axiosError = response.error as AxiosError;
    expect(axiosError.toJSON()).toMatchObject({
      status: undefined,
      code: 'EPROTO',
      message: expect.any(String),
    });
  });

  test('should fetch a single post using POST', async () => {
    const httpClient = new HttpClient(BASE_URL);
    const response = await httpClient.post<Omit<Post, 'id'>>('/posts', {
      userId: 1,
      title: 'Test Post',
      body: 'This is a test post',
    });
    expect(response.status).toBe(201);
    expect(response.headers).toMatchObject({
      'content-type': expect.stringContaining('application/json'),
    });
    expect(response.error).toBeUndefined();
    expect(response.data).toMatchObject({
      id: 101,
    });
  });

  test('should delete a post using DELETE', async () => {
    const httpClient = new HttpClient(BASE_URL);
    const response = await httpClient.delete('/posts/1');
    expect(response.status).toBe(200);
    expect(response.error).toBeUndefined();
    expect(response.data).toMatchObject({});
    expect(response.headers).toMatchObject({
      'content-type': expect.stringContaining('application/json'),
    });
  });
});

type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};
