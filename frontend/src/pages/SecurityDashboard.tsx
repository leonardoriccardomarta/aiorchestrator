import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Chart } from '../components/ui/Chart';
import { Loading } from '../components/ui/Loading';
import { Modal } from '../components/ui/Modal';

const SecurityDashboard: React.FC = () => {
  const [securityData, setSecurityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showThreatDetails, setShowThreatDetails] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState<any>(null);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSecurityData();
      setSecurityData(data);
    } catch (error) {
      console.error('Errore nel caricamento dati sicurezza:', error);
    } finally {
      setLoading(false);
    }
  };

  const threatData = [
    { label: 'Bloccati', value: securityData?.threats?.blocked || 0, color: '#10B981' },
    { label: 'Sospetti', value: securityData?.threats?.suspicious || 0, color: '#F59E0B' },
    { label: 'Attivi', value: securityData?.threats?.active || 0, color: '#EF4444' },
  ];

  const attackTypeData = [
    { label: 'DDoS', value: securityData?.attackTypes?.ddos || 0, color: '#EF4444' },
    { label: 'Brute Force', value: securityData?.attackTypes?.bruteForce || 0, color: '#F59E0B' },
    { label: 'SQL Injection', value: securityData?.attackTypes?.sqlInjection || 0, color: '#8B5CF6' },
    { label: 'XSS', value: securityData?.attackTypes?.xss || 0, color: '#06B6D4' },
  ];

  if (loading) {
    return <Loading text="Caricamento dashboard sicurezza..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">🛡️ Dashboard Sicurezza</h1>
          <p className="text-slate-600 mt-2">Monitoraggio in tempo reale della sicurezza del sistema</p>
        </div>

        {/* Security Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Stato Sicurezza</h2>
              <p className="text-slate-600">Ultimo aggiornamento: {new Date().toLocaleString()}</p>
            </div>
            <Badge
              variant={securityData?.overallStatus === 'secure' ? 'success' : 'warning'}
              size="lg"
            >
              {securityData?.overallStatus === 'secure' ? ' Sicuro' : ' Attenzione'}
            </Badge>
          </div>
        </div>

        {/* Security Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🛡️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Minacce Bloccate</p>
                <p className="text-2xl font-bold text-slate-900">{securityData?.threats?.blocked || 0}</p>
                <p className="text-sm text-green-600">+15% vs ieri</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Minacce Attive</p>
                <p className="text-2xl font-bold text-slate-900">{securityData?.threats?.active || 0}</p>
                <p className="text-sm text-yellow-600">Monitorate</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <span className="text-2xl">🔐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Autenticazioni</p>
                <p className="text-2xl font-bold text-slate-900">{securityData?.auth?.total || 0}</p>
                <p className="text-sm text-indigo-600">Oggi</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Score Sicurezza</p>
                <p className="text-2xl font-bold text-slate-900">{securityData?.securityScore || 95}</p>
                <p className="text-sm text-purple-600">/100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Distribuzione Minacce</h3>
            <Chart
              data={threatData}
              type="doughnut"
              height={200}
            />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Tipi di Attacco</h3>
            <Chart
              data={attackTypeData}
              type="bar"
              height={200}
            />
          </div>
        </div>

        {/* Real-time Threats */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">🚨 Minacce in Tempo Reale</h3>
            <Button variant="outline" size="sm">
              🔄 Aggiorna
            </Button>
          </div>
          
          <div className="space-y-3">
            {securityData?.recentThreats?.map((threat: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    threat.severity === 'high' ? 'bg-red-500' :
                    threat.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium text-slate-900">{threat.type}</p>
                    <p className="text-sm text-slate-600">IP: {threat.ip} • {threat.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      threat.severity === 'high' ? 'destructive' :
                      threat.severity === 'medium' ? 'warning' : 'success'
                    }
                  >
                    {threat.severity === 'high' ? 'Alto' :
                     threat.severity === 'medium' ? 'Medio' : 'Basso'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedThreat(threat);
                      setShowThreatDetails(true);
                    }}
                  >
                    👁️ Dettagli
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-medium text-slate-900 mb-4">🔐 Autenticazione</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Login Riusciti</span>
                <span className="font-medium">{securityData?.auth?.successful || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Login Falliti</span>
                <span className="font-medium text-red-600">{securityData?.auth?.failed || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Account Bloccati</span>
                <span className="font-medium text-yellow-600">{securityData?.auth?.locked || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-medium text-slate-900 mb-4"> Network</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Connessioni Attive</span>
                <span className="font-medium">{securityData?.network?.activeConnections || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">IP Bloccati</span>
                <span className="font-medium text-red-600">{securityData?.network?.blockedIPs || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Rate Limit Attivi</span>
                <span className="font-medium text-yellow-600">{securityData?.network?.rateLimited || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-medium text-slate-900 mb-4"> Compliance</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">GDPR Status</span>
                <Badge variant="success" size="sm"> Conforme</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">SOC 2 Status</span>
                <Badge variant="success" size="sm"> Conforme</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">ISO 27001</span>
                <Badge variant="warning" size="sm">🔄 In Progress</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Security Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">⚡ Azioni Rapide</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16">
               Blocca IP
            </Button>
            <Button variant="outline" className="h-16">
              🔐 Reset Password
            </Button>
            <Button variant="outline" className="h-16">
              📧 Invia Alert
            </Button>
            <Button variant="outline" className="h-16">
               Genera Report
            </Button>
          </div>
        </div>

        {/* Threat Details Modal */}
        <Modal
          isOpen={showThreatDetails}
          onClose={() => setShowThreatDetails(false)}
          title="Dettagli Minaccia"
          size="lg"
        >
          {selectedThreat && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Tipo</label>
                  <p className="text-slate-900">{selectedThreat.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Severità</label>
                  <Badge
                    variant={
                      selectedThreat.severity === 'high' ? 'destructive' :
                      selectedThreat.severity === 'medium' ? 'warning' : 'success'
                    }
                  >
                    {selectedThreat.severity}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">IP</label>
                  <p className="text-slate-900 font-mono">{selectedThreat.ip}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Posizione</label>
                  <p className="text-slate-900">{selectedThreat.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Timestamp</label>
                  <p className="text-slate-900">{new Date(selectedThreat.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Stato</label>
                  <Badge variant="success">Bloccato</Badge>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700">Descrizione</label>
                <p className="text-slate-900">{selectedThreat.description}</p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline">
                  📧 Invia Alert
                </Button>
                <Button variant="destructive">
                  🚫 Blocca IP
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default SecurityDashboard; 
