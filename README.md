# Portfolio-Utility

A full-stack Teacher/Trainee Portfolio Management System that allows admins to manage teacher records, training history, career data, events, and certificates.

---

## Tech Stack

### Backend
| Tool | Purpose |
|------|---------|
| Node.js | Runtime environment |
| TypeScript | Type safety |
| Fastify | HTTP framework |
| Drizzle ORM | Database ORM |
| PostgreSQL | Database |
| JWT | Stateless authentication |
| Zod | Input validation |
| Pino | Logging (built into Fastify) |
| Docker | PostgreSQL containerization |
| bcryptjs | Password hashing |

### Frontend
| Tool | Purpose |
|------|---------|
| Next.js | React framework |
| TypeScript | Type safety |
| TailwindCSS | Utility-first styling |
| shadcn/ui | UI component library |

---

## Project Structure

```
Portfolio-Utility/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── teacher.controller.ts
│   │   ├── db/
│   │   │   ├── client.ts
│   │   │   └── schema.ts
│   │   ├── middlewares/
│   │   │   ├── requireAuth.ts
│   │   │   └── requireRole.ts
│   │   ├── routes/
│   │   │   ├── auth.route.ts
│   │   │   └── teacher.route.ts
│   │   ├── services/
│   │   ├── types/
│   │   │   └── fastify.d.ts
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   └── password.ts
│   │   ├── app.ts
│   │   └── index.ts
│   ├── drizzle/
│   ├── docker-compose.yml
│   ├── drizzle.config.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── app/
    ├── components/
    ├── public/
    ├── .env.example
    ├── package.json
    └── tsconfig.json
```

---

## Roles & Access Control

| Action | Admin | Teacher |
|--------|-------|---------|
| Register / Login | ✓ | ✓ |
| View teacher profile | ✓ | ✓ |
| Search teachers | ✓ | ✓ |
| Create teacher profile | ✓ | ✗ |
| Update teacher profile | ✓ | ✗ |
| Add training record | ✓ | ✗ |
| Add career record | ✓ | ✗ |
| Add event record | ✓ | ✗ |
| Generate certificate | ✓ | ✗ |
| View certificate | ✓ | ✓ |
| Download certificate | ✓ | ✓ |

---

## API Endpoints

### Auth
```
POST   /api/auth/register     → Register a new user
POST   /api/auth/login        → Login and receive JWT token
```

### Teachers
```
GET    /api/teachers          → Get all teachers (public)
GET    /api/teachers/:id      → Get teacher by ID (public)
POST   /api/teachers          → Create teacher profile (admin only)
PATCH  /api/teachers/:id      → Update teacher profile (admin only)
```

### Training
```
GET    /api/training/:teacherId   → Get training records (protected)
POST   /api/training              → Add training record (admin only)
PATCH  /api/training/:id          → Update training record (admin only)
```

### Career
```
GET    /api/career/:teacherId     → Get career records (protected)
POST   /api/career                → Add career record (admin only)
PATCH  /api/career/:id            → Update career record (admin only)
```

### Events
```
GET    /api/events/:teacherId     → Get event records (protected)
POST   /api/events                → Add event record (admin only)
PATCH  /api/events/:id            → Update event record (admin only)
```

### Certificates
```
GET    /api/certificates/:id          → View certificate (protected)
POST   /api/certificates              → Generate certificate (admin only)
GET    /api/certificates/:id/download → Download certificate (protected)
```

---

## Database Schema

```
users
  id, email, password, role, createdAt, updatedAt

teachers
  id, userId(FK), name, address, contact, email, gender, imageUrl, dob, createdAt, updatedAt

```

---

## Getting Started

### Prerequisites
- Node.js v20+
- Docker Desktop
- Git

### Backend Setup

**1. Clone the repository**
```bash
git clone https://github.com/surajgit79/Portfolio-Utility.git
cd Portfolio-Utility/backend
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env
```

Fill in your `.env`:
```
PORT=
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
FRONTEND_URL=
```

**4. Start the database**
```bash
docker compose up -d
```

**5. Run migrations**
```bash
npm run db:generate
npm run db:migrate
```

**6. Start the development server**
```bash
npm run dev
```

Server runs at `http://localhost:3000`

Health check: `GET http://localhost:3000/health`

---

### Frontend Setup

**1. Navigate to frontend**
```bash
cd ../frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env.local
```

Fill in your `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**4. Start the development server**
```bash
npm run dev
```

Frontend runs at `http://localhost:3001`

---

## Git Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/).

### Commit Format
```
<type>(<scope>): <description>

# Examples
chore(init): initial backend scaffold
feat(auth): add JWT login endpoint
feat(teacher): add create teacher route
fix(auth): correct token expiry check
refactor(middleware): simplify requireRole logic
docs(readme): update setup instructions
```

### Branch Naming
```
feat/task-id-short-description
fix/task-id-short-description
chore/task-id-short-description

# Examples
feat/auth-jwt-login
feat/teacher-crud
fix/cors-origin-error
```

---

## Environment Variables

### Backend
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| DATABASE_URL | PostgreSQL connection string | postgresql://... |
| JWT_SECRET | Secret key for JWT signing | random-long-string |
| JWT_EXPIRES_IN | JWT expiry duration | 7d |
| FRONTEND_URL | Allowed CORS origin | http://localhost:3001 |

### Frontend
| Variable | Description | Example |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API base URL | http://localhost:3000 |

---

## Scripts

### Backend
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm run start        # Run compiled output
npm run db:generate  # Generate migration files
npm run db:migrate   # Apply migrations to database
npm run db:studio    # Open Drizzle Studio (DB browser)
```

### Frontend
```bash
npm run dev      # Start Next.js dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Contributors

- **Bishesh Khatiwada** — UI/UX Design
- **Piyush Lal Shrestha** — Frontend
- **Suraj Gupta** — Backend
