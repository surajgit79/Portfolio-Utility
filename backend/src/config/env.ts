import { validateEnv } from "./validateEnv";

const _env = validateEnv();

export const env = {
  port: Number(_env.PORT) || 3000,
  databaseUrl: _env.DATABASE_URL,
  jwtSecret: _env.JWT_SECRET,
  jwtExpiresIn: _env.JWT_EXPIRES_IN,
  frontendUrl: _env.FRONTEND_URL,
  s3Endpoint: _env.S3_ENDPOINT,
  s3Region: _env.S3_REGION,
  s3AccessKey: _env.S3_ACCESS_KEY,
  s3SecretKey: _env.S3_SECRET_KEY,
  s3Bucket: _env.S3_BUCKET,
  s3PublicUrl: _env.S3_PUBLIC_URL,
  chromePath: _env.CHROME_PATH,
};