import { date, z } from "zod";

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
  qualification: z.string().optional(),
  teachingSince: z.coerce.number().int().min(1950, "Invalid year").max(new Date().getFullYear(), "Year cannot be in the future").optional(),
  imageUrl:      z.string().url("Invalid image URL").optional(),
});

export type RegisterTeacherRequest = z.infer<typeof registerTeacherSchema>;
export const updateTeacherSchema = z.object({
  name:          z.string().min(2).optional(),
  address:       z.string().min(5).optional(),
  contact:       z.string().regex(/^[0-9]{10}$/).optional(),
  email:         z.string().email().optional(),
  gender:        z.enum(["Male", "Female", "Others"]).optional(),
  dob:           z.string().refine(
                   (date) => !isNaN(Date.parse(date)),
                   "Invalid date format"
                 ).optional(),
  qualification: z.string().optional(),
  teachingSince: z.coerce.number().int()
                   .min(1950)
                   .max(new Date().getFullYear())
                   .optional(),
});
export type UpdateTeacherRequest = z.infer<typeof updateTeacherSchema>;

export const bulkTeacherRowSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  contact: z.string().min(1, "Contact is required"),
  gender: z.enum(["Male", "Female", "Others"]),
  dob: z.coerce.date(), // Converts the CSV string like "1990-05-15" to a Date object
  highest_qualification: z.string().optional(),
  teaching_since: z.coerce.number().optional(),
});

export type BulkTeacherRow = z.infer<typeof bulkTeacherRowSchema>;


// Training-Event
const programModuleMap: Record<string, {
  modules: string[],
  units?: Record<string, string[]>,
  requiresUnit: boolean
}> = {
  "Activity-based Mathematics":{
    modules: ["Class 4", "Class 5", "Class 6"],
    units: {
      "Class 4" : ["Book 1", "Book 2", "Book 3"],
      "Class 5" : ["Book 1", "Book 2", "Book 3"],
      "Class 6" : ["Book 1", "Book 2", "Book 3"],
    },
    requiresUnit: true,
  },
  "Reading & Language":{
    modules: ["Phonics", "Writer Workshop", "Guided Reading", "Book-based Activity", "Coffee house"],
    units: {
      "Phonics": [
        "Set 1", "Set 2", "Set 3", "Set 4", "Set 5", "Set 6", "Set 7",
        "Chop and blend of Short Vowel Words (CVC word)",
        "Chop and blend pf Long Vowel Words",
        "Consonant Blending (Chop and Blend)",
        "R-controlled Blending (Chop and Blend)"
      ],
    },
    requiresUnit: false,
  },
  "Pre-School Transformation":{
    modules: [
      "Circle Time",
      "Setting and Development of Communication",
      "Material Development",
      "Story Telling Session",
      "Music and Movement Session",
      "Continuous Assessment System",
      "Curriculum Development Training",
    ],
    requiresUnit: false,
  },
};

export const baseTrainingEventSchema = z.object({
  program: z.enum(["Activity-based Mathematics", "Reading & Language", "Pre-School Transformation"]),
  module: z.string().min(2, "Module is required"),
  unit: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  mentorsName: z.string().optional(),
  venue: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)),"Invalid date format"),
  duration: z.string().min(1, "Duration is required"),
});

export const createTrainingEventSchema = z.object({
  program: z.enum(["Activity-based Mathematics", "Reading & Language", "Pre-School Transformation"]),
  module: z.string().min(2, "Module is required"),
  unit: z.string().optional(),
  name: z.string().min(2, "Name must be atleast 2 characters"),
  mentorsName: z.string().optional(),
  venue: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
  duration: z.string().min(1, "Duration is required"),
}).superRefine((data, ctx) =>{
  const rule = programModuleMap[data.program];

  if(!rule.modules.includes(data.module)){
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["module"],
      message: `Invalid module for ${data.program}. Must be one of: ${rule.modules.join(", ")}`
    });
    return;
  }

  if (rule.requiresUnit && !data.unit) {
    ctx.addIssue({
      code:    z.ZodIssueCode.custom,
      path:    ["unit"],
      message: `Unit is required for ${data.program}`,
    });
    return;
  }

  if (rule.requiresUnit && !data.unit) {
    ctx.addIssue({
      code:    z.ZodIssueCode.custom,
      path:    ["unit"],
      message: `Unit is required for ${data.program}`,
    });
    return;
  }

  if (!rule.requiresUnit && !rule.units?.[data.module] && data.unit) {
    ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ["unit"],
        message: `Unit is not applicable for ${data.module}`,
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


// Skills
export const createSkillSchema = z.object({
  name:    z.string().min(2, "Skill name is required"),
  program: z.enum(["Activity-based Mathematics", "Reading & Language", "Pre-School Transformation",]),
  module:  z.string().min(2, "Module is required"),
  unit:    z.string().optional(),
});

export const createTeacherSkillSchema = z.object({
  teacherId:        z.string().min(1, "Teacher ID is required"),
  skillIds:         z.array(z.string().min(1)).min(1, "At least one skill required"),
  trainingRecordId: z.string().optional(),
});

export type CreateSkillRequest        = z.infer<typeof createSkillSchema>;
export type CreateTeacherSkillRequest = z.infer<typeof createTeacherSkillSchema>;