
import React from 'react';
import { HabitWithStats } from '../types';
import { useI18n } from '../hooks/useI18n';

interface StatsDashboardProps {
  habits: HabitWithStats[];
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ habits }) => {
  const { t } = useI18n();
  const totalConsistency = habits.length > 0 
    ? Math.round(habits.reduce((acc, curr) => acc + curr.weeklyConsistency, 0) / habits.length)
    : 0;
  
  const completedToday = habits.filter(h => h.isCompletedToday).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">{t('global_consistency')}</h4>
          <span className="text-[10px] font-bold text-neutral-500 uppercase">{t('weekly')}</span>
        </div>
        <div className="flex items-end gap-3">
          <span className="text-4xl font-black text-white">{totalConsistency}%</span>
          <div className="h-1.5 w-full bg-neutral-900 rounded-full mb-2 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-1000 ease-out" 
              style={{ width: `${totalConsistency}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">{t('today_progress')}</h4>
          <span className="text-[10px] font-bold text-neutral-500 uppercase">{completedToday}/{habits.length} {t('tasks')}</span>
        </div>
        <div className="flex items-end gap-3">
          <span className="text-4xl font-black text-white">
            {habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0}%
          </span>
          <div className="flex-1 flex gap-1.5 mb-2.5">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i <= habits.length 
                    ? (i <= completedToday ? 'bg-emerald-500' : 'bg-neutral-900')
                    : 'bg-neutral-900/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
