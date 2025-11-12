import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const RevenueOptimization: React.FC = () => {
  const [revenueData, setRevenueData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState('pricing');

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRevenueData();
      setRevenueData(data);
    } catch (error) {
      console.error('Errore nel caricamento revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Caricamento ottimizzazione ricavi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900"> Ottimizzazione Ricavi</h1>
          <p className="text-slate-600 mt-2">Strategie avanzate per massimizzare i ricavi e ridurre il churn</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">MRR</p>
                <p className="text-2xl font-bold text-slate-900">
                  €{revenueData?.mrr || 0}
                </p>
                <p className="text-sm text-green-600">+8.5% vs mese scorso</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Crescita</p>
                <p className="text-2xl font-bold text-slate-900">
                  {revenueData?.growth || 0}%
                </p>
                <p className="text-sm text-indigo-600">+2.3% vs target</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">📉</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Churn Rate</p>
                <p className="text-2xl font-bold text-slate-900">
                  {revenueData?.churnRate || 0}%
                </p>
                <p className="text-sm text-red-600">-1.2% vs mese scorso</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">LTV</p>
                <p className="text-2xl font-bold text-slate-900">
                  €{revenueData?.ltv || 0}
                </p>
                <p className="text-sm text-purple-600">+12% vs target</p>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'pricing', name: 'Pricing Strategy', icon: '' },
                { id: 'churn', name: 'Churn Prevention', icon: '🛡️' },
                { id: 'upsell', name: 'Upsell/Cross-sell', icon: '' },
                { id: 'acquisition', name: 'Customer Acquisition', icon: '' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStrategy(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedStrategy === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {selectedStrategy === 'pricing' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900"> Strategia di Pricing</h3>
                
                {/* Pricing Optimization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h4 className="font-medium text-slate-900 mb-4">Ottimizzazione Prezzi</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Prezzo Attuale</span>
                        <span className="text-sm font-medium">€29/mese</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Prezzo Ottimale</span>
                        <span className="text-sm font-medium text-green-600">€39/mese</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Aumento Ricavi</span>
                        <span className="text-sm font-medium text-green-600">+34%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Impatto Churn</span>
                        <span className="text-sm font-medium text-red-600">+2%</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                       Applica Nuovo Prezzo
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <h4 className="font-medium text-slate-900 mb-4">Analisi Competitiva</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Media Mercato</span>
                        <span className="text-sm font-medium">€42/mese</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Posizione</span>
                        <span className="text-sm font-medium text-yellow-600">30% sotto media</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Opportunità</span>
                        <span className="text-sm font-medium text-green-600">+€15/mese</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Pricing */}
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4"> Pricing Dinamico</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600 mb-2">€29</div>
                      <div className="text-sm text-slate-600">Starter</div>
                      <div className="text-xs text-slate-500">Per piccole aziende</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">€49</div>
                      <div className="text-sm text-slate-600">Professional</div>
                      <div className="text-xs text-slate-500">Per medie aziende</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">€99</div>
                      <div className="text-sm text-slate-600">Enterprise</div>
                      <div className="text-xs text-slate-500">Per grandi aziende</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedStrategy === 'churn' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">🛡️ Prevenzione Churn</h3>
                
                {/* Churn Prediction */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-50 rounded-lg p-6">
                    <h4 className="font-medium text-slate-900 mb-4">🔮 Predizione Churn</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Utenti a Rischio</span>
                        <span className="text-sm font-medium text-red-600">247</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Probabilità Churn</span>
                        <span className="text-sm font-medium text-red-600">78%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Valore a Rischio</span>
                        <span className="text-sm font-medium text-red-600">€7,234</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                      🚨 Azioni Preventive
                    </button>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-medium text-slate-900 mb-4"> Retention Strategies</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm text-slate-600">Email di riattivazione</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm text-slate-600">Offerte personalizzate</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm text-slate-600">Supporto dedicato</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm text-slate-600">Onboarding migliorato</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Churn Reasons */}
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4"> Cause Principali Churn</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Prezzo troppo alto</span>
                      <span className="text-sm font-medium">32%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Funzionalità insufficienti</span>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Supporto scadente</span>
                      <span className="text-sm font-medium">18%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedStrategy === 'upsell' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900"> Upsell & Cross-sell</h3>
                
                {/* Upsell Opportunities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-medium text-slate-900 mb-4"> Opportunità Upsell</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Utenti Eligibili</span>
                        <span className="text-sm font-medium text-green-600">1,234</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Tasso Conversione</span>
                        <span className="text-sm font-medium text-green-600">15.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Ricavi Aggiuntivi</span>
                        <span className="text-sm font-medium text-green-600">€18,450</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                       Avvia Campagna Upsell
                    </button>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-6">
                    <h4 className="font-medium text-slate-900 mb-4">🔄 Cross-sell Analytics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Prodotti Suggeriti</span>
                        <span className="text-sm font-medium">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Tasso Accettazione</span>
                        <span className="text-sm font-medium text-indigo-600">23%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Valore Medio</span>
                        <span className="text-sm font-medium">€45</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Recommendations */}
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4">📦 Raccomandazioni Prodotti</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="text-lg font-medium text-slate-900 mb-2">Premium Support</div>
                      <div className="text-sm text-slate-600 mb-2">Supporto prioritario 24/7</div>
                      <div className="text-lg font-bold text-green-600 mb-2">€29/mese</div>
                      <div className="text-xs text-slate-500">Conversione: 18%</div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="text-lg font-medium text-slate-900 mb-2">Advanced Analytics</div>
                      <div className="text-sm text-slate-600 mb-2">Analisi avanzate e report</div>
                      <div className="text-lg font-bold text-green-600 mb-2">€19/mese</div>
                      <div className="text-xs text-slate-500">Conversione: 12%</div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="text-lg font-medium text-slate-900 mb-2">API Access</div>
                      <div className="text-sm text-slate-600 mb-2">Accesso API completo</div>
                      <div className="text-lg font-bold text-green-600 mb-2">€39/mese</div>
                      <div className="text-xs text-slate-500">Conversione: 8%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedStrategy === 'acquisition' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900"> Customer Acquisition</h3>
                
                {/* Acquisition Channels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h4 className="font-medium text-slate-900 mb-4"> Canali di Acquisizione</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Organic Search</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Paid Advertising</span>
                        <span className="text-sm font-medium">28%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Referral</span>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Social Media</span>
                        <span className="text-sm font-medium">12%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h4 className="font-medium text-slate-900 mb-4"> Costo Acquisizione</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">CAC Medio</span>
                        <span className="text-sm font-medium">€45</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">LTV/CAC Ratio</span>
                        <span className="text-sm font-medium text-green-600">3.2</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Payback Period</span>
                        <span className="text-sm font-medium">8 mesi</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optimization Strategies */}
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4"> Strategie di Ottimizzazione</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-slate-900 mb-3">SEO & Content</h5>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          <span className="text-sm text-slate-600">Ottimizzazione keyword</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          <span className="text-sm text-slate-600">Content marketing</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          <span className="text-sm text-slate-600">Backlink building</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-slate-900 mb-3">Paid Advertising</h5>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                          <span className="text-sm text-slate-600">Google Ads</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                          <span className="text-sm text-slate-600">Facebook Ads</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                          <span className="text-sm text-slate-600">LinkedIn Ads</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
             Genera Report
          </button>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
             Applica Strategie
          </button>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
             Monitora Risultati
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevenueOptimization; 
