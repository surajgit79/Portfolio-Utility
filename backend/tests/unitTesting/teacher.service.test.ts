import { db } from "../../src/db/client";
import { teacherRepository } from "../../src/repositories/teacher.repository";
import { userRepository } from "../../src/repositories/user.repository";
import { teacherService } from "../../src/services/teacher.service";
import { AppError } from "../../src/utils/errorHandler";
import { gradeEnum } from "../../src/db/schema";

type GradeType = (typeof gradeEnum.enumValues)[number] | null;

type TeacherSelect = {
  id: string;
  userId: string;
  name: string;
  address: string;
  contact: string;
  email: string;
  gender: "Male" | "Female" | "Others";
  imageUrl: string | null;
  dob: string;
  qualification: string | null;
  teachingSince: number | null;
  createdAt: Date;
  updatedAt: Date;
  currentOrganization: string | null;
  currentGrade: GradeType;
  program: "Activity-based Mathematics" | "Reading & Language" | "Pre-School Transformation" | null;
  module: string | null;
  unit: string | null;
  skills: Array<{ id: string | null; name: string | null; program: "Activity-based Mathematics" | "Reading & Language" | "Pre-School Transformation" | null; module: string | null; unit: string | null }>;
  currentGrades: (string | null)[];
  currentOrganizations: string[];
  trainings: Array<{ program: "Activity-based Mathematics" | "Reading & Language" | "Pre-School Transformation" | null; module: string | null; unit: string | null }>;
};

jest.mock("../../src/repositories/teacher.repository");
jest.mock("../../src/repositories/user.repository");
jest.mock("../../src/utils/idGenerator");
jest.mock("../../src/db/client", ()=>({
    db: {
        transaction: jest.fn((cb)=> cb({
            insert: jest.fn().mockReturnValue({
                values:jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockTeacher]),
                }),
            }),
        })),
    },
}));

jest.mock("../../src/repositories/teacherSkill.repository", () => ({
  teacherSkillRepository: {
    findByTeacherIdWithSkill:   jest.fn().mockResolvedValue([]),
    getPercentageByTeacher:     jest.fn().mockResolvedValue([]),
  },
}));

const mockTeacher = {
    id: "TCH-2026-0001",
    userId: "USR-2026-0002",
    name: "Ram Bahadur",
    address: "Kathmandu",
    contact: "9841000001",
    email: "ram@school.com",
    gender: "Male" as const,
    imageUrl: null,
    dob: "1985-03-15",
    teachingSince: 2010,
    qualification: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    currentOrganization: null,
    currentGrade: null,
    program: "Activity-based Mathematics" as const,
    module: "Class 4",
    unit: "Book 1",
    skills: [] as Array<{ id: string | null; name: string | null; program: "Activity-based Mathematics" | "Reading & Language" | "Pre-School Transformation" | null; module: string | null; unit: string | null }>,
    currentGrades: [] as GradeType[],
    currentOrganizations: [] as string[],
    trainings: [] as Array<{ program: "Activity-based Mathematics" | "Reading & Language" | "Pre-School Transformation" | null; module: string | null; unit: string | null }>,
};

const mockUser = {
    id: "USR-2026-0002",
    email: "ram@school.com",
    password: "hashed",
    role: "teacher" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
};

const mockTeacherRepository = teacherRepository as jest.Mocked<typeof teacherRepository>;
const mockUserRepository = userRepository as jest.Mocked<typeof userRepository>;

describe("TeacherService", ()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });

    describe("getById", ()=>{
        it("should return teacher with tenure if found", async()=>{
            mockTeacherRepository.findById.mockResolvedValue(mockTeacher);

            const result = await teacherService.getById("TCH-2026-0001");
            expect(result).toHaveProperty("id", "TCH-2026-0001");
            expect(result).toHaveProperty("tenure");
        });

        it("should return 404 if teacher not found", async () =>{
            mockTeacherRepository.findById.mockResolvedValue(null);

            await expect(
                teacherService.getById("TCH-0000-0000")
            ).rejects.toThrow(AppError);
        });
    });

    describe("delete", () => {
        it("should delete teacher successfully", async () => {
            mockTeacherRepository.findById.mockResolvedValue(mockTeacher);
            mockTeacherRepository.delete.mockResolvedValue();

            await expect(
                teacherService.delete("TCH-2026-0001")
            ).resolves.not.toThrow();
        });

        it("should throw 404 if teacher not found", async () => {
            mockTeacherRepository.findById.mockResolvedValue(null);

            await expect(
                teacherService.delete("TCH-0000-0000")
            ).rejects.toThrow(AppError);
        });
    });

    describe("update", () => {
        it("should update teacher successfully", async () => {
        mockTeacherRepository.findById.mockResolvedValue(mockTeacher);
        mockTeacherRepository.update.mockResolvedValue({
            ...mockTeacher,
            name: "Ram Bahadur Updated",
        });

        const result = await teacherService.update(
            "TCH-2026-0001",
            { name: "Ram Bahadur Updated" },
            undefined
        );

        expect(result).toHaveProperty("name", "Ram Bahadur Updated");
        });

        it("should throw 404 if teacher not found", async () => {
        mockTeacherRepository.findById.mockResolvedValue(null);

        await expect(
            teacherService.update("TCH-0000-0000", { name: "Test" }, undefined)
        ).rejects.toThrow(AppError);
        });
    });

    describe("register", () => {
        it("should throw 409 if email already exists", async () => {
        mockUserRepository.findByEmail.mockResolvedValue(mockUser);

        await expect(
            teacherService.register({
            email:    "ram@school.com",
            password: "Teacher1234",
            name:     "Ram Bahadur",
            address:  "Kathmandu",
            contact:  "9841000001",
            gender:   "Male",
            dob:      "1985-03-15",
            }, {} as any)
        ).rejects.toThrow(AppError);
        });
    });
})