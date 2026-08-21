'use client'

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface PostContentProps {
  content: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  title: string;
}

export default function PostContent({ content, imageUrl, videoUrl, title }: PostContentProps) {
  const [openLightbox, setOpenLightbox] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');

  const handleImageClick = (src: string) => {
    setActiveImage(src);
    setOpenLightbox(true);
  };

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
            onClick={() => handleImageClick(src)}
            className="w-full h-auto object-contain rounded-2xl border border-stone-200/80 shadow-md cursor-pointer hover:opacity-95 hover:scale-[1.01] transition-all"
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
    <>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          onClick={() => handleImageClick(imageUrl)}
          className="w-full h-auto object-contain rounded-3xl shadow-md my-8 cursor-pointer hover:opacity-95 transition"
        />
      )}

      {videoUrl && (
        <div className="my-8 aspect-video w-full rounded-3xl overflow-hidden shadow-lg border border-stone-200 bg-black">
          {videoUrl.includes('drive.google.com') ? (
            <iframe src={videoUrl.replace(/\/view.*$/, '/preview')} className="w-full h-full border-0" allow="autoplay" allowFullScreen />
          ) : videoUrl.includes('youtube') || videoUrl.includes('youtu.be') ? (
            <iframe src={videoUrl.replace('watch?v=', 'embed/')} className="w-full h-full border-0" allowFullScreen />
          ) : (
            <video src={videoUrl} controls className="w-full h-full object-cover" />
          )}
        </div>
      )}

      <div className="prose prose-stone max-w-none">
        <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
      </div>

      <Lightbox
        open={openLightbox}
        close={() => setOpenLightbox(false)}
        slides={[{ src: activeImage }]}
      />
    </>
  );
}