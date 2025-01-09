import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/migrator";
import { env } from "~/env";
import postgres from "postgres";

const sql = postgres(env.DATABASE_URL, { ssl: true });

const db = drizzle(sql);

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: "src/server/db/migrations",
    });

    console.log("Migration successful");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
