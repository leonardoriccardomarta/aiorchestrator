# 👥 GUIDA MERCHANT - Gestione Team Support

## 🎯 **Come Funziona per i Merchant**

Quando un **merchant** (proprietario e-commerce) acquista un abbonamento AI Orchestrator, può:

1. ✅ **Creare il suo team di agenti support**
2. ✅ **Gestire solo le sue conversazioni** (isolamento multi-tenant)
3. ✅ **Vedere solo i suoi ordini**
4. ✅ **Assegnare chatbot solo ai suoi agenti**

---

## 📋 **ARCHITETTURA MULTI-TENANT:**

```
Merchant A (Tenant A)
├── User: John (Admin)
├── User: Sarah (Agent 1)  → Risponde ai customer di Merchant A
├── User: Mike (Agent 2)   → Risponde ai customer di Merchant A
├── Chatbot: "Shop Helper"
├── Conversazioni: Solo customer di Merchant A
└── Ordini: Solo ordini di Merchant A

Merchant B (Tenant B)
├── User: Maria (Admin)
├── User: Laura (Agent 1)  → Risponde ai customer di Merchant B
├── Chatbot: "Support Bot"
├── Conversazioni: Solo customer di Merchant B
└── Ordini: Solo ordini di Merchant B
```

**ISOLAMENTO COMPLETO**: Gli agenti di Merchant A NON vedono MAI le conversazioni di Merchant B!

---

## 🚀 **WORKFLOW MERCHANT:**

### **Step 1: Merchant acquista abbonamento**

Merchant registra account → Sceglie piano (Starter/Pro/Enterprise) → Paga

### **Step 2: Merchant crea chatbot**

Dashboard → Chatbots → Create New → "Shop Assistant"

### **Step 3: Merchant aggiunge agenti al suo team**

**Opzione A: Aggiunge membri del team esistenti**
1. Dashboard → Team → Invite Member
2. Inserisce email: `support@merchant-shop.com`
3. Membro riceve invito → Si registra → Diventa Agent

**Opzione B: Si auto-assegna come agent**
1. Dashboard → Settings → Enable Agent Mode
2. Ora può rispondere alle chat oltre a gestire il chatbot

### **Step 4: Agent imposta status**

Agent login → Agent Dashboard → Status → "Online" ✅

### **Step 5: Customer inizia chat**

Customer su merchant-shop.com → Chatbot widget → "Talk to agent"

### **Step 6: Agent riceve conversazione**

Agent Dashboard → Queue → New conversation → Click "Accept"

### **Step 7: Agent risponde**

Chat window → Type message → Send → Customer riceve risposta

### **Step 8: Agent risolve**

Conversation resolved → Customer rates → Stats aggiornate

---

## 💼 **RUOLI NEL TEAM:**

### **Admin (Merchant Owner):**
- ✅ Gestisce abbonamento
- ✅ Crea/elimina chatbot
- ✅ Aggiunge/rimuove membri team
- ✅ Vede analytics completo
- ✅ (Opzionale) Può anche essere Agent

### **Agent (Support Team Member):**
- ✅ Risponde alle conversazioni
- ✅ Vede coda attesa
- ✅ Gestisce status (online/offline/busy)
- ✅ Vede solo conversazioni del suo merchant
- ❌ NON può creare chatbot
- ❌ NON può gestire abbonamento

---

## 🔒 **SICUREZZA MULTI-TENANT:**

### **Database Level:**

Ogni query filtra automaticamente per `tenantId`:

```javascript
// ✅ CORRETTO - Con tenantId
const agents = await prisma.agent.findMany({
  where: {
    tenantId: user.tenantId  // Solo agenti del merchant
  }
});

// ❌ SBAGLIATO - Senza tenantId (vedrebbe TUTTI gli agenti)
const agents = await prisma.agent.findMany();
```

### **API Level:**

Ogni endpoint verifica:
1. User è autenticato
2. User appartiene al tenant corretto
3. Risorsa appartiene al tenant dell'user

```javascript
// Esempio: Get agent conversations
router.get('/conversations', authenticate, async (req, res) => {
  const agent = await prisma.agent.findUnique({
    where: { userId: req.user.id }
  });
  
  // Agent può vedere SOLO conversazioni del suo tenant
  const conversations = await prisma.conversation.findMany({
    where: {
      chatbot: {
        user: {
          tenantId: agent.tenantId  // Filtro multi-tenant
        }
      }
    }
  });
});
```

---

## 📊 **LIMITI PER PIANO:**

### **Starter ($29/mo):**
- 1 chatbot
- **Team:** 1 agent (solo l'owner)
- 5,000 messaggi/mese

### **Professional ($99/mo):**
- 2 chatbot
- **Team:** 3 agenti (owner + 2 support)
- 25,000 messaggi/mese

### **Enterprise ($299/mo):**
- 3 chatbot
- **Team:** 10 agenti (scalabile)
- 100,000 messaggi/mese

---

## 🎨 **UI PER MERCHANT:**

### **Dashboard Merchant** (Admin)

```
┌─────────────────────────────────────┐
│  AI Orchestrator - Merchant Dashboard │
├─────────────────────────────────────┤
│                                     │
│  📊 Overview                        │
│  ├─ Active Chatbots: 2              │
│  ├─ Team Members: 3                 │
│  ├─ Messages This Month: 1,234/25K  │
│  └─ Customer Satisfaction: 4.8⭐    │
│                                     │
│  👥 Team Management                 │
│  ├─ John (Admin) - Online           │
│  ├─ Sarah (Agent) - Online          │
│  ├─ Mike (Agent) - Offline          │
│  └─ [+ Invite Team Member]          │
│                                     │
│  💬 Live Conversations              │
│  ├─ Sarah: 2 active chats           │
│  ├─ Mike: 0 active chats            │
│  └─ Queue: 1 waiting                │
│                                     │
└─────────────────────────────────────┘
```

### **Dashboard Agent** (Support Team)

```
┌─────────────────────────────────────┐
│  Agent Dashboard - Sarah            │
├─────────────────────────────────────┤
│                                     │
│  Status: [● Online ▼]               │
│                                     │
│  📊 My Stats Today                  │
│  ├─ Active Chats: 2/3               │
│  ├─ Resolved: 15                    │
│  ├─ Avg Rating: 4.9⭐              │
│  └─ Avg Response: 45s               │
│                                     │
│  ⏳ Queue (1)                       │
│  ├─ Customer: John Doe              │
│  │   Priority: Normal               │
│  │   [Accept]                       │
│                                     │
│  💬 Active Chats (2)                │
│  ├─ Jane Smith - 2m ago             │
│  │   "Need help with refund"        │
│  ├─ Bob Wilson - 5m ago             │
│  │   "Order tracking"               │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔧 **SETUP PER MERCHANT:**

### **1. Dopo registrazione:**

```javascript
// Merchant completa onboarding
POST /api/onboarding/complete
{
  "storeName": "My Shop",
  "storeUrl": "myshop.com",
  "platform": "shopify"
}
```

### **2. Merchant crea chatbot:**

```javascript
POST /api/chatbots
{
  "name": "Shop Assistant",
  "language": "auto",
  "welcomeMessage": "Hi! How can I help you today?"
}
```

### **3. Merchant invita agent:**

```javascript
POST /api/team/invite
{
  "email": "support@myshop.com",
  "role": "agent",
  "displayName": "Sarah Support"
}
```

### **4. Agent accetta e abilita profilo:**

```javascript
// Agent login e attiva profilo
POST /api/agents/profile
{
  "displayName": "Sarah",
  "maxConcurrent": 3,
  "skills": ["refunds", "shipping", "products"]
}

// Agent va online
PUT /api/agents/status
{
  "status": "online"
}
```

### **5. Sistema pronto!**

Ora quando un customer del merchant chiede agente → Va solo a Sarah (o altri agenti del merchant)

---

## 💡 **BENEFICI MULTI-TENANT:**

### **Per il Merchant:**
- ✅ Team isolato (privacy)
- ✅ Solo suoi customer
- ✅ Solo suoi ordini
- ✅ Stats personalizzate
- ✅ Branding proprio

### **Per l'Agent:**
- ✅ Vede solo chat rilevanti
- ✅ Non confusione con altri merchant
- ✅ Stats personali accurate
- ✅ Focus sul proprio lavoro

### **Per Te (Piattaforma):**
- ✅ Scaling infinito (ogni merchant isolato)
- ✅ Sicurezza garantita
- ✅ Compliance GDPR (data isolation)
- ✅ Upselling facile (più agenti = piano superiore)

---

## 🚨 **EDGE CASES:**

### **Cosa succede se merchant non ha agenti online?**

```javascript
// Conversazione va in coda "waiting"
await prisma.conversation.update({
  status: 'waiting',
  priority: 'normal'
});

// Customer vede:
"All our agents are currently busy. 
You've been added to the queue and will 
be connected to the next available agent."

// Quando agent va online → Auto-assegnato
```

### **Cosa succede se merchant supera limite agenti?**

```javascript
// Check al momento di invito
if (currentAgents >= planLimits[plan].maxAgents) {
  return {
    error: "You've reached your agent limit. Upgrade to add more team members."
  };
}
```

### **Cosa succede se merchant downgrade piano?**

```javascript
// Se aveva 5 agenti e passa a Professional (max 3)
// Opzioni:
// 1. Blocca downgrade fino a rimozione agenti
// 2. Disabilita agenti in eccesso (oldest first)
// 3. Permetti grace period per rimuovere manualmente
```

---

## ✅ **IMPLEMENTAZIONE COMPLETATA:**

- [x] Database multi-tenant (tenantId su Agent)
- [x] Agent service isolamento
- [x] API filtrate per tenant
- [x] Handoff solo agenti stesso tenant
- [x] Order tracking isolato
- [x] Dashboard separati (Admin vs Agent)

---

**🎉 Sistema completamente multi-tenant e production-ready!**

*Ogni merchant ha il suo team isolato - Zero cross-contamination!*

