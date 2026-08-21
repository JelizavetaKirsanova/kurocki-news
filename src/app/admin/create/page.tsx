import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createPost } from '@/app/actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function CreatePostPage() {
  const auth = await isAuthenticated();
  if (!auth) redirect('/login');

  // Форматируем сегодняшнюю дату по умолчанию для поля формы (YYYY-MM-DD)
  const defaultDate = new Date().toISOString().split('T')[0];

  return (
    <main className="min-h-screen bg-[#FAF9F6] py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition">
          <ArrowLeft className="w-4 h-4" /> Назад к новостям
        </Link>

        <h1 className="text-2xl font-serif font-bold text-slate-900">Создать новую новость</h1>

        <form action={createPost} className="space-y-4">
          <input
            name="title"
            placeholder="Заголовок новости..."
            required
            className="w-full p-3 text-xl font-serif font-bold border-b border-slate-200 outline-none"
          />
          <input
            name="subtitle"
            placeholder="Подзаголовок / анонс..."
            className="w-full p-2 text-slate-600 border-b border-slate-100 outline-none"
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Дата публикации
            </label>
            <input
              type="date"
              name="createdAt"
              defaultValue={defaultDate}
              required
              className="w-full p-3 border rounded-xl outline-none text-sm text-slate-700"
            />
          </div>

          <textarea
            name="content"
            placeholder="Текст новости (Markdown: # Подзаголовок, ![фото](url))..."
            rows={8}
            required
            className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-slate-300"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="imageUrl"
              placeholder="URL обложки (например, из Google Диска)"
              className="p-3 border rounded-xl outline-none text-sm"
            />
            <input
              name="videoUrl"
              placeholder="URL видео (YouTube)"
              className="p-3 border rounded-xl outline-none text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition shadow-md"
          >
            Опубликовать
          </button>
        </form>
      </div>
    </main>
  );
}