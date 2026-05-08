# Portfolio Utility - Backend API

Fastify-based REST API for managing teacher portfolios, training records, skills, and certificate generation.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Fastify
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Certificate Generation**: Puppeteer + pdf-lib
- **File Storage**: S3-compatible storage (MinIO)
- **Validation**: Zod
- **File Upload**: @fastify/multipart (CSV parsing)
- **Scheduling**: node-cron

## Database Schema Hierarchy

```
Program (Activity-based Mathematics | Reading & Language | Pre-School Transformation)
├── Module (e.g., Class 4, Phonics, Circle Time)
│   ├── Unit (e.g., Book 1, Set 1) [Required for ABM, optional for others]
│   │   └── Skills (e.g., Exploring Geometry, s, ai)
│   │       └── TeacherSkills (maps teachers to skills)
│   └── Skills (if no unit)
└── TrainingEvent (training session under program/module/unit)
    └── TrainingRecord (teacher attendance + certificate)
        ├── rating, feedback, trainingDate
        └── skills (array of skill names covered in training)
```

## Features

### Teacher Management
- CRUD operations for teachers
- Career records tracking (organizations, roles, grades)
- Event records (seminars, conferences, podcasts)
- Skills assignment via normalized `teacherSkills` table
- Bulk teacher CSV import with validation

### Training & Certificates
- Training events with program/module/unit hierarchy
- Training records with rating, feedback, and training date
- **Async certificate generation** (PDF) with:
  - Custom design matching frontend React component
  - QR code linking to teacher profile
  - Logo and medal from local assets
  - Dynamic signatories
  - Status tracking (pending → generating → ready / failed)
  - Stored in S3-compatible storage (MinIO)
- **Bulk certificate generation** — merge individual certificates into a single PDF
- **Cron-based processing** — pending certificates processed automatically every minute
- **Manual retry** — reset failed certificates for regeneration

### Skills Management
- Skills must follow program → module → unit hierarchy
- Validation enforces:
  - `Activity-based Mathematics` → unit **required**
  - `Reading & Language` → unit optional (validated against module)
  - `Pre-School Transformation` → unit not applicable
- CSV upload support with validation

### CSV Upload Endpoints
- `POST /api/v1/upload/teachers` - Bulk teacher creation
- `POST /api/v1/upload/career-records` - Bulk career records
- `POST /api/v1/upload/event-records` - Bulk event records
- `POST /api/v1/upload/training-records` - Bulk training records
- `POST /api/v1/upload/skills` - Bulk skills import (from `skills_test.csv`)
- `POST /api/v1/upload/teacher-skills` - Bulk teacher skill assignments

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login (returns access + refresh tokens)
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout

### Teachers
- `GET /teachers` - List teachers (with search, pagination)
- `GET /teachers/:id` - Get teacher details (includes skills array)
- `POST /teachers` - Create teacher (admin only)
- `PATCH /teachers/:id` - Update teacher (admin only)
- `DELETE /teachers/:id` - Delete teacher (admin only)

### Training Events
- `GET /training-events` - List training events
- `GET /training-events/:id` - Get training event details
- `POST /training-events` - Create training event (admin only)
- `PATCH /training-events/:id` - Update training event (admin only)
- `DELETE /training-events/:id` - Delete training event (admin only)

### Training Records
- `GET /training-records/teacher/:teacherId` - Get records by teacher
- `GET /training-records/event/:eventId` - Get records by event
- `POST /training-records` - Create training record (admin only)
- `POST /training-records/bulk` - Bulk create records (admin only)
- `PATCH /training-records/:id` - Update record (rating, feedback, trainingDate)
- `DELETE /training-records/:id` - Delete record (admin only)
- `GET /training-records/:id/certificate` - Download certificate PDF

### Certificates
- `GET /certificates/:certificateNumber` - View certificate details
- `GET /certificates/:certificateNumber/download` - Download certificate PDF
- `POST /certificates/bulk/:eventId` - Trigger bulk generation (admin only)
- `GET /certificates/bulk/status/:jobId` - Get bulk job status
- `GET /certificates/bulk/download/:jobId` - Download bulk PDF by job (admin only)
- `GET /certificates/bulk/event/:eventId/download` - Download bulk PDF by event (admin only)
- `POST /certificates/trigger-cron` - Manually trigger certificate processing (admin only)
- `POST /certificates/reset-certificate/:certificateNumber` - Reset certificate to pending (admin only)
- `POST /certificates/retry/:certificateNumber` - Retry failed certificate (admin only)

### Skills
- `GET /skills` - List skills
- `POST /skills` - Create skill with hierarchy validation
- `POST /skills/bulk` - Bulk create skills (admin only)

### Teacher Skills
- `POST /teacher-skills` - Assign skill to teacher
- `POST /teacher-skills/bulk` - Bulk assign skills (admin only)

## Environment Variables

Create a `.env` file in the backend root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Frontend (for QR code generation)
FRONTEND_URL=http://localhost:3000

# S3 / MinIO (for file uploads and certificate PDF storage)
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET=portfolio-utility
S3_PUBLIC_URL=http://localhost:9000/portfolio-utility
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Create `.env` file with the variables above.

3. **Push database schema:**
   ```bash
   npm run db:push
   ```

4. **Seed the database:**
   ```bash
   npm run db:seed
   ```
   This loads:
   - 25 teachers with user accounts
   - 3 training events
   - ~36 training records with certificates
   - Skills from `skills_test.csv`
   - Career and event records

5. **Start development server:**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:3000`

6. **Install Chrome for Puppeteer (for certificate generation):**
   ```bash
   npx puppeteer browsers install chrome
   ```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm run start` - Run compiled JavaScript
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with test data
- `npm run test` - Run tests

## Certificate Processing Flow

1. **Creation** — When a training record is created, the system creates/updates a certificate record with status `pending`.
2. **Cron processing** — Every minute, a cron job picks up pending certificates:
   - Updates status to `generating`
   - Generates PDF via Puppeteer
   - Uploads PDF to S3/MinIO
   - Updates status to `ready` (or `failed` on error)
3. **Bulk jobs** — Admin triggers bulk generation for an event, creating a `bulk_jobs` record.
4. **Bulk processing** — The bulk cron job merges ready individual PDFs into a single PDF and uploads to S3.
5. **Download** — Endpoints check status before returning the PDF URL or throwing appropriate errors.

## Notes

- Certificate PDFs are generated asynchronously and stored in S3/MinIO
- Teacher skills are returned as a proper array in API responses
- All skills must belong to a valid program → module → unit hierarchy
- CSV uploads validate the hierarchy before inserting
- The `generatePDF` and `bulkGeneratePDF` service methods generate PDFs synchronously (on-the-fly) without status tracking, used by the legacy training records certificate endpoint
