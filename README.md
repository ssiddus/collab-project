# Collab — Multi-Tenant Project Management API

A production-ready backend API for team-based project management. Built with **Node.js, TypeScript, Express, Prisma, and PostgreSQL** — containerised with Docker and CI/CD powered by GitHub Actions.

---

## Live Demo

| | |
|---|---|
| **API Base** | https://collab-api-k1or.onrender.com |
| **Swagger UI** | https://collab-api-k1or.onrender.com/api-docs |
| **Health Check** | https://collab-api-k1or.onrender.com/health |

> Test all endpoints interactively via Swagger UI — no Postman needed.

---

## What Problem Does It Solve?

When multiple teams use the same system, they must never see each other's data. This API enforces strict **multi-tenant data isolation** — every request is scoped to an organisation via JWT. Teams can manage projects, assign tasks, invite members via email, and control access through role-based permissions.

---

## Architecture

```
Client Request
      │
      ▼
  Rate Limiter (express-rate-limit)
      │
      ▼
  Zod Validation (input shape & type check)
      │
      ▼
  Auth Middleware (JWT Verification)
      │
      ▼
   Controller  (handles HTTP request/response)
      │
      ▼
    Service    (business logic, RBAC)
      │
      ▼
  Repository   (all DB calls via Prisma ORM)
      │
      ▼
  PostgreSQL
```

Every layer has a single responsibility. Controllers never touch the database. Services never handle HTTP. Repositories never contain business logic.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18 |
| Language | TypeScript |
| Framework | Express.js |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| Validation | Zod |
| Logging | Winston |
| API Docs | Swagger (OpenAPI 3.0) |
| Email | Nodemailer (Gmail SMTP) |
| Rate Limiting | express-rate-limit |
| Containerisation | Docker + docker-compose |
| CI/CD | GitHub Actions |
| Testing | Jest + ts-jest |

---

## Features

### Authentication
- `POST /auth/register` — creates user + organisation in a single atomic transaction
- `POST /auth/login` — returns signed JWT

### Organisation Management
- `POST /org/invite` — OWNER/ADMIN sends email invite with secure token
- `POST /org/accept-invite` — invited member registers via token
- `GET /org/members` — list all members in organisation
- `PUT /org/:id/role` — OWNER updates member role (ADMIN or MEMBER only)

### Project Management
- `POST /projects` — create project (OWNER/ADMIN only)
- `GET /projects` — list all projects (paginated, org-scoped)
- `GET /projects/:id` — get project by ID (org-scoped)

### Task Management
- `POST /tasks` — create task with optional assignee (OWNER/ADMIN only)
- `GET /tasks` — list all tasks (paginated, org-scoped, includes assignee details)
- `GET /tasks/:id` — get task by ID
- `PUT /tasks/:id` — update task title, description, status, or assignee
- `DELETE /tasks/:id` — delete task (OWNER/ADMIN only)

---

## Security Design

### Multi-Tenant Isolation
`orgId` is **never** trusted from the request body. It is always extracted from the signed JWT payload — preventing users from accessing or modifying data belonging to other organisations.

```typescript
// orgId always comes from JWT, never from req.body
const orgId = req.user.orgId
```

### Role-Based Access Control (RBAC)

| Action | OWNER | ADMIN | MEMBER |
|---|---|---|---|
| Create Project | ✅ | ✅ | ❌ |
| Create Task | ✅ | ✅ | ❌ |
| Update Task | ✅ | ✅ | ❌ |
| Delete Task | ✅ | ✅ | ❌ |
| Send Invite | ✅ | ✅ | ❌ |
| Update Member Role | ✅ | ❌ | ❌ |
| View Projects/Tasks | ✅ | ✅ | ✅ |

### Invite Token Security
- Tokens are cryptographically random UUIDs
- Expire after 1 hour
- Single-use — marked as `used` after acceptance
- Email must match the invited address

### Rate Limiting
- Global: 100 requests per 15 minutes per IP
- Auth routes: stricter limit of 10 requests per 15 minutes per IP

---

## Database Schema

```
Organization
    │
    ├── User (role: OWNER | ADMIN | MEMBER)
    │
    ├── Project (status: ACTIVE | INACTIVE)
    │     └── Task (status: TODO | IN_PROGRESS | DONE)
    │           ├── createdBy → User
    │           └── assignedTo → User (optional)
    │
    └── InviteToken (token, email, used, expiresAt)
```

---

## Getting Started

### Prerequisites
- Docker and docker-compose installed

### Run with Docker

```bash
# Clone the repo
git clone https://github.com/ssiddus/collab-project.git
cd collab-project

# Copy env file and fill in values
cp .env.example .env

# Start everything
docker-compose up --build
```

The server runs at `http://localhost:9322`

Swagger UI: `http://localhost:9322/api-docs`

### Environment Variables

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/collab_db
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
NODE_ENV=development
```

> For `EMAIL_PASS` — use a Gmail App Password, not your actual Gmail password.
> Generate one at: myaccount.google.com/apppasswords

---

## API Usage

### 1. Register (creates org + owner)
```bash
POST /auth/register
{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "password123",
  "organisationName": "Acme Corp"
}
```

### 2. Login
```bash
POST /auth/login
{
  "email": "john@company.com",
  "password": "password123"
}
```

### 3. Invite a Team Member
```bash
POST /org/invite
Authorization: Bearer <token>
{
  "email": "teammate@company.com"
}
```
An email is sent with an invite token. In development the token is also returned in the response.

### 4. Create a Project
```bash
POST /projects
Authorization: Bearer <token>
{
  "name": "Website Redesign",
  "description": "Q2 website overhaul",
  "status": "ACTIVE"
}
```

### 5. Create a Task with Assignee
```bash
POST /tasks
Authorization: Bearer <token>
{
  "title": "Design homepage",
  "description": "Create mockups for homepage",
  "projectId": "project-uuid-here",
  "assignedTo": "user-uuid-here"
}
```

---

## Project Structure

```
src/
├── controller/     # HTTP request/response handlers
├── services/       # Business logic and RBAC
├── repositories/   # All Prisma DB calls
├── middleware/     # JWT auth, rate limiting, error handling, Zod validation
├── routes/         # Express route definitions with Swagger JSDoc
├── validators/     # Zod schemas for all request bodies
├── types/          # TypeScript interfaces
└── utils/          # JWT, email, Prisma client, Winston logger, Swagger setup

prisma/
├── schema.prisma   # Database models
└── migrations/     # Migration history

.github/
└── workflows/
    └── ci.yml      # GitHub Actions CI pipeline
```

---

## Testing

```bash
npx jest
```

29 unit tests across all service layers using Jest and ts-jest. Repositories are fully mocked — no real database needed during test runs.

---

## CI/CD Pipeline

GitHub Actions runs on every push to `main`:

```
Push to main
      ↓
Checkout code
      ↓
Install Node.js 18
      ↓
npm install
      ↓
npx prisma generate
      ↓
npm run build (TypeScript compile)
      ↓
✅ Build passes or ❌ fails with notification
```

---

## Development

```bash
# Install dependencies
npm install

# Run locally (with ts-node-dev)
npm run dev

# Run tests
npx jest

# Build TypeScript
npm run build

# Run migrations
npx prisma migrate dev

# Open Prisma Studio (DB GUI)
npx prisma studio
```

---

## Author

Built by Siddu — a backend engineer with production experience in ELK Stack, webMethods ESB integration, and enterprise observability systems.
