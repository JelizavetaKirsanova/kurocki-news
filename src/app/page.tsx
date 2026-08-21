import { isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { createPost, deletePost } from './actions';
import { Heart, Sparkles, Trash2, Edit3, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  const auth = await isAuthenticated();
  if (!auth) redirect('/login');

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 font-sans">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-pink-500" />
            <h1 className="text-2xl font-black font-serif tracking-tight">Kurocki News</h1>
          </div>
          <span className="text-xs font-medium bg-pink-100 text-pink-700 px-3 py-1 rounded-full flex items-center gap-1">
            С Днём Рождения, Ксюша! <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-12">
        {/* Форма создания */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-xl font-serif font-bold text-slate-800">Написать новость</h2>
          <form action={createPost} className="space-y-4">
            <input name="title" placeholder="Заголовок новости..." required className="w-full p-3 text-xl font-serif font-bold border-b border-slate-200 outline-none" />
            <input name="subtitle" placeholder="Подзаголовок / анонс..." className="w-full p-2 text-slate-600 border-b border-slate-100 outline-none" />
            <textarea name="content" placeholder="Текст новости (Markdown: # Подзаголовок, ![фото](url))..." rows={5} required className="w-full p-4 border rounded-xl outline-none" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="imageUrl" placeholder="URL главной обложки" className="p-3 border rounded-xl outline-none text-sm" />
              <input name="videoUrl" placeholder="URL видео (YouTube)" className="p-3 border rounded-xl outline-none text-sm" />
            </div>
            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition">
              Опубликовать
            </button>
          </form>
        </section>

        {/* Лента новостей в виде карточек */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post: any) => (
            <article key={post.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                {post.imageUrl && (
                  <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6 space-y-2">
                  <span className="text-xs text-slate-400">
                    {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-slate-900 leading-snug">{post.title}</h3>
                  {post.subtitle && (
                    <p className="text-slate-600 line-clamp-2 text-sm">{post.subtitle}</p>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                <Link href={`/post/${post.id}`} className="text-pink-600 hover:text-pink-700 font-semibold text-sm flex items-center gap-1">
                  Читать полностью <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center gap-2">
                  <Link href={`/edit/${post.id}`} className="p-2 text-slate-500 hover:text-slate-800 transition">
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <form action={deletePost}>
                    <input type="hidden" name="id" value={post.id} />
                    <button type="submit" className="p-2 text-red-500 hover:text-red-700 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}