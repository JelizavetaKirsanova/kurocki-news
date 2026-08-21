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

  // Кастомный рендерер медиафайлов и элементов с исправленным типом для TypeScript
  const MarkdownComponents: any = {
    img: ({ src, alt }: { src?: any; alt?: string }) => {
      if (!src || typeof src !== 'string') return null;

      const isGoogleDriveVideo = src.includes('drive.google.com') && (src.includes('/preview') || src.includes('/view'));
      const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
      const isDirectVideo = src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov');

      // 1. Видео из Google Диска
      if (isGoogleDriveVideo) {
        const embedUrl = src.replace(/\/view.*$/, '/preview');
        return (
          <div className="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-black">
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allow="autoplay"
              allowFullScreen
            />
          </div>
        );
      }

      // 2. Видео с YouTube
      if (isYouTube) {
        let embedUrl = src;
        if (src.includes('watch?v=')) {
          embedUrl = src.replace('watch?v=', 'embed/');
        } else if (src.includes('youtu.be/')) {
          embedUrl = src.replace('youtu.be/', 'youtube.com/embed/');
        }

        return (
          <div className="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }

      // 3. Прямой видеофайл (MP4, MOV)
      if (isDirectVideo) {
        return (
          <div className="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-black">
            <video src={src} controls className="w-full h-full object-contain" />
          </div>
        );
      }

      // 4. Обычная картинка с отступами
      return (
        <figure className="my-8 space-y-2">
          <img
            src={src}
            alt={alt || ''}
            className="w-full max-h-[500px] object-cover rounded-2xl border border-slate-200 shadow-sm"
          />
          {alt && <figcaption className="text-center text-xs text-slate-400 italic">{alt}</figcaption>}
        </figure>
      );
    },

    p: ({ children }: any) => <p className="my-6 leading-relaxed text-slate-800 text-lg">{children}</p>,
    h1: ({ children }: any) => <h1 className="mt-12 mb-6 text-3xl font-serif font-bold text-slate-900 border-b pb-2">{children}</h1>,
    h2: ({ children }: any) => <h2 className="mt-10 mb-4 text-2xl font-serif font-bold text-slate-900">{children}</h2>,
    h3: ({ children }: any) => <h3 className="mt-8 mb-3 text-xl font-serif font-semibold text-slate-800">{children}</h3>,
    blockquote: ({ children }: any) => (
      <blockquote className="my-8 border-l-4 border-pink-400 pl-4 italic text-slate-700 bg-pink-50/50 py-3 pr-4 rounded-r-xl">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-10 border-slate-200" />,
  };

  return (
    <article className="min-h-screen bg-[#FAF9F6] text-slate-900 font-sans py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8 bg-white p-6 md:p-12 rounded-2xl border border-slate-200 shadow-sm">
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

        {/* Главная фото-обложка статьи */}
        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} className="w-full max-h-[480px] object-cover rounded-2xl my-6" />
        )}

        {/* Главная видео-обложка статьи */}
        {post.videoUrl && (
          <div className="my-6 aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-black">
            {post.videoUrl.includes('drive.google.com') ? (
              <iframe
                src={post.videoUrl.replace(/\/view.*$/, '/preview')}
                className="w-full h-full border-0"
                allow="autoplay"
                allowFullScreen
              />
            ) : post.videoUrl.includes('youtube') || post.videoUrl.includes('youtu.be') ? (
              <iframe
                src={post.videoUrl.replace('watch?v=', 'embed/')}
                className="w-full h-full border-0"
                allowFullScreen
              />
            ) : (
              <video src={post.videoUrl} controls className="w-full h-full object-cover" />
            )}
          </div>
        )}

        {/* Основной текст новости */}
        <div className="prose prose-slate max-w-none text-slate-800 text-lg">
          <ReactMarkdown components={MarkdownComponents}>{post.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}