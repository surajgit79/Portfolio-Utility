import { FastifyInstance } from "fastify";
import { requireAuth } from "../middlewares/requireAuth";
import { createCareerRecord, deleteCareerRecord, getCareerRecordsById, getCareerRecordsByTeacher, updateCareerRecord } from "../controllers/careerRecord.controller";
import { requireRole } from "../middlewares/requireRole";

export async function careerRecordRoutes(app: FastifyInstance){
    app.get("/teacher/:teacherId",{
        preHandler: [requireAuth],
        handler: getCareerRecordsByTeacher,
    })

    app.get("/:id",{
        preHandler: [requireAuth],
        handler: getCareerRecordsById
    });

    app.post("/",{
        preHandler: [requireAuth, requireRole("admin")],
        handler: createCareerRecord,
    });

    app.patch("/:id",{
        preHandler: [requireAuth, requireRole("admin")],
        handler: updateCareerRecord,
    });
    
    app.delete("/:id",{
        preHandler: [requireAuth, requireRole("admin")],
        handler: deleteCareerRecord,
    });
}