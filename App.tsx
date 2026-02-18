
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

  const handleAddHabit = (name: string, target: number) => {
    if (!authState.user) return;
    try {
      habitService.createHabit(authState.user.id, name, target);
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
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <Auth onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 selection:bg-emerald-500 selection:text-black pb-20">
      <nav className="border-b border-neutral-800 sticky top-0 bg-neutral-900/80 backdrop-blur-xl z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-1 h-1 bg-black rounded-full" />
            </div>
            <span className="text-xs font-black tracking-tighter uppercase">{t('app_title')}</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLang}
              className="text-[10px] font-black text-neutral-400 hover:text-white uppercase tracking-[0.2em] transition-colors border border-neutral-700 px-2 py-1 rounded"
            >
              {lang === 'en' ? 'ES' : 'EN'}
            </button>
            <button 
              onClick={handleLogout}
              className="text-[10px] font-black text-neutral-500 hover:text-emerald-500 uppercase tracking-[0.2em] transition-colors"
            >
              {t('sign_out')}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em]">{t('dashboard')}</span>
            <div className="h-[1px] flex-1 bg-neutral-800" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">{t('daily_three')}</h2>
          <p className="text-neutral-400 text-base font-medium max-w-lg leading-relaxed">
            {t('daily_three_sub')}
          </p>
        </header>

        <StatsDashboard habits={habits} />

        <div className="mb-16">
          <HabitForm onAdd={handleAddHabit} disabled={habits.length >= 5} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="col-span-full bg-neutral-800/30 border-2 border-dashed border-neutral-800 rounded-3xl py-24 flex flex-col items-center justify-center text-center">
                <p className="text-neutral-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4">{t('no_habits')}</p>
                <p className="text-neutral-500 text-sm px-6 font-medium max-w-xs">{t('no_habits_sub')}</p>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-20 border-t border-neutral-800 pt-10 text-center">
          <div className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-4">
            {t('protocol')}
          </div>
          <p className="text-neutral-600 text-[11px] font-semibold max-w-xs mx-auto leading-loose tracking-wider uppercase">
            {t('footer_text')}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
