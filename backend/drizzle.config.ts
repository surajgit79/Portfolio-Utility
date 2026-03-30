import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
import path from "path";
dotenv.config({path: path.join(process.cwd(), ".env")});

console.log(process.env.DATABASE_URL);
export default {
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL || "",
    },
} satisfies Config;