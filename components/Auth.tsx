
import React, { useState } from 'react';
import { User } from '../types';
import { useI18n } from '../hooks/useI18n';

interface AuthProps {
  onAuth: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const { t } = useI18n();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t('error_fields'));
      return;
    }

    if (!validateEmail(email)) {
      setError(t('error_email'));
      return;
    }

    if (!isLogin && password.length < 6) {
      setError(t('error_password'));
      return;
    }

    const users = JSON.parse(localStorage.getItem('mdht_users') || '[]');
    
    if (isLogin) {
      const user = users.find((u: any) => u.email === email);
      // In this local MVP, we accept any matching user. In production, password hashing would be used.
      if (user && password === 'password123' || (user && !isLogin)) { 
        localStorage.setItem('mdht_session', JSON.stringify(user));
        onAuth(user);
      } else if (user) {
        // Simple demo logic: if user exists and it's login, we just let them in for MVP 
        // normally we'd check password here.
        localStorage.setItem('mdht_session', JSON.stringify(user));
        onAuth(user);
      } else {
        setError(t('error_credentials'));
      }
    } else {
      if (users.some((u: any) => u.email === email)) {
        setError(t('error_exists'));
      } else {
        const newUser: User = {
          id: crypto.randomUUID(),
          email,
          created_at: new Date().toISOString()
        };
        localStorage.setItem('mdht_users', JSON.stringify([...users, newUser]));
        localStorage.setItem('mdht_session', JSON.stringify(newUser));
        onAuth(newUser);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-900">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-block w-12 h-12 bg-emerald-500 rounded-2xl mb-6 shadow-xl shadow-emerald-500/20 flex items-center justify-center">
             <div className="w-2 h-2 bg-black rounded-full" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">{t('app_title')}</h1>
          <p className="text-neutral-400 text-sm font-medium">{t('build_consistency')}</p>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-3xl p-8 shadow-2xl">
          <div className="flex gap-4 mb-8 p-1 bg-neutral-900 rounded-2xl">
             <button 
               onClick={() => setIsLogin(true)}
               className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-neutral-700 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
             >
               {t('login')}
             </button>
             <button 
               onClick={() => setIsLogin(false)}
               className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-neutral-700 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
             >
               {t('signup')}
             </button>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-xl mb-6 animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 ml-1">{t('email_label')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500 transition-colors"
                placeholder="name@email.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 ml-1">{t('password_label')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-200 shadow-xl transition-all active:scale-[0.97]"
            >
              {isLogin ? t('login') : t('signup')}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-10 text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em]">
          {t('protocol')}
        </p>
      </div>
    </div>
  );
};

export default Auth;
