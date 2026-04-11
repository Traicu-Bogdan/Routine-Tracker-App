# Testing Guide - Routine Tracker API

## Quick Start Testing

### Prerequisites

- Node.js + npm installed
- PostgreSQL running
- `.env` file configured (see `.env.example` for template)
- Server running on `http://localhost:8000`

---

## Testing Methods

### Method 1: Using Postman (Recommended)

#### Setup Postman

1. Download [Postman](https://www.postman.com/downloads/) if not already installed
2. Import the collection:
   - Open Postman
   - Click **Import** button
   - Select `Routine-Tracker-API.postman_collection.json`
   - The collection will load with all endpoints pre-configured

#### Using the Collection

- The collection automatically handles cookies
- Variables are auto-populated (like `taskId`)
- Built-in test assertions validate responses
- Run requests in order or individually

#### Environment Setup in Postman

1. Create new Environment called "Development"
2. Add variable `baseUrl` with value `http://localhost:8000`
3. Select the environment from top-right dropdown

---

### Method 2: Using cURL (Command Line)

#### 1. Register User

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123!"
  }'
```

Expected Response (201):

```json
{
  "id": 1,
  "email": "testuser@example.com",
  "message": "User registered successfully"
}
```

#### 2. Login User

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123!"
  }'
```

Expected Response (200):

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "testuser@example.com"
  }
}
```

**Note**: `-c cookies.txt` saves cookies for next requests

#### 3. Get Current User

```bash
curl -X GET http://localhost:8000/auth/me \
  -b cookies.txt
```

Expected Response (200):

```json
{
  "user": {
    "id": 1,
    "email": "testuser@example.com"
  }
}
```

#### 4. Create Task

```bash
curl -X POST http://localhost:8000/todos/post \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Learn TypeScript",
    "taskDescription": "Complete advanced TypeScript course",
    "completed": false
  }'
```

Expected Response (201):

```json
{
  "success": true,
  "message": "success",
  "data": {
    "id": 1,
    "title": "Learn TypeScript",
    "taskDescription": "Complete advanced TypeScript course",
    "completed": false,
    "createdAt": "2026-04-11T10:30:00.000Z",
    "userId": 1
  }
}
```

#### 5. Get All Tasks

```bash
curl -X GET http://localhost:8000/todos/get \
  -b cookies.txt
```

Expected Response (200):

```json
{
  "success": true,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "Learn TypeScript",
      "taskDescription": "Complete advanced TypeScript course",
      "completed": false,
      "createdAt": "2026-04-11T10:30:00.000Z"
    }
  ]
}
```

#### 6. Get Task by ID

```bash
curl -X GET http://localhost:8000/todos/get/1 \
  -b cookies.txt
```

Expected Response (200):

```json
{
  "success": true,
  "message": "success",
  "data": {
    "id": 1,
    "title": "Learn TypeScript",
    "taskDescription": "Complete advanced TypeScript course",
    "completed": false,
    "createdAt": "2026-04-11T10:30:00.000Z"
  }
}
```

#### 7. Update Task

```bash
curl -X PATCH http://localhost:8000/todos/update/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Master TypeScript",
    "completed": true
  }'
```

Expected Response (200):

```json
{
  "success": true,
  "message": "success",
  "data": {
    "message": "Task updated successfully"
  }
}
```

#### 8. Delete Task

```bash
curl -X DELETE http://localhost:8000/todos/delete/1 \
  -b cookies.txt
```

Expected Response (200):

```json
{
  "success": true,
  "message": "success",
  "data": {}
}
```

---

### Method 3: Using REST Client (VS Code)

Install **REST Client** extension (by Huachao Mao)

Create `test.http` file:

```http
### Variables
@baseUrl = http://localhost:8000
@email = user@example.com
@password = TestPassword123!

### 1. Register User
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "email": "{{email}}",
  "password": "{{password}}"
}

### 2. Login User
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "{{email}}",
  "password": "{{password}}"
}

### 3. Get Current User
GET {{baseUrl}}/auth/me

### 4. Create Task
POST {{baseUrl}}/todos/post
Content-Type: application/json

{
  "title": "Learn TypeScript",
  "taskDescription": "Complete course",
  "completed": false
}

### 5. Get All Tasks
GET {{baseUrl}}/todos/get

### 6. Update Task
PATCH {{baseUrl}}/todos/update/1
Content-Type: application/json

{
  "completed": true
}

### 7. Delete Task
DELETE {{baseUrl}}/todos/delete/1
```

Click "Send Request" above each endpoint

---

## Testing Scenarios

### Scenario 1: Complete Workflow

1. ✅ Register new user
2. ✅ Login with credentials
3. ✅ Create 3-5 tasks
4. ✅ Get all tasks
5. ✅ Get specific task by ID
6. ✅ Update task (mark as complete)
7. ✅ Delete task
8. ✅ Logout

### Scenario 2: Authorization Testing

1. ✅ Logout or delete cookies
2. ✅ Try to access protected endpoint (should get 401)
3. ✅ Create task as user A
4. ✅ Login as user B
5. ✅ Try to access user A's task (should get 404)
6. ✅ Try to delete user A's task (should fail)

### Scenario 3: Validation Testing

1. ❌ Register with missing email (should get 400)
2. ❌ Register with existing email (should get 409)
3. ❌ Login with invalid password (should get 401)
4. ❌ Create task with empty title (should get 400)
5. ❌ Create task with too long title (>200 chars)
6. ❌ Update task with no fields provided (should get 400)
7. ❌ Get task with invalid ID (should get 400)
8. ❌ Get non-existent task (should get 404)

### Scenario 4: Security Testing

1. ✅ Login and check cookie is HTTP-only (can't access via JS)
2. ✅ Login and verify JWT contains correct user info
3. ✅ Verify password is never returned in responses
4. ✅ Verify users cannot delete/modify others' tasks
5. ✅ Check error messages don't expose sensitive info

---

## Expected Status Codes

| Operation           | Method | Status | Meaning             |
| ------------------- | ------ | ------ | ------------------- |
| Register Success    | POST   | 201    | User created        |
| Register Duplicate  | POST   | 409    | User exists         |
| Register Invalid    | POST   | 400    | Missing fields      |
| Login Success       | POST   | 200    | Logged in           |
| Login Failed        | POST   | 401    | Invalid credentials |
| Get Me              | GET    | 200    | User found          |
| Get Me Unauthorized | GET    | 401    | No token            |
| Create Task         | POST   | 201    | Task created        |
| Create Invalid      | POST   | 400    | Invalid data        |
| Get All Tasks       | GET    | 200    | Tasks returned      |
| Get Task by ID      | GET    | 200    | Task found          |
| Get Task 404        | GET    | 404    | Not found           |
| Get Task Invalid ID | GET    | 400    | Invalid ID          |
| Update Task         | PATCH  | 200    | Updated             |
| Update Not Found    | PATCH  | 404    | Not found           |
| Update Invalid      | PATCH  | 400    | Invalid data        |
| Delete Task         | DELETE | 200    | Deleted             |
| Delete Not Found    | DELETE | 404    | Not found           |
| Delete Invalid ID   | DELETE | 400    | Invalid ID          |

---

## Common Issues & Solutions

### Issue: 401 Unauthorized on protected endpoints

**Solution**:

- Ensure you're logged in first
- Check cookies are being sent (`-b cookies.txt` in curl)
- Verify JWT_SECRET matches in .env
- Check token hasn't expired (valid for 1 hour)

### Issue: CORS error from browser

**Solution**:

- Ensure FRONTEND_URL in .env matches your frontend URL
- Make sure credentials are sent in request headers
- Check browser console for specific CORS error message

### Issue: 400 Validation Error

**Solution**:

- Check request body matches schema requirements
- Title must be 1-200 characters
- taskDescription must be provided
- ID in URL must be a positive integer

### Issue: Database Connection Error

**Solution**:

- Verify PostgreSQL is running
- Check DATABASE_URL in .env is correct
- Run `npx prisma migrate dev` to set up database
- Try `npx prisma db push` to sync schema

### Issue: Token invalid/expired

**Solution**:

- Login again to get a fresh token
- Tokens expire after 1 hour
- Clear cookies and login again if issues persist

---

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test getting all tasks (requires auth, so not ideal)
ab -n 100 -c 10 http://localhost:8000/

# Better: Load test unauthenticated endpoint
ab -n 100 -c 10 http://localhost:8000/auth/register
```

### Stress Testing

```bash
# Install stress testing tool
npm install -g artillery

# Create artillery config file and run tests
artillery quick --count 10 --num 100 http://localhost:8000/
```

---

## Automated Testing

### Using Jest + Supertest

Create `tests/api.test.ts`:

```typescript
import request from "supertest";
import { app } from "../src/index";

describe("Auth Endpoints", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "test@example.com",
      password: "Test123!",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should login and return token", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "Test123!",
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });
});

describe("Task Endpoints", () => {
  it("should create a task", async () => {
    // First login...
    const res = await request(app).post("/todos/post").send({
      title: "Test Task",
      taskDescription: "Description",
      completed: false,
    });

    expect(res.statusCode).toBe(201);
  });
});
```

Run tests:

```bash
npm test
```

---

## Testing Checklist

- [ ] Register new user
- [ ] Login returns token in cookie
- [ ] Get current user returns correct info
- [ ] Create task successfully
- [ ] Get all tasks returns array
- [ ] Get task by ID
- [ ] Update task (partial update)
- [ ] Delete task
- [ ] Can't access protected endpoint without auth
- [ ] Can't access other user's tasks
- [ ] Invalid IDs return 400
- [ ] Non-existent tasks return 404
- [ ] Missing required fields return 400
- [ ] Duplicate email registration returns 409
- [ ] Invalid credentials return 401
- [ ] All error messages are clear and helpful

---

## Tips for Testing

1. **Use environment variables** in Postman/REST Client for base URL
2. **Save response data** for use in subsequent requests
3. **Test both happy and sad paths**
4. **Verify all HTTP status codes** match documentation
5. **Check response structure** matches API documentation
6. **Test authorization** thoroughly (security critical)
7. **Test input validation** with edge cases
8. **Monitor server logs** during tests for errors
9. **Use tools** (Postman, REST Client) for efficient testing
10. **Automate tests** for regression prevention

---

**Last Updated**: April 11, 2026
