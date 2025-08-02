const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!; // Ensure it's not undefined

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

export async function apiDelete<T>(path:string,token:string):Promise<T>{
    const res = await fetch(`${API_BASE_URL}${path}`,{
        method:"DELETE",
         headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    });
     if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}
export async function apiGet<T>(path:string,token:string):Promise<T>{
    const res = await fetch(`${API_BASE_URL}${path}`,{
        method:"GET",
         headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    }); 
     if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}