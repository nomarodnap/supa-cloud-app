import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './db/schema';

const sql = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
});
