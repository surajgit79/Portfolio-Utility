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
  skills,
  teacherSkills,
  certificates,
  certificateModules,
  bulkJobs,
  gradeEnum,
  programEnum,
} from "./schema";
import { hashedPassword } from "../utils/passwordHasherVerifier";
import { generateCertificateNumber } from "../utils/idGenerator";
import fs from "fs";
import path from "path";
import { parseCSV } from "../utils/csvParser";

const seed = async () => {
  console.log("🧹 Cleaning existing data...");

  // Clean in correct order (respecting foreign keys)
  await db.delete(certificateModules);
  await db.delete(certificates);
  await db.delete(bulkJobs);
  await db.delete(teacherSkills);
  await db.delete(skills);
  await db.delete(eventRecords);
  await db.delete(careerRecords);
  await db.delete(trainingRecords);
  await db.delete(trainingEvents);
  await db.delete(teachers);
  await db.delete(users);

  console.log("🌱 Seeding users...");

  const adminPassword = await hashedPassword("Admin1234");
  const teacherPassword = await hashedPassword("Teacher1234");

  // Admin user
  await db.insert(users).values({
    id: "USR-2026-0001",
    email: "admin@portfolio.com",
    password: adminPassword,
    role: "admin",
  });

  // Teacher users
  const teacherUserData = [
    { id: "USR-2026-0002", email: "bishesh@gmail.com", name: "Bishesh Khatiwada" },
    { id: "USR-2026-0003", email: "anita.gurung@school.com", name: "Anita Gurung" },
    { id: "USR-2026-0004", email: "ramesh.adhikari@school.com", name: "Ramesh Adhikari" },
    { id: "USR-2026-0005", email: "sunita.tamang@school.com", name: "Sunita Tamang" },
    { id: "USR-2026-0006", email: "dipak.shrestha@school.com", name: "Dipak Shrestha" },
    { id: "USR-2026-0007", email: "kabita.rai@school.com", name: "Kabita Rai" },
  ];

  for (const user of teacherUserData) {
    await db.insert(users).values({
      id: user.id,
      email: user.email,
      password: teacherPassword,
      role: "teacher",
    });
  }

  console.log("🌱 Seeding teachers...");

  const teacherData = [
    {
      id: "TCH-2026-0001",
      userId: "USR-2026-0002",
      name: "Bishesh Khatiwada",
      address: "Huprachaur, Hetauda",
      contact: "9876543210",
      email: "bishesh@gmail.com",
      gender: "Male" as const,
      imageUrl: null,
      dob: "1992-01-12",
      qualification: null,
      teachingSince: null,
    },
    {
      id: "TCH-2026-0002",
      userId: "USR-2026-0003",
      name: "Anita Gurung",
      address: "Pokhara, Gandaki Province",
      contact: "9841000007",
      email: "anita.gurung@school.com",
      gender: "Female" as const,
      imageUrl: null,
      dob: "1988-05-20",
      qualification: "M.Ed. in Education",
      teachingSince: 2012,
    },
    {
      id: "TCH-2026-0003",
      userId: "USR-2026-0004",
      name: "Ramesh Adhikari",
      address: "Butwal, Lumbini Province",
      contact: "9841000008",
      email: "ramesh.adhikari@school.com",
      gender: "Male" as const,
      imageUrl: null,
      dob: "1982-11-15",
      qualification: "M.Sc. in Mathematics",
      teachingSince: 2008,
    },
    {
      id: "TCH-2026-0004",
      userId: "USR-2026-0005",
      name: "Sunita Tamang",
      address: "Biratnagar, Koshi Province",
      contact: "9841000009",
      email: "sunita.tamang@school.com",
      gender: "Female" as const,
      imageUrl: null,
      dob: "1995-03-10",
      qualification: "B.Ed. in Science",
      teachingSince: 2019,
    },
    {
      id: "TCH-2026-0005",
      userId: "USR-2026-0006",
      name: "Dipak Shrestha",
      address: "Dharan, Koshi Province",
      contact: "9841000010",
      email: "dipak.shrestha@school.com",
      gender: "Male" as const,
      imageUrl: null,
      dob: "1979-07-25",
      qualification: "M.A. in English Literature",
      teachingSince: 2005,
    },
    {
      id: "TCH-2026-0006",
      userId: "USR-2026-0007",
      name: "Kabita Rai",
      address: "Chitwan, Bagmati Province",
      contact: "9841000011",
      email: "kabita.rai@school.com",
      gender: "Female" as const,
      imageUrl: null,
      dob: "1991-09-30",
      qualification: "B.Ed. in Education",
      teachingSince: 2016,
    },
  ];

  await db.insert(teachers).values(teacherData);

  console.log("🌱 Seeding training events...");

  const trainingEventData = [
    {
      id: "TRN-2026-0001",
      program: "Activity-based Mathematics" as const,
      module: "Class 4",
      unit: "Book 1",
      name: "ABM Class 4 Book 1 Training",
      mentorsName: "John Doe",
      venue: "Hetauda",
      description: "Comprehensive training on Activity-based Mathematics Class 4 Book 1",
      startDate: new Date("2026-01-15"),
      duration: "3 days",
    },
    {
      id: "TRN-2026-0002",
      program: "Activity-based Mathematics" as const,
      module: "Class 4",
      unit: "Book 2",
      name: "ABM Class 4 Book 2 Training",
      mentorsName: "Jane Doe",
      venue: "Kathmandu",
      description: "Comprehensive training on Activity-based Mathematics Class 4 Book 2",
      startDate: new Date("2026-02-10"),
      duration: "3 days",
    },
    {
      id: "TRN-2026-0003",
      program: "Reading & Language" as const,
      module: "Phonics",
      unit: "Set 1",
      name: "R&L Phonics Set 1 Training",
      mentorsName: "Mary Smith",
      venue: "Pokhara",
      description: "Training on Reading & Language Phonics Set 1",
      startDate: new Date("2026-03-05"),
      duration: "2 days",
    },
    {
      id: "TRN-2026-0004",
      program: "Reading & Language" as const,
      module: "Phonics",
      unit: "Set 2",
      name: "R&L Phonics Set 2 Training",
      mentorsName: "Sarah Johnson",
      venue: "Lalitpur",
      description: "Training on Reading & Language Phonics Set 2",
      startDate: new Date("2026-04-10"),
      duration: "2 days",
    },
    {
      id: "TRN-2026-0005",
      program: "Pre-School Transformation" as const,
      module: "Circle Time",
      unit: null,
      name: "PST Circle Time Training",
      mentorsName: "Hari Acharya",
      venue: "Bhaktapur",
      description: "Training on Pre-School Circle Time activities",
      startDate: new Date("2026-05-15"),
      duration: "2 days",
    },
  ];

  await db.insert(trainingEvents).values(trainingEventData);

  console.log("🌱 Seeding training records...");

  const trainingRecordData = [
    // Bishesh Khatiwada
    { id: "TRC-2026-0001", teacherId: "TCH-2026-0001", trainingEventId: "TRN-2026-0001", rating: 4 },
    { id: "TRC-2026-0002", teacherId: "TCH-2026-0001", trainingEventId: "TRN-2026-0002", rating: 5 },
    
    // Anita Gurung
    { id: "TRC-2026-0003", teacherId: "TCH-2026-0002", trainingEventId: "TRN-2026-0001", rating: 5 },
    { id: "TRC-2026-0004", teacherId: "TCH-2026-0002", trainingEventId: "TRN-2026-0003", rating: 4 },
    
    // Ramesh Adhikari
    { id: "TRC-2026-0005", teacherId: "TCH-2026-0003", trainingEventId: "TRN-2026-0002", rating: 4 },
    { id: "TRC-2026-0006", teacherId: "TCH-2026-0003", trainingEventId: "TRN-2026-0004", rating: 5 },
    
    // Sunita Tamang
    { id: "TRC-2026-0007", teacherId: "TCH-2026-0004", trainingEventId: "TRN-2026-0003", rating: 5 },
    { id: "TRC-2026-0008", teacherId: "TCH-2026-0004", trainingEventId: "TRN-2026-0004", rating: 4 },
    
    // Dipak Shrestha
    { id: "TRC-2026-0009", teacherId: "TCH-2026-0005", trainingEventId: "TRN-2026-0001", rating: 3 },
    { id: "TRC-2026-0010", teacherId: "TCH-2026-0005", trainingEventId: "TRN-2026-0005", rating: 5 },
    
    // Kabita Rai
    { id: "TRC-2026-0011", teacherId: "TCH-2026-0006", trainingEventId: "TRN-2026-0003", rating: 4 },
    { id: "TRC-2026-0012", teacherId: "TCH-2026-0006", trainingEventId: "TRN-2026-0005", rating: 5 },
  ];

  await db.insert(trainingRecords).values(trainingRecordData);

  console.log("🌱 Seeding career records...");
  // No career records currently

  console.log("🌱 Seeding event records...");
  // No event records currently

  console.log("🌱 Seeding skills from CSV...");
  const csvPath = path.join(__dirname, "../../skills_test.csv");
  
  if (fs.existsSync(csvPath)) {
    const csvBuffer = fs.readFileSync(csvPath);
    const rows = parseCSV(csvBuffer);

    const skillData = [];
    let skillIdx = 1;

    for (const row of rows) {
      const id = `SKL-2026-${String(skillIdx).padStart(4, "0")}`;
      skillData.push({
        id,
        name: row.name,
        program: row.program as "Activity-based Mathematics" | "Reading & Language" | "Pre-School Transformation",
        module: row.module,
        unit: row.unit || null,
      });
      skillIdx++;
    }

    await db.insert(skills).values(skillData).onConflictDoNothing();
    console.log(`   - Loaded ${skillData.length} skills from CSV`);
  } else {
    console.log("   - skills_test.csv not found, skipping skills import");
  }

  console.log("🌱 Seeding teacher skills...");

  // Assign skills based on teacher training programs
  const teacherSkillData = [
    // Bishesh Khatiwada - ABM Class 4 Books 1 & 2
    { id: "TSK-2026-0001", teacherId: "TCH-2026-0001", skillId: "SKL-2026-0001", trainingRecordId: "TRC-2026-0001" },
    { id: "TSK-2026-0002", teacherId: "TCH-2026-0001", skillId: "SKL-2026-0002", trainingRecordId: "TRC-2026-0002" },
    
    // Anita Gurung - ABM Class 4 Book 1 & R&L Phonics Set 1
    { id: "TSK-2026-0003", teacherId: "TCH-2026-0002", skillId: "SKL-2026-0001", trainingRecordId: "TRC-2026-0003" },
    { id: "TSK-2026-0004", teacherId: "TCH-2026-0002", skillId: "SKL-2026-0119", trainingRecordId: "TRC-2026-0004" },
    
    // Ramesh Adhikari - ABM Class 4 Book 2 & R&L Phonics Set 2
    { id: "TSK-2026-0005", teacherId: "TCH-2026-0003", skillId: "SKL-2026-0032", trainingRecordId: "TRC-2026-0005" },
    { id: "TSK-2026-0006", teacherId: "TCH-2026-0003", skillId: "SKL-2026-0125", trainingRecordId: "TRC-2026-0006" },
    
    // Sunita Tamang - R&L Phonics Set 1 & Set 2
    { id: "TSK-2026-0007", teacherId: "TCH-2026-0004", skillId: "SKL-2026-0119", trainingRecordId: "TRC-2026-0007" },
    { id: "TSK-2026-0008", teacherId: "TCH-2026-0004", skillId: "SKL-2026-0125", trainingRecordId: "TRC-2026-0008" },
    
    // Dipak Shrestha - ABM Class 4 Book 1 & PST Circle Time
    { id: "TSK-2026-0009", teacherId: "TCH-2026-0005", skillId: "SKL-2026-0001", trainingRecordId: "TRC-2026-0009" },
    { id: "TSK-2026-0010", teacherId: "TCH-2026-0005", skillId: "SKL-2026-0186", trainingRecordId: "TRC-2026-0010" },
    
    // Kabita Rai - R&L Phonics Set 1 & PST Circle Time
    { id: "TSK-2026-0011", teacherId: "TCH-2026-0006", skillId: "SKL-2026-0119", trainingRecordId: "TRC-2026-0011" },
    { id: "TSK-2026-0012", teacherId: "TCH-2026-0006", skillId: "SKL-2026-0186", trainingRecordId: "TRC-2026-0012" },
  ];

  await db.insert(teacherSkills).values(teacherSkillData);

  console.log("🌱 Seeding certificates...");

  const certificateData = [
    // Bishesh Khatiwada - ABM Class 4 Books 1 & 2 (2 certificates)
    {
      id: "CRT-2026-0001",
      teacherId: "TCH-2026-0001",
      program: "Activity-based Mathematics" as const,
      certificateNumber: "ABM-2026-0001",
      pdfUrl: null,
      status: "pending" as const,
      errorReason: null,
      issuedAt: new Date(),
    },
    // Anita Gurung - ABM Class 4 Book 1 & R&L Phonics Set 1 (2 certificates)
    {
      id: "CRT-2026-0002",
      teacherId: "TCH-2026-0002",
      program: "Activity-based Mathematics" as const,
      certificateNumber: "ABM-2026-0002",
      pdfUrl: null,
      status: "pending" as const,
      errorReason: null,
      issuedAt: new Date(),
    },
    {
      id: "CRT-2026-0003",
      teacherId: "TCH-2026-0002",
      program: "Reading & Language" as const,
      certificateNumber: "R&L-2026-0001",
      pdfUrl: null,
      status: "pending" as const,
      errorReason: null,
      issuedAt: new Date(),
    },
    // Ramesh Adhikari - ABM Class 4 Book 2 & R&L Phonics Set 2
    {
      id: "CRT-2026-0004",
      teacherId: "TCH-2026-0003",
      program: "Activity-based Mathematics" as const,
      certificateNumber: "ABM-2026-0003",
      pdfUrl: null,
      status: "pending" as const,
      errorReason: null,
      issuedAt: new Date(),
    },
    {
      id: "CRT-2026-0005",
      teacherId: "TCH-2026-0003",
      program: "Reading & Language" as const,
      certificateNumber: "R&L-2026-0002",
      pdfUrl: null,
      status: "pending" as const,
      errorReason: null,
      issuedAt: new Date(),
    },
    // Sunita Tamang - R&L Phonics Set 1 & Set 2
    {
      id: "CRT-2026-0006",
      teacherId: "TCH-2026-0004",
      program: "Reading & Language" as const,
      certificateNumber: "R&L-2026-0003",
      pdfUrl: null,
      status: "pending" as const,
      errorReason: null,
      issuedAt: new Date(),
    },
    // Dipak Shrestha - ABM Class 4 Book 1 & PST Circle Time
    {
      id: "CRT-2026-0007",
      teacherId: "TCH-2026-0005",
      program: "Activity-based Mathematics" as const,
      certificateNumber: "ABM-2026-0004",
      pdfUrl: null,
      status: "pending" as const,
      errorReason: null,
      issuedAt: new Date(),
    },
    {
      id: "CRT-2026-0008",
      teacherId: "TCH-2026-0005",
      program: "Pre-School Transformation" as const,
      certificateNumber: "PST-2026-0001",
      pdfUrl: null,
      status: "pending" as const,
      errorReason: null,
      issuedAt: new Date(),
    },
    // Kabita Rai - R&L Phonics Set 1 & PST Circle Time
    {
      id: "CRT-2026-0009",
      teacherId: "TCH-2026-0006",
      program: "Reading & Language" as const,
      certificateNumber: "R&L-2026-0004",
      pdfUrl: null,
      status: "pending" as const,
      errorReason: null,
      issuedAt: new Date(),
    },
    {
      id: "CRT-2026-0010",
      teacherId: "TCH-2026-0006",
      program: "Pre-School Transformation" as const,
      certificateNumber: "PST-2026-0002",
      pdfUrl: null,
      status: "pending" as const,
      errorReason: null,
      issuedAt: new Date(),
    },
  ];

  await db.insert(certificates).values(certificateData);

  console.log("🌱 Seeding certificate modules...");

  const certificateModuleData = [
    // Bishesh Khatiwada - ABM Certificate
    {
      id: "CMO-2026-0001",
      certificateId: "CRT-2026-0001",
      trainingRecordId: "TRC-2026-0001",
      module: "Class 4",
      unit: "Book 1",
      completedAt: new Date("2026-05-06T08:31:47.034Z"),
    },
    {
      id: "CMO-2026-0002",
      certificateId: "CRT-2026-0001",
      trainingRecordId: "TRC-2026-0002",
      module: "Class 4",
      unit: "Book 2",
      completedAt: new Date(),
    },
    // Anita Gurung - ABM Certificate
    {
      id: "CMO-2026-0003",
      certificateId: "CRT-2026-0002",
      trainingRecordId: "TRC-2026-0003",
      module: "Class 4",
      unit: "Book 1",
      completedAt: new Date(),
    },
    // Anita Gurung - R&L Certificate
    {
      id: "CMO-2026-0004",
      certificateId: "CRT-2026-0003",
      trainingRecordId: "TRC-2026-0004",
      module: "Phonics",
      unit: "Set 1",
      completedAt: new Date(),
    },
    // Ramesh Adhikari - ABM Certificate
    {
      id: "CMO-2026-0005",
      certificateId: "CRT-2026-0004",
      trainingRecordId: "TRC-2026-0005",
      module: "Class 4",
      unit: "Book 2",
      completedAt: new Date(),
    },
    // Ramesh Adhikari - R&L Certificate
    {
      id: "CMO-2026-0006",
      certificateId: "CRT-2026-0005",
      trainingRecordId: "TRC-2026-0006",
      module: "Phonics",
      unit: "Set 2",
      completedAt: new Date(),
    },
    // Sunita Tamang - R&L Certificate
    {
      id: "CMO-2026-0007",
      certificateId: "CRT-2026-0006",
      trainingRecordId: "TRC-2026-0007",
      module: "Phonics",
      unit: "Set 1",
      completedAt: new Date(),
    },
    // Sunita Tamang - R&L Certificate (Set 2)
    {
      id: "CMO-2026-0008",
      certificateId: "CRT-2026-0006",
      trainingRecordId: "TRC-2026-0008",
      module: "Phonics",
      unit: "Set 2",
      completedAt: new Date(),
    },
    // Dipak Shrestha - ABM Certificate
    {
      id: "CMO-2026-0009",
      certificateId: "CRT-2026-0007",
      trainingRecordId: "TRC-2026-0009",
      module: "Class 4",
      unit: "Book 1",
      completedAt: new Date(),
    },
    // Dipak Shrestha - PST Certificate
    {
      id: "CMO-2026-0010",
      certificateId: "CRT-2026-0008",
      trainingRecordId: "TRC-2026-0010",
      module: "Circle Time",
      unit: null,
      completedAt: new Date(),
    },
    // Kabita Rai - R&L Certificate
    {
      id: "CMO-2026-0011",
      certificateId: "CRT-2026-0009",
      trainingRecordId: "TRC-2026-0011",
      module: "Phonics",
      unit: "Set 1",
      completedAt: new Date(),
    },
    // Kabita Rai - PST Certificate
    {
      id: "CMO-2026-0012",
      certificateId: "CRT-2026-0010",
      trainingRecordId: "TRC-2026-0012",
      module: "Circle Time",
      unit: null,
      completedAt: new Date(),
    },
  ];

  await db.insert(certificateModules).values(certificateModuleData);

  console.log("🌱 Seeding bulk jobs...");
  // Bulk jobs are created dynamically, not seeded

  console.log("✅ Seeding complete!");
  console.log(`   - Users: ${teacherUserData.length + 1}`);
  console.log(`   - Teachers: ${teacherData.length}`);
  console.log(`   - Training Events: ${trainingEventData.length}`);
  console.log(`   - Training Records: ${trainingRecordData.length}`);
  console.log(`   - Certificates: ${certificateData.length}`);
  console.log(`   - Certificate Modules: ${certificateModuleData.length}`);
  console.log(`   - Teacher Skills: ${teacherSkillData.length}`);

  await pool.end();
  process.exit(0);
};

seed().catch(async (err) => {
  console.error("❌ Seeding failed:", err);
  await pool.end();
  process.exit(1);
});
