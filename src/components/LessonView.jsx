import { useState } from "react";
import { ArrowLeft, CheckCircle, BookOpen } from "lucide-react";

function formatContent(text) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <h4 key={i} className="font-bold text-stone-800 text-lg mt-5 mb-2">{line.slice(2, -2)}</h4>;
    }
    // inline bold
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const formatted = parts.map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j} className="font-semibold text-stone-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    if (line.startsWith("- ")) {
      return <li key={i} className="ml-4 text-stone-600 leading-relaxed list-disc">{formatted.map((p, j) => typeof p === "string" ? p.slice(j === 0 ? 2 : 0) : p)}</li>;
    }
    if (line.trim() === "") return <div key={i} className="h-2" />;
    return <p key={i} className="text-stone-600 leading-relaxed">{formatted}</p>;
  });
}

export default function LessonView({ module, lesson, isComplete, onComplete, onBack }) {
  const [done, setDone] = useState(isComplete);

  const handleComplete = () => {
    setDone(true);
    onComplete(lesson.id);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-stone-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to module
      </button>

      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-gradient-to-r ${module.color} text-white`}>
        <BookOpen className="w-3.5 h-3.5" />
        {module.title}
      </div>

      <h1 className="text-3xl font-bold text-stone-900 mb-8">{lesson.title}</h1>

      <div className="prose space-y-1 mb-10">
        {formatContent(lesson.content)}
      </div>

      {done ? (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 text-green-800">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="font-medium">Lesson completed!</span>
        </div>
      ) : (
        <button
          onClick={handleComplete}
          className={`w-full bg-gradient-to-r ${module.color} text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity`}
        >
          Mark as Complete
        </button>
      )}
    </div>
  );
}
