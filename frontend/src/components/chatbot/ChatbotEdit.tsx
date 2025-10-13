import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Chatbot {
  id: string;
  name: string;
  description: string;
  model: string;
  initialPrompt: string;
  status: 'active' | 'inactive';
}

const ChatbotEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = React.useState<Chatbot>({
    id: id || '',
    name: 'Customer Support Bot',
    description: 'Handles common customer inquiries and support tickets',
    model: 'gpt-3.5-turbo',
    initialPrompt: 'You are a helpful customer support assistant.',
    status: 'active',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement chatbot update
    console.log('Updating chatbot:', formData);
    navigate('/chatbots');
  };

  const handleDelete = async () => {
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
            <h3 class="text-lg font-semibold text-gray-900">Delete Chatbot</h3>
            <p class="text-gray-600">This action cannot be undone</p>
          </div>
        </div>
        <div class="bg-red-50 rounded-lg p-3 mb-4">
          <p class="text-sm text-red-800">Are you sure you want to delete this chatbot? This action cannot be undone.</p>
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
      // TODO: Implement chatbot deletion
      console.log('Deleting chatbot:', id);
      navigate('/chatbots');
      
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
              <h3 class="text-lg font-semibold text-gray-900">Chatbot Deleted!</h3>
              <p class="text-gray-600">Removed successfully</p>
            </div>
          </div>
          <div class="bg-green-50 rounded-lg p-3 mb-4">
            <p class="text-sm text-green-800">The chatbot has been permanently deleted from your account.</p>
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

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Chatbot</h1>
            <p className="text-gray-600 mt-1">
              Modify your chatbot's settings and behavior
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm"
          >
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Chatbot
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg border border-gray-100">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-900">
                Model
              </label>
              <select
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-900">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="initialPrompt" className="block text-sm font-medium text-gray-900">
              Initial Prompt
            </label>
            <div className="mt-1">
              <textarea
                id="initialPrompt"
                value={formData.initialPrompt}
                onChange={(e) => setFormData({ ...formData, initialPrompt: e.target.value })}
                rows={5}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="mt-2 text-sm text-gray-500">
                This prompt will define your chatbot's personality and initial behavior.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-900">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/chatbots')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatbotEdit; 