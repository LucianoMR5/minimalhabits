
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

  createHabit: (userId: string, name: string, dailyTarget: number = 1): Habit => {
    const habits = getStorage<Habit>(STORAGE_KEYS.HABITS);
    const activeCount = habits.filter(h => h.user_id === userId && h.is_active).length;
    
    if (activeCount >= 5) {
      throw new Error("Límite alcanzado (máx 5) / Limit reached (max 5)");
    }

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      user_id: userId,
      name: sanitize(name),
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

    // Only allow logs if target not yet exceeded significantly
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

  removeLastLogEntry: (habitId: string, date: string): void => {
    const logs = getStorage<HabitLog>(STORAGE_KEYS.LOGS);
    const index = [...logs].reverse().findIndex(l => l.habit_id === habitId && l.date === date);
    if (index > -1) {
      const actualIndex = logs.length - 1 - index;
      const updated = [...logs];
      updated.splice(actualIndex, 1);
      setStorage(STORAGE_KEYS.LOGS, updated);
    }
  },

  getHabitWithStats: (habit: Habit): HabitWithStats => {
    const allLogs = getStorage<HabitLog>(STORAGE_KEYS.LOGS).filter(l => l.habit_id === habit.id);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Group logs by date
    const logsByDate: Record<string, number> = {};
    allLogs.forEach(log => {
      logsByDate[log.date] = (logsByDate[log.date] || 0) + 1;
    });

    // Check if a day is "successful" (met daily target)
    const isSuccess = (dateStr: string) => (logsByDate[dateStr] || 0) >= habit.daily_target;

    const todayProgress = logsByDate[todayStr] || 0;
    const isCompletedToday = isSuccess(todayStr);
    
    // Calculate Streak
    let streak = 0;
    let currentCheck = new Date(today);
    
    // If target not met today, start checking from yesterday.
    // However, if today target is ALREADY met, streak includes today.
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

    // Weekly Consistency (last 7 days including today)
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
