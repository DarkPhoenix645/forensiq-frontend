import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { DATABASE_URL } from '$env/static/private';
import * as schema from './schema';

const client = createClient({ url: DATABASE_URL });

export const db = drizzle(client, { schema });
export type DB = typeof db;
