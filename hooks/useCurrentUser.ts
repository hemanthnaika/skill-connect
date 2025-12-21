"use client";

import { authClient } from "@/lib/auth-client";

type CurrentUser = {
  id: string;
  name: string | null;
  image: string | null;
};

export function useCurrentUser() {
  const { data: session, isPending } = authClient.useSession();

  const user: CurrentUser | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? null,
        image: session.user.image ?? null,
      }
    : null;

  return {
    user,
    loading: isPending,
    authenticated: !!session?.user,
  };
}
