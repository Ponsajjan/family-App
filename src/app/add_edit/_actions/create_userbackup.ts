async function addChildren(prevState: unknown, formData: FormData, existingUserId: number) {
    // Step 1: Retrieve the existing user by ID
    const existingUser = await prisma.user.findUnique({
        where: { id: existingUserId },
        include: {
            partnerDetails: true, // Retrieve partner details if they exist
        },
    });
  
    if (!existingUser) {
        throw new Error("User not found");
    }

    const results = addSchema.safeParse(Object.fromEntries(formData.entries()));
    console.log(results);
    if (results.success === false) {
        return results.error.formErrors.fieldErrors;
    }

    const data = results.data;

    // Step 2: Create a new user and link them as a child to the existing user and their partner
    const newUser = await prisma.user.create({
        data: {
            name: data.name, // New user's name
            birthday: data.birthday, // Optional
            contactNumber: data.contact_number, // Optional
            currentLocation: data.current_location, // Optional
            parent: {
                connect: { id: existingUser.id }, // Connect to existing user as the parent
            },
        },
    });

    // Step 3: Link the new user as a child to the partner if a partner exists
    if (existingUser.partnerDetails.length > 0) {
        await prisma.user.update({
            where: { id: newUser.id },
            data: {
                parent: {
                    connect: { id: existingUser.partnerDetails[0].id }, // Connect to the partner as the second parent
                },
            },
        });
    }

    console.log("New User Created with ParentId:", newUser.parentId); // ParentId would be the existingUserId

    return newUser;
}
