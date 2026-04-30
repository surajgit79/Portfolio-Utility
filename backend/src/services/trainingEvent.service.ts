import { trainingEventRepository } from "../repositories/trainingEvent.repository"
import { AppError, ErrorCode } from "../utils/errorHandler";
import { generateId } from "../utils/idGenerator";

export const trainingEventService = {
    getAll: async(program?: string, module?: string, unit?: string, page = 1, limit = 10)=>{
        const [data, total] = await Promise.all([
            trainingEventRepository.findAll(program, module, unit, page, limit),
            trainingEventRepository.countAll(program, module, unit)
        ]);
        return { data, total};
    },

    getById: async(id: string)=>{
        const event = await trainingEventRepository.findById(id);
        if(!event){
            throw new AppError(404, ErrorCode.NOT_FOUND, "Training event not found");
        }

        return event;
    },

    create: async (data: {
        program: "Activity-based Mathematics" | "Reading & Language" | "Pre-School Transformation";
        module: string;
        unit?: string;
        name: string;
        mentorsName?: string;
        venue?: string;
        description?: string;
        startDate: string;
        duration: string;
    }) => {
        const duplicate = await trainingEventRepository.findDuplicate(
            data.program, data.module, data.unit, new Date(data.startDate)
        );
        if(duplicate){
            throw new AppError(409, ErrorCode.CONFLICT, "A training event with the same program, same module and start date already exists");
        }

        const id = await generateId("training_events");

        return trainingEventRepository.create({
            id, ...data, startDate: new Date(data.startDate),
        });
    },

    update: async (id: string, data:Partial<{
        program: "Activity-based Mathematics" | "Reading & Language" | "Pre-School Transformation";
        module: string;
        unit: string;
        name: string;
        mentorsName: string;
        venue: string;
        description: string;
        startDate: string;
        duration: string;
    }>) =>{
        const existing = await trainingEventRepository.findById(id);
        if (!existing) {
        throw new AppError(404, ErrorCode.NOT_FOUND, "Training event not found");
        }

        const { startDate, ...rest } = data;

        return trainingEventRepository.update(id, {
        ...rest,
        ...(startDate && { startDate: new Date(startDate) }),
        updatedAt: new Date(),
        });
    },

    delete: async(id: string) =>{
        const existing = await trainingEventRepository.findById(id);
        if (!existing) {
        throw new AppError(404, ErrorCode.NOT_FOUND, "Training event not found");
        }

        await trainingEventRepository.delete(id);
    },
};