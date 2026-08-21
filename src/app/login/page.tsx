import { login } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default function LoginPage() {
  async function handleLogin(formData: FormData) {
    'use server'
    const loginStr = formData.get('login') as string;
    const passStr = formData.get('password') as string;

    const success = await login(loginStr, passStr);
    if (success) {
      redirect('/');
    } else {
      redirect('/login?error=1');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-white">
        <h1 className="text-3xl font-extrabold text-center text-pink-600 mb-2">Kurocki News 💖</h1>
        <p className="text-center text-gray-500 mb-6">Спецвыпуск для Ксюши!</p>
        <form action={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Логин</label>
            <input name="login" type="text" required className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Пароль</label>
            <input name="password" type="password" required className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-400 outline-none" />
          </div>
          <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}