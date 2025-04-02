'use server'
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

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
    jwt.sign(payload, JWT_SECRET, { expiresIn: "2d" }, (err, token) => {
      if (err) reject(err);
      else resolve(token as string);
    });
  });
};

export const verifyToken = async (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};

export async function updateToken(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = await verifyToken(token);
    if (!decoded) {
      return null;
    }

    // Check if the token is close to expiring (e.g., within 5 minutes)
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const bufferTime = 12 * 60 * 60 * 1000; // 12 hours buffer time

    if (expirationTime - currentTime < bufferTime) {
      // Call the /api/login endpoint to refresh the token
      await fetch(new URL("/api/login", request.url).toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: decoded.password }), // Pass the password from the decoded token
      });
    } else {
      console.error("Failed to refresh token:");
    }

    return token; // Return the existing token if it's not close to expiring
  } catch (error) {
    console.error("Error updating token:", error);
    return null;
  }
}