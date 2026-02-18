
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t('error_fields'));
      return;
    }

    const users = JSON.parse(localStorage.getItem('mdht_users') || '[]');
    
    if (isLogin) {
      const user = users.find((u: any) => u.email === email);
      if (user && (password === 'password123' || password.length > 0)) { 
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
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">{t('app_title')}</h1>
          <p className="text-neutral-400 text-sm font-medium">{t('app_subtitle')}</p>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold mb-6 text-white">{isLogin ? t('login') : t('signup')}</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 ml-1">{t('email_label')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors"
                placeholder="name@email.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 ml-1">{t('password_label')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition-all active:scale-[0.98]"
            >
              {isLogin ? t('login') : t('signup')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-neutral-500 text-xs hover:text-white transition-colors underline underline-offset-4"
            >
              {isLogin ? t('no_account') : t('has_account')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
