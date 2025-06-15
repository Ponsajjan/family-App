'use server'
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}


// export async function hashPassword(password: string): Promise<string> {
//   return await bcrypt.hash(password, 10);
// }

// export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
//   return await bcrypt.compare(password, hashedPassword);
// }

export const generateToken = async (payload: object): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, { expiresIn: "180d" }, (error, token) => {
      if (error) reject(error);
      else resolve(token as string);
    });
  });
};

export const verifyToken = async (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) reject(error);
      else resolve(decoded);
    });
  });
};

export async function updateToken(token: string) {
  const response = NextResponse.next();

  try {
    const decoded: any = jwt.decode(token);

    if (!decoded || !decoded.exp) throw new Error("Invalid token payload");

    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = decoded.exp;
    const bufferTime = 90 * 24 * 60 * 60;
    if (expirationTime < currentTime) {
      // Token expired, clear cookie
      response.cookies.set("token", "", { maxAge: 0 });
    } else if (expirationTime - currentTime < bufferTime) {
      // Token is about to expire, renew it
      const { iat, exp, ...safePayload } = decoded;
      const newToken = await generateToken(safePayload);

      response.cookies.set("token", newToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 180 * 24 * 60 * 60,
      });
    }

  } catch (error) {
    console.error("Error updating token:", error);
    return null;
  }

  return null;
}
