# Routine Tracker App - API Documentation

## Base URL

```
http://localhost:8000
```

## Environment Variables

Create a `.env` file in the root directory with:

```
DATABASE_URL="postgresql://user:password@localhost:5432/routine_tracker"
JWT_SECRET="your_secret_key_here_min_32_chars"
NODE_ENV="development"  # Set to "production" for deployment
FRONTEND_URL="http://localhost:3000"  # Frontend URL for CORS
```

---

## Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Create a new user account.

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "success",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "message": "User registered successfully"
  }
}
```

**Error Responses:**

- **400 Bad Request:** Missing email or password
- **409 Conflict:** User already exists

---

### 2. Login User

**POST** `/auth/login`

Authenticate user and receive JWT token in secure HTTP-only cookie.

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Set-Cookie Header:**

```
token=<JWT_TOKEN>; HttpOnly; Secure; SameSite=strict; Max-Age=3600
```

**Error Responses:**

- **401 Unauthorized:** Invalid email or password

---

### 3. Get Current User

**GET** `/auth/me`

Get the currently authenticated user's information.

**Request Headers:**

```
Cookie: token=<JWT_TOKEN>
```

**Response (200 OK):**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Responses:**

- **401 Unauthorized:** No valid token provided

---

### 4. Logout

**POST** `/auth/logout`

Clear authentication token (if implemented).

---

## Todo/Task Endpoints

### Authentication Required

All todo endpoints require a valid JWT token in the `token` cookie. The token is automatically sent with requests that include credentials.

---

### 1. Get All Tasks

**GET** `/todos/get`

Retrieve all tasks for the authenticated user.

**Request Headers:**

```
Cookie: token=<JWT_TOKEN>
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "Buy groceries",
      "taskDescription": "Milk, eggs, bread, and vegetables",
      "completed": false,
      "createdAt": "2026-04-11T10:30:00.000Z"
    },
    {
      "id": 2,
      "title": "Finish project",
      "taskDescription": "Complete API documentation",
      "completed": true,
      "createdAt": "2026-04-10T14:20:00.000Z"
    }
  ]
}
```

**Error Responses:**

- **401 Unauthorized:** No valid token
- **500 Internal Server Error:** Database error

---

### 2. Get Task by ID

**GET** `/todos/get/:id`

Retrieve a specific task by ID (only if it belongs to the authenticated user).

**Request Headers:**

```
Cookie: token=<JWT_TOKEN>
```

**URL Parameters:**

- `id` (number, required): Task ID

**Response (200 OK):**

```json
{
  "success": true,
  "message": "success",
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "taskDescription": "Milk, eggs, bread, and vegetables",
    "completed": false,
    "createdAt": "2026-04-11T10:30:00.000Z"
  }
}
```

**Error Responses:**

- **400 Bad Request:** Invalid task ID
- **401 Unauthorized:** No valid token
- **404 Not Found:** Task not found
- **500 Internal Server Error:** Database error

---

### 3. Create Task

**POST** `/todos/post`

Create a new task for the authenticated user.

**Request Headers:**

```
Content-Type: application/json
Cookie: token=<JWT_TOKEN>
```

**Request Body:**

```json
{
  "title": "Buy groceries",
  "taskDescription": "Milk, eggs, bread, and vegetables",
  "completed": false
}
```

**Validation Rules:**

- `title`: Required, string, 1-200 characters
- `taskDescription`: Required, string, minimum 1 character
- `completed`: Optional, boolean (defaults to false)

**Response (201 Created):**

```json
{
  "success": true,
  "message": "success",
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "taskDescription": "Milk, eggs, bread, and vegetables",
    "completed": false,
    "createdAt": "2026-04-11T10:30:00.000Z",
    "userId": 1
  }
}
```

**Error Responses:**

- **400 Bad Request:** Validation error (missing or invalid fields)
- **401 Unauthorized:** No valid token
- **500 Internal Server Error:** Database error

---

### 4. Update Task

**PATCH** `/todos/update/:id`

Update an existing task (only if it belongs to the authenticated user).

**Request Headers:**

```
Content-Type: application/json
Cookie: token=<JWT_TOKEN>
```

**URL Parameters:**

- `id` (number, required): Task ID

**Request Body** (all fields optional, but at least one required):

```json
{
  "title": "Buy groceries and cook",
  "taskDescription": "Milk, eggs, bread, vegetables, and prepare dinner",
  "completed": true
}
```

**Validation Rules:**

- `title`: Optional, string, 1+ characters
- `taskDescription`: Optional, string, 1+ characters
- `completed`: Optional, boolean
- At least one field must be provided

**Response (200 OK):**

```json
{
  "success": true,
  "message": "success",
  "data": {
    "message": "Task updated successfully"
  }
}
```

**Error Responses:**

- **400 Bad Request:** Invalid ID or no fields provided
- **401 Unauthorized:** No valid token
- **404 Not Found:** Task not found
- **500 Internal Server Error:** Database error

---

### 5. Delete Task

**DELETE** `/todos/delete/:id`

Delete a task (only if it belongs to the authenticated user).

**Request Headers:**

```
Cookie: token=<JWT_TOKEN>
```

**URL Parameters:**

- `id` (number, required): Task ID

**Response (200 OK):**

```json
{
  "success": true,
  "message": "success",
  "data": {}
}
```

**Error Responses:**

- **400 Bad Request:** Invalid task ID
- **401 Unauthorized:** No valid token
- **404 Not Found:** Task not found or doesn't belong to user
- **500 Internal Server Error:** Database error

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": null
}
```

**Common HTTP Status Codes:**

- `200 OK`: Successful GET/PATCH/DELETE
- `201 Created`: Successful POST (resource created)
- `400 Bad Request`: Validation error or invalid input
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists (e.g., duplicate email)
- `500 Internal Server Error`: Server error

---

## Database Schema

### User Table

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String   (hashed with bcrypt)
  createdAt DateTime @default(now())
  Todo      Todo[]
}
```

### Todo Table

```prisma
model Todo {
  id               Int      @id @default(autoincrement())
  title            String   @db.VarChar(200)
  taskDescription  String   @default("") @db.VarChar(2000)
  completed        Boolean  @default(false)
  createdAt        DateTime @default(now())
  userId           Int
  User             User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

---

## Security Features

1. **JWT Authentication**: All protected endpoints require valid JWT token
2. **Password Hashing**: Passwords are hashed with bcrypt (10 rounds)
3. **Secure Cookies**:
   - HTTP-only (prevents XSS attacks)
   - Secure flag in production (HTTPS only)
   - SameSite=strict (prevents CSRF)
4. **Authorization**: Users can only access/modify their own tasks
5. **Input Validation**: All inputs validated with Zod schemas
6. **SQL Injection Prevention**: Using Prisma ORM with parameterized queries

---

## Usage Examples

### Example 1: Register and Login

```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Response
{
  "id": 1,
  "email": "john@example.com",
  "message": "User registered successfully"
}

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }' \
  -c cookies.txt

# Response includes Set-Cookie header with JWT token
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "john@example.com"
  }
}
```

### Example 2: Create and Manage Tasks

```bash
# Create task
curl -X POST http://localhost:8000/todos/post \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Learn TypeScript",
    "taskDescription": "Complete TypeScript fundamentals course",
    "completed": false
  }'

# Get all tasks
curl -X GET http://localhost:8000/todos/get \
  -b cookies.txt

# Update task
curl -X PATCH http://localhost:8000/todos/update/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "completed": true
  }'

# Delete task
curl -X DELETE http://localhost:8000/todos/delete/1 \
  -b cookies.txt
```

---

## Running the Application

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev

# Start development server
npm run dev

# Build for production
npm run builder

# Start production server
npm start
```

---

## Troubleshooting

**Issue**: Auth middleware returns 401 even with valid token

- Ensure `FRONTEND_URL` in `.env` matches your actual frontend URL
- Check that cookies are being sent with requests (use `-b` or `-c` flags in curl)
- Verify JWT_SECRET is the same value used for token creation

**Issue**: CORS errors when calling API

- Check `FRONTEND_URL` environment variable
- Ensure credentials flag is set when making requests
- Browser must send cookies automatically with CORS requests

**Issue**: Database connection errors

- Verify `DATABASE_URL` is correct in `.env`
- Ensure PostgreSQL server is running
- Check database credentials

---

## API Response Standards

All endpoints follow a consistent response format:

**Successful Response:**

```json
{
  "success": true,
  "message": "User-friendly message",
  "data": {
    /* response data */
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description",
  "errors": null
}
```

---

## Version

API Version: 1.0.0
Last Updated: April 11, 2026
