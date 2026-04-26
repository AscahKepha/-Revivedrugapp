import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Check if DATABASE_URL exists to avoid runtime crashes
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing from .env file");
}

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/drizzle/schema.ts",
    out: "./src/drizzle/migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    verbose: true,
    strict: true, // This is the Drizzle config option, not the 'assert' import
});