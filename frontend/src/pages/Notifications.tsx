import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Loading } from '../components/ui/Loading';
import { Modal } from '../components/ui/Modal';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await apiService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Errore nel caricamento notifiche:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'email': return '📧';
      case 'sms': return '';
      case 'push': return '🔔';
      case 'in-app': return '💬';
      case 'webhook': return '🔗';
      default: return '📢';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'destructive';
      case 'draft': return 'secondary';
      default: return 'default';
    }
  };

  const handleEditNotification = (notification: any) => {
    setSelectedNotification(notification);
    setShowCreateModal(true);
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await apiService.deleteNotification(id);
      await fetchNotifications();
    } catch (error) {
      console.error('Errore nell\'eliminazione della notifica:', error);
    }
  };

  if (loading) {
    return <Loading text="Caricamento notifiche..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🔔 Gestione Notifiche</h1>
          <p className="text-gray-600 mt-2">Gestisci email, SMS, push e notifiche in-app</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📧</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.type === 'email').length}
                </p>
                <p className="text-sm text-blue-600">+15% vs mese scorso</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">SMS</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.type === 'sms').length}
                </p>
                <p className="text-sm text-green-600">+8% vs mese scorso</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🔔</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Push</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.type === 'push').length}
                </p>
                <p className="text-sm text-purple-600">+23% vs mese scorso</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">💬</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In-App</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.type === 'in-app').length}
                </p>
                <p className="text-sm text-yellow-600">+12% vs mese scorso</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tutti i Tipi</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="push">Push</option>
                <option value="in-app">In-App</option>
                <option value="webhook">Webhook</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tutti gli Stati</option>
                <option value="sent">Inviate</option>
                <option value="pending">In Attesa</option>
                <option value="failed">Fallite</option>
                <option value="draft">Bozze</option>
              </select>
            </div>

            <Button
              onClick={() => setShowCreateModal(true)}
              leftIcon="➕"
            >
              Nuova Notifica
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Notifiche Recenti</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {notifications
              .filter(notification => {
                const matchesType = filterType === 'all' || notification.type === filterType;
                const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
                return matchesType && matchesStatus;
              })
              .map((notification) => (
                <div key={notification.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                          <Badge variant={getStatusColor(notification.status)}>
                            {notification.status === 'sent' ? 'Inviata' :
                             notification.status === 'pending' ? 'In Attesa' :
                             notification.status === 'failed' ? 'Fallita' : 'Bozza'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {notification.recipients?.length || 0} destinatari
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedNotification(notification)}
                      >
                        👁️ Visualizza
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditNotification(notification)}
                      >
                        ✏️ Modifica
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteNotification(notification.id)}
                      >
                        🗑️ Elimina
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Templates Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Template Notifiche</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-xl">📧</span>
                <h4 className="font-medium text-gray-900">Welcome Email</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Email di benvenuto per nuovi utenti con guide e risorse.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">👁️ Anteprima</Button>
                <Button size="sm" variant="outline">✏️ Modifica</Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-xl">🔔</span>
                <h4 className="font-medium text-gray-900">Payment Reminder</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Promemoria per pagamenti in scadenza o falliti.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">👁️ Anteprima</Button>
                <Button size="sm" variant="outline">✏️ Modifica</Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-xl"></span>
                <h4 className="font-medium text-gray-900">Security Alert</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Avvisi di sicurezza per login sospetti o attività anomale.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">👁️ Anteprima</Button>
                <Button size="sm" variant="outline">✏️ Modifica</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4"> Analytics Notifiche</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">98.5%</div>
              <div className="text-sm text-gray-600">Tasso di Consegna</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">45.2%</div>
              <div className="text-sm text-gray-600">Tasso di Apertura</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">12.8%</div>
              <div className="text-sm text-gray-600">Tasso di Click</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">2.3s</div>
              <div className="text-sm text-gray-600">Tempo Medio Invio</div>
            </div>
          </div>
        </div>

        {/* Create/Edit Notification Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedNotification(null);
          }}
          title={selectedNotification ? 'Modifica Notifica' : 'Nuova Notifica'}
          size="lg"
        >
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo Notifica
              </label>
              <select
                defaultValue={selectedNotification?.type || 'email'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="push">Push Notification</option>
                <option value="in-app">In-App</option>
                <option value="webhook">Webhook</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titolo
              </label>
              <input
                type="text"
                defaultValue={selectedNotification?.title || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Titolo della notifica"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Messaggio
              </label>
              <textarea
                rows={4}
                defaultValue={selectedNotification?.message || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contenuto del messaggio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destinatari
              </label>
              <select
                defaultValue="all"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tutti gli utenti</option>
                <option value="active">Utenti attivi</option>
                <option value="premium">Utenti premium</option>
                <option value="custom">Selezione personalizzata</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedNotification(null);
                }}
              >
                Annulla
              </Button>
              <Button>
                {selectedNotification ? 'Aggiorna' : 'Crea'} Notifica
              </Button>
            </div>
          </form>
        </Modal>

        {/* Notification Detail Modal */}
        <Modal
          isOpen={!!selectedNotification && !showCreateModal}
          onClose={() => setSelectedNotification(null)}
          title="Dettagli Notifica"
          size="lg"
        >
          {selectedNotification && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">
                  {getNotificationIcon(selectedNotification.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedNotification.title}
                  </h3>
                  <Badge variant={getStatusColor(selectedNotification.status)}>
                    {selectedNotification.status}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Messaggio</h4>
                <p className="text-gray-600">{selectedNotification.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-medium">{selectedNotification.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Destinatari</p>
                  <p className="font-medium">{selectedNotification.recipients?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Creata</p>
                  <p className="font-medium">
                    {new Date(selectedNotification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Inviata</p>
                  <p className="font-medium">
                    {selectedNotification.sentAt ? 
                      new Date(selectedNotification.sentAt).toLocaleString() : 
                      'Non ancora inviata'
                    }
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm">
                  🔄 Reinvia
                </Button>
                <Button variant="outline" size="sm">
                   Analytics
                </Button>
                <Button variant="outline" size="sm">
                  📝 Duplica
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Notifications; 