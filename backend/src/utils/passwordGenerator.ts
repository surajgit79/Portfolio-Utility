import crypto from "crypto";

export const generateTempPassword = (length: number = 10): string =>{
    return crypto.randomBytes(length).toString('base64url').slice(0, length);
}