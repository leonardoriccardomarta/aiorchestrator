import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Zap, 
  X,
  BookOpen
} from 'lucide-react';
import WorkflowEditor from './WorkflowEditor';
import WorkflowGuide from './WorkflowGuide';

interface Workflow {
  id: string;
  name: string;
  description: string;
  chatbotId: string;
  isActive: boolean;
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
  conditions?: WorkflowCondition[];
  createdAt: Date;
  updatedAt: Date;
  usage: {
    totalTriggers: number;
    successRate: number;
    lastTriggered?: Date;
  };
}

interface WorkflowTrigger {
  id: string;
  type: 'keyword' | 'intent' | 'time' | 'user_action' | 'channel_specific';
  value: string;
  channel?: string;
  caseSensitive?: boolean;
  exactMatch?: boolean;
}

interface WorkflowAction {
  id: string;
  type: 'send_message' | 'transfer_to_human' | 'collect_info' | 'api_call' | 'send_email' | 'update_user_data';
  config: Record<string, unknown>;
  delay?: number;
  order: number;
}

interface WorkflowCondition {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: string;
}

interface ChatbotOption {
  id: string;
  name: string;
  isActive: boolean;
}

const WorkflowManager: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [chatbots, setChatbots] = useState<ChatbotOption[]>([]);
  const [selectedChatbot, setSelectedChatbot] = useState<string>('all');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [_showGuide, _setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'workflows' | 'guide'>('workflows');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState(true);

  const loadWorkflows = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with real API
      const mockWorkflows: Workflow[] = [
        {
          id: 'wf1',
          name: 'Welcome Flow',
          description: 'Greets new users and provides basic information',
          chatbotId: 'bot1',
          isActive: true,
          triggers: [
            { id: 't1', type: 'keyword', value: 'hello' },
            { id: 't2', type: 'keyword', value: 'hi' },
            { id: 't3', type: 'intent', value: 'greeting' }
          ],
          actions: [
            {
              id: 'a1',
              type: 'send_message',
              config: { message: 'Welcome! How can I help you today?' },
              order: 1
            },
            {
              id: 'a2',
              type: 'send_message',
              config: { message: 'I can help you with: \n• Product information\n• Support tickets\n• Account questions' },
              delay: 2000,
              order: 2
            }
          ],
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20'),
          usage: {
            totalTriggers: 245,
            successRate: 94.5,
            lastTriggered: new Date('2024-01-22')
          }
        },
        {
          id: 'wf2',
          name: 'Support Escalation',
          description: 'Escalates complex issues to human agents',
          chatbotId: 'bot1',
          isActive: true,
          triggers: [
            { id: 't4', type: 'keyword', value: 'human' },
            { id: 't5', type: 'keyword', value: 'agent' },
            { id: 't6', type: 'intent', value: 'escalation' }
          ],
          actions: [
            {
              id: 'a3',
              type: 'send_message',
              config: { message: 'I understand you need to speak with a human agent. Let me connect you.' },
              order: 1
            },
            {
              id: 'a4',
              type: 'collect_info',
              config: { 
                question: 'Could you please briefly describe your issue?',
                field: 'escalation_reason'
              },
              order: 2
            },
            {
              id: 'a5',
              type: 'transfer_to_human',
              config: { department: 'support' },
              order: 3
            }
          ],
          conditions: [
            { id: 'c1', field: 'conversation_length', operator: 'greater_than', value: '3' }
          ],
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-18'),
          usage: {
            totalTriggers: 89,
            successRate: 87.6,
            lastTriggered: new Date('2024-01-21')
          }
        },
        {
          id: 'wf3',
          name: 'Product Inquiry',
          description: 'Handles product-related questions and recommendations',
          chatbotId: 'bot2',
          isActive: true,
          triggers: [
            { id: 't7', type: 'keyword', value: 'product' },
            { id: 't8', type: 'keyword', value: 'price' },
            { id: 't9', type: 'intent', value: 'product_inquiry' }
          ],
          actions: [
            {
              id: 'a6',
              type: 'send_message',
              config: { message: 'I\'d be happy to help you with product information!' },
              order: 1
            },
            {
              id: 'a7',
              type: 'api_call',
              config: { 
                endpoint: '/api/products/search',
                method: 'GET'
              },
              order: 2
            }
          ],
          createdAt: new Date('2024-01-12'),
          updatedAt: new Date('2024-01-19'),
          usage: {
            totalTriggers: 156,
            successRate: 91.2,
            lastTriggered: new Date('2024-01-22')
          }
        }
      ];

      // Filter by chatbot if selected
      const filteredWorkflows = selectedChatbot === 'all' 
        ? mockWorkflows 
        : mockWorkflows.filter((w: Workflow) => w.chatbotId === selectedChatbot);

      setWorkflows(filteredWorkflows);
    } catch (error) {
      console.error('Error loading workflows:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedChatbot]);

  const loadChatbots = useCallback(async () => {
    try {
      // Simulate API call - replace with real API
      const mockChatbots: ChatbotOption[] = [
        { id: 'bot1', name: 'Customer Support Bot', isActive: true },
        { id: 'bot2', name: 'Sales Assistant', isActive: true },
        { id: 'bot3', name: 'FAQ Helper', isActive: false }
      ];
      setChatbots(mockChatbots);
    } catch (error) {
      console.error('Error loading chatbots:', error);
    }
  }, []);

  useEffect(() => {
    loadWorkflows();
    loadChatbots();
  }, [loadWorkflows, loadChatbots]);

  const handleCreateWorkflow = () => {
    setSelectedWorkflow(null);
    setShowCreateModal(true);
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setShowCreateModal(true);
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    // Show custom confirmation modal
    const confirmModal = document.createElement('div');
    confirmModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    confirmModal.innerHTML = `
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Delete Workflow</h3>
            <p class="text-gray-600">This action cannot be undone</p>
          </div>
        </div>
        <div class="bg-red-50 rounded-lg p-3 mb-4">
          <p class="text-sm text-red-800">Are you sure you want to delete this workflow? This action cannot be undone.</p>
        </div>
        <div class="flex space-x-3">
          <button onclick="this.closest('.fixed').remove()" class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium">
            Cancel
          </button>
          <button id="confirmDelete" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
            Delete
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(confirmModal);
    
    // Add event listener for confirm button
    const confirmBtn = confirmModal.querySelector('#confirmDelete');
    confirmBtn?.addEventListener('click', () => {
      confirmModal.remove();
      setWorkflows(prev => prev.filter((w: Workflow) => w.id !== workflowId));
      
      // Show success modal
      const successModal = document.createElement('div');
      successModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
      successModal.innerHTML = `
        <div class="bg-white rounded-xl max-w-md w-full p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Workflow Deleted!</h3>
              <p class="text-gray-600">Removed successfully</p>
            </div>
          </div>
          <div class="bg-green-50 rounded-lg p-3 mb-4">
            <p class="text-sm text-green-800">The workflow has been permanently deleted from your automation system.</p>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
            Continue
          </button>
        </div>
      `;
      document.body.appendChild(successModal);
      setTimeout(() => successModal.remove(), 3000);
    });
    
    // Add event listener for cancel button
    const cancelBtn = confirmModal.querySelector('button[onclick]');
    cancelBtn?.addEventListener('click', () => {
      confirmModal.remove();
    });
  };

  const handleToggleWorkflow = async (workflowId: string, isActive: boolean) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, isActive } : w
    ));
  };

  const handleSaveWorkflow = (workflowData: Partial<Workflow>) => {
    if (selectedWorkflow) {
      // Edit existing workflow
      setWorkflows(prev => prev.map(w => 
        w.id === selectedWorkflow.id 
          ? { ...w, ...workflowData, updatedAt: new Date() }
          : w
      ));
    } else {
      // Create new workflow
      const newWorkflow: Workflow = {
        id: `wf${Date.now()}`,
        name: workflowData.name || 'New Workflow',
        description: workflowData.description || '',
        chatbotId: workflowData.chatbotId || selectedChatbot,
        isActive: true,
        triggers: workflowData.triggers || [],
        actions: workflowData.actions || [],
        conditions: workflowData.conditions || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        usage: {
          totalTriggers: 0,
          successRate: 0
        }
      };
      setWorkflows(prev => [...prev, newWorkflow]);
    }
    setShowCreateModal(false);
    setSelectedWorkflow(null);
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && workflow.isActive) ||
                         (filterStatus === 'inactive' && !workflow.isActive);
    return matchesSearch && matchesStatus;
  });

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'keyword': return '🔤';
      case 'intent': return '';
      case 'time': return '⏰';
      case 'user_action': return '👆';
      case 'channel_specific': return '';
      default: return '❓';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'send_message': return '💬';
      case 'transfer_to_human': return '👤';
      case 'collect_info': return '📝';
      case 'api_call': return '🔗';
      case 'send_email': return '📧';
      case 'update_user_data': return '';
      default: return '⚡';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 pt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading workflows...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-16">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-sans">Workflow Management</h1>
              <p className="mt-2 text-gray-700 text-base font-normal max-w-3xl">
                Crea e gestisci workflows automatici per i tuoi chatbot
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('guide')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Guida Workflows
              </button>
              <button
                onClick={handleCreateWorkflow}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crea Workflow
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('workflows')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'workflows'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>I Tuoi Workflows</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'guide'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Guida & Aiuto</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Guide Content */}
        {activeTab === 'guide' && (
          <div className="mt-6">
            <WorkflowGuide />
          </div>
        )}

        {/* Workflows Content */}
        {activeTab === 'workflows' && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Chatbot</label>
                  <select
                    value={selectedChatbot}
                    onChange={(e) => setSelectedChatbot(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="all">Tutti i Chatbots</option>
                    {chatbots.map(bot => (
                      <option key={bot.id} value={bot.id}>{bot.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Stato</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="all">Tutti gli Stati</option>
                    <option value="active">Attivo</option>
                    <option value="inactive">Inattivo</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-800 mb-1">Ricerca</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cerca workflows..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-500">Total Workflows</div>
            <div className="text-2xl font-bold text-gray-900">{workflows.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-500">Active Workflows</div>
            <div className="text-2xl font-bold text-gray-900">
              {workflows.filter(w => w.isActive).length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-500">Total Triggers</div>
            <div className="text-2xl font-bold text-gray-900">
              {workflows.reduce((sum, w) => sum + w.usage.totalTriggers, 0)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-500">Avg Success Rate</div>
            <div className="text-2xl font-bold text-gray-900">
              {workflows.length > 0 
                ? (workflows.reduce((sum, w) => sum + w.usage.successRate, 0) / workflows.length).toFixed(1)
                : 0}%
            </div>
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow) => {
            const chatbot = chatbots.find(c => c.id === workflow.chatbotId);
            
            return (
              <div key={workflow.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{workflow.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{workflow.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {chatbot?.name || 'Unknown Bot'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          workflow.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {workflow.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEditWorkflow(workflow)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        title="Edit Actions & Triggers"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleWorkflow(workflow.id, !workflow.isActive)}
                        className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          workflow.isActive 
                            ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:ring-yellow-500' 
                            : 'text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500'
                        }`}
                        title={workflow.isActive ? 'Pause' : 'Activate'}
                      >
                        {workflow.isActive ? 'Pause' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteWorkflow(workflow.id)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Triggers */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Triggers</h4>
                    <div className="flex flex-wrap gap-1">
                      {workflow.triggers.slice(0, 3).map((trigger) => (
                        <span key={trigger.id} className="inline-flex items-center space-x-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          <span>{getTriggerIcon(trigger.type)}</span>
                          <span>{trigger.value}</span>
                        </span>
                      ))}
                      {workflow.triggers.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          +{workflow.triggers.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Actions</h4>
                    <div className="flex flex-wrap gap-1">
                      {workflow.actions.slice(0, 3).map((action) => (
                        <span key={action.id} className="inline-flex items-center space-x-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          <span>{getActionIcon(action.type)}</span>
                          <span>{action.type.replace('_', ' ')}</span>
                        </span>
                      ))}
                      {workflow.actions.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          +{workflow.actions.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500">Triggers</div>
                      <div className="text-lg font-semibold text-gray-900">{workflow.usage.totalTriggers}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Success Rate</div>
                      <div className="text-lg font-semibold text-gray-900">{workflow.usage.successRate}%</div>
                    </div>
                  </div>

                  {/* Toggle */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">
                      {workflow.usage.lastTriggered 
                        ? `Last triggered ${workflow.usage.lastTriggered.toLocaleDateString()}`
                        : 'Never triggered'
                      }
                    </span>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workflow.isActive}
                        onChange={(e) => handleToggleWorkflow(workflow.id, e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        workflow.isActive ? 'bg-blue-600' : 'bg-gray-200'
                      }`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          workflow.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredWorkflows.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No workflows found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first workflow.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateWorkflow}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Workflow
              </button>
            </div>
          </div>
        )}
          </>
        )}

      </div>

      {/* Workflow Editor Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-8 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedWorkflow ? 'Edit Workflow' : 'Create New Workflow'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedWorkflow(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <WorkflowEditor
                workflow={selectedWorkflow ? {
                  id: selectedWorkflow.id,
                  title: selectedWorkflow.name,
                  description: selectedWorkflow.description,
                  isActive: selectedWorkflow.isActive,
                  triggerType: selectedWorkflow.triggers[0]?.type || 'keyword',
                  triggerValue: selectedWorkflow.triggers[0]?.value ? parseInt(selectedWorkflow.triggers[0].value) || 0 : 0,
                  conditions: selectedWorkflow.conditions?.map(c => ({
                    type: c.field,
                    value: c.value,
                    operator: c.operator
                  })) || [],
                  actions: selectedWorkflow.actions.map(a => ({
                    type: a.type,
                    message: typeof a.config.message === 'string' ? a.config.message : '',
                    delay: a.delay,
                    ...a.config
                  })),
                  chatbotId: selectedWorkflow.chatbotId,
                  executionCount: selectedWorkflow.usage.totalTriggers,
                  lastExecuted: selectedWorkflow.usage.lastTriggered?.toISOString() || '',
                  createdAt: selectedWorkflow.createdAt.toISOString()
                } : undefined}
                chatbots={chatbots}
                onSave={(workflowData) => {
                  const transformedData = {
                    name: workflowData.title,
                    description: workflowData.description,
                    chatbotId: workflowData.chatbotId,
                    isActive: workflowData.isActive,
                    triggers: [{
                      id: `t${Date.now()}`,
                      type: workflowData.triggerType as WorkflowTrigger['type'],
                      value: String(workflowData.triggerValue || workflowData.triggerType)
                    }],
                    actions: workflowData.actions.map((action, index) => ({
                      id: `a${Date.now()}_${index}`,
                      type: action.type as WorkflowAction['type'],
                      config: {
                        message: action.message,
                        ...action
                      },
                      delay: action.delay,
                      order: index + 1
                    }))
                  };
                  handleSaveWorkflow(transformedData);
                }}
                onCancel={() => {
                  setShowCreateModal(false);
                  setSelectedWorkflow(null);
                }}
                onDelete={selectedWorkflow ? () => {
                  handleDeleteWorkflow(selectedWorkflow.id);
                  setShowCreateModal(false);
                  setSelectedWorkflow(null);
                } : undefined}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowManager; 