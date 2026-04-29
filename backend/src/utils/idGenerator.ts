import { db } from "../db/client";
import { sql } from "drizzle-orm";

type TableName = | "users" | "teachers" | "training_events" | "training_records" | "career_records" | "event_records" | "skills" | "teacher_skills";

const prefixMap: Record <TableName, string>= {
    users: "USR",
    teachers: "TCH",
    training_events: "TRN",
    training_records: "TRC",
    career_records: "CAR",
    event_records: "EVT",
    skills: "SKL",
    teacher_skills: "TSK"
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

export const generateCertificateNumber = async(
    program: string,
    module: string,
    unit: string | null
): Promise<string> =>{
    const year = new Date().getFullYear();


    const programCode = program === "Activity-based Mathematics" ? "ABM"
        : program === "Reading & Language"? "R&L"
        : program === "Pre-School Transformation"? "PST" 
        : "UNKNOWN";

    const moduleCode =
        module === "Class 4"    ? "C4" :
        module === "Class 5"    ? "C5" :
        module === "Class 6"    ? "C6" :
        module === "Phonics"    ? "PHO" :
        module === "Writer Workshop"    ? "WW" :
        module === "Guided Reading"     ? "GR" :
        module === "Book-based Activity" ? "BBA" :
        module === "Coffee House"        ? "CH" :
        module === "Circle Time"         ? "CT" :
        module === "Setting and Development of Communication" ? "SD" :
        module === "Material Development"                     ? "MD" :
        module === "Story Telling Session"                    ? "ST" :
        module === "Music and Movement Session"               ? "MM" :
        module === "Continuous Assessment System"             ? "CA" :
        module === "Curriculum Development Training"          ? "CD" :
        module.substring(0, 3).toUpperCase();

    const unitCode =
        !unit                ? "" :
        unit === "Book 1"    ? "B1" :
        unit === "Book 2"    ? "B2" :
        unit === "Book 3"    ? "B3" :
        unit === "Set 1"     ? "S1" :
        unit === "Set 2"     ? "S2" :
        unit === "Set 3"     ? "S3" :
        unit === "Set 4"     ? "S4" :
        unit === "Set 5"     ? "S5" :
        unit === "Set 6"     ? "S6" :
        unit === "Set 7"     ? "S7" :
        unit === "Chop and blend of Short Vowel Words (CVC word)" ? "CVC" :
        unit === "Chop and blend of Long Vowel Words"             ? "LVW" :
        unit === "Consonant Blending (Chop and Blend)"            ? "CB"  :
        unit === "R-controlled Blending (Chop and Blend)"         ? "RCB" :
        unit.substring(0, 3).toUpperCase();

    const prefix = unitCode ? `${programCode}-${moduleCode}${unitCode}` : `${programCode}-${moduleCode}`;

    const pattern = `${prefix}-${year}-%`;

    const result = await db.execute(
        sql `SELECT certificate_number FROM training_records
                WHERE certificate_number LIKE ${pattern}
                ORDER BY certificate_number DESC
                LIMIT 1`
    );

    const rows = result.rows as { certificate_number: string}[];

    if (rows.length === 0) {
        return `${prefix}-${year}-0001`;
    }

    const lastNumber = parseInt(rows[0].certificate_number.split("-").pop()!, 10);
    const nextNumber = String(lastNumber + 1).padStart(4, "0");

    return `${prefix}-${year}-${nextNumber}`;
};