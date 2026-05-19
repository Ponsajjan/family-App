// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL_CLIENT;
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// Reloaded at 2026-05-12T20:48:00Z
export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;