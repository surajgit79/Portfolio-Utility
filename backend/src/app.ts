import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
import { authRoutes } from "./routes/auth.route";
import { teacherRoutes } from "./routes/teacher.route";
import { trainingEventRoutes } from "./routes/trainingEvent.route";
import { trainingRecordRoutes } from "./routes/trainingRecords.routes";
import { errorHandler } from "./utils/errorHandler";
import { careerRecordRoutes } from "./routes/careerRecord.route";
import { eventRecordRoutes } from "./routes/eventRecord.route";

const app = Fastify({logger: true});

app.register(helmet);
app.register(cors, {
    // origin: process.env.FRONTEND_URL,
    origin: true,
    credentials: true
});
app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute"
});
app.register(multipart, {
    limits:{ 
        fileSize: 5*1024*1024 // max 5MB
    },  
});

errorHandler(app);

app.get('/health',async ()=>{
    return {status: "ok"};
});

app.register(authRoutes, { prefix: "/api/auth" });
app.register(teacherRoutes, {prefix: "/api/teachers"});
app.register(trainingEventRoutes, {prefix: "/api/training-events"});
app.register(trainingRecordRoutes, {prefix: "/api/training-records"});
app.register(careerRecordRoutes,{prefix: "/api/career-records"});
app.register(eventRecordRoutes, {prefix: "/api/event-records"});

export default app;