import { FastifyRequest } from "fastify";
import { uploadImage } from "./cloudinaryImageHandler";
import path from "path";
import fs, { unlinkSync } from "fs";
import os from "os";
import { pipeline } from "stream/promises";
import { AppError, ErrorCode } from "./errorHandler";

const MAX_FILE_SIZE = 5*1024*1024; // 5mb
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export const uploadSingleImage = async(
    request: FastifyRequest,
    folder: string
): Promise<string | null>=>{
    
    const data = await request.file();
    if(!data) return null;

    if(!ALLOWED_MIME_TYPES.includes(data.mimetype)){
        throw new AppError( 400, ErrorCode.VALIDATION_ERROR, `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`);
    }

    const tempPath = path.join(os.tmpdir(), `${Date.now()}-${data.filename}`);
    await pipeline(data.file, fs.createWriteStream(tempPath));

    const stats = fs.statSync(tempPath);
    if (stats.size > MAX_FILE_SIZE) {
        fs.unlinkSync(tempPath);
        throw new AppError(400, ErrorCode.VALIDATION_ERROR, "File size exceeds 5MB limit");
    }

    // Check file is not empty
    if (stats.size === 0) {
        fs.unlinkSync(tempPath);
        throw new AppError(400, ErrorCode.VALIDATION_ERROR,"File is empty");
    }

    const url = await uploadImage(tempPath, folder);

    fs.unlinkSync(tempPath);
    return url;
}

export const uploadMultipleImages = async(
    request: FastifyRequest,
    folder: string
):Promise<string[]> =>{
    const files = request.files();

    const urls: string[] = [];

    for await(const data of files){
        if(!ALLOWED_MIME_TYPES.includes(data.mimetype)){
            throw new AppError( 400, ErrorCode.VALIDATION_ERROR, `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`);
        }

        const tempPath = path.join(os.tmpdir(), `${Date.now()}-${data.filename}`);
        await pipeline(data.file, fs.createWriteStream(tempPath));

        // Check file size
        const stats = fs.statSync(tempPath);
        if (stats.size > MAX_FILE_SIZE) {
            fs.unlinkSync(tempPath);
            throw new AppError(400, ErrorCode.VALIDATION_ERROR, `File ${data.filename} exceeds 5MB limit`);
        }

        // Check file is not empty
        if (stats.size === 0) {
            fs.unlinkSync(tempPath);
            throw new AppError(400, ErrorCode.VALIDATION_ERROR,`File ${data.filename} is empty`);
        }

        const url = await uploadImage(tempPath, folder);
        fs.unlinkSync(tempPath);
        urls.push(url);
    }
    return urls;
};