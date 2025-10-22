// Request throttling utility to prevent rate limiting
class RequestThrottle {
  private requestQueue: Map<string, { lastRequest: number; pending: boolean }> = new Map();
  private readonly minInterval = 1000; // Minimum 1 second between requests to same endpoint

  async throttle<T>(endpoint: string, requestFn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const key = endpoint;
    const lastRequest = this.requestQueue.get(key);

    // If there's a recent request to this endpoint, wait
    if (lastRequest && now - lastRequest.lastRequest < this.minInterval) {
      const waitTime = this.minInterval - (now - lastRequest.lastRequest);
      console.log(`⏳ Throttling request to ${endpoint}, waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    // Mark as pending
    this.requestQueue.set(key, { lastRequest: now, pending: true });

    try {
      const result = await requestFn();
      return result;
    } finally {
      // Update last request time
      this.requestQueue.set(key, { lastRequest: Date.now(), pending: false });
    }
  }

  // Clear throttling for specific endpoint
  clear(endpoint: string) {
    this.requestQueue.delete(endpoint);
  }

  // Clear all throttling
  clearAll() {
    this.requestQueue.clear();
  }
}

export const requestThrottle = new RequestThrottle();
