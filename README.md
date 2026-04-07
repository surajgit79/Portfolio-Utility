# Portfolio Utility

A full-stack Teacher Portfolio Management System for managing teacher profiles, training history, career records, event participation, and certificate generation.

---

## Features

- **Authentication** — JWT-based auth with role-based access control (Admin/Teacher)
- **Teacher Management** — CRUD operations with profile images via Cloudinary
- **Training Events** — Create and manage training programs with categories and phases
- **Training Records** — Track teacher participation with auto-generated certificate numbers
- **Career Records** — Manage professional history and achievements
- **Event Records** — Track seminar, conference, podcast participation
- **Certificate Generation** — PDF certificates with professional templates using Puppeteer
- **Image Upload** — Cloudinary integration for image storage
- **Search & Filter** — Search teachers and filter training events

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| TypeScript | Type safety |
| Fastify | HTTP framework |
| Drizzle ORM | Database ORM |
| PostgreSQL | Database |
| JWT | Authentication |
| Zod | Validation |
| bcryptjs | Password hashing |
| Cloudinary | Image storage |
| Puppeteer | PDF generation |

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js | React framework |
| TypeScript | Type safety |
| TailwindCSS | Styling |
| shadcn/ui | UI components |

---

## Project Structure

```
Portfolio-Utility/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── db/              # Database client, schema, seed
│   │   ├── middlewares/     # Auth & role middleware
│   │   ├── repositories/    # Data access layer
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript declarations
│   │   ├── utils/           # Helpers (JWT, validation, etc.)
│   │   ├── app.ts           # Fastify app setup
│   │   └── index.ts         # Entry point
│   ├── docker-compose.yml
│   ├── drizzle.config.ts
│   └── package.json
└── frontend/
    ├── app/
    ├── components/
    ├── public/
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v20+
- Docker Desktop
- Git

### Backend Setup

```bash
# Clone repository
git clone https://github.com/surajgit79/Portfolio-Utility.git
cd Portfolio-Utility/backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

Configure your `.env` file:
```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio_utility
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3001
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Start PostgreSQL:
```bash
docker compose up -d
```

Initialize database:
```bash
npm run db:push
npm run db:seed  # Optional: seed test data
```

Start server:
```bash
npm run dev
```

Server runs at `http://localhost:3000`

### Frontend Setup

```bash
cd ../frontend

npm install
cp .env.example .env.local
```

Configure `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Start server:
```bash
npm run dev
```

Frontend runs at `http://localhost:3001`

---

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All protected routes require:
```
Authorization: Bearer <token>
```

---

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register admin user | Public |
| POST | `/auth/login` | Login & get token | Public |

**Register Request:**
```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

**Login Request:**
```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Teachers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/teachers` | List all teachers | Public |
| GET | `/teachers/:id` | Get teacher by ID | Public |
| POST | `/teachers/register` | Create teacher | Admin |
| PATCH | `/teachers/:id` | Update teacher | Admin |
| DELETE | `/teachers/:id` | Delete teacher | Admin |

**Create Teacher (Multipart):**
```
Content-Type: multipart/form-data
```

| Field | Type | Required |
|-------|------|----------|
| email | string | Yes |
| password | string | Yes |
| name | string | Yes |
| address | string | Yes |
| contact | string (10 digits) | Yes |
| gender | Male/Female/Others | Yes |
| dob | ISO date string | Yes |
| image | file | No |

---

### Training Events

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/training-events` | List all events | Protected |
| GET | `/training-events/:id` | Get event by ID | Protected |
| POST | `/training-events` | Create event | Admin |
| PATCH | `/training-events/:id` | Update event | Admin |
| DELETE | `/training-events/:id` | Delete event | Admin |

**Create Event Request:**
```json
{
  "category": "Activity-based Mathematics",
  "sector": "Book 1",
  "phase": "Phase 1",
  "name": "Training on Basic Math Concepts",
  "mentorsName": "John Doe",
  "venue": "Conference Hall A",
  "startDate": "2026-05-01",
  "duration": "3 days",
  "description": "Introduction to activity-based mathematics"
}
```

**Categories:** `Activity-based Mathematics`, `Pre-School`, `Reading`

---

### Training Records

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/training-records/teacher/:teacherId` | Records by teacher | Protected |
| GET | `/training-records/event/:eventId` | Records by event | Protected |
| POST | `/training-records` | Create record | Admin |
| POST | `/training-records/bulk` | Bulk create | Admin |
| PATCH | `/training-records/:id` | Update record | Admin |
| DELETE | `/training-records/:id` | Delete record | Admin |

**Create Record Request:**
```json
{
  "teacherId": "TCH-2026-0001",
  "trainingEventId": "TRN-2026-0001",
  "rating": 4
}
```

**Bulk Create Request:**
```json
{
  "trainingEventId": "TRN-2026-0001",
  "teacherIds": ["TCH-2026-0001", "TCH-2026-0002"],
  "rating": 5
}
```

---

### Career Records

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/career-records/teacher/:teacherId` | Records by teacher | Protected |
| GET | `/career-records/:id` | Get record by ID | Protected |
| POST | `/career-records` | Create record | Admin |
| PATCH | `/career-records/:id` | Update record | Admin |
| DELETE | `/career-records/:id` | Delete record | Admin |

**Create Record Request:**
```json
{
  "teacherId": "TCH-2026-0001",
  "role": "Senior Teacher",
  "organization": "ABC School",
  "startDate": "2020-01-15",
  "endDate": "2024-06-30",
  "stillWorking": 0,
  "achievements": "Best Teacher Award 2023",
  "refContactDetail": "contact@abcschool.com"
}
```

---

### Event Records

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/event-records/teacher/:teacherId` | Records by teacher | Protected |
| GET | `/event-records/:id` | Get record by ID | Protected |
| POST | `/event-records` | Create record | Admin |
| PATCH | `/event-records/:id` | Update record | Admin |
| DELETE | `/event-records/:id` | Delete record | Admin |

**Create Record Request:**
```json
{
  "teacherId": "TCH-2026-0001",
  "eventType": "Conference",
  "name": "Education Summit 2026",
  "role": "Speaker",
  "organizer": "Education Ministry",
  "venue": "Kathmandu",
  "date": "2026-03-15",
  "description": "Spoke about modern teaching methods"
}
```

**Event Types:** `Seminar`, `Conference`, `Panel Discussion`, `Podcast`

---

### Certificates

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/certificates/:certificateNumber` | View certificate | Protected |
| GET | `/certificates/:certificateNumber/download` | Download PDF | Protected |

---

## Database Schema

### Users
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PK |
| email | TEXT | UNIQUE, NOT NULL |
| password | TEXT | NOT NULL |
| role | TEXT | NOT NULL, DEFAULT 'teacher' |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### Teachers
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PK |
| user_id | TEXT | FK → users, UNIQUE |
| name | TEXT | NOT NULL |
| address | TEXT | NOT NULL |
| contact | TEXT | NOT NULL |
| email | TEXT | UNIQUE, NOT NULL |
| gender | ENUM | NOT NULL |
| image_url | TEXT | |
| dob | TIMESTAMP | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### Training Events
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PK |
| category | ENUM | NOT NULL |
| sector | TEXT | NOT NULL |
| phase | TEXT | |
| name | TEXT | NOT NULL |
| mentors_name | TEXT | |
| venue | TEXT | |
| start_date | TIMESTAMP | NOT NULL |
| duration | TEXT | NOT NULL |
| description | TEXT | |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### Training Records
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PK |
| teacher_id | TEXT | FK → teachers |
| training_event_id | TEXT | FK → training_events |
| rating | INTEGER | NOT NULL |
| certificate_number | TEXT | UNIQUE, NOT NULL |
| ref_photos | TEXT | |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### Career Records
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PK |
| teacher_id | TEXT | FK → teachers |
| role | TEXT | NOT NULL |
| organization | TEXT | NOT NULL |
| start_date | TIMESTAMP | NOT NULL |
| end_date | TIMESTAMP | |
| still_working | INTEGER | NOT NULL, DEFAULT 0 |
| achievements | TEXT | |
| ref_contact | TEXT | |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### Event Records
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PK |
| teacher_id | TEXT | FK → teachers |
| event_type | ENUM | NOT NULL |
| name | TEXT | NOT NULL |
| role | TEXT | NOT NULL |
| organizer | TEXT | NOT NULL |
| venue | TEXT | |
| date | TIMESTAMP | NOT NULL |
| description | TEXT | |
| reference_image | TEXT | |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

---

## ID Generation

### Record IDs
Format: `{PREFIX}-{YEAR}-{SEQUENCE}`

| Table | Prefix |
|-------|--------|
| users | USR |
| teachers | TCH |
| training_events | TRN |
| training_records | TRC |
| career_records | CAR |
| event_records | EVT |

**Examples:** `TCH-2026-0001`, `CAR-2026-0001`

### Certificate Numbers
Format: `{CATEGORY}-{SECTOR}{PHASE?}-{YEAR}-{SEQUENCE}`

**Examples:**
- `ABM-B1P1-2026-0001` — Activity-based Math, Book 1, Phase 1
- `RED-GR-2026-0001` — Reading, Guided Reading
- `PRE-BBA-2026-0001` — Pre-School, Book-based Activities

---

## Seed Data

Run `npm run db:seed` to create:

**Admin User:**
- Email: `admin@portfolio.com`
- Password: `Admin1234`

**Teacher Users:**
- `ram.bahadur@school.com` / `Teacher1234`
- `sita.sharma@school.com` / `Teacher1234`
- `hari.thapa@school.com` / `Teacher1234`
- `gita.rai@school.com` / `Teacher1234`
- `bikash.karki@school.com` / `Teacher1234`

---

## Scripts

### Backend
```bash
npm run dev          # Development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to DB
npm run db:migrate   # Apply migrations
npm run db:studio    # Drizzle Studio
npm run db:seed      # Seed database
```

### Frontend
```bash
npm run dev          # Development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## Git Workflow

### Branch Naming
```
feat/feature-name
fix/bug-description
chore/refactor-name
```

### Commit Format
```
<type>(<scope>): <description>

Types: feat, fix, refactor, chore, docs, test
```

### Examples
```
feat(auth): add JWT login
fix(teacher): correct validation
chore(db): add migration
docs(readme): update API docs
```

---

## Environment Variables

### Backend
| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | No (default: 3000) |
| DATABASE_URL | PostgreSQL connection string | Yes |
| JWT_SECRET | JWT signing secret | Yes |
| JWT_EXPIRES_IN | Token expiry | No (default: 7d) |
| FRONTEND_URL | CORS origin | No |
| CLOUDINARY_CLOUD_NAME | Cloud storage | Yes |
| CLOUDINARY_API_KEY | Cloud storage | Yes |
| CLOUDINARY_API_SECRET | Cloud storage | Yes |

### Frontend
| Variable | Description | Required |
|----------|-------------|----------|
| NEXT_PUBLIC_API_URL | Backend URL | Yes |

---

## Troubleshooting

### Database Tables Not Found
If tables are missing after setup:
```bash
npm run db:push
```

### Migration Conflicts
If you encounter schema conflicts:
```bash
npm run db:generate
# Then manually apply SQL or use:
npm run db:push --force
```

### Cloudinary Upload Fails
Ensure your Cloudinary credentials are correct and the cloud name matches exactly.

---

## License

ISC

---

## Contributors

- **Bishesh Khatiwada** — UI/UX Design
- **Piyush Lal Shrestha** — Frontend Development
- **Suraj Gupta** — Backend Development
