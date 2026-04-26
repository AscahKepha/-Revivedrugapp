// import "dotenv/config";
// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";

// import * as schema from "./schema";

// const client = neon(process.env.DATABASE_URL!);

// const db = drizzle(client, {
//     schema,
//     logger: true // it prints what you have run in the terminal
// });

// export default db;

import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// 1. Create the connection client
// Use the local connection string from your .env
const queryClient = postgres(process.env.DATABASE_URL!);

// 2. Initialize Drizzle with the local client
const db = drizzle(queryClient, {
    schema,
    logger: true // Keeps logging enabled so you can see the SQL queries
});

export default db;