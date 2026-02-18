
import React, { useState } from 'react';
import { HabitWithStats } from '../types';
import { useI18n } from '../hooks/useI18n';

interface HabitCardProps {
  habit: HabitWithStats;
  onIncrement: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onIncrement, onDelete, onRename }) => {
  const { t } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(habit.name);

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onRename(habit.id, newName);
      setIsEditing(false);
    }
  };

  const progressPercent = Math.min(100, (habit.todayProgress / habit.daily_target) * 100);

  return (
    <div className={`bg-neutral-800 border rounded-2xl p-6 transition-all shadow-xl group ${
      habit.isCompletedToday ? 'border-emerald-500/30' : 'border-neutral-700 hover:border-neutral-600'
    }`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 mr-4">
          {isEditing ? (
            <form onSubmit={handleRenameSubmit} className="flex flex-col gap-2">
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-neutral-900 text-white px-3 py-1.5 rounded-md text-lg font-bold outline-none border border-emerald-500 w-full"
              />
              <div className="flex gap-2">
                <button type="submit" className="text-emerald-500 text-xs font-bold uppercase tracking-wider">{t('save')}</button>
                <button type="button" onClick={() => setIsEditing(false)} className="text-neutral-500 text-xs font-bold uppercase tracking-wider">{t('cancel')}</button>
              </div>
            </form>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight leading-tight mb-1">
                {habit.name}
              </h3>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                {habit.daily_target}x {t('daily')}
              </p>
            </div>
          )}
        </div>
        {!isEditing && (
          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setIsEditing(true)}
              className="text-neutral-500 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-black"
            >
              {t('edit')}
            </button>
            <button 
              onClick={() => onDelete(habit.id)}
              className="text-neutral-500 hover:text-red-500 transition-colors text-[10px] uppercase tracking-widest font-black"
            >
              {t('delete')}
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">
          <span>{t('progress')}</span>
          <span className={habit.isCompletedToday ? 'text-emerald-500' : ''}>
            {habit.todayProgress} / {habit.daily_target}
          </span>
        </div>
        <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out ${habit.isCompletedToday ? 'bg-emerald-500' : 'bg-emerald-500/50'}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-neutral-900/40 rounded-lg p-3">
          <p className="text-neutral-500 text-[9px] uppercase tracking-widest font-black mb-1">{t('streak')}</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-black ${habit.streak > 0 ? 'text-emerald-500' : 'text-neutral-500'}`}>
              {habit.streak}
            </span>
            <span className="text-[10px] text-neutral-400 font-bold">{t('days')}</span>
          </div>
        </div>
        <div className="bg-neutral-900/40 rounded-lg p-3">
          <p className="text-neutral-500 text-[9px] uppercase tracking-widest font-black mb-1">{t('consistency_7d')}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-neutral-200">{habit.weeklyConsistency}%</span>
          </div>
        </div>
      </div>

      <button
        disabled={habit.isCompletedToday}
        onClick={() => onIncrement(habit.id)}
        className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] ${
          habit.isCompletedToday 
            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default' 
            : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/10'
        }`}
      >
        {habit.isCompletedToday ? t('completed') : t('complete_habit')}
      </button>
    </div>
  );
};

export default HabitCard;
