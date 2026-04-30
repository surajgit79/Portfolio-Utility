import { z } from "zod";

const envSchema = z.object({
    PORT: z.string().default("3001"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
    JWT_EXPIRES_IN: z.string().default("15m"),
    FRONTEND_URL: z.string().default("http://localhost:3000"),
    CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
    CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
    CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
});

export type Env = z.infer<typeof envSchema>;
export const validateEnv = (): Env =>{
    const result = envSchema.safeParse(process.env);

    if(!result.success){
        console.error("Invalid environment variables:");
        result.error.issues.forEach((err) => {
            console.error(`  ${err.path.join(".")}: ${err.message}`);
        });
        process.exit(1);
    }
    return result.data;
} 