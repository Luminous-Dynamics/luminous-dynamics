/**
 * Sacred API Client - Core HTTP client for Sacred services
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { SacredConfig } from './types';

export class SacredClient {
  private axios: AxiosInstance;
  private config: SacredConfig;

  constructor(config: Partial<SacredConfig>) {
    this.config = {
      apiUrl: config.apiUrl || 'http://localhost:3001',
      ...config
    };

    this.axios = axios.create({
      baseURL: this.config.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
      }
    });

    // Request interceptor for auth
    this.axios.interceptors.request.use((config) => {
      if (this.config.userId) {
        config.headers['X-User-ID'] = this.config.userId;
      }
      return config;
    });

    // Response interceptor for error handling
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Sacred API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Make a GET request
   */
  async get<T = any>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.get<T>(path, config);
    return response.data;
  }

  /**
   * Make a POST request
   */
  async post<T = any>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.post<T>(path, data, config);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.put<T>(path, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.delete<T>(path, config);
    return response.data;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SacredConfig>): void {
    Object.assign(this.config, config);
    
    if (config.apiKey) {
      this.axios.defaults.headers.common['Authorization'] = `Bearer ${config.apiKey}`;
    }
    
    if (config.apiUrl) {
      this.axios.defaults.baseURL = config.apiUrl;
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): SacredConfig {
    return { ...this.config };
  }
}