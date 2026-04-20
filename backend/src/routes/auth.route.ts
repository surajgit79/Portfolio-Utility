import { FastifyInstance } from "fastify";
import { register, login, refresh, logout } from "../controllers/auth.controller";

export async function authRoutes (app: FastifyInstance){
    app.post('/register', { handler: register });
    app.post('/login', { handler: login });
    app.post('/refresh', { handler: refresh});
    app.post('/logout', { handler: logout});
}
