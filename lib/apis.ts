const API_BASE_URL = 'https://zwaznftpk9.execute-api.us-east-1.amazonaws.com/';

export async function apiPost<T>(path: string, token: string, data: any): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}${token || ''}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}