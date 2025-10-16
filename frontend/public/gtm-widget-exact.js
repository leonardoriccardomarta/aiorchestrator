// AI Orchestrator GTM Widget - EXACT copy of chatbot-widget.js
(function() {
  'use strict';
  
  console.log('AI Orchestrator: Loading GTM widget...');
  
  // Configuration from GTM dataLayer
  const config = window.AIOrchestratorConfig || {
    chatbotId: 'default',
    apiKey: 'demo-key',
    theme: 'teal',
    title: 'My AI',
    welcomeMessage: 'Hello! I\'m your ai',
    placeholder: 'Type your id',
    showAvatar: true,
    primaryLanguage: 'en'
  };
  
  console.log('AI Orchestrator: GTM Config:', config);
  
  // Theme colors - EXACT copy from chatbot-widget.js
  const getThemeColors = (themeName) => {
    const themeMap = {
      'teal': {
        primary: 'rgb(13 148 136)',
        primaryDark: 'rgb(15 118 110)',
        secondary: 'rgb(153 246 228)',
        secondaryLight: 'rgb(94 234 212)',
        text: 'rgb(19 78 74)',
        textLight: 'rgb(75 85 99)',
        border: 'rgb(153 246 228)'
      },
      'blue': {
        primary: 'rgb(37 99 235)',
        primaryDark: 'rgb(29 78 216)',
        secondary: 'rgb(191 219 254)',
        secondaryLight: 'rgb(147 197 253)',
        text: 'rgb(30 64 175)',
        textLight: 'rgb(75 85 99)',
        border: 'rgb(191 219 254)'
      }
    };
    return themeMap[themeName] || themeMap['teal'];
  };
  
  const themeColors = getThemeColors(config.theme);
  
  // Remove any existing widgets
  const existingWidgets = document.querySelectorAll('[id*="ai-orchestrator"]');
  existingWidgets.forEach(widget => widget.remove());
  
  // Create iframe container
  const iframeContainer = document.createElement('div');
  iframeContainer.id = 'ai-orchestrator-gtm-widget';
  iframeContainer.style.cssText = `
    position: fixed !important;
    bottom: 0 !important;
    right: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    pointer-events: none !important;
    z-index: 999999999 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  `;
  
  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'ai-orchestrator-iframe';
  iframe.style.cssText = `
    position: fixed !important;
    bottom: 0 !important;
    right: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    border: none !important;
    background: transparent !important;
    pointer-events: none !important;
    z-index: 999999999 !important;
    margin: 0 !important;
    padding: 0 !important;
    outline: none !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  `;
  
  // Create widget HTML - EXACT copy from chatbot-widget.js
  const widgetHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Chatbot Widget</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: transparent;
                overflow: hidden;
            }
        </style>
    </head>
    <body>
        <div id="ai-orchestrator-widget-${config.chatbotId}" style="
          position: fixed !important;
          bottom: 1.5rem !important;
          right: 1.5rem !important;
          z-index: 999999999 !important;
          width: auto !important;
          height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          background: none !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        ">
          <!-- Toggle Button -->
          <button id="ai-orchestrator-toggle-${config.chatbotId}" style="
            position: fixed !important;
            bottom: 1.5rem !important;
            right: 1.5rem !important;
            width: 4rem !important;
            height: 4rem !important;
            border-radius: 50% !important;
            background: linear-gradient(135deg, ${themeColors.primary}, ${themeColors.primaryDark}) !important;
            border: none !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            margin: 0 !important;
            padding: 0 !important;
            outline: none !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            font-size: 1rem !important;
            font-weight: normal !important;
            line-height: 1 !important;
            color: white !important;
            text-decoration: none !important;
            text-align: center !important;
            vertical-align: middle !important;
            white-space: nowrap !important;
            overflow: visible !important;
            box-sizing: border-box !important;
            transform: none !important;
            transition: transform 0.2s ease !important;
            animation: none !important;
            opacity: 1 !important;
            visibility: visible !important;
            z-index: 999999999 !important;
          ">
            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="
              width: 1.75rem !important;
              height: 1.75rem !important;
              margin: 0 !important;
              padding: 0 !important;
              border: none !important;
              outline: none !important;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
              font-size: 1rem !important;
              font-weight: normal !important;
              line-height: 1 !important;
              color: white !important;
              text-decoration: none !important;
              text-align: center !important;
              vertical-align: middle !important;
              white-space: nowrap !important;
              overflow: visible !important;
              position: relative !important;
              z-index: 1 !important;
              min-width: 1.75rem !important;
              min-height: 1.75rem !important;
              max-width: 1.75rem !important;
              max-height: 1.75rem !important;
              box-sizing: border-box !important;
              box-shadow: none !important;
              transform: none !important;
              transition: none !important;
              animation: none !important;
              opacity: 1 !important;
              visibility: visible !important;
            ">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <div style="
              position: absolute !important;
              top: -4px !important;
              right: -4px !important;
              width: 12px !important;
              height: 12px !important;
              background: rgb(34 197 94) !important;
              border-radius: 50% !important;
              border: 2px solid white !important;
              margin: 0 !important;
              padding: 0 !important;
              outline: none !important;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
              font-size: 1rem !important;
              font-weight: normal !important;
              line-height: 1 !important;
              color: transparent !important;
              text-decoration: none !important;
              text-align: center !important;
              vertical-align: middle !important;
              white-space: nowrap !important;
              overflow: visible !important;
              box-sizing: border-box !important;
              box-shadow: none !important;
              transform: none !important;
              transition: none !important;
              animation: none !important;
              opacity: 1 !important;
              visibility: visible !important;
            "></div>
          </button>

          <!-- Chat Widget -->
          <div id="ai-orchestrator-chat-${config.chatbotId}" style="
            position: fixed !important;
            bottom: 6rem !important;
            right: 1.5rem !important;
            z-index: 999999998 !important;
            display: none !important;
            visibility: visible !important;
            width: 24rem !important;
            height: 32rem !important;
            background: white !important;
            border-radius: 1rem !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
            border: 1px solid rgb(229 231 235) !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            outline: none !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            font-size: 1rem !important;
            font-weight: normal !important;
            line-height: 1.5 !important;
            color: rgb(17 24 39) !important;
            text-decoration: none !important;
            text-align: left !important;
            vertical-align: baseline !important;
            white-space: normal !important;
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
            animation: none !important;
            box-sizing: border-box !important;
          ">
            <!-- Header -->
            <div class="header" style="
              background: linear-gradient(135deg, ${themeColors.secondary}, ${themeColors.secondaryLight}) !important;
              border-bottom: 2px solid ${themeColors.border} !important;
              padding: 1rem !important;
              display: flex !important;
              align-items: center !important;
              justify-content: space-between !important;
              margin: 0 !important;
              border: none !important;
              outline: none !important;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
              font-size: 1rem !important;
              font-weight: normal !important;
              line-height: 1.5 !important;
              color: ${themeColors.text} !important;
              text-decoration: none !important;
              text-align: left !important;
              vertical-align: baseline !important;
              white-space: normal !important;
              overflow: visible !important;
              position: relative !important;
              z-index: 1 !important;
              width: 100% !important;
              height: auto !important;
              min-height: auto !important;
              max-height: none !important;
              box-sizing: border-box !important;
            ">
              <div class="header-left" style="
                display: flex !important;
                align-items: center !important;
                gap: 0.75rem !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                outline: none !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                font-size: 1rem !important;
                font-weight: normal !important;
                line-height: 1.5 !important;
                color: ${themeColors.text} !important;
                text-decoration: none !important;
                text-align: left !important;
                vertical-align: baseline !important;
                white-space: normal !important;
                overflow: visible !important;
                position: relative !important;
                z-index: 1 !important;
                width: auto !important;
                height: auto !important;
                min-height: auto !important;
                max-height: none !important;
                box-sizing: border-box !important;
                background: none !important;
                box-shadow: none !important;
                transform: none !important;
                transition: none !important;
                animation: none !important;
                opacity: 1 !important;
                visibility: visible !important;
              ">
                ${config.showAvatar ? `
                  <div class="avatar" style="
                    width: 2.5rem !important;
                    height: 2.5rem !important;
                    background: linear-gradient(135deg, ${themeColors.primary}, ${themeColors.primaryDark}) !important;
                    border-radius: 0.5rem !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    border: none !important;
                    outline: none !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                    font-size: 1rem !important;
                    font-weight: normal !important;
                    line-height: 1 !important;
                    color: white !important;
                    text-decoration: none !important;
                    text-align: center !important;
                    vertical-align: middle !important;
                    white-space: nowrap !important;
                    overflow: visible !important;
                    position: relative !important;
                    z-index: 1 !important;
                    min-width: 2.5rem !important;
                    min-height: 2.5rem !important;
                    max-width: 2.5rem !important;
                    max-height: 2.5rem !important;
                    box-sizing: border-box !important;
                    box-shadow: none !important;
                    transform: none !important;
                    transition: none !important;
                    animation: none !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                  ">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="
                      width: 1.25rem !important;
                      height: 1.25rem !important;
                      margin: 0 !important;
                      padding: 0 !important;
                      border: none !important;
                      outline: none !important;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                      font-size: 1rem !important;
                      font-weight: normal !important;
                      line-height: 1 !important;
                      color: white !important;
                      text-decoration: none !important;
                      text-align: center !important;
                      vertical-align: middle !important;
                      white-space: nowrap !important;
                      overflow: visible !important;
                      position: relative !important;
                      z-index: 1 !important;
                      min-width: 1.25rem !important;
                      min-height: 1.25rem !important;
                      max-width: 1.25rem !important;
                      max-height: 1.25rem !important;
                      box-sizing: border-box !important;
                      box-shadow: none !important;
                      transform: none !important;
                      transition: none !important;
                      animation: none !important;
                      opacity: 1 !important;
                      visibility: visible !important;
                    ">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                ` : ''}
                <div style="
                  display: flex !important;
                  flex-direction: column !important;
                  gap: 0.25rem !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  border: none !important;
                  outline: none !important;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                  font-size: 1rem !important;
                  font-weight: normal !important;
                  line-height: 1.5 !important;
                  color: ${themeColors.text} !important;
                  text-decoration: none !important;
                  text-align: left !important;
                  vertical-align: baseline !important;
                  white-space: normal !important;
                  overflow: visible !important;
                  position: relative !important;
                  z-index: 1 !important;
                  width: auto !important;
                  height: auto !important;
                  min-height: auto !important;
                  max-height: none !important;
                  box-sizing: border-box !important;
                  background: none !important;
                  box-shadow: none !important;
                  transform: none !important;
                  transition: none !important;
                  animation: none !important;
                  opacity: 1 !important;
                  visibility: visible !important;
                ">
                  <div class="title" style="
                    font-weight: 700 !important;
                    color: ${themeColors.text} !important;
                    font-size: 1rem !important;
                    line-height: 1.25rem !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    border: none !important;
                    outline: none !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                    text-decoration: none !important;
                    text-align: left !important;
                    vertical-align: baseline !important;
                    white-space: normal !important;
                    overflow: visible !important;
                    position: relative !important;
                    z-index: 1 !important;
                    width: auto !important;
                    height: auto !important;
                    min-height: auto !important;
                    max-height: none !important;
                    box-sizing: border-box !important;
                    background: none !important;
                    box-shadow: none !important;
                    transform: none !important;
                    transition: none !important;
                    animation: none !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                  ">${config.title}</div>
                  <div class="status" style="
                    font-size: 0.75rem !important;
                    color: ${themeColors.textLight} !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 0.25rem !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    border: none !important;
                    outline: none !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                    font-weight: normal !important;
                    line-height: 1 !important;
                    text-decoration: none !important;
                    text-align: left !important;
                    vertical-align: baseline !important;
                    white-space: normal !important;
                    overflow: visible !important;
                    position: relative !important;
                    z-index: 1 !important;
                    width: auto !important;
                    height: auto !important;
                    min-height: auto !important;
                    max-height: none !important;
                    box-sizing: border-box !important;
                    background: none !important;
                    box-shadow: none !important;
                    transform: none !important;
                    transition: none !important;
                    animation: none !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                  ">
                    <div style="
                      width: 0.5rem !important;
                      height: 0.5rem !important;
                      background: rgb(34 197 94) !important;
                      border-radius: 50% !important;
                      margin: 0 !important;
                      padding: 0 !important;
                      border: none !important;
                      outline: none !important;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                      font-size: 1rem !important;
                      font-weight: normal !important;
                      line-height: 1 !important;
                      color: transparent !important;
                      text-decoration: none !important;
                      text-align: center !important;
                      vertical-align: middle !important;
                      white-space: nowrap !important;
                      overflow: visible !important;
                      position: relative !important;
                      z-index: 1 !important;
                      min-width: 0.5rem !important;
                      min-height: 0.5rem !important;
                      max-width: 0.5rem !important;
                      max-height: 0.5rem !important;
                      box-sizing: border-box !important;
                      box-shadow: none !important;
                      transform: none !important;
                      transition: none !important;
                      animation: none !important;
                      opacity: 1 !important;
                      visibility: visible !important;
                    "></div>
                    Online 24/7
                    <span style="
                      background: rgb(229 231 235) !important;
                      color: ${themeColors.textLight} !important;
                      padding: 0.125rem 0.375rem !important;
                      border-radius: 0.25rem !important;
                      font-size: 0.625rem !important;
                      font-weight: 500 !important;
                      margin-left: 0.5rem !important;
                      margin: 0 !important;
                      padding: 0.125rem 0.375rem !important;
                      border: none !important;
                      outline: none !important;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                      line-height: 1 !important;
                      text-decoration: none !important;
                      text-align: center !important;
                      vertical-align: baseline !important;
                      white-space: nowrap !important;
                      overflow: visible !important;
                      position: relative !important;
                      z-index: 1 !important;
                      width: auto !important;
                      height: auto !important;
                      min-height: auto !important;
                      max-height: none !important;
                      box-sizing: border-box !important;
                      box-shadow: none !important;
                      transform: none !important;
                      transition: none !important;
                      animation: none !important;
                      opacity: 1 !important;
                      visibility: visible !important;
                    ">EN</span>
                  </div>
                </div>
              </div>
              <div class="header-right" style="
                display: flex !important;
                align-items: center !important;
                gap: 0.5rem !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                outline: none !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                font-size: 1rem !important;
                font-weight: normal !important;
                line-height: 1.5 !important;
                color: ${themeColors.text} !important;
                text-decoration: none !important;
                text-align: left !important;
                vertical-align: baseline !important;
                white-space: normal !important;
                overflow: visible !important;
                position: relative !important;
                z-index: 1 !important;
                width: auto !important;
                height: auto !important;
                min-height: auto !important;
                max-height: none !important;
                box-sizing: border-box !important;
                background: none !important;
                box-shadow: none !important;
                transform: none !important;
                transition: none !important;
                animation: none !important;
                opacity: 1 !important;
                visibility: visible !important;
              ">
                <button class="header-button" id="minimizeButton" style="
                  color: ${themeColors.textLight} !important;
                  background: none !important;
                  border: none !important;
                  padding: 0.5rem !important;
                  border-radius: 0.5rem !important;
                  cursor: pointer !important;
                  transition: background-color 0.2s ease !important;
                  margin: 0 !important;
                  outline: none !important;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                  font-size: 1rem !important;
                  font-weight: normal !important;
                  line-height: 1 !important;
                  text-decoration: none !important;
                  text-align: center !important;
                  vertical-align: middle !important;
                  white-space: nowrap !important;
                  overflow: visible !important;
                  position: relative !important;
                  z-index: 1 !important;
                  width: auto !important;
                  height: auto !important;
                  min-height: auto !important;
                  max-height: none !important;
                  box-sizing: border-box !important;
                  box-shadow: none !important;
                  transform: none !important;
                  animation: none !important;
                  opacity: 1 !important;
                  visibility: visible !important;
                ">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="
                    width: 1rem !important;
                    height: 1rem !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    border: none !important;
                    outline: none !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                    font-size: 1rem !important;
                    font-weight: normal !important;
                    line-height: 1 !important;
                    color: inherit !important;
                    text-decoration: none !important;
                    text-align: center !important;
                    vertical-align: middle !important;
                    white-space: nowrap !important;
                    overflow: visible !important;
                    position: relative !important;
                    z-index: 1 !important;
                    min-width: 1rem !important;
                    min-height: 1rem !important;
                    max-width: 1rem !important;
                    max-height: 1rem !important;
                    box-sizing: border-box !important;
                    box-shadow: none !important;
                    transform: none !important;
                    transition: none !important;
                    animation: none !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                  ">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
                <button class="header-button" id="closeButton" style="
                  color: ${themeColors.textLight} !important;
                  background: none !important;
                  border: none !important;
                  padding: 0.5rem !important;
                  border-radius: 0.5rem !important;
                  cursor: pointer !important;
                  transition: background-color 0.2s ease !important;
                  margin: 0 !important;
                  padding: 0.5rem !important;
                  outline: none !important;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                  font-size: 1rem !important;
                  font-weight: normal !important;
                  line-height: 1 !important;
                  text-decoration: none !important;
                  text-align: center !important;
                  vertical-align: middle !important;
                  white-space: nowrap !important;
                  overflow: visible !important;
                  position: relative !important;
                  z-index: 1 !important;
                  width: auto !important;
                  height: auto !important;
                  min-height: auto !important;
                  max-height: none !important;
                  box-sizing: border-box !important;
                  box-shadow: none !important;
                  transform: none !important;
                  animation: none !important;
                  opacity: 1 !important;
                  visibility: visible !important;
                ">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="
                    width: 1rem !important;
                    height: 1rem !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    border: none !important;
                    outline: none !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                    font-size: 1rem !important;
                    font-weight: normal !important;
                    line-height: 1 !important;
                    color: inherit !important;
                    text-decoration: none !important;
                    text-align: center !important;
                    vertical-align: middle !important;
                    white-space: nowrap !important;
                    overflow: visible !important;
                    position: relative !important;
                    z-index: 1 !important;
                    min-width: 1rem !important;
                    min-height: 1rem !important;
                    max-width: 1rem !important;
                    max-height: 1rem !important;
                    box-sizing: border-box !important;
                    box-shadow: none !important;
                    transform: none !important;
                    transition: none !important;
                    animation: none !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                  ">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Messages Container -->
            <div id="messagesContainer" style="
              height: 24rem !important;
              overflow-y: auto !important;
              padding: 1rem !important;
              background: rgb(249 250 251) !important;
              margin: 0 !important;
              border: none !important;
              outline: none !important;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
              font-size: 1rem !important;
              font-weight: normal !important;
              line-height: 1.5 !important;
              color: rgb(17 24 39) !important;
              text-decoration: none !important;
              text-align: left !important;
              vertical-align: baseline !important;
              white-space: normal !important;
              position: relative !important;
              z-index: 1 !important;
              width: 100% !important;
              min-height: 24rem !important;
              max-height: 24rem !important;
              box-sizing: border-box !important;
              box-shadow: none !important;
              transform: none !important;
              transition: none !important;
              animation: none !important;
              opacity: 1 !important;
              visibility: visible !important;
            ">
              <div style="font-size: 0.875rem; line-height: 1.25rem;">${config.welcomeMessage}</div>
              <div style="font-size: 0.75rem; margin-top: 0.25rem; color: rgb(107 114 128);">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            
            <!-- Input Area -->
            <div class="input-area" style="
              padding: 1rem !important;
              background: white !important;
              border-top: 1px solid rgb(229 231 235) !important;
              display: flex !important;
              gap: 0.5rem !important;
              margin: 0 !important;
              border: none !important;
              outline: none !important;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
              font-size: 1rem !important;
              font-weight: normal !important;
              line-height: 1.5 !important;
              color: rgb(17 24 39) !important;
              text-decoration: none !important;
              text-align: left !important;
              vertical-align: baseline !important;
              white-space: normal !important;
              overflow: visible !important;
              position: relative !important;
              z-index: 1 !important;
              width: 100% !important;
              height: auto !important;
              min-height: auto !important;
              max-height: none !important;
              box-sizing: border-box !important;
              box-shadow: none !important;
              transform: none !important;
              transition: none !important;
              animation: none !important;
              opacity: 1 !important;
              visibility: visible !important;
            ">
              <input
                id="ai-orchestrator-input-${config.chatbotId}"
                type="text"
                placeholder="${config.placeholder}"
                style="
                  flex: 1 !important;
                  padding: 0.75rem 1rem !important;
                  border: 1px solid rgb(209 213 219) !important;
                  border-radius: 0.5rem !important;
                  font-size: 0.875rem !important;
                  line-height: 1.25rem !important;
                  outline: none !important;
                  background: white !important;
                  margin: 0 !important;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                  font-weight: normal !important;
                  color: rgb(17 24 39) !important;
                  text-decoration: none !important;
                  text-align: left !important;
                  vertical-align: baseline !important;
                  white-space: normal !important;
                  overflow: visible !important;
                  position: relative !important;
                  z-index: 1 !important;
                  width: auto !important;
                  height: auto !important;
                  min-height: auto !important;
                  max-height: none !important;
                  box-sizing: border-box !important;
                  box-shadow: none !important;
                  transform: none !important;
                  transition: none !important;
                  animation: none !important;
                  opacity: 1 !important;
                  visibility: visible !important;
                "
              />
              <button id="sendButton" style="
                background: ${themeColors.primary} !important;
                color: white !important;
                border: none !important;
                border-radius: 0.5rem !important;
                padding: 0.75rem 1rem !important;
                cursor: pointer !important;
                transition: opacity 0.2s ease !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                min-width: 3rem !important;
                height: 2.75rem !important;
                margin: 0 !important;
                outline: none !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                font-size: 1rem !important;
                font-weight: normal !important;
                line-height: 1 !important;
                text-decoration: none !important;
                text-align: center !important;
                vertical-align: middle !important;
                white-space: nowrap !important;
                overflow: visible !important;
                position: relative !important;
                z-index: 1 !important;
                width: auto !important;
                min-height: 2.75rem !important;
                max-height: 2.75rem !important;
                box-sizing: border-box !important;
                box-shadow: none !important;
                transform: none !important;
                animation: none !important;
                opacity: 1 !important;
                visibility: visible !important;
              ">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="
                  width: 1.25rem !important;
                  height: 1.25rem !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  border: none !important;
                  outline: none !important;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                  font-size: 1rem !important;
                  font-weight: normal !important;
                  line-height: 1 !important;
                  color: white !important;
                  text-decoration: none !important;
                  text-align: center !important;
                  vertical-align: middle !important;
                  white-space: nowrap !important;
                  overflow: visible !important;
                  position: relative !important;
                  z-index: 1 !important;
                  min-width: 1.25rem !important;
                  min-height: 1.25rem !important;
                  max-width: 1.25rem !important;
                  max-height: 1.25rem !important;
                  box-sizing: border-box !important;
                  box-shadow: none !important;
                  transform: none !important;
                  transition: none !important;
                  animation: none !important;
                  opacity: 1 !important;
                  visibility: visible !important;
                ">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <script>
            let isOpen = false;
            let conversationHistory = [];
            
            const toggleButton = document.getElementById('ai-orchestrator-toggle-${config.chatbotId}');
            const chatWidget = document.getElementById('ai-orchestrator-chat-${config.chatbotId}');
            const closeButton = document.getElementById('closeButton');
            const minimizeButton = document.getElementById('minimizeButton');
            const messageInput = document.getElementById('ai-orchestrator-input-${config.chatbotId}');
            const sendButton = document.getElementById('sendButton');
            const messagesContainer = document.getElementById('messagesContainer');
            
            function toggleWidget() {
                isOpen = !isOpen;
                if (isOpen) {
                    chatWidget.style.display = 'block';
                    toggleButton.style.display = 'none';
                } else {
                    chatWidget.style.display = 'none';
                    toggleButton.style.display = 'flex';
                }
            }
            
            function closeWidget() {
                isOpen = false;
                chatWidget.style.display = 'none';
                toggleButton.style.display = 'flex';
                if (window.parent) {
                    window.parent.postMessage({ action: 'closeWidget' }, '*');
                }
            }
            
            function minimizeWidget() {
                isOpen = false;
                chatWidget.style.display = 'none';
                toggleButton.style.display = 'flex';
                if (window.parent) {
                    window.parent.postMessage({ action: 'minimizeWidget' }, '*');
                }
            }
            
            async function sendMessage() {
                const message = messageInput.value.trim();
                if (!message) return;
                
                conversationHistory.push({ role: 'user', content: message });
                
                const userMessageDiv = document.createElement('div');
                userMessageDiv.style.cssText = \`
                    margin-bottom: 1rem !important;
                    display: flex !important;
                    justify-content: flex-end !important;
                \`;
                
                const userBubble = document.createElement('div');
                userBubble.style.cssText = \`
                    background: ${themeColors.primary} !important;
                    color: white !important;
                    padding: 0.75rem 1rem !important;
                    border-radius: 1rem 1rem 0.25rem 1rem !important;
                    max-width: 80% !important;
                    word-wrap: break-word !important;
                \`;
                userBubble.textContent = message;
                userMessageDiv.appendChild(userBubble);
                messagesContainer.appendChild(userMessageDiv);
                
                messageInput.value = '';
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                const typingDiv = document.createElement('div');
                typingDiv.style.cssText = \`
                    margin-bottom: 1rem !important;
                    display: flex !important;
                    justify-content: flex-start !important;
                \`;
                
                const typingBubble = document.createElement('div');
                typingBubble.style.cssText = \`
                    background: white !important;
                    color: rgb(75 85 99) !important;
                    padding: 0.75rem 1rem !important;
                    border-radius: 1rem 1rem 1rem 0.25rem !important;
                    max-width: 80% !important;
                    word-wrap: break-word !important;
                    border: 1px solid rgb(229 231 235) !important;
                \`;
                typingBubble.innerHTML = '...';
                typingDiv.appendChild(typingBubble);
                messagesContainer.appendChild(typingDiv);
                
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                try {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    typingDiv.remove();
                    
                    const botMessageDiv = document.createElement('div');
                    botMessageDiv.style.cssText = \`
                        margin-bottom: 1rem !important;
                        display: flex !important;
                        justify-content: flex-start !important;
                    \`;
                    
                    const botBubble = document.createElement('div');
                    botBubble.style.cssText = \`
                        background: white !important;
                        color: rgb(17 24 39) !important;
                        padding: 0.75rem 1rem !important;
                        border-radius: 1rem 1rem 1rem 0.25rem !important;
                        max-width: 80% !important;
                        word-wrap: break-word !important;
                        border: 1px solid rgb(229 231 235) !important;
                    \`;
                    botBubble.textContent = 'Thank you for your message! This is a demo response.';
                    botMessageDiv.appendChild(botBubble);
                    messagesContainer.appendChild(botMessageDiv);
                    
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    
                } catch (error) {
                    console.error('Error sending message:', error);
                    typingDiv.remove();
                }
            }
            
            toggleButton.addEventListener('click', toggleWidget);
            closeButton.addEventListener('click', closeWidget);
            minimizeButton.addEventListener('click', minimizeWidget);
            sendButton.addEventListener('click', sendMessage);
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                }
            });
            
            console.log('AI Orchestrator: GTM iframe widget loaded successfully!');
        </script>
    </body>
    </html>
  `;
  
  // Set iframe content
  iframe.srcdoc = widgetHTML;
  
  // Add elements to container
  iframeContainer.appendChild(iframe);
  document.body.appendChild(iframeContainer);
  
  // Enable pointer events after load
  iframe.onload = function() {
    console.log('AI Orchestrator: GTM iframe loaded successfully');
    setTimeout(() => {
      iframe.style.pointerEvents = 'auto';
      iframeContainer.style.pointerEvents = 'auto';
    }, 1000);
  };
  
  // Listen for messages from iframe
  window.addEventListener('message', function(event) {
    if (event.source !== iframe.contentWindow) return;
    
    const { action } = event.data;
    
    switch (action) {
      case 'closeWidget':
      case 'minimizeWidget':
        // Don't hide iframe, let it handle its own toggle
        console.log('AI Orchestrator: Widget closed/minimized');
        break;
    }
  });
  
  console.log('AI Orchestrator: GTM widget loaded successfully!');
})();
