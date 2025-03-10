import { NextResponse } from 'next/server';
import prisma from '@/db/db';

export async function GET() {
  try {
    const authEntries = await prisma.auth.findMany({
      include: {
        moderatorList: true,
      },
    });

    // Fetch descendantOf member names in a single query
    const mainMemberIds = authEntries.map((auth) => auth.mainMemberId);
    const mainMembers = await prisma.member.findMany({
      where: {
        id: {
          in: mainMemberIds,
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
    const formattedResponse = authEntries.map((auth) => {
      const descendantOfName = mainMemberMap.get(auth.mainMemberId) || 'Unknown'; // Fallback if member not found

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
    return NextResponse.json(
      { error: 'Failed to fetch auth entries.' },
      { status: 500 }
    );
  }
}