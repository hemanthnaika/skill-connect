import { headers } from "next/headers";
import { auth } from "./auth";

export type UserRole = "admin" | "user";

type CurrentUser = {
  id: string;
  email: string;
  role: UserRole;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (session?.user as CurrentUser) ?? null;
}
