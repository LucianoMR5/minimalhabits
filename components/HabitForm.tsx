
import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';

interface HabitFormProps {
  onAdd: (name: string) => void;
  disabled: boolean;
}

const HabitForm: React.FC<HabitFormProps> = ({ onAdd, disabled }) => {
  const { t } = useI18n();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !disabled) {
      onAdd(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-10">
      <div className="relative group">
        <input
          disabled={disabled}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={disabled ? t('limit_reached') : t('new_habit_placeholder')}
          className={`w-full bg-neutral-800 border border-neutral-700 rounded-2xl px-6 py-5 text-white placeholder-neutral-500 outline-none transition-all ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'focus:border-neutral-500 focus:bg-neutral-800/80 shadow-inner'
          }`}
        />
        {!disabled && name.trim() && (
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-black px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-neutral-200 transition-all active:scale-95"
          >
            {t('add')}
          </button>
        )}
      </div>
    </form>
  );
};

export default HabitForm;
