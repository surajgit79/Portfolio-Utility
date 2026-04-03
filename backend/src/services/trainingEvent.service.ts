import { trainingEventRepository } from "../repositories/trainingEvent.repository"
import { AppError, ErrorCode } from "../utils/errorHandler";
import { generateId } from "../utils/idGenerator";

export const trainingEventService = {
    getAll: async(category?: string, sector?: string, phase?: string)=>{
        return trainingEventRepository.findAll(category, sector, phase);
    },

    getById: async(id: string)=>{
        const event =trainingEventRepository.findById(id);
        if(!event){
            throw new AppError(404, ErrorCode.NOT_FOUND, "Training event not found");
        }

        return event;
    },

    create: async (data: {
        category:    "Activity-based Mathematics" | "Reading" | "Pre-School";
        sector:      string;
        phase?:      string;
        name:        string;
        mentorsName?: string;
        venue?:      string;
        description?: string;
        startDate:   string;
        duration:    string;
    }) => {
        const id = await generateId("training_events");

        return trainingEventRepository.create({
        id,
        ...data,
        startDate: new Date(data.startDate),
        });
    },

    update: async (id: string, data:Partial<{
        category:    "Activity-based Mathematics" | "Reading" | "Pre-School";
        sector:      string;
        phase:       string;
        name:        string;
        mentorsName: string;
        venue:       string;
        description: string;
        startDate:   string;
        duration:    string;
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
}