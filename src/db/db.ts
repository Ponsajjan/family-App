// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv';
import { withAccelerate } from '@prisma/extension-accelerate';
dotenv.config();

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,

  }).$extends(withAccelerate())
}

console.log("datasourceUrldatasourceUrl", process.env.DATABASE_URL)
console.log("NODE_ENV", process.env.NODE_ENV)
console.log("NEXT_PUBLIC_BASE_URL", process.env.NEXT_PUBLIC_BASE_URL)

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma