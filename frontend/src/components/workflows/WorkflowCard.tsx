import React from 'react';

interface WorkflowAction {
  type: string;
  message?: string;
  delay?: number;
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
}

interface WorkflowCardProps {
  workflow: WorkflowData;
  onEdit: (workflow: WorkflowData) => void;
  onDelete: (workflowId: string) => void;
  onToggle: (workflowId: string, isActive: boolean) => void;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({
  workflow,
  onEdit,
  onDelete,
  onToggle
}) => {
  const getTriggerIcon = (triggerType: string) => {
    switch (triggerType) {
      case 'first_visit':
        return '👋';
      case 'time_on_page':
        return '⏱️';
      case 'scroll_depth':
        return '📜';
      case 'exit_intent':
        return '🚪';
      case 'chat_started':
        return '💬';
      case 'message_received':
        return '📨';
      case 'product_viewed':
        return '👁️';
      case 'cart_abandoned':
        return '🛒';
      case 'purchase_completed':
        return '';
      default:
        return '⚡';
    }
  };

  const getTriggerLabel = (triggerType: string) => {
    switch (triggerType) {
      case 'first_visit':
        return 'First Visit';
      case 'time_on_page':
        return 'Time on Page';
      case 'scroll_depth':
        return 'Scroll Depth';
      case 'exit_intent':
        return 'Exit Intent';
      case 'chat_started':
        return 'Chat Started';
      case 'message_received':
        return 'Message Received';
      case 'product_viewed':
        return 'Product Viewed';
      case 'cart_abandoned':
        return 'Cart Abandoned';
      case 'purchase_completed':
        return 'Purchase Completed';
      default:
        return triggerType;
    }
  };

  const getActionSummary = (actions: WorkflowAction[]) => {
    if (actions.length === 0) return 'No actions';
    
    const actionTypes = actions.map(action => {
      switch (action.type) {
        case 'send_message':
          return 'Send Message';
        case 'ask_email':
          return 'Ask for Email';
        case 'show_form':
          return 'Show Form';
        case 'redirect':
          return 'Redirect';
        case 'tag_conversation':
          return 'Tag Conversation';
        case 'assign_agent':
          return 'Assign Agent';
        case 'show_product':
          return 'Show Product';
        case 'offer_discount':
          return 'Offer Discount';
        case 'schedule_followup':
          return 'Schedule Follow-up';
        default:
          return action.type;
      }
    });
    
    return actionTypes.join(', ');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-2xl">{getTriggerIcon(workflow.triggerType)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {workflow.title}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    workflow.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {workflow.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {workflow.description || 'No description provided'}
              </p>
              <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Trigger:</span>
                  <span>{getTriggerLabel(workflow.triggerType)}</span>
                  {workflow.triggerValue && (
                    <span className="text-gray-400">
                      ({workflow.triggerValue}
                      {workflow.triggerType === 'time_on_page' ? 's' : 
                       workflow.triggerType === 'scroll_depth' ? '%' : ''})
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Actions:</span>
                  <span className="truncate max-w-32">
                    {getActionSummary(workflow.actions)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggle(workflow.id || '', !workflow.isActive)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                workflow.isActive ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  workflow.isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Created {workflow.id ? 'recently' : 'just now'}</span>
            {workflow.actions.length > 0 && (
              <span>• {workflow.actions.length} action{workflow.actions.length !== 1 ? 's' : ''}</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(workflow)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => onDelete(workflow.id || '')}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowCard; 