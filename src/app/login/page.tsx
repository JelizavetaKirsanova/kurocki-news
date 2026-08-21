'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Terminal, Lock, User, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-red-500 font-mono flex items-center justify-center p-4 selection:bg-red-900 selection:text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f0909_1px,transparent_1px),linear-gradient(to_bottom,#1f0909_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-red-950/20 via-black to-black pointer-events-none" />

      <div className="w-full max-w-md bg-stone-900/90 border-2 border-red-900/80 rounded-xl p-6 md:p-8 shadow-[0_0_50px_rgba(153,27,27,0.25)] relative z-10 backdrop-blur-md">
        
        <div className="flex items-center justify-between border-b border-red-900/50 pb-4 mb-6">
          <div className="flex items-center gap-2 text-red-500 text-xs font-bold tracking-widest uppercase">
            <Terminal className="w-4 h-4 animate-pulse" />
            <span>CONFIDENTIAL_DB // V4.08</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span className="text-[10px] text-red-700 font-bold tracking-wider uppercase">RESTRICTED</span>
          </div>
        </div>

        <div className="bg-red-950/40 border border-red-800/60 rounded-lg p-3.5 mb-6 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-red-400 uppercase tracking-wider">ВНИМАНИЕ: ДОСТУП ОГРАНИЧЕН</p>
            <p className="text-red-300/70 leading-relaxed">
              Данный терминал содержит зашифрованные материалы следствия. Все IP-адреса фиксируются.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Поле Логина */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-red-500" />
              Идентификатор агента (Логин):
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="agent_code"
                required
                className="w-full bg-black/80 border border-red-900/80 rounded-lg px-4 py-2.5 text-red-400 placeholder-stone-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono text-sm transition tracking-wider"
              />
            </div>
          </div>

          {/* Поле Пароля */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-red-500" />
              Ключ доступа (Пароль):
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-black/80 border border-red-900/80 rounded-lg px-4 py-2.5 text-red-400 placeholder-stone-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono text-sm transition tracking-widest"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/80 border border-red-800 p-2.5 rounded-lg">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>ОШИБКА АВТОРИЗАЦИИ: Неверные данные доступа.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-red-950 hover:bg-red-900 text-red-200 border border-red-700 font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(153,27,27,0.4)] hover:shadow-[0_0_25px_rgba(225,29,225,0.6)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? <span>РАСШИФРОВКА...</span> : <span>ПОДТВЕРДИТЬ ЛИЧНОСТЬ</span>}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-red-900/30 text-center">
          <p className="text-[10px] text-stone-600 tracking-widest uppercase">
            STATUS: SURVEILLANCE ACTIVE // CASE #2026-KS
          </p>
        </div>
      </div>
    </div>
  );
}