/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiUrl } from "../dotenv";

async function request(endpoint: string, options: RequestInit = {}) {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("jwt_token="))
    ?.split("=")[1];

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const methodsWithBody = ["POST", "PATCH", "PUT"];
  if (
    options.method &&
    methodsWithBody.includes(options.method.toUpperCase()) &&
    options.body
  ) {
    headers["Content-Type"] = "application/json";
  }

  if (options.headers) {
    const customHeaders = options.headers as Record<string, string>;
    Object.keys(customHeaders).forEach((key) => {
      headers[key] = customHeaders[key];
    });
  }

  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    document.cookie =
      "jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
    return;
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Ошибка сервера" }));
    throw error;
  }
  const contentType = response.headers.get("Content-Type");
  if (
    contentType &&
    (contentType.includes("application/octet-stream") ||
      contentType.includes("application/vnd.openxmlformats-officedocument") ||
      contentType.includes("blob"))
  ) {
    return response.blob();
  }
  
  return response.json();
}

export const api = {
  get: (url: string, options?: RequestInit) =>
    request(url, { method: "GET", ...options }),

  post: (url: string, body: any, options?: RequestInit) =>
    request(url, { method: "POST", body: JSON.stringify(body), ...options }),

  patch: (url: string, body: any, options?: RequestInit) =>
    request(url, { method: "PATCH", body: JSON.stringify(body), ...options }),
};

export const toQueryString = (params: Record<string, any>) => {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => s.append(key, v));
    } else if (value !== undefined && value !== null) {
      s.append(key, value);
    }
  });
  const res = s.toString();
  return res ? `?${res}` : "";
};
