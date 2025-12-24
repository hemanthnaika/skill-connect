import { getCurrentUser } from "./currentUser";

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  return user;
}

export async function requireRole(roles: Array<"admin" | "user">) {
  const user = await requireAuth();

  if (!roles.includes(user.role)) {
    throw new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }
  return user;
}

export async function requireAdmin() {
  return requireRole(["admin"]);
}
