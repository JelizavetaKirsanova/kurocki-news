import { cookies } from 'next/headers';

// Данные двух аккаунтов
const ADMIN_USER = { login: 'admin', pass: 'admin123' };
const READER_USER = { login: 'kurochki', pass: '00000000' };

export async function login(loginStr: string, passStr: string) {
  const cookieStore = await cookies();

  if (loginStr === ADMIN_USER.login && passStr === ADMIN_USER.pass) {
    cookieStore.set('user_role', 'admin', { httpOnly: true, path: '/' });
    return true;
  }

  if (loginStr === READER_USER.login && passStr === READER_USER.pass) {
    cookieStore.set('user_role', 'reader', { httpOnly: true, path: '/' });
    return true;
  }

  return false;
}

export async function getUserRole() {
  const cookieStore = await cookies();
  return cookieStore.get('user_role')?.value || null;
}

export async function isAuthenticated() {
  const role = await getUserRole();
  return role !== null;
}

export async function isAdmin() {
  const role = await getUserRole();
  return role === 'admin';
}