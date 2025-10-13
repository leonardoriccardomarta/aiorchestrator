# ⚡ QUICK DEPLOY - 15 Minuti

## 🎯 **DEPLOY RAPIDO IN 2 STEP (TUTTO SU VERCEL)**

### **💡 STRATEGIA DOMINIO:**
- **Backend**: Dominio Vercel gratuito (es: `xxx-api.vercel.app`) - **NON si vede**
- **Frontend**: Il tuo dominio custom (es: `aiorchestratordemoo.com`) - **Vedono gli utenti**

---

### **STEP 1: Deploy Backend (5 min)**

```powershell
# 1. Vai su https://vercel.com
# 2. Login con GitHub
# 3. New Project → Import aiorchestratordemoo
# 4. Project Name: aiorchestratordemoo-api
# 5. Root Directory: backend
# 6. Framework: Other
# 7. Add Variables (copia da backend/env.production.example)
# 8. Deploy!

# URL Backend: https://aiorchestratordemoo-api.vercel.app
```

**Variabili Minime Vercel (Backend):**

```env
DATABASE_URL=file:./prod.db
EMAIL_USER=aiorchestratoor@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
GROQ_API_KEY=gsk_your_key
JWT_SECRET=change-this-secret-key
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

---

### **STEP 2: Deploy Frontend (5 min)**

```powershell
# 1. Vai su https://vercel.com
# 2. Login con GitHub (stesso account)
# 3. New Project → Import aiorchestratordemoo
# 4. Project Name: aiorchestratordemoo (questo userà il dominio custom)
# 5. Root Directory: frontend
# 6. Framework: Vite
# 7. Add Variables (vedi sotto)
# 8. Deploy!

# URL Frontend: https://aiorchestratordemoo.vercel.app
# Poi collegherai il tuo dominio custom (es: aiorchestratordemoo.com)
```

**Variabili Minime Vercel (Frontend):**

```env
VITE_API_URL=https://aiorchestratordemoo-api.vercel.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (o pk_live_...)
VITE_PAYPAL_CLIENT_ID=your_paypal_id
```

---

### **STEP 3: Deploy Whitelist (5 min)**

```powershell
# 1. Vai su https://vercel.com
# 2. New Project → Import aiorchestratordemoo
# 3. Root Directory: whitelist-landing
# 4. Framework: Other
# 5. Build Command: (lascia vuoto)
# 6. Output Directory: . (punto)
# 7. Add Variables (vedi sotto)
# 8. Deploy!

# URL Whitelist: https://waitlist-aiorchestratordemoo.vercel.app
```

**Variabili Minime Vercel (Whitelist):**

```env
EMAIL_USER=aiorchestratoor@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
GROQ_API_KEY=gsk_your_key
NODE_ENV=production
```

---

## ✅ **VERIFICA DEPLOY**

### **Test Backend:**

```powershell
curl https://your-backend.railway.app/api/health
# Risposta: {"status":"ok"}
```

### **Test Frontend:**

Apri browser: `https://aiorchestratordemoo.vercel.app`

- [ ] Pagina carica
- [ ] Registrazione funziona
- [ ] Login funziona
- [ ] Dashboard carica

### **Test Whitelist:**

Apri browser: `https://waitlist-aiorchestratordemoo.vercel.app`

- [ ] Form waitlist visibile
- [ ] Demo chatbot funziona
- [ ] Email di conferma arriva

---

## 🔧 **FIX COMUNI**

### **Errore CORS:**

Nel backend Railway, aggiungi:

```env
FRONTEND_URL=https://aiorchestratordemoo.vercel.app
```

Poi **Redeploy** il backend.

### **Errore Database:**

Nel backend Railway:

```env
DATABASE_URL=file:./prod.db
```

Poi **Redeploy**.

### **Errore Build Frontend:**

Nel frontend Vercel, verifica:

- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

## 🎉 **DEPLOY COMPLETATO!**

### **URL Finali:**

- **App**: https://aiorchestratordemoo.vercel.app
- **API**: https://aiorchestratordemoo-production.up.railway.app
- **Waitlist**: https://waitlist-aiorchestratordemoo.vercel.app

### **Prossimi Step:**

1. **Testa tutte le funzionalità**
2. **Configura Stripe Webhooks**
3. **Aggiungi Custom Domain** (opzionale)
4. **Setup Analytics** (opzionale)

---

## 📞 **PROBLEMI?**

Vedi **DEPLOY_GUIDE.md** per troubleshooting completo.

---

**⚡ Deploy fatto in 15 minuti!**

