type FetchParams = Record<string, unknown>;

export const dataClient = {
  async fetch<T = unknown>(query: string, params?: FetchParams): Promise<T> {
    const response = await fetch("/api/data/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, params }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Data query failed with status ${response.status}`);
    }

    const payload = (await response.json()) as { data: T };
    return payload.data;
  },
};
