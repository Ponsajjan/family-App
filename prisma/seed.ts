// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

async function main() {
    // Minimal seed script. Add your seeding logic here.
    console.log('Prisma seed: connected and ready. No seed operations defined.');
}

main()
    .catch((e) => {
        console.error('Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        console.log('hello from Seed');
        // await prisma.$disconnect();
    });
