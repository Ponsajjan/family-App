import { NextResponse } from 'next/server';
import prisma from '@/db/db';
import { verifyToken } from '@/utils/auth';

interface AuthEntry {
  id: number;
  mainMemberId: number | null;
  password: string;
  moderatorPassword: string;
  moderatorList: {
    id: number;
    moderatorName: string;
    moderatorContact: string;
  }[];
}

interface Member {
  id: number;
  name: string;
}

interface FormattedAuthEntry {
  id: number;
  mainMemberId: number | null;
  descendantOf: string;
  memberPassword: string;
  moderatorPassword: string;
  moderators: {
    id: number;
    name: string;
    contactNumber: string;
  }[];
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
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
    
    // Fetch all auth entries with their moderator lists
    const authEntries: AuthEntry[] = await prisma.auth.findMany({
      include: {
        moderatorList: true,
      },
    });

    // Extract mainMemberIds, filtering out null values
    const mainMemberIds = authEntries
      .map((auth) => auth.mainMemberId)
      .filter((id): id is number => id !== null); // Ensure only non-null IDs are included

    // Fetch main member names in a single query
    const mainMembers: Member[] = await prisma.member.findMany({
      where: {
        id: {
          in: mainMemberIds.length > 0 ? mainMemberIds : undefined, // Avoid querying if no IDs are present
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Create a map of mainMemberId to member name for quick lookup
    const mainMemberMap = new Map(
      mainMembers.map((member) => [member.id, member.name])
    );

    // Format the response
    const formattedResponse: FormattedAuthEntry[] = authEntries.map((auth) => {
      const descendantOfName =
        auth.mainMemberId !== null
          ? mainMemberMap.get(auth.mainMemberId) || 'Unknown' // Fallback if member not found
          : 'Unknown'; // Handle null mainMemberId

      return {
        id: auth.id,
        mainMemberId: auth.mainMemberId,
        descendantOf: descendantOfName,
        memberPassword: auth.password,
        moderatorPassword: auth.moderatorPassword,
        moderators: auth.moderatorList.map((moderator) => ({
          id: moderator.id,
          name: moderator.moderatorName,
          contactNumber: moderator.moderatorContact,
        })),
      };
    });

    return NextResponse.json(formattedResponse, { status: 200 });
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