import { z } from "zod";

// Auth
export const registerSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string()
        .min(8, "Password must be atleast 8 characters long")
        .regex(/[A-Z]/,"Password must contain an uppercase letter")
        .regex(/[0-9]/, "Password must contain atleast a number"),
});

export const loginSchema = z.object({
  email:    z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest    = z.infer<typeof loginSchema>;


// Teacher
export const registerTeacherSchema = z.object({
  email:    z.string().email("Invalid email format"),
  password: z.string()
              .min(8, "Password must be at least 8 characters")
              .regex(/[A-Z]/, "Password must contain an uppercase letter")
              .regex(/[0-9]/, "Password must contain a number"),
  name:     z.string().min(2, "Name must be at least 2 characters"),
  address:  z.string().min(5, "Address is required"),
  contact:  z.string().regex(/^[0-9]{10}$/, "Contact must be 10 digits"),
  gender:   z.enum(["Male", "Female", "Others"]),
  dob:      z.string().refine(
              (date) => !isNaN(Date.parse(date)),
              "Invalid date format"
            ),
  teachingSince: z.number().int().min(1950, "Invalid year").max(new Date().getFullYear(), "Year cannot be in the future").optional(),
});

export type RegisterTeacherRequest = z.infer<typeof registerTeacherSchema>;

export const updateTeacherSchema = registerTeacherSchema.partial();
export type UpdateTeacherRequest = z.infer<typeof updateTeacherSchema>;


// Training-Event
const sectorPhaseMap:Record<string, {sectors: string[], hasPhase: boolean}> = {
  "Activity-based Mathematics" : {
    sectors: ["Book 1", "Book 2", "Book 3"],
    hasPhase: true
  },
  "Reading": {
    sectors: ["Phonics", "Guided Reading", "Book-based Activities", "Writing workshop"],
    hasPhase: false
  },
  "Pre-School": {
    sectors: [],
    hasPhase: true
  },
}
const baseTrainingEventSchema = z.object({
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

export const createTrainingEventSchema = baseTrainingEventSchema
  .superRefine((data, ctx) => {
    const rule = sectorPhaseMap[data.category];

    if (rule.sectors.length > 0 && !rule.sectors.includes(data.sector)) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ["sector"],
        message: `Invalid sector for ${data.category}. Must be one of: ${rule.sectors.join(", ")}`,
      });
    }

    if (rule.hasPhase && !data.phase) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ["phase"],
        message: `Phase is required for ${data.category}`,
      });
    }

    if (!rule.hasPhase && data.phase) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ["phase"],
        message: `Phase is not applicable for ${data.category}`,
      });
    }
  });

export const updateTrainingEventSchema = baseTrainingEventSchema.partial();

export type CreateTrainingEventRequest = z.infer<typeof createTrainingEventSchema>;
export type UpdateTrainingEventRequest = z.infer<typeof updateTrainingEventSchema>;

// Training-record
export const createTrainingRecordSchema = z.object({
  teacherId:       z.string().min(1, "Teacher ID is required"),
  trainingEventId: z.string().min(1, "Training event ID is required"),
  rating:          z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must not exceed 5"),
});

export const bulkCreateTrainingRecordSchema = z.object({
  trainingEventId: z.string().min(1, "Training event ID is required"),
  teacherIds:      z.array(z.string().min(1)).min(1, "At least one teacher required"),
  rating:          z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must not exceed 5"),
});

export const updateTrainingRecordSchema = z.object({
  rating:    z.number().int().min(1).max(5).optional(),
  refPhotos: z.string().optional(),
});

export type CreateTrainingRecordRequest     = z.infer<typeof createTrainingRecordSchema>;
export type BulkCreateTrainingRecordRequest = z.infer<typeof bulkCreateTrainingRecordSchema>;
export type UpdateTrainingRecordRequest     = z.infer<typeof updateTrainingRecordSchema>;


//career
export const createCareerRecordSchema = z.object({
  teacherId:        z.string().min(1, "Teacher ID is required"),
  role:             z.string().min(2, "Role is required"),
  organization:     z.string().min(2, "Organization is required"),
  startDate:        z.string().refine(
                      (date) => !isNaN(Date.parse(date)),
                      "Invalid date format"
                    ),
  endDate:          z.string().refine(
                      (date) => !isNaN(Date.parse(date)),
                      "Invalid date format"
                    ).optional(),
  stillWorking:     z.number().int().min(0).max(1),
  achievements:     z.string().optional(),
  refContactDetail: z.string().optional(),
});

export const updateCareerRecordSchema = createCareerRecordSchema.partial();

export type CreateCareerRecordRequest = z.infer<typeof createCareerRecordSchema>;
export type UpdateCareerRecordRequest = z.infer<typeof updateCareerRecordSchema>;


// event 

export const createEventRecordSchema = z.object({
  teacherId:   z.string().min(1, "Teacher ID is required"),
  eventType:   z.enum(["Seminar", "Conference", "Panel Discussion", "Podcast"]),
  name:        z.string().min(2, "Name is required"),
  role:        z.string().min(2, "Role is required"),
  organizer:   z.string().min(2, "Organizer is required"),
  venue:       z.string().optional(),
  date:        z.string().refine(
                 (date) => !isNaN(Date.parse(date)),
                 "Invalid date format"
               ),
  description: z.string().optional(),
});

export const updateEventRecordSchema = createEventRecordSchema.partial();

export type CreateEventRecordRequest = z.infer<typeof createEventRecordSchema>;
export type UpdateEventRecordRequest = z.infer<typeof updateEventRecordSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>
export type LogoutRequest = z.infer<typeof logoutSchema>
