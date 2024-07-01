import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
const sql = neon('postgresql://neondb_owner:DshrJRU4iLo8@ep-red-mode-a5h8w3sc.us-east-2.aws.neon.tech/spendsmart?sslmode=require');
export const db = drizzle(sql,{schema});
