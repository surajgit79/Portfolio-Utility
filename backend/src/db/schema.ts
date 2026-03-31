import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["Male", "Female", "Others"]);

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: text("role", {enum:["admin", "teacher"]}).notNull().default("teacher"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const teachers = pgTable("teachers",{
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().unique().references(()=> users.id, { onDelete: "cascade"}),
    name:      text("name").notNull(),
    address:   text("address").notNull(),
    contact:   text("contact").notNull(),
    email:     text("email").notNull().unique(),
    gender:    genderEnum("gender").notNull(),
    imageUrl:  text("image_url"),
    dob:       timestamp("dob").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),    
});