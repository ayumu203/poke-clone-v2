import { devLog, devError } from '../../src/utils/dev-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T = any>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      devLog(`Making ${method} request to: ${url}`);
      const response = await fetch(url, options);
      
      // レスポンスのステータスをチェック
      if (!response.ok) {
        const errorText = await response.text();
        devError(`API Error ${response.status}:`, errorText);
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }
      
      // Content-Typeをチェック
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        devError('Non-JSON response received:', responseText);
        throw new Error(`Expected JSON response but received: ${contentType || 'unknown'}`);
      }
      
      const responseData = await response.json();

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      devError('API request failed:', error);
      throw error;
    }
  }

  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint);
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data);
  }

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data);
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);