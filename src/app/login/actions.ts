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
    mainMemberId: number | null;
    password: string;
    moderatorName?: string;
    moderatorContact?: string;
    moderatorPassword: string;
    memberAuthId?: string | null;
    moderatorAuthId?: string | null;
    mainMemberName?: string | null;
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
                mainMemberId: null,
                password: process.env.SUPER_ADMIN_PASSWORD,
                moderatorName: "Admin",
                moderatorContact: "N/A",
                moderatorPassword: "N/A",
                memberAuthId: "ADMIN007",
                moderatorAuthId: "ADMIN007_MOD",
                mainMemberName: "Admin"
            };
        }

        if (!login) {
            const newAttempts = Math.min(attempts + 1, ATTEMPT_LIMIT);
            cookieStore.set('_att_tk', `${newAttempts.toString().padStart(3, '0')}-${now}`, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: DEBOUNCE_MS / 1000
            });
            return {
                success: false,
                error: 'Invalid credential'
            };
        }

        if (login.id !== -108 && login.mainMemberId) {
            const member = await prisma.member.findUnique({
                where: { id: login.mainMemberId },
                select: { name: true }
            });
            login.mainMemberName = member?.name || null;
        }

        const userType = login.moderatorName === "Admin" ? "Admin" : "Member";

        const token = await generateToken({
            authId: login.id,
            selectedAuthId: login.memberAuthId,
            memberId: login.mainMemberId,
            userType: userType
        });

        let authIdToReturn = login.memberAuthId || 'Unknown';

        const existingAuthIdsCookie = cookieStore.get('authId')?.value;
        if (existingAuthIdsCookie) {
            try {
                const accounts: string[] = JSON.parse(existingAuthIdsCookie);
                if (Array.isArray(accounts)) {
                    // Check if memberAuthId or moderatorAuthId already exists in the logged accounts list
                    const foundId = accounts.find(id =>
                        id === login.memberAuthId || id === login.moderatorAuthId
                    );
                    if (foundId) {
                        authIdToReturn = foundId;
                    }
                }
            } catch (e) {
                console.error("Error parsing authId cookie:", e);
            }
        }

        return {
            success: true,
            message: "Login successful",
            token,
            userType,
            authId: authIdToReturn,
            mainMemberName: login.mainMemberName || 'Unknown'
        };
    } catch (error) {
        console.error("Error logging in:", error);
        return {
            success: false,
            error: "Internal server error"
        };
    }
}