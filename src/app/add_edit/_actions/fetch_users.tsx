// /pages/api/users.js
import prisma from "@/db/db";

export default async function handler(req:any, res:any) {
  if (req.method === "GET") {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        contactNumber: true,
        currentLocation: true,
      },
      orderBy: { name: "asc" },
    });
    res.status(200).json(users);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
