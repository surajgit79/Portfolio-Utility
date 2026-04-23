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
import { hashedPassword } from "../utils/passwordHasherVerifier";
import { generateCertificateNumber } from "../utils/idGenerator";

const seed = async () => {
  console.log("🧹 Cleaning existing data...");

  await db.delete(eventRecords);
  await db.delete(careerRecords);
  await db.delete(trainingRecords);
  await db.delete(trainingEvents);
  await db.delete(teachers);
  await db.delete(users);

  console.log("🌱 Seeding users...");

  const adminPassword   = await hashedPassword("Admin1234");
  const teacherPassword = await hashedPassword("Teacher1234");

  await db.insert(users).values({
    id:       "USR-2026-0001",
    email:    "admin@portfolio.com",
    password: adminPassword,
    role:     "admin",
  });

  const teacherNames = [
    "Ram Bahadur", "Sita Sharma", "Hari Thapa", "Gita Rai", "Bikash Karki",
    "Nirmala Acharya", "Rajesh Kumar", "Priya Gurung", "Suresh Yadav", "Anita Tamang",
    "Mohan Singh", "Laxmi Kumari", "Bijay Rana", "Sarita Magar", "Dinesh Khatri",
    "Kalpana Shrestha", "Ashok Tamang", "Mina Nepali", "Raj Kumar", "Sita Kumari",
    "Nabin Joshi", "Rita Bhatta", "Sanjay Maharjan", "Usha Ranjit", "Pawan K.C.",
    "Sunita Tamang", "Rakesh Shrestha", "Nisha Khadka", "Sanjay Basnet", "Asha Rana",
    "Prakash Oli", "Mina Kumari", "Niraj Shrestha"
  ];

  const provinces = ["Kathmandu, Bagmati Province", "Lalitpur, Bagmati Province", "Bhaktapur, Bagmati Province", "Pokhara, Gandaki Province", "Hetauda, Bagmati Province", "Biratnagar, Province 1", "Birgunj, Province 2", "Nepalgunj, Lumbini Province", "Dang, Lumbini Province", "Chitwan, Bagmati Province"];
  const qualifications = ["M.Sc. in Mathematics", "B.Ed. in Science", "M.A. in English Literature", "B.A. in Education", "M.Ed. in Educational Leadership", "Ph.D. in Education", "M.Com in Accounts", "B.Sc. in Physics", "M.A. in Nepali", "Bachelor in Computer Science"];
  const genders: Array<"Male" | "Female" | "Others"> = ["Male", "Female", "Female", "Male", "Male", "Female", "Male", "Female", "Male", "Female"];

  const teacherUsers = teacherNames.map((name, i) => {
    const idx = String(i + 2).padStart(4, "0");
    const email = name.toLowerCase().replace(/ /g, ".") + "@school.com";
    return { id: `USR-2026-${idx}`, email, name };
  });

  for (const t of teacherUsers) {
    await db.insert(users).values({
      id:       t.id,
      email:    t.email,
      password: teacherPassword,
      role:     "teacher",
    });
  }

  console.log("🌱 Seeding teachers...");

  const teacherProfiles = teacherNames.map((name, i) => {
    const idx = String(i + 2).padStart(4, "0");
    const email = name.toLowerCase().replace(/ /g, ".") + "@school.com";
    return {
      id:            `TCH-2026-${idx}`,
      userId:        `USR-2026-${idx}`,
      name,
      address:       provinces[i % provinces.length],
      contact:       `9841${String(100000 + i).slice(-6)}`,
      email,
      gender:        genders[i % genders.length],
      imageUrl:      `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/ /g, "")}`,
      qualification: qualifications[i % qualifications.length],
      teachingSince: Math.min(2005 + i, new Date().getFullYear()),
      dob:           `${1980 + (i % 15)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    };
  });

  for (const profile of teacherProfiles) {
    await db.insert(teachers).values(profile);
  }

  console.log("🌱 Seeding training events...");

  const trainingEventData = [
    {
      id:          "TRN-2026-0001",
      program:     "Activity-based Mathematics" as const,
      module:      "Class 4",
      unit:        "Book 1",
      name:        "ABM Class 4 Book 1 Training",
      mentorsName: "John Doe",
      venue:       "Hetauda, Bagmati Province",
      description: "Comprehensive training on Activity-based Mathematics Class 4 Book 1",
      startDate:   new Date("2026-01-15"),
      duration:    "3 days",
    },
    {
      id:          "TRN-2026-0002",
      program:     "Activity-based Mathematics" as const,
      module:      "Class 4",
      unit:        "Book 2",
      name:        "ABM Class 4 Book 2 Training",
      mentorsName: "Jane Doe",
      venue:       "Kathmandu, Bagmati Province",
      description: "Comprehensive training on Activity-based Mathematics Class 4 Book 2",
      startDate:   new Date("2026-02-10"),
      duration:    "3 days",
    },
    {
      id:          "TRN-2026-0003",
      program:     "Reading & Language" as const,
      module:      "Phonics",
      unit:        "Set 1",
      name:        "R&L Phonics Set 1 Training",
      mentorsName: "Mary Smith",
      venue:       "Pokhara, Gandaki Province",
      description: "Training on Reading & Language Phonics Set 1",
      startDate:   new Date("2026-03-05"),
      duration:    "2 days",
    },
  ];

  for (const event of trainingEventData) {
    await db.insert(trainingEvents).values(event);
  }

  console.log("🌱 Seeding training records...");

  const allSkills = [
    ["Communication", "Leadership", "Curriculum Design"],
    ["Classroom Management", "Student Engagement"],
    ["Assessment Techniques", "Data Analysis"],
    ["Technology Integration", "Digital Literacy"],
    ["Differentiated Instruction", "Inclusive Education"],
    ["Project-Based Learning", "Critical Thinking"],
    ["Parent Communication", "Collaborative Teaching"],
    ["Behavior Management", "Social-Emotional Learning"],
    ["Questioning Strategies", "Socratic Method"],
    ["Formative Assessment", "Feedback Methods"],
  ];

  const trainingRecordData = [
    {
      id:      "REC-2026-0001",
      teacherId: "TCH-2026-0002",
      trainingEventId: "TRN-2026-0001",
      rating:  4,
    },
    {
      id:      "REC-2026-0002",
      teacherId: "TCH-2026-0003",
      trainingEventId: "TRN-2026-0001",
      rating:  5,
    },
    {
      id:      "REC-2026-0003",
      teacherId: "TCH-2026-0004",
      trainingEventId: "TRN-2026-0001",
      rating:  3,
    },
    {
      id:      "REC-2026-0004",
      teacherId: "TCH-2026-0002",
      trainingEventId: "TRN-2026-0002",
      rating:  4,
    },
    {
      id:      "REC-2026-0005",
      teacherId: "TCH-2026-0005",
      trainingEventId: "TRN-2026-0003",
      rating:  5,
    },
    {
      id:      "REC-2026-0006",
      teacherId: "TCH-2026-0006",
      trainingEventId: "TRN-2026-0003",
      rating:  4,
    },
  ];

  let recIdx = 7;

  for (let tIdx = 0; tIdx < teacherProfiles.length; tIdx++) {
    for (let eIdx = 0; eIdx < Math.min(3, trainingEventData.length); eIdx++) {
      const teacher = teacherProfiles[tIdx];
      const event = trainingEventData[(tIdx + eIdx) % trainingEventData.length];
      trainingRecordData.push({
        id: `REC-2026-${String(recIdx).padStart(4, "0")}`,
        teacherId: teacher.id,
        trainingEventId: event.id,
        rating: ((tIdx + eIdx) % 5) + 1,
      });
      recIdx++;
    }
  }

  for (const record of trainingRecordData) {
    const event = trainingEventData.find(e => e.id === record.trainingEventId)!;
    const certificateNumber = await generateCertificateNumber(
      event.program,
      event.module,
      event.unit
    );

    await db.insert(trainingRecords).values({
      id:                record.id,
      teacherId:         record.teacherId,
      trainingEventId:   record.trainingEventId,
      rating:            record.rating,
      certificateNumber,
      skills:            allSkills[record.id.slice(-1) as unknown as number % allSkills.length],
    });
  }

  console.log("🌱 Seeding career records...");

  const organizations = [
    "Hetauda School of Management", "Lalitpur Public School", "Bhaktapur Secondary School",
    "Pokhara International College", "Kathmandu Valley Academy", "Biratnagar Central School",
    "Birgunj High School", "Nepalgunj Model School", "Chitwan English School", "Dang Public School",
  ];

  const roles = [
    "Mathematics Teacher", "Science Teacher", "English Teacher", "Computer Teacher",
    "Physical Education Teacher", "Art Teacher", "Music Teacher", "Social Studies Teacher",
    "Nursery Teacher", "Primary Teacher", "Grade Teacher", "Subject Specialist",
  ];

  const grades = ["Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"];

  const careerRecordData = [];
  let carIdx = 1;

  for (let tIdx = 0; tIdx < teacherProfiles.length; tIdx++) {
    const numCareers = 1 + (tIdx % 3);
    for (let cIdx = 0; cIdx < numCareers; cIdx++) {
      const teacher = teacherProfiles[tIdx];
      const startYear = 2010 + tIdx + cIdx;
      const stillWorking = cIdx === numCareers - 1 ? 1 : 0;
      careerRecordData.push({
        id: `CAR-2026-${String(carIdx).padStart(4, "0")}`,
        teacherId: teacher.id,
        role: roles[(tIdx + cIdx) % roles.length],
        organization: organizations[(tIdx + cIdx) % organizations.length],
        grade: grades[(tIdx + cIdx) % grades.length] as any,
        startDate: new Date(`${startYear}-0${(cIdx % 9) + 1}-15`),
        endDate: stillWorking === 0 ? new Date(`${startYear + 3}-12-31`) : undefined,
        stillWorking,
        achievements: `Achievement ${carIdx}: Contributed to school development`,
        refContactDetail: `hr@org${(tIdx + cIdx) % 10 + 1}.edu.np`,
      });
      carIdx++;
    }
  }

  for (const record of careerRecordData) {
    await db.insert(careerRecords).values(record);
  }

  console.log("🌱 Seeding event records...");

  const eventTypes = ["Seminar", "Conference", "Panel Discussion", "Podcast"] as const;
  const eventNames = [
    "Mathematics Education Seminar", "Science Teaching Workshop", "English Language Conference",
    "Technology in Education Summit", "Child Psychology Workshop", "Assessment Innovation Seminar",
    "Leadership in Education Conference", "Inclusive Education Workshop", "Digital Tools for Teachers",
    "Curriculum Development Seminar", "Teacher Training Conference", "Educational Psychology Workshop",
  ];
  const organizers = [
    "Nepal Mathematics Society", "Science Teachers Association", "English Language Institute",
    "Ministry of Education Nepal", "UNESCO Nepal", "EduNepal", "Teacher's Union",
    "School Administrators Forum", "EdTech Nepal", "Curriculum Development Center",
  ];

  const eventRecordData = [];
  let evtIdx = 1;

  for (let tIdx = 0; tIdx < teacherProfiles.length; tIdx++) {
    for (let eIdx = 0; eIdx < 2; eIdx++) {
      const teacher = teacherProfiles[tIdx];
      const month = ((tIdx + eIdx) % 12) + 1;
      eventRecordData.push({
        id: `EVT-2026-${String(evtIdx).padStart(4, "0")}`,
        teacherId: teacher.id,
        eventType: eventTypes[(tIdx + eIdx) % eventTypes.length],
        name: `${eventNames[(tIdx + eIdx) % eventNames.length]} 2026`,
        role: eIdx === 0 ? "Participant" : (tIdx % 2 === 0 ? "Speaker" : "Organizer"),
        organizer: organizers[(tIdx + eIdx) % organizers.length],
        venue: provinces[(tIdx + eIdx) % provinces.length].split(",")[0],
        date: new Date(`2026-${String(month).padStart(2, "0")}-${String((tIdx % 28) + 1).padStart(2, "0")}`),
        description: `Educational event focused on ${eventNames[(tIdx + eIdx) % eventNames.length].toLowerCase()}`,
      });
      evtIdx++;
    }
  }

  for (const record of eventRecordData) {
    await db.insert(eventRecords).values(record);
  }

  console.log("✅ Seeding complete!");
  console.log(`   - Users: ${1 + teacherProfiles.length}`);
  console.log(`   - Teachers: ${teacherProfiles.length}`);
  console.log(`   - Training Events: ${trainingEventData.length}`);
  console.log(`   - Training Records: ${trainingRecordData.length}`);
  console.log(`   - Career Records: ${careerRecordData.length}`);
  console.log(`   - Event Records: ${eventRecordData.length}`);

  await pool.end();
  process.exit(0);
};

seed().catch(async (err) => {
  console.error("❌ Seeding failed:", err);
  await pool.end();
  process.exit(1);
});
