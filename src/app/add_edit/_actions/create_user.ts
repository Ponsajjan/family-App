"use server"

import prisma from "@/db/db"
import { z } from "zod"

// const addSchema = z.object({
//     name: z.string().min(1, "Name is required"),
//     birthday: z.coerce.date().optional(),
//     contact_number: z.coerce.number().int().positive("Contact number must be a positive integer").optional(),
//     current_location: z.string().optional(),
// })

const addSchema = z.object({
  id: z.number(),
  refrence_id: z.string().optional(),
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
    // const results = addSchema.safeParse(Object.fromEntries(formData.entries()))
    // console.log(results)
    // if (results.success === false) {
    //     return results.error.formErrors.fieldErrors
    // }

    // const data = results.data
    // await prisma.user.create({ data: {
    //     name: data.name,
    //     birthday: data.birthday,
    //     contactNumber: data.contact_number,
    //     currentLocation: data.current_location
    // }})

  await prisma.user.create({
    data: {
      id: 1000,
      refrence_id: "hello123",
      name: "hello 5", // New user's name
      birthday: '2024-08-25T00:00:00.000Z', // Optional
      contactNumber: 12345678, // Optional
      currentLocation: 'hello 12 hello', // Optional
      partner: {
        connect: { id: 5 }, // Reference the existing user's id
      },
    },
  });

  await prisma.user.update({
    where: { id: 5 },
    data: {
      parent: {
        connect: { id: 1000 }, // Connect to the partner as the second parent
      },
    },
  });
}

async function addPartner(prevState: unknown, formData: FormData, existingUserId: number) {
    // Step 1: Retrieve the existing user by ID
    const existingUser = await prisma.user.findUnique({
      where: { id: existingUserId },
    });
  
    if (!existingUser) {
      throw new Error("User not found");
    }

    const results = addSchema.safeParse(Object.fromEntries(formData.entries()))
    console.log(results)
    if (results.success === false) {
        return results.error.formErrors.fieldErrors
    }
  
    const data = results.data
    // Step 2: Create a new user and link them as a partner
    const newUser = await prisma.user.create({
      data: {
        name: data.name, // New user's name
        birthday: data.birthday, // Optional
        contactNumber: data.contact_number, // Optional
        currentLocation: data.current_location, // Optional
        partner: {
          connect: { id: existingUser.id }, // Reference the existing user's id
        },
      },
    });
  
    console.log("New User Created with PartnerId:", newUser.partnerId); // This will be existingUserId
  
    return newUser;
}

async function addChildren(prevState: unknown, formData: FormData, existingUserId: number) {
    // Step 1: Retrieve the existing user by ID
    const existingUser = await prisma.user.findUnique({
      where: { id: existingUserId },
    });
  
    if (!existingUser) {
      throw new Error("User not found");
    }

    const results = addSchema.safeParse(Object.fromEntries(formData.entries()))
    console.log(results)
    if (results.success === false) {
        return results.error.formErrors.fieldErrors
    }
  
    const data = results.data
    // Step 2: Create a new user and link them as a partner
    const newUser = await prisma.user.create({
      data: {
        name: data.name, // New user's name
        birthday: data.birthday, // Optional
        contactNumber: data.contact_number, // Optional
        currentLocation: data.current_location, // Optional
        children: {
          connect: { id: existingUser.id }, // Reference the existing user's id
        },
      },
    });
  
    console.log("New User Created with ChildrenId:", newUser.partnerId); // This will be existingUserId
  
    return newUser;
}