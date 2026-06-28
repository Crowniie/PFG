// API client for the n8n middleware

interface FetchOptions extends RequestInit {
  body?: any;
}

export async function apiFetch(
  url: string,
  options: FetchOptions = {}
): Promise<any> {
  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  // stringify the body only if it's an object (strings are left as-is)
  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  // parse the json, fall back to null if there's no body
  let data: any = null;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    let message = "HTTP " + response.status;
    if (data && data.message) {
      message = data.message;
    } else if (data && data.error) {
      message = data.error;
    }

    const error: any = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}