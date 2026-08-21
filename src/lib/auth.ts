import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode('ksusha-birthday-secret-key-2024');

export async function login(loginStr: string, passStr: string) {
  if (loginStr === 'kurochki' && passStr === '00000000') {
    const token = await new SignJWT({ user: 'kurochki' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(SECRET_KEY);

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, { httpOnly: true, path: '/' });
    return true;
  }
  return false;
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, SECRET_KEY);
    return true;
  } catch {
    return false;
  }
}