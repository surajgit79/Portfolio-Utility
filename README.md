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
| Cloudinary | Image upload & storage |

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
│   │   │   ├── careerRecord.controller.ts
│   │   │   ├── eventRecord.controller.ts
│   │   │   ├── teacher.controller.ts
│   │   │   ├── trainingEvents.controller.ts
│   │   │   └── trainingRecords.controller.ts
│   │   ├── db/
│   │   │   ├── client.ts
│   │   │   ├── schema.ts
│   │   │   └── seed.ts
│   │   ├── middlewares/
│   │   │   ├── requireAuth.ts
│   │   │   └── requireRole.ts
│   │   ├── repositories/
│   │   │   ├── careerRecord.repository.ts
│   │   │   ├── eventRecord.repository.ts
│   │   │   ├── teacher.repository.ts
│   │   │   ├── trainingEvent.repository.ts
│   │   │   ├── trainingRecord.repository.ts
│   │   │   └── user.repository.ts
│   │   ├── routes/
│   │   │   ├── auth.route.ts
│   │   │   ├── careerRecord.route.ts
│   │   │   ├── eventRecord.route.ts
│   │   │   ├── teacher.route.ts
│   │   │   ├── trainingEvent.route.ts
│   │   │   └── trainingRecords.routes.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── careerRecord.service.ts
│   │   │   ├── eventRecord.service.ts
│   │   │   ├── teacher.service.ts
│   │   │   ├── trainingEvent.service.ts
│   │   │   └── trainingRecord.service.ts
│   │   ├── types/
│   │   │   └── fastify.d.types.ts
│   │   ├── utils/
│   │   │   ├── cloudinary.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── idGenerator.ts
│   │   │   ├── jwt.ts
│   │   │   ├── pagination.ts
│   │   │   ├── password.ts
│   │   │   ├── upload.ts
│   │   │   └── validation.ts
│   │   ├── app.ts
│   │   └── index.ts
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
| Update career record | ✓ | ✗ |
| Delete career record | ✓ | ✗ |
| Update event record | ✓ | ✗ |
| Delete event record | ✓ | ✗ |

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

### Training Events
```
GET    /api/training-events              → Get all training events (protected)
GET    /api/training-events/:id         → Get training event by ID (protected)
POST   /api/training-events              → Create training event (admin only)
PATCH  /api/training-events/:id          → Update training event (admin only)
```

### Training Records
```
GET    /api/training-records/teacher/:teacherId       → Get records by teacher (protected)
GET    /api/training-records/teacher/:trainingEventId → Get records by event (protected)
POST   /api/training-records                          → Create training record (admin only)
POST   /api/training-records/bulk                     → Bulk create records (admin only)
```

### Career Records
```
GET    /api/career-records/teacher/:teacherId  → Get records by teacher (protected)
GET    /api/career-records/:id                 → Get record by ID (protected)
POST   /api/career-records                     → Create career record (admin only)
PATCH  /api/career-records/:id                 → Update career record (admin only)
DELETE /api/career-records/:id                 → Delete career record (admin only)
```

### Event Records
```
GET    /api/event-records/teacher/:teacherId  → Get records by teacher (protected)
GET    /api/event-records/:id                 → Get record by ID (protected)
POST   /api/event-records                     → Create event record (admin only)
PATCH  /api/event-records/:id                  → Update event record (admin only)
DELETE /api/event-records/:id                  → Delete event record (admin only)
```

---

## ID Generation

### Record IDs
Format: `{PREFIX}-{YEAR}-{SEQUENCE}`
- `PREFIX`: 3-letter code based on table (e.g., `USR` for users, `TCH` for teachers, `TRN` for training events, `TRC` for training records)
- `YEAR`: Current year (4 digits)
- `SEQUENCE`: Auto-incrementing 4-digit number, padded with zeros

| Table | Prefix |
|-------|--------|
| users | USR |
| teachers | TCH |
| training_events | TRN |
| training_records | TRC |
| career_records | CAR |
| event_records | EVT |

**Example:** `TCH-2026-0001`, `TRC-2026-0001`

### Certificate Numbers
Format: `{CATEGORY}-{SECTOR}{PHASE?}-{YEAR}-{SEQUENCE}`

| Category | Code |
|----------|------|
| Activity-based Mathematics | ABM |
| Reading | RED |
| Pre-primary | PRE |

| Sector | Code |
|--------|------|
| Book 1 | B1 |
| Book 2 | B2 |
| Book 3 | B3 |
| Phonics | PHO |
| Guided Reading | GR |
| Book-based Activities | BBA |
| Writing Workshop | WW |

| Phase | Code |
|-------|------|
| Phase 1 | P1 |
| Phase 2 | P2 |

**Examples:**
- `ABM-B1P1-2026-0001` (Activity-based Mathematics, Book 1, Phase 1)
- `RED-GR-2026-0001` (Reading, Guided Reading, no phase)

---

## Database Schema

```
users
  id, email, password, role, createdAt, updatedAt

teachers
  id, userId(FK), name, address, contact, email, gender, imageUrl, dob, createdAt, updatedAt

training_events
  id, category, sector, phase, name, mentorsName, venue, startDate, duration, description, createdAt, updatedAt

training_records
  id, teacherId(FK), trainingEventId(FK), rating, certificateNumber, refPhotos, createdAt, updatedAt

career_records
  id, teacherId(FK), role, oraganization, startDate, endDate, stillWorking, achievements, refContactDetail, createdAt

event_records
  id, teacherId(FK), eventType, name, role, organizer, venue, date, description, referenceImage, createdAt, updatedAt
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
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
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
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | your-cloud-name |
| CLOUDINARY_API_KEY | Cloudinary API key | your-api-key |
| CLOUDINARY_API_SECRET | Cloudinary API secret | your-api-secret |

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
