import prisma from "@/db/db";

export interface CalendarMonthlyEvent {
    id: number;
    name: string;
    day: number;
    date: string;
    type: 'birthday' | 'deathday';
    hasDate: boolean;
    age: number | string;
}

export async function fetchCalendarData(month: number, year: number, allAuthIds: number[]) {
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

    // IST calendar date this response's "today" bucketing was computed for —
    // lets clients detect a stale (e.g. previous-day) cached response, since
    // the URL alone (month/year) doesn't change across days within a month.
    const todayISODate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(todayDate).padStart(2, '0')}`;

    return {
        eventDates: { ...categorise },
        datesList: Array.from(categorise.datesList),
        todayISODate,
    };
}

function categorizeCurrentMonth(
    event: CalendarMonthlyEvent,
    categories: {
        pastEvents: CalendarMonthlyEvent[],
        todayEvents: CalendarMonthlyEvent[],
        tomorrowEvents: CalendarMonthlyEvent[],
        thisWeekEvents: CalendarMonthlyEvent[],
        upcomingEvents: CalendarMonthlyEvent[]
    },
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
