import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";

cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret
});

export const uploadImage = async (
    filePath: string,
    folder: string
): Promise<string>=>{
    const result = await cloudinary.uploader.upload(filePath,{
        folder,
        resource_type: "image"
    });

    return result.secure_url;
};

export const deleteImage = async (publicId:string): Promise<void>=>{
    await cloudinary.uploader.destroy(publicId);
};

export const getPublicIdFromUrl = (url:string): string =>{
    const parts = url.split("/");
    const fileName = parts[parts.length - 1].split(".")[0];
    const folder = parts[parts.length - 2];
    return `${folder}/${fileName}`;
};

export const deleteImageByUrl = async (url: string): Promise<void> => {
    const publicId = getPublicIdFromUrl(url);
    await cloudinary.uploader.destroy(publicId);
};

export const uploadBuffer = async (
    buffer: Buffer,
    folder: string,
    filename: string
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
        { folder, public_id: filename, resource_type: "raw" },
        (error, result) => {
            if (error) reject(error);
            else resolve(result!.secure_url);
        }
        );
        stream.end(buffer);
    });
};