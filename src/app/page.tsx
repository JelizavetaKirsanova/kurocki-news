import { isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { createPost } from './actions';
import { Heart, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default async function HomePage() {
  const auth = await isAuthenticated();
  if (!auth) redirect('/login');

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 font-sans">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-pink-500" />
            <h1 className="text-2xl font-black font-serif tracking-tight">
              Kurocki News
            </h1>
          </div>
          <span className="text-xs font-medium bg-pink-100 text-pink-700 px-3 py-1 rounded-full flex items-center gap-1">
            С Днём Рождения, Ксюша! <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-12">
        {/* Редактор создания статьи */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-xl font-serif font-bold text-slate-800">Редактор спецвыпуска</h2>
          <form action={createPost} className="space-y-4">
            <input
              name="title"
              placeholder="Главный заголовок статьи..."
              required
              className="w-full p-3 text-2xl font-serif font-bold border-b border-slate-200 outline-none focus:border-slate-800 transition placeholder:font-sans placeholder:text-lg placeholder:font-normal"
            />
            <input
              name="subtitle"
              placeholder="Вводный анонс / лид статьи..."
              className="w-full p-2 text-base text-slate-600 outline-none border-b border-slate-100 focus:border-slate-400 transition"
            />
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Текст статьи (поддерживает абзацы и # подзаголовки)
              </label>
              <textarea
                name="content"
                placeholder="Пишите текст статьи здесь. Добавляйте подзаголовки со значком # в начале строки..."
                rows={8}
                required
                className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-slate-300 transition text-base leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="imageUrl"
                placeholder="Ссылка на обложку (URL photo)"
                className="p-3 border rounded-xl outline-none text-sm focus:ring-1 focus:ring-slate-400"
              />
              <input
                name="videoUrl"
                placeholder="Ссылка на видео (YouTube URL)"
                className="p-3 border rounded-xl outline-none text-sm focus:ring-1 focus:ring-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition shadow-md"
            >
              Опубликовать в спецвыпуск
            </button>
          </form>
        </section>

        {/* Журнальная лента */}
        <section className="space-y-16">
          {posts.map((post: any) => (
            <article key={post.id} className="bg-white p-6 md:p-10 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              {/* Шапка статьи */}
              <div className="space-y-3 border-b border-slate-100 pb-6">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
                  {post.title}
                </h2>
                {post.subtitle && (
                  <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed">
                    {post.subtitle}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                  <span>{new Date(post.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>СПЕЦВЫПУСК</span>
                </div>
              </div>

              {/* Медиа-обложка */}
              {post.imageUrl && (
                <div className="rounded-xl overflow-hidden my-4">
                  <img src={post.imageUrl} alt={post.title} className="w-full max-h-[480px] object-cover" />
                </div>
              )}

              {post.videoUrl && (
                <div className="aspect-video w-full rounded-xl overflow-hidden">
                  {post.videoUrl.includes('youtube') ? (
                    <iframe
                      src={post.videoUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <video src={post.videoUrl} controls className="w-full h-full object-cover" />
                  )}
                </div>
              )}

              {/* Основное тело статьи */}
              <div className="prose prose-slate max-w-none text-slate-800 text-lg leading-relaxed space-y-4">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}