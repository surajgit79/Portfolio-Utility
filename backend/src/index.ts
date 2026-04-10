import dotenv from "dotenv";
dotenv.config();

import { validateEnv } from "./config/validateEnv";

const env = validateEnv();

import app from "./app";

const PORT = process.env.PORT || 3000;

const start = async ()=>{
    try {
        await app.listen({port: Number(PORT), host: '0.0.0.0'});
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

start();