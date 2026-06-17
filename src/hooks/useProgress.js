import { useState, useEffect } from "react";

const STORAGE_KEY = "buddhism_app_progress";

const defaultProgress = {
  completedLessons: [],
  completedModules: [],
  unlockedModules: [1, 2, 3, 4],
  finalQuizScore: null,
  lessonCompletedAt: {},   // { [lessonId]: ISO timestamp }
  moduleQuizScores: {},    // { [moduleId]: { score, total } }
};

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultProgress;
    } catch {
      return defaultProgress;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completeLesson = (lessonId) => {
    setProgress((prev) => ({
      ...prev,
      completedLessons: prev.completedLessons.includes(lessonId)
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId],
      lessonCompletedAt: prev.lessonCompletedAt?.[lessonId]
        ? prev.lessonCompletedAt
        : { ...(prev.lessonCompletedAt || {}), [lessonId]: new Date().toISOString() },
    }));
  };

  const completeModule = (moduleId, score = null) => {
    setProgress((prev) => ({
      ...prev,
      completedModules: prev.completedModules.includes(moduleId)
        ? prev.completedModules
        : [...prev.completedModules, moduleId],
      ...(score !== null ? { finalQuizScore: score } : {}),
    }));
  };

  const isLessonComplete = (lessonId) => progress.completedLessons.includes(lessonId);
  const isModuleComplete = (moduleId) => progress.completedModules.includes(moduleId);
  const isModuleUnlocked = (moduleId) => progress.unlockedModules.includes(moduleId);

  const resetProgress = () => setProgress(defaultProgress);

  return { progress, completeLesson, completeModule, isLessonComplete, isModuleComplete, isModuleUnlocked, resetProgress };
}
