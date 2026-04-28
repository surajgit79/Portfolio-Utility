import { userRepository } from "../repositories/user.repository";
import { parseCSV, validateCSVHeaders } from "../utils/csvParser"
import { AppError, ErrorCode } from "../utils/errorHandler";
import { hashedPassword } from "../utils/passwordHasherVerifier";
import { generateCertificateNumber, generateId } from "../utils/idGenerator";
import { uploadRepository } from "../repositories/upload.repository";
import { buffer } from "node:stream/consumers";
import { teacherRepository } from "../repositories/teacher.repository";
import { careerRecordRepository } from "../repositories/careerRecord.repository";
import { eventRecordRepository } from "../repositories/eventRecord.repository";
import { trainingEventRepository } from "../repositories/trainingEvent.repository";
import { trainingRecordRepository } from "../repositories/trainingRecord.repository";
import { db } from "../db/client";
import { trainingRecords } from "../db/schema";

export const uploadService = {
    processTeacherCSV: async(buffer:Buffer) =>{
        const rows = parseCSV(buffer);

        const { valid, missing } = validateCSVHeaders(rows, ["name", "email", "dob", "gender", "contact", "address"]);
        if(!valid){
            throw new AppError(400, ErrorCode.VALIDATION_ERROR, `Missing required columns: ${missing.join(", ")}`);
        }

        const created = [];
        const skipped = [];
        const errors = [];

        for(const row of rows){
            try {
                const existingUser = await userRepository.findByEmail(row.email);
                if(existingUser){
                    skipped.push({ email: row.email, reason: `Email already exists` });
                    continue;
                }

                const hashed = await hashedPassword("Teacher1234"); // Default password for now
                const userId = await generateId("users");
                const teacherId = await generateId("teachers");

                const teacher = await uploadRepository.createTeacherWithUser({
                    userId, teacherId, 
                    email: row.email,
                    hashedPassword: hashed,
                    name: row.name,
                    address: row.address,
                    contact: row.contact,
                    gender: row.gender as "Male" | "Female" | "Others",
                    dob: new Date(row.dob),
                    teachingSince: row.teachingSince? Number(row.teachingSince) : null,
                });

                created.push({ email: row.email, teacherId: row.teacherId});
            } catch (error) {
                errors.push({ email: row.email, reason: "Failed to create teacher"});
            }
        }
        return { created, skipped, errors };
    },

    processCareerRecordsCSV: async(buffer: Buffer)=>{
        const rows = parseCSV(buffer);
        
        const { valid, missing } = validateCSVHeaders(rows, ["email", "role", "organization", "startDate", "stillWorking"]);
        if(!valid){
            throw new AppError(400, ErrorCode.VALIDATION_ERROR, `Missing required columns: ${missing.join(", ")}`);
        } 

        const created = [];
        const skipped = [];
        const errors = [];

        for(const row of rows){
            try {
                const teacher = await teacherRepository.findByEmail(row.email);
                if(!teacher){
                    skipped.push({ email: row.email, reason: "Teacher not found"});
                    continue;
                }

                const duplicate = await careerRecordRepository.findDuplicate(teacher.id, row.role, row.organization);
                if(duplicate){
                    skipped.push({ email: row.email, reason: "Career record already exists for this role in the organization for this teacher"});
                    continue;
                }

                const id = await generateId("career_records");
                await careerRecordRepository.create({
                    id,
                    teacherId: teacher.id,
                    role: row.role,
                    organization: row.organization,
                    grade: row.grade as any ?? null,
                    startDate: new Date(row.startDate),
                    endDate: row.endDate ? new Date(row.endDate) : null,
                    stillWorking: Number(row.stillWorking),
                    achievements: row.achievements ?? null,
                    refContactDetail: row.refContactDetail ??  null,
                });

                created.push({ email:row.email, role:row.role, organization:row.organization});
            } catch (error) {
                errors.push({ email: row.email, reason: "Failed to create career record"});
            }
        }
        return{ created, skipped, errors };
    },
    
    processEventRecordsCSV: async (buffer: Buffer) => {
        const rows = parseCSV(buffer);

        const { valid, missing } = validateCSVHeaders(rows, ["email", "eventType", "name", "role", "organizer", "date"]);
        if (!valid) {
            throw new AppError(400,ErrorCode.VALIDATION_ERROR,`Missing required columns: ${missing.join(", ")}`);
        }

        const created = [];
        const skipped = [];
        const errors  = [];

        for (const row of rows) {
            try {
                const teacher = await teacherRepository.findByEmail(row.email);
                if (!teacher) {
                    skipped.push({ email: row.email, reason: "Teacher not found" });
                    continue;
                }

                const duplicate = await eventRecordRepository.findDuplicate(teacher.id,row.name,new Date(row.date));
                if (duplicate) {
                    skipped.push({email:  row.email,reason: "Event record already exists for this name and date"});
                    continue;
                }

                const id = await generateId("event_records");
                await eventRecordRepository.create({
                    id,
                    teacherId:   teacher.id,
                    eventType:   row.eventType as "Seminar" | "Conference" | "Panel Discussion" | "Podcast",
                    name:        row.name,
                    role:        row.role,
                    organizer:   row.organizer,
                    venue:       row.venue       ?? null,
                    date:        new Date(row.date),
                    description: row.description ?? null,
                });

                created.push({ email: row.email, name: row.name });
            } catch (error) {
                errors.push({ email: row.email, reason: "Failed to create event record" });
            }
        }

        return { created, skipped, errors };
    },

    processTrainingRecordsCSV: async (buffer: Buffer) => {
        const rows = parseCSV(buffer);

        const { valid, missing } = validateCSVHeaders(rows, ["email", "trainingEventId", "rating",]);
        if (!valid) {
            throw new AppError(400,ErrorCode.VALIDATION_ERROR,`Missing required columns: ${missing.join(", ")}`);
        }

        const created = [];
        const skipped = [];
        const errors  = [];

        for (const row of rows) {
            try {
                const teacher = await teacherRepository.findByEmail(row.email);
                if (!teacher) {
                    skipped.push({ email: row.email, reason: "Teacher not found" });
                    continue;
                }

                const event = await trainingEventRepository.findById(row.trainingEventId);
                if (!event) {
                    skipped.push({email:  row.email,reason: `Training event ${row.trainingEventId} not found`});
                    continue;
                }

                const existing = await trainingRecordRepository.findByTeacherAndEvent(teacher.id,row.trainingEventId);
                if (existing) {
                    skipped.push({email:  row.email,reason: "Training record already exists for this teacher and event",});
                    continue;
                }

                const id                = await generateId("training_records");
                const certificateNumber = await generateCertificateNumber(event.program,event.module,event.unit ?? null);

                await db.insert(trainingRecords).values({
                    id,
                    teacherId:       teacher.id,
                    trainingEventId: row.trainingEventId,
                    rating:          Number(row.rating),
                    certificateNumber,
                });

                created.push({email:row.email,trainingEventId:row.trainingEventId,certificateNumber});
            } catch (error) {
                errors.push({ email: row.email, reason: "Failed to create training record" });
            }
        }

        return { created, skipped, errors };
    },
};