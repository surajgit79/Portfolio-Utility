import { parse } from "csv-parse/sync";

export const parseCSV = (buffer: Buffer): Record<string, string>[] =>{
    return parse(buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });
};

export const validateCSVHeaders = (
    rows: Record<string, string>[],
    requiredHeaders: string[]
): { valid: boolean; missing: string[] }=>{
    if(rows.length === 0){
        return { valid: false, missing: requiredHeaders}
    }

    const headers = Object.keys(rows[0]);
    const missing = requiredHeaders.filter((h) => !headers.includes(h));

    return {
        valid: missing.length === 0,
        missing,
    };
};