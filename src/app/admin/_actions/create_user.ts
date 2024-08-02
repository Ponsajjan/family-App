"use server"

import prisma from "@/db/db"
import { redirect} from "next/navigation"
import { z } from "zod"

// const addSchema = z.object({
//     name: z.string().min(1, "Name is required"),
//     birthday: z.coerce.date().optional(),
//     contact_number: z.coerce.number().int().positive("Contact number must be a positive integer").optional(),
//     current_location: z.string().optional(),
// })

const addSchema = z.object({
    name: z.string().min(1, "Name is required"),
    birthday: z.union([z.string().optional(), z.date().optional()]).transform(val => val ? new Date(val) : undefined).optional(),
    contact_number: z.union([z.string().optional(), z.number().optional()]).transform(val => {
        const num = Number(val);
        return (isNaN(num) || !Number.isInteger(num) || num <= 0) ? undefined : num;
      }).optional(),
    current_location: z.string().optional(),
});

export async function addUsers(prevState: unknown, formData: FormData) {
    // console.log(formData)
    const results = addSchema.safeParse(Object.fromEntries(formData.entries()))
    console.log(results)
    if (results.success === false) {
        return results.error.formErrors.fieldErrors
    }

    const data = results.data
    await prisma.user.create({ data: {
        name: data.name,
        birthday: data.birthday,
        contactNumber: data.contact_number,
        currentLocation: data.current_location
    }})

    redirect("/admin/products")
}