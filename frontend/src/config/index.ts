interface Config {
  apiUrl: string;
  wsUrl: string;
  environment: 'development' | 'production' | 'test';
}

export const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3000',
  environment: (import.meta.env.MODE as Config['environment']) || 'development',
}; 