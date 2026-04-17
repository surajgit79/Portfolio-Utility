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
import { certificateRoutes } from "./routes/certificate.route";
import { requestLogger, responseLogger } from "./middlewares/requestLogger";

const app = Fastify({
    logger: {
        level: "error",
    }
});

app.register(helmet);
app.register(cors, {
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

app.addHook("preHandler", requestLogger);
app.addHook("onSend", responseLogger);

app.get('/api/v1/health',async ()=>{
    return {status: "ok"};
});

app.register(authRoutes, { prefix: "/api/v1/auth" });
app.register(teacherRoutes, {prefix: "/api/v1/teachers"});
app.register(trainingEventRoutes, {prefix: "/api/v1/training-events"});
app.register(trainingRecordRoutes, {prefix: "/api/v1/training-records"});
app.register(careerRecordRoutes,{prefix: "/api/v1/career-records"});
app.register(eventRecordRoutes, {prefix: "/api/v1/event-records"});
app.register(certificateRoutes, {prefix: "/api/v1/certificates"});

export default app;