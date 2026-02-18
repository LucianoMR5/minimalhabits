
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

export const habitService = {
  getHabits: (userId: string): Habit[] => {
    return getStorage<Habit>(STORAGE_KEYS.HABITS).filter(h => h.user_id === userId && h.is_active);
  },

  createHabit: (userId: string, name: string): Habit => {
    const habits = getStorage<Habit>(STORAGE_KEYS.HABITS);
    const activeCount = habits.filter(h => h.user_id === userId && h.is_active).length;
    
    if (activeCount >= 3) {
      throw new Error("Límite alcanzado / Limit reached");
    }

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      user_id: userId,
      name: sanitize(name),
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

  toggleHabitLog: (habitId: string, date: string): boolean => {
    const logs = getStorage<HabitLog>(STORAGE_KEYS.LOGS);
    const existingIndex = logs.findIndex(l => l.habit_id === habitId && l.date === date);

    if (existingIndex > -1) {
      const updated = [...logs];
      updated.splice(existingIndex, 1);
      setStorage(STORAGE_KEYS.LOGS, updated);
      return false;
    } else {
      const newLog: HabitLog = {
        id: crypto.randomUUID(),
        habit_id: habitId,
        date,
        completed: true
      };
      setStorage(STORAGE_KEYS.LOGS, [...logs, newLog]);
      return true;
    }
  },

  getHabitWithStats: (habit: Habit): HabitWithStats => {
    const logs = getStorage<HabitLog>(STORAGE_KEYS.LOGS).filter(l => l.habit_id === habit.id);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Sorted unique completion dates
    const completionDates = Array.from(new Set(logs.map(l => l.date)))
      .sort((a, b) => b.localeCompare(a));
    
    const isCompletedToday = completionDates.includes(todayStr);
    
    // Calculate Streak
    let streak = 0;
    let currentCheck = new Date(today);
    
    // If not completed today, start checking from yesterday. 
    // If yesterday was also missed, streak is 0.
    if (!isCompletedToday) {
      currentCheck.setDate(currentCheck.getDate() - 1);
    }

    // Iterate backwards day by day
    while (true) {
      const dStr = currentCheck.toISOString().split('T')[0];
      if (completionDates.includes(dStr)) {
        streak++;
        currentCheck.setDate(currentCheck.getDate() - 1);
      } else {
        break;
      }
    }

    // Weekly Consistency (last 7 days including today)
    let completions = 0;
    const checkDate = new Date(today);
    for (let i = 0; i < 7; i++) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (completionDates.includes(dStr)) completions++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return {
      ...habit,
      streak,
      weeklyConsistency: Math.round((completions / 7) * 100),
      isCompletedToday
    };
  }
};
