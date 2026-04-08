import dotenv from "dotenv";
dotenv.config();

import { db, pool } from "./client";
import {
  users,
  teachers,
  trainingEvents,
  trainingRecords,
  careerRecords,
  eventRecords,
} from "./schema";
import { hashedPassword } from "../utils/password";
import { generateCertificateNumber } from "../utils/idGenerator";

const seed = async () => {
  console.log("Cleaning existing data...");

  await db.delete(eventRecords);
  await db.delete(careerRecords);
  await db.delete(trainingRecords);
  await db.delete(trainingEvents);
  await db.delete(teachers);
  await db.delete(users);

  console.log("Seeding users...");

  const adminPassword   = await hashedPassword("Admin1234");
  const teacherPassword = await hashedPassword("Teacher1234");

  await db.insert(users).values({
    id:       "USR-2026-0001",
    email:    "admin@portfolio.com",
    password: adminPassword,
    role:     "admin",
  });

  const teacherUsers = [
    { id: "USR-2026-0002", email: "ram.bahadur@school.com" },
    { id: "USR-2026-0003", email: "sita.sharma@school.com" },
    { id: "USR-2026-0004", email: "hari.thapa@school.com" },
    { id: "USR-2026-0005", email: "gita.rai@school.com" },
    { id: "USR-2026-0006", email: "bikash.karki@school.com" },
  ];

  for (const t of teacherUsers) {
    await db.insert(users).values({
      ...t,
      password: teacherPassword,
      role:     "teacher",
    });
  }

  console.log("Seeding teachers...");

  const teacherProfiles = [
    {
      id:       "TCH-2026-0001",
      userId:   "USR-2026-0002",
      name:     "Ram Bahadur",
      address:  "Kathmandu, Bagmati Province",
      contact:  "9841000001",
      email:    "ram.bahadur@school.com",
      gender:   "Male" as const,
      dob:      new Date("1985-03-15"),
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ram",
    },
    {
      id:       "TCH-2026-0002",
      userId:   "USR-2026-0003",
      name:     "Sita Sharma",
      address:  "Lalitpur, Bagmati Province",
      contact:  "9841000002",
      email:    "sita.sharma@school.com",
      gender:   "Female" as const,
      dob:      new Date("1990-07-22"),
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sita",
    },
    {
      id:       "TCH-2026-0003",
      userId:   "USR-2026-0004",
      name:     "Hari Thapa",
      address:  "Bhaktapur, Bagmati Province",
      contact:  "9841000003",
      email:    "hari.thapa@school.com",
      gender:   "Male" as const,
      dob:      new Date("1988-11-10"),
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hari",
    },
    {
      id:       "TCH-2026-0004",
      userId:   "USR-2026-0005",
      name:     "Gita Rai",
      address:  "Pokhara, Gandaki Province",
      contact:  "9841000004",
      email:    "gita.rai@school.com",
      gender:   "Female" as const,
      dob:      new Date("1992-05-18"),
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gita",
    },
    {
      id:       "TCH-2026-0005",
      userId:   "USR-2026-0006",
      name:     "Bikash Karki",
      address:  "Hetauda, Bagmati Province",
      contact:  "9841000005",
      email:    "bikash.karki@school.com",
      gender:   "Male" as const,
      dob:      new Date("1987-09-25"),
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bikash",
    },
  ];

  for (const profile of teacherProfiles) {
    await db.insert(teachers).values({
      ...profile,
      dob: profile.dob.toISOString().split('T')[0],
    });
  }

  console.log("🌱 Seeding training events...");

  const trainingEventData = [
    {
      id:          "TRN-2026-0001",
      category:    "Activity-based Mathematics" as const,
      sector:      "Book 1",
      phase:       "Phase 1",
      name:        "ABM Book 1 Phase 1 Training",
      mentorsName: "John Doe",
      venue:       "Hetauda, Bagmati Province",
      description: "Comprehensive training on Activity-based Mathematics Book 1 Phase 1",
      startDate:   new Date("2026-01-15"),
      duration:    "3 days",
    },
    {
      id:          "TRN-2026-0002",
      category:    "Activity-based Mathematics" as const,
      sector:      "Book 1",
      phase:       "Phase 2",
      name:        "ABM Book 1 Phase 2 Training",
      mentorsName: "Jane Doe",
      venue:       "Kathmandu, Bagmati Province",
      description: "Comprehensive training on Activity-based Mathematics Book 1 Phase 2",
      startDate:   new Date("2026-02-10"),
      duration:    "3 days",
    },
    {
      id:          "TRN-2026-0003",
      category:    "Reading" as const,
      sector:      "Phonics",
      name:        "Reading Phonics Training",
      mentorsName: "Mary Smith",
      venue:       "Pokhara, Gandaki Province",
      description: "Training on Reading Enhancement through Phonics",
      startDate:   new Date("2026-03-05"),
      duration:    "2 days",
    },
  ];

  for (const event of trainingEventData) {
    await db.insert(trainingEvents).values(event);
  }

  console.log("Seeding training records...");

  const trainingRecordData = [
    { id: "REC-2026-0001", teacherId: "TCH-2026-0001", trainingEventId: "TRN-2026-0001", rating: 4, category: "Activity-based Mathematics", sector: "Book 1", phase: "Phase 1" },
    { id: "REC-2026-0002", teacherId: "TCH-2026-0002", trainingEventId: "TRN-2026-0001", rating: 5, category: "Activity-based Mathematics", sector: "Book 1", phase: "Phase 1" },
    { id: "REC-2026-0003", teacherId: "TCH-2026-0003", trainingEventId: "TRN-2026-0001", rating: 3, category: "Activity-based Mathematics", sector: "Book 1", phase: "Phase 1" },
    { id: "REC-2026-0004", teacherId: "TCH-2026-0001", trainingEventId: "TRN-2026-0002", rating: 4, category: "Activity-based Mathematics", sector: "Book 1", phase: "Phase 2" },
    { id: "REC-2026-0005", teacherId: "TCH-2026-0004", trainingEventId: "TRN-2026-0003", rating: 5, category: "Reading", sector: "Phonics", phase: null },
    { id: "REC-2026-0006", teacherId: "TCH-2026-0005", trainingEventId: "TRN-2026-0003", rating: 4, category: "Reading", sector: "Phonics", phase: null },
  ];

  for (const record of trainingRecordData) {
    const certificateNumber = await generateCertificateNumber(
      record.category,
      record.sector,
      record.phase
    );

    await db.insert(trainingRecords).values({
      id:                record.id,
      teacherId:         record.teacherId,
      trainingEventId:   record.trainingEventId,
      rating:            record.rating,
      certificateNumber,
    });
  }

  console.log("Seeding career records...");

  const careerRecordData = [
    {
      id:           "CAR-2026-0001",
      teacherId:    "TCH-2026-0001",
      role:         "Mathematics Teacher",
      organization: "Hetauda School of Management",
      startDate:    new Date("2020-01-01"),
      stillWorking: 1,
      achievements: "Best teacher award 2022",
      refContactDetail: "principal@hsms.edu.np",
    },
    {
      id:           "CAR-2026-0002",
      teacherId:    "TCH-2026-0002",
      role:         "Science Teacher",
      organization: "Lalitpur Public School",
      startDate:    new Date("2018-04-01"),
      endDate:      new Date("2022-12-31"),
      stillWorking: 0,
      achievements: "Developed new science curriculum",
      refContactDetail: "principal@lps.edu.np",
    },
    {
      id:           "CAR-2026-0003",
      teacherId:    "TCH-2026-0003",
      role:         "English Teacher",
      organization: "Bhaktapur Secondary School",
      startDate:    new Date("2019-07-01"),
      stillWorking: 1,
      achievements: "100% pass rate in 2023",
    },
  ];

  for (const record of careerRecordData) {
    await db.insert(careerRecords).values(record);
  }

  console.log("Seeding event records...");

  const eventRecordData = [
    {
      id:        "EVT-2026-0001",
      teacherId: "TCH-2026-0001",
      eventType: "Seminar" as const,
      name:      "Mathematics Education Seminar 2026",
      role:      "Participant",
      organizer: "Nepal Mathematics Society",
      venue:     "Kathmandu",
      date:      new Date("2026-01-20"),
      description: "Annual seminar on modern mathematics teaching methods",
    },
    {
      id:        "EVT-2026-0002",
      teacherId: "TCH-2026-0002",
      eventType: "Conference" as const,
      name:      "National Education Conference 2026",
      role:      "Speaker",
      organizer: "Ministry of Education Nepal",
      venue:     "Pokhara",
      date:      new Date("2026-02-15"),
      description: "National conference on education reform",
    },
    {
      id:        "EVT-2026-0003",
      teacherId: "TCH-2026-0004",
      eventType: "Podcast" as const,
      name:      "Teaching Innovations Podcast",
      role:      "Guest Speaker",
      organizer: "EduNepal",
      date:      new Date("2026-03-01"),
      description: "Discussion on innovative teaching methods",
    },
  ];

  for (const record of eventRecordData) {
    await db.insert(eventRecords).values(record);
  }

  console.log("Seeding complete!");
  await pool.end();
  process.exit(0);
};

seed().catch(async (err) => {
  console.error("Seeding failed:", err);
  await pool.end();
  process.exit(1);
});