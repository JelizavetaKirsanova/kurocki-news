import { isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { updatePost } from '@/app/actions';
import Link from 'next/link';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const auth = await isAuthenticated();
  if (!auth) redirect('/login');

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) notFound();

  // Получаем существующую дату публикации в формате YYYY-MM-DD
  const currentDate = new Date(post.createdAt).toISOString().split('T')[0];

  return (
    <main className="min-h-screen bg-[#FAF9F6] py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold">Редактирование статьи</h1>
          <Link href="/" className="text-sm text-slate-500">Отмена</Link>
        </div>

        <form action={updatePost} className="space-y-4">
          <input type="hidden" name="id" value={post.id} />
          <input name="title" defaultValue={post.title} required className="w-full p-3 font-serif font-bold border-b outline-none text-xl" />
          <input name="subtitle" defaultValue={post.subtitle || ''} className="w-full p-2 border-b outline-none text-slate-600" />
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Дата публикации
            </label>
            <input
              type="date"
              name="createdAt"
              defaultValue={currentDate}
              required
              className="w-full p-3 border rounded-xl outline-none text-sm text-slate-700"
            />
          </div>

          <textarea name="content" defaultValue={post.content} rows={10} required className="w-full p-4 border rounded-xl outline-none" />
          <input name="imageUrl" defaultValue={post.imageUrl || ''} placeholder="URL обложки" className="w-full p-3 border rounded-xl text-sm" />
          <input name="videoUrl" defaultValue={post.videoUrl || ''} placeholder="URL видео" className="w-full p-3 border rounded-xl text-sm" />
          
          <button type="submit" className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl">
            Сохранить изменения
          </button>
        </form>
      </div>
    </main>
  );
}