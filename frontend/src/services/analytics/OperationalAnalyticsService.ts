import { analyticsService, AnalyticsEventType } from './AnalyticsService';

// System Metrics Types
export enum SystemMetricType {
  CPU_USAGE = 'cpu_usage',
  MEMORY_USAGE = 'memory_usage',
  DISK_USAGE = 'disk_usage',
  NETWORK_TRAFFIC = 'network_traffic',
  DATABASE_CONNECTIONS = 'database_connections',
  CACHE_HIT_RATE = 'cache_hit_rate',
  ERROR_RATE = 'error_rate',
  RESPONSE_TIME = 'response_time',
  THROUGHPUT = 'throughput',
  UPTIME = 'uptime'
}

// API Endpoint
export interface APIEndpoint {
  path: string;
  method: string;
  description: string;
  category: string;
  expectedResponseTime: number;
  rateLimit?: number;
  authentication: boolean;
}

// API Performance Metrics
export interface APIPerformanceMetrics {
  endpoint: string;
  method: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  throughput: number; // requests per second
  lastUpdated: Date;
}

// System Performance Metrics
export interface SystemPerformanceMetrics {
  timestamp: Date;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkTraffic: {
    incoming: number;
    outgoing: number;
  };
  databaseConnections: number;
  cacheHitRate: number;
  errorRate: number;
  responseTime: number;
  throughput: number;
  uptime: number;
}

// Infrastructure Alert
export interface InfrastructureAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  metric: SystemMetricType;
  value: number;
  threshold: number;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  assignedTo?: string;
}

// Operational Analytics Service
export class OperationalAnalyticsService {
  private apiEndpoints: Map<string, APIEndpoint> = new Map();
  private apiMetrics: Map<string, APIPerformanceMetrics> = new Map();
  private systemMetrics: SystemPerformanceMetrics[] = [];
  private alerts: InfrastructureAlert[] = [];
  private monitoringConfig = {
    cpuThreshold: 80,
    memoryThreshold: 85,
    diskThreshold: 90,
    errorRateThreshold: 5,
    responseTimeThreshold: 1000,
    cacheHitRateThreshold: 80
  };

  constructor() {
    this.initialize();
  }

  // Initialize operational analytics
  private initialize(): void {
    this.setupDefaultEndpoints();
    this.setupEventListeners();
    this.startSystemMonitoring();
  }

  // Setup default API endpoints
  private setupDefaultEndpoints(): void {
    const endpoints: APIEndpoint[] = [
      {
        path: '/api/auth/login',
        method: 'POST',
        description: 'User authentication',
        category: 'Authentication',
        expectedResponseTime: 200,
        rateLimit: 100,
        authentication: false
      },
      {
        path: '/api/auth/register',
        method: 'POST',
        description: 'User registration',
        category: 'Authentication',
        expectedResponseTime: 300,
        rateLimit: 50,
        authentication: false
      },
      {
        path: '/api/chatbots',
        method: 'GET',
        description: 'List chatbots',
        category: 'Chatbot Management',
        expectedResponseTime: 150,
        authentication: true
      },
      {
        path: '/api/chatbots',
        method: 'POST',
        description: 'Create chatbot',
        category: 'Chatbot Management',
        expectedResponseTime: 500,
        authentication: true
      },
      {
        path: '/api/chatbots/:id',
        method: 'PUT',
        description: 'Update chatbot',
        category: 'Chatbot Management',
        expectedResponseTime: 400,
        authentication: true
      },
      {
        path: '/api/chatbots/:id',
        method: 'DELETE',
        description: 'Delete chatbot',
        category: 'Chatbot Management',
        expectedResponseTime: 200,
        authentication: true
      },
      {
        path: '/api/analytics/events',
        method: 'POST',
        description: 'Track analytics events',
        category: 'Analytics',
        expectedResponseTime: 100,
        rateLimit: 1000,
        authentication: true
      },
      {
        path: '/api/analytics/dashboard',
        method: 'GET',
        description: 'Get analytics dashboard data',
        category: 'Analytics',
        expectedResponseTime: 300,
        authentication: true
      },
      {
        path: '/api/payments/subscribe',
        method: 'POST',
        description: 'Create subscription',
        category: 'Payments',
        expectedResponseTime: 800,
        authentication: true
      },
      {
        path: '/api/payments/webhook',
        method: 'POST',
        description: 'Payment webhook',
        category: 'Payments',
        expectedResponseTime: 200,
        authentication: false
      },
      {
        path: '/api/users/profile',
        method: 'GET',
        description: 'Get user profile',
        category: 'User Management',
        expectedResponseTime: 150,
        authentication: true
      },
      {
        path: '/api/users/profile',
        method: 'PUT',
        description: 'Update user profile',
        category: 'User Management',
        expectedResponseTime: 250,
        authentication: true
      }
    ];

    endpoints.forEach(endpoint => {
      const key = `${endpoint.method}:${endpoint.path}`;
      this.apiEndpoints.set(key, endpoint);
    });
  }

  // Setup event listeners
  private setupEventListeners(): void {
    // Listen to performance events
    analyticsService.on('event', (event: any) => {
      if (event.type === AnalyticsEventType.PERFORMANCE_METRIC) {
        this.processPerformanceEvent(event);
      }
    });
  }

  // Start system monitoring
  private startSystemMonitoring(): void {
    // Simulate system monitoring every 30 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);

    // Initial collection
    this.collectSystemMetrics();
  }

  // Collect system metrics
  private collectSystemMetrics(): void {
    const metrics: SystemPerformanceMetrics = {
      timestamp: new Date(),
      cpuUsage: this.getMockCPUUsage(),
      memoryUsage: this.getMockMemoryUsage(),
      diskUsage: this.getMockDiskUsage(),
      networkTraffic: {
        incoming: this.getMockNetworkTraffic(),
        outgoing: this.getMockNetworkTraffic()
      },
      databaseConnections: this.getMockDatabaseConnections(),
      cacheHitRate: this.getMockCacheHitRate(),
      errorRate: this.getMockErrorRate(),
      responseTime: this.getMockResponseTime(),
      throughput: this.getMockThroughput(),
      uptime: this.getMockUptime()
    };

    this.systemMetrics.push(metrics);

    // Keep only last 1000 metrics
    if (this.systemMetrics.length > 1000) {
      this.systemMetrics = this.systemMetrics.slice(-1000);
    }

    // Check for alerts
    this.checkAlerts(metrics);
  }

  // Mock system metrics (in real implementation, these would come from actual monitoring)
  private getMockCPUUsage(): number {
    return 30 + Math.random() * 40; // 30-70%
  }

  private getMockMemoryUsage(): number {
    return 50 + Math.random() * 30; // 50-80%
  }

  private getMockDiskUsage(): number {
    return 60 + Math.random() * 25; // 60-85%
  }

  private getMockNetworkTraffic(): number {
    return 1000 + Math.random() * 5000; // 1-6 MB/s
  }

  private getMockDatabaseConnections(): number {
    return 50 + Math.random() * 100; // 50-150 connections
  }

  private getMockCacheHitRate(): number {
    return 85 + Math.random() * 10; // 85-95%
  }

  private getMockErrorRate(): number {
    return Math.random() * 3; // 0-3%
  }

  private getMockResponseTime(): number {
    return 100 + Math.random() * 200; // 100-300ms
  }

  private getMockThroughput(): number {
    return 100 + Math.random() * 400; // 100-500 req/s
  }

  private getMockUptime(): number {
    return 99.5 + Math.random() * 0.5; // 99.5-100%
  }

  // Check for alerts
  private checkAlerts(metrics: SystemPerformanceMetrics): void {
    // CPU usage alert
    if (metrics.cpuUsage > this.monitoringConfig.cpuThreshold) {
      this.createAlert(
        'warning',
        'High CPU Usage',
        `CPU usage is at ${metrics.cpuUsage.toFixed(1)}%`,
        SystemMetricType.CPU_USAGE,
        metrics.cpuUsage,
        this.monitoringConfig.cpuThreshold
      );
    }

    // Memory usage alert
    if (metrics.memoryUsage > this.monitoringConfig.memoryThreshold) {
      this.createAlert(
        'critical',
        'High Memory Usage',
        `Memory usage is at ${metrics.memoryUsage.toFixed(1)}%`,
        SystemMetricType.MEMORY_USAGE,
        metrics.memoryUsage,
        this.monitoringConfig.memoryThreshold
      );
    }

    // Disk usage alert
    if (metrics.diskUsage > this.monitoringConfig.diskThreshold) {
      this.createAlert(
        'warning',
        'High Disk Usage',
        `Disk usage is at ${metrics.diskUsage.toFixed(1)}%`,
        SystemMetricType.DISK_USAGE,
        metrics.diskUsage,
        this.monitoringConfig.diskThreshold
      );
    }

    // Error rate alert
    if (metrics.errorRate > this.monitoringConfig.errorRateThreshold) {
      this.createAlert(
        'critical',
        'High Error Rate',
        `Error rate is at ${metrics.errorRate.toFixed(2)}%`,
        SystemMetricType.ERROR_RATE,
        metrics.errorRate,
        this.monitoringConfig.errorRateThreshold
      );
    }

    // Response time alert
    if (metrics.responseTime > this.monitoringConfig.responseTimeThreshold) {
      this.createAlert(
        'warning',
        'Slow Response Time',
        `Average response time is ${metrics.responseTime.toFixed(0)}ms`,
        SystemMetricType.RESPONSE_TIME,
        metrics.responseTime,
        this.monitoringConfig.responseTimeThreshold
      );
    }

    // Cache hit rate alert
    if (metrics.cacheHitRate < this.monitoringConfig.cacheHitRateThreshold) {
      this.createAlert(
        'warning',
        'Low Cache Hit Rate',
        `Cache hit rate is at ${metrics.cacheHitRate.toFixed(1)}%`,
        SystemMetricType.CACHE_HIT_RATE,
        metrics.cacheHitRate,
        this.monitoringConfig.cacheHitRateThreshold
      );
    }
  }

  // Create alert
  private createAlert(
    type: InfrastructureAlert['type'],
    title: string,
    description: string,
    metric: SystemMetricType,
    value: number,
    threshold: number
  ): void {
    // Check if similar alert already exists
    const existingAlert = this.alerts.find(alert => 
      alert.metric === metric && !alert.resolved
    );

    if (!existingAlert) {
      const alert: InfrastructureAlert = {
        id: this.generateId(),
        type,
        title,
        description,
        metric,
        value,
        threshold,
        timestamp: new Date(),
        resolved: false
      };

      this.alerts.push(alert);
      console.log('Infrastructure alert created:', alert);
    }
  }

  // Process performance event
  private processPerformanceEvent(event: any): void {
    // Update API metrics
    if (event.properties?.endpoint) {
      this.updateAPIMetrics(event);
    }
  }

  // Update API metrics
  private updateAPIMetrics(event: any): void {
    const endpoint = event.properties.endpoint;
    const method = event.properties.method || 'GET';
    const key = `${method}:${endpoint}`;

    const existingMetrics = this.apiMetrics.get(key);
    const responseTime = event.properties.responseTime || 0;
    const success = event.properties.success !== false;

    if (existingMetrics) {
      // Update existing metrics
      existingMetrics.totalRequests += 1;
      if (success) {
        existingMetrics.successfulRequests += 1;
      } else {
        existingMetrics.failedRequests += 1;
      }

      // Update response time (simple moving average)
      const totalResponseTime = existingMetrics.averageResponseTime * (existingMetrics.totalRequests - 1) + responseTime;
      existingMetrics.averageResponseTime = totalResponseTime / existingMetrics.totalRequests;

      // Update error rate
      existingMetrics.errorRate = (existingMetrics.failedRequests / existingMetrics.totalRequests) * 100;

      // Update throughput (requests per second)
      const timeWindow = 60; // 1 minute window
      const recentRequests = this.getRecentAPIRequests();
      existingMetrics.throughput = recentRequests.length / (timeWindow / 60);

      existingMetrics.lastUpdated = new Date();
    } else {
      // Create new metrics
      const newMetrics: APIPerformanceMetrics = {
        endpoint,
        method,
        totalRequests: 1,
        successfulRequests: success ? 1 : 0,
        failedRequests: success ? 0 : 1,
        averageResponseTime: responseTime,
        p95ResponseTime: responseTime,
        p99ResponseTime: responseTime,
        errorRate: success ? 0 : 100,
        throughput: 1,
        lastUpdated: new Date()
      };

      this.apiMetrics.set(key, newMetrics);
    }
  }

  // Get recent API requests for throughput calculation
  private getRecentAPIRequests(): any[] {
    // This would typically come from a request log
    // For now, return mock data
    return [];
  }

  // Track API request
  public trackAPIRequest(
    endpoint: string,
    method: string,
    responseTime: number,
    success: boolean = true,
    statusCode?: number,
    errorMessage?: string
  ): void {
    const event = {
      type: AnalyticsEventType.PERFORMANCE_METRIC,
      properties: {
        endpoint,
        method,
        responseTime,
        success,
        statusCode,
        errorMessage
      }
    };

    this.processPerformanceEvent(event);

    // Track with analytics service
    analyticsService.track(AnalyticsEventType.PERFORMANCE_METRIC, {
      endpoint,
      method,
      responseTime,
      success,
      statusCode,
      errorMessage
    });
  }

  // Get API performance metrics
  public getAPIPerformanceMetrics(endpoint?: string): APIPerformanceMetrics[] | APIPerformanceMetrics | null {
    if (endpoint) {
      const metrics = Array.from(this.apiMetrics.values())
        .find(metric => metric.endpoint === endpoint);
      return metrics || null;
    }

    return Array.from(this.apiMetrics.values());
  }

  // Get system performance metrics
  public getSystemPerformanceMetrics(
    startDate?: Date,
    endDate?: Date,

  ): SystemPerformanceMetrics[] {
    let metrics = [...this.systemMetrics];

    if (startDate) {
      metrics = metrics.filter(metric => metric.timestamp >= startDate);
    }

    if (endDate) {
      metrics = metrics.filter(metric => metric.timestamp <= endDate);
    }

    return metrics.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Get current system status
  public getCurrentSystemStatus(): {
    status: 'healthy' | 'warning' | 'critical';
    metrics: SystemPerformanceMetrics;
    alerts: InfrastructureAlert[];
    uptime: number;
  } {
    const latestMetrics = this.systemMetrics[this.systemMetrics.length - 1];
    const activeAlerts = this.alerts.filter(alert => !alert.resolved);

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    if (activeAlerts.some(alert => alert.type === 'critical')) {
      status = 'critical';
    } else if (activeAlerts.some(alert => alert.type === 'warning')) {
      status = 'warning';
    }

    return {
      status,
      metrics: latestMetrics,
      alerts: activeAlerts,
      uptime: latestMetrics?.uptime || 0
    };
  }

  // Get infrastructure alerts
  public getInfrastructureAlerts(
    resolved?: boolean,
    type?: InfrastructureAlert['type']
  ): InfrastructureAlert[] {
    let alerts = [...this.alerts];

    if (resolved !== undefined) {
      alerts = alerts.filter(alert => alert.resolved === resolved);
    }

    if (type) {
      alerts = alerts.filter(alert => alert.type === type);
    }

    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Resolve alert
  public resolveAlert(alertId: string, assignedTo?: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date();
      if (assignedTo) {
        alert.assignedTo = assignedTo;
      }
    }
  }

  // Get API endpoints
  public getAPIEndpoints(): APIEndpoint[] {
    return Array.from(this.apiEndpoints.values());
  }

  // Add API endpoint
  public addAPIEndpoint(endpoint: APIEndpoint): void {
    const key = `${endpoint.method}:${endpoint.path}`;
    this.apiEndpoints.set(key, endpoint);
  }

  // Update monitoring configuration
  public updateMonitoringConfig(config: Partial<typeof this.monitoringConfig>): void {
    this.monitoringConfig = { ...this.monitoringConfig, ...config };
  }

  // Get monitoring configuration
  public getMonitoringConfig(): typeof this.monitoringConfig {
    return { ...this.monitoringConfig };
  }

  // Get system health score
  public getSystemHealthScore(): number {
    const latestMetrics = this.systemMetrics[this.systemMetrics.length - 1];
    if (!latestMetrics) return 0;

    let score = 100;

    // Deduct points for high resource usage
    if (latestMetrics.cpuUsage > 80) score -= 20;
    else if (latestMetrics.cpuUsage > 60) score -= 10;

    if (latestMetrics.memoryUsage > 90) score -= 20;
    else if (latestMetrics.memoryUsage > 70) score -= 10;

    if (latestMetrics.diskUsage > 95) score -= 20;
    else if (latestMetrics.diskUsage > 80) score -= 10;

    // Deduct points for performance issues
    if (latestMetrics.errorRate > 5) score -= 30;
    else if (latestMetrics.errorRate > 2) score -= 15;

    if (latestMetrics.responseTime > 1000) score -= 20;
    else if (latestMetrics.responseTime > 500) score -= 10;

    if (latestMetrics.cacheHitRate < 70) score -= 10;

    return Math.max(0, score);
  }

  // Get performance trends
  public getPerformanceTrends(days: number = 7): Array<{
    date: Date;
    cpuUsage: number;
    memoryUsage: number;
    errorRate: number;
    responseTime: number;
    throughput: number;
  }> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    
    const metrics = this.getSystemPerformanceMetrics(startDate, endDate);
    
    // Group by day and calculate averages
    const dailyMetrics = new Map<string, {
      cpuUsage: number[];
      memoryUsage: number[];
      errorRate: number[];
      responseTime: number[];
      throughput: number[];
    }>();

    metrics.forEach(metric => {
      const dateKey = metric.timestamp.toDateString();
      const existing = dailyMetrics.get(dateKey) || {
        cpuUsage: [],
        memoryUsage: [],
        errorRate: [],
        responseTime: [],
        throughput: []
      };

      existing.cpuUsage.push(metric.cpuUsage);
      existing.memoryUsage.push(metric.memoryUsage);
      existing.errorRate.push(metric.errorRate);
      existing.responseTime.push(metric.responseTime);
      existing.throughput.push(metric.throughput);

      dailyMetrics.set(dateKey, existing);
    });

    return Array.from(dailyMetrics.entries()).map(([dateKey, values]) => ({
      date: new Date(dateKey),
      cpuUsage: values.cpuUsage.reduce((a, b) => a + b, 0) / values.cpuUsage.length,
      memoryUsage: values.memoryUsage.reduce((a, b) => a + b, 0) / values.memoryUsage.length,
      errorRate: values.errorRate.reduce((a, b) => a + b, 0) / values.errorRate.length,
      responseTime: values.responseTime.reduce((a, b) => a + b, 0) / values.responseTime.length,
      throughput: values.throughput.reduce((a, b) => a + b, 0) / values.throughput.length
    })).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create singleton instance
export const operationalAnalyticsService = new OperationalAnalyticsService();

// Export default instance
export default operationalAnalyticsService; 