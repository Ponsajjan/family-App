import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";

interface CalendarMonthlyEvent {
    id: number;
    name: string;
    day: number;
    date: string;
    type: 'birthday' | 'deathday';
    hasDate: boolean;
    age: number | string;
}

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const decoded = await verifyToken(token);
        const authId = decoded.authId;

        if (!authId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const selectedAuthId = request.cookies.get("selectedAuthId")?.value || "[]";
        const loginAuthIds = JSON.parse(selectedAuthId);
        let allAuthIds: number[] = [];

        if (loginAuthIds) {
            try {
                const authRecords = await prisma.auth.findMany({
                    where: {
                        OR: [
                            { memberAuthId: { in: loginAuthIds } },
                            { moderatorAuthId: { in: loginAuthIds } }
                        ]
                    },
                    select: {
                        id: true,
                    }
                });
                allAuthIds = authRecords.map(record => record.id);
            } catch (e) {
                console.error("Error parsing authId cookie", e);
                allAuthIds.push(authId);
            }
        } else {
            allAuthIds.push(authId);
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
                authId: { in: allAuthIds },
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
            }
        });

        // Compute IST "today" once
        const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const todayDate = today.getDate();

        // Pre-compute week boundaries once (not per event)
        const isCurrentMonth = currentMonth === month && currentYear === year;
        let weekEndDate = 0;
        if (isCurrentMonth) {
            const currentDayOfWeek = today.getDay();
            const weekStartDate = todayDate - (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1);
            weekEndDate = weekStartDate + 6;
        }

        const categorise = {
            pastEvents: [] as CalendarMonthlyEvent[],
            todayEvents: [] as CalendarMonthlyEvent[],
            tomorrowEvents: [] as CalendarMonthlyEvent[],
            thisWeekEvents: [] as CalendarMonthlyEvent[],
            upcomingEvents: [] as CalendarMonthlyEvent[],
            selectedMonthEvents: [] as CalendarMonthlyEvent[],
            datesList: new Set<number>()
        };

        const calcAge = (eventYear: number | null, refYear: number): number | 'n/a' =>
            eventYear && eventYear < refYear ? refYear - eventYear : 'n/a';

        // Build ISO string from components without toIST or Date construction
        const makeDate = (y: number | null, m: number, d: number) =>
            new Date(y || 1600, m - 1, d).toISOString();

        for (const member of members) {
            if (member.birthMonth === month) {
                const day = member.birthDate || 1;
                categorise.datesList.add(day);

                const event: CalendarMonthlyEvent = {
                    id: member.id,
                    name: member.name,
                    day,
                    date: makeDate(member.birthYear, month, day),
                    type: 'birthday',
                    hasDate: member.birthDate !== null,
                    age: calcAge(member.birthYear, currentYear)
                };

                if (isCurrentMonth) {
                    categorizeCurrentMonth(event, categorise, todayDate, weekEndDate);
                } else {
                    categorise.selectedMonthEvents.push({ ...event, age: calcAge(member.birthYear, year) });
                }
            }

            if (member.deathMonth === month) {
                const day = member.deathDate || 1;
                categorise.datesList.add(day);

                const event: CalendarMonthlyEvent = {
                    id: member.id,
                    name: member.name,
                    day,
                    date: makeDate(member.deathYear, month, day),
                    type: 'deathday',
                    hasDate: member.deathDate !== null,
                    age: calcAge(member.deathYear, currentYear)
                };

                if (isCurrentMonth) {
                    categorizeCurrentMonth(event, categorise, todayDate, weekEndDate);
                } else {
                    categorise.selectedMonthEvents.push({ ...event, age: calcAge(member.deathYear, year) });
                }
            }
        }

        // Sort by day number directly — no Date parsing needed
        const sortAsc = (a: CalendarMonthlyEvent, b: CalendarMonthlyEvent) => a.day - b.day;
        const sortDesc = (a: CalendarMonthlyEvent, b: CalendarMonthlyEvent) => b.day - a.day;
        categorise.pastEvents.sort(sortDesc);
        categorise.todayEvents.sort(sortAsc);
        categorise.tomorrowEvents.sort(sortAsc);
        categorise.thisWeekEvents.sort(sortAsc);
        categorise.upcomingEvents.sort(sortAsc);
        categorise.selectedMonthEvents.sort(sortAsc);

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

function categorizeCurrentMonth(
    event: CalendarMonthlyEvent,
    categories: { pastEvents: CalendarMonthlyEvent[], todayEvents: CalendarMonthlyEvent[], tomorrowEvents: CalendarMonthlyEvent[], thisWeekEvents: CalendarMonthlyEvent[], upcomingEvents: CalendarMonthlyEvent[] },
    todayDate: number,
    weekEndDate: number
) {
    const day = event.day;
    if (day < todayDate) {
        categories.pastEvents.push(event);
    } else if (day === todayDate) {
        categories.todayEvents.push(event);
    } else if (day === todayDate + 1) {
        categories.tomorrowEvents.push(event);
    } else if (day <= weekEndDate) {
        categories.thisWeekEvents.push(event);
    } else {
        categories.upcomingEvents.push(event);
    }
}