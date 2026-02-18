
import React, { useState, useEffect } from 'react';
import { HabitWithStats } from '../types';
import { useI18n } from '../hooks/useI18n';

interface HabitCardProps {
  habit: HabitWithStats;
  onIncrement: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onIncrement, onDelete, onRename }) => {
  const { t, getRandomMotivation } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(habit.name);
  const [showMotivation, setShowMotivation] = useState(false);
  const [motivationMsg, setMotivationMsg] = useState('');

  useEffect(() => {
    if (habit.isCompletedToday && !showMotivation) {
      setMotivationMsg(getRandomMotivation());
      setShowMotivation(true);
    } else if (!habit.isCompletedToday) {
      setShowMotivation(false);
    }
  }, [habit.isCompletedToday]);

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onRename(habit.id, newName);
      setIsEditing(false);
    }
  };

  const progressPercent = Math.min(100, (habit.todayProgress / habit.daily_target) * 100);

  return (
    <div className={`relative bg-neutral-800 border rounded-3xl p-6 transition-all duration-300 shadow-xl group overflow-hidden ${
      habit.isCompletedToday ? 'border-emerald-500/40 shadow-emerald-500/5' : 'border-neutral-700 hover:border-neutral-600'
    }`}>
      {/* Background completed glow */}
      {habit.isCompletedToday && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      )}

      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-4 items-start flex-1 mr-2">
          <div className={`text-4xl transition-transform duration-300 ${habit.isCompletedToday ? 'scale-110' : 'group-hover:rotate-12'}`}>
            {habit.emoji}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <form onSubmit={handleRenameSubmit} className="flex flex-col gap-2">
                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-neutral-900 text-white px-3 py-1 rounded-lg text-lg font-bold outline-none border border-emerald-500 w-full"
                />
                <div className="flex gap-2">
                  <button type="submit" className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">{t('save')}</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="text-neutral-500 text-[9px] font-black uppercase tracking-widest">{t('cancel')}</button>
                </div>
              </form>
            ) : (
              <div>
                <h3 className="text-xl font-black text-white tracking-tight leading-tight mb-0.5 truncate max-w-[160px]">
                  {habit.name}
                </h3>
                <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">
                  {habit.daily_target}x {t('daily')}
                </p>
              </div>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-neutral-700 rounded-lg text-neutral-500 hover:text-white transition-all"
              title={t('edit')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              onClick={() => onDelete(habit.id)}
              className="p-2 hover:bg-neutral-700 rounded-lg text-neutral-500 hover:text-red-500 transition-all"
              title={t('delete')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2 px-1">
          <span>{t('progress')}</span>
          <span className={habit.isCompletedToday ? 'text-emerald-400' : 'text-neutral-400'}>
            {habit.todayProgress} / {habit.daily_target}
          </span>
        </div>
        <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
          <div 
            className={`h-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              habit.isCompletedToday ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-emerald-500/60'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-neutral-900/60 rounded-2xl p-4 border border-neutral-800 transition-transform group-hover:scale-[1.02]">
          <p className="text-neutral-500 text-[8px] uppercase tracking-widest font-black mb-1">{t('streak')}</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-black ${habit.streak > 0 ? 'text-emerald-500' : 'text-neutral-400'}`}>
              {habit.streak}
            </span>
            <span className="text-[9px] text-neutral-600 font-bold tracking-tighter uppercase">{t('days')}</span>
          </div>
        </div>
        <div className="bg-neutral-900/60 rounded-2xl p-4 border border-neutral-800 transition-transform group-hover:scale-[1.02]">
          <p className="text-neutral-500 text-[8px] uppercase tracking-widest font-black mb-1">{t('consistency_7d')}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-neutral-200">{habit.weeklyConsistency}%</span>
          </div>
        </div>
      </div>

      <div className="min-h-[24px] mb-3 text-center">
        {showMotivation && (
          <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest animate-bounce">
            {motivationMsg}
          </p>
        )}
      </div>

      <button
        disabled={habit.isCompletedToday}
        onClick={() => onIncrement(habit.id)}
        className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-200 active:scale-[0.96] flex items-center justify-center gap-2 ${
          habit.isCompletedToday 
            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default' 
            : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-xl shadow-emerald-500/10'
        }`}
      >
        {habit.isCompletedToday ? (
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
           </svg>
        ) : null}
        {habit.isCompletedToday ? t('completed') : t('complete_habit')}
      </button>
    </div>
  );
};

export default HabitCard;
