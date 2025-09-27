import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

interface CalendarMonthlyEvent {
    id: string;
    name: string;
    date: Date;
    type: 'birthday' | 'deathday';
    hasDate: boolean;
    age: number | string;
}

// Helper function to convert any date to IST
const toIST = (date: Date | string) => {
    const d = new Date(date);
    return new Date(d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

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
                verified: true,
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
            cacheStrategy: {
                ttl: 60 * 30,
                swr: 10
            }, // Cache for 30 minutes
        });

        // Process events with IST
        const today = toIST(new Date());
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const todayDate = today.getDate();

        const categorise = {
            pastEvents: [] as CalendarMonthlyEvent[],
            todayEvents: [] as CalendarMonthlyEvent[],
            tomorrowEvents: [] as CalendarMonthlyEvent[],
            thisWeekEvents: [] as CalendarMonthlyEvent[],
            upcomingEvents: [] as CalendarMonthlyEvent[],
            selectedMonthEvents: [] as CalendarMonthlyEvent[],
            datesList: new Set<number>()
        };

        members.forEach(member => {
            if (member.birthMonth === month) {
                const date = member.birthDate || 1;
                const eventDate = toIST(new Date(member.birthYear || 1600, member.birthMonth - 1, date));

                categorise.datesList.add(date);

                // Calculate age based on the year parameter for selectedMonthEvents
                const ageForSelectedMonth = member.birthYear ? member.birthYear >= year ? 'n/a' : year - member.birthYear : 'n/a';
                const ageForCurrentEvents = member.birthYear ? member.birthYear == currentYear ? 'n/a' : currentYear - member.birthYear : 'n/a';

                const event = {
                    id: member.id,
                    name: member.name,
                    date: eventDate.toISOString(),
                    type: 'birthday',
                    hasDate: member.birthDate !== null,
                    age: ageForCurrentEvents // Default age for current month events
                };

                categorizeEvent(
                    event,
                    categorise,
                    month,
                    year,
                    todayDate,
                    currentMonth,
                    currentYear,
                    ageForSelectedMonth
                );
            }

            // Process deathday with IST
            if (member.deathMonth === month) {
                const date = member.deathDate || 1;
                const eventDate = toIST(new Date(member.deathYear || 1600, member.deathMonth - 1, date));

                categorise.datesList.add(date);

                // Calculate age based on the year parameter for selectedMonthEvents
                const ageForSelectedMonth = member.deathYear ? member.deathYear >= year ? 'n/a' : year - member.deathYear : 'n/a';
                const ageForCurrentEvents = member.deathYear ? member.deathYear == currentYear ? 'n/a' : currentYear - member.deathYear : 'n/a';

                const event = {
                    id: member.id,
                    name: member.name,
                    date: eventDate.toISOString(),
                    type: 'deathday',
                    hasDate: member.deathDate !== null,
                    age: ageForCurrentEvents // Default age for current month events
                };

                categorizeEvent(
                    event,
                    categorise,
                    month,
                    year,
                    todayDate,
                    currentMonth,
                    currentYear,
                    ageForSelectedMonth
                );
            }
        });

        categorise.pastEvents.sort((a: CalendarMonthlyEvent, b: CalendarMonthlyEvent) => new Date(b.date).getDate() - new Date(a.date).getDate());
        categorise.todayEvents.sort((a: CalendarMonthlyEvent, b: CalendarMonthlyEvent) => new Date(a.date).getDate() - new Date(b.date).getDate());
        categorise.tomorrowEvents.sort((a: CalendarMonthlyEvent, b: CalendarMonthlyEvent) => new Date(a.date).getDate() - new Date(b.date).getDate());
        categorise.thisWeekEvents.sort((a: CalendarMonthlyEvent, b: CalendarMonthlyEvent) => new Date(a.date).getDate() - new Date(b.date).getDate());
        categorise.upcomingEvents.sort((a: CalendarMonthlyEvent, b: CalendarMonthlyEvent) => new Date(a.date).getDate() - new Date(b.date).getDate());
        categorise.selectedMonthEvents.sort((a: CalendarMonthlyEvent, b: CalendarMonthlyEvent) => new Date(a.date).getDate() - new Date(b.date).getDate());

        return NextResponse.json({
            eventDates: { ...categorise },
            datesList: Array.from(categorise.datesList)
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

// Updated helper function with ageForSelectedMonth parameter
function categorizeEvent(
    event: any,
    categories: any,
    month: number,
    year: number,
    todayDate: number,
    currentMonth: number,
    currentYear: number,
    ageForSelectedMonth: number | 'n/a'
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
        // For selected month events, use the age calculated based on the year parameter
        categories.selectedMonthEvents.push({
            ...event,
            age: ageForSelectedMonth
        });
    }
}