"use client";

import { createClient } from "@/lib/supabase/client";

type AuthenticatedUser = {
  id: string;
  email: string | null;
};

type AuthResponse = {
  success?: boolean;
  user?: AuthenticatedUser;
  error?: string;
};

export async function verifyBackendAuth(): Promise<AuthenticatedUser> {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiUrl) {
    throw new Error("Backend API URL is missing.");
  }

  // Get the existing Supabase browser client
  const supabase = createClient();

  // Retrieve the current authenticated session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  if (!session?.access_token) {
    throw new Error("No authenticated Supabase session found.");
  }

  // Send access token to Flask
  const response = await fetch(
    `${apiUrl.replace(/\/+$/, "")}/api/auth/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  const result = (await response.json().catch(() => null)) as
    | AuthResponse
    | null;

  if (!response.ok) {
    throw new Error(
      result?.error || `Backend request failed (${response.status}).`
    );
  }

  if (!result?.success || !result.user) {
    throw new Error("Backend returned an invalid authentication response.");
  }

  return result.user;
}