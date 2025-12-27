export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export type AuthType = 'none' | 'basic' | 'bearer' | 'api-key';

export interface AuthConfig {
  type: AuthType;
  token?: string;
  username?: string;
  password?: string;
  apiKey?: string;
}

export interface RequestDocument {
  _id?: string;
  name?: string;
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body?: string;
  auth: AuthConfig;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExecuteResponse {
  status: number;
  statusText: string;
  headers: Record<string, string | number | boolean>;
  data: unknown;
  time: number;
}

export interface ErrorResponse {
  error: string;
  details?: unknown;
}

export interface Collection {
  _id: string;
  name: string;
  description?: string;
  requests: RequestDocument[];
  createdAt?: string;
}

export type ApiResult = ExecuteResponse | ErrorResponse;