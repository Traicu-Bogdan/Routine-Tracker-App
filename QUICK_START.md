# Quick Setup Guide - Routine Tracker App

Acest ghid te ajută să pornești aplicația în **5 minute**.

---

## ⚡ Setup în 5 Minute

### Pas 1: Clonează Repository (30 sec)

```bash
cd Desktop
git clone <repo-url>
cd Routine-Tracker-App
```

### Pas 2: Instalează Dependențe (2 min)

```bash
npm install
```

### Pas 3: Configurează Środowisul (.env) (1 min)

**Opțiunea A: PostgreSQL Local**

```bash
# Copiază template-ul
cp .env.example .env

# Editează .env și completează:
DATABASE_URL="postgresql://user:password@localhost:5432/routine_tracker"
JWT_SECRET="$(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))')"
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

**Opțiunea B: PostgreSQL Docker** (dacă nu ai PostgreSQL instalat)

```bash
# Pornește container Docker
docker run --name routine-db \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=routine_tracker \
  -p 5432:5432 \
  -d postgres:15

# Adaugă în .env:
DATABASE_URL="postgresql://user:password@localhost:5432/routine_tracker"
```

### Pas 4: Setup Database (1 min)

```bash
# Crează tabelele
npx prisma migrate dev

# Și gata! Baza de date e setup-ată.
```

### Pas 5: Pornește Serverul (30 sec)

```bash
npm run dev
```

✅ **Gata!** Serverul rulează pe `http://localhost:8000`

---

## 🧪 Testează API-ul

### CURL (Command Line)

```bash
# 1. Înregistrare
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# 2. Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# 3. Creează task
curl -X POST http://localhost:8000/todos/post \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Cumpără groceries",
    "taskDescription": "Lapte, oua, paine",
    "completed": false
  }'

# 4. Ia toate task-urile
curl -X GET http://localhost:8000/todos/get \
  -b cookies.txt
```

### Postman

1. Deschide Postman
2. Click **Import**
3. Selectează `Routine-Tracker-API.postman_collection.json`
4. Set environment: `baseUrl` = `http://localhost:8000`
5. Rulează requests în ordine

---

## 📁 Fișiere Importante

| Fișier                 | Descriere                        |
| ---------------------- | -------------------------------- |
| `API_DOCUMENTATION.md` | Documentație completă a API-ului |
| `TESTING_GUIDE.md`     | Ghid complet pentru testing      |
| `FIXES_SUMMARY.md`     | Rezumatul problemelor fixate     |
| `.env.example`         | Template pentru .env             |
| `README.md`            | Documentație generală            |

---

## 📝 Comenzi Utile

```bash
# Development
npm run dev              # Pornește cu hot reload

# Build & Production
npm run builder          # Compilează TypeScript
npm start              # Pornește app compilată

# Database
npx prisma studio     # Deschide UI pentru baza de date
npx prisma migrate dev # Aplică noi migrări
npx prisma db push    # Sinc schema cu DB
```

---

## ✅ Verificare Setup

Rulează aceste comenzi pentru a verifica:

```bash
# Verifică Node.js
node --version        # Trebuie >=16

# Verifică npm
npm --version

# Verifică PostgreSQL
psql --version

# Verifică dacă serverul rulează
curl http://localhost:8000/
# Ar trebui să primești: "Server is running!"
```

---

## 🆘 Problemă Rapidă?

### PostgreSQL nu se conectează

```bash
# Start PostgreSQL
brew services start postgresql  # macOS
# SAU deschide Services și start PostgreSQL  # Windows

# Verifică dacă rulează
psql -U postgres
```

### Port 8000 deja în uz

```bash
# Găsește proces care folosește portul
lsof -i :8000

# Omoară procesul
kill -9 <PID>
```

### JWT_SECRET error

```bash
# Generează secret nou
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copiază output-ul în .env JWT_SECRET
```

### Upgrade Prisma

```bash
npm install @prisma/client@latest
npx prisma generate
```

---

## 📚 Următor?

1. ✅ Citeşte [API_DOCUMENTATION.md](API_DOCUMENTATION.md) pentru detalii endpoint-urilor
2. ✅ Citeşti [TESTING_GUIDE.md](TESTING_GUIDE.md) pentru testing
3. ✅ Build frontend-ul pentru a consuma API-ul
4. ✅ Deploy-ează pe production

---

## 🎯 Structură Proiect Rapidă

```
src/
  ├── Controller/     - Logica request-urilor
  ├── Routes/         - Definirea routelor
  ├── Middleware/     - Auth, validare
  ├── Schemas/        - Zod validări
  └── index.ts        - Entry point

prisma/
  └── schema.prisma   - Database schema
```

---

## 💡 Pro Tips

1. **Rulează `npm run dev`** în alt terminal decât cel de code
2. **Folosește Postman** pentru teste mai rapide
3. **Citește eroare-urile** - sunt descriptive
4. **Clear cookies** dacă ai probleme cu auth
5. **Reset database** cu `npx prisma migrate reset` dacă ceva e distrus

---

## 📊 Timeline Setup

| Pas            | Timp    | Ce se întâmplă         |
| -------------- | ------- | ---------------------- |
| 1. Clone       | 30s     | Descarcă cod           |
| 2. npm install | 2m      | Instalează dependențe  |
| 3. .env setup  | 1m      | Configurează variabile |
| 4. DB setup    | 1m      | Crează tabele          |
| 5. npm run dev | 30s     | Pornește server        |
| **Total**      | **~5m** | ✅ Ready!              |

---

**Finalizat?**

- [ ] Clone repo
- [ ] npm install
- [ ] Setup .env
- [ ] npx prisma migrate dev
- [ ] npm run dev
- [ ] Test cu curl/Postman

Odată ce totul merge, citeşte **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** pentru a vedea cum funcționează API-ul!

---

Versiune: 1.0.0
Ultima actualizare: 11 Aprilie 2026
