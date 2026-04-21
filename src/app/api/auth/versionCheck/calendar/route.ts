import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { getAllAuthIds } from "@/utils/switchAccountHelpers";
import { fetchCalendarData } from "@/utils/calendarUtils";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get("month") || "");
    const year = parseInt(searchParams.get("year") || "");
    const clientVersion = searchParams.get("version");

    if (!month || !year) {
        return NextResponse.json({ error: "Month and year are required" }, { status: 400 });
    }

    try {
        const decoded = await verifyToken(token);
        const authId = decoded.authId;
        const userType = decoded.userType;
        const selectedAuthId = request.cookies.get("selectedAuthId")?.value || "[]";

        const { allAuthIds, updatedAt } = await getAllAuthIds(authId, userType, selectedAuthId);
        
        // Version check logic
        const serverVersionString = JSON.stringify(updatedAt);
        if (clientVersion === serverVersionString) {
            return NextResponse.json({ mismatch: false });
        }

        // Mismatch found, fetch full data
        const { eventDates, datesList } = await fetchCalendarData(month, year, allAuthIds);

        return NextResponse.json({
            mismatch: true,
            data: {
                eventDates,
                datesList,
                _version: updatedAt
            }
        });

    } catch (error) {
        console.error('Calendar Version Check Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

