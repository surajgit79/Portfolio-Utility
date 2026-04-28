import { teacherRepository } from "../repositories/teacher.repository";
import { userRepository } from "../repositories/user.repository";
import { generateId } from "../utils/idGenerator";
import { AppError, ErrorCode } from "../utils/errorHandler";
import { uploadSingleImage } from "../utils/imageUploader";
import { FastifyRequest } from "fastify";
import { hashedPassword } from "../utils/passwordHasherVerifier";
import { db } from "../db/client";
import { users, teachers } from "../db/schema";
import csv from "csv-parser";
import { z } from "zod";
import { bulkTeacherRowSchema } from "../utils/schemaValidator";

const calculateTenure = (teachingSince: number | null): number | null => {
  if (!teachingSince) return null;
  return new Date().getFullYear() - teachingSince;
};

export const teacherService = {
  register: async (
    data: {
      email:    string;
      password: string;
      name:     string;
      address:  string;
      contact:  string;
      gender:   "Male" | "Female" | "Others";
      dob:      string;
      teachingSince?: number;
      qualification?: string;
      imageUrl?: string;
    },
    request: FastifyRequest
  ) => {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(409, ErrorCode.CONFLICT, "Email already exists");
    }

    let imageUrl: string | undefined;
    if (request.isMultipart()) {
      const url = await uploadSingleImage(request, "portfolio-utility/teachers");
      if (url) imageUrl = url;
    }

    return db.transaction( async(tx)=>{
      const hashed = await hashedPassword(data.password);
      const userId = await generateId("users");

      const [user] = await tx.insert(users).values({
        id:       userId,
        email:    data.email,
        password: hashed,
        role:     "teacher",
      }).returning();

      const teacherId = await generateId("teachers");

      const [teacher] = await tx.insert(teachers).values({
        id:       teacherId,
        userId:   user.id,
        name:     data.name,
        address:  data.address,
        contact:  data.contact,
        email:    data.email,
        gender:   data.gender,
        dob:      data.dob,
        teachingSince: data.teachingSince,
        qualification: data.qualification,
        imageUrl: imageUrl || data.imageUrl,
      }).returning();
      return teacher;
    });
  },

  processBulkCSV: async(fileStream: NodeJS.ReadableStream)=>{
    const rawRows: any[] = [];

    await new Promise((resolve, reject)=>{
      fileStream.pipe(csv())
        .on('data', (data)=> rawRows.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    const summary = { totalRows: rawRows.length, successful: 0, failed: 0};
    const errors: Array <{row: number, email: string, reason: string}> =[];
    const successfulInserts: string[] =[];

    for(let i = 0; i< rawRows.length; i++){
      const row = rawRows[i];
      const rowNumber = i+2;

      try {
        const validData = bulkTeacherRowSchema.parse(row);

        const existingUser = await userRepository.findByEmail(validData.email);
        if (existingUser) {
          errors.push({ row: rowNumber, email: validData.email, reason: "Email already exists" });
          summary.failed++;
          continue;
        }

        const hashed = await hashedPassword('P@ssword123');
        const userId = await generateId('users');
        const teacherId = await generateId('teachers');

        await db.transaction(async(tx)=>{
          const [user] = await tx.insert(users).values({
            id: userId,
            email: validData.email,
            password: hashed,
            role: "teacher",
          }).returning();

          await tx.insert(teachers).values({
            id: teacherId,
            userId: userId,
            email: validData.email,
            name: validData.name,
            address: validData.address,
            contact: validData.contact,
            gender: validData.gender,
            dob: validData.dob instanceof Date ? validData.dob.toISOString().split('T')[0] : validData.dob,
            qualification: validData.highest_qualification,
            teachingSince: validData.teaching_since,
          }).returning();
        });
        summary.successful++;
        successfulInserts.push(teacherId);
        
      } catch (error: any) {
        summary.failed++;
        if(error instanceof z.ZodError){
          const issue = error.issues[0];
          errors.push({
            row: rowNumber,
            email: row.email || 'Email',
            reason: ` ${issue.path.join('.')}: ${issue.message}`,
          });
        }
        // Handle Database errors (like unique constraint on email)
        else if (error.code === '23505') { 
          errors.push({
            row: rowNumber,
            email: row.email,
            reason: 'Email already exists in the database'
          });
        } 
        else {
          errors.push({
            row: rowNumber,
            email: row.email,
            reason: error.message || 'Unknown server error'
          });
        }
      }
    }

    return { summary, errors, successfulInserts };

  },

  getAll: async (search?: string, page = 1, limit = 10) => {
    const [result, total] = await Promise.all([
      teacherRepository.findAll(search, page, limit),
      teacherRepository.countAll(search),
    ])

    const teachersWithDetails = await Promise.all(
      result.map(async (teacher) => {
        const details = await teacherRepository.findCareerAndTraining(teacher.id);
        return {
          ...teacher,
          ...details,
          tenure: calculateTenure(teacher.teachingSince),
        };
      })
    );

    return {
      data: teachersWithDetails,
      total,
    };
  },

  getById: async (id: string) => {
    const teacher = await teacherRepository.findById(id);
    if (!teacher) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Teacher not found");
    }

    return {
      ...teacher,
      tenure: calculateTenure(teacher.teachingSince),
    };
  },

  update: async (
    id: string,
    data: Partial<{
      name:     string;
      address:  string;
      contact:  string;
      email:    string;
      gender:   "Male" | "Female" | "Others";
      dob:      string;
    }>,
    imageUrl?: string,
  ) => {
    const existing = await teacherRepository.findById(id);
    if (!existing) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Teacher not found");
    }

    const { dob, ...rest } = data;

    return teacherRepository.update(id, {
      ...rest,
      ...(imageUrl && { imageUrl }),
      ...(dob && { dob: dob }),
      updatedAt: new Date(),
    });
  },

  delete: async (id: string) => {
    const existing = await teacherRepository.findById(id);

    if (!existing) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Teacher not found");
    }

    await teacherRepository.delete(id);
  },
};