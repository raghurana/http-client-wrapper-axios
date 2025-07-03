import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { tryCatch } from './try-catch';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpRequest<TReqBody = void> = {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  body?: TReqBody;
};

export type HttpResponse<TResBody = unknown> = {
  status: number;
  headers: Record<string, string>;
  data?: TResBody;
  error?: Error;
};

export class HttpClient {
  private readonly axiosInstance: AxiosInstance;

  constructor(baseURL: string, options?: AxiosRequestConfig) {
    this.axiosInstance = axios.create({
      baseURL,
      ...options,
    });
  }

  get<Res = unknown>(
    url: string,
    params?: Record<string, string | number | boolean>,
    headers?: Record<string, string>,
  ) {
    return this.request<void, Res>({ method: 'GET', url, params, headers });
  }

  post<Req = unknown, Res = unknown>(url: string, body?: Req, headers?: Record<string, string>) {
    return this.request<Req, Res>({ method: 'POST', url, body, headers });
  }

  put<Req = unknown, Res = unknown>(url: string, body?: Req, headers?: Record<string, string>) {
    return this.request<Req, Res>({ method: 'PUT', url, body, headers });
  }

  patch<Req = unknown, Res = unknown>(url: string, body?: Req, headers?: Record<string, string>) {
    return this.request<Req, Res>({ method: 'PATCH', url, body, headers });
  }

  delete<Res = unknown>(url: string, headers?: Record<string, string>) {
    return this.request<void, Res>({ method: 'DELETE', url, headers });
  }

  private async request<Req = unknown, Res = unknown>(config: HttpRequest<Req>): Promise<HttpResponse<Res>> {
    const { method, url, headers, params, body: data } = config;

    const axiosResponse = await tryCatch<AxiosResponse<Res>, AxiosError>(
      this.axiosInstance.request<Res>({ method, url, headers, params, data }),
    );

    if (axiosResponse.error) {
      return {
        status: axiosResponse.error.status ?? 500,
        headers: (axiosResponse.error.response?.headers as Record<string, string>) || {},
        error: axiosResponse.error,
      };
    }

    return {
      status: axiosResponse.result.status,
      headers: axiosResponse.result.headers as Record<string, string>,
      data: axiosResponse.result.data,
    };
  }
}
