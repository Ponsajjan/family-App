import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

// Helper function to convert any date to IST
const toIST = (date: Date | string) => {
    const d = new Date(date);
    return new Date(d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

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

        // Extract month and year from URL
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/');
        const month = parseInt(pathParts[pathParts.length - 2]);
        const year = parseInt(pathParts[pathParts.length - 1]);

        if (!month || !year) {
            return NextResponse.json({ error: "Month and year are required" }, { status: 400 });
        }

        // Fetch data from Prisma
        const members = await prisma.member.findMany({
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

        // Process events with IST
        const today = toIST(new Date());
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const todayDate = today.getDate();

        const categorizedEvents = {
            pastEvents: [] as any[],
            todayEvents: [] as any[],
            tomorrowEvents: [] as any[],
            thisWeekEvents: [] as any[],
            upcomingEvents: [] as any[],
            selectedMonthEvents: [] as any[],
            datesList: new Set<number>()
        };

        members.forEach(member => {
            // Process birthday with IST
            if (member.birthMonth === month) {
                const date = member.birthDate || 1;
                const eventDate = toIST(new Date(member.birthYear || 1600, member.birthMonth - 1, date));
                
                categorizedEvents.datesList.add(date);
                categorizeEvent({
                    id: member.id,
                    name: member.name,
                    date: eventDate.toISOString(),
                    type: 'birthday',
                    hasDate: member.birthDate !== null,
                    age: member.birthYear ? today.getFullYear() - member.birthYear : 'n/a'
                }, categorizedEvents, month, year, todayDate, currentMonth, currentYear);
            }

            // Process deathday with IST
            if (member.deathMonth === month) {
                const date = member.deathDate || 1;
                const eventDate = toIST(new Date(member.deathYear || 1600, member.deathMonth - 1, date));
                
                categorizedEvents.datesList.add(date);
                categorizeEvent({
                    id: member.id,
                    name: member.name,
                    date: eventDate.toISOString(),
                    type: 'deathday',
                    hasDate: member.deathDate !== null,
                    age: member.deathYear ? today.getFullYear() - member.deathYear : 'n/a'
                }, categorizedEvents, month, year, todayDate, currentMonth, currentYear);
            }
        });

        // Convert Set to sorted array
        const datesList = Array.from(categorizedEvents.datesList).sort((a, b) => a - b);

        return NextResponse.json({
            eventDates: {...categorizedEvents},
            datesList
        });

    } catch (error) {
        console.error('API error:', error);
        if (error instanceof Error) {
            if (error.name === 'JsonWebTokenError') {
                return NextResponse.json({ error: "Invalid token" }, { status: 401 });
            }
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

// Helper function to categorize events with IST
function categorizeEvent(
    event: any,
    categories: any,
    month: number,
    year: number,
    todayDate: number,
    currentMonth: number,
    currentYear: number
) {
    const eventDate = toIST(new Date(event.date));
    const eventDay = eventDate.getDate();

    if (currentMonth === month && currentYear === year) {
        const currentDayOfWeek = toIST(new Date()).getDay();
        const weekStartDate = todayDate - (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1);
        const weekEndDate = weekStartDate + 6;

        if (eventDay < todayDate) {
            categories.pastEvents.push(event);
        } else if (eventDay === todayDate) {
            categories.todayEvents.push(event);
        } else if (eventDay === todayDate + 1) {
            categories.tomorrowEvents.push(event);
        } else if (eventDay > todayDate && eventDay <= weekEndDate) {
            categories.thisWeekEvents.push(event);
        } else {
            categories.upcomingEvents.push(event);
        }
    } else {
        categories.selectedMonthEvents.push(event);
    }
}