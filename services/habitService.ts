
import { Habit, HabitLog, HabitWithStats } from '../types';

const STORAGE_KEYS = {
  HABITS: 'mdht_habits',
  LOGS: 'mdht_logs',
  USERS: 'mdht_users',
  SESSION: 'mdht_session'
};

const getStorage = <T,>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error(`Error reading ${key} from storage`, e);
    return [];
  }
};

const setStorage = <T,>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to storage`, e);
  }
};

const sanitize = (text: string) => text.trim().replace(/[<>]/g, '');

const suggestEmoji = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('water') || lower.includes('agua')) return '💧';
  if (lower.includes('book') || lower.includes('read') || lower.includes('leer')) return '📚';
  if (lower.includes('gym') || lower.includes('workout') || lower.includes('train') || lower.includes('entrenar')) return '🏋️';
  if (lower.includes('meditate') || lower.includes('yoga') || lower.includes('meditar')) return '🧘';
  if (lower.includes('sleep') || lower.includes('dormir')) return '🛌';
  if (lower.includes('code') || lower.includes('program') || lower.includes('estudiar')) return '💻';
  if (lower.includes('eat') || lower.includes('food') || lower.includes('comer')) return '🥗';
  if (lower.includes('walk') || lower.includes('caminar')) return '🚶';
  return '🔥';
};

export const habitService = {
  getHabits: (userId: string): Habit[] => {
    return getStorage<Habit>(STORAGE_KEYS.HABITS).filter(h => h.user_id === userId && h.is_active);
  },

  createHabit: (userId: string, name: string, dailyTarget: number = 1, emoji?: string): Habit => {
    const habits = getStorage<Habit>(STORAGE_KEYS.HABITS);
    const activeCount = habits.filter(h => h.user_id === userId && h.is_active).length;
    
    // Increased limit to 6
    if (activeCount >= 6) {
      throw new Error("Límite alcanzado (máx 6) / Limit reached (max 6)");
    }

    const cleanName = sanitize(name);
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      user_id: userId,
      name: cleanName,
      emoji: emoji?.trim() || suggestEmoji(cleanName),
      daily_target: Math.max(1, dailyTarget),
      created_at: new Date().toISOString(),
      is_active: true
    };

    setStorage(STORAGE_KEYS.HABITS, [...habits, newHabit]);
    return newHabit;
  },

  updateHabitName: (habitId: string, name: string): void => {
    const habits = getStorage<Habit>(STORAGE_KEYS.HABITS);
    const updated = habits.map(h => h.id === habitId ? { ...h, name: sanitize(name) } : h);
    setStorage(STORAGE_KEYS.HABITS, updated);
  },

  deleteHabit: (habitId: string): void => {
    const habits = getStorage<Habit>(STORAGE_KEYS.HABITS);
    const updated = habits.map(h => h.id === habitId ? { ...h, is_active: false } : h);
    setStorage(STORAGE_KEYS.HABITS, updated);
  },

  addLogEntry: (habitId: string, date: string): void => {
    const habits = getStorage<Habit>(STORAGE_KEYS.HABITS);
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const logs = getStorage<HabitLog>(STORAGE_KEYS.LOGS);
    const todayLogsCount = logs.filter(l => l.habit_id === habitId && l.date === date).length;

    if (todayLogsCount < habit.daily_target) {
      const newLog: HabitLog = {
        id: crypto.randomUUID(),
        habit_id: habitId,
        date,
        completed: true
      };
      setStorage(STORAGE_KEYS.LOGS, [...logs, newLog]);
    }
  },

  getHabitWithStats: (habit: Habit): HabitWithStats => {
    const allLogs = getStorage<HabitLog>(STORAGE_KEYS.LOGS).filter(l => l.habit_id === habit.id);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const logsByDate: Record<string, number> = {};
    allLogs.forEach(log => {
      logsByDate[log.date] = (logsByDate[log.date] || 0) + 1;
    });

    const isSuccess = (dateStr: string) => (logsByDate[dateStr] || 0) >= habit.daily_target;

    const todayProgress = logsByDate[todayStr] || 0;
    const isCompletedToday = isSuccess(todayStr);
    
    let streak = 0;
    let currentCheck = new Date(today);
    
    if (!isCompletedToday) {
      currentCheck.setDate(currentCheck.getDate() - 1);
    }

    while (true) {
      const dStr = currentCheck.toISOString().split('T')[0];
      if (isSuccess(dStr)) {
        streak++;
        currentCheck.setDate(currentCheck.getDate() - 1);
      } else {
        break;
      }
    }

    let successfulDays = 0;
    const checkDate = new Date(today);
    for (let i = 0; i < 7; i++) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (isSuccess(dStr)) successfulDays++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return {
      ...habit,
      streak,
      weeklyConsistency: Math.round((successfulDays / 7) * 100),
      isCompletedToday,
      todayProgress
    };
  }
};
