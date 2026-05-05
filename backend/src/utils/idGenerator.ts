import { db } from "../db/client";
import { sql } from "drizzle-orm";

type TableName = | "users" | "teachers" | "training_events" | "training_records" | "career_records" | "event_records" | "skills" | "teacher_skills" | "certificates" | "certificate_modules";

const prefixMap: Record <TableName, string>= {
    users: "USR",
    teachers: "TCH",
    training_events: "TRN",
    training_records: "TRC",
    career_records: "CAR",
    event_records: "EVT",
    skills: "SKL",
    teacher_skills: "TSK",
    certificates: "CRT",
    certificate_modules: "CMO"
};

export const generateId = async (table: TableName) : Promise<string>=>{
    const year = new Date().getFullYear();
    const prefix = prefixMap[table];
    const pattern = `${prefix}-${year}-%`;

    const result = await db.execute(
        sql `SELECT id FROM ${sql.identifier(table)}
            WHERE id LIKE ${pattern}
            ORDER BY id desc
            LIMIT 1`
    );

    const rows = result.rows as { id: string}[];

    if(rows.length === 0){
        return `${prefix}-${year}-0001`;
    }

    const lastId = rows[0].id; 
    const lastNumberId = parseInt(lastId.split("-").pop()!, 10);
    const nextNumber = String(lastNumberId + 1 ).padStart(4, "0");

    return `${prefix}-${year}-${nextNumber}`;
};

export const generateCertificateNumber = async (
    program: string
): Promise<string> => {
    const year = new Date().getFullYear();

    const programCode =
        program === "Activity-based Mathematics" ? "ABM" :
        program === "Reading & Language"         ? "R&L" :
        program === "Pre-School Transformation"  ? "PST" : "UNK";

    const prefix  = `${programCode}-${year}`;
    const pattern = `${prefix}-%`;

    const result = await db.execute(
        sql`SELECT certificate_number FROM certificates
            WHERE certificate_number LIKE ${pattern}
            ORDER BY certificate_number DESC
            LIMIT 1`
    );

    const rows = result.rows as { certificate_number: string }[];

    if (rows.length === 0) {
        return `${prefix}-0001`;
    }

    const lastNumber = parseInt(rows[0].certificate_number.split("-").pop()!, 10);
    const nextNumber = String(lastNumber + 1).padStart(4, "0");

    return `${prefix}-${nextNumber}`;
};