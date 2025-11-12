import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const Workflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [runningWorkflows, setRunningWorkflows] = useState<Set<string>>(new Set());
  const [editingWorkflow, setEditingWorkflow] = useState<any>(null);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [workflowProgress, setWorkflowProgress] = useState<{[key: string]: number}>({});
  const [showSuccessAnimation, setShowSuccessAnimation] = useState<string | null>(null);
  const [workflowLogs, setWorkflowLogs] = useState<Record<string, any[]>>({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: 'Webhook',
    status: 'active'
  });

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const response = await apiService.getWorkflows();
      // Extract data from mock API response
      setWorkflows(response.data || []);
    } catch (error) {
      console.error('Error loading workflows:', error);
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkflow = () => {
    setEditingWorkflow(null);
    setFormData({
      name: '',
      description: '',
      trigger: 'Webhook',
      status: 'active'
    });
    setShowCreateModal(true);
  };

  const handleSaveWorkflow = () => {
    if (editingWorkflow) {
      // Update existing workflow
      setWorkflows(prev => prev.map(w => 
        w.id === editingWorkflow.id 
          ? { 
              ...w, 
              name: formData.name,
              description: formData.description,
              trigger: formData.trigger,
              status: formData.status
            }
          : w
      ));
    } else {
      // Create new workflow
      const newWorkflow = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        trigger: formData.trigger,
        status: formData.status,
        createdAt: new Date().toISOString(),
        lastRun: null,
        executions: 0,
        totalRuns: 0,
        avgExecutionTime: 0
      };
      setWorkflows(prev => [...prev, newWorkflow]);
    }
    
    setShowCreateModal(false);
    setEditingWorkflow(null);
  };

  const handleEditWorkflow = (workflow: any) => {
    setEditingWorkflow(workflow);
    setFormData({
      name: workflow.name || '',
      description: workflow.description || '',
      trigger: workflow.trigger || 'Webhook',
      status: workflow.status || 'active'
    });
    setShowCreateModal(true);
  };

  const handleRunWorkflow = async (workflow: any) => {
    if (runningWorkflows.has(workflow.id)) {
      // Stop the workflow
      setRunningWorkflows(prev => {
        const newSet = new Set(prev);
        newSet.delete(workflow.id);
        return newSet;
      });
      setWorkflowProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[workflow.id];
        return newProgress;
      });
      return;
    }

    setRunningWorkflows(prev => new Set(prev).add(workflow.id));
    setWorkflowProgress(prev => ({ ...(prev || {}), [workflow.id]: 0 }));
    
    // Simulate realistic workflow execution with progress
    const steps = [
      { progress: 20, message: "Initializing workflow..." },
      { progress: 40, message: "Processing data..." },
      { progress: 60, message: "Executing automation..." },
      { progress: 80, message: "Finalizing results..." },
      { progress: 100, message: "Workflow completed!" }
    ];
    
    let currentStep = 0;
    const progressInterval = setInterval(() => {
      // Check if workflow is still running
      if (!runningWorkflows.has(workflow.id)) {
        clearInterval(progressInterval);
        return;
      }

      if (currentStep < steps.length) {
        setWorkflowProgress(prev => ({ ...(prev || {}), [workflow.id]: steps[currentStep].progress }));
        currentStep++;
      } else {
        clearInterval(progressInterval);
        
        // Complete the workflow
        setRunningWorkflows(prev => {
          const newSet = new Set(prev);
          newSet.delete(workflow.id);
          return newSet;
        });
        
        // Update workflow status with success animation
        setWorkflows(prev => prev.map(w => 
          w.id === workflow.id 
            ? { 
                ...w, 
                status: 'completed', 
                lastRun: new Date().toISOString(),
                executions: (w.executions || 0) + 1,
                totalRuns: (w.totalRuns || 0) + 1
              }
            : w
        ));
        
        // Show success animation
        setShowSuccessAnimation(workflow.id);
        setTimeout(() => setShowSuccessAnimation(null), 2000);
        
        // Clear progress
        setWorkflowProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[workflow.id];
          return newProgress;
        });
      }
    }, 600);
  };

  const handleViewLogs = (workflow: any) => {
    setSelectedWorkflow(workflow);
    
    // Generate unique logs for this workflow if not exists
    if (!workflowLogs[workflow.id]) {
      const logs = [
        {
          id: 1,
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          status: 'success',
          message: ` ${workflow.name} completed successfully`,
          details: `Processed ${Math.floor(Math.random() * 20) + 10} items in ${(Math.random() * 3 + 1).toFixed(1)} seconds`,
          duration: Math.floor(Math.random() * 5) + 1
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          status: 'success',
          message: ` ${workflow.name} executed successfully`,
          details: `Handled ${Math.floor(Math.random() * 15) + 5} requests in ${(Math.random() * 2 + 0.5).toFixed(1)} seconds`,
          duration: Math.floor(Math.random() * 3) + 1
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          status: 'warning',
          message: ` ${workflow.name} completed with warnings`,
          details: `Processed ${Math.floor(Math.random() * 25) + 15} items, ${Math.floor(Math.random() * 3)} warnings`,
          duration: Math.floor(Math.random() * 4) + 2
        }
      ];
      setWorkflowLogs(prev => ({ ...prev, [workflow.id]: logs }));
    }
    
    setShowLogsModal(true);
  };

  const handleDeleteWorkflow = (workflow: any) => {
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
            <h3 class="text-lg font-semibold text-slate-900">Delete Workflow</h3>
            <p class="text-slate-600">This action cannot be undone</p>
          </div>
        </div>
        <div class="bg-red-50 rounded-lg p-3 mb-4">
          <p class="text-sm text-red-800">Are you sure you want to delete this workflow? This action cannot be undone.</p>
        </div>
        <div class="flex space-x-3">
          <button onclick="this.closest('.fixed').remove()" class="flex-1 px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 font-medium">
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
      // Proceed with deletion
      proceedWithWorkflowDeletion(workflow);
    });
    
    // Add event listener for cancel button
    const cancelBtn = confirmModal.querySelector('button[onclick]');
    cancelBtn?.addEventListener('click', () => {
      confirmModal.remove();
    });
  };

  const proceedWithWorkflowDeletion = (workflow: any) => {
    // Delete from local state immediately
    setWorkflows(prev => prev.filter(w => w.id !== workflow.id));
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-900">Workflow Deleted!</h3>
            <p class="text-slate-600">Removed successfully</p>
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
    document.body.appendChild(modal);
    setTimeout(() => modal.remove(), 3000);
  };

  const handleToggleWorkflowStatus = (workflow: any) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflow.id 
        ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
        : w
    ));
  };

  const handleUseTemplate = (templateName: string) => {
    // Show loading animation
    const tempId = 'temp-' + Date.now();
    setRunningWorkflows(prev => new Set(prev).add(tempId));
    
    // Simulate template creation process
    setTimeout(() => {
      const newWorkflow = {
        id: Date.now().toString(),
        name: `${templateName} Workflow`,
        description: `Automated ${templateName.toLowerCase()} workflow with intelligent automation`,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastRun: null,
        executions: 0,
        totalRuns: 0,
        avgExecutionTime: Math.floor(Math.random() * 5) + 1
      };
      
      setWorkflows(prev => [...prev, newWorkflow]);
      setRunningWorkflows(prev => {
        const newSet = new Set(prev);
        newSet.delete(tempId);
        return newSet;
      });
      
      // Show success animation
      setShowSuccessAnimation(newWorkflow.id);
      setTimeout(() => setShowSuccessAnimation(null), 2000);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading workflows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">⚡ AI Workflow Automation</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Build intelligent workflows that make AI-driven decisions - more powerful than traditional automation tools
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium">
              🧠 AI Decisions
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
              🔄 Smart Automation
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
               Business Intelligence
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-indigo-200">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <span className="text-xl sm:text-2xl">⚡</span>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Total Workflows</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{workflows.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-green-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-xl sm:text-2xl"></span>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Active</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">
                  {workflows.filter(w => w.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-yellow-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-xl sm:text-2xl">🔄</span>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Today's Executions</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">1,247</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-purple-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-xl sm:text-2xl">⏱️</span>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Average Time</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">2.3s</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <button
              onClick={handleCreateWorkflow}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-indigo-800 flex items-center transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
            >
              <span className="mr-2">➕</span>
              <span className="text-sm sm:text-base">Create New Workflow</span>
            </button>
            <button
              onClick={() => {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
                modal.innerHTML = `
                  <div class="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
                    <div class="text-center mb-6">
                      <h2 class="text-2xl font-bold text-slate-900 mb-4">⚡ AI Workflow Tutorial</h2>
                      <p class="text-slate-600">Learn how to build intelligent workflows that make AI-driven decisions</p>
                    </div>
                    
                    <div class="space-y-6 mb-8">
                      <div class="flex items-start space-x-4">
                        <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span class="text-2xl">🧠</span>
                        </div>
                        <div>
                          <h3 class="text-lg font-semibold text-slate-900 mb-2">Step 1: Define Triggers</h3>
                          <p class="text-slate-600 text-sm">Set up smart triggers that understand context, not just simple data moves.</p>
                        </div>
                      </div>
                      
                      <div class="flex items-start space-x-4">
                        <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span class="text-2xl">⚡</span>
                        </div>
                        <div>
                          <h3 class="text-lg font-semibold text-slate-900 mb-2">Step 2: AI Decision Making</h3>
                          <p class="text-slate-600 text-sm">Let AI analyze data and make intelligent decisions, not just move information.</p>
                        </div>
                      </div>
                      
                      <div class="flex items-start space-x-4">
                        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span class="text-2xl"></span>
                        </div>
                        <div>
                          <h3 class="text-lg font-semibold text-slate-900 mb-2">Step 3: Smart Actions</h3>
                          <p class="text-slate-600 text-sm">Execute intelligent actions based on AI analysis and business logic.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex space-x-4">
                      <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
                        Start Building
                      </button>
                      <button onclick="this.closest('.fixed').remove()" class="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium">
                        Close
                      </button>
                    </div>
                  </div>
                `;
                document.body.appendChild(modal);
              }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 flex items-center transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
            >
              <span className="mr-2"></span>
              <span className="text-sm sm:text-base">Take a Tour</span>
            </button>
            
            <button 
              onClick={() => {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
                modal.innerHTML = `
                  <div class="bg-white rounded-xl max-w-md w-full p-6">
                    <div class="flex items-center space-x-3 mb-4">
                      <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-slate-900">Performance Dashboard</h3>
                        <p class="text-slate-600">Workflow performance metrics</p>
                      </div>
                    </div>
                    <div class="space-y-3 mb-6">
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">Execution statistics</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">Success rates</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">Performance trends</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">Resource usage</span>
                      </div>
                    </div>
                    <div class="bg-green-50 rounded-lg p-3 mb-4">
                      <p class="text-sm text-green-800">This is a demo - in production you would see detailed event information.</p>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                      Continue
                    </button>
                  </div>
                `;
                document.body.appendChild(modal);
                setTimeout(() => modal.remove(), 5000);
              }} 
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
            >
              <span className="text-sm sm:text-base"> Performance</span>
            </button>
            <button 
              onClick={() => {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
                modal.innerHTML = `
                  <div class="bg-white rounded-xl max-w-md w-full p-6">
                    <div class="flex items-center space-x-3 mb-4">
                      <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-slate-900">Template Gallery</h3>
                        <p class="text-slate-600">Pre-built workflow templates</p>
                      </div>
                    </div>
                    <div class="space-y-3 mb-6">
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">E-commerce workflows</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">Customer support flows</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">Marketing automation</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">Data processing</span>
                      </div>
                    </div>
                    <div class="bg-indigo-50 rounded-lg p-3 mb-4">
                      <p class="text-sm text-indigo-800">This is a demo - in production you would see detailed event information.</p>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                      Continue
                    </button>
                  </div>
                `;
                document.body.appendChild(modal);
                setTimeout(() => modal.remove(), 5000);
              }} 
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
            >
               Template
            </button>
          </div>
        </div>

        {/* Workflows List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Your Workflows</h2>
          </div>
          
          <div className="divide-y divide-slate-200">
            {workflows.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No workflows created</h3>
                <p className="text-slate-600 mb-4">Create your first workflow to automate processes</p>
                <button
                  onClick={handleCreateWorkflow}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Create First Workflow
                </button>
              </div>
            ) : (
              workflows.map((workflow) => (
                <div key={workflow.id} className="p-6 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-500 hover:shadow-lg hover:scale-[1.02] border border-transparent hover:border-indigo-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">⚡</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-slate-900">{workflow.name}</h3>
                        <p className="text-slate-600">{workflow.description}</p>
                        <p className="text-sm text-indigo-600 font-medium">Trigger: {workflow.trigger || 'Webhook'}</p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 rounded-full text-xs transition-all duration-300 ${
                              runningWorkflows.has(workflow.id) 
                                ? 'bg-indigo-100 text-indigo-800 animate-pulse' 
                                : workflow.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : workflow.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : workflow.status === 'paused'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}>
                              {runningWorkflows.has(workflow.id) ? 'Running...' : 
                               workflow.status === 'paused' ? 'Paused' :
                               workflow.status === 'draft' ? 'Draft' :
                               workflow.status === 'completed' ? 'Completed' :
                               workflow.status || 'Active'}
                            </span>
                            <span className="text-sm text-slate-500">
                              🔄 {workflow.totalRuns || workflow.executions || 0} executions
                            </span>
                            <span className="text-sm text-slate-500">
                              ⏱️ {workflow.avgExecutionTime || 0}s
                            </span>
                            {workflow.lastRun && (
                              <span className="text-sm text-slate-500">
                                🕒 Last: {new Date(workflow.lastRun).toLocaleString()}
                              </span>
                            )}
                          </div>
                          
                          {/* Progress Bar */}
                          {runningWorkflows.has(workflow.id) && (
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${workflowProgress[workflow.id] || 0}%` }}
                              ></div>
                            </div>
                          )}
                          
                          {/* Success Animation */}
                          {showSuccessAnimation === workflow.id && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center animate-bounce">
                              <span className="text-sm"></span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleEditWorkflow(workflow)} className="text-indigo-600 hover:text-indigo-800">✏️ Edit</button>
                      <button 
                        onClick={() => handleRunWorkflow(workflow)} 
                        className={`${runningWorkflows.has(workflow.id) 
                          ? 'text-red-600 hover:text-red-800' 
                          : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {runningWorkflows.has(workflow.id) ? '⏹️ Stop' : '▶️ Run'}
                      </button>
                      <button 
                        onClick={() => handleToggleWorkflowStatus(workflow)} 
                        className={`${workflow.status === 'active' 
                          ? 'text-orange-600 hover:text-orange-800' 
                          : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {workflow.status === 'active' ? '⏸️ Pause' : '▶️ Resume'}
                      </button>
                      <button onClick={() => handleViewLogs(workflow)} className="text-purple-600 hover:text-purple-800"> Logs</button>
                      <button onClick={() => handleDeleteWorkflow(workflow)} className="text-red-600 hover:text-red-800">🗑️ Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Workflow Templates */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Pre-built Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer Support Workflow */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer group border border-transparent hover:border-indigo-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <h3 className="text-lg font-medium text-slate-900">Customer Support</h3>
              </div>
              <p className="text-slate-600 mb-4">Customer support automation with intelligent escalation</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  Automatic problem recognition
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  Priority-based escalation
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  Automatic notifications
                </div>
              </div>
              <button 
                onClick={() => handleUseTemplate('Customer Support')} 
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-2 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-500 hover:scale-105 group-hover:shadow-xl hover:-translate-y-1"
              >
                ✨ Use Template
              </button>
            </div>

            {/* Lead Qualification Workflow */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer group border border-transparent hover:border-indigo-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg"></span>
                </div>
                <h3 className="text-lg font-medium text-slate-900">Lead Qualification</h3>
              </div>
              <p className="text-slate-600 mb-4">Automatic lead qualification with scoring</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Automatic lead scoring
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Sales rep assignment
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Automatic follow-up
                </div>
              </div>
              <button 
                onClick={() => handleUseTemplate('Lead Qualification')} 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-500 hover:scale-105 group-hover:shadow-xl hover:-translate-y-1"
              >
                ✨ Use Template
              </button>
            </div>

            {/* Order Processing Workflow */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer group border border-transparent hover:border-indigo-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">📦</span>
                </div>
                <h3 className="text-lg font-medium text-slate-900">Order Processing</h3>
              </div>
              <p className="text-slate-600 mb-4">Complete order lifecycle management</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Automatic validation
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Payment processing
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Shipping tracking
                </div>
              </div>
              <button 
                onClick={() => handleUseTemplate('Order Processing')} 
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-500 hover:scale-105 group-hover:shadow-xl hover:-translate-y-1"
              >
                ✨ Use Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingWorkflow ? 'Edit Workflow' : 'Create New Workflow'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingWorkflow(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Workflow Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter workflow name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Describe your workflow"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Trigger
                </label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.trigger}
                  onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value }))}
                >
                  <option value="Webhook">Webhook</option>
                  <option value="Schedule">Schedule</option>
                  <option value="Manual">Manual</option>
                  <option value="Event-based">Event-based</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingWorkflow(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveWorkflow}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {editingWorkflow ? 'Update Workflow' : 'Create Workflow'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {showLogsModal && selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Logs for {selectedWorkflow.name}
              </h3>
              <button
                onClick={() => {
                  setShowLogsModal(false);
                  setSelectedWorkflow(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {workflowLogs[selectedWorkflow.id]?.map((log, index) => (
                <div key={log.id} className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Execution #{log.id}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className={`text-sm mt-1 ${
                    log.status === 'success' ? 'text-green-600' : 
                    log.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {log.message}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">{log.details}</div>
                  <div className="text-xs text-slate-500 mt-1">Duration: {log.duration}s</div>
                </div>
              )) || (
                <div className="text-center text-slate-500 py-8">
                  No logs available for this workflow yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Workflows; 
