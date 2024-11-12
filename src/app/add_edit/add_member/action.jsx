"use server";

import prisma from "@/db/db"

// const getDateFromParts = (year, month, day) => {
//     if (year && month && day) {
//         return new Date(year, month - 1, day).toISOString(); // JavaScript months are zero-indexed
//     }
//     return null;
// };

export default async function addUserAction(formData) {
    const deceased = formData.get('deceased') === 'on';

    const user = {
        name: formData.get('name'),
        gender: formData.get('gender'),
        birthDate: formData.get('birth_date'),
        birthMonth: formData.get('birth_month'),
        birthYear: formData.get('birth_year'),
        deathday: deceased,
        deathDate: deceased ? formData.get('death_date') : null,
        deathMonth: deceased ? formData.get('death_month') : null,
        deathYear: deceased ? formData.get('death_year') : null,
        phoneNumber: formData.get('phone_number'),
        occupation: formData.get('occupation'),
        education: formData.get('education'),
        address: formData.get('address'),
    };

    try {
        const newUser = await prisma.user.create({
            data: user,
        });
        return { success: true, user: newUser };
    } catch (error) {
        console.error("Error adding user:", error);
        return { success: false, error: "Failed to add user" };
    }
}
