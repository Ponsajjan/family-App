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
    jwt.sign(payload, JWT_SECRET, { expiresIn: "2d" }, (error, token) => {
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


export async function updateToken(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    // Decode token without verifying to read exp
    const decoded: any = jwt.decode(token);

    if (!decoded || !decoded.exp) {
      throw new Error("Invalid token payload");
    }

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const expirationTime = decoded.exp;
    const bufferTime = 6 * 30 * 24 * 60 * 60; // ~6 months in seconds

    // if (expirationTime - currentTime < bufferTime) {
    //   const newToken = generateToken({ ...decoded });

    //   const token_response = response.cookies.set("token", newToken, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "lax",
    //     path: "/",
    //   });

    //   return token_response;
    // }
  } catch (error) {
    console.error("Error updating token:", error);
    return null;
  }

  return null;
}