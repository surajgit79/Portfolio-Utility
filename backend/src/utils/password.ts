import bcrypt from "bcryptjs";

export const hashedPassword = async (password: string): Promise<string> =>{
    return bcrypt.hash(password, 10);
}

export const comparePassword = async (
    password: string,
    hashed: string
): Promise<boolean> =>{
    return bcrypt.compare(password, hashed);
};