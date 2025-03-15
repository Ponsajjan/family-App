'use server'

import { verifyToken } from "@/utils/auth";

export async function getMemberId() {

  const decoded = await verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb3JEZXNjZW5kYW5jZU9mIjoicG9uc2FqamFuXzMxMjUiLCJtZW1iZXJJZCI6MzAsInVzZXJUeXBlIjoibWVtYmVyIiwiaWF0IjoxNzQxOTY4ODE5LCJleHAiOjE3NDIxNDE2MTl9.bsAu56G-JhBI2Y9rHJpt5oeW7nzdmQ4JQL4CPXmgzMM');
  const memberId = decoded.memberId;

  if (!memberId) {
    return 1;
  }

  return memberId;
}