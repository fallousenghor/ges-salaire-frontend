import { apiFetch } from './apiFetch';

export async function login(email: string, motDePasse: string) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, motDePasse }),
  });
}