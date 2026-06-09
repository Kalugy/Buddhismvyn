import { useState } from "react";
import { modules } from "./data/modules";
import { useProgress } from "./hooks/useProgress";
import ModuleCard from "./components/ModuleCard";
import ModuleDetail from "./components/ModuleDetail";
import ChatView from "./components/ChatView";
import { BookOpen, MessageCircle, RotateCcw } from "lucide-react";

export default function App() {
  const [tab, setTab] = useState("learn");
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const { progress, completeLesson, completeModule, isLessonComplete, isModuleComplete, isModuleUnlocked, resetProgress } = useProgress();

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = progress.completedLessons.length;
  const completedModulesCount = progress.completedModules.length;

  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">☸️</span>
            <div>
              <h1 className="font-bold text-stone-900 text-lg leading-none">Dharma Path</h1>
              <p className="text-xs text-stone-400">Buddhist Learning Journey</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="bg-stone-100 px-2 py-1 rounded-full">{completedLessons}/{totalLessons} lessons</span>
            <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{completedModulesCount}/4 modules</span>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-3xl mx-auto px-4 flex">
          <button
            onClick={() => { setTab("learn"); setSelectedModuleId(null); }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "learn" ? "border-amber-600 text-amber-700" : "border-transparent text-stone-500 hover:text-stone-700"}`}
          >
            <BookOpen className="w-4 h-4" />
            Learn
          </button>
          <button
            onClick={() => setTab("chat")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "chat" ? "border-amber-600 text-amber-700" : "border-transparent text-stone-500 hover:text-stone-700"}`}
          >
            <MessageCircle className="w-4 h-4" />
            Ask the Teacher
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {tab === "learn" && !selectedModule && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-stone-900">Your Learning Path</h2>
              <p className="text-stone-500 mt-1">Complete each module to unlock the next. Start with the history of Buddhism and work toward meditation practice.</p>
            </div>

            {/* Progress bar */}
            <div className="bg-white border border-stone-100 rounded-2xl p-5 mb-8 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-700">Overall Progress</span>
                <span className="text-sm text-stone-500">{Math.round((completedLessons / totalLessons) * 100)}%</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-amber-600 to-amber-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
                />
              </div>
              <div className="flex gap-4 mt-3 text-xs text-stone-400">
                <span>{completedLessons} lessons completed</span>
                <span>{completedModulesCount} modules passed</span>
              </div>
            </div>

            <div className="grid gap-4">
              {modules.map((mod) => (
                <ModuleCard
                  key={mod.id}
                  module={mod}
                  isUnlocked={isModuleUnlocked(mod.id)}
                  isComplete={isModuleComplete(mod.id)}
                  onClick={() => setSelectedModuleId(mod.id)}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => { if (confirm("Reset all progress? This cannot be undone.")) resetProgress(); }}
                className="flex items-center gap-2 text-xs text-stone-400 hover:text-stone-600 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset progress
              </button>
            </div>
          </div>
        )}

        {tab === "learn" && selectedModule && (
          <ModuleDetail
            module={selectedModule}
            onBack={() => setSelectedModuleId(null)}
            isLessonComplete={isLessonComplete}
            completeLesson={completeLesson}
            isModuleComplete={isModuleComplete}
            completeModule={completeModule}
          />
        )}

        {tab === "chat" && <ChatView />}
      </main>
    </div>
  );
}
