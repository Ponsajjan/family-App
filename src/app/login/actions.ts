'use server';

import { cookies } from 'next/headers';
import prisma from "@/db/db";
import { generateToken } from '@/utils/auth';
import dotenv from 'dotenv';
dotenv.config();

const DEBOUNCE_MS = 30 * 1000;
const ATTEMPT_LIMIT = 8; // Maximum attempts before lockout

interface LoginResponse {
  id: number;
  forDescendanceOf: string;
  mainMemberId: number | null;
  password: string;
  moderatorName?: string;
  moderatorContact?: string;
  moderatorPassword: string;
}

export async function login(formData: FormData) {
    try {
        const now = Date.now();
        const cookieStore = await cookies();
        const raw = cookieStore.get('_att_tk')?.value || '000-0';
        const [attemptStr, timestampStr] = raw.split('-');
        const attempts = parseInt(attemptStr);
        const lastAttempt = parseInt(timestampStr);

        if (attempts >= ATTEMPT_LIMIT && now - lastAttempt < DEBOUNCE_MS) {
            return {
                success: false,
                error: 'Invalid credential',
            };
        }

        const password = formData.get('password')?.toString();

        if (!password) {
            return {
                success: false,
                error: "Password is required"
            };
        }

        let login: LoginResponse | null = await prisma.auth.findUnique({
            where: { password },
        });

        // If no match is found in DB, check the environment variable
        if (!login && process.env.SUPER_ADMIN_PASSWORD && password === process.env.SUPER_ADMIN_PASSWORD) {
            login = {
                id: -108,
                forDescendanceOf: "super_admin_007",
                mainMemberId: null,
                password: process.env.SUPER_ADMIN_PASSWORD,
                moderatorName: "Admin",
                moderatorContact: "N/A",
                moderatorPassword: "N/A",
            };
        }

        if (!login) {
            const newAttempts = Math.min(attempts + 1, ATTEMPT_LIMIT);
            cookieStore.set('_att_tk', `${newAttempts.toString().padStart(3, '0')}-${now}`, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: DEBOUNCE_MS / 1000
            });
            return {
                success: false,
                error: 'Invalid credential'
            };
        }

        const token = await generateToken({
            forDescendanceOf: login.forDescendanceOf,
            memberId: login.mainMemberId,
            userType: login.moderatorName === "Admin" ? "Admin" : "Member"
        });
        const userType = login.moderatorName === "Admin" ? "Admin" : "Member";

        return {
            success: true,
            message: "Login successful",
            token,
            userType,
            forDescendanceOf: login.forDescendanceOf
        };
    } catch (error) {
        console.error("Error logging in:", error);
        return {
            success: false,
            error: "Internal server error"
        };
    }
}