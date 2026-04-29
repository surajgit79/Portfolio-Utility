import { skillRepository } from "../repositories/skill.repository";
import { generateId } from "../utils/idGenerator";
import { AppError, ErrorCode } from "../utils/errorHandler";

export const skillService = {
    getAll: async (program?: string, module?:string, unit?:string, page= 1, limit = 10) => {
        const [data, total] = await Promise.all([
            skillRepository.findAll(program, module, unit, page, limit),
            skillRepository.countAll(program, module, unit),
        ]);

        return { data, total };
    },

    getById: async (id: string) => {
        const skill = await skillRepository.findById(id);

        if (!skill) {
            throw new AppError(404, ErrorCode.NOT_FOUND, "Skill not found");
        }

        return skill;
    },

    create: async (data: {
        name:    string;
        program: "Activity-based Mathematics" | "Reading & Language" | "Pre-School Transformation";
        module:  string;
        unit?:   string;
    }) => {
        const duplicate = await skillRepository.findDuplicate(data.name, data.program, data.module, data.unit);
        if (duplicate) {
            throw new AppError(409, ErrorCode.CONFLICT, "Skill already exists for this program/module/unit");
        }

        const id = await generateId("skills");
        return skillRepository.create({
            id,
            name: data.name,
            program: data.program,
            module: data.module,
            unit: data.unit ?? null,
        });
    },

    bulkCreate: async (data: {
        name:    string;
        program: "Activity-based Mathematics" | "Reading & Language" | "Pre-School Transformation";
        module:  string;
        unit?:   string;
    }[]) => {
        const created = [];
        const skipped = [];

        for (const item of data) {
            const duplicate = await skillRepository.findDuplicate(item.name, item.program, item.module, item.unit);

            if (duplicate) {
                skipped.push({ name: item.name, reason: "Already exists" });
                continue;
            }

            const id    = await generateId("skills");
            const skill = await skillRepository.create({
                id,
                name:    item.name,
                program: item.program,
                module:  item.module,
                unit:    item.unit ?? null,
            });

            created.push(skill);
        }

        return { created, skipped };
    },

    delete: async (id: string) => {
        const skill = await skillRepository.findById(id);

        if (!skill) {
            throw new AppError(404, ErrorCode.NOT_FOUND, "Skill not found");
        }

        await skillRepository.delete(id);
    },
};