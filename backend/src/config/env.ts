import { validateEnv } from "./validateEnv";

const _env = validateEnv();

export const env = {
  port:                Number(_env.PORT) || 3000,
  databaseUrl:         _env.DATABASE_URL,
  jwtSecret:           _env.JWT_SECRET,
  jwtExpiresIn:        _env.JWT_EXPIRES_IN,
  frontendUrl:         _env.FRONTEND_URL,
  cloudinaryCloudName: _env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey:    _env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: _env.CLOUDINARY_API_SECRET,
};