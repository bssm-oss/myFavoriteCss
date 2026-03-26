import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import { sql } from "drizzle-orm";

import { db, pool } from "./client";

async function ensureMigrationsTable() {
  await db.execute(sql`
    create table if not exists drizzle_migrations (
      id serial primary key,
      name text not null unique,
      run_at timestamptz not null default now()
    );
  `);
}

async function main() {
  await ensureMigrationsTable();
  const files = (await readdir(join(process.cwd(), "src/db/migrations")))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const existing = await db.execute<{ name: string }>(sql.raw(`select name from drizzle_migrations where name = '${file}'`));
    if (existing.rows.length > 0) {
      continue;
    }

    const statement = await readFile(join(process.cwd(), "src/db/migrations", file), "utf8");
    await db.execute(sql.raw(statement));
    await db.execute(sql.raw(`insert into drizzle_migrations (name) values ('${file}')`));
  }

  await pool.end();
}

void main();
