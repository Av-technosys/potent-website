'use server'
import { BASE_API_URL } from "@/env";
import { getAuthSession } from "@/helper/auth/session";

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const session = await getAuthSession({ refresh: true, persistRefresh: true });
  const accessToken = session.accessToken;

  const makeRequest = async (token?: string) => {
    return fetch(`${BASE_API_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  };

  let res = await makeRequest(accessToken);

  if (res.status === 401) {
    const refreshedSession = await getAuthSession({
      refresh: true,
      persistRefresh: true,
    });
    const newAccessToken = refreshedSession.accessToken;

    if (!newAccessToken) {
      return {
        status: res.status,
        data: await res.json(),
      };
    }

    res = await makeRequest(newAccessToken);
  }

  return {
    status: res.status,
    data: await res.json(),
  };
}
