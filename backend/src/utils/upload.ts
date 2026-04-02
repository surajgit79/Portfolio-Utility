import { FastifyRequest } from "fastify";
import { uploadImage } from "./cloudinary";
import path from "path";
import fs, { unlinkSync } from "fs";
import os from "os";
import { pipeline } from "stream/promises";
import { file } from "zod";

export const uploadSingleImage = async(
    request: FastifyRequest,
    folder: string
): Promise<string | null>=>{
    
    const data = await request.file();

    if(!data) return null;

    const tempPath = path.join(os.tmpdir(), `${Date.now()}-${data.filename}`);
    await pipeline(data.file, fs.createWriteStream(tempPath));

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
        const tempPath = path.join(os.tmpdir(), `${Date.now()}-${data.filename}`);
        await pipeline(data.file, fs.createWriteStream(tempPath));

        const url = await uploadImage(tempPath, folder);
        fs.unlinkSync(tempPath);

        urls.push(url);
    }
    return urls;
};