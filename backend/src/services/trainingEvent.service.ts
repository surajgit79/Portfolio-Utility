import { trainingEventRepository } from "../repositories/trainingEvent.repository"
import { AppError, ErrorCode } from "../utils/errorHandler";
import { generateId } from "../utils/idGenerator";

export const trainingEventService = {
    getAll: async(category?: string, sector?: string, phase?: string, page = 1, limit = 10)=>{
        const [data, total] = await Promise.all([
            trainingEventRepository.findAll(category, sector, phase, page, limit),
            trainingEventRepository.countAll(category, sector, phase)
        ]);
        return { data, total};
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
        const duplicate = await trainingEventRepository.findDuplicate(
            data.category, data.sector, data.phase, new Date(data.startDate)
        );
        if(duplicate){
            throw new AppError(409, ErrorCode.CONFLICT, "A training event with the same category, same sector and start date already exists");
        }

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