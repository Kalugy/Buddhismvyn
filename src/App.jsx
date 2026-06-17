import { useState } from "react";
import { modules } from "./data/modules";
import { useProgress } from "./hooks/useProgress";
import ModuleCard from "./components/ModuleCard";
import ModuleDetail from "./components/ModuleDetail";
import FinalQuiz from "./components/FinalQuiz";
import ChatView from "./components/ChatView";
import FlashCards from "./components/FlashCards";
import MindMap from "./components/MindMap";
import Insights from "./components/Insights";
import { BookOpen, RotateCcw, Trophy, Layers, Network, TrendingUp } from "lucide-react";

export default function App() {
  const [tab, setTab] = useState("learn");
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [showFinalQuiz, setShowFinalQuiz] = useState(false);
  const { progress, completeLesson, completeModule, isLessonComplete, isModuleComplete, resetProgress } = useProgress();

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = progress.completedLessons.length;
  const completedModulesCount = progress.completedModules.length;
  const finalQuizPassed = progress.completedModules.includes("final");

  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  const handleFinalQuizComplete = (score) => completeModule("final", score);

  if (showFinalQuiz) {
    return (
      <div className="min-h-screen bg-stone-50">
        <header className="bg-white border-b border-stone-100 sticky top-0 z-10 shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">☸️</span>
            <div>
              <h1 className="font-bold text-stone-900 text-lg leading-none">Dharma Path</h1>
              <p className="text-xs text-stone-400">Final Course Quiz</p>
            </div>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-8">
          <FinalQuiz
            onBack={() => setShowFinalQuiz(false)}
            onComplete={handleFinalQuizComplete}
            alreadyPassed={finalQuizPassed}
            savedScore={progress.finalQuizScore}
          />
        </main>
      </div>
    );
  }

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
            {finalQuizPassed && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">🏆 Certified</span>}
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
            onClick={() => setTab("cards")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "cards" ? "border-amber-600 text-amber-700" : "border-transparent text-stone-500 hover:text-stone-700"}`}
          >
            <Layers className="w-4 h-4" />
            Memory Cards
          </button>
          <button
            onClick={() => setTab("map")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "map" ? "border-amber-600 text-amber-700" : "border-transparent text-stone-500 hover:text-stone-700"}`}
          >
            <Network className="w-4 h-4" />
            Mind Map
          </button>
          <button
            onClick={() => setTab("insights")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === "insights" ? "border-amber-600 text-amber-700" : "border-transparent text-stone-500 hover:text-stone-700"}`}
          >
            <TrendingUp className="w-4 h-4" />
            Insights
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {tab === "learn" && !selectedModule && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-stone-900">Your Learning Path</h2>
              <p className="text-stone-500 mt-1">Explore all modules freely — learn history, teachings, practice, and meditation at your own pace.</p>
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
              <div className="mt-3 text-xs text-stone-400">
                {completedLessons} of {totalLessons} lessons completed
              </div>
            </div>

            {/* Module cards */}
            <div className="grid gap-4 mb-6">
              {modules.map((mod) => (
                <ModuleCard
                  key={mod.id}
                  module={mod}
                  isComplete={isModuleComplete(mod.id)}
                  onClick={() => setSelectedModuleId(mod.id)}
                />
              ))}
            </div>

            {/* Final Quiz card */}
            <div
              onClick={() => setShowFinalQuiz(true)}
              className="cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] hover:shadow-2xl transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-stone-800 to-stone-600 p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/60">Final</span>
                    {finalQuizPassed && (
                      <span className="bg-yellow-400/20 text-yellow-300 text-xs px-2 py-0.5 rounded-full font-medium">Passed ✓</span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white">Course Quiz</h3>
                  <p className="text-white/70 text-sm mt-1">10 questions across all 4 modules — test your full knowledge of the Dharma</p>
                </div>
                <div className="ml-6 flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                    <Trophy className={`w-7 h-7 ${finalQuizPassed ? "text-yellow-400" : "text-white/70"}`} />
                  </div>
                </div>
              </div>
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
          />
        )}

        {tab === "cards" && <FlashCards />}
        {tab === "map" && <MindMap />}
        {tab === "insights" && (
          <Insights
            progress={progress}
            onGoToModule={(moduleId) => { setTab("learn"); setSelectedModuleId(moduleId); }}
          />
        )}
      </main>
    </div>
  );
}
