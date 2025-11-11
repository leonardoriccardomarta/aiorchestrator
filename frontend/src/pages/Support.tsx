import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Inbox, Clock3, CheckCircle2, Smile } from 'lucide-react';

const Support: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSupportTickets();
      setTickets(data);
    } catch (error) {
      console.error('Errore nel caricamento ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Caricamento supporto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">Centro Supporto</h1>
          <p className="text-slate-600 mt-2">Gestisci ticket di supporto e assistenza clienti</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Ticket Totali',
              value: tickets.length,
              delta: '+8% vs mese scorso',
              icon: <Inbox className="w-5 h-5 text-indigo-600" />,
            },
            {
              title: 'In Attesa',
              value: 12,
              delta: 'Tempo medio: 2.3h',
              icon: <Clock3 className="w-5 h-5 text-amber-500" />,
            },
            {
              title: 'Risolti',
              value: '89%',
              delta: '+5% vs mese scorso',
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
            },
            {
              title: 'Soddisfazione',
              value: '4.8/5',
              delta: '+0.2 vs mese scorso',
              icon: <Smile className="w-5 h-5 text-purple-500" />,
            },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100">
                  {card.icon}
                </span>
              </div>
              <p className="text-2xl font-semibold text-slate-900">{card.value}</p>
              <p className="text-sm text-slate-500 mt-1">{card.delta}</p>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="border-b border-slate-200">
            <nav className="flex flex-wrap gap-4 px-6 py-3">
              {[
                { id: 'overview', name: 'Panoramica', icon: '' },
                { id: 'tickets', name: 'Ticket', icon: '📝' },
                { id: 'knowledge', name: 'Knowledge Base', icon: '📚' },
                { id: 'chat', name: 'Live Chat', icon: '💬' },
                { id: 'analytics', name: 'Analytics', icon: '' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">Panoramica Supporto</h3>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Azioni rapide</h4>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowNewTicket(true)}
                        className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                      >
                        ➕ Nuovo Ticket
                      </button>
                      <button className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-2.5 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                        📚 Knowledge Base
                      </button>
                      <button className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-2.5 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                        💬 Live Chat
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Tempo Risposta</span>
                        <span className="font-medium text-emerald-500">2.3h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Risoluzione</span>
                        <span className="font-medium text-emerald-500">89%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Soddisfazione</span>
                        <span className="font-medium text-emerald-500">4.8/5</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Priorità alta</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="font-medium text-slate-900">Errore Sistema</p>
                        <p className="text-sm text-slate-500">Ticket #1234</p>
                        <p className="text-xs text-red-500 font-medium">Urgente</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="font-medium text-slate-900">Problema Pagamento</p>
                        <p className="text-sm text-slate-500">Ticket #1235</p>
                        <p className="text-xs text-orange-500 font-medium">Alta</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4">🕒 Attività Recenti</h4>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }, (_, i) => ({
                      id: i + 1,
                      action: ['Ticket risolto', 'Nuovo ticket', 'Risposta inviata', 'Ticket aggiornato', 'Chat avviata'][i],
                      ticket: `#${1230 + i}`,
                      time: `${i + 1}h fa`,
                      agent: `Agente ${i + 1}`
                    })).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">{activity.action}</p>
                          <p className="text-sm text-slate-600">Ticket {activity.ticket} • {activity.agent}</p>
                        </div>
                        <span className="text-sm text-slate-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">📝 Gestione Ticket</h3>
                
                {/* Ticket Controls */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex space-x-4">
                    <select className="px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-indigo-500">
                      <option value="all">Tutti gli Stati</option>
                      <option value="open">Aperti</option>
                      <option value="pending">In Attesa</option>
                      <option value="resolved">Risolti</option>
                      <option value="closed">Chiusi</option>
                    </select>
                    <select className="px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-indigo-500">
                      <option value="all">Tutte le Priorità</option>
                      <option value="urgent">Urgente</option>
                      <option value="high">Alta</option>
                      <option value="medium">Media</option>
                      <option value="low">Bassa</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Cerca ticket..."
                      className="px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-indigo-500 placeholder:text-slate-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowNewTicket(true)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    ➕ Nuovo Ticket
                  </button>
                </div>

                {/* Tickets List */}
                <div className="bg-white border rounded-lg">
                  <div className="p-6 border-b border-slate-200">
                    <h4 className="font-medium text-slate-900">Ticket di Supporto</h4>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {Array.from({ length: 10 }, (_, i) => ({
                      id: i + 1,
                      number: `#${1230 + i}`,
                      subject: ['Problema login', 'Errore sistema', 'Richiesta funzionalità', 'Problema pagamento', 'Bug report'][i % 5],
                      customer: `Cliente ${i + 1}`,
                      priority: ['urgent', 'high', 'medium', 'low'][i % 4],
                      status: ['open', 'pending', 'resolved', 'closed'][i % 4],
                      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
                      agent: `Agente ${(i % 3) + 1}`
                    })).map((ticket) => (
                      <div key={ticket.id} className="p-6 hover:bg-slate-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="font-medium text-slate-900">{ticket.number}</p>
                              <p className="text-sm text-slate-600">{ticket.subject}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm text-slate-600">{ticket.customer}</p>
                              <p className="text-sm text-slate-600">{ticket.date.toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {ticket.priority === 'urgent' ? 'Urgente' :
                               ticket.priority === 'high' ? 'Alta' :
                               ticket.priority === 'medium' ? 'Media' : 'Bassa'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              ticket.status === 'open' ? 'bg-indigo-100 text-indigo-800' :
                              ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              'bg-slate-100 text-slate-800'
                            }`}>
                              {ticket.status === 'open' ? 'Aperto' :
                               ticket.status === 'pending' ? 'In Attesa' :
                               ticket.status === 'resolved' ? 'Risolto' : 'Chiuso'}
                            </span>
                            <button
                              onClick={() => setSelectedTicket(ticket)}
                              className="text-indigo-600 hover:text-indigo-800 text-sm"
                            >
                              👁️ Visualizza
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'knowledge' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">📚 Knowledge Base</h3>
                
                {/* Knowledge Base Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h4 className="font-semibold text-slate-900 mb-4">📚 Articoli</h4>
                    <p className="text-sm text-slate-500">+12 questo mese</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h4 className="font-semibold text-slate-900 mb-4">👁️ Visualizzazioni</h4>
                    <p className="text-sm text-slate-500">+23% vs mese scorso</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h4 className="font-semibold text-slate-900 mb-4">👍 Utili</h4>
                    <p className="text-sm text-slate-500">Tasso di utilità</p>
                  </div>
                </div>

                {/* Knowledge Base Categories */}
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4">📂 Categorie</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900"> Getting Started</p>
                          <p className="text-sm text-slate-600">15 articoli</p>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                          Visualizza
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">⚙️ Configurazione</p>
                          <p className="text-sm text-slate-600">23 articoli</p>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                          Visualizza
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900"> Troubleshooting</p>
                          <p className="text-sm text-slate-600">34 articoli</p>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                          Visualizza
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900"> Fatturazione</p>
                          <p className="text-sm text-slate-600">18 articoli</p>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                          Visualizza
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900"> Sicurezza</p>
                          <p className="text-sm text-slate-600">12 articoli</p>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                          Visualizza
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">🔗 API</p>
                          <p className="text-sm text-slate-600">28 articoli</p>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                          Visualizza
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">💬 Live Chat</h3>
                
                {/* Chat Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="font-medium text-slate-900 mb-4">💬 Chat Attive</h4>
                    <div className="text-3xl font-bold text-green-600 mb-2">8</div>
                    <p className="text-sm text-slate-600">Agenti online: 5</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-6">
                    <h4 className="font-medium text-slate-900 mb-4">⏱️ Tempo Attesa</h4>
                    <div className="text-3xl font-bold text-indigo-600 mb-2">1.2m</div>
                    <p className="text-sm text-slate-600">Tempo medio</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h4 className="font-medium text-slate-900 mb-4">😊 Soddisfazione</h4>
                    <div className="text-3xl font-bold text-purple-600 mb-2">4.9/5</div>
                    <p className="text-sm text-slate-600">Rating chat</p>
                  </div>
                </div>

                {/* Active Chats */}
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4">💬 Chat Attive</h4>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }, (_, i) => ({
                      id: i + 1,
                      customer: `Cliente ${i + 1}`,
                      agent: `Agente ${(i % 3) + 1}`,
                      status: ['waiting', 'active', 'resolved'][i % 3],
                      duration: `${Math.floor(Math.random() * 30) + 5}m`,
                      messages: Math.floor(Math.random() * 20) + 5
                    })).map((chat) => (
                      <div key={chat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">{chat.customer}</p>
                          <p className="text-sm text-slate-600">Agente: {chat.agent}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm text-slate-600">{chat.duration}</p>
                            <p className="text-sm text-slate-600">{chat.messages} messaggi</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            chat.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                            chat.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-indigo-100 text-indigo-800'
                          }`}>
                            {chat.status === 'waiting' ? 'In Attesa' :
                             chat.status === 'active' ? 'Attiva' : 'Risolta'}
                          </span>
                          <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                            💬 Entra
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900"> Analytics Supporto</h3>
                
                {/* Support Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-medium text-slate-900 mb-4"> Distribuzione Ticket</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Tecnico</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Fatturazione</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Account</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Altro</span>
                        <span className="font-medium">10%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-medium text-slate-900 mb-4"> Trend Mensili</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Gennaio</span>
                        <span className="font-medium">156 ticket</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Febbraio</span>
                        <span className="font-medium">142 ticket</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Marzo</span>
                        <span className="font-medium">167 ticket</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Aprile</span>
                        <span className="font-medium text-green-600">134 ticket</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4">⚡ Metriche Performance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600 mb-2">2.3h</div>
                      <div className="text-sm text-slate-600">Tempo Risposta</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">89%</div>
                      <div className="text-sm text-slate-600">Tasso Risoluzione</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600 mb-2">4.8/5</div>
                      <div className="text-sm text-slate-600">Soddisfazione</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">12</div>
                      <div className="text-sm text-slate-600">Ticket/Giorno</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New Ticket Modal */}
        {showNewTicket && (
          <div className="fixed inset-0 bg-slate-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-900">Nuovo Ticket</h3>
                  <button
                    onClick={() => setShowNewTicket(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Oggetto
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-indigo-500"
                      placeholder="Descrivi brevemente il problema..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Categoria
                    </label>
                    <select className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-indigo-500">
                      <option value="technical">Tecnico</option>
                      <option value="billing">Fatturazione</option>
                      <option value="account">Account</option>
                      <option value="feature">Richiesta Funzionalità</option>
                      <option value="bug">Bug Report</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Priorità
                    </label>
                    <select className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-indigo-500">
                      <option value="low">Bassa</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Descrizione
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-indigo-500"
                      placeholder="Descrivi in dettaglio il problema..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowNewTicket(false)}
                      className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
                    >
                      Annulla
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      📝 Crea Ticket
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-slate-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-900">Ticket {selectedTicket.number}</h3>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Oggetto</label>
                      <p className="text-slate-900">{selectedTicket.subject}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Cliente</label>
                      <p className="text-slate-900">{selectedTicket.customer}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Priorità</label>
                      <p className="text-slate-900">{selectedTicket.priority}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Stato</label>
                      <p className="text-slate-900">{selectedTicket.status}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
                    >
                      Chiudi
                    </button>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                      💬 Rispondi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support; 