import axios, { AxiosRequestConfig } from 'axios';
import { store } from '../store/store';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface RequestConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean;
}

export async function request<T>(config: RequestConfig): Promise<T> {
  try {
    // Get token from Redux store
    const token = store.getState().auth.user?.token;

    const response = await axios({
      baseURL,
      timeout: 10000,
      withCredentials: true,
      ...config,
      headers: {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return response.data;
  } catch (error: any) {
    if (!config.skipErrorHandler) {
      // 处理错误
      if (error.response) {
        // 服务器返回错误状态码
        const { status, data } = error.response;
        switch (status) {
          case 401:
            // 未授权，可能需要重新登录
            console.error('Unauthorized, please login');
            break;
          case 403:
            // 禁止访问
            console.error('Access forbidden');
            break;
          case 404:
            // 资源不存在
            console.error('Resource not found');
            break;
          default:
            // 其他错误
            console.error('Request failed:', data?.message || 'Unknown error');
        }
      } else if (error.request) {
        // 请求发出但没有收到响应
        console.error('No response received from server');
      } else {
        // 请求配置出错
        console.error('Request configuration error:', error.message);
      }
    }
    throw error;
  }
} 