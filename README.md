# 🤖 AI Orchestrator - AI-Powered Customer Support Platform

> Transform your e-commerce customer support with AI. 50+ languages, 24/7 availability, 10-100x cheaper than traditional support.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

---

## 🌟 **Features**

### **Core Platform:**
- 🤖 **AI-Powered Chat** - Groq AI with OpenAI fallback
- 🌍 **True Multilingual** - 50+ languages with automatic detection
- ⚡ **Lightning Fast** - Sub-2 second response times
- 📊 **Advanced Analytics** - Real-time insights and sentiment analysis
- 🎨 **Customizable Widget** - Match your brand perfectly
- 🔌 **Easy Integration** - Shopify, WooCommerce, and more

### **Business Features:**
- 💰 **Pricing Plans** - Starter ($29), Pro ($99), Enterprise ($299)
- 🎁 **Affiliate Program** - 50% commission for referrals
- 📧 **Email Automation** - Welcome, follow-up, notifications
- 💳 **Payment Processing** - Stripe & PayPal integration
- 🔐 **Multi-tenant** - Secure user isolation
- 📈 **Real-time Dashboard** - Monitor performance

---

## 📁 **Project Structure**

```
aiorchestratordemoo/
├── backend/                    # Node.js Backend API
│   ├── complete-api-server.js  # Main production server
│   ├── src/                    # Source code
│   │   ├── services/           # Business logic
│   │   ├── controllers/        # API endpoints
│   │   ├── middleware/         # Auth, validation
│   │   └── routes/             # Route definitions
│   ├── prisma/                 # Database schema
│   ├── railway.json            # Railway deploy config
│   └── package.json
│
├── frontend/                   # React Frontend App
│   ├── src/
│   │   ├── pages/              # App pages
│   │   ├── components/         # React components
│   │   ├── services/           # API clients
│   │   ├── contexts/           # State management
│   │   └── hooks/              # Custom hooks
│   ├── public/                 # Static assets
│   ├── vercel.json             # Vercel deploy config
│   └── package.json
│
└── .github/                    # GitHub Actions (CI/CD)
```

---

## 🚀 **Quick Start**

### **Prerequisites:**

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Gmail account** (for email service)
- **Groq API key** ([Get free key](https://console.groq.com/))

### **Installation:**

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/aiorchestratordemoo.git
cd aiorchestratordemoo

# 2. Backend Setup
cd backend
npm install
cp env.template .env
# Edit .env with your credentials
npm start

# 3. Frontend Setup (new terminal)
cd ../frontend
npm install
npm run dev
```

### **Access:**

- **Frontend App**: http://localhost:5176
- **Backend API**: http://localhost:4000

---

## 🔧 **Configuration**

### **Backend (.env):**

```env
# Database
DATABASE_URL="file:./dev.db"

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# AI Services
GROQ_API_KEY=gsk_your_key_here
OPENAI_API_KEY=sk_your_key_here

# Payment
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Server
PORT=4000
JWT_SECRET=your-secret-key
```

### **Frontend (.env):**

```env
VITE_API_URL=http://localhost:4000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_PAYPAL_CLIENT_ID=your_id
```

---

## 💼 **Pricing**

| Plan | Price | Chatbots | Messages | Websites | Trial |
|------|-------|----------|----------|----------|-------|
| **Starter** | $29/mo | 1 | 5,000/mo | 1 | 7 days |
| **Professional** | $99/mo | 2 | 25,000/mo | 2 | - |
| **Enterprise** | $299/mo | 3 | 100,000/mo | 3 | - |

🎁 **7-day free trial** on Starter plan  
💰 **Affiliate program**: 50% commission for first 3 months

---

## 🛠️ **Tech Stack**

### **Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router
- Stripe/PayPal

### **Backend:**
- Node.js + Express
- Prisma ORM
- SQLite/PostgreSQL
- JWT Authentication
- Groq/OpenAI AI

---

## 📦 **Deployment**

### **Quick Deploy (15 minutes):**

See **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** for rapid deployment.

### **Full Guide:**

See **[DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)** for complete deployment instructions.

### **Platforms:**

- **Backend**: Railway (recommended) or Render
- **Frontend**: Vercel (recommended) or Netlify

---

## 🧪 **Testing**

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## 📝 **Documentation**

- **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - 15-minute deployment guide
- **[DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)** - Complete deployment documentation
- **[DEPLOY_SUMMARY.md](DEPLOY_SUMMARY.md)** - Deployment checklist
- **[backend/docs/api-documentation.md](backend/docs/api-documentation.md)** - API reference

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m '✨ Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 **License**

This project is licensed under the MIT License.

---

## 📞 **Support**

- **Email**: support@aiorchestratordemoo.com
- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/aiorchestratordemoo/issues)

---

## 🗺️ **Roadmap**

### **✅ Completed (v1.0)**
- [x] Core chatbot functionality
- [x] Multi-language support (50+ languages)
- [x] Payment integration (Stripe & PayPal)
- [x] Affiliate system (50% commission)
- [x] Shopify & WooCommerce integration
- [x] Real-time analytics
- [x] **Live Agent Handoff** 🆕
- [x] **Automatic Order Tracking** 🆕

### **🚧 In Progress (v1.1)**
- [ ] WebSocket real-time chat
- [ ] Advanced agent analytics
- [ ] Multi-agent routing
- [ ] Canned responses for agents

### **📋 Planned (v2.0)**
- [ ] Mobile apps (iOS/Android)
- [ ] WhatsApp & Telegram integration
- [ ] Voice & video support
- [ ] Screen sharing
- [ ] Custom AI training per merchant
- [ ] WordPress plugin
- [ ] Sentiment-based priority routing
- [ ] Auto-translation for agents
- [ ] File attachment support

---

**Made with ❤️ by the AI Orchestrator Team**

🌟 **Star us on GitHub** if this project helped you!

