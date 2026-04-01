import { pgTable, text, timestamp, pgEnum, integer } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["Male", "Female", "Others"]);
export const categoryEnum = pgEnum("category", ["Activity-based Mathematics", "Pre-School", "Reading"]);

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: text("role", {enum:["admin", "teacher"]}).notNull().default("teacher"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const teachers = pgTable("teachers",{
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().unique().references(()=> users.id, { onDelete: "cascade"}),
    name: text("name").notNull(),
    address: text("address").notNull(),
    contact: text("contact").notNull(),
    email: text("email").notNull().unique(),
    gender: genderEnum("gender").notNull(),
    imageUrl: text("image_url"),
    dob: timestamp("dob").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),    
});

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
});

export const trainingRecords = pgTable("training_records", {
  id: text("id").primaryKey(),
  teacherId: text("teacher_id").notNull().references(() => teachers.id, { onDelete: "cascade" }),
  trainingEventId: text("training_event_id").notNull().references(() => trainingEvents.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  certificateNumber: text("certificate_number").notNull().unique(),
  refPhotos: text("ref_photos"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}); 