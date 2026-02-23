import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  migrations: {
    path: path.join(__dirname, "prisma", "migrations"),
  },
  datasource: {
    url: process.env["POSTGRES_PRISMA_URL"],
    directUrl: process.env["POSTGRES_URL_NON_POOLING"],
  },
});
