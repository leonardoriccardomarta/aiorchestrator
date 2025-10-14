interface Config {
  apiUrl: string;
  wsUrl: string;
  environment: 'development' | 'production' | 'test';
}

export const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://aiorchestrator-vtihz.ondigitalocean.app',
  wsUrl: import.meta.env.VITE_WS_URL || 'wss://aiorchestrator-vtihz.ondigitalocean.app',
  environment: (import.meta.env.MODE as Config['environment']) || 'development',
}; 