# 💳 Payment Flows & Billing Scenarios

## 📊 Overview
Tutti i pagamenti passano attraverso **Stripe** con 3 endpoint principali e 4 webhook events.

---

## 🔵 Casi di Pagamento

### 1️⃣ **Nuova Iscrizione - Starter Plan (con Trial)**
**Endpoint:** `POST /api/payments/create-subscription`

**Flusso:**
1. Utente registrato con piano Starter
2. Inserisce card details nel modal di pagamento
3. Crea Stripe customer (se non esiste)
4. Attacca payment method al customer
5. Crea subscription Stripe con **7 giorni di trial gratuito**
6. **Addebito immediato:** $0
7. **Addebito dopo 7 giorni:** $29 (automatico da Stripe)

**User State Updates:**
- `isPaid: true`
- `isTrialActive: true`
- `trialEndDate: +7 giorni`
- `planId: 'starter'`

**Webhook Events:**
- `checkout.session.completed` → Activa subscription
- `invoice.payment_succeeded` (dopo 7 giorni) → Conferma pagamento trial end

**Reset Data:** Analytics, conversations, chatbots, connections vengono resettati

---

### 2️⃣ **Nuova Iscrizione - Professional/Business (Skip Trial)**
**Endpoint:** `POST /api/payments/skip-trial`

**Flusso:**
1. Utente registrato sceglie Professional o Business
2. Clicca "Skip Trial & Start Now"
3. Inserisce card details
4. Crea Stripe customer + subscription
5. **Addebito immediato:** $99 (Professional) o $299 (Business)
6. Nessun trial period

**User State Updates:**
- `isPaid: true`
- `isTrialActive: false`
- `trialEndDate: null`
- `planId: 'professional' | 'business'`

**Webhook Events:**
- `payment_intent.succeeded` → Conferma pagamento immediato
- `customer.subscription.created` → Attiva subscription

**Valid Plans:** Solo Professional e Business

---

### 3️⃣ **Checkout Session (Landing/Frontend)**
**Endpoint:** `POST /api/payments/create-checkout-session`

**Flusso:**
1. Utente clicca "Get Started" o "Subscribe" da landing/app
2. Crea Stripe Checkout Session con URL dedicato
3. Utente completa pagamento su pagina Stripe
4. Redirect a success_url dopo pagamento

**Trial Logic:**
- Se `user.isTrialActive === true` → `trial_period_days: 0` (niente trial)
- Se `user.isTrialActive === false` → `trial_period_days: 7` (trial incluso)

**Webhook Events:**
- `checkout.session.completed` → Crea subscription e aggiorna user plan

---

### 4️⃣ **Upgrade Piano (Active Subscription)**
**Endpoint:** `POST /api/payments/change-plan`

**Restrizioni:**
- ❌ NON disponibile durante trial (`user.isTrialActive === true`)
- ✅ Solo se subscription Stripe già attiva
- ✅ Blocco se piano uguale

**Esempi Upgrade:**
- **Starter → Professional:** $99 - $29 = **+$70 charged**
- **Starter → Business:** $299 - $29 = **+$270 charged**
- **Professional → Business:** $299 - $99 = **+$200 charged**

**Flusso:**
1. Utente già pagante vuole upgrade
2. Verifica subscription attiva
3. Calcola proration (solo per upgrade)
4. Aggiorna subscription Stripe con nuovo prezzo
5. **Addebito immediato:** Differenza proporzionale per i giorni rimanenti
6. Nuovo billing cycle parte immediatamente

**Proration:**
```javascript
proration_behavior: priceDifference > 0 ? 'create_prorations' : 'none'
billing_cycle_anchor: 'now' // Reset billing cycle
```

**User State Updates:**
- `planId: newPlanId`
- Resetta analytics, conversations, chatbots data

**Webhook Events:**
- `customer.subscription.updated` → Conferma upgrade
- `invoice.payment_succeeded` → Proration charged

---

### 5️⃣ **Downgrade Piano (Active Subscription)**
**Endpoint:** `POST /api/payments/change-plan`

**Esempi Downgrade:**
- **Professional → Starter:** $99 → $29 (**NO addebito**, downgrade immediato)
- **Business → Professional:** $299 → $99 (**NO addebito**, downgrade immediato)
- **Business → Starter:** $299 → $29 (**NO addebito**, downgrade immediato)

**Flusso:**
1. Utente già pagante vuole downgrade
2. Verifica subscription attiva
3. **NO proration** (`create_prorations: false`)
4. Aggiorna subscription Stripe
5. **Addebito:** $0 (featuree immediatamente)
6. Prossimo billing: nuovo prezzo

**User State Updates:**
- `planId: newPlanId`
- Resetta analytics, conversations, chatbots data

**Webhook Events:**
- `customer.subscription.updated` → Conferma downgrade

**Note:** Stripe NON rimborsa i giorni già pagati con piano superiore. Feature disponibili immediatamente al downgrade.

---

### 6️⃣ **Renewal Automatico (Monthly)**
**Webhook:** `invoice.payment_succeeded` (automatico da Stripe)

**Flusso:**
1. Stripe genera invoice automatico ogni 30 giorni
2. Tenta addebito su payment method salvata
3. Se successo → webhook `invoice.payment_succeeded`
4. Backend aggiorna `isPaid: true`

**Addebiti:**
- Starter: **$29/mese**
- Professional: **$99/mese**
- Business: **$299/mese**

**Periodo:** Ogni 30 giorni dal subscription start date

**Retry Logic:** Stripe tenta 3 volte in caso di errore (configurabile su Stripe Dashboard)

---

### 7️⃣ **Cancel Subscription**
**Endpoint:** `POST /api/payments/cancel-subscription`

**Flusso:**
1. Utente clicca "Cancel Subscription"
2. Stripe imposta `cancel_at_period_end: true`
3. Subscription rimane attiva fino a fine periodo
4. **NO addebito per periodo cancellato**
5. Dopo `current_period_end` → subscription automaticamente deleted

**User State (durante periodo di cancellazione):**
- Subscription attiva fino a fine billing
- Accesso completo alle feature

**User State (dopo `current_period_end`):**
- `planId: null`
- `isPaid: false`
- `isActive: false` (accesso bloccato)
- `isTrialActive: false`

**Webhook Events:**
- `customer.subscription.deleted` → Blocca user

---

### 8️⃣ **Reactivate Subscription**
**Endpoint:** `POST /api/payments/reactivate-subscription`

**Flusso:**
1. Utente aveva cancellato (ma subscription ancora in periodo)
2. Clicca "Reactivate"
3. Stripe imposta `cancel_at_period_end: false`
4. Subscription continua normale

**Addebito:** Nessuno, subscription già attiva

**Webhook Events:**
- `customer.subscription.updated` → Conferma reactivation

---

### 9️⃣ **Payment Failure (Automatic Retry)**
**Webhook:** `invoice.payment_failed`

**Flusso:**
1. Stripe tenta addebito automatico
2. Payment method fallisce (card scaduta, fondi insufficienti, etc.)
3. Webhook `invoice.payment_failed` inviato
4. Stripe riprova automaticamente (configurabile)

**User State:**
- Subscription diventa `past_due`
- `isPaid: false` potenzialmente impostato

**Retry Schedule:**
- Giorno 1, 4, 7 (configurabile su Stripe)
- Dopo 3 fallimenti → `customer.subscription.deleted` automatico

**Webhook Events:**
- `invoice.payment_failed` → Prima notifica
- `invoice.payment_action_required` → Se richiede re-auth (SCA)
- `customer.subscription.deleted` → Dopo fallimenti multipli

---

## 🔔 Webhook Events Summary

| Event | Quando | Azione Backend |
|-------|--------|---------------|
| `checkout.session.completed` | Checkout completato | Crea subscription, aggiorna user plan, imposta trial |
| `invoice.payment_succeeded` | Renewal automatico o primo pagamento | Conferma `isPaid: true` |
| `invoice.payment_failed` | Payment method fallisce | Log errore, prepara retry |
| `customer.subscription.updated` | Upgrade, downgrade, reactivation | Aggiorna `planId` e `isPaid` |
| `customer.subscription.deleted` | Cancellazione effettiva | Blocca accesso, set `isPaid: false` |

---

## 💰 Price Summary

| Piano | Prezzo Mensile | Trial Days | Skip Trial Available |
|-------|---------------|------------|---------------------|
| Starter | $29 | 7 | ❌ No |
| Professional | $99 | 7 | ✅ Yes |
| Business | $299 | 7 | ✅ Yes |

---

## 🧪 Edge Cases

### Edge Case 1: User già in Trial registra nuovo Piano
- Se `isTrialActive: true` → No trial period aggiunto
- Addebito immediato secondo piano scelto

### Edge Case 2: Upgrade durante Trial
- Bloccato dal backend: `Cannot change plan during trial`
- Utente deve aspettare fine trial o skip trial

### Edge Case 3: Multiple Subscriptions dello stesso Customer
- Backend gestisce 1 subscription attiva per customer
- Stripe può avere multiple subscriptions, backend usa la prima attiva

### Edge Case 4: Downgrade immediato
- NO refund per giorni già pagati
- Feature disponibili immediatamente
- Prossimo billing con nuovo prezzo

### Edge Case 5: Payment Method rimossa
- Stripe tenta renewal con default payment method
- Se non disponibile → `invoice.payment_failed`
- Customer può aggiungere nuova card su Stripe Dashboard

---

## 📅 Billing Cycle Management

**Anchor Point:** Il billing cycle parte dal momento della subscription creation

**Examples:**
- Subscription creata il 1° Gennaio → Renewal ogni 1° del mese
- Upgrade il 15 Gennaio → Prossimo billing 15 Febbraio (nuovo anchor)
- Downgrade → Billing anchor rimane, prezzo cambia

**Proration Calculation:**
```
Prorated Amount = (New Price - Old Price) × (Days Remaining / Days in Billing Period)
```

---

## 🔒 Security & Validation

**Authentication:** Tutti gli endpoint richiedono `authenticateToken` o `authenticatePayment`

**Validation:**
- Plan ID deve essere valido (`starter`, `professional`, `business`)
- User deve avere subscription attiva per change-plan
- Checkout session include metadata `userId` e `planId`

**Error Handling:**
- Failed payment method → Retry automatico Stripe
- Subscription not found → 400 Bad Request
- Invalid plan ID → 400 Bad Request
- Already on plan → 400 Bad Request

---

## 📊 Statistics Reset

**When:** Nuova subscription, upgrade, downgrade

**What's Reset:**
- `Analytics` table → Deleted
- `Conversation` table → Deleted
- `Chatbot` stats → `messagesCount: 0`, `lastActive: now()`
- `Connection` table → Deleted (solo per nuova subscription)

**Not Reset:**
- Chatbot configurations
- User profile
- Settings preferences

---

## ✅ Testing Checklist

- [ ] Nuovo utente Starter con trial
- [ ] Nuovo utente Professional skip trial
- [ ] Upgrade Professional → Business
- [ ] Downgrade Business → Starter
- [ ] Renewal automatico dopo 30 giorni
- [ ] Cancel subscription (fine periodo)
- [ ] Reactivate cancelled subscription
- [ ] Payment failure + retry
- [ ] Multiple upgrade/downgrade cycles
- [ ] Webhook event handling per tutti i casi
