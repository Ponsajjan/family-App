"use server";

import prisma from "@/db/db"


export default async function addUserAction(formData) {
    const deceased = formData.get('deceased') === 'on';

    const user = {
        name: formData.get('name'),
        gender: formData.get('gender'),
        birthDate: parseInt(formData.get('birth_date')),
        birthMonth: parseInt(formData.get('birth_month')),
        birthYear: parseInt(formData.get('birth_year')),
        deceased: deceased,
        deathDate: parseInt(formData.get('death_date')),
        deathMonth: parseInt(formData.get('death_month')),
        deathYear: parseInt(formData.get('death_year')),
        phoneNumber: formData.get('phone_number'),
        occupation: formData.get('occupation'),
        education: formData.get('education'),
        address: formData.get('address'),
    };
    try {
        const newUser = await prisma.user.create({
            data: user,
        });
        return (
            <p>Hello</p>
        );
    } catch (error) {
        console.error("Error adding user:", error);
        return { success: false, error: "Failed to add user" };
    }
}
