import { z } from "zod";

// Auth
export const registerSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string()
        .min(8, "Password must be atleast 8 characters long")
        .regex(/[A-Z]/,"Password must contain an uppercase letter")
        .regex(/[0-9]/, "Password must contain atleast a number"),
    role: z.enum(["admin","teacher"]).default("teacher"),
});

export const loginSchema = z.object({
  email:    z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest    = z.infer<typeof loginSchema>;


// Teacher

export const createTeacherSchema = z.object({
  userId:  z.string().min(1, "User ID is required"),
  name:    z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address is required"),
  contact: z.string().regex(/^[0-9]{10}$/, "Contact must be 10 digits"),
  email:   z.string().email("Invalid email format"),
  gender:  z.enum(["Male", "Female", "Others"]),
  dob:     z.string().refine(
             (date) => !isNaN(Date.parse(date)),
             "Invalid date format"
           ),
});

export const updateTeacherSchema = createTeacherSchema.partial();

export type CreateTeacherRequest = z.infer<typeof createTeacherSchema>;
export type UpdateTeacherRequest = z.infer<typeof updateTeacherSchema>;


// Training-Event

export const createTrainingEventSchema = z.object({
  category:    z.enum(["Activity-based Mathematics", "Reading", "Pre-School"]),
  sector:      z.string().min(2, "Sector is required"),
  phase:       z.string().optional(),
  name:        z.string().min(3, "Name must be at least 3 characters"),
  mentorsName: z.string().optional(),
  venue:       z.string().optional(),
  description: z.string().optional(),
  startDate:   z.string().refine(
                 (date) => !isNaN(Date.parse(date)),
                 "Invalid date format"
               ),
  duration:    z.string().min(1, "Duration is required"),
});

export const updateTrainingEventSchema = createTrainingEventSchema.partial();

export type CreateTrainingEventRequest = z.infer<typeof createTrainingEventSchema>;
export type UpdateTrainingEventRequest = z.infer<typeof updateTrainingEventSchema>;