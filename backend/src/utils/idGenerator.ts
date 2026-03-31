import { db } from "../db/client";
import { desc, sql } from "drizzle-orm";

type TableName = | "users" | "teachers" | "training_events" | "training_records" | "career_records" | "event_records";

const prefixMap: Record <TableName, string>= {
    users: "USR",
    teachers: "TCH",
    training_events: "TRN",
    training_records: "TRC",
    career_records: "CAR",
    event_records: "EVT",
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
    category: string,
    sector: string,
    phase: string | null
): Promise<string> =>{
    const year = new Date().getFullYear();


    const categoryCode = category === "Activity-based Mathematics" ? "ABM"
        : category === "Reading"? "RED"
        : "PRE";

    const sectorCode = sector === "Book 1"? "B1"
        : sector === "Book 2"? "B2"
        : sector === "Book 3"? "B3"
        : sector === "Phonics" ? "PHO"
        : sector === "Guided Reading" ? "GR"
        : sector === "Book-based Activities" ? "BBA"
        : sector === "Writing Workshop" ? "WW"
        : "";

    const phaseCode = phase === "Phase 1" ? "P1"
        : phase === "Phase 2" ? "P2"
        : null;

    const prefix = phaseCode
        ? `${categoryCode}-${sectorCode}${phaseCode}`
        : sectorCode
        ? `${categoryCode}-${sectorCode}`
        : categoryCode;


    const pattern = `${prefix}-${year}-%`;

    const result = await db.execute(
        sql `SELECT certificate_number FROM training_records
                WHERE certifictae_number LIKE ${pattern}
                ORDER BY id DESC
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