import { isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const auth = await isAuthenticated();
  if (!auth) redirect('/login');

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) notFound();

  return (
    <article className="min-h-screen bg-[#FAF9F6] text-slate-900 font-sans py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8 bg-white p-6 md:p-12 rounded-2xl border border-slate-200">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition">
          <ArrowLeft className="w-4 h-4" /> Назад к новостям
        </Link>

        <div className="space-y-3 border-b border-slate-100 pb-6">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="text-xl text-slate-600 font-light">{post.subtitle}</p>
          )}
          <p className="text-xs text-slate-400">
            {new Date(post.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} className="w-full max-h-[480px] object-cover rounded-xl" />
        )}

        <div className="prose prose-slate max-w-none text-slate-800 text-lg leading-relaxed space-y-4">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}