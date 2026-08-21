import { isAuthenticated, isAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { deletePost, logout } from './actions';
import { Heart, Sparkles, Trash2, Edit3, ArrowRight, Plus, LogOut, Calendar, Newspaper } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  const auth = await isAuthenticated();
  if (!auth) redirect('/login');

  const adminAccess = await isAdmin();

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans selection:bg-pink-200 selection:text-pink-900">
      {/* Декоративная полоса сверху */}
      <div className="h-1.5 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 w-full" />

      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-20 border-b border-stone-200/60 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-100/80 flex items-center justify-center text-pink-600 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black font-serif tracking-tight text-stone-900">
                Kurocki <span className="text-pink-600 italic font-normal">News</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Special Edition</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {adminAccess && (
              <Link
                href="/admin/create"
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium px-4 py-2 rounded-full flex items-center gap-1.5 transition shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4 text-pink-400" /> Написать статью
              </Link>
            )}
            <span className="hidden sm:flex text-xs font-medium bg-pink-50 text-pink-700 border border-pink-200/60 px-3.5 py-1.5 rounded-full items-center gap-1.5 shadow-sm">
              С Днём Рождения, Ксюша! <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" />
            </span>

            <form action={logout}>
              <button
                type="submit"
                title="Выйти из аккаунта"
                className="p-2 text-stone-400 hover:text-stone-800 transition rounded-full hover:bg-stone-100"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Баннер выпуска */}
        <section className="text-center space-y-3 pb-8 border-b border-stone-200/80">
          <span className="text-xs font-bold tracking-widest uppercase text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
            Эксклюзивный архив
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            Хроники незабываемых вечеров
          </h2>
          <p className="text-stone-500 max-w-lg mx-auto text-sm md:text-base italic font-serif">
            Самые свежие репортажи, расследования и секретные материалы специальных корреспондентов.
          </p>
        </section>

        {/* Сетка карточек новостей */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post: any) => (
            <article
              key={post.id}
              className="group bg-white rounded-3xl border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                {post.imageUrl ? (
                  <div className="relative overflow-hidden h-56 bg-stone-100">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                    <span className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-md text-stone-800 text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-pink-500" />
                      {new Date(post.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                ) : (
                  <div className="p-6 pb-0">
                    <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 text-[11px] font-semibold px-3 py-1 rounded-full">
                      <Calendar className="w-3 h-3 text-pink-500" />
                      {new Date(post.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                )}

                <div className="p-6 space-y-3">
                  <h3 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-pink-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  {post.subtitle && (
                    <p className="text-stone-600 line-clamp-2 text-sm leading-relaxed font-light">
                      {post.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-stone-100/80 mt-4">
                <Link
                  href={`/post/${post.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-600 hover:text-pink-700 transition"
                >
                  Читать репортаж <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {adminAccess && (
                  <div className="flex items-center gap-1 bg-stone-50 p-1 rounded-full border border-stone-200/50">
                    <Link
                      href={`/edit/${post.id}`}
                      className="p-2 text-stone-400 hover:text-stone-800 transition rounded-full hover:bg-white"
                      title="Редактировать"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>
                    <form action={deletePost}>
                      <input type="hidden" name="id" value={post.id} />
                      <button
                        type="submit"
                        className="p-2 text-rose-400 hover:text-rose-600 transition rounded-full hover:bg-white"
                        title="Удалить"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}