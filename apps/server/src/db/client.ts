import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "../env";
import * as schema from "./schema";

export const pool = new Pool({
  connectionString: env.NODE_ENV === "test" && env.TEST_DATABASE_URL
    ? env.TEST_DATABASE_URL
    : env.DATABASE_URL
});

export const db = drizzle(pool, { schema });

export type DbClient = typeof db;
