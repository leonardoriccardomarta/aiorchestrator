# 🗄️ DATABASE SETUP PER VERCEL - GUIDA COMPLETA

## ⚠️ **PROBLEMA: SQLite non funziona su Vercel**

Vercel Serverless **cancella** il file `.db` ad ogni deploy!

❌ **SQLite su Vercel:**
- File `.db` eliminato ad ogni deploy
- Perdi tutti i dati
- **NON usare per produzione**

✅ **SOLUZIONE: Database Esterno**

---

## 🎯 **OPZIONE 1: VERCEL POSTGRES (Consigliato)**

### **✅ Vantaggi:**
- **GRATUITO** (256MB, 60 ore compute/mese)
- Integrazione nativa con Vercel
- Setup automatico
- Backup inclusi
- Ottimo per iniziare

### **📋 Setup (5 minuti):**

#### **1. Crea Vercel Postgres**

Nel dashboard Vercel del **backend**:

1. **Storage** tab → **Create Database**
2. Scegli **Postgres**
3. Nome: `ai-orchestrator-db`
4. Region: Scegli la più vicina (eu-west-1 per Italia)
5. **Create**

#### **2. Collega al progetto**

Vercel crea automaticamente la variabile `POSTGRES_URL`.

Nel dashboard → **Settings** → **Environment Variables**:

```env
# Vercel crea automaticamente:
POSTGRES_URL=postgres://default:...@...vercel-storage.com/verceldb

# Copia questo valore e crea:
DATABASE_URL=$POSTGRES_URL
```

#### **3. Aggiorna schema Prisma**

In `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Cambia da sqlite a postgresql
  url      = env("DATABASE_URL")
}
```

#### **4. Deploy con Migration**

Aggiungi al `backend/package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma migrate deploy"
  }
}
```

Oppure nel dashboard Vercel → **Settings** → **Build & Development**:
- Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`

#### **5. Crea le Migration**

Localmente (prima di pushare):

```bash
cd backend

# Cambia datasource a postgresql
# Poi crea migration
npx prisma migrate dev --name init_postgres

# Push su Git
git add .
git commit -m "🗄️ Add PostgreSQL support"
git push
```

Vercel farà auto-deploy e applicherà le migration!

---

## 🎯 **OPZIONE 2: PLANETSCALE MYSQL (Alternativa Gratuita)**

### **✅ Vantaggi:**
- **GRATUITO** (5GB storage)
- Ottime performance
- Scaling automatico
- Branching del database

### **📋 Setup (10 minuti):**

#### **1. Crea Database su PlanetScale**

1. Vai su [planetscale.com](https://planetscale.com)
2. Sign up gratis
3. **New Database** → `ai-orchestrator`
4. Region: EU (Frankfurt per Italia)

#### **2. Get Connection String**

Dashboard → **Connect** → **Prisma**:

```env
DATABASE_URL='mysql://xxxxx:pscale_pw_xxxxx@aws.connect.psdb.cloud/ai-orchestrator?sslaccept=strict'
```

#### **3. Aggiorna Prisma Schema**

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"  // Importante per PlanetScale
}
```

#### **4. Aggiungi a Vercel**

Dashboard Vercel → **Environment Variables**:

```env
DATABASE_URL=mysql://xxxxx:pscale_pw_xxxxx@aws.connect.psdb.cloud/ai-orchestrator?sslaccept=strict
```

#### **5. Deploy**

```bash
git add .
git commit -m "🗄️ Add MySQL PlanetScale support"
git push
```

---

## 🎯 **OPZIONE 3: RAILWAY (Backend + Database insieme)**

### **✅ Vantaggi:**
- PostgreSQL incluso
- $5/mese crediti gratis
- Deploy backend + database insieme
- Zero config

### **📋 Setup (5 minuti):**

1. Vai su [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub**
3. Seleziona `aiorchestratordemoo`
4. Root Directory: `backend`
5. **Add PostgreSQL** → Auto-connesso!
6. Deploy automatico

Railway crea `DATABASE_URL` automaticamente.

---

## 🆚 **CONFRONTO:**

| Feature | Vercel Postgres | PlanetScale | Railway |
|---------|----------------|-------------|---------|
| **Prezzo** | Gratis | Gratis | $5/mese |
| **Storage** | 256MB | 5GB | Illimitato |
| **Setup** | Facile | Medio | Facilissimo |
| **Performance** | Ottima | Eccellente | Ottima |
| **Scaling** | Manuale | Automatico | Manuale |
| **Backup** | Incluso | Incluso | Incluso |

### **🏆 RACCOMANDAZIONE:**

**Per iniziare:**
- **Vercel Postgres** se vuoi tutto su Vercel (più semplice)
- **Railway** se vuoi zero config (tutto insieme)

**Per crescere:**
- **PlanetScale** quando hai più traffico (5GB gratis)

---

## 🔧 **IMPLEMENTAZIONE: VERCEL POSTGRES**

### **STEP 1: Aggiorna schema.prisma**

<function_calls>
<invoke name="search_replace">
<parameter name="file_path">backend/prisma/schema.prisma
