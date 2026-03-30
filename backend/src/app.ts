import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet";
import { authRoutes } from "./routes/auth.route";

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

app.register(authRoutes, { prefix: "/api/auth" });

app.get('/health',async ()=>{
    return {status: "ok"};
});

export default app;