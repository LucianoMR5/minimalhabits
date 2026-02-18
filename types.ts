
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  emoji: string; // Added for visual identity
  daily_target: number;
  created_at: string;
  is_active: boolean;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface HabitWithStats extends Habit {
  streak: number;
  weeklyConsistency: number; // 0 to 100
  isCompletedToday: boolean;
  todayProgress: number; // Current count for today
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};
