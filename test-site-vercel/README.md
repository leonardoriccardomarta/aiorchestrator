# AI Orchestrator Widget Test Site

This is a test site for the AI Orchestrator chatbot widget, designed to be deployed on Vercel.

## 🚀 Quick Deploy

1. **Upload to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Upload this folder or connect to GitHub
   - Deploy!

2. **Manual Deploy:**
   ```bash
   npx vercel --prod
   ```

## 🧪 What This Tests

- **Widget Loading:** Verifies the widget loads correctly
- **Mobile Responsive:** Tests mobile floating design
- **Language Enforcement:** English-only responses
- **Context Awareness:** Demo mode (talks about AI Orchestrator)
- **API Integration:** Real backend communication
- **CORS:** Cross-origin requests

## 📱 Mobile Testing

The widget should:
- ✅ Maintain floating design (not full-screen)
- ✅ Show input bar completely
- ✅ Have optimized font sizes
- ✅ Use proper touch targets (44px+)

## 🔧 Debug Functions

Open browser console and use:
- `debugWidget()` - Check widget status
- `testMessage('Hello')` - Send test message
- `toggleChatbot()` - Open/close widget

## 📋 Expected Behavior

1. **Widget appears** in bottom-right corner
2. **Click to open** (autoOpen: false)
3. **English responses only** (primaryLanguage: "en")
4. **Talks about AI Orchestrator** (demo mode)
5. **Mobile responsive** design
6. **All features working** (ML, personalization, etc.)

## 🎯 Test Scenarios

1. **Basic Chat:** Send "Hello" - should respond in English
2. **Language Test:** Send "Ciao" - should respond in English
3. **Feature Test:** Ask about features - should mention AI Orchestrator
4. **Mobile Test:** Test on mobile device
5. **Error Handling:** Test with network issues

## 📊 Status Monitoring

The page shows real-time widget status in the top-right corner:
- ✅ Green = Working
- ⚠️ Yellow = Warning
- ❌ Red = Error

## 🔗 Links

- **Widget Source:** https://www.aiorchestrator.dev/chatbot-widget.js
- **API Endpoint:** https://aiorchestrator-vtihz.ondigitalocean.app/api/chat
- **Backend:** https://aiorchestrator-vtihz.ondigitalocean.app
