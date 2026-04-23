import { authService } from "../../src/services/auth.service";
import { userRepository } from "../../src/repositories/user.repository";
import { hashedPassword, comparePassword } from "../../src/utils/passwordHasherVerifier";
import { AppError } from "../../src/utils/errorHandler";

// Mock dependencies
jest.mock("../../src/repositories/user.repository");
jest.mock("../../src/utils/passwordHasherVerifier");
jest.mock("../../src/utils/idGenerator");
jest.mock("../../src/repositories/refreshToken.repository");

const mockUserRepository = userRepository as jest.Mocked<typeof userRepository>;

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should throw conflict error if email already exists", async () => {
      mockUserRepository.findByEmail.mockResolvedValue({
        id:        "USR-2026-0001",
        email:     "admin@portfolio.com",
        password:  "hashed",
        role:      "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        authService.register("admin@portfolio.com", "Admin1234")
      ).rejects.toThrow(AppError);
    });

    it("should register successfully with new email", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(undefined);
      mockUserRepository.create.mockResolvedValue({
        id:        "USR-2026-0002",
        email:     "new@portfolio.com",
        password:  "hashed",
        role:      "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      (hashedPassword as jest.Mock).mockResolvedValue("hashed");

      const result = await authService.register("new@portfolio.com", "Admin1234");
      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });
  });

  describe("login", () => {
    it("should throw error if user not found", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(undefined);

      await expect(
        authService.login("notfound@portfolio.com", "Admin1234")
      ).rejects.toThrow(AppError);
    });

    it("should throw error if password is invalid", async () => {
      mockUserRepository.findByEmail.mockResolvedValue({
        id:        "USR-2026-0001",
        email:     "admin@portfolio.com",
        password:  "hashed",
        role:      "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login("admin@portfolio.com", "wrongpassword")
      ).rejects.toThrow(AppError);
    });

    it("should login successfully with correct credentials", async () => {
      mockUserRepository.findByEmail.mockResolvedValue({
        id:        "USR-2026-0001",
        email:     "admin@portfolio.com",
        password:  "hashed",
        role:      "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      (comparePassword as jest.Mock).mockResolvedValue(true);

      const result = await authService.login("admin@portfolio.com", "Admin1234");
      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });
  });
});