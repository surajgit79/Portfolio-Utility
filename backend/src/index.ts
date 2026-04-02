import dotenv from "dotenv";
dotenv.config();

import app from "./app";


const PORT = process.env.PORT || 3000;

const start = async ()=>{
    try {
        await app.listen({port: Number(PORT), address: '0.0.0.0'});
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

start();