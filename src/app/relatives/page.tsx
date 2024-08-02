import prisma from "@/db/db"

export default async function Relatives() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            contactNumber: true
        },
        orderBy: { name: "asc" }
    })

    if (users.length === 0) {
        return (
            <div>No users found</div>
        )
    }
    return (
        <div>
            {users.map(user => (
                <div className="p-1" key={user.id}>
                    <div>{user.name}</div>
                    <div>{user.contactNumber}</div>
                </div>
            ))}
        </div>
    )
}