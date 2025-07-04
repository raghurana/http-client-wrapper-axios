import { HttpClient } from '../../src/http-client';
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

// Type for extending AxiosError with additional properties
type ExtendedAxiosError = AxiosError & {
  status?: number;
  response?: {
    status: number;
    statusText: string;
    data: unknown;
    headers: Record<string, string>;
    config: InternalAxiosRequestConfig;
  };
};

describe('HttpClient', () => {
  let httpClient: HttpClient;
  let mockAxiosInstance: jest.Mocked<AxiosInstance>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAxiosInstance = { request: jest.fn() } as unknown as jest.Mocked<AxiosInstance>;
    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    httpClient = new HttpClient('https://api.example.com');
  });

  describe('constructor', () => {
    test('should create axios instance with baseURL', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.example.com',
      });
    });
  });

  describe('GET requests', () => {
    test('should make successful GET request', async () => {
      const mockConfig = {
        method: 'GET',
        url: '/users',
      } as InternalAxiosRequestConfig;

      const mockResponse: AxiosResponse = {
        status: 200,
        statusText: 'OK',
        data: { message: 'Success' },
        headers: { 'content-type': 'application/json' },
        config: mockConfig,
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await httpClient.get('/users');

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/users',
        headers: undefined,
        params: undefined,
        data: undefined,
      });

      expect(result).toEqual({
        status: 200,
        headers: { 'content-type': 'application/json' },
        data: { message: 'Success' },
      });
    });

    test('should make GET request with params and headers', async () => {
      const mockConfig = {
        method: 'GET',
        url: '/users',
      } as InternalAxiosRequestConfig;

      const mockResponse: AxiosResponse = {
        status: 200,
        statusText: 'OK',
        data: { users: [] },
        headers: { 'content-type': 'application/json' },
        config: mockConfig,
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const params = { page: 1, limit: 10 };
      const headers = { Authorization: 'Bearer token' };

      const result = await httpClient.get('/users', params, headers);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/users',
        headers,
        params,
        data: undefined,
      });

      expect(result.status).toBe(200);
    });

    test('should handle GET request error', async () => {
      const mockConfig = {
        method: 'GET',
        url: '/users',
      } as InternalAxiosRequestConfig;

      const mockError = new AxiosError(
        'Network Error',
        'NETWORK_ERROR',
        mockConfig,
        {},
        {
          status: 500,
          statusText: 'Internal Server Error',
          data: { error: 'Server Error' },
          headers: { 'content-type': 'application/json' },
          config: mockConfig,
        },
      ) as ExtendedAxiosError;

      // Set the response property on the error
      mockError.response = {
        status: 500,
        statusText: 'Internal Server Error',
        data: { error: 'Server Error' },
        headers: { 'content-type': 'application/json' },
        config: mockConfig,
      };

      // Set the status property directly on the error for HttpClient compatibility
      mockError.status = 500;

      mockAxiosInstance.request.mockRejectedValue(mockError);

      const result = await httpClient.get('/users');

      expect(result).toEqual({
        status: 500,
        headers: { 'content-type': 'application/json' },
        error: mockError,
      });
    });
  });

  describe('POST requests', () => {
    test('should make successful POST request', async () => {
      const mockConfig = {
        method: 'POST',
        url: '/users',
      } as InternalAxiosRequestConfig;

      const mockResponse: AxiosResponse = {
        status: 201,
        statusText: 'Created',
        data: { id: 1, name: 'John' },
        headers: { 'content-type': 'application/json' },
        config: mockConfig,
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const body = { name: 'John', email: 'john@example.com' };
      const result = await httpClient.post('/users', body);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/users',
        headers: undefined,
        params: undefined,
        data: body,
      });

      expect(result).toEqual({
        status: 201,
        headers: { 'content-type': 'application/json' },
        data: { id: 1, name: 'John' },
      });
    });

    test('should make POST request with headers', async () => {
      const mockConfig = {
        method: 'POST',
        url: '/users',
      } as InternalAxiosRequestConfig;

      const mockResponse: AxiosResponse = {
        status: 201,
        statusText: 'Created',
        data: { id: 1 },
        headers: { 'content-type': 'application/json' },
        config: mockConfig,
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const body = { name: 'John' };
      const headers = { Authorization: 'Bearer token' };

      const result = await httpClient.post('/users', body, headers);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/users',
        headers,
        params: undefined,
        data: body,
      });

      expect(result.status).toBe(201);
    });

    test('should handle POST request error', async () => {
      const mockConfig = {
        method: 'POST',
        url: '/users',
      } as InternalAxiosRequestConfig;

      const mockError = new AxiosError(
        'Validation Error',
        'VALIDATION_ERROR',
        mockConfig,
        {},
        {
          status: 400,
          statusText: 'Bad Request',
          data: { error: 'Invalid data' },
          headers: { 'content-type': 'application/json' },
          config: mockConfig,
        },
      ) as ExtendedAxiosError;

      // Set the response property on the error
      mockError.response = {
        status: 400,
        statusText: 'Bad Request',
        data: { error: 'Invalid data' },
        headers: { 'content-type': 'application/json' },
        config: mockConfig,
      };

      // Set the status property directly on the error for HttpClient compatibility
      mockError.status = 400;

      mockAxiosInstance.request.mockRejectedValue(mockError);

      const result = await httpClient.post('/users', { name: 'John' });

      expect(result).toEqual({
        status: 400,
        headers: { 'content-type': 'application/json' },
        error: mockError,
      });
    });
  });

  describe('PUT requests', () => {
    test('should make successful PUT request', async () => {
      const mockConfig = {
        method: 'PUT',
        url: '/users/1',
      } as InternalAxiosRequestConfig;

      const mockResponse: AxiosResponse = {
        status: 200,
        statusText: 'OK',
        data: { id: 1, name: 'John Updated' },
        headers: { 'content-type': 'application/json' },
        config: mockConfig,
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const body = { name: 'John Updated' };
      const result = await httpClient.put('/users/1', body);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/users/1',
        headers: undefined,
        params: undefined,
        data: body,
      });

      expect(result).toEqual({
        status: 200,
        headers: { 'content-type': 'application/json' },
        data: { id: 1, name: 'John Updated' },
      });
    });

    test('should handle PUT request error', async () => {
      const mockConfig = {
        method: 'PUT',
        url: '/users/999',
      } as InternalAxiosRequestConfig;

      const mockError = new AxiosError(
        'Not Found',
        'NOT_FOUND',
        mockConfig,
        {},
        {
          status: 404,
          statusText: 'Not Found',
          data: { error: 'User not found' },
          headers: { 'content-type': 'application/json' },
          config: mockConfig,
        },
      ) as ExtendedAxiosError;

      // Set the response property on the error
      mockError.response = {
        status: 404,
        statusText: 'Not Found',
        data: { error: 'User not found' },
        headers: { 'content-type': 'application/json' },
        config: mockConfig,
      };

      // Set the status property directly on the error for HttpClient compatibility
      mockError.status = 404;

      mockAxiosInstance.request.mockRejectedValue(mockError);

      const result = await httpClient.put('/users/999', { name: 'John' });

      expect(result).toEqual({
        status: 404,
        headers: { 'content-type': 'application/json' },
        error: mockError,
      });
    });
  });

  describe('PATCH requests', () => {
    test('should make successful PATCH request', async () => {
      const mockConfig = {
        method: 'PATCH',
        url: '/users/1',
      } as InternalAxiosRequestConfig;

      const mockResponse: AxiosResponse = {
        status: 200,
        statusText: 'OK',
        data: { id: 1, name: 'John', email: 'john@example.com' },
        headers: { 'content-type': 'application/json' },
        config: mockConfig,
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const body = { email: 'john@example.com' };
      const result = await httpClient.patch('/users/1', body);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'PATCH',
        url: '/users/1',
        headers: undefined,
        params: undefined,
        data: body,
      });

      expect(result).toEqual({
        status: 200,
        headers: { 'content-type': 'application/json' },
        data: { id: 1, name: 'John', email: 'john@example.com' },
      });
    });

    test('should handle PATCH request error', async () => {
      const mockConfig = {
        method: 'PATCH',
        url: '/users/1',
      } as InternalAxiosRequestConfig;

      const mockError = new AxiosError(
        'Unauthorized',
        'UNAUTHORIZED',
        mockConfig,
        {},
        {
          status: 401,
          statusText: 'Unauthorized',
          data: { error: 'Invalid token' },
          headers: { 'content-type': 'application/json' },
          config: mockConfig,
        },
      ) as ExtendedAxiosError;

      // Set the response property on the error
      mockError.response = {
        status: 401,
        statusText: 'Unauthorized',
        data: { error: 'Invalid token' },
        headers: { 'content-type': 'application/json' },
        config: mockConfig,
      };

      // Set the status property directly on the error for HttpClient compatibility
      mockError.status = 401;

      mockAxiosInstance.request.mockRejectedValue(mockError);

      const result = await httpClient.patch('/users/1', { email: 'john@example.com' });

      expect(result).toEqual({
        status: 401,
        headers: { 'content-type': 'application/json' },
        error: mockError,
      });
    });
  });

  describe('DELETE requests', () => {
    test('should make successful DELETE request', async () => {
      const mockConfig = {
        method: 'DELETE',
        url: '/users/1',
      } as InternalAxiosRequestConfig;

      const mockResponse: AxiosResponse = {
        status: 204,
        statusText: 'No Content',
        data: undefined,
        headers: {},
        config: mockConfig,
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await httpClient.delete('/users/1');

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/users/1',
        headers: undefined,
        params: undefined,
        data: undefined,
      });

      expect(result).toEqual({
        status: 204,
        headers: {},
        data: undefined,
      });
    });

    test('should make DELETE request with headers', async () => {
      const mockConfig = {
        method: 'DELETE',
        url: '/users/1',
      } as InternalAxiosRequestConfig;

      const mockResponse: AxiosResponse = {
        status: 204,
        statusText: 'No Content',
        data: undefined,
        headers: {},
        config: mockConfig,
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const headers = { Authorization: 'Bearer token' };
      const result = await httpClient.delete('/users/1', headers);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/users/1',
        headers,
        params: undefined,
        data: undefined,
      });

      expect(result.status).toBe(204);
    });

    test('should handle DELETE request error', async () => {
      const mockConfig = {
        method: 'DELETE',
        url: '/users/1',
      } as InternalAxiosRequestConfig;

      const mockError = new AxiosError(
        'Forbidden',
        'FORBIDDEN',
        mockConfig,
        {},
        {
          status: 403,
          statusText: 'Forbidden',
          data: { error: 'Access denied' },
          headers: { 'content-type': 'application/json' },
          config: mockConfig,
        },
      ) as ExtendedAxiosError;

      // Set the response property on the error
      mockError.response = {
        status: 403,
        statusText: 'Forbidden',
        data: { error: 'Access denied' },
        headers: { 'content-type': 'application/json' },
        config: mockConfig,
      };

      // Set the status property directly on the error for HttpClient compatibility
      mockError.status = 403;

      mockAxiosInstance.request.mockRejectedValue(mockError);

      const result = await httpClient.delete('/users/1');

      expect(result).toEqual({
        status: 403,
        headers: { 'content-type': 'application/json' },
        error: mockError,
      });
    });
  });

  describe('Error handling edge cases', () => {
    test('should handle axios error without response', async () => {
      const mockError = new AxiosError('Network Error', 'NETWORK_ERROR');
      mockAxiosInstance.request.mockRejectedValue(mockError);

      const result = await httpClient.get('/users');

      expect(result).toEqual({
        status: 500,
        headers: {},
        error: mockError,
      });
    });

    test('should handle axios error with undefined status', async () => {
      const mockConfig = {
        method: 'GET',
        url: '/users',
      } as InternalAxiosRequestConfig;

      const mockError = new AxiosError(
        'Unknown Error',
        'UNKNOWN_ERROR',
        mockConfig,
        {},
        {
          status: 0,
          statusText: 'Unknown',
          data: { error: 'Unknown error' },
          headers: { 'content-type': 'application/json' },
          config: mockConfig,
        },
      ) as ExtendedAxiosError;

      // Set the response property on the error
      mockError.response = {
        status: 0,
        statusText: 'Unknown',
        data: { error: 'Unknown error' },
        headers: { 'content-type': 'application/json' },
        config: mockConfig,
      };

      mockAxiosInstance.request.mockRejectedValue(mockError);

      const result = await httpClient.get('/users');

      expect(result).toEqual({
        status: 500,
        headers: { 'content-type': 'application/json' },
        error: mockError,
      });
    });

    test('should handle axios error with undefined headers', async () => {
      const mockConfig = {
        method: 'GET',
        url: '/users',
      } as InternalAxiosRequestConfig;

      const mockError = new AxiosError(
        'Server Error',
        'SERVER_ERROR',
        mockConfig,
        {},
        {
          status: 500,
          statusText: 'Internal Server Error',
          data: { error: 'Server error' },
          headers: {},
          config: mockConfig,
        },
      ) as ExtendedAxiosError;

      // Set the response property on the error
      mockError.response = {
        status: 500,
        statusText: 'Internal Server Error',
        data: { error: 'Server error' },
        headers: {},
        config: mockConfig,
      };

      // Set the status property directly on the error for HttpClient compatibility
      mockError.status = 500;

      mockAxiosInstance.request.mockRejectedValue(mockError);

      const result = await httpClient.get('/users');

      expect(result).toEqual({
        status: 500,
        headers: {},
        error: mockError,
      });
    });
  });

  describe('Type safety', () => {
    test('should maintain type safety for request and response', async () => {
      interface User {
        id: number;
        name: string;
        email: string;
      }

      interface CreateUserRequest {
        name: string;
        email: string;
      }

      const mockConfig = {
        method: 'POST',
        url: '/users',
      } as InternalAxiosRequestConfig;

      const mockResponse: AxiosResponse<User> = {
        status: 201,
        statusText: 'Created',
        data: { id: 1, name: 'John', email: 'john@example.com' },
        headers: { 'content-type': 'application/json' },
        config: mockConfig,
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const userData: CreateUserRequest = {
        name: 'John',
        email: 'john@example.com',
      };

      const result = await httpClient.post<CreateUserRequest, User>('/users', userData);

      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe(1);
      expect(result.data?.name).toBe('John');
      expect(result.data?.email).toBe('john@example.com');
    });
  });
});
