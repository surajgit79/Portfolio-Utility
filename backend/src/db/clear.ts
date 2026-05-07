import { pool } from "./client";

const tables = [
  "certificate_modules",
  "certificates",
  "bulk_jobs",
  "teacher_skills",
  "skills",
  "training_records",
  "training_events",
  "career_records",
  "event_records",
  "refresh_tokens",
  "teachers",
  "users",
];

async function clearAll() {
  try {
    await pool.query(`TRUNCATE TABLE ${tables.join(", ")} RESTART IDENTITY CASCADE;`);
    console.log("✅ All tables cleared successfully");
  } catch (err) {
    console.error("❌ Failed to clear tables:", err);
  } finally {
    await pool.end();
  }
}

clearAll();
