import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/app.schema.js";

export const db = drizzle(process.env.DATABASE_URL!, { schema: schema });
