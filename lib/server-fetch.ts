import { headers } from "next/headers";

type ServerFetchOptions = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  cache?: RequestCache;
  revalidate?: number;
};

export async function serverFetch<T>({
  url,
  method = "GET",
  body,
  cache = "no-store",
  revalidate,
}: ServerFetchOptions): Promise<T> {
  const requestHeaders = await headers();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${url}`, {
    method,
    cache,
    next: revalidate ? { revalidate } : undefined,
    headers: {
      "Content-Type": "application/json",
      ...Object.fromEntries(requestHeaders.entries()),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Server fetch failed");
  }

  return res.json();
}
