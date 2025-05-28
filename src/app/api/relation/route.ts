import prisma from "@/db/db";

async function fetchFamilyTree(memberIds: number[]): Promise<any[]> {
  // Base case: If no member IDs, return empty array
  if (!memberIds || memberIds.length === 0) {
    return [];
  }

  // Fetch members and their immediate relationships
  const members = await prisma.member.findMany({
    where: { id: { in: memberIds } },
    include: {
      fatherOf: {
        select: { id: true, name: true, gender: true },
      },
      motherOf: {
        select: { id: true, name: true, gender: true },
      },
      partner: {
        select: { id: true, name: true, gender: true },
      },
    },
  });

  // Construct the family tree
  return await Promise.all(
    members.map(async (member: any) => {
      // Combine children from `fatherOf` and `motherOf`
      const childIds = [
        ...member.fatherOf.map((child : any) => child.id),
        ...member.motherOf.map((child : any) => child.id),
      ];

      // Recursive call to fetch next generation
      const nextGen = await fetchFamilyTree(childIds);

      // Current generation (`gen`) includes the member and their partner
      const currentGen = [
        { name: member.name, gender: member.gender },
        ...(member.partner ? [{ name: member.partner.name, gender: member.partner.gender }] : []),
      ];

      return {
        gen: currentGen,
        next_gen: nextGen,
      };
    })
  );
}

async function getFamilyTree() {
  // Fetch top-level members (e.g., without parents)
  const topLevelMembers = await prisma.member.findMany({
    where: {
      AND: [{ fatherId: null }, { motherId: null }],
    },
    select: { id: true },
  });

  // Start recursive fetching from top-level members
  const data = await fetchFamilyTree(topLevelMembers.map((member : any) => member.id));

  return { data };
}

// Call the function and log the result
getFamilyTree()
  .then((familyTree) => console.log(JSON.stringify(familyTree, null, 2)))
  .catch((error) => console.error(error));
