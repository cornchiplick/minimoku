import {PrismaClient} from "@prisma/client";

declare global {
  var prismaClient: PrismaClient | undefined;
}

const db = global.prismaClient ?? new PrismaClient({log: ["query", "warn", "error"]});

if (process.env.NODE_ENV === "development") {
  global.prismaClient = db;
}

export default db;
