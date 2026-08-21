import { isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import PostContent from '@/app/components/PostContent';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const auth = await isAuthenticated();
  if (!auth) redirect('/login');

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) notFound();

  return (
    <article className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans py-8 md:py-16 px-4 md:px-8 selection:bg-pink-200 selection:text-pink-900">
      {/* Увеличена ширина с max-w-3xl до max-w-5xl */}
      <div className="max-w-5xl mx-auto space-y-10 bg-white p-6 md:p-16 rounded-3xl border border-stone-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between border-b border-stone-100 pb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-stone-400 hover:text-stone-900 transition">
            <ArrowLeft className="w-4 h-4" /> Главная лента
          </Link>
          <span className="text-xs font-serif italic text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
            Kurocki Magazine
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-pink-500" />
            {new Date(post.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-stone-900 leading-tight">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="text-xl md:text-2xl text-stone-500 font-serif italic font-light leading-snug">
              {post.subtitle}
            </p>
          )}
        </div>

        <PostContent content={post.content} imageUrl={post.imageUrl} videoUrl={post.videoUrl} title={post.title} />
      </div>
    </article>
  );
}