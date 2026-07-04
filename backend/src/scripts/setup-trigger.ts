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
  console.log('Setting up Database Trigger for User Synchronization...');

  try {
    // 1. Create the function
    await db.execute(sql`
      create or replace function public.handle_new_user()
      returns trigger
      language plpgsql
      security definer set search_path = ''
      as $$
      begin
        insert into public.users (id, email, name, created_at, updated_at)
        values (
          new.id,
          new.email,
          coalesce(new.raw_user_meta_data->>'full_name', ''),
          new.created_at,
          new.updated_at
        )
        on conflict (id) do nothing;
        return new;
      end;
      $$;
    `);
    console.log('✅ Function handle_new_user created');

    // 2. Create the trigger
    await db.execute(sql`
      drop trigger if exists on_auth_user_created on auth.users;
      create trigger on_auth_user_created
        after insert on auth.users
        for each row execute procedure public.handle_new_user();
    `);
    console.log('✅ Trigger on_auth_user_created created');

    console.log('🎉 Setup complete! Supabase Auth is now synced with public.users.');
  } catch (error) {
    console.error('❌ Error setting up trigger:', error);
  } finally {
    await client.end();
  }
}

main();
