// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv';
import { withAccelerate } from '@prisma/extension-accelerate';
import databaseConfig from '../config/database.js';
dotenv.config();

const prismaClientSingleton = () => {
  console.log('lebron james', databaseConfig.url)
  return new PrismaClient({
    datasourceUrl: databaseConfig.url,

  }).$extends(withAccelerate())
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma