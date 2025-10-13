import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Chart } from '../components/ui/Chart';
import { Loading } from '../components/ui/Loading';
import { Modal } from '../components/ui/Modal';

const Compliance: React.FC = () => {
  const [complianceData, setComplianceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFramework, setSelectedFramework] = useState<any>(null);
  const [showAssessment, setShowAssessment] = useState(false);

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const fetchComplianceData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getComplianceData();
      setComplianceData(data);
    } catch (error) {
      console.error('Errore nel caricamento dati compliance:', error);
    } finally {
      setLoading(false);
    }
  };

  const complianceDataChart = [
    { label: 'Conforme', value: complianceData?.overall?.compliant || 0, color: '#10B981' },
    { label: 'Parzialmente', value: complianceData?.overall?.partial || 0, color: '#F59E0B' },
    { label: 'Non Conforme', value: complianceData?.overall?.nonCompliant || 0, color: '#EF4444' },
  ];

  const frameworks = [
    {
      name: 'GDPR',
      status: 'compliant',
      score: 98,
      lastAssessment: '2024-01-15',
      nextAssessment: '2024-07-15',
      requirements: 45,
      compliant: 44,
      description: 'Regolamento Generale sulla Protezione dei Dati',
    },
    {
      name: 'SOC 2',
      status: 'compliant',
      score: 95,
      lastAssessment: '2024-01-10',
      nextAssessment: '2024-07-10',
      requirements: 67,
      compliant: 64,
      description: 'System and Organization Controls 2',
    },
    {
      name: 'ISO 27001',
      status: 'partial',
      score: 78,
      lastAssessment: '2024-01-05',
      nextAssessment: '2024-04-05',
      requirements: 114,
      compliant: 89,
      description: 'Information Security Management System',
    },
    {
      name: 'PCI DSS',
      status: 'compliant',
      score: 92,
      lastAssessment: '2024-01-20',
      nextAssessment: '2024-07-20',
      requirements: 78,
      compliant: 72,
      description: 'Payment Card Industry Data Security Standard',
    },
    {
      name: 'HIPAA',
      status: 'compliant',
      score: 96,
      lastAssessment: '2024-01-12',
      nextAssessment: '2024-07-12',
      requirements: 54,
      compliant: 52,
      description: 'Health Insurance Portability and Accountability Act',
    },
  ];

  if (loading) {
    return <Loading text="Caricamento dati compliance..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📋 Compliance & Governance</h1>
          <p className="text-gray-600 mt-2">Gestione completa della conformità normativa</p>
        </div>

        {/* Overall Compliance Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Stato Compliance Generale</h2>
              <p className="text-gray-600">Ultimo aggiornamento: {new Date().toLocaleString()}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                {complianceData?.overall?.score || 92}%
              </div>
              <Badge variant="success" size="lg">
                 Conforme
              </Badge>
            </div>
          </div>
        </div>

        {/* Compliance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Framework Conformi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {frameworks.filter(f => f.status === 'compliant').length}
                </p>
                <p className="text-sm text-green-600">Su {frameworks.length} totali</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Revisione</p>
                <p className="text-2xl font-bold text-gray-900">
                  {frameworks.filter(f => f.status === 'partial').length}
                </p>
                <p className="text-sm text-yellow-600">Richiedono attenzione</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Requisiti Totali</p>
                <p className="text-2xl font-bold text-gray-900">
                  {frameworks.reduce((sum, f) => sum + f.requirements, 0)}
                </p>
                <p className="text-sm text-blue-600">Implementati</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🔍</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Prossima Valutazione</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.min(...frameworks.map(f => new Date(f.nextAssessment).getTime()))}
                </p>
                <p className="text-sm text-purple-600">Tra 30 giorni</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Overview Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Panoramica Compliance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Chart
              data={complianceDataChart}
              type="doughnut"
              height={200}
            />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">GDPR</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                  <span className="text-sm font-medium">98%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">SOC 2</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <span className="text-sm font-medium">95%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ISO 27001</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-sm font-medium">78%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Framework Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {frameworks.map((framework, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{framework.name}</h3>
                <Badge
                  variant={
                    framework.status === 'compliant' ? 'success' :
                    framework.status === 'partial' ? 'warning' : 'destructive'
                  }
                >
                  {framework.status === 'compliant' ? ' Conforme' :
                   framework.status === 'partial' ? ' Parziale' : ' Non Conforme'}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{framework.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Score</span>
                  <span className="text-lg font-bold text-gray-900">{framework.score}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      framework.score >= 90 ? 'bg-green-500' :
                      framework.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${framework.score}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{framework.compliant}/{framework.requirements} requisiti</span>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Ultima valutazione</span>
                    <span>{new Date(framework.lastAssessment).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Prossima valutazione</span>
                    <span>{new Date(framework.nextAssessment).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedFramework(framework);
                    setShowAssessment(true);
                  }}
                >
                   Valutazione
                </Button>
                <Button size="sm" variant="outline">
                  📄 Report
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Azioni Compliance</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16">
              🔍 Nuova Valutazione
            </Button>
            <Button variant="outline" className="h-16">
              📄 Genera Report
            </Button>
            <Button variant="outline" className="h-16">
              📧 Invia Alert
            </Button>
            <Button variant="outline" className="h-16">
              ⚙️ Configura
            </Button>
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Valutazioni Recenti</h3>
          <div className="space-y-3">
            {frameworks.slice(0, 5).map((framework, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    framework.status === 'compliant' ? 'bg-green-500' :
                    framework.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{framework.name}</p>
                    <p className="text-sm text-gray-600">
                      Valutazione del {new Date(framework.lastAssessment).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium">{framework.score}%</span>
                  <Badge
                    variant={
                      framework.status === 'compliant' ? 'success' :
                      framework.status === 'partial' ? 'warning' : 'destructive'
                    }
                    size="sm"
                  >
                    {framework.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Modal */}
        <Modal
          isOpen={showAssessment}
          onClose={() => setShowAssessment(false)}
          title={`Valutazione ${selectedFramework?.name}`}
          size="xl"
        >
          {selectedFramework && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Framework</label>
                  <p className="text-gray-900">{selectedFramework.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stato Attuale</label>
                  <Badge
                    variant={
                      selectedFramework.status === 'compliant' ? 'success' :
                      selectedFramework.status === 'partial' ? 'warning' : 'destructive'
                    }
                  >
                    {selectedFramework.status}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Score</label>
                  <p className="text-gray-900">{selectedFramework.score}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Requisiti</label>
                  <p className="text-gray-900">{selectedFramework.compliant}/{selectedFramework.requirements}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requisiti Non Conformi</label>
                <div className="space-y-2">
                  {selectedFramework.status === 'partial' && (
                    <>
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-800">Access Control Policy</p>
                        <p className="text-xs text-red-600">Mancante documentazione aggiornata</p>
                      </div>
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-800">Incident Response Plan</p>
                        <p className="text-xs text-red-600">Test semestrale non completato</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline">
                  📄 Scarica Report
                </Button>
                <Button>
                  🔄 Avvia Valutazione
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Compliance; 