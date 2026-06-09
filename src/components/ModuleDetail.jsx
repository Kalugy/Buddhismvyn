import { useState } from "react";
import { ArrowLeft, BookOpen, HelpCircle, CheckCircle } from "lucide-react";
import LessonView from "./LessonView";
import QuizView from "./QuizView";

export default function ModuleDetail({
  module,
  onBack,
  isLessonComplete,
  completeLesson,
  isModuleComplete,
  completeModule,
}) {
  const [view, setView] = useState(null);

  const allLessonsDone = module.lessons.every((l) => isLessonComplete(l.id));

  if (view?.type === "lesson") {
    const lesson = module.lessons.find((l) => l.id === view.lessonId);
    return (
      <LessonView
        module={module}
        lesson={lesson}
        isComplete={isLessonComplete(lesson.id)}
        onComplete={completeLesson}
        onBack={() => setView(null)}
      />
    );
  }

  if (view?.type === "quiz") {
    return (
      <QuizView
        module={module}
        onComplete={completeModule}
        onBack={() => setView(null)}
        alreadyPassed={isModuleComplete(module.id)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-stone-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        All Modules
      </button>

      <div className={`bg-gradient-to-br ${module.color} rounded-2xl p-6 mb-8`}>
        <div className="flex items-start gap-4">
          <span className="text-5xl">{module.icon}</span>
          <div>
            <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">Module {module.id}</p>
            <h2 className="text-3xl font-bold text-white">{module.title}</h2>
            <p className="text-white/80 mt-1">{module.description}</p>
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-stone-500 uppercase tracking-widest text-xs mb-4">Lessons</h3>
      <div className="space-y-3 mb-8">
        {module.lessons.map((lesson, idx) => {
          const done = isLessonComplete(lesson.id);
          return (
            <button
              key={lesson.id}
              onClick={() => setView({ type: "lesson", lessonId: lesson.id })}
              className="w-full bg-white border border-stone-100 rounded-xl p-4 flex items-center gap-4 hover:border-stone-300 hover:shadow-sm transition-all text-left"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-green-100" : "bg-stone-100"}`}>
                {done ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <BookOpen className="w-4 h-4 text-stone-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-stone-800">{lesson.title}</p>
                <p className="text-xs text-stone-400 mt-0.5">Lesson {idx + 1}</p>
              </div>
              {done && <span className="text-xs text-green-600 font-medium">Done</span>}
            </button>
          );
        })}
      </div>

      <h3 className="font-semibold text-stone-500 uppercase tracking-widest text-xs mb-4">Quiz</h3>
      <button
        onClick={() => allLessonsDone || isModuleComplete(module.id) ? setView({ type: "quiz" }) : null}
        disabled={!allLessonsDone && !isModuleComplete(module.id)}
        className={`w-full border rounded-xl p-4 flex items-center gap-4 transition-all text-left ${
          allLessonsDone || isModuleComplete(module.id)
            ? "bg-white border-stone-100 hover:border-stone-300 hover:shadow-sm cursor-pointer"
            : "bg-stone-50 border-stone-100 opacity-50 cursor-not-allowed"
        }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isModuleComplete(module.id) ? "bg-green-100" : "bg-stone-100"}`}>
          {isModuleComplete(module.id) ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <HelpCircle className="w-4 h-4 text-stone-400" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-medium text-stone-800">Module Quiz</p>
          <p className="text-xs text-stone-400 mt-0.5">
            {allLessonsDone || isModuleComplete(module.id)
              ? `${module.quiz.length} questions`
              : "Complete all lessons to unlock"}
          </p>
        </div>
        {isModuleComplete(module.id) && <span className="text-xs text-green-600 font-medium">Passed</span>}
      </button>
    </div>
  );
}
