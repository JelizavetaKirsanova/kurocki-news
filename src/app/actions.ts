'use server'

import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const isAuth = await isAuthenticated();
  if (!isAuth) throw new Error('Не авторизован');

  const title = formData.get('title') as string;
  const subtitle = formData.get('subtitle') as string;
  const content = formData.get('content') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const videoUrl = formData.get('videoUrl') as string;

  await prisma.post.create({
    data: {
      title,
      subtitle: subtitle || null,
      content,
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
    },
  });

  revalidatePath('/');
}