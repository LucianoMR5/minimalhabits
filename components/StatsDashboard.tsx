
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
  const progressPercent = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <div className="bg-neutral-800/80 border border-neutral-700 rounded-3xl p-7 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">{t('global_consistency')}</h4>
          <span className="bg-neutral-900 px-3 py-1 rounded-full text-[9px] font-black text-neutral-500 uppercase">{t('weekly')}</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-5xl font-black text-white tracking-tighter">{totalConsistency}%</span>
          <div className="flex-1 h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
            <div 
              className="h-full bg-emerald-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
              style={{ width: `${totalConsistency}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-neutral-800/80 border border-neutral-700 rounded-3xl p-7 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">{t('today_progress')}</h4>
          <span className="bg-neutral-900 px-3 py-1 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest">{completedToday}/{habits.length} {t('tasks')}</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-5xl font-black text-white tracking-tighter">{progressPercent}%</span>
          <div className="flex-1 flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className={`h-2 flex-1 rounded-full transition-all duration-500 border border-neutral-800/30 ${
                  i <= habits.length 
                    ? (i <= completedToday ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-neutral-900')
                    : 'bg-neutral-900/20'
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
