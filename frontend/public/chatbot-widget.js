// AI Orchestrator Chatbot Widget
(function() {
  'use strict';

  // Check if config exists
  if (!window.AIChatbotConfig) {
    console.error('AI Orchestrator: AIChatbotConfig not found');
    return;
  }
  
  const config = window.AIChatbotConfig;
  console.log('AI Orchestrator: Initializing widget with config:', config);
  
  // Create widget container
    const widget = document.createElement('div');
  widget.id = 'ai-chatbot-widget';
  widget.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
    cursor: pointer;
    z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
        font-size: 24px;
  `;
  
  widget.innerHTML = '🤖';
  
  // Hover effect
  widget.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
    this.style.boxShadow = '0 6px 25px rgba(0,0,0,0.25)';
  });
  
  widget.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
  });
  
  // Click handler
  widget.addEventListener('click', function() {
    console.log('AI Orchestrator: Widget clicked');
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'ai-chatbot-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 20px;
      max-width: 400px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      position: relative;
    `;
    
    modalContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; color: #333;">AI Assistant</h3>
        <button id="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      </div>
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 48px; margin-bottom: 10px;">🤖</div>
        <p style="color: #666; margin-bottom: 20px;">Hello! I'm your AI assistant. How can I help you today?</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <strong>Configuration:</strong><br>
          <small>Chatbot ID: ${config.chatbotId}</small><br>
          <small>Platform: ${config.platform}</small><br>
          <small>Store ID: ${config.storeId}</small>
        </div>
        <div style="display: flex; gap: 10px;">
          <button id="start-chat" style="flex: 1; padding: 10px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer;">Start Chat</button>
          <button id="close-modal-btn" style="flex: 1; padding: 10px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer;">Close</button>
        </div>
      </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal handlers
    const closeModal = () => {
      document.body.removeChild(modal);
    };
    
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal();
    });
    
    // Start chat handler
    document.getElementById('start-chat').addEventListener('click', function() {
      alert('Chat functionality will be implemented here!\n\nConfiguration:\n' + JSON.stringify(config, null, 2));
    });
  });
  
  // Add widget to page
  document.body.appendChild(widget);
  
  console.log('AI Orchestrator: Widget initialized successfully');

})();