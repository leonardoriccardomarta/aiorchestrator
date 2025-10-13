declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set',
      action: string,
      options?: Record<string, any>
    ) => void;
  }
}

declare module 'xss' {
  const xss: (html: string) => string;
  export default xss;
}

declare module 'graphql-subscriptions' {
  export class PubSub {
    constructor();
    publish(triggerName: string, payload: any): Promise<void>;
    subscribe(triggerName: string, onMessage: (payload: any) => void): Promise<number>;
    unsubscribe(subId: number): void;
  }
}

declare module '@sentry/react' {
  export function init(options: any): void;
  export function captureException(error: Error): void;
  export function captureMessage(message: string): void;
}

declare module 'qrcode' {
  export function toDataURL(text: string, options?: any): Promise<string>;
  export function toString(text: string, options?: any): Promise<string>;
}

declare module '@heroicons/react/24/solid' {
  export const PaperAirplaneIcon: React.ComponentType<any>;
}

declare module 'winston' {
  export interface Logger {
    info(message: string, meta?: any): void;
    error(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
  }
  
  export function createLogger(options: any): Logger;
}

export {};