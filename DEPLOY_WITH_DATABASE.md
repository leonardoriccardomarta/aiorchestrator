# 🚀 DEPLOY COMPLETO CON DATABASE - Step by Step

## ✅ **TUTTO PRONTO PER IL DEPLOY!**

---

## 🗄️ **STEP 1: Setup Database (Scegli una opzione)**

### **OPZIONE A: Vercel Postgres (Consigliato - Tutto su Vercel)**

#### **1.1 Deploy Backend prima (senza DB)**

```powershell
# Carica su GitHub
git add .
git commit -m "🚀 Ready for deploy with Live Agent + Order Tracking"
git push
```

#### **1.2 Deploy su Vercel**

1. Vai su [vercel.com](https://vercel.com)
2. **New Project** → Import `aiorchestratordemoo`
3. **Project Name**: `aiorchestratordemoo-api`
4. **Root Directory**: `backend`
5. **Framework**: Other
6. **Deploy** (non aggiungere variabili ancora)

#### **1.3 Aggiungi Vercel Postgres**

Nel dashboard del progetto backend:

1. **Storage** tab → **Create Database**
2. **Postgres** → Nome: `ai-orchestrator-db`
3. **Create** → Vercel collega automaticamente!

Vercel crea automaticamente queste variabili:
```env
POSTGRES_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...
```

#### **1.4 Aggiungi Database URL**

Nel dashboard → **Settings** → **Environment Variables**:

```env
DATABASE_URL=$POSTGRES_URL
```

✅ Usa la variabile `$POSTGRES_URL` che Vercel ha creato!

#### **1.5 Aggiungi Altre Variabili**

```env
# Email
EMAIL_USER=aiorchestratoor@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=aiorchestratoor@gmail.com

# AI
GROQ_API_KEY=gsk_your_key
OPENAI_API_KEY=sk_your_key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_CLIENT_ID=your_id
PAYPAL_CLIENT_SECRET=your_secret
PAYPAL_MODE=live

# JWT
JWT_SECRET=your-random-secret-key-change-this

# Server
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://aiorchestratordemoo.vercel.app

# Cron (lascia vuoto o false per abilitare)
# DISABLE_CRON=false
```

#### **1.6 Configura Build Command**

Dashboard → **Settings** → **General** → **Build & Development Settings**:

**Build Command:**
```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

**Install Command:**
```bash
npm install
```

#### **1.7 Redeploy**

Dashboard → **Deployments** → **...** → **Redeploy**

✅ Vercel installerà, genererà Prisma, e applicherà le migration!

---

### **OPZIONE B: Railway (Backend + DB Tutto Insieme)**

#### **1. Deploy su Railway**

1. Vai su [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub**
3. Seleziona `aiorchestratordemoo`
4. **Root Directory**: `backend`

#### **2. Aggiungi PostgreSQL**

Nel progetto Railway:
- **Add Service** → **PostgreSQL**
- Railway collega automaticamente!

#### **3. Aggiungi Variabili**

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
EMAIL_USER=aiorchestratoor@gmail.com
EMAIL_PASSWORD=your_app_password
GROQ_API_KEY=gsk_your_key
# ... altre variabili
```

#### **4. Deploy Automatico**

Railway fa tutto automaticamente! ✅

---

## 🎨 **STEP 2: Deploy Frontend**

### **2.1 Deploy Frontend su Vercel**

1. **New Project** → Import `aiorchestratordemoo`
2. **Project Name**: `aiorchestratordemoo`
3. **Root Directory**: `frontend`
4. **Framework**: **Vite**

### **2.2 Aggiungi Variabili**

```env
VITE_API_URL=https://aiorchestratordemoo-api.vercel.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_PAYPAL_CLIENT_ID=your_id
```

### **2.3 Deploy!**

Vercel builderà e deployerà automaticamente.

---

## 🔗 **STEP 3: Collega Backend e Frontend**

### **3.1 Aggiorna FRONTEND_URL nel Backend**

Nel backend Vercel → **Environment Variables**:

```env
FRONTEND_URL=https://aiorchestratordemoo.vercel.app
```

### **3.2 Redeploy Backend**

Dashboard backend → **Deployments** → **Redeploy**

---

## 📧 **STEP 4: Fix Email Cron (Già Fatto!)**

✅ **Ho già fixato il cron service!**

Ora invia email **SOLO a utenti reali**, escludendo:
- ❌ Tutti gli account `@test.com`
- ❌ Account affiliate/referral di test
- ✅ Solo email legittime

**Funziona per:**
- ✅ Email verifica registrazione
- ✅ Email benvenuto
- ✅ Follow-up day 3, 7 trial
- ✅ Email pagamenti
- ✅ Email affiliate payouts

---

## 🧪 **STEP 5: Test in Produzione**

### **Test Backend:**

```powershell
# Health check
curl https://aiorchestratordemoo-api.vercel.app/health

# Test agent API
curl https://aiorchestratordemoo-api.vercel.app/api/agents/queue
```

### **Test Frontend:**

Apri: `https://aiorchestratordemoo.vercel.app`

- [ ] Registrazione funziona
- [ ] Email verifica arriva
- [ ] Login funziona
- [ ] Dashboard carica
- [ ] Crea chatbot
- [ ] Test live agent handoff

---

## 🔄 **MIGRATION PRISMA (Importante!)**

### **Creare Migration Locale:**

Prima di deployare, crea le migration:

```bash
cd backend

# Genera migration
npx prisma migrate dev --name add_live_agent_and_orders

# Questo crea cartella prisma/migrations/
# con tutti gli SQL necessari
```

### **Vercel Applica Automaticamente:**

Quando fai deploy, Vercel esegue:
```bash
npx prisma migrate deploy
```

E applica tutte le migration in `prisma/migrations/`!

---

## 📊 **CRON SERVICE - COME FUNZIONA:**

### **✅ Email Legittime (Inviate):**

1. **Registrazione** → Email verifica (immediata)
2. **Email verificata** → Welcome email (immediata)
3. **Day 3 trial** → Follow-up email (dopo 3 giorni)
4. **Day 7 trial** → Follow-up email (dopo 7 giorni)
5. **Pagamento ricevuto** → Conferma email (immediata)
6. **Affiliate payout** → Email payout (quando richiesto)

### **❌ Account Test (Esclusi):**

- `affiliate1@test.com` → ❌ NO email
- `referral1@test.com` → ❌ NO email
- Tutti `*@test.com` → ❌ NO email

### **Controllo:**

Il cron service filtra:
```javascript
email: {
  not: {
    endsWith: '@test.com'
  }
}
```

---

## 🔧 **TROUBLESHOOTING:**

### **Errore: Prisma Client**

```bash
# Nel backend
npx prisma generate
```

### **Errore: Migration Failed**

```bash
# Reset database (⚠️ SOLO IN DEV)
npx prisma migrate reset

# Poi ricrea migration
npx prisma migrate dev
```

### **Errore: Connection Timeout**

Verifica che:
- `DATABASE_URL` sia configurato correttamente
- Database Postgres sia online
- Non hai firewall che blocca

---

## ✅ **CHECKLIST DEPLOY FINALE:**

### **Backend:**
- [ ] Codice pushato su GitHub
- [ ] Deploy Vercel/Railway
- [ ] Database Postgres creato e collegato
- [ ] `DATABASE_URL` configurato
- [ ] Tutte le variabili d'ambiente aggiunte
- [ ] Build command con `prisma migrate deploy`
- [ ] Migration applicate
- [ ] Health check funziona

### **Frontend:**
- [ ] Deploy Vercel
- [ ] `VITE_API_URL` punta al backend
- [ ] Variabili Stripe/PayPal configurate
- [ ] App carica correttamente

### **Email:**
- [ ] Gmail App Password configurato
- [ ] Test email di registrazione
- [ ] Verifica account test esclusi
- [ ] Cron service funzionante

---

## 🎯 **COMANDI FINALI:**

### **Genera Migration (Locale):**

```bash
cd backend

# Se non hai migrations/
npx prisma migrate dev --name init

# Poi aggiungi live agent
npx prisma migrate dev --name add_live_agent_and_orders
```

### **Push su GitHub:**

```bash
git add .
git commit -m "🚀 Production ready: DB + Live Agent + Order Tracking"
git push
```

### **Vercel Auto-Deploy:**

Vercel detecta il push → Build → Migrate → Deploy automaticamente!

---

## 🎉 **RISULTATO FINALE:**

```
✅ Backend: https://aiorchestratordemoo-api.vercel.app
✅ Frontend: https://aiorchestratordemoo.vercel.app
✅ Database: Vercel Postgres (256MB)
✅ Email: Solo utenti reali
✅ Live Agent: Multi-tenant
✅ Order Tracking: Funzionante
```

---

**🚀 Tutto configurato! Pronto per il deploy in produzione!**

