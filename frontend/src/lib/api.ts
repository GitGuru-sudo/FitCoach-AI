const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000/api";

type ApiFetchOptions = {
  method?: "GET" | "POST";
  token?: string;
  body?: unknown;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const apiFetch = async <T>(
  path: string,
  { method = "GET", token, body }: ApiFetchOptions = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? ((await response.json()) as { message?: string } & T)
    : null;

  if (!response.ok) {
    throw new ApiError(data?.message || "Request failed", response.status);
  }

  return data as T;
};
