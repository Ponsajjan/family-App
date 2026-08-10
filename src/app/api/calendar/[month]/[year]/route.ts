import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { getAllAuthIds } from "@/utils/switchAccountHelpers";
import { fetchCalendarData } from "@/utils/calendarUtils";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const decoded = await verifyToken(token);
        const authId = decoded.authId;
        const userType = decoded.userType;

        if (!authId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const selectedAuthId = request.cookies.get("selectedAuthId")?.value || "";
        const { allAuthIds, updatedAt } = await getAllAuthIds(authId, userType, selectedAuthId);

        // Extract month and year from URL
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/');
        const month = parseInt(pathParts[pathParts.length - 2]);
        const year = parseInt(pathParts[pathParts.length - 1]);

        if (!month || !year) {
            return NextResponse.json({ error: "Month and year are required" }, { status: 400 });
        }

        const { eventDates, datesList, todayISODate } = await fetchCalendarData(month, year, allAuthIds);

        return NextResponse.json({
            eventDates,
            datesList,
            todayISODate,
            _version: updatedAt
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
