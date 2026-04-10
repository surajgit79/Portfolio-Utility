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