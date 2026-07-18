import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:Tongkung01@127.0.0.1:5434/gcp",
});

export const auth = betterAuth({
    database: pool,
    emailAndPassword: {
        enabled: true,
    },
});
