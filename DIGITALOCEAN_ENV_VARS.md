# 🔐 VARIABILI D'AMBIENTE PER DIGITAL OCEAN

## 📋 CONFIGURAZIONE BACKEND

Quando crei l'App su Digital Ocean, aggiungi queste variabili d'ambiente:

### ✅ OBBLIGATORIE

```env
# Database PostgreSQL (già creato - inserisci la tua connection string)
DATABASE_URL=postgresql://doadmin:YOUR_PASSWORD@aiorchestratoor-do-user-27495966-0.m.db.ondigitalocean.com:25060/defaultdb?sslmode=require

# JWT Secret (CAMBIA QUESTO!)
JWT_SECRET=cambia-con-stringa-random-molto-lunga-e-sicura-produzione

# Server
PORT=8080
NODE_ENV=production

# CORS - Frontend URL (metti l'URL di Vercel quando ce l'hai)
FRONTEND_URL=https://aiorchestratordemoo.vercel.app
```

### ✅ EMAIL (per registrazioni e notifiche)

```env
EMAIL_USER=aiorchestratoor@gmail.com
EMAIL_PASSWORD=la_tua_password_app_gmail
ADMIN_EMAIL=aiorchestratoor@gmail.com
```

**Come ottenere EMAIL_PASSWORD:**
1. Vai su Google Account → Sicurezza
2. Abilita "Verifica in due passaggi"
3. Vai su "Password per le app"
4. Genera password per "Mail"
5. Usa quella password qui

### ✅ AI SERVICES (almeno uno)

```env
# Groq (consigliato - veloce e gratis)
GROQ_API_KEY=gsk_la_tua_chiave_groq

# OpenAI (opzionale)
OPENAI_API_KEY=sk_la_tua_chiave_openai
```

**Come ottenere GROQ_API_KEY:**
1. Vai su [console.groq.com](https://console.groq.com)
2. Sign up / Login
3. API Keys → Create API Key
4. Copia la chiave

### 🔷 OPZIONALI (Payment Gateways)

#### Stripe (per carte di credito)
```env
STRIPE_SECRET_KEY=sk_test_tua_chiave
STRIPE_PUBLISHABLE_KEY=pk_test_tua_chiave
STRIPE_WEBHOOK_SECRET=whsec_tuo_secret
```

#### PayPal
```env
PAYPAL_CLIENT_ID=tuo_paypal_client_id
PAYPAL_CLIENT_SECRET=tuo_paypal_secret
PAYPAL_MODE=sandbox
```

### 🔷 OPZIONALI (Performance)

#### Redis (caching - OPZIONALE)
```env
# Lascia vuoto se non hai Redis configurato
# REDIS_URL=redis://username:password@redis-host:6379
```

**NON SERVE Redis per iniziare!** Il sistema funziona senza.

**Se vuoi Redis in futuro:**
- Digital Ocean Managed Redis: $15/mese
- Upstash Redis: Piano gratis disponibile
- Redis Labs: Piano gratis disponibile

#### Cron Jobs
```env
# false = abilita email follow-up automatiche
# true = disabilita cron (per testing)
DISABLE_CRON=false
```

---

## 📋 RIEPILOGO CONFIGURAZIONE MINIMA

### **Per far funzionare il sistema, BASTANO:**

```env
DATABASE_URL=postgresql://doadmin:YOUR_PASSWORD@aiorchestratoor-do-user-27495966-0.m.db.ondigitalocean.com:25060/defaultdb?sslmode=require
JWT_SECRET=cambia-questo-secret-super-sicuro
PORT=8080
NODE_ENV=production
FRONTEND_URL=https://tuofrontend.vercel.app
GROQ_API_KEY=gsk_la_tua_chiave_groq
EMAIL_USER=aiorchestratoor@gmail.com
EMAIL_PASSWORD=tua_password_app_gmail
ADMIN_EMAIL=aiorchestratoor@gmail.com
```

### **Puoi aggiungere dopo:**
- Stripe/PayPal (quando vuoi accettare pagamenti)
- Redis (quando hai traffico alto)
- OpenAI (se preferisci GPT-4 a Llama)

---

## 🎯 COME AGGIUNGERE LE VARIABILI SU DIGITAL OCEAN

### **Durante la creazione dell'App:**

1. **Apps** → **Create App** → **GitHub** → Repository
2. Configura build e run commands
3. Nella sezione **Environment Variables**, click **Edit**
4. Clicca **Add Variable** per ogni variabile
5. **Key**: nome variabile (es. `DATABASE_URL`)
6. **Value**: valore (es. `postgresql://...`)
7. **Encrypt**: ✅ (consigliato per secrets)

### **Dopo la creazione:**

1. **Dashboard** → **Apps** → `aiorchestratordemoo-api`
2. **Settings** → **Environment Variables** → **Edit**
3. Aggiungi/modifica variabili
4. **Save**
5. App farà **Redeploy automatico**

---

## 🔒 SICUREZZA

### ✅ CAMBIA ASSOLUTAMENTE:
- `JWT_SECRET` - deve essere lungo e random
- Password email (usa password per app Gmail)
- In produzione usa `PAYPAL_MODE=live` (quando pronto)
- In produzione usa Stripe live keys `sk_live_...`

### ✅ NON COMMITTARE:
- File `.env` è già in `.gitignore`
- Non pusare secrets su GitHub
- Usa sempre le variabili d'ambiente

---

## 🆘 COSA RISPONDERE ALLE TUE DOMANDE

### **CORS Origin:**
```env
FRONTEND_URL=https://tuofrontend.vercel.app
```
Quando fai deploy del frontend su Vercel, riceverai un URL tipo:
- `https://aiorchestratordemoo.vercel.app`

Usa QUELLO come `FRONTEND_URL`.

Il backend ora è configurato per accettare richieste da:
- localhost (per sviluppo locale)
- `FRONTEND_URL` (per produzione)

### **Redis URL:**
```env
# LASCIALO VUOTO o NON METTERLO!
```

Redis è **opzionale** e serve solo per:
- Caching avanzato
- Session management
- Rate limiting distribuito

**Per ora NON serve.** Il sistema funziona perfettamente senza!

---

## 📝 CHECKLIST PRE-DEPLOY

Prima di fare deploy, verifica di avere:

- [ ] `DATABASE_URL` (✅ ce l'hai)
- [ ] `JWT_SECRET` (genera stringa random lunga)
- [ ] `GROQ_API_KEY` (registrati su Groq)
- [ ] `EMAIL_PASSWORD` (password app Gmail)
- [ ] `FRONTEND_URL` (deploy frontend prima o usa placeholder)

---

## 🚀 PROSSIMO STEP

1. **Configura le variabili su Digital Ocean**
2. **Deploy backend** → ricevi URL tipo `https://xxx.ondigitalocean.app`
3. **Deploy frontend su Vercel** con quell'URL del backend
4. **Torna su Digital Ocean** e aggiorna `FRONTEND_URL` con URL Vercel
5. **Redeploy backend**
6. **✅ Sistema funzionante!**

