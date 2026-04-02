import dotenv from "dotenv";
dotenv.config();

import { db, pool } from "./client";
import { users, teachers } from "./schema";
import { hashedPassword } from "../utils/password";

const seed = async () => {
  console.log("Cleaning existing data...");

  await db.delete(teachers);
  await db.delete(users);

  console.log("Seeding database...");

  const adminPassword = await hashedPassword("Admin1234");
  await db.insert(users).values({
    id:       "USR-2026-0001",
    email:    "admin@portfolio.com",
    password: adminPassword,
    role:     "admin",
  });

  const teacherPassword = await hashedPassword("Teacher1234");

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
    await db.insert(teachers).values(profile);
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