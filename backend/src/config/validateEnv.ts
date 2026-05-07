import { z } from "zod";

const envSchema = z.object({
    PORT: z.string().default("3001"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
    JWT_EXPIRES_IN: z.string().default("15m"),
    FRONTEND_URL: z.string().default("http://localhost:3000"),
    S3_ENDPOINT: z.string().min(1, "S#_ENDPOINT is required"),
    S3_REGION: z.string().default("us-east-1"),
    S3_ACCESS_KEY: z.string().min(1, "S3_ACCESS_KEY is required"),
    S3_SECRET_KEY: z.string().min(1, "S3_SECRET_KEY is required"),
    S3_BUCKET: z.string().min(1, "S3_BUCKET is required"),
    S3_PUBLIC_URL: z.string().optional(),
    CHROME_PATH: z.string().optional(),
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