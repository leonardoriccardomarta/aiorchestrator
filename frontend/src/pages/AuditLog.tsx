import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Loading } from '../components/ui/Loading';
import { Chart } from '../components/ui/Chart';

const AuditLog: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAuditLogs();
      setLogs(data);
    } catch (error) {
      console.error('Errore nel caricamento audit log:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'timestamp',
      header: 'Data/Ora',
      accessor: (log: any) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {new Date(log.timestamp).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(log.timestamp).toLocaleTimeString()}
          </p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'level',
      header: 'Livello',
      accessor: (log: any) => (
        <Badge
          variant={
            log.level === 'error' ? 'destructive' :
            log.level === 'warning' ? 'warning' :
            log.level === 'info' ? 'info' : 'default'
          }
        >
          {log.level.toUpperCase()}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'action',
      header: 'Azione',
      accessor: (log: any) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{log.action}</p>
          <p className="text-xs text-gray-500">{log.resource}</p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'user',
      header: 'Utente',
      accessor: (log: any) => (
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {log.user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{log.user?.name || 'Sistema'}</p>
            <p className="text-xs text-gray-500">{log.user?.email || 'system@example.com'}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'ip',
      header: 'IP',
      accessor: (log: any) => (
        <span className="text-sm text-gray-600 font-mono">{log.ip}</span>
      ),
    },
    {
      key: 'details',
      header: 'Dettagli',
      accessor: (log: any) => (
        <div>
          <p className="text-sm text-gray-900">{log.message}</p>
          {log.details && (
            <p className="text-xs text-gray-500 mt-1">
              {log.details.length > 50 ? `${log.details.substring(0, 50)}...` : log.details}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Stato',
      accessor: (log: any) => (
        <Badge
          variant={log.status === 'success' ? 'success' : 'destructive'}
        >
          {log.status === 'success' ? 'Successo' : 'Errore'}
        </Badge>
      ),
      sortable: true,
    },
  ];

  // Chart data for audit analytics
  const chartData = [
    { label: 'Errori', value: logs.filter(l => l.level === 'error').length, color: '#EF4444' },
    { label: 'Warning', value: logs.filter(l => l.level === 'warning').length, color: '#F59E0B' },
    { label: 'Info', value: logs.filter(l => l.level === 'info').length, color: '#3B82F6' },
    { label: 'Debug', value: logs.filter(l => l.level === 'debug').length, color: '#6B7280' },
  ];

  const actionData = [
    { label: 'Login', value: logs.filter(l => l.action === 'login').length, color: '#10B981' },
    { label: 'Logout', value: logs.filter(l => l.action === 'logout').length, color: '#6B7280' },
    { label: 'Create', value: logs.filter(l => l.action === 'create').length, color: '#3B82F6' },
    { label: 'Update', value: logs.filter(l => l.action === 'update').length, color: '#F59E0B' },
    { label: 'Delete', value: logs.filter(l => l.action === 'delete').length, color: '#EF4444' },
  ];

  if (loading) {
    return <Loading text="Caricamento audit log..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📋 Audit Log</h1>
          <p className="text-gray-600 mt-2">Tracciamento completo di tutte le attività del sistema</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Log Totali</p>
                <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
                <p className="text-sm text-blue-600">Ultimi 30 giorni</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Errori</p>
                <p className="text-2xl font-bold text-gray-900">
                  {logs.filter(l => l.level === 'error').length}
                </p>
                <p className="text-sm text-red-600">+5% vs ieri</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Warning</p>
                <p className="text-2xl font-bold text-gray-900">
                  {logs.filter(l => l.level === 'warning').length}
                </p>
                <p className="text-sm text-yellow-600">-2% vs ieri</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Successi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {logs.filter(l => l.status === 'success').length}
                </p>
                <p className="text-sm text-green-600">98.5% tasso</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuzione Livelli</h3>
            <Chart
              data={chartData}
              type="pie"
              height={300}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Azioni Più Comuni</h3>
            <Chart
              data={actionData}
              type="bar"
              height={300}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              {/* Search */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Cerca nei log..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                  className="w-full md:w-64"
                />
              </div>

              {/* Level Filter */}
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tutti i Livelli</option>
                <option value="error">Errori</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
              </select>

              {/* Action Filter */}
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tutte le Azioni</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
              </select>

              {/* Date Range */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1d">Ultimo giorno</option>
                <option value="7d">Ultimi 7 giorni</option>
                <option value="30d">Ultimi 30 giorni</option>
                <option value="90d">Ultimi 90 giorni</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" leftIcon="📥">
                Esporta CSV
              </Button>
              <Button variant="outline" leftIcon="🔄">
                Aggiorna
              </Button>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-lg shadow">
          <Table
            data={logs.filter(log => {
              const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
              const matchesAction = filterAction === 'all' || log.action === filterAction;
              return matchesSearch && matchesLevel && matchesAction;
            })}
            columns={columns}
            sortable={true}
            filterable={true}
            pagination={true}
            pageSize={20}
          />
        </div>

        {/* Security Insights */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4"> Insights di Sicurezza</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-2"> Attività Sospette</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-red-700">Login falliti</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-700">IP sospetti</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-700">Accessi non autorizzati</span>
                  <span className="font-medium">1</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2"> Metriche Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-700">Tempo medio risposta</span>
                  <span className="font-medium">145ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-700">Errori 5xx</span>
                  <span className="font-medium">0.1%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-700">Timeout</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2"> Compliance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">GDPR compliance</span>
                  <span className="font-medium">100%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Audit trail</span>
                  <span className="font-medium">Completo</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Data retention</span>
                  <span className="font-medium">Configurato</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLog; 