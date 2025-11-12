import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Chart } from '../components/ui/Chart';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { Table } from '../components/ui/Table';

const Security: React.FC = () => {
  const [securityData, setSecurityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedThreat, setSelectedThreat] = useState<any>(null);

  useEffect(() => {
    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSecurityData({ timeRange });
      setSecurityData(data);
    } catch (error) {
      console.error('Errore nel caricamento dati sicurezza:', error);
    } finally {
      setLoading(false);
    }
  };

  const threatData = [
    { label: 'SQL Injection', value: securityData?.threats?.sqlInjection || 0, color: '#EF4444' },
    { label: 'XSS Attacks', value: securityData?.threats?.xss || 0, color: '#F59E0B' },
    { label: 'CSRF Attempts', value: securityData?.threats?.csrf || 0, color: '#8B5CF6' },
    { label: 'Brute Force', value: securityData?.threats?.bruteForce || 0, color: '#EC4899' },
    { label: 'DDoS Attacks', value: securityData?.threats?.ddos || 0, color: '#06B6D4' },
  ];

  const securityScoreData = [
    { label: 'Authentication', value: securityData?.scores?.authentication || 95, color: '#10B981' },
    { label: 'Authorization', value: securityData?.scores?.authorization || 92, color: '#3B82F6' },
    { label: 'Data Protection', value: securityData?.scores?.dataProtection || 88, color: '#F59E0B' },
    { label: 'Network Security', value: securityData?.scores?.networkSecurity || 96, color: '#8B5CF6' },
  ];

  const complianceData = [
    { label: 'GDPR', value: securityData?.compliance?.gdpr || 100, color: '#10B981' },
    { label: 'SOC 2', value: securityData?.compliance?.soc2 || 95, color: '#3B82F6' },
    { label: 'ISO 27001', value: securityData?.compliance?.iso27001 || 90, color: '#F59E0B' },
    { label: 'PCI DSS', value: securityData?.compliance?.pciDss || 98, color: '#8B5CF6' },
  ];

  const threatColumns = [
    {
      key: 'timestamp',
      header: 'Data/Ora',
      accessor: (threat: any) => (
        <div>
          <p className="text-sm font-medium text-slate-900">
            {new Date(threat.timestamp).toLocaleDateString()}
          </p>
          <p className="text-xs text-slate-500">
            {new Date(threat.timestamp).toLocaleTimeString()}
          </p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'type',
      header: 'Tipo Minaccia',
      accessor: (threat: any) => (
        <Badge
          variant={
            threat.severity === 'high' ? 'destructive' :
            threat.severity === 'medium' ? 'warning' :
            'default'
          }
        >
          {threat.type}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'source',
      header: 'Sorgente',
      accessor: (threat: any) => (
        <div>
          <p className="text-sm font-medium text-slate-900">{threat.source.ip}</p>
          <p className="text-xs text-slate-500">{threat.source.country}</p>
        </div>
      ),
    },
    {
      key: 'severity',
      header: 'Severità',
      accessor: (threat: any) => (
        <Badge
          variant={
            threat.severity === 'high' ? 'destructive' :
            threat.severity === 'medium' ? 'warning' :
            'success'
          }
        >
          {threat.severity === 'high' ? 'Alta' :
           threat.severity === 'medium' ? 'Media' : 'Bassa'}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Stato',
      accessor: (threat: any) => (
        <Badge
          variant={threat.status === 'blocked' ? 'success' : 'destructive'}
        >
          {threat.status === 'blocked' ? 'Bloccato' : 'Permesso'}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Azioni',
      accessor: (threat: any) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedThreat(threat)}
          >
            👁️ Dettagli
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => blockIP(threat.source.ip)}
          >
            🚫 Blocca IP
          </Button>
        </div>
      ),
    },
  ];

  const blockIP = async (ip: string) => {
    try {
      await apiService.blockIP(ip);
      fetchSecurityData();
    } catch (error) {
      console.error('Errore nel blocco IP:', error);
    }
  };

  if (loading) {
    return <Loading text="Caricamento dati sicurezza..." />;
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">🛡️ Security Dashboard</h1>
          <p className="text-slate-600 mt-2">Monitora la sicurezza del sistema in tempo reale</p>
        </div>

        {/* Security Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">🟢</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Sistema Sicuro</h2>
                <p className="text-slate-600">Nessuna minaccia critica rilevata</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {['1h', '6h', '24h', '7d'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range === '1h' ? '1 Ora' :
                   range === '6h' ? '6 Ore' :
                   range === '24h' ? '24 Ore' : '7 Giorni'}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">🚨</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Minacce Bloccate</p>
                <p className="text-2xl font-bold text-slate-900">
                  {securityData?.blockedThreats || 156}
                </p>
                <p className="text-sm text-green-600">+23% vs ieri</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Tentativi di Accesso</p>
                <p className="text-2xl font-bold text-slate-900">
                  {securityData?.loginAttempts || 2847}
                </p>
                <p className="text-sm text-yellow-600">+12% vs ieri</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <span className="text-2xl">🔐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Utenti MFA</p>
                <p className="text-2xl font-bold text-slate-900">
                  {securityData?.mfaUsers || 89}%
                </p>
                <p className="text-sm text-indigo-600">+5% vs ieri</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Security Score</p>
                <p className="text-2xl font-bold text-slate-900">
                  {securityData?.overallScore || 94}/100
                </p>
                <p className="text-sm text-green-600">+2 punti vs ieri</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Minacce per Tipo</h3>
            <Chart
              data={threatData}
              type="bar"
              height={250}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Score Breakdown</h3>
            <Chart
              data={securityScoreData}
              type="doughnut"
              height={250}
            />
          </div>
        </div>

        {/* Compliance Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">📋 Compliance Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Object.entries(securityData?.compliance || {}).map(([key, value]: [string, any]) => (
              <div key={key} className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {value}%
                </div>
                <p className="text-sm font-medium text-slate-900 mb-1">
                  {key === 'gdpr' ? 'GDPR' :
                   key === 'soc2' ? 'SOC 2' :
                   key === 'iso27001' ? 'ISO 27001' : 'PCI DSS'}
                </p>
                <Badge variant="success" size="sm">
                  Compliant
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Threats */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">🚨 Minacce Recenti</h3>
            <Button variant="outline" size="sm">
              📥 Esporta Report
            </Button>
          </div>
          <Table
            data={securityData?.recentThreats || []}
            columns={threatColumns}
            sortable={true}
            filterable={true}
            pagination={true}
            pageSize={10}
          />
        </div>

        {/* Security Alerts */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">🔔 Security Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <span className="text-red-600">🚨</span>
                <div>
                  <p className="font-medium text-slate-900">Multiple Failed Login Attempts</p>
                  <p className="text-sm text-slate-600">IP 192.168.1.100 - 15 tentativi falliti</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Badge variant="destructive">High</Badge>
                <Button size="sm" variant="outline">
                   Risolvi
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-3">
                <span className="text-yellow-600"></span>
                <div>
                  <p className="font-medium text-slate-900">Suspicious API Activity</p>
                  <p className="text-sm text-slate-600">Rate limit exceeded for /api/users</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Badge variant="warning">Medium</Badge>
                <Button size="sm" variant="outline">
                   Risolvi
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Recommendations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4"> Security Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-1">Enable MFA for All Users</h4>
                <p className="text-sm text-slate-600">11% of users still don't have MFA enabled</p>
                <Button size="sm" variant="outline" className="mt-2">
                   Implementa
                </Button>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-1">Update Security Policies</h4>
                <p className="text-sm text-slate-600">Password policy needs strengthening</p>
                <Button size="sm" variant="outline" className="mt-2">
                   Implementa
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-1">Enable IP Whitelisting</h4>
                <p className="text-sm text-slate-600">Restrict admin access to specific IPs</p>
                <Button size="sm" variant="outline" className="mt-2">
                   Implementa
                </Button>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-1">Security Audit</h4>
                <p className="text-sm text-slate-600">Schedule quarterly security audit</p>
                <Button size="sm" variant="outline" className="mt-2">
                   Pianifica
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security; 
