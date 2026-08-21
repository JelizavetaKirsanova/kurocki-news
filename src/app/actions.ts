'use server'

import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const isAuth = await isAuthenticated();
  if (!isAuth) throw new Error('Не авторизован');

  const title = formData.get('title') as string;
  const subtitle = formData.get('subtitle') as string;
  const content = formData.get('content') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const videoUrl = formData.get('videoUrl') as string;

  const slug = title
    .toLowerCase()
    .replace(/[^a-zа-я0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-') + '-' + Date.now();

  await prisma.post.create({
    data: {
      title,
      subtitle: subtitle || null,
      slug,
      content,
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
    },
  });

  revalidatePath('/');
}

export async function deletePost(formData: FormData) {
  const isAuth = await isAuthenticated();
  if (!isAuth) throw new Error('Не авторизован');

  const id = formData.get('id') as string;
  await prisma.post.delete({ where: { id } });

  revalidatePath('/');
  redirect('/');
}

export async function updatePost(formData: FormData) {
  const isAuth = await isAuthenticated();
  if (!isAuth) throw new Error('Не авторизован');

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const subtitle = formData.get('subtitle') as string;
  const content = formData.get('content') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const videoUrl = formData.get('videoUrl') as string;

  await prisma.post.update({
    where: { id },
    data: {
      title,
      subtitle: subtitle || null,
      content,
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
    },
  });

  revalidatePath('/');
  revalidatePath(`/post/${id}`);
  redirect(`/post/${id}`);
}