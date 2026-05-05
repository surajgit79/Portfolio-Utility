import { db } from "../db/client";
import { certificates, certificateModules, teachers, trainingRecords } from "../db/schema";
import { eq, and } from "drizzle-orm";

export const certificateRepository = {
  findByTeacherAndProgram: async (
    teacherId: string,
    program:   string
  ) => {
    const [certificate] = await db
      .select()
      .from(certificates)
      .where(
        and(
          eq(certificates.teacherId, teacherId),
          eq(certificates.program,   program as any)
        )
      );
    return certificate;
  },

  findByNumber: async (certificateNumber: string) => {
    const [certificate] = await db
      .select()
      .from(certificates)
      .where(eq(certificates.certificateNumber, certificateNumber));
    return certificate;
  },

  findModulesByCertificateId: async (certificateId: string) => {
    return db
      .select()
      .from(certificateModules)
      .where(eq(certificateModules.certificateId, certificateId));
  },

  findModuleDuplicate: async (
    certificateId: string,
    module:        string,
    unit:          string | null
  ) => {
    const conditions = [
      eq(certificateModules.certificateId, certificateId),
      eq(certificateModules.module, module),
    ];

    if (unit) conditions.push(eq(certificateModules.unit, unit));

    const [existing] = await db
      .select()
      .from(certificateModules)
      .where(and(...conditions));
    return existing;
  },

  create: async (data: {
    id:                string;
    teacherId:         string;
    program:           string;
    certificateNumber: string;
  }) => {
    const [certificate] = await db
      .insert(certificates)
      .values({
        id:                data.id,
        teacherId:         data.teacherId,
        program:           data.program as any,
        certificateNumber: data.certificateNumber,
      })
      .returning();
    return certificate;
  },

  addModule: async (data: {
    id:               string;
    certificateId:    string;
    trainingRecordId: string;
    module:           string;
    unit:             string | null;
  }) => {
    const [module] = await db
      .insert(certificateModules)
      .values({
        id:               data.id,
        certificateId:    data.certificateId,
        trainingRecordId: data.trainingRecordId,
        module:           data.module,
        unit:             data.unit ?? null,
      })
      .returning();
    return module;
  },

  updateTimestamp: async (certificateId: string) => {
    await db
      .update(certificates)
      .set({ updatedAt: new Date() })
      .where(eq(certificates.id, certificateId));
  },

  findByEventIdWithTeachers: async (eventId: string) => {
    return db
      .select({
        teacherId:         trainingRecords.teacherId,
        trainingRecordId:  trainingRecords.id,
        teacherName:       teachers.name,
      })
      .from(trainingRecords)
      .innerJoin(teachers, eq(trainingRecords.teacherId, teachers.id))
      .where(eq(trainingRecords.trainingEventId, eventId))
      .orderBy(teachers.name);
  },

  findWithModules: async (certificateId: string) => {
    const [certificate] = await db
      .select()
      .from(certificates)
      .where(eq(certificates.id, certificateId));

    if (!certificate) return null;

    const teacher = await db
      .select({ name: teachers.name, id: teachers.id })
      .from(teachers)
      .where(eq(teachers.id, certificate.teacherId));

    const modules = await db
      .select()
      .from(certificateModules)
      .where(eq(certificateModules.certificateId, certificateId));

    return {
      ...certificate,
      teacher:      teacher[0],
      modules:      modules.map((m) => ({
        module: m.module,
        unit:   m.unit,
      })),
    };
  },
};