# 🔐 Flusso OAuth Completo - AI Orchestrator + Shopify

## 📋 Overview

Questo documento spiega l'intero flusso OAuth e come il widget ottiene l'accessToken per usare le funzionalità avanzate Shopify.

---

## 🔄 Flusso Completo (Step by Step)

### **1️⃣ UTENTE CONNETTE SHOPIFY (Frontend)**

**Dove:** `frontend/src/pages/Connections.tsx`

L'utente clicca su "Connect Shopify" → Frontend chiama:

```javascript
POST /api/shopify/oauth/install
Body: { shop: "my-store.myshopify.com" }
```

**Backend risponde con:**
```json
{
  "installUrl": "https://my-store.myshopify.com/admin/oauth/authorize?client_id=...&scope=...&redirect_uri=..."
}
```

---

### **2️⃣ UTENTE AUTORIZZA SU SHOPIFY**

Il browser reindirizza l'utente a Shopify, dove:
- Shopify mostra i permessi richiesti
- L'utente clicca "Installa" / "Autorizza"

**Shopify reindirizza a:**
```
https://aiorchestrator-vtihz.ondigitalocean.app/api/shopify/oauth/callback?code=xxx&shop=my-store.myshopify.com
```

---

### **3️⃣ BACKEND RICEVE CALLBACK E SALVA ACCESSTOKEN**

**Dove:** `backend/complete-api-server.js` → `/api/shopify/oauth/callback`

Il backend:

1. **Verifica HMAC** (sicurezza Shopify)
2. **Scambia `code` per `accessToken`:**
   ```javascript
   const accessToken = await shopifyOAuthService.exchangeCodeForToken(shop, code);
   ```

3. **Testa la connessione** chiamando Shopify API
4. **Legge dati dello store** (products, orders, customers)
5. **Salva nel database:**
   ```javascript
   const connection = await realDataService.addConnection(userId, {
     type: 'shopify',
     name: shopName,
     url: shop,
     apiKey: accessToken,  // ← QUI VIENE SALVATO L'ACCESSTOKEN
     shopId: shop,
     status: 'connected',
     productsCount: 150,
     ordersCount: 50,
     customersCount: 30
   });
   ```

6. **Reindirizza al frontend:**
   ```
   https://www.aiorchestrator.dev/connections?success=true&platform=shopify&connectionId=xxx
   ```

---

### **4️⃣ UTENTE INSTALLA IL WIDGET SU SHOPIFY**

**Dove:** `frontend/src/pages/Connections.tsx` → Clicca "Install Widget"

Frontend chiama:
```javascript
POST /api/connections/install-widget
Body: {
  connectionId: "xxx",
  chatbotId: "yyy",
  widgetConfig: { theme: "teal", title: "AI Support", ... }
}
```

**Backend genera il codice widget:**
```javascript
const widgetCode = `
<script 
  src="https://www.aiorchestrator.dev/shopify-widget-shadowdom.js"
  data-ai-orchestrator-id="cmgr7ljok0005rop9rc2yd18f"
  data-api-key="https://aiorchestrator-vtihz.ondigitalocean.app"
  data-theme="teal"
  defer>
</script>
`;
```

L'utente copia questo codice e lo incolla in `theme.liquid` su Shopify.

---

### **5️⃣ WIDGET VIENE CARICATO SU SHOPIFY**

**Dove:** Cliente visita lo store Shopify → Widget si carica

1. **Browser scarica:** `shopify-widget-shadowdom.js`
2. **Widget legge config:**
   ```javascript
   const config = {
     chatbotId: "cmgr7ljok0005rop9rc2yd18f",
     apiKey: "https://aiorchestrator-vtihz.ondigitalocean.app",
     theme: "teal"
   };
   ```

3. **Widget chiama endpoint PUBBLICO per ottenere accessToken:**
   ```javascript
   const shopDomain = window.location.hostname; // es: "my-store.myshopify.com"
   
   const response = await fetch(
     `${apiKey}/api/public/shopify/connection?chatbotId=${chatbotId}&shop=${shopDomain}`
   );
   
   // Backend risponde:
   {
     "success": true,
     "data": {
       "hasConnection": true,
       "shop": "my-store.myshopify.com",
       "accessToken": "shpat_xxxxxxxxxxxxx",  // ← QUESTO È L'ACCESSTOKEN SALVATO NELL'OAUTH
       "storeName": "My Store"
     }
   }
   ```

4. **Widget salva l'accessToken in memoria** (non su localStorage per sicurezza)

---

### **6️⃣ CLIENTE INVIA UN MESSAGGIO**

**Dove:** Cliente scrive nel widget: "Show me your t-shirts"

Widget invia al backend:
```javascript
POST /api/chat
Body: {
  message: "Show me your t-shirts",
  context: {
    chatbotId: "cmgr7ljok0005rop9rc2yd18f",
    primaryLanguage: "en",
    connectionType: "shopify",
    shopifyConnection: {
      shop: "my-store.myshopify.com",
      accessToken: "shpat_xxxxxxxxxxxxx"  // ← ACCESSTOKEN OTTENUTO NEL PASSO 5
    },
    websiteUrl: "https://my-store.myshopify.com",
    customerEmail: null
  }
}
```

---

### **7️⃣ BACKEND FA TUTTA LA MAGIA**

**Dove:** `backend/complete-api-server.js` → `/api/chat`

Il backend:

1. **Riceve il messaggio** con `shopifyConnection.accessToken`

2. **Analizza con ML Service:**
   ```javascript
   const mlAnalysis = await mlService.analyzeMessage(message);
   // Risultato: { sentiment: "positive", intent: "product_search" }
   ```

3. **Usa Shopify Enhanced Service:**
   ```javascript
   if (intent === 'product_search') {
     const enhancements = await shopifyEnhancedService.getProductRecommendations(
       shop,
       accessToken,  // ← USA L'ACCESSTOKEN PER CHIAMARE SHOPIFY API
       message
     );
   }
   ```

4. **Shopify Enhanced Service chiama Shopify API:**
   ```javascript
   const response = await fetch(
     `https://${shop}/admin/api/2024-01/products.json`,
     {
       headers: {
         'X-Shopify-Access-Token': accessToken  // ← AUTENTICAZIONE CON SHOPIFY
       }
     }
   );
   ```

5. **Genera risposta AI con prodotti:**
   ```javascript
   const aiResponse = await aiService.generateResponse(message, {
     products: enhancements.recommendations
   });
   ```

6. **Risponde al widget:**
   ```json
   {
     "success": true,
     "response": "Sure! Here are some great t-shirts:",
     "shopifyEnhancements": {
       "recommendations": [
         {
           "title": "Classic White T-Shirt",
           "price": "29.99",
           "inStock": true,
           "url": "https://my-store.myshopify.com/products/white-tshirt"
         }
       ]
     },
     "mlAnalysis": {
       "sentiment": "positive",
       "confidence": 0.95
     }
   }
   ```

---

### **8️⃣ WIDGET VISUALIZZA LA RISPOSTA**

**Dove:** `frontend/public/shopify-widget-shadowdom.js`

Widget renderizza:
```javascript
// Risposta AI
let responseContent = data.response;

// Aggiunge product cards
if (data.shopifyEnhancements) {
  responseContent += renderShopifyEnhancements(data.shopifyEnhancements);
  // Mostra: 
  // 🛍️ Product Recommendations
  //   [Card con immagine, prezzo, link]
}

// Aggiunge sentiment
if (data.mlAnalysis) {
  responseContent += renderMLAnalysis(data.mlAnalysis);
  // Mostra: 😊 Sentiment: positive (95% confidence)
}
```

---

## 🔑 Punti Chiave

### **Sicurezza:**
- ✅ L'`accessToken` **NON** è mai esposto nel codice widget
- ✅ L'`accessToken` viene passato **solo** dal widget al backend nelle richieste API
- ✅ Il backend **valida** che il chatbot sia attivo prima di dare l'accessToken
- ✅ L'endpoint pubblico restituisce l'accessToken **solo** per il shop corretto

### **Privacy:**
- ✅ I dati Shopify **non** vengono mai esposti al client
- ✅ Tutto il processing avviene **server-side**
- ✅ Il widget riceve **solo** i dati necessari per visualizzare

### **Performance:**
- ✅ Il backend **cache** i prodotti per 5 minuti
- ✅ Le chiamate Shopify API sono **ottimizzate**
- ✅ ML Analysis avviene in **parallelo** alle chiamate API

---

## 📊 Diagramma Flusso

```
┌─────────────┐
│   UTENTE    │ Clicca "Connect Shopify"
└──────┬──────┘
       │
       v
┌─────────────────────────────────────────────┐
│  FRONTEND (Connections.tsx)                 │
│  POST /api/shopify/oauth/install            │
└──────┬──────────────────────────────────────┘
       │
       v
┌─────────────────────────────────────────────┐
│  BACKEND genera OAuth URL                   │
│  Reindirizza a Shopify                      │
└──────┬──────────────────────────────────────┘
       │
       v
┌─────────────────────────────────────────────┐
│  SHOPIFY - Utente autorizza                 │
│  Callback → /api/shopify/oauth/callback     │
└──────┬──────────────────────────────────────┘
       │
       v
┌─────────────────────────────────────────────┐
│  BACKEND                                     │
│  1. Scambia code → accessToken              │
│  2. Salva nel DB (connection.apiKey)        │
│  3. Reindirizza al frontend                 │
└──────┬──────────────────────────────────────┘
       │
       v
┌─────────────────────────────────────────────┐
│  UTENTE installa widget su Shopify          │
│  Copia codice in theme.liquid               │
└──────┬──────────────────────────────────────┘
       │
       v
┌─────────────────────────────────────────────┐
│  WIDGET CARICATO su Shopify                 │
│  GET /api/public/shopify/connection         │
│  Riceve: accessToken                        │
└──────┬──────────────────────────────────────┘
       │
       v
┌─────────────────────────────────────────────┐
│  CLIENTE invia messaggio                    │
│  POST /api/chat con shopifyConnection       │
└──────┬──────────────────────────────────────┘
       │
       v
┌─────────────────────────────────────────────┐
│  BACKEND                                     │
│  1. ML Analysis (sentiment, intent)         │
│  2. Shopify Enhanced Service                │
│  3. Chiama Shopify API con accessToken      │
│  4. AI genera risposta                      │
│  5. Ritorna risposta arricchita             │
└──────┬──────────────────────────────────────┘
       │
       v
┌─────────────────────────────────────────────┐
│  WIDGET visualizza risposta con:            │
│  - Testo AI                                 │
│  - Product recommendations                  │
│  - Order tracking                           │
│  - Sentiment analysis                       │
└─────────────────────────────────────────────┘
```

---

## ✅ Conclusione

**OAuth serve solo ad autorizzare il backend!**

- Il widget **non** fa OAuth direttamente
- Il widget **riceve** l'accessToken da un endpoint pubblico
- Il backend **fa tutto** il lavoro con Shopify API
- Il widget **visualizza** solo i risultati

**Questo è il design corretto per sicurezza e performance!** 🎯

