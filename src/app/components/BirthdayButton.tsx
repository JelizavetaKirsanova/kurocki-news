'use client'

import React from 'react';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';

export default function BirthdayButton() {
  const triggerBirthdayEffect = () => {
    // 1. Запуск загородного салюта конфетти
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#ff69b4', '#ff1493', '#ffb6c1', '#ffd700', '#ffffff'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  return (
    <button
      onClick={triggerBirthdayEffect}
      type="button"
      className="group relative text-xs font-medium bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200/80 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
      title="Нажми для сюрприза!"
    >
      <span>С Днём Рождения, Ксюша!</span>
      <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse group-hover:scale-125 transition-transform" />
    </button>
  );
}