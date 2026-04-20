import { pgTable, text, timestamp, pgEnum, integer, date, index } from "drizzle-orm/pg-core";
import { table } from "node:console";

export const genderEnum = pgEnum("gender", ["Male", "Female", "Others"]);
export const categoryEnum = pgEnum("category", ["Activity-based Mathematics", "Pre-School", "Reading"]);
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
    category: categoryEnum("category").notNull(),
    sector: text("sector").notNull(),
    phase: text("phase"),
    name: text("name").notNull(),
    mentorsName: text("mentors_name"),
    venue: text("venue"),
    startDate: timestamp("start_date").notNull(),
    duration: text("duration").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
    categoryIdx:  index("training_events_category_idx").on(table.category),
    sectorIdx:    index("training_events_sector_idx").on(table.sector),
    phaseIdx:     index("training_events_phase_idx").on(table.phase),
    startDateIdx: index("training_events_start_date_idx").on(table.startDate),
}));

export const trainingRecords = pgTable("training_records", {
    id: text("id").primaryKey(),
    teacherId: text("teacher_id").notNull().references(() => teachers.id, { onDelete: "cascade" }),
    trainingEventId: text("training_event_id").notNull().references(() => trainingEvents.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    certificateNumber: text("certificate_number").notNull().unique(),
    refPhotos: text("ref_photos"),
    feedback: text("feedback"),
    skills: text("skills").array().default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
    teacherIdIdx:       index("training_records_teacher_id_idx").on(table.teacherId),
    trainingEventIdIdx: index("training_records_training_event_id_idx").on(table.trainingEventId),
    certNumberIdx:      index("training_records_certificate_number_idx").on(table.certificateNumber),
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