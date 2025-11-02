# AI Orchestrator - E-commerce AI Chatbot Platform

AI Orchestrator is a SaaS platform for creating intelligent, multilingual AI chatbots for e-commerce stores with Shopify integration, real-time analytics, and white-label capabilities.

## 🎯 Key Features

### 🤖 AI-Powered Chatbots
- **50+ Language Support**: Auto-detect and respond in customer's language
- **Contextual Understanding**: Advanced AI for product recommendations and support
- **Customizable Branding**: Logo, fonts, and theme colors
- **Multi-Platform**: Embed on any website or Shopify

### 🛍️ E-commerce Integration
- **Shopify OAuth**: One-click store connection
- **Product Search**: AI-powered product discovery
- **Add to Cart**: Direct cart integration for Professional+ plans
- **Order Tracking**: Real-time order status updates
- **Customer History**: Personalized shopping experience

### 📊 Analytics & Insights
- **Real-time Metrics**: Response rates, satisfaction scores, conversion tracking
- **Language Analytics**: Track customer interactions by language
- **Revenue Impact**: Measure chatbot's effect on sales
- **Performance Trends**: Daily, weekly, and monthly reports
- **AI Insights**: Advanced sentiment analysis (Professional+)

### 🏢 Enterprise Features
- **White Label**: Remove all AI Orchestrator branding (Business)
- **Multiple Chatbots**: 1-3 chatbots depending on plan
- **Multiple Connections**: Up to 5 store connections
- **Priority Support**: Direct access to support team
- **Custom Domains**: Brand your chatbot with your domain

## 📦 Plans

### Starter ($29/month)
- 1 chatbot
- 1 store connection
- 5,000 messages/month
- Multi-language support (50+ languages)
- Basic analytics
- Email support

### Professional ($99/month)
- 2 chatbots
- 2 store connections
- 25,000 messages/month
- Add to cart functionality
- Advanced analytics & AI insights
- Custom branding (logo, fonts)
- Priority support

### Business ($299/month)
- 3 chatbots
- 5 store connections
- 100,000 messages/month
- White-label solution
- Full ML suite
- Abandoned cart recovery
- AI upselling
- Stripe payments
- Dedicated support & account manager

## 🚀 Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **Vite** for bundling
- **React Router** for navigation
- **React Query** for data fetching
- **i18next** for internationalization

### Backend
- **Node.js** + **Express**
- **Prisma ORM** with PostgreSQL/SQLite
- **JWT** authentication
- **Groq API** for AI responses
- **Shopify Admin API** integration
- **Stripe** for payments

### AI & Services
- **Groq** (primary) for fast AI responses
- **OpenAI** (fallback) for complex queries
- Language detection and translation
- Intent classification
- Sentiment analysis
- Product recommendations

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL (or SQLite for development)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/aiorchestrator.git
cd aiorchestrator
```

2. **Backend Setup**
```bash
cd backend
npm install
cp env.production.example .env
# Edit .env with your API keys
npx prisma migrate dev
npx prisma generate
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp env.production.example .env
# Edit .env with API URLs
npm run dev
```

### Environment Variables

See `backend/env.production.example` and `frontend/env.production.example` for required variables.

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `GROQ_API_KEY`: Groq AI API key
- `OPENAI_API_KEY`: OpenAI API key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `SHOPIFY_API_KEY`: Shopify API credentials

## 📱 Widget Integration

### Standard Website Embed
```html
<script src="https://cdn.aiorchestrator.com/chatbot-widget.js" defer></script>
<script>
  window.AIOrchestratorConfig = {
    chatbotId: 'your-chatbot-id',
    apiKey: 'your-api-key',
    theme: 'blue',
    position: 'bottom-right'
  };
</script>
```

### Shopify Integration
```html
<script src="https://cdn.aiorchestrator.com/shopify-widget-shadowdom.js" defer></script>
<script>
  window.AIOrchestratorConfig = {
    chatbotId: 'your-chatbot-id',
    apiKey: 'your-api-key',
    shop: 'your-store.myshopify.com'
  };
</script>
```

## 📚 API Documentation

Full API documentation available at `/docs/api-documentation.md`

Key endpoints:
- `POST /api/chat` - Send message to chatbot
- `GET /api/widget/config/:id` - Get widget config
- `GET /api/analytics` - Get analytics data
- `POST /api/payments/create-checkout-session` - Create Stripe payment

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚢 Deployment

### Backend (Railway/Render/DigitalOcean)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy from main branch

### Frontend (Vercel)
1. Import project from GitHub
2. Set environment variables
3. Deploy automatically on push

### Widgets (CDN)
Widgets are hosted on CDN and automatically update from production builds.

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React/Vite)           │
│  ┌───────────────────────────────────┐  │
│  │  Dashboard | Chatbot | Analytics  │  │
│  └───────────────────────────────────┘  │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│         Backend (Node/Express)          │
│  ┌───────────────────────────────────┐  │
│  │  Auth | Chat | Analytics | API    │  │
│  └───────────────────────────────────┘  │
└────┬────────────────────────┬───────────┘
     │                        │
     ▼                        ▼
┌────────────┐       ┌─────────────────┐
│  Database  │       │   AI Services   │
│ (Prisma)   │       │ Groq + OpenAI   │
└────────────┘       └─────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Shopify     │
                    │   Stripe + CDN  │
                    └─────────────────┘
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

- Email: support@aiorchestrator.com
- Docs: https://docs.aiorchestrator.com
- Issues: https://github.com/yourusername/aiorchestrator/issues

## 🎉 Acknowledgments

Built with ❤️ by the AI Orchestrator team

