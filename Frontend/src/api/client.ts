//This file defines the API client for making requests to the middleware server.

interface FetchOptions extends RequestInit {
  body?: any;
}

//Error handliling for JSON responses and handling error parsing
export async function apiFetch<T = any>(url: string,options: FetchOptions = {}): Promise<T> {
  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  // Convert body to a string if it is not an object
  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  // Try to parse JSON 
  let data: any;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // If the response is not ok, throw an error with the parsed data
  if (!response.ok) {
    const error: any = new Error(
      data?.message || data?.error || `HTTP ${response.status}`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data as T;
}
