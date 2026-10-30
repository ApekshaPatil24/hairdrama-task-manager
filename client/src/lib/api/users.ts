
"use client";

import {
  getApiUrl,
  getAuthenticatedSession,
  parseApiError,
} from "@/lib/api/tasks";

export type DirectoryUser = {
  id: string;
  fullName: string | null;
  email: string | null;
  avatarUrl: string | null;
};

export type UsersDirectoryResponse = {
  success: boolean;
  users: DirectoryUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export async function fetchUsers(
  search = "",
  page = 1,
  limit = 10
): Promise<UsersDirectoryResponse> {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error("Page must be a positive integer.");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    throw new Error("Limit must be between 1 and 50.");
  }

  if (typeof search !== "string" || search.length > 80) {
    throw new Error("Search must not exceed 80 characters.");
  }

  const session = await getAuthenticatedSession();

  const params = new URLSearchParams({
    search: search.trim(),
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(
    `${getApiUrl()}/api/users?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const result =
    (await response.json()) as UsersDirectoryResponse;

  if (!result.success || !Array.isArray(result.users)) {
    throw new Error("Invalid user directory response.");
  }

  return result;
}
