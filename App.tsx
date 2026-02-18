
import React, { useState, useEffect, useCallback } from 'react';
import { AuthState, HabitWithStats, User } from './types';
import { habitService } from './services/habitService';
import { useI18n } from './hooks/useI18n';
import Auth from './components/Auth';
import HabitCard from './components/HabitCard';
import HabitForm from './components/HabitForm';
import StatsDashboard from './components/StatsDashboard';

const App: React.FC = () => {
  const { t, lang, toggleLang } = useI18n();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  const [habits, setHabits] = useState<HabitWithStats[]>([]);

  useEffect(() => {
    const session = localStorage.getItem('mdht_session');
    if (session) {
      try {
        const user = JSON.parse(session);
        setAuthState({ user, isAuthenticated: true, isLoading: false });
      } catch (e) {
        localStorage.removeItem('mdht_session');
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const refreshHabits = useCallback(() => {
    if (authState.user) {
      const rawHabits = habitService.getHabits(authState.user.id);
      const habitsWithStats = rawHabits.map(h => habitService.getHabitWithStats(h));
      setHabits(habitsWithStats);
    }
  }, [authState.user]);

  useEffect(() => {
    refreshHabits();
  }, [refreshHabits, lang]);

  const handleAuth = (user: User) => {
    setAuthState({ user, isAuthenticated: true, isLoading: false });
  };

  const handleLogout = () => {
    localStorage.removeItem('mdht_session');
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  };

  const handleAddHabit = (name: string, target: number, emoji: string) => {
    if (!authState.user) return;
    try {
      habitService.createHabit(authState.user.id, name, target, emoji);
      refreshHabits();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleIncrementHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    habitService.addLogEntry(habitId, today);
    refreshHabits();
  };

  const handleDeleteHabit = (habitId: string) => {
    if (window.confirm(t('archive_confirm'))) {
      habitService.deleteHabit(habitId);
      refreshHabits();
    }
  };

  const handleRenameHabit = (habitId: string, name: string) => {
    habitService.updateHabitName(habitId, name);
    refreshHabits();
  };

  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <div className="w-10 h-10 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin shadow-emerald-500/20 shadow-xl"></div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <Auth onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 selection:bg-emerald-500 selection:text-black pb-24 overflow-x-hidden">
      {/* Navbar */}
      <nav className="border-b border-neutral-800 sticky top-0 bg-neutral-900/80 backdrop-blur-2xl z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 rotate-12 transition-transform hover:rotate-0 duration-300">
              <div className="w-1.5 h-1.5 bg-black rounded-full" />
            </div>
            <span className="text-sm font-black tracking-tighter uppercase text-white">{t('app_title')}</span>
          </div>
          <div className="flex items-center gap-5">
            <button 
              onClick={toggleLang}
              className="text-[10px] font-black text-neutral-400 hover:text-white uppercase tracking-widest transition-colors border-2 border-neutral-800 px-3 py-1.5 rounded-xl hover:border-neutral-700"
            >
              {lang === 'en' ? 'ES' : 'EN'}
            </button>
            <button 
              onClick={handleLogout}
              className="text-[10px] font-black text-neutral-500 hover:text-emerald-400 uppercase tracking-widest transition-all"
            >
              {t('sign_out')}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-14">
          <div className="flex items-center gap-4 mb-5">
            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">{t('dashboard')}</span>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-neutral-800 to-transparent" />
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-5 leading-none">
            {t('daily_habits')}
          </h2>
          <p className="text-neutral-400 text-lg font-medium max-w-xl leading-relaxed">
            {t('daily_habits_sub')}
          </p>
        </header>

        <StatsDashboard habits={habits} />

        <div className="mb-20">
          <HabitForm onAdd={handleAddHabit} disabled={habits.length >= 6} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {habits.map(habit => (
              <HabitCard 
                key={habit.id} 
                habit={habit} 
                onIncrement={handleIncrementHabit} 
                onDelete={handleDeleteHabit}
                onRename={handleRenameHabit}
              />
            ))}
            {habits.length === 0 && (
              <div className="col-span-full bg-neutral-800/20 border-2 border-dashed border-neutral-800/60 rounded-[40px] py-32 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                <div className="text-6xl mb-6 animate-pulse">🌱</div>
                <p className="text-neutral-300 font-black uppercase tracking-[0.4em] text-xs mb-4">{t('no_habits')}</p>
                <p className="text-neutral-500 text-base px-8 font-medium max-w-sm">{t('no_habits_sub')}</p>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-32 border-t border-neutral-800 pt-12 text-center">
          <div className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.5em] mb-6">
            {t('protocol')}
          </div>
          <p className="text-neutral-600 text-[11px] font-bold max-w-xs mx-auto leading-relaxed tracking-wider uppercase">
            {t('footer_text')}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
