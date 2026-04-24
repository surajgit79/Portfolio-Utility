import { FastifyReply, FastifyRequest } from "fastify";
import { AppError, ErrorCode } from "../utils/errorHandler";
import { parseCSV, validateCSVHeaders } from "../utils/csvParser";

export const uploadTeacherCSV = async(
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const data = await request.file();
    if(!data){
        throw new AppError(404, ErrorCode.NOT_FOUND, "No file uploaded");
    }

    if(data.mimetype !== "text/csv"){
        throw new AppError(400, ErrorCode.VALIDATION_ERROR, "File must be a CSV");
    }

    const buffer = await data.toBuffer();
    const rows = parseCSV(buffer);

    const { valid, missing } = validateCSVHeaders(rows, ["name", "email", "dob", "gender", "contact", "address", "teachingSince"]);
    if(!valid){
        throw new AppError(400, ErrorCode.VALIDATION_ERROR, `Missing required columns: ${missing.join(", ")}`);
    }

    const created = [];
}