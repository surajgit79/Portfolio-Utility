import { FastifyRequest, FastifyReply } from "fastify";
import { teacherService } from "../services/teacher.service";
import { registerTeacherSchema, updateTeacherSchema } from "../utils/schemaValidator";
import { calculatePagination, getPaginationParams } from "../utils/paginationHandler";
import { AppError, ErrorCode } from "../utils/errorHandler";

export const registerTeacher = async (
  request: FastifyRequest,
  reply:   FastifyReply
) => {
  let fields: Record<string, string> = {};
  let imageUrl: string | undefined;

  if (request.isMultipart()) {
    const parts = request.parts();

    for await (const part of parts) {
      if (part.type === "file" && part.filename) {
        const os      = await import("os");
        const path    = await import("path");
        const fs      = await import("fs");
        const { pipeline } = await import("stream/promises");
        const { uploadImage } = await import("../utils/cloudinaryImageHandler");

        const tempPath = path.join(
          os.tmpdir(),
          `${Date.now()}-${part.filename}`
        );

        await pipeline(part.file, fs.createWriteStream(tempPath));
        const stats = fs.statSync(tempPath);
        if(stats.size > 0){
          imageUrl = await uploadImage(tempPath, "portfolio-utility/teachers");
        }
        fs.unlinkSync(tempPath);
      } else if (part.type === "field") {
        fields[part.fieldname] = part.value as string;
      }
    }
  } else {
    fields = request.body as Record<string, string>;
    imageUrl = fields.imageUrl;
    delete fields.imageUrl;
  }

  const body = registerTeacherSchema.safeParse({
    ...fields,
    teachingSince: fields.teachingSince ? Number(fields.teachingSince) : undefined,
  });

  if (!body.success) {
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      errors:  body.error.flatten().fieldErrors,
    });
  }

  const teacher = await teacherService.register(
    { ...body.data, imageUrl },
    request
  );

  return reply.status(201).send({
    success: true,
    message: "Teacher registered successfully",
    data:    teacher,
  });
};

export const bulkUploadTeachers = async (
  request: FastifyRequest,
  reply:FastifyReply
)=>{
  if(!request.isMultipart()){
    throw new AppError(400, ErrorCode.VALIDATION_ERROR, 'Request must be multipart/form-data');
  }
  const fileData = await request.file();
  if(!fileData || !fileData.filename.endsWith('.csv')){
    throw new AppError(400, ErrorCode.VALIDATION_ERROR, 'Please upload a valid .csv file');
  }

  const result = await teacherService.processBulkCSV(fileData.file);
  return reply.status(200).send({
    success: true,
    message: "Bulk CSV processing completed",
    data: result
  });
}

export const getTeachers = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { search } = request.query as { search?: string };
  const { page, limit } = getPaginationParams(request.query as Record<string, unknown>);

  const { data, total } = await teacherService.getAll(search, page, limit);

  return reply.send({
    success: true,
    message: data.length === 0? "No teachers found" : "Teachers fetched successfully",
    data,
    pagination: calculatePagination(total, page, limit),
  });
};

export const getTeacherById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id }    = request.params as { id: string };
  const teacher   = await teacherService.getById(id);

  return reply.send({
    success: true,
    message: "Teacher fetched successfully",
    data:    teacher,
  });
};

export const updateTeacher = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };

  let fields: Record<string, string> = {};
  let imageUrl: string | undefined;

  if (request.isMultipart()) {
    const parts = request.parts();

    for await (const part of parts) {
      if (part.type === "file" && part.filename) {
        const os       = await import("os");
        const path     = await import("path");
        const fs       = await import("fs");
        const { pipeline } = await import("stream/promises");
        const { uploadImage } = await import("../utils/cloudinaryImageHandler");

        const tempPath = path.join(
          os.tmpdir(),
          `${Date.now()}-${part.filename}`
        );

        await pipeline(part.file, fs.createWriteStream(tempPath));
        imageUrl = await uploadImage(tempPath, "portfolio-utility/teachers");
        fs.unlinkSync(tempPath);
      } else if (part.type === "field") {
        fields[part.fieldname] = part.value as string;
      }
    }
  } else {
    fields = request.body as Record<string, string>;
  }

  const body = updateTeacherSchema.safeParse(fields);
  if (!body.success) {
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      errors:  body.error.flatten().fieldErrors,
    });
  }

  const teacher = await teacherService.update(id, body.data, imageUrl);
  return reply.send({
    success: true,
    message: "Teacher updated successfully",
    data:    teacher,
  });
};

export const deleteTeacher = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  await teacherService.delete(id);

  return reply.send({
    success: true,
    message: "Teacher deleted successfully",
  });
};