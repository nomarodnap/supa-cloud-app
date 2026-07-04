import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set in .env');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function main() {
  console.log('Running Backfill for existing users...');

  try {
    const result = await db.execute(sql`
      insert into public.users (id, email, name, created_at, updated_at)
      select 
        id, 
        email, 
        coalesce(raw_user_meta_data->>'full_name', ''), 
        created_at, 
        updated_at
      from auth.users
      on conflict (id) do nothing;
    `);
    
    console.log(`✅ Backfill complete! Check your public.users table.`);
  } catch (error) {
    console.error('❌ Error running backfill:', error);
  } finally {
    await client.end();
  }
}

main();
