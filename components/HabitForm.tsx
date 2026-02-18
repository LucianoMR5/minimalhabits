
import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';

interface HabitFormProps {
  onAdd: (name: string, target: number) => void;
  disabled: boolean;
}

const HabitForm: React.FC<HabitFormProps> = ({ onAdd, disabled }) => {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [target, setTarget] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !disabled) {
      onAdd(name.trim(), target);
      setName('');
      setTarget(1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-10 bg-neutral-800/50 p-6 rounded-3xl border border-neutral-800">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            disabled={disabled}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={disabled ? t('limit_reached') : t('new_habit_placeholder')}
            className={`w-full bg-neutral-900 border border-neutral-700 rounded-2xl px-6 py-5 text-white placeholder-neutral-500 outline-none transition-all ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'focus:border-emerald-500 shadow-inner'
            }`}
          />
        </div>
        
        {!disabled && (
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">{t('daily_target_label')}</label>
              <select 
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value))}
                className="bg-neutral-900 border border-neutral-700 text-white rounded-xl px-4 py-4 outline-none focus:border-emerald-500 min-w-[100px]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              disabled={!name.trim()}
              className={`mt-auto h-[60px] px-8 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${
                name.trim() ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
              }`}
            >
              {t('add')}
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default HabitForm;
