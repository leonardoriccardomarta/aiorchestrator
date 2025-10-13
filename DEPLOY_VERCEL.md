# 🚀 DEPLOY COMPLETO SU VERCEL - 10 Minuti

## 💡 **Strategia Dominio**

### **✅ Backend (API nascosta):**
- Deploy su Vercel con dominio gratuito
- URL: `aiorchestratordemoo-api.vercel.app`
- **NON si vede** (solo per chiamate API interne)

### **✅ Frontend (App pubblica):**
- Deploy su Vercel con il tuo dominio custom
- URL: `aiorchestratordemoo.com` (o quello che vuoi)
- **Questo vedono gli utenti**

---

## 📋 **STEP 1: Deploy Backend (5 min)**

### **1.1 Vai su Vercel**

```
https://vercel.com
```

- Login con GitHub

### **1.2 Deploy Backend**

1. **New Project** → **Import** `aiorchestratordemoo`
2. **Project Name**: `aiorchestratordemoo-api` (o `backend-api`)
3. **Root Directory**: `backend`
4. **Framework Preset**: Other
5. **Build Command**: Lascia vuoto
6. **Output Directory**: Lascia vuoto

### **1.3 Aggiungi Variabili d'Ambiente**

Nel dashboard Vercel → **Settings** → **Environment Variables**:

```env
# Database (usa SQLite per iniziare)
DATABASE_URL=file:./prisma/prod.db

# Email
EMAIL_USER=aiorchestratoor@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=aiorchestratoor@gmail.com

# AI Services
GROQ_API_KEY=gsk_your_groq_key
OPENAI_API_KEY=sk_your_openai_key

# Stripe
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# PayPal
PAYPAL_CLIENT_ID=your_id
PAYPAL_CLIENT_SECRET=your_secret
PAYPAL_MODE=live

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Server
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://aiorchestratordemoo.vercel.app
```

### **1.4 Deploy!**

Clicca **Deploy** → Aspetta ~2 minuti

**✅ URL Backend**: `https://aiorchestratordemoo-api.vercel.app`

---

## 📋 **STEP 2: Deploy Frontend (5 min)**

### **2.1 Deploy Frontend**

1. **New Project** → **Import** `aiorchestratordemoo`
2. **Project Name**: `aiorchestratordemoo` (questo userà il dominio custom)
3. **Root Directory**: `frontend`
4. **Framework Preset**: **Vite**
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`

### **2.2 Aggiungi Variabili d'Ambiente**

Nel dashboard Vercel → **Settings** → **Environment Variables**:

```env
# Backend API URL (usa l'URL del backend appena deployato)
VITE_API_URL=https://aiorchestratordemoo-api.vercel.app

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key

# PayPal
VITE_PAYPAL_CLIENT_ID=your_id
```

### **2.3 Deploy!**

Clicca **Deploy** → Aspetta ~2 minuti

**✅ URL Frontend**: `https://aiorchestratordemoo.vercel.app`

---

## 🌐 **STEP 3: Collega Dominio Custom (Opzionale)**

### **Solo per il Frontend:**

1. Nel dashboard Vercel del **frontend** → **Settings** → **Domains**
2. **Add Domain**: `aiorchestratordemoo.com`
3. Segui le istruzioni per configurare DNS:
   - Aggiungi record A o CNAME al tuo provider DNS
   - Aspetta propagazione (5-30 minuti)

### **Backend rimane nascosto:**
- Il backend continua a usare `aiorchestratordemoo-api.vercel.app`
- Gli utenti NON lo vedono mai
- Solo il frontend lo chiama internamente

---

## 🔗 **STEP 4: Collega Backend e Frontend**

### **4.1 Aggiorna CORS nel Backend**

Il backend è già configurato per CORS, ma verifica:

Nel dashboard Vercel del **backend** → **Environment Variables**:

```env
FRONTEND_URL=https://aiorchestratordemoo.vercel.app
```

Se usi dominio custom:
```env
FRONTEND_URL=https://aiorchestratordemoo.com
```

### **4.2 Redeploy Backend**

Dopo aver aggiornato `FRONTEND_URL`:
- Dashboard backend → **Deployments** → **...** → **Redeploy**

---

## ✅ **STEP 5: Verifica Funzionamento**

### **Test Backend:**

```powershell
# Test API health
curl https://aiorchestratordemoo-api.vercel.app/health
```

Risposta attesa:
```json
{"status":"ok","timestamp":"..."}
```

### **Test Frontend:**

Apri browser: `https://aiorchestratordemoo.vercel.app`

- [ ] Pagina carica
- [ ] Registrazione funziona
- [ ] Login funziona
- [ ] Dashboard carica
- [ ] Chatbot risponde

---

## 🔧 **STEP 6: Configura Webhooks**

### **Stripe Webhooks:**

1. Vai su [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. **Add endpoint**: `https://aiorchestratordemoo-api.vercel.app/api/webhooks/stripe`
3. **Events**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. **Copia Signing Secret** → Aggiungi al backend come `STRIPE_WEBHOOK_SECRET`

### **PayPal Webhooks:**

1. Vai su [PayPal Developer](https://developer.paypal.com/dashboard/webhooks)
2. **Create Webhook**: `https://aiorchestratordemoo-api.vercel.app/api/webhooks/paypal`
3. **Events**:
   - `PAYMENT.SALE.COMPLETED`
   - `BILLING.SUBSCRIPTION.ACTIVATED`

---

## 📊 **VANTAGGI DI QUESTA STRATEGIA**

### **✅ Backend nascosto:**
- URL tecnico (es: `xxx-api.vercel.app`)
- NON serve dominio custom
- Risparmio ~$10/anno

### **✅ Frontend con dominio:**
- URL professionale (`aiorchestratordemoo.com`)
- Brand riconoscibile
- SEO ottimizzato

### **✅ Tutto su Vercel:**
- Una sola piattaforma
- Deploy automatico da Git
- Gratuito per iniziare

---

## 💰 **COSTI**

### **Piano Hobby (Gratuito):**
- ✅ Backend: **Gratuito**
- ✅ Frontend: **Gratuito**
- ✅ 100GB bandwidth/mese
- ✅ Serverless Functions

### **Solo se cresci:**
- Dominio custom: ~$10/anno (GoDaddy, Namecheap)
- Piano Pro Vercel: $20/mese (solo se superi limiti gratuiti)

---

## 🎯 **URL FINALI**

Dopo il deploy avrai:

### **Utenti vedono:**
```
https://aiorchestratordemoo.com          ← Frontend (con tuo dominio)
```

### **API nascosta (backend):**
```
https://aiorchestratordemoo-api.vercel.app  ← Backend (dominio Vercel gratuito)
```

Gli utenti **NON vedono mai** l'URL del backend!

---

## 🐛 **TROUBLESHOOTING**

### **Errore: CORS**

Backend → Environment Variables:
```env
FRONTEND_URL=https://aiorchestratordemoo.vercel.app
```
Poi redeploy backend.

### **Errore: Database**

Vercel Serverless ha limiti con SQLite.  
**Opzioni:**:
1. Usa **Vercel Postgres** (gratuito)
2. Usa **PlanetScale** MySQL (gratuito)
3. Usa **Railway** solo per backend con PostgreSQL

### **Errore: Build Failed**

Verifica:
- `package.json` ha `"type": "module"` rimosso (se usa CommonJS)
- `complete-api-server.js` esporta `module.exports = app`

---

## 📚 **ALTERNATIVE**

Se hai problemi con database su Vercel:

### **Opzione A: Backend su Railway + Frontend su Vercel**
- Backend: Railway (PostgreSQL incluso)
- Frontend: Vercel (con dominio custom)
- Stesso principio: backend nascosto, frontend con dominio

### **Opzione B: Tutto su Vercel + Database esterno**
- Backend + Frontend: Vercel
- Database: PlanetScale MySQL (gratuito)
- Tutto gratuito!

---

## ✅ **CHECKLIST DEPLOY**

- [ ] Backend deployato su Vercel
- [ ] Frontend deployato su Vercel
- [ ] Variabili d'ambiente configurate (backend)
- [ ] Variabili d'ambiente configurate (frontend)
- [ ] CORS configurato (FRONTEND_URL nel backend)
- [ ] Test API funziona (`/health`)
- [ ] Test frontend funziona
- [ ] Webhooks Stripe configurati
- [ ] Webhooks PayPal configurati
- [ ] (Opzionale) Dominio custom collegato al frontend

---

## 🎉 **DEPLOY COMPLETATO!**

Hai ora:
- ✅ Backend API funzionante (nascosto)
- ✅ Frontend pubblico (con dominio professionale)
- ✅ Tutto gratuito (piano Hobby Vercel)
- ✅ Deploy automatico da Git

**Prossimi step:**
1. Testa tutte le funzionalità
2. (Opzionale) Collega dominio custom al frontend
3. Monitora analytics su Vercel dashboard

---

**🚀 Tutto deployato in 10 minuti con Vercel!**

