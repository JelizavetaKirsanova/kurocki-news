import { isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { createPost } from './actions';
import { Heart, Image as ImageIcon, Video, Sparkles } from 'lucide-react';

export default async function HomePage() {
  const auth = await isAuthenticated();
  if (!auth) redirect('/login');

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white/70 backdrop-blur-md sticky top-0 z-10 border-b border-pink-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-pink-500" />
            <h1 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Kurocki News
            </h1>
          </div>
          <span className="text-sm font-medium bg-pink-100 text-pink-700 px-3 py-1 rounded-full flex items-center gap-1">
            С Днём Рождения, Ксюша! <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Форма создания новости */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100 space-y-4">
          <h2 className="text-xl font-bold text-slate-700">Опубликовать новость</h2>
          <form action={createPost} className="space-y-4">
            <input
              name="title"
              placeholder="Заголовок новости..."
              required
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-300 outline-none"
            />
            <textarea
              name="content"
              placeholder="Текст новости..."
              rows={3}
              required
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-300 outline-none"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="imageUrl"
                placeholder="Ссылка на фото (URL)"
                className="p-3 border rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-sm"
              />
              <input
                name="videoUrl"
                placeholder="Ссылка на видео (YouTube / MP4 URL)"
                className="p-3 border rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition"
            >
              Опубликовать
            </button>
          </form>
        </section>

        {/* Лента новостей */}
        <section className="space-y-6">
          {posts.map((post: any) => (
            <article key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {post.imageUrl && (
                <img src={post.imageUrl} alt={post.title} className="w-full max-h-96 object-cover" />
              )}
              {post.videoUrl && (
                <div className="aspect-video w-full">
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
              <div className="p-6 space-y-2">
                <span className="text-xs text-slate-400">
                  {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                </span>
                <h3 className="text-2xl font-bold text-slate-800">{post.title}</h3>
                <p className="text-slate-600 whitespace-pre-line">{post.content}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}