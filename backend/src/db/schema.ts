import { uniqueIndex } from "drizzle-orm/pg-core";
import { pgTable, text, timestamp, pgEnum, integer, date, index } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["Male", "Female", "Others"]);
export const programEnum = pgEnum("program", ["Activity-based Mathematics", "Reading & Language", "Pre-School Transformation"]);
export const eventEnum = pgEnum("event_type", ["Seminar", "Conference", "Panel Discussion","Podcast"]);
export const gradeEnum = pgEnum("grade", ["Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"]);

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: text("role", {enum:["admin", "teacher"]}).notNull().default("teacher"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
},(table)=>({
    emailIdx: index("users_email_idx").on(table.email)
}));

export const teachers = pgTable("teachers",{
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().unique().references(()=> users.id, { onDelete: "cascade"}),
    name: text("name").notNull(),
    address: text("address").notNull(),
    contact: text("contact").notNull(),
    email: text("email").notNull().unique(),
    gender: genderEnum("gender").notNull(),
    imageUrl: text("image_url"),
    dob: date("dob").notNull(),
    qualification: text("qualification"),
    teachingSince: integer("teaching_since"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),    
}, (table)=>({
    userIdIdx: index("teachers_user_id_idx").on(table.userId),
    emailIdx: index("teachers_emai_idx").on(table.email),
    nameIdx: index("teachers_name_idx").on(table.name),
}));

export const trainingEvents = pgTable("training_events", {
    id: text("id").primaryKey(),
    program: programEnum("program").notNull(),
    module: text("module").notNull(),
    unit: text("unit"),
    name: text("name").notNull(),
    mentorsName: text("mentors_name"),
    venue: text("venue"),
    startDate: timestamp("start_date").notNull(),
    duration: text("duration").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
    programIdx:  index("training_events_category_idx").on(table.program),
    moduleIdx:    index("training_events_sector_idx").on(table.module),
    unitIdx:     index("training_events_phase_idx").on(table.unit),
    startDateIdx: index("training_events_start_date_idx").on(table.startDate),
}));

export const trainingRecords = pgTable("training_records", {
    id: text("id").primaryKey(),
    teacherId: text("teacher_id").notNull().references(() => teachers.id, { onDelete: "cascade" }),
    trainingEventId: text("training_event_id").notNull().references(() => trainingEvents.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    refPhotos: text("ref_photos"),
    feedback: text("feedback"),
    trainingDate: date("training_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
    teacherIdIdx:       index("training_records_teacher_id_idx").on(table.teacherId),
    trainingEventIdIdx: index("training_records_training_event_id_idx").on(table.trainingEventId),
})); 

export const careerRecords = pgTable("career_records",{
    id: text("id").primaryKey(),
    teacherId: text("teacher_id").notNull().references(()=>teachers.id, { onDelete: "cascade"}),
    role: text("role").notNull(),
    organization: text("organization").notNull(),
    grade: gradeEnum("grade"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    stillWorking: integer("still_working").notNull().default(0),
    achievements: text("achievements"),
    refContactDetail: text("ref_contact"),
    createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({
    teacherIdIdx:    index("career_records_teacher_id_idx").on(table.teacherId),
    stillWorkingIdx: index("career_records_still_working_idx").on(table.stillWorking),
}));

export const eventRecords = pgTable("event_records",{
    id: text("id").primaryKey(),
    teacherId: text("teacher_id").notNull().references(()=> teachers.id, {onDelete: "cascade"}),
    eventType: eventEnum("event_type").notNull(),
    name: text("name").notNull(),
    role: text("role").notNull(),
    organizer: text("organizer").notNull(),
    venue: text("venue"),
    date: timestamp("date").notNull(),
    description: text("description"),
    referenceImage: text("reference_image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
    teacherIdIdx: index("event_records_teacher_id_idx").on(table.teacherId),
}));

export const refreshTokens = pgTable("refresh_tokens",{
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(()=> users.id, { onDelete: "cascade"}),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table)=>({
    userIdIdx: index("refresh_tokens_user_id_idx").on(table.userId),
    tokenIdx: index("refresh_tokens_token_idx").on(table.token)
}));

export const skills = pgTable("skills", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    program: programEnum("program").notNull(),
    module: text("module").notNull(),
    unit: text("unit"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
},  (table)=>({
    programIdx: index("skills_program_idx").on(table.program),
    moduleIdx: index("skills_module_idx").on(table.module),
    unitIdx: index("skills_unit_idx").on(table.unit),
}));

export const teacherSkills = pgTable("teacher_skills", {
    id: text("id").primaryKey(),
    skillId: text("skill_id").notNull().references(()=>skills.id, {onDelete: "cascade"}),
    teacherId: text("teacher_id").notNull().references(()=>teachers.id, { onDelete: "cascade"}),
    trainingRecordId: text("training_record_id").references(()=> trainingRecords.id, { onDelete: "set null"}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
    teacherIdIdx: index("teacher_id_idx").on(table.teacherId),
    skillIdx: index("skill_id_idx").on(table.skillId),
    uniqueTeacherSkill: uniqueIndex("teacher_skills_unique").on(table.teacherId, table.skillId),
}));

export const certificates = pgTable("certificates", {
    id: text("id").primaryKey(),
    teacherId: text("teacher_id").notNull().references(() => teachers.id, { onDelete: "cascade" }),
    program: programEnum("program").notNull(),
    certificateNumber: text("certificate_number").notNull().unique(),
    issuedAt: timestamp("issued_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  teacherIdIdx: index("certificates_teacher_id_idx").on(table.teacherId),
  programIdx: index("certificates_program_idx").on(table.program),
  uniqueTeacherProgram: uniqueIndex("certificates_teacher_program_unique").on(table.teacherId, table.program),
}));

export const certificateModules = pgTable("certificate_modules", {
  id: text("id").primaryKey(),
  certificateId: text("certificate_id").notNull().references(() => certificates.id, { onDelete: "cascade" }),
  trainingRecordId: text("training_record_id").notNull().references(() => trainingRecords.id, { onDelete: "cascade" }),
  module: text("module").notNull(),
  unit: text("unit"),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
}, (table) => ({
  certificateIdIdx: index("certificate_modules_certificate_id_idx").on(table.certificateId),
  uniqueModuleUnit: uniqueIndex("certificate_modules_unique").on(table.certificateId, table.module, table.unit),
}));