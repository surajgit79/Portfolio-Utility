import dotenv from "dotenv";
dotenv.config();

import { validateEnv } from "./config/validateEnv";

const env = validateEnv();

import app from "./app";
import { initCronJobs } from "./utils/cronHandler";
import { pool } from "./db/client";

const PORT = process.env.PORT || 3000;

const start = async ()=>{
    try {
        await pool.query("SELECT 1");
        app.log.info("Database connection verified");

        initCronJobs();
        await app.listen({port: Number(PORT), host: '0.0.0.0'});
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

const signals = ["SIGINT", "SIGTERM"];
signals.forEach((signal) => {
    process.on(signal, async () => {
        app.log.info(`Received ${signal}, shutting down gracefully`);
        await app.close();
        await pool.end();
        process.exit(0);
    });
});

start();
