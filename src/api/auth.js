const API_BASE_URL = (
  import.meta.env?.VITE_API_BASE_URL?.trim() || "/api"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, status, details = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function authRequest(path, { body, method = "GET", signal } = {}) {
  const headers = { Accept: "application/json" };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    headers["X-SpotMTL-Request"] = "1";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "include",
    headers,
    method,
    signal,
  });
  const responseBody = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new ApiError(
      responseBody?.error || "The authentication request failed.",
      response.status,
      Array.isArray(responseBody?.details) ? responseBody.details : [],
    );
  }

  return responseBody;
}

export function registerAccount({ name, email, password }, options = {}) {
  return authRequest("/auth/register", {
    ...options,
    body: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    },
    method: "POST",
  });
}

export function loginAccount({ email, password }, options = {}) {
  return authRequest("/auth/login", {
    ...options,
    body: {
      email: email.trim().toLowerCase(),
      password,
    },
    method: "POST",
  });
}

export function getCurrentAccount(options = {}) {
  return authRequest("/auth/me", options);
}

export function logoutAccount(options = {}) {
  return authRequest("/auth/logout", { ...options, method: "POST" });
}

export function getAdminUsers(options = {}) {
  return authRequest("/admin/users", options);
}
