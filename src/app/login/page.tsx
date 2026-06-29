'use client';

import { useState, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { Factory, LogIn, AlertCircle } from 'lucide-react';
import { loginAction } from '@/actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error: string } | null, formData: FormData) => {
      const result = await loginAction(formData);
      // loginAction redirects on success, so if we get here there's an error
      return result ?? null;
    },
    null
  );

  const handleDemoLogin = () => {
    setEmail('micheal@ogullei.com');
    setPassword('MichealOgullei');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center gap-2 mb-8 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center text-white font-serif italic text-xl">M</div>
          <div>
            <h1 className="font-medium tracking-tight text-xl">MOgullei Industries</h1>
            <p className="text-[10px] italic text-emerald-600 font-medium">AI Powered</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-stone-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Sign in to your account</h2>

          {state?.error && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-start gap-3 border border-red-100">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{state.error}</p>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none transition-all"
                placeholder="micheal@ogullei.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                name="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 mt-6 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" /> {isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-500 mb-3">Demo Credentials</p>
            <button
              onClick={handleDemoLogin}
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800 underline underline-offset-4"
            >
              Use Dummy Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
