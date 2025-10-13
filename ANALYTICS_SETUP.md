# 📊 ANALYTICS SETUP - GitHub Student Pack

## ✅ **TOOLS GRATUITI CON GITHUB STUDENT PACK:**

### **1. Datadog - $300 crediti (2 anni)** 🏆

**Cosa fa:**
- 📊 Monitoring backend (CPU, RAM, response time)
- 🔍 APM (Application Performance Monitoring)
- 📝 Log aggregation
- ⚡ Real-time alerts
- 📈 Custom dashboards

**Setup (5 min):**

```bash
cd backend
npm install dd-trace
```

In `backend/complete-api-server.js` (all'inizio):

```javascript
// Datadog APM
require('dd-trace').init({
  service: 'ai-orchestrator-backend',
  env: process.env.NODE_ENV || 'production',
  logInjection: true
});
```

Environment Variables (DigitalOcean):
```env
DD_API_KEY=your_datadog_api_key
DD_SITE=datadoghq.eu
```

**Dashboard:** [app.datadoghq.com](https://app.datadoghq.com)

---

### **2. Sentry - Error Tracking** 🔴

**Cosa fa:**
- 🐛 Cattura errori frontend + backend
- 📧 Alert via email/Slack
- 🔍 Stack trace completi
- 👤 User impact tracking

**Setup Backend (2 min):**

```bash
cd backend
npm install @sentry/node
```

In `backend/complete-api-server.js`:

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});

// Middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Before error handlers
app.use(Sentry.Handlers.errorHandler());
```

**Setup Frontend (2 min):**

```bash
cd frontend
npm install @sentry/react
```

In `frontend/src/main.tsx`:

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1
});
```

Environment Variables:
```env
# Backend
SENTRY_DSN=https://xxx@sentry.io/xxx

# Frontend
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

**Dashboard:** [sentry.io](https://sentry.io)

---

### **3. LogRocket - Session Replay** 🎥

**Cosa fa:**
- 🎬 Registra sessioni utenti (video)
- 🐛 Vedi cosa facevano quando è crashato
- 📊 Performance monitoring
- 🔍 Network inspection

**Setup Frontend (3 min):**

```bash
cd frontend
npm install logrocket
```

In `frontend/src/main.tsx`:

```typescript
import LogRocket from 'logrocket';

if (import.meta.env.PROD) {
  LogRocket.init('your-app-id');
}
```

**Dashboard:** [logrocket.com](https://logrocket.com)

---

### **4. Vercel Analytics (Incluso Gratis)** 📈

**Cosa fa:**
- 📊 Page views
- ⚡ Performance metrics (Web Vitals)
- 🌍 Geographic data
- 📱 Device breakdown

**Setup (1 min):**

In `frontend/package.json`:

```json
{
  "dependencies": {
    "@vercel/analytics": "^1.0.0"
  }
}
```

In `frontend/src/main.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

<App />
<Analytics />
```

**Dashboard:** Vercel dashboard → **Analytics** tab

---

### **5. PostHog - Product Analytics** 🚀

**Cosa fa:**
- 📊 Feature flags
- 🎯 A/B testing
- 🔥 Heatmaps
- 📈 User funnels
- 🎬 Session recording

**Setup (5 min):**

```bash
cd frontend
npm install posthog-js
```

In `frontend/src/main.tsx`:

```typescript
import posthog from 'posthog-js';

posthog.init('phc_your_key', {
  api_host: 'https://app.posthog.com'
});
```

**Gratis:** Self-hosted su DigitalOcean (usa crediti!)

---

## 🎯 **STACK ANALYTICS CONSIGLIATO:**

### **Setup Professionale (Tutto Gratis):**

```
📊 FRONTEND:
├── Vercel Analytics (performance, traffic)
├── LogRocket (session replay, debugging)
└── Sentry (error tracking)

📊 BACKEND:
├── Datadog (APM, monitoring, logs)
└── Sentry (error tracking)

📊 BUSINESS:
├── PostHog (product analytics, A/B test)
└── Custom dashboard (Prisma queries)

📊 DATABASE:
└── DigitalOcean built-in metrics
```

---

## 💰 **COSTI (Con GitHub Pack):**

```
Datadog:         $300 crediti (2 anni) = GRATIS
Sentry:          5K errors/mese = GRATIS
LogRocket:       1K sessions/mese = GRATIS
Vercel Analytics: Incluso = GRATIS
PostHog:         Self-hosted = GRATIS (usa crediti DO)
DigitalOcean:    $200 crediti = GRATIS (10 mesi)

TOTALE: $0 per analytics completo! 🎉
```

---

## 📋 **PRIORITÀ IMPLEMENTAZIONE:**

### **Phase 1 (Deploy Subito):**
1. ✅ Vercel Analytics (già incluso)
2. ✅ DigitalOcean DB monitoring (già incluso)

### **Phase 2 (Post-Deploy, 30 min):**
3. ✅ Sentry (error tracking - essenziale!)
4. ✅ Datadog (backend monitoring)

### **Phase 3 (Dopo primi utenti):**
5. ✅ LogRocket (session replay)
6. ✅ PostHog (product analytics)

---

## 🔧 **QUICK START - SENTRY (5 MIN):**

**Backend:**
```bash
cd backend
npm install @sentry/node
```

Aggiungi a `complete-api-server.js` (riga 1):
```javascript
require('@sentry/node').init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

**Frontend:**
```bash
cd frontend
npm install @sentry/react
```

Aggiungi a `main.tsx`:
```typescript
import * as Sentry from '@sentry/react';
Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN });
```

**Get DSN:**
1. Vai su [sentry.io](https://sentry.io)
2. Sign up (usa email GitHub)
3. Create Project → React (frontend) + Node.js (backend)
4. Copia DSN → Aggiungi a env variables

**DONE!** Ora ricevi alert per ogni errore! 🚨

---

## 📊 **METRICHE DA TRACKARE:**

### **Business Metrics:**
- 📈 New signups/day
- 💰 MRR (Monthly Recurring Revenue)
- 📉 Churn rate
- ⭐ Customer satisfaction (rating agenti)
- 🔄 Conversion rate (trial → paid)

### **Technical Metrics:**
- ⚡ API response time
- 🐛 Error rate
- 💬 Messages/day
- 🤖 AI success rate
- 👥 Concurrent users

### **Product Metrics:**
- 🎯 Feature usage (live agent handoff %)
- 📦 Order tracking queries
- 🌍 Language distribution
- 📱 Device breakdown

---

## ✅ **RIEPILOGO FINALE:**

### **Frontend:**
- ✅ **Vercel per sempre** (gratis)
- ✅ Non spostare mai
- ✅ Scala automaticamente

### **Analytics GitHub Pack:**
- ✅ **Datadog** ($300 crediti - monitoring)
- ✅ **Sentry** (error tracking)
- ✅ **LogRocket** (session replay)
- ✅ **MongoDB** ($50 crediti - analytics storage)
- ✅ **New Relic** ($500 crediti - APM)

### **Setup:**
1. Deploy ora (senza analytics)
2. Aggiungi Sentry subito (5 min)
3. Datadog quando hai primi utenti (30 min)
4. Resto dopo

---

**🎉 Hai TUTTI gli strumenti enterprise gratis con GitHub Pack! Usali!** 🚀
