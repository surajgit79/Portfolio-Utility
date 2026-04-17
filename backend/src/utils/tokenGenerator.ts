import crypto from 'crypto';

export const generateAuthToken = () =>{
    const rawToken = crypto.randomBytes(10).toString('hex');

    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const expiresAt = new Date (Date.now() + 15*60*1000);

    return { rawToken, hashedToken, expiresAt};
}