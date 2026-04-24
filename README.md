# Portfolio Utility

A full-stack Teacher Portfolio Management System for managing teacher profiles, training history, career records, event participation, and certificate generation.

---

## Features

- **Authentication** — JWT-based auth with role-based access control (Admin/Teacher)
- **Teacher Management** — CRUD operations with profile images via Cloudinary
- **Training Programs** — Create and manage training programs with modules and units
- **Training Records** — Track teacher participation with auto-generated certificate numbers
- **Career Records** — Manage professional history and achievements
- **Event Records** — Track seminar, conference, podcast participation
- **Certificate Generation** — PDF certificates with professional templates using Puppeteer
- **Image Upload** — Cloudinary integration for image storage
- **Search & Filter** — Search teachers and filter training programs
- **Rate Limiting** — API protection with Fastify rate-limit
- **CSV Bulk Import** — Bulk teacher registration via CSV upload

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
DATABASE_URL=your-postgres-db-url
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
http://localhost:3000/api/v1
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
| POST | `/auth/login` | Login & get tokens | Public |
| POST | `/auth/refresh` | Refresh access token | Public |
| POST | `/auth/logout` | Logout & invalidate refresh token | Public |

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

**Login/Refresh Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "a1b2c3d4e5f6..."
  }
}
```

**Logout Request:**
```json
{
  "refreshToken": "a1b2c3d4e5f6..."
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
| POST | `/teachers/bulk` | Bulk import via CSV | Admin |

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
| qualification | string | No |
| teachingSince | number | No |
| image | file | No |

---

### Training Programs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/training-events` | List all programs | Protected |
| GET | `/training-events/:id` | Get program by ID | Protected |
| POST | `/training-events` | Create program | Admin |
| PATCH | `/training-events/:id` | Update program | Admin |
| DELETE | `/training-events/:id` | Delete program | Admin |

**Create Program Request:**
```json
{
  "program": "Activity-based Mathematics",
  "module": "Book 1",
  "unit": "Phase 1",
  "name": "Training on Basic Math Concepts",
  "mentorsName": "John Doe",
  "venue": "Conference Hall A",
  "startDate": "2026-05-01",
  "duration": "3 days",
  "description": "Introduction to activity-based mathematics"
}
```

**Programs:** `Activity-based Mathematics`, `Reading & Language`, `Pre-School Transformation`

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
  "rating": 4,
  "feedback": "Excellent participation",
  "skills": ["Communication", "Leadership"]
}
```

**Bulk Create Request:**
```json
{
  "trainingEventId": "TRN-2026-0001",
  "teacherIds": ["TCH-2026-0001", "TCH-2026-0002"],
  "rating": 5,
  "feedback": "Great learning experience",
  "skills": ["Math", "Teaching"]
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
  "grade": "Grade 5",
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

**Grades:** `Nursery`, `LKG`, `UKG`, `Grade 1` - `Grade 10`

---

### Certificates

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/certificates/:certificateNumber` | View certificate | Protected |
| GET | `/certificates/:certificateNumber/download` | Download PDF | Protected |
| GET | `/certificates/bulk/:eventId/download` | Bulk download PDFs | Protected |

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
| dob | DATE | NOT NULL |
| qualification | TEXT | |
| teaching_since | INTEGER | |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### Training Events
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PK |
| program | ENUM | NOT NULL |
| module | TEXT | NOT NULL |
| unit | TEXT | |
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
| feedback | TEXT | |
| skills | TEXT[] | DEFAULT '{}' |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### Career Records
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PK |
| teacher_id | TEXT | FK → teachers |
| role | TEXT | NOT NULL |
| organization | TEXT | NOT NULL |
| grade | ENUM | |
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

### Refresh Tokens
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PK |
| user_id | TEXT | FK → users, NOT NULL |
| token | TEXT | UNIQUE, NOT NULL |
| expires_at | TIMESTAMP | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |

---

## ID Generation

### Record IDs
Format: `{PREFIX}-{YEAR}-{SEQUENCE}`

| Table | Prefix |
|-------|--------|
| users | USR |
| teachers | TCH |
| training_events | TRN |
| training_records | REC |
| career_records | CAR |
| event_records | EVT |

**Examples:** `TCH-2026-0001`, `CAR-2026-0001`

### Certificate Numbers
Format: `{PROGRAM}-{MODULE}{UNIT?}-{YEAR}-{SEQUENCE}`

**Examples:**
- `ABM-B1P1-2026-0001` — Activity-based Mathematics, Book 1, Phase 1
- `RL-GR-2026-0001` — Reading & Language, Guided Reading
- `PRE-BBA-2026-0001` — Pre-School Transformation, Book-based Activities

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
| JWT_EXPIRES_IN | Access token expiry | No (default: 7d) |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiry | No (default: 7d) |
| FRONTEND_URL | CORS origin | No |
| CLOUDINARY_CLOUD_NAME | Cloud storage | Yes |
| CLOUDINARY_API_KEY | Cloud storage | Yes |
| CLOUDINARY_API_SECRET | Cloud storage | Yes |

### Frontend
| Variable | Description | Required |
|----------|-------------|----------|
| NEXT_PUBLIC_API_URL | Backend URL | Yes |

---

## Future Enhancements

### Planned Features

- **Teacher Tenure Tracking** — Track and manage teacher tenure periods
- **Dashboard Analytics** — Visual statistics and insights
- **Bulk Export** — Export teacher data and records to CSV/Excel
- **Email Notifications** — Automated email alerts
- **Multi-year Archive** — Archive historical training records
- **Role-based Views** — Customized dashboards
- **Progress Reports** — Generate performance reports

---

## Troubleshooting

### Database Tables Not Found
```bash
npm run db:push
```

### Migration Conflicts
```bash
npm run db:generate
npm run db:push --force
```

### Cloudinary Upload Fails
Ensure your Cloudinary credentials are correct.

---

## License

ISC

---

## Contributors

- **Bishesh Khatiwada** — UI/UX Design
- **Piyush Lal Shrestha** — Frontend Development
- **Suraj Gupta** — Backend Development