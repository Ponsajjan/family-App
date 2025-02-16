import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Remove the authentication cookie
  response.headers.set("Set-Cookie", "token=; HttpOnly; Path=/; Max-Age=0");

  return response;
}