// lib/userService.js (or another utility file)

import prisma from "@/lib/prisma";

export async function getMembers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      gender: true,
      birthday: true,
      deceased: true,
      deathday: true,
      phoneNumber: true,
      occupation: true,
      education: true,
      address: true,
    },
  });
}
