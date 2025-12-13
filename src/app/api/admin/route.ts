import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db/db';
import { verifyToken } from '@/utils/auth';

interface FormattedAuthEntry {
  id: number;
  mainMemberId: number | null;
  mainMemberName: string;
  memberPassword: string;
  moderatorPassword: string;
  moderators: {
    id: number;
    name: string;
    contactNumber: string;
  }[];
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // Verify the token
    const decoded = await verifyToken(token);
    const userType = decoded.userType;

    // Check if the token is valid for Admin
    if (userType !== "Admin") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search')?.trim() || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause for search
    const whereClause = searchTerm ? {
      mainMemberNameRef: {
        contains: searchTerm,
        mode: 'insensitive' as const,
      }
    } : {};

    // Fetch total count for pagination
    const totalCount = await prisma.auth.count({
      where: whereClause,
    });

    // Fetch paginated auth entries with their moderator lists
    const authEntries: any[] = await prisma.auth.findMany({
      where: whereClause,
      include: {
        moderatorList: true,
      },
      skip,
      take: limit,
      orderBy: {
        id: 'asc', // You can change this to any field you want to sort by
      },
    });

    const mainMemberIds = authEntries
      .map((auth) => auth.mainMemberId)
      .filter((id): id is number => id !== null);

    // Fetch all main member names in a single query
    const mainMembers = await prisma.member.findMany({
      where: {
        id: {
          in: mainMemberIds.length > 0 ? mainMemberIds : undefined,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const mainMemberMap = new Map(
      mainMembers.map((member) => [member.id, member])
    );
    const formattedResponse: FormattedAuthEntry[] = authEntries.map((auth) => {

      const mainMember = auth.mainMemberId ? mainMemberMap.get(auth.mainMemberId) : null;

      return {
        id: auth.id,
        mainMemberId: auth.mainMemberId,
        mainMemberName: mainMember?.name || 'Unknown',
        memberPassword: auth.password,
        moderatorPassword: auth.moderatorPassword,
        moderators: auth.moderatorList.map((moderator: { id: number, moderatorName: string, moderatorContact: string }) => ({
          id: moderator.id,
          name: moderator.moderatorName,
          contactNumber: moderator.moderatorContact,
        })),
      };
    });

    // Return response with pagination metadata
    return NextResponse.json({
      data: formattedResponse,
      totalCount: totalCount,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching auth entries:', error);
    // Handle token verification errors
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch auth entries.' },
      { status: 500 }
    );
  }
}