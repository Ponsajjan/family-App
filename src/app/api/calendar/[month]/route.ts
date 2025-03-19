import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const decoded = await verifyToken(token);
        const forDescendanceOf = decoded.forDescendanceOf;

        if (!forDescendanceOf) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        // Extract the month from the URL
        const url = new URL(request.url);
        const month = parseInt(url.pathname.split('/').pop() || '');

        if (!month) {
            return NextResponse.json({ error: "Month is required and should be a valid number." }, { status: 400 });
        }

        // Step 1: Fetch data from Prisma
        const data = await prisma.member.findMany({
            where: {
              descendantOf: forDescendanceOf,
              OR: [
                  { birthMonth: month },
                  { deathMonth: month }
              ]
            },
            select: {
                id: true,
                name: true,
                birthDate: true,
                birthMonth: true,
                birthYear: true,
                deathDate: true,
                deathMonth: true,
                deathYear: true,
            },
        });

        // Helper function to create ISO date string
        const getDateFromParts = (year: number | null, month: number, day: number | null) => {
            if (month && day) {
                return new Date(year ?? 1900, month - 1, day).toISOString();
            }
            if (month && year) {
                return new Date(year, month - 1, day ?? 1).toISOString();
            }
            return null;
        };

        // Step 2: Filter for events in the specified month
        const eventDates = data.flatMap((member) => {
            const events: any[] = [];

            // Check if the birthday is in the specified month
            if (member.birthMonth === month) {
                events.push({
                    id: member.id,
                    name: member.name,
                    birthday: getDateFromParts(member.birthYear, member.birthMonth, member.birthDate),
                    hasDate: true
                });
            }

            // Check if the deathday is in the specified month
            if (member.deathMonth === month) {
                events.push({
                    id: member.id,
                    name: member.name,
                    deathday: getDateFromParts(member.deathYear, member.deathMonth, member.deathDate),
                    hasDate: member.deathDate !== null
                });
            }

            return events;
        });

        return NextResponse.json({ eventDates });
    } catch (error) {
        // Handle token verification errors
        if (error instanceof Error && error.name === 'JsonWebTokenError') {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        // Handle other errors
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}