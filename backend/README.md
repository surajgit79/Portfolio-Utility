# Portfolio Utility - Backend API

Fastify-based REST API for managing teacher portfolios, training records, skills, and certificate generation.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Fastify
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Certificate Generation**: Puppeteer + pdf-lib
- **Validation**: Zod
- **File Upload**: @fastify/multipart (CSV parsing)

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

### Training & Certificates
- Training events with program/module/unit hierarchy
- Training records with rating, feedback, and training date
- **Certificate generation** (PDF) with:
  - Custom design matching frontend React component
  - QR code linking to teacher profile
  - Logo and medal from local assets
  - Dynamic signatories

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

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login (returns access + refresh tokens)
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout

### Teachers
- `GET /api/v1/teachers` - List teachers (with search, pagination)
- `GET /api/v1/teachers/:id` - Get teacher details (includes skills array)
- `POST /api/v1/teachers` - Create teacher (admin only)
- `PATCH /api/v1/teachers/:id` - Update teacher (admin only)
- `DELETE /api/v1/teachers/:id` - Delete teacher (admin only)

### Training Events
- `GET /api/v1/training-events` - List training events
- `GET /api/v1/training-events/:id` - Get training event details
- `POST /api/v1/training-events` - Create training event (admin only)
- `PATCH /api/v1/training-events/:id` - Update training event (admin only)
- `DELETE /api/v1/training-events/:id` - Delete training event (admin only)

### Training Records
- `GET /api/v1/training-records/teacher/:teacherId` - Get records by teacher
- `GET /api/v1/training-records/event/:eventId` - Get records by event
- `POST /api/v1/training-records` - Create training record (admin only)
- `POST /api/v1/training-records/bulk` - Bulk create records (admin only)
- `PATCH /api/v1/training-records/:id` - Update record (rating, feedback, trainingDate)
- `DELETE /api/v1/training-records/:id` - Delete record (admin only)
- `GET /api/v1/training-records/:id/certificate` - Download certificate PDF

### Certificates
- `GET /api/v1/certificates/:certificateNumber` - View certificate details
- `GET /api/v1/certificates/:certificateNumber/download` - Download certificate PDF
- `GET /api/v1/certificates/bulk/:eventId/download` - Bulk download (admin only)

### Skills
- `GET /api/v1/skills` - List skills
- `POST /api/v1/skills` - Create skill with hierarchy validation
- `POST /api/v1/skills/bulk` - Bulk create skills (admin only)

### Teacher Skills
- `POST /api/v1/teacher-skills` - Assign skill to teacher
- `POST /api/v1/teacher-skills/bulk` - Bulk assign skills (admin only)

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

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
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

## Notes

- Certificate PDFs are generated on-the-fly (not saved to storage)
- Teacher skills are returned as a proper array in API responses
- All skills must belong to a valid program → module → unit hierarchy
- CSV uploads validate the hierarchy before inserting
