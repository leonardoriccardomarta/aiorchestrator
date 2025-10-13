# 🚀 GUIDA COMPLETA AL DEPLOY - AI Orchestrator

## 📋 **PANORAMICA**

Il progetto è diviso in **3 parti separate** da deployare:

1. **Backend** (`/backend/`) → Railway o Render
2. **Frontend** (`/frontend/`) → Vercel
3. **Whitelist Landing** (`/whitelist-landing/`) → Vercel o Netlify

---

## 🎯 **STRATEGIA DI DEPLOY**

### ✅ **Ordine Consigliato:**

1. **Backend PRIMA** (per ottenere l'URL API)
2. **Frontend** (usando l'URL del backend)
3. **Whitelist Landing** (indipendente)

---

## 🔧 **PARTE 1: DEPLOY BACKEND (Railway)**

### **Perché Railway?**
- ✅ Deploy automatico da GitHub
- ✅ Database PostgreSQL incluso
- ✅ $5/mese di crediti gratuiti
- ✅ Supporto Node.js nativo
- ✅ Variabili d'ambiente facili

### **Step 1: Prepara il Backend**

```powershell
cd backend

# Verifica che complete-api-server.js esista
ls complete-api-server.js

# Verifica package.json
cat package.json
```

### **Step 2: Crea `railway.json`**

Crea questo file in `/backend/railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx prisma generate && npx prisma migrate deploy"
  },
  "deploy": {
    "startCommand": "node complete-api-server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **Step 3: Aggiorna `package.json`**

Assicurati che ci sia:

```json
{
  "scripts": {
    "start": "node complete-api-server.js",
    "build": "npx prisma generate"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### **Step 4: Deploy su Railway**

1. **Vai su** [railway.app](https://railway.app)
2. **Login** con GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Seleziona** `aiorchestratordemoo`
5. **Root Directory** → `/backend`
6. **Add PostgreSQL** (opzionale, o usa SQLite)

### **Step 5: Configura Variabili d'Ambiente**

Nel dashboard Railway, vai su **Variables** e aggiungi:

```env
# Database (se usi PostgreSQL Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Oppure usa SQLite (più semplice per iniziare)
DATABASE_URL=file:./prod.db

# Email
EMAIL_USER=aiorchestratoor@gmail.com
EMAIL_PASSWORD=tua_app_password_gmail
ADMIN_EMAIL=aiorchestratoor@gmail.com

# AI Services
GROQ_API_KEY=gsk_your_key_here
OPENAI_API_KEY=sk_your_key_here

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
PAYPAL_MODE=live

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Server
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### **Step 6: Deploy!**

Railway farà il deploy automaticamente. Otterrai un URL tipo:

```
https://aiorchestratordemoo-production.up.railway.app
```

**✅ SALVA QUESTO URL!** Lo userai per il frontend.

### **Step 7: Verifica Backend**

```powershell
# Testa l'API
curl https://your-backend.railway.app/api/health

# Dovrebbe rispondere: {"status":"ok"}
```

---

## 🎨 **PARTE 2: DEPLOY FRONTEND (Vercel)**

### **Perché Vercel?**
- ✅ Ottimizzato per React/Vite
- ✅ Deploy automatico da GitHub
- ✅ CDN globale gratuito
- ✅ HTTPS automatico
- ✅ Preview per ogni commit

### **Step 1: Prepara il Frontend**

```powershell
cd frontend

# Verifica struttura
ls src/
ls public/
```

### **Step 2: Crea `vercel.json`** (se non esiste)

In `/frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### **Step 3: Aggiorna `.env.production`**

Crea `/frontend/.env.production`:

```env
VITE_API_URL=https://your-backend.railway.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### **Step 4: Deploy su Vercel**

#### **Opzione A: CLI (Consigliato)**

```powershell
# Installa Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

#### **Opzione B: Dashboard Web**

1. **Vai su** [vercel.com](https://vercel.com)
2. **Login** con GitHub
3. **New Project** → **Import Git Repository**
4. **Seleziona** `aiorchestratordemoo`
5. **Root Directory** → `frontend`
6. **Framework Preset** → Vite
7. **Build Command** → `npm run build`
8. **Output Directory** → `dist`

### **Step 5: Configura Variabili d'Ambiente**

Nel dashboard Vercel, vai su **Settings → Environment Variables**:

```env
VITE_API_URL=https://your-backend.railway.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### **Step 6: Deploy!**

Vercel farà il build e deploy. Otterrai un URL tipo:

```
https://aiorchestratordemoo.vercel.app
```

### **Step 7: Aggiorna Backend CORS**

Torna su Railway e aggiungi al backend:

```env
FRONTEND_URL=https://aiorchestratordemoo.vercel.app
```

Poi in `complete-api-server.js` verifica:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5176',
  credentials: true
}));
```

---

## 🎯 **PARTE 3: DEPLOY WHITELIST LANDING (Vercel/Netlify)**

### **Step 1: Prepara Whitelist**

```powershell
cd whitelist-landing

# Verifica file
ls index.html
ls server.js
ls package.json
```

### **Step 2: Deploy su Vercel**

#### **Opzione A: Static (Solo HTML)**

Se vuoi solo la landing statica (senza waitlist funzionante):

```powershell
cd whitelist-landing
vercel --prod
```

Configura:
- **Framework Preset**: Other
- **Build Command**: (lascia vuoto)
- **Output Directory**: `.` (root)

#### **Opzione B: Serverless (Con Backend Node.js)**

Crea `/whitelist-landing/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

Aggiorna `server.js`:

```javascript
// Aggiungi all'inizio
const isProduction = process.env.NODE_ENV === 'production';

// Cambia le route in /api/*
app.post('/api/waitlist', async (req, res) => {
  // ... codice esistente
});

// Export per Vercel
module.exports = app;
```

### **Step 3: Configura Variabili d'Ambiente**

```env
EMAIL_USER=aiorchestratoor@gmail.com
EMAIL_PASSWORD=your_app_password
GROQ_API_KEY=gsk_your_key_here
NODE_ENV=production
```

### **Step 4: Deploy!**

```powershell
vercel --prod
```

URL finale:

```
https://waitlist-aiorchestratordemoo.vercel.app
```

---

## 🔗 **PARTE 4: COLLEGA TUTTO**

### **1. Backend → Frontend**

Nel backend (`complete-api-server.js`):

```javascript
const allowedOrigins = [
  'https://aiorchestratordemoo.vercel.app',
  'https://waitlist-aiorchestratordemoo.vercel.app',
  'http://localhost:5176' // per sviluppo
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### **2. Frontend → Backend**

Nel frontend (`.env.production`):

```env
VITE_API_URL=https://your-backend.railway.app
```

### **3. Stripe Webhooks**

1. Vai su [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. **Add endpoint**: `https://your-backend.railway.app/api/webhooks/stripe`
3. **Events**: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. **Copia Signing Secret** e aggiungilo al backend:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### **4. PayPal Webhooks**

1. Vai su [PayPal Developer](https://developer.paypal.com/dashboard/webhooks)
2. **Create Webhook**: `https://your-backend.railway.app/api/webhooks/paypal`
3. **Events**: `PAYMENT.SALE.COMPLETED`, `BILLING.SUBSCRIPTION.ACTIVATED`

---

## 📊 **VERIFICA FINALE**

### **Checklist Completa:**

```powershell
# 1. Backend Health Check
curl https://your-backend.railway.app/api/health

# 2. Frontend carica?
curl https://aiorchestratordemoo.vercel.app

# 3. Whitelist carica?
curl https://waitlist-aiorchestratordemoo.vercel.app

# 4. Test API dal frontend
# Apri DevTools → Network → Prova login/registrazione

# 5. Test email
# Registrati e verifica che arrivi l'email

# 6. Test pagamento
# Prova checkout Stripe (usa carta test: 4242 4242 4242 4242)
```

### **Test Funzionalità:**

- [ ] ✅ Registrazione utente
- [ ] ✅ Login utente
- [ ] ✅ Email di verifica
- [ ] ✅ Dashboard carica
- [ ] ✅ Creazione chatbot
- [ ] ✅ Chatbot risponde (Groq AI)
- [ ] ✅ Pagamento Stripe
- [ ] ✅ Pagamento PayPal
- [ ] ✅ Affiliate system
- [ ] ✅ Whitelist form

---

## 🐛 **TROUBLESHOOTING**

### **Errore: CORS**

```javascript
// Backend: aggiungi frontend URL
FRONTEND_URL=https://aiorchestratordemoo.vercel.app

// Verifica in complete-api-server.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### **Errore: Database Connection**

```env
# Railway PostgreSQL
DATABASE_URL=${{Postgres.DATABASE_URL}}

# O usa SQLite (più semplice)
DATABASE_URL=file:./prod.db
```

### **Errore: Prisma Generate**

```powershell
# Nel backend
npx prisma generate
npx prisma migrate deploy

# Aggiungi a railway.json buildCommand
"buildCommand": "npm install && npx prisma generate"
```

### **Errore: Environment Variables**

```powershell
# Verifica nel dashboard Railway/Vercel
# Settings → Environment Variables

# Redeploy dopo aver aggiunto variabili
```

### **Errore: Build Failed**

```powershell
# Frontend: verifica che dist/ sia gitignored
echo "dist/" >> .gitignore

# Backend: verifica Node version
"engines": {
  "node": ">=18.0.0"
}
```

---

## 🎉 **DEPLOY COMPLETATO!**

### **URL Finali:**

- **Frontend App**: `https://aiorchestratordemoo.vercel.app`
- **Backend API**: `https://aiorchestratordemoo-production.up.railway.app`
- **Whitelist**: `https://waitlist-aiorchestratordemoo.vercel.app`

### **Prossimi Step:**

1. **Custom Domain** (opzionale)
   - Vercel: Settings → Domains → Add
   - Railway: Settings → Domains → Generate

2. **Monitoring**
   - Railway: Metrics tab
   - Vercel: Analytics tab
   - Sentry per error tracking

3. **Analytics**
   - Google Analytics
   - Plausible
   - PostHog

4. **SEO**
   - Sitemap
   - robots.txt
   - Meta tags

---

## 📞 **SUPPORTO**

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)

---

**🚀 Buon Deploy!**

