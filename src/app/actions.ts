'server'

import { prisma } from '@/lib/prisma';
import { login, isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function handleLogin(formData: FormData) {
  const loginStr = formData.get('login') as string;
  const passStr = formData.get('password') as string;

  const success = await login(loginStr, passStr);
  if (success) {
    redirect('/');
  } else {
    redirect('/login?error=1');
  }
}

export async function createPost(formData: FormData) {
  const isAuth = await isAuthenticated();
  if (!isAuth) throw new Error('Не авторизован');

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const videoUrl = formData.get('videoUrl') as string;

  await prisma.post.create({
    data: { title, content, imageUrl, videoUrl },
  });

  revalidatePath('/');
}