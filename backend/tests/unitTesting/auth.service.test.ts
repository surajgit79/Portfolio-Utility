import { success } from "zod";
import { refreshTokenRepository } from "../../src/repositories/refreshToken.repository";
import { userRepository } from "../../src/repositories/user.repository";
import { authService } from "../../src/services/auth.service";
import { AppError } from "../../src/utils/errorHandler";
import { comparePassword, hashedPassword } from "../../src/utils/passwordHasherVerifier";

jest.mock("../../src/repositories/user.repository");
jest.mock("../../src/repositories/refreshToken.repository");
jest.mock("../../src/utils/passwordHasherVerifier");
jest.mock("../../src/utils/idGenerator");


const mockUserRepository = userRepository as jest.Mocked<typeof userRepository>;
const mockRefreshTokenRepository = refreshTokenRepository as jest.Mocked<typeof refreshTokenRepository>;

const mockUser = {
  id: "USR-2026-0001",
  email: "admin@portfolio.com",
  password: "hashed",
  role: "admin" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("AuthService", ()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
  });

  describe("register", ()=>{
    it("should throw 409 error if email already exists", async()=>{
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(
        authService.register("admin@portfolio.com", "Admin1234")
      ).rejects.toThrow(AppError);
    });

    it("should return accessToken and refreshToken on success", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(undefined);
      mockUserRepository.create.mockResolvedValue(mockUser);
      mockRefreshTokenRepository.create.mockResolvedValue({
        id: "uuid",
        userId: mockUser.id,
        token: "refresh-token",
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      (hashedPassword as jest.Mock).mockResolvedValue("hashed");

      const result = await authService.register("admin@portfolio.com", "Admin1234");

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });
  });

  describe("login", () =>{
    it("should throw 401 if user not found", async()=>{
      mockUserRepository.findByEmail.mockResolvedValue(undefined);

      await expect(
        authService.login("notfound@portfolio.com", "Admin1234")
      ).rejects.toThrow(AppError);
    });

    it("should throw 401 if password is invalid", async() =>{
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login("admin@portfolio.com", "wthpassword")
      ).rejects.toThrow(AppError);
    });

    it("should return accessToken and refreshToken on success", async() =>{
      mockUserRepository.create.mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      mockRefreshTokenRepository.create.mockResolvedValue({
        id: "uuid",
        userId: mockUser.id,
        token: "refresh-token",
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      const result = await authService.login("admin@portfolio.com", "Admin1234");

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });
  });

  describe("refresh", ()=>{
    it("should throw 401 if refresh token is not found", async ()=>{
      mockRefreshTokenRepository.findByToken.mockResolvedValue(undefined);

      await expect(
        authService.refresh("invalid-token")
      ).rejects.toThrow(AppError);
    });

    it("should throw 401 if refresh token is expired", async() =>{
      mockRefreshTokenRepository.findByToken.mockResolvedValue({
        id: "uuid",
        userId: mockUser.id,
        token: "expired-token",
        expiresAt: new Date("2025-11-12"), //random past date
        createdAt: new Date(),
      });

      await expect(
        authService.refresh("expired-token")
      ).rejects.toThrow(AppError);
    });

    it("should return new tokens on success", async () => {
      mockRefreshTokenRepository.findByToken.mockResolvedValue({
        id: "uuid",
        userId: mockUser.id,
        token: "valid-token",
        expiresAt: new Date(Date.now() + 7*24*60*60*1000),
        createdAt: new Date(),
      });

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockRefreshTokenRepository.deleteByToken.mockResolvedValue();
      mockRefreshTokenRepository.create.mockResolvedValue({
        id: "uuid",
        userId: mockUser.id,
        token: "new-refresh-token",
        expiresAt: new Date(Date.now() + 7*24*60*60*1000),
        createdAt: new Date(),
      });

      const result = await authService.refresh("valid-token");

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });
  })

  describe("logout", () => {
    it("should throw 401 if refresh token not found", async () => {
      mockRefreshTokenRepository.findByToken.mockResolvedValue(undefined);

      await expect(
        authService.logout("invalid-token")
      ).rejects.toThrow(AppError);
    });

    it("should logout successfully", async () => {
      mockRefreshTokenRepository.findByToken.mockResolvedValue({
        id: "uuid",
        userId: mockUser.id,
        token: "valid-token",
        expiresAt: new Date(Date.now() + 7*24*60*60*1000),
        createdAt: new Date(),
      });

      mockRefreshTokenRepository.deleteByToken.mockResolvedValue();

      await expect(
        authService.logout("valid-token")
      ).resolves.not.toThrow();
    });
  });
});