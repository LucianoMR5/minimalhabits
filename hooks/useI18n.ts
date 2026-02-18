
import { useState } from 'react';

const translations: Record<string, Record<string, string>> = {
  en: {
    "app_title": "DISCIPLINE",
    "app_subtitle": "High-focus habit tracking.",
    "protocol": "Minimal Discipline Protocol",
    "footer_text": "Execution over administration. Focus is a finite resource.",
    "dashboard": "Dashboard",
    "daily_three": "Your Daily Habits.",
    "daily_three_sub": "Track up to 5 habits to ensure extreme consistency.",
    "no_habits": "No active habits",
    "no_habits_sub": "Success starts with one small daily action. Add your first habit.",
    "global_consistency": "Global Consistency",
    "today_progress": "Today's Progress",
    "weekly": "Weekly",
    "tasks": "Tasks",
    "streak": "Current Streak",
    "days": "days",
    "consistency_7d": "Consistency (7d)",
    "complete_habit": "Complete step",
    "completed": "Daily goal met",
    "edit": "Edit",
    "delete": "Delete",
    "save": "Save",
    "cancel": "Cancel",
    "new_habit_placeholder": "New habit (e.g. Water, Workout...)",
    "daily_target_label": "Times per day",
    "limit_reached": "Focus limit reached (5 active max)",
    "add": "Add",
    "sign_out": "Sign Out",
    "login": "Log In",
    "signup": "Create Account",
    "email_label": "Email Address",
    "password_label": "Password",
    "no_account": "Don't have an account? Sign up",
    "has_account": "Already have an account? Log in",
    "error_fields": "Please fill in all fields",
    "error_credentials": "Invalid credentials",
    "error_exists": "User already exists",
    "error_password": "Password must be at least 6 characters",
    "error_email": "Enter a valid email",
    "archive_confirm": "Archive this habit? Your data will be hidden but kept.",
    "build_consistency": "Build Consistency. Kill Distraction."
  },
  es: {
    "app_title": "DISCIPLINA",
    "app_subtitle": "Seguimiento de hábitos de alto enfoque.",
    "protocol": "Protocolo de Disciplina Minimalista",
    "footer_text": "Ejecución sobre administración. El enfoque es un recurso finito.",
    "dashboard": "Panel",
    "daily_three": "Tus Hábitos Diarios.",
    "daily_three_sub": "Sigue hasta 5 hábitos activos para asegurar una consistencia extrema.",
    "no_habits": "Sin hábitos activos",
    "no_habits_sub": "El éxito comienza con una pequeña acción diaria. Añade tu primer hábito.",
    "global_consistency": "Consistencia Global",
    "today_progress": "Progreso de Hoy",
    "weekly": "Semanal",
    "tasks": "Tareas",
    "streak": "Racha Actual",
    "days": "días",
    "consistency_7d": "Consistencia (7d)",
    "complete_habit": "Completar paso",
    "completed": "Objetivo cumplido",
    "edit": "Editar",
    "delete": "Eliminar",
    "save": "Guardar",
    "cancel": "Cancelar",
    "new_habit_placeholder": "Nuevo hábito (ej. Tomar agua, Gym...)",
    "daily_target_label": "Veces al día",
    "limit_reached": "Límite alcanzado (máx 5 activos)",
    "add": "Añadir",
    "sign_out": "Cerrar Sesión",
    "login": "Iniciar Sesión",
    "signup": "Crear Cuenta",
    "email_label": "Correo Electrónico",
    "password_label": "Contraseña",
    "no_account": "¿No tienes cuenta? Regístrate",
    "has_account": "¿Ya tienes cuenta? Inicia sesión",
    "error_fields": "Por favor completa todos los campos",
    "error_credentials": "Credenciales inválidas",
    "error_exists": "El usuario ya existe",
    "error_password": "La contraseña debe tener al menos 6 caracteres",
    "error_email": "Ingresa un email válido",
    "archive_confirm": "¿Archivar este hábito? Tus datos se ocultarán pero se mantendrán.",
    "build_consistency": "Construye Consistencia. Mata la Distracción."
  }
};

export const useI18n = () => {
  const [lang, setLang] = useState<string>(() => {
    const saved = localStorage.getItem('mdht_lang');
    return (saved === 'en' || saved === 'es') ? saved : 'en';
  });

  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'es' : 'en';
    setLang(newLang);
    localStorage.setItem('mdht_lang', newLang);
  };

  return { t, lang, toggleLang };
};
