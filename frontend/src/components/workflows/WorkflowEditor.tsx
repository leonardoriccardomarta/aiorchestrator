import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Zap, 
  MessageSquare, 
  Bot
} from 'lucide-react';

interface WorkflowAction {
  type: string;
  message?: string;
  delay?: number;
  formTitle?: string;
  formFields?: string;
  url?: string;
  productId?: string;
  discountCode?: string;
  discountMessage?: string;
  options?: string[];
  priority?: string;
  category?: string;
  [key: string]: unknown;
}

interface WorkflowCondition {
  type: string;
  value: unknown;
  operator?: string;
}

interface WorkflowData {
  id?: string;
  title: string;
  description: string;
  isActive: boolean;
  triggerType: string;
  triggerValue?: number;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  chatbotId?: string;
  executionCount: number;
  lastExecuted?: string;
  createdAt: string;
}

interface Chatbot {
  id: string;
  name: string;
  isActive: boolean;
}

interface WorkflowEditorProps {
  workflow?: WorkflowData;
  chatbots?: Chatbot[];
  onSave: (workflow: WorkflowData) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const TRIGGER_TYPES = [
  { id: 'first_visit', label: 'First Visit', description: 'Trigger when user visits for the first time' },
  { id: 'time_on_page', label: 'Time on Page', description: 'Trigger after user spends time on page' },
  { id: 'scroll_depth', label: 'Scroll Depth', description: 'Trigger when user scrolls to certain depth' },
  { id: 'exit_intent', label: 'Exit Intent', description: 'Trigger when user tries to leave the page' },
  { id: 'chat_started', label: 'Chat Started', description: 'Trigger when user starts a conversation' },
  { id: 'message_received', label: 'Message Received', description: 'Trigger when user sends a message' },
  { id: 'product_viewed', label: 'Product Viewed', description: 'Trigger when user views a product' },
  { id: 'cart_abandoned', label: 'Cart Abandoned', description: 'Trigger when user abandons their cart' },
  { id: 'purchase_completed', label: 'Purchase Completed', description: 'Trigger when user completes a purchase' },
  { id: 'support_request', label: 'Support Request', description: 'Trigger when user asks for support' }
];

const ACTION_TYPES = [
  { id: 'send_message', label: 'Send Message', description: 'Send a message to the user' },
  { id: 'ask_email', label: 'Ask for Email', description: 'Request user\'s email address' },
  { id: 'show_form', label: 'Show Form', description: 'Display a form to collect information' },
  { id: 'redirect', label: 'Redirect User', description: 'Redirect user to another page' },
  { id: 'tag_conversation', label: 'Tag Conversation', description: 'Add tags to the conversation' },
  { id: 'assign_agent', label: 'Assign to Agent', description: 'Transfer conversation to human agent' },
  { id: 'show_product', label: 'Show Product', description: 'Display product information' },
  { id: 'offer_discount', label: 'Offer Discount', description: 'Present a discount code' },
  { id: 'schedule_followup', label: 'Schedule Follow-up', description: 'Schedule a follow-up message' },
  { id: 'delay', label: 'Delay', description: 'Wait before next action' },
  { id: 'show_menu', label: 'Show Menu', description: 'Display interactive menu options' },
  { id: 'create_ticket', label: 'Create Ticket', description: 'Create a support ticket' },
  { id: 'notify_agent', label: 'Notify Agent', description: 'Send notification to agent' }
];

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({
  workflow,
  chatbots = [],
  onSave,
  onCancel,
  onDelete
}) => {
  const [formData, setFormData] = useState<WorkflowData>({
    title: '',
    description: '',
    isActive: false,
    triggerType: 'first_visit',
    chatbotId: chatbots.length > 0 ? chatbots[0].id : '',
    conditions: [],
    actions: [],
    executionCount: 0,
    createdAt: ''
  });

  useEffect(() => {
    if (workflow) {
      setFormData(workflow);
    }
  }, [workflow]);

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, { type: 'send_message', message: '' }]
    }));
  };

  const handleActionChange = (index: number, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) =>
        i === index ? { ...action, [field]: value } : action
      )
    }));
  };

  const handleRemoveAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderActionFields = (action: WorkflowAction, index: number) => {
    switch (action.type) {
      case 'send_message':
        return (
          <textarea
            value={action.message || ''}
            onChange={(e) => handleActionChange(index, 'message', e.target.value)}
            placeholder="Inserisci il messaggio da inviare..."
            className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:outline-none resize-vertical shadow-sm"
            rows={3}
          />
        );
      case 'ask_email':
        return (
          <textarea
            value={action.message || ''}
            onChange={(e) => handleActionChange(index, 'message', e.target.value)}
            placeholder="Inserisci il messaggio per richiedere l'email..."
            className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:outline-none resize-vertical shadow-sm"
            rows={2}
          />
        );
      case 'show_form':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={action.formTitle || ''}
              onChange={(e) => handleActionChange(index, 'formTitle', e.target.value)}
              placeholder="Titolo del modulo"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
            <textarea
              value={action.formFields || ''}
              onChange={(e) => handleActionChange(index, 'formFields', e.target.value)}
              placeholder="Campi del modulo (separati da virgola)"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:outline-none resize-vertical shadow-sm"
              rows={2}
            />
          </div>
        );
      case 'redirect':
        return (
          <input
            type="url"
            value={action.url || ''}
            onChange={(e) => handleActionChange(index, 'url', e.target.value)}
            placeholder="Enter URL to redirect to..."
            className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
          />
        );
      case 'show_product':
        return (
          <input
            type="text"
            value={action.productId || ''}
            onChange={(e) => handleActionChange(index, 'productId', e.target.value)}
            placeholder="Enter product ID or handle..."
            className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
          />
        );
      case 'offer_discount':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={action.discountCode || ''}
              onChange={(e) => handleActionChange(index, 'discountCode', e.target.value)}
              placeholder="Discount code"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            />
            <textarea
              value={action.discountMessage || ''}
              onChange={(e) => handleActionChange(index, 'discountMessage', e.target.value)}
              placeholder="Discount message"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none resize-vertical"
              rows={2}
            />
          </div>
        );
      case 'delay':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={action.delay || 1000}
              onChange={(e) => handleActionChange(index, 'delay', parseInt(e.target.value))}
              placeholder="Delay in milliseconds"
              className="block w-32 rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            />
            <span className="text-sm text-gray-500">milliseconds</span>
          </div>
        );
      case 'show_menu':
        return (
          <textarea
            value={action.options ? action.options.join(', ') : ''}
            onChange={(e) => handleActionChange(index, 'options', e.target.value.split(',').map(s => s.trim()))}
            placeholder="Menu options (comma separated)"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none resize-vertical"
            rows={2}
          />
        );
      case 'create_ticket':
        return (
          <div className="space-y-2">
            <select
              value={action.priority || 'medium'}
              onChange={(e) => handleActionChange(index, 'priority', e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="text"
              value={action.category || ''}
              onChange={(e) => handleActionChange(index, 'category', e.target.value)}
              placeholder="Ticket category"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        );
      case 'notify_agent':
        return (
          <textarea
            value={action.message || ''}
            onChange={(e) => handleActionChange(index, 'message', e.target.value)}
            placeholder="Notification message for agent"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none resize-vertical"
            rows={2}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Bot className="h-5 w-5 mr-2" />
            Informazioni Base
          </CardTitle>
          <CardDescription className="text-gray-700">
            Configura i dettagli base del tuo workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Titolo Workflow</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Inserisci il titolo del workflow..."
              className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Descrizione</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrivi cosa fa questo workflow..."
              className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:outline-none resize-vertical shadow-sm"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Chatbot</label>
              <select
                value={formData.chatbotId || ''}
                onChange={(e) => handleInputChange('chatbotId', e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus:outline-none shadow-sm"
              >
                <option value="" className="text-gray-600">Seleziona un chatbot</option>
                {chatbots.map(chatbot => (
                  <option key={chatbot.id} value={chatbot.id} className="text-gray-900">
                    {chatbot.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Stato</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.isActive}
                    onChange={() => handleInputChange('isActive', true)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-800">Attivo</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={!formData.isActive}
                    onChange={() => handleInputChange('isActive', false)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-800">Inattivo</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trigger Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Zap className="h-5 w-5 mr-2" />
            Configurazione Trigger
          </CardTitle>
          <CardDescription className="text-gray-700">
            Scegli quando questo workflow deve essere attivato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Tipo di Trigger</label>
            <select
              value={formData.triggerType}
              onChange={(e) => handleInputChange('triggerType', e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus:outline-none shadow-sm"
            >
              {TRIGGER_TYPES.map(trigger => (
                <option key={trigger.id} value={trigger.id} className="text-gray-900">
                  {trigger.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-600">
              {TRIGGER_TYPES.find(t => t.id === formData.triggerType)?.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <MessageSquare className="h-5 w-5 mr-2" />
            Configurazione Azioni
          </CardTitle>
          <CardDescription className="text-gray-700">
            Definisci quali azioni devono essere eseguite quando il trigger viene attivato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.actions.map((action, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Action {index + 1}</span>
                    <Badge variant="outline">{action.type}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAction(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Tipo di Azione</label>
                    <select
                      value={action.type}
                      onChange={(e) => handleActionChange(index, 'type', e.target.value)}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus:outline-none shadow-sm"
                    >
                      {ACTION_TYPES.map(actionType => (
                        <option key={actionType.id} value={actionType.id} className="text-gray-900">
                          {actionType.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-600">
                      {ACTION_TYPES.find(t => t.id === action.type)?.description}
                    </p>
                  </div>
                  
                  {renderActionFields(action, index)}
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={handleAddAction}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Action
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          {onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Elimina Workflow
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium"
          >
            <X className="h-4 w-4 mr-2" />
            Annulla
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
          >
            <Save className="h-4 w-4 mr-2" />
            Salva Workflow
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowEditor; 