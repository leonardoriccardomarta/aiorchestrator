import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Chart } from '../components/ui/Chart';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';

const Performance: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('1h');
  const [selectedMetric, setSelectedMetric] = useState('responseTime');

  useEffect(() => {
    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPerformanceData({ timeRange });
      setPerformanceData(data);
    } catch (error) {
      console.error('Errore nel caricamento performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const responseTimeData = [
    { label: 'API Calls', value: performanceData?.responseTime?.api || 150, color: '#3B82F6' },
    { label: 'Database', value: performanceData?.responseTime?.database || 45, color: '#10B981' },
    { label: 'Cache', value: performanceData?.responseTime?.cache || 5, color: '#F59E0B' },
    { label: 'External APIs', value: performanceData?.responseTime?.external || 200, color: '#EF4444' },
  ];

  const throughputData = [
    { label: 'Requests/sec', value: performanceData?.throughput?.requests || 1200, color: '#3B82F6' },
    { label: 'Database ops/sec', value: performanceData?.throughput?.database || 800, color: '#10B981' },
    { label: 'Cache hits/sec', value: performanceData?.throughput?.cache || 2000, color: '#F59E0B' },
  ];

  const errorRateData = [
    { label: 'Success', value: 98.5, color: '#10B981' },
    { label: '4xx Errors', value: 1.2, color: '#F59E0B' },
    { label: '5xx Errors', value: 0.3, color: '#EF4444' },
  ];

  const memoryData = [
    { label: 'Used', value: performanceData?.memory?.used || 65, color: '#3B82F6' },
    { label: 'Free', value: performanceData?.memory?.free || 35, color: '#10B981' },
  ];

  if (loading) {
    return <Loading text="Caricamento metriche performance..." />;
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">⚡ Performance Monitoring</h1>
          <p className="text-gray-600 mt-2">Monitora le performance del sistema in tempo reale</p>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {['1h', '6h', '24h', '7d', '30d'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range === '1h' ? '1 Ora' :
                   range === '6h' ? '6 Ore' :
                   range === '24h' ? '24 Ore' :
                   range === '7d' ? '7 Giorni' : '30 Giorni'}
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="success">🟢 Sistema Operativo</Badge>
              <Badge variant="info"> Aggiornamento: 30s</Badge>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceData?.avgResponseTime || 150}ms
                </p>
                <p className="text-sm text-green-600">-5% vs ieri</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Throughput</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceData?.throughput?.requests || 1200}/s
                </p>
                <p className="text-sm text-green-600">+8% vs ieri</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">💾</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Memory Usage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceData?.memory?.used || 65}%
                </p>
                <p className="text-sm text-yellow-600">+2% vs ieri</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceData?.uptime || 99.9}%
                </p>
                <p className="text-sm text-green-600">Stabile</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Breakdown</h3>
            <Chart
              data={responseTimeData}
              type="bar"
              height={250}
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Target</p>
                <p className="text-lg font-bold text-green-600">&lt;200ms</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Current</p>
                <p className="text-lg font-bold text-blue-600">{performanceData?.avgResponseTime || 150}ms</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Throughput Metrics</h3>
            <Chart
              data={throughputData}
              type="bar"
              height={250}
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Peak</p>
                <p className="text-lg font-bold text-purple-600">2,500/s</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Average</p>
                <p className="text-lg font-bold text-blue-600">1,200/s</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Rate and Memory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Rate Distribution</h3>
            <Chart
              data={errorRateData}
              type="doughnut"
              height={200}
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Overall Success Rate</p>
              <p className="text-2xl font-bold text-green-600">98.5%</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Memory Usage</h3>
            <Chart
              data={memoryData}
              type="doughnut"
              height={200}
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Used</p>
                <p className="text-lg font-bold text-blue-600">{performanceData?.memory?.used || 65}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Free</p>
                <p className="text-lg font-bold text-green-600">{performanceData?.memory?.free || 35}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Alerts */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🚨 Performance Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-3">
                <span className="text-yellow-600"></span>
                <div>
                  <p className="font-medium text-gray-900">Response Time Warning</p>
                  <p className="text-sm text-gray-600">API endpoint /api/users taking longer than usual</p>
                </div>
              </div>
              <Badge variant="warning">Warning</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <span className="text-green-600"></span>
                <div>
                  <p className="font-medium text-gray-900">Performance Optimized</p>
                  <p className="text-sm text-gray-600">Database query optimization completed</p>
                </div>
              </div>
              <Badge variant="success">Resolved</Badge>
            </div>
          </div>
        </div>

        {/* Performance Recommendations */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4"> Performance Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Database Optimization</h4>
                <p className="text-sm text-gray-600">Consider adding indexes to frequently queried fields</p>
                <Button size="sm" variant="outline" className="mt-2">
                   Implementa
                </Button>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Cache Strategy</h4>
                <p className="text-sm text-gray-600">Implement Redis caching for user sessions</p>
                <Button size="sm" variant="outline" className="mt-2">
                   Implementa
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">CDN Setup</h4>
                <p className="text-sm text-gray-600">Deploy static assets to CDN for faster loading</p>
                <Button size="sm" variant="outline" className="mt-2">
                   Implementa
                </Button>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Load Balancing</h4>
                <p className="text-sm text-gray-600">Consider horizontal scaling for high traffic</p>
                <Button size="sm" variant="outline" className="mt-2">
                   Implementa
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4"> Metriche Real-time</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {performanceData?.currentRequests || 45}
              </div>
              <p className="text-sm text-gray-600">Richieste Attive</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {performanceData?.cacheHitRate || 92}%
              </div>
              <p className="text-sm text-gray-600">Cache Hit Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {performanceData?.cpuUsage || 23}%
              </div>
              <p className="text-sm text-gray-600">CPU Usage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance; 