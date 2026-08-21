import { isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ArrowLeft, Calendar, Share2, Sparkles } from 'lucide-react';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const auth = await isAuthenticated();
  if (!auth) redirect('/login');

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) notFound();

  const MarkdownComponents: any = {
    img: ({ src, alt }: { src?: any; alt?: string }) => {
      if (!src || typeof src !== 'string') return null;

      const isGoogleDriveVideo = src.includes('drive.google.com') && (src.includes('/preview') || src.includes('/view'));
      const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
      const isDirectVideo = src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov');

      if (isGoogleDriveVideo) {
        const embedUrl = src.replace(/\/view.*$/, '/preview');
        return (
          <div className="my-10 aspect-video w-full rounded-3xl overflow-hidden shadow-lg border border-stone-200 bg-black">
            <iframe src={embedUrl} className="w-full h-full border-0" allow="autoplay" allowFullScreen />
          </div>
        );
      }

      if (isYouTube) {
        let embedUrl = src;
        if (src.includes('watch?v=')) {
          embedUrl = src.replace('watch?v=', 'embed/');
        } else if (src.includes('youtu.be/')) {
          embedUrl = src.replace('youtu.be/', 'youtube.com/embed/');
        }

        return (
          <div className="my-10 aspect-video w-full rounded-3xl overflow-hidden shadow-lg border border-stone-200">
            <iframe src={embedUrl} className="w-full h-full border-0" allowFullScreen />
          </div>
        );
      }

      if (isDirectVideo) {
        return (
          <div className="my-10 aspect-video w-full rounded-3xl overflow-hidden shadow-lg border border-stone-200 bg-black">
            <video src={src} controls className="w-full h-full object-contain" />
          </div>
        );
      }

      return (
        <figure className="my-10 space-y-3">
          <img
            src={src}
            alt={alt || ''}
            className="w-full max-h-[550px] object-cover rounded-3xl border border-stone-200/80 shadow-md"
          />
          {alt && <figcaption className="text-center text-xs text-stone-400 italic font-serif">{alt}</figcaption>}
        </figure>
      );
    },

    p: ({ children }: any) => <p className="my-7 leading-relaxed text-stone-800 text-lg md:text-xl font-sans">{children}</p>,
    h1: ({ children }: any) => <h1 className="mt-14 mb-6 text-3xl md:text-4xl font-serif font-bold text-stone-900 border-b border-pink-200/80 pb-3">{children}</h1>,
    h2: ({ children }: any) => <h2 className="mt-12 mb-5 text-2xl md:text-3xl font-serif font-bold text-stone-900">{children}</h2>,
    h3: ({ children }: any) => <h3 className="mt-8 mb-4 text-xl font-serif font-semibold text-stone-800">{children}</h3>,
    blockquote: ({ children }: any) => (
      <blockquote className="my-10 border-l-4 border-pink-400 pl-6 italic text-stone-800 bg-gradient-to-r from-pink-50/80 to-transparent py-4 pr-6 rounded-r-2xl font-serif text-xl">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-12 border-stone-200/80" />,
  };

  return (
    <article className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans py-12 px-4 selection:bg-pink-200 selection:text-pink-900">
      <div className="max-w-3xl mx-auto space-y-10 bg-white p-8 md:p-14 rounded-3xl border border-stone-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
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

        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} className="w-full max-h-[500px] object-cover rounded-3xl shadow-md my-8" />
        )}

        {post.videoUrl && (
          <div className="my-8 aspect-video w-full rounded-3xl overflow-hidden shadow-lg border border-stone-200 bg-black">
            {post.videoUrl.includes('drive.google.com') ? (
              <iframe src={post.videoUrl.replace(/\/view.*$/, '/preview')} className="w-full h-full border-0" allow="autoplay" allowFullScreen />
            ) : post.videoUrl.includes('youtube') || post.videoUrl.includes('youtu.be') ? (
              <iframe src={post.videoUrl.replace('watch?v=', 'embed/')} className="w-full h-full border-0" allowFullScreen />
            ) : (
              <video src={post.videoUrl} controls className="w-full h-full object-cover" />
            )}
          </div>
        )}

        <div className="prose prose-stone max-w-none">
          <ReactMarkdown components={MarkdownComponents}>{post.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}