const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path: string, options: RequestInit = {}) {
 
  const token = localStorage.getItem("token");
  
    let headers: Record<string, string> = {};
  
  // Gérer les en-têtes personnalisés d'abord
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else {
      headers = { ...headers, ...(options.headers as Record<string, string>) };
    }
  }
  
  // Ajouter Content-Type uniquement si ce n'est pas FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token && !('Authorization' in headers)) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(API_URL + path, {
    ...options,
    headers,
  });
  if (!response.ok) {
    // Essayons d'obtenir le message d'erreur du serveur
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || 
      `Erreur ${response.status}: ${response.statusText}`
    );
  }
  return response.json();
}
