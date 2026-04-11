# 🚀 Routine Tracker App

A production-ready Node.js/Express/PostgreSQL REST API for managing daily tasks and routines with JWT authentication and Prisma ORM.

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Node.js](https://img.shields.io/badge/Node.js-LTS-green)
![Express](https://img.shields.io/badge/Express-5.2-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)
![Prisma](https://img.shields.io/badge/Prisma-7.2-2D3748)

---

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Authentication

- ✅ User registration with email/password
- ✅ Secure JWT authentication
- ✅ HTTP-only secure cookies
- ✅ Password hashing with bcrypt
- ✅ User logout functionality

### Task Management

- ✅ Create, read, update, delete (CRUD) operations
- ✅ Task descriptions and completion status
- ✅ User-specific task isolation
- ✅ Partial updates with PATCH
- ✅ Comprehensive error handling

### Security

- ✅ Input validation with Zod schemas
- ✅ Role-based authorization (users own tasks)
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection (HTTP-only cookies)
- ✅ CSRF protection (SameSite cookies)
- ✅ Secure environment variable handling

### API

- ✅ RESTful endpoint design
- ✅ Consistent response format
- ✅ Comprehensive error messages
- ✅ Proper HTTP status codes
- ✅ CORS support

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- Git

### Installation

#### 1. Clone Repository

```bash
git clone <your-repo-url>
cd Routine-Tracker-App
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Setup Environment

```bash
# Copy template
cp .env.example .env

# Edit .env with your values
# Required:
# - DATABASE_URL
# - JWT_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
# - NODE_ENV
# - FRONTEND_URL
```

#### 4. Setup Database

```bash
# Create PostgreSQL database
createdb routine_tracker

# Run migrations (creates tables)
npx prisma migrate dev

# (Optional) View database in UI
npx prisma studio
```

#### 5. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:8000`

---

## 📁 Project Structure

```
routine-tracker-app/
├── src/
│   ├── Controller/              # Request handlers
│   │   ├── auth.ts             # Auth endpoints (getMe)
│   │   ├── login.ts            # Login handler
│   │   ├── signin.ts           # Register handler
│   │   ├── logout.ts           # Logout handler
│   │   └── taskController.ts   # CRUD operations for tasks
│   │
│   ├── Middleware/              # Express middleware
│   │   ├── auth.ts             # JWT authentication
│   │   └── validate.ts         # Request validation with Zod
│   │
│   ├── Routes/                  # API route definitions
│   │   ├── AuthRouter.ts       # Authentication routes
│   │   └── TodoRouter.ts       # Task routes
│   │
│   ├── Schemas/                 # Zod validation schemas
│   │   ├── auth.login.schema.ts
│   │   ├── auth.register.schema.ts
│   │   └── task.schema.ts
│   │
│   ├── Dtos/                    # Data transfer objects
│   │   └── getAllResponseDto.ts
│   │
│   ├── lib/                     # Library/utilities
│   │   └── prisma.ts           # Prisma client
│   │
│   ├── mappers/                 # Data transformation
│   │   └── taskMapper.ts
│   │
│   ├── utils/                   # Utility functions
│   │   └── helpers/
│   │       └── responseShape.ts # Response formatting
│   │
│   └── index.ts                # Application entry point
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
│
├── dist/                       # Compiled JavaScript (created after build)
│
├── .env.example               # Environment template
├── .env                       # Environment vars (create from .env.example)
├── package.json               # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── nodemon.json              # Development server config
│
├── API_DOCUMENTATION.md      # Complete API reference
├── TESTING_GUIDE.md          # Testing instructions
├── FIXES_SUMMARY.md          # Issues fixed summary
├── Routine-Tracker-API.postman_collection.json  # Postman tests
│
└── README.md                 # This file
```

---

## 🔗 API Documentation

### Base URL

```
http://localhost:8000
```

### Endpoints Overview

#### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - Logout user

#### Tasks (requires authentication)

- `GET /todos/get` - Get all user's tasks
- `GET /todos/get/:id` - Get specific task
- `POST /todos/post` - Create new task
- `PATCH /todos/update/:id` - Update task
- `DELETE /todos/delete/:id` - Delete task

### Example: Login and Create Task

```bash
# 1. Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'

# 2. Login (saves token in cookie)
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'

# 3. Create task (uses cookie from login)
curl -X POST http://localhost:8000/todos/post \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Buy groceries",
    "taskDescription": "Milk, eggs, bread",
    "completed": false
  }'
```

**📖 For complete API documentation see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)**

---

## 🧪 Testing

### Using Postman (Recommended)

1. Import `Routine-Tracker-API.postman_collection.json` into Postman
2. Create environment with `baseUrl = http://localhost:8000`
3. Run requests in order or individually
4. Tests validate responses automatically

### Using cURL

```bash
# All curl examples in TESTING_GUIDE.md
npm install -g curl
curl -X GET http://localhost:8000/ # Test if server is running
```

### Using VS Code REST Client

1. Install "REST Client" extension
2. Create `test.http` file
3. Use examples from TESTING_GUIDE.md
4. Click "Send Request"

**📖 For detailed testing guide see [TESTING_GUIDE.md](TESTING_GUIDE.md)**

---

## 🔐 Security Highlights

### What's Protected

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWTs signed with secret key
- ✅ Cookies HTTP-only (prevents XSS)
- ✅ Cookies SameSite=strict (prevents CSRF)
- ✅ Cookies secure flag in production (HTTPS only)
- ✅ Users can only access their own tasks
- ✅ All inputs validated with Zod
- ✅ No SQL injection (Prisma ORM)

### Environment Variables (Secure)

Never commit `.env` file! Always use:

```bash
cp .env.example .env
# Edit .env with real values
# Add .env to .gitignore
```

### Deployment Checklist

- [ ] `NODE_ENV=production`
- [ ] Strong JWT_SECRET (32+ random characters)
- [ ] HTTPS enabled (for secure cookies)
- [ ] Database backups configured
- [ ] Logging configured
- [ ] Error monitoring set up
- [ ] Rate limiting enabled
- [ ] CORS restricted to known domains

---

## 📦 Scripts

```bash
# Development
npm run dev        # Start with hot reload (nodemon)

# Production
npm run builder    # Compile TypeScript
npm start          # Run compiled app

# Database
npx prisma studio         # Open Prisma Studio (visual DB)
npx prisma migrate dev    # Create/apply migrations
npx prisma migrate reset  # Reset database (dev only!)
npx prisma db push       # Sync schema with DB

# Testing
npm test          # Run test suite (when configured)
```

---

## 🛠️ Troubleshooting

### Issue: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Problem**: PostgreSQL connection failed

**Solutions**:

1. Ensure PostgreSQL is running:

   ```bash
   # macOS
   brew services start postgresql

   # Windows
   # Open Services app and start PostgreSQL

   # Linux
   sudo service postgresql start
   ```

2. Check DATABASE_URL in `.env` is correct
3. Verify database exists: `psql -l`

### Issue: `Error: process.env.JWT_SECRET is undefined`

**Problem**: JWT_SECRET not set in `.env`

**Solution**:

```bash
# Add to .env
JWT_SECRET="$(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))')"
```

### Issue: `Error: Prisma schema was changed and needs migration`

**Problem**: Database schema doesn't match Prisma schema

**Solution**:

```bash
npx prisma migrate dev
# Or reset database (development only)
npx prisma migrate reset
```

### Issue: `401 Unauthorized` on protected endpoints

**Problem**: Token missing or invalid

**Solutions**:

1. Ensure you logged in first
2. Check cookies are being sent (`-b cookies.txt` in curl)
3. Verify token hasn't expired (valid 1 hour)
4. Clear cookies and login again

### Issue: CORS error in browser

**Problem**: Frontend can't access API

**Solutions**:

1. Set FRONTEND_URL in `.env` to your actual frontend URL
2. Ensure credentials are sent in requests:
   ```javascript
   fetch(url, {
     credentials: "include",
   });
   ```
3. Check browser console for exact CORS error

---

## 📊 Database Schema

### User Table

```sql
CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

### Todo Table

```sql
CREATE TABLE "Todo" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  taskDescription VARCHAR(2000) DEFAULT '',
  completed BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW(),
  userId INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  INDEX(userId)
);
```

---

## 📝 Recent Fixes (v1.0.0)

**23 issues fixed** in comprehensive code review:

- ✅ Security vulnerabilities eliminated
- ✅ Authorization bypass fixed
- ✅ Error handling added to all endpoints
- ✅ Type safety improvements
- ✅ Database optimization (indexes, constraints)
- ✅ Proper HTTP status codes
- ✅ Input validation

**📖 Complete details in [FIXES_SUMMARY.md](FIXES_SUMMARY.md)**

---

## 🚀 Deployment

### Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create routine-tracker-app

# Add environment variables
heroku config:set JWT_SECRET=your_secret_here
heroku config:set DATABASE_URL=postgresql://...

# Deploy
git push heroku main
```

### Railway.app

```bash
# Connect GitHub repo
# Deploy from Railway dashboard
# Set environment variables in Railway UI
```

### Docker

```bash
# Build image
docker build -t routine-tracker .

# Run container
docker run -p 8000:8000 --env-file .env routine-tracker
```

---

## 📚 Dependencies

### Production

- **express** (5.2) - Web framework
- **@prisma/client** (7.2) - ORM
- **jsonwebtoken** (9.0) - JWT tokens
- **bcrypt** (6.0) - Password hashing
- **zod** (4.3) - Input validation
- **cors** (2.8) - CORS handling
- **cookie-parser** (1.4) - Cookie parsing
- **pg** (8.17) - PostgreSQL driver

### Development

- **typescript** (5.9) - Static typing
- **nodemon** (3.1) - Hot reload
- **@types/** - Type definitions

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

---

## 📞 Support

For issues or questions:

1. Check [TROUBLESHOOTING.md](#troubleshooting)
2. Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. Check [TESTING_GUIDE.md](TESTING_GUIDE.md)
4. Open an issue on GitHub

---

## 🎉 Getting Help

- **API Questions**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Testing Issues**: See [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Setup Problems**: See `.env.example`
- **Fixed Issues**: See [FIXES_SUMMARY.md](FIXES_SUMMARY.md)

---

## 🎯 Next Steps

1. ✅ Setup development environment
2. ✅ Read API documentation
3. ✅ Test with Postman collection
4. ✅ Build frontend to consume API
5. ✅ Deploy to production

---

**Version**: 1.0.0  
**Last Updated**: April 11, 2026  
**Status**: Production Ready ✅

---

Made with ❤️ by the Routine Tracker Team
