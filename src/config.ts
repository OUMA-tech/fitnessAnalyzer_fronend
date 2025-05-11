// src/config.ts
type EnvKey = 'development' | 'production' | 'test';
const env = import.meta.env.MODE as EnvKey;  // 'development' 或 'production'

const API_CONFIG = {
  development: {
    baseUrl: 'http://localhost:3000/api',
  },
  production: {
    baseUrl: 'https://api.yourdomain.com/api',
  },
  test: {
    baseUrl: 'https://test-api.yourdomain.com/api',
  },
};

export const API_BASE_URL = API_CONFIG[env]?.baseUrl || API_CONFIG.production.baseUrl;