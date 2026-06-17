import { useMemo } from "react";
import { Target, Clock, Zap, BarChart2, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { modules } from "../data/modules";

// ── Spaced-repetition urgency ─────────────────────────────────────────────────
function getUrgency(iso) {
  if (!iso) return null;
  const days = (Date.now() - new Date(iso)) / 86400000;
  if (days < 1)   return null;                             // too fresh
  if (days < 3)   return { label: "Soon",    days, color: "amber",  icon: "🟡" };
  if (days < 10)  return { label: "Due",     days, color: "orange", icon: "🟠" };
  return                 { label: "Overdue", days, color: "red",    icon: "🔴" };
}

// ── Rotating daily wisdom ─────────────────────────────────────────────────────
const WISDOM = [
  { quote: "Peace comes from within. Do not seek it without.", attr: "The Buddha" },
  { quote: "Three things cannot be long hidden: the sun, the moon, and the truth.", attr: "The Buddha" },
  { quote: "If you light a lamp for someone else, it will also brighten your path.", attr: "Buddhist Proverb" },
  { quote: "Better than a thousand hollow words is one word that brings peace.", attr: "The Dhammapada" },
  { quote: "Every morning we are born again. What we do today is what matters most.", attr: "Buddhist Teaching" },
  { quote: "Drop by drop is the water pot filled. Likewise, the wise man fills himself with good little by little.", attr: "The Dhammapada" },
  { quote: "You will not be punished for your anger — you will be punished by your anger.", attr: "The Buddha" },
  { quote: "The mind is everything. What you think, you become.", attr: "The Buddha" },
  { quote: "Thousands of candles can be lit from a single candle. Happiness never decreases by being shared.", attr: "The Buddha" },
  { quote: "It is in the nature of things that joy arises in a person free from remorse.", attr: "The Dhammapada" },
  { quote: "Hatred does not cease through hatred. Only through love does hatred cease.", attr: "The Dhammapada" },
  { quote: "To conquer oneself is a greater victory than to conquer others.", attr: "The Buddha" },
];

const MODULE_LABELS = {
  1: "History & Schools",
  2: "Core Teachings",
  3: "Buddhist Practice",
  4: "Meditation",
};

const STRENGTH_COLORS = [
  { min: 0,    max: 0,    label: "Not started", bar: "bg-stone-200",   text: "text-stone-400",  tag: "bg-stone-100 text-stone-500" },
  { min: 0.01, max: 0.49, label: "Weak",        bar: "bg-red-400",     text: "text-red-600",    tag: "bg-red-50 text-red-600"      },
  { min: 0.5,  max: 0.99, label: "Getting there",bar:"bg-amber-400",   text: "text-amber-700",  tag: "bg-amber-50 text-amber-700"  },
  { min: 1,    max: 1,    label: "Strong",       bar: "bg-green-500",   text: "text-green-700",  tag: "bg-green-50 text-green-700"  },
];

function strengthLevel(pct) {
  return STRENGTH_COLORS.find(s => pct >= s.min && pct <= s.max) || STRENGTH_COLORS[0];
}

// ── Sub-cards ─────────────────────────────────────────────────────────────────

function Card({ icon: Icon, accent, title, children }) {
  const accentMap = {
    red:    "text-red-500",
    amber:  "text-amber-500",
    green:  "text-green-500",
    blue:   "text-blue-500",
    purple: "text-purple-500",
    orange: "text-orange-500",
  };
  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-4 h-4 ${accentMap[accent] || "text-stone-500"}`} />
        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Insights({ progress, onGoToModule }) {
  const {
    completedLessons = [],
    completedModules = [],
    lessonCompletedAt = {},
    finalQuizScore = null,
  } = progress;

  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);

  // Per-module stats
  const moduleStats = useMemo(() =>
    modules.map(mod => {
      const done  = mod.lessons.filter(l => completedLessons.includes(l.id)).length;
      const total = mod.lessons.length;
      const pct   = total > 0 ? done / total : 0;
      return { mod, done, total, pct, level: strengthLevel(pct) };
    }),
  [completedLessons]);

  // Next action
  const nextAction = useMemo(() => {
    for (const { mod, pct } of moduleStats) {
      if (pct < 1) {
        const lesson = mod.lessons.find(l => !completedLessons.includes(l.id));
        if (lesson) return { mod, lesson };
      }
    }
    return null; // all done
  }, [moduleStats, completedLessons]);

  // Spaced-repetition review queue
  const reviewQueue = useMemo(() => {
    return completedLessons
      .map(id => {
        const urgency = getUrgency(lessonCompletedAt[id]);
        if (!urgency) return null;
        for (const mod of modules) {
          const lesson = mod.lessons.find(l => l.id === id);
          if (lesson) return { id, lesson, mod, urgency };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => b.urgency.days - a.urgency.days)
      .slice(0, 4);
  }, [completedLessons, lessonCompletedAt]);

  // Daily wisdom
  const wisdom = WISDOM[Math.floor(Date.now() / 86400000) % WISDOM.length];

  const completedModuleCount = completedModules.filter(id => id !== "final").length;
  const hasProgress = completedLessons.length > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900">Insights</h2>
        <p className="text-stone-500 text-sm mt-0.5">Actionable intelligence — what to study, what to review</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-stone-100 rounded-xl p-4 shadow-sm text-center">
          <p className="text-3xl font-bold text-amber-600">{completedLessons.length}</p>
          <p className="text-xs text-stone-400 mt-1">of {totalLessons} lessons</p>
          <p className="text-xs font-medium text-stone-600 mt-0.5">Completed</p>
        </div>
        <div className="bg-white border border-stone-100 rounded-xl p-4 shadow-sm text-center">
          <p className="text-3xl font-bold text-green-600">{completedModuleCount}</p>
          <p className="text-xs text-stone-400 mt-1">of {modules.length} modules</p>
          <p className="text-xs font-medium text-stone-600 mt-0.5">Mastered</p>
        </div>
        <div className="bg-white border border-stone-100 rounded-xl p-4 shadow-sm text-center">
          <p className="text-3xl font-bold text-purple-600">
            {finalQuizScore !== null ? `${finalQuizScore}/10` : "—"}
          </p>
          <p className="text-xs text-stone-400 mt-1">
            {finalQuizScore !== null ? (finalQuizScore >= 7 ? "Excellent" : "Keep studying") : "not taken"}
          </p>
          <p className="text-xs font-medium text-stone-600 mt-0.5">Final Quiz</p>
        </div>
      </div>

      {/* Strength Map + Next Action side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 🔴 Strength Map */}
        <Card icon={BarChart2} accent="red" title="Weak vs Strong">
          {hasProgress ? (
            <div className="space-y-3">
              {moduleStats.map(({ mod, done, total, pct, level }) => (
                <div key={mod.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-stone-700 flex items-center gap-1.5">
                      <span>{mod.icon}</span>
                      {MODULE_LABELS[mod.id] || mod.title}
                    </span>
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${level.tag}`}>
                      {level.label}
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${level.bar}`}
                      style={{ width: `${Math.max(pct * 100, pct > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">{done} / {total} lessons</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-4xl mb-2">📊</p>
              <p className="text-sm text-stone-500">Complete your first lesson<br />to see your strength map</p>
            </div>
          )}
        </Card>

        {/* 🎯 What to do next */}
        <Card icon={Target} accent="blue" title="Do This Now">
          {nextAction ? (
            <div>
              <div className="bg-stone-50 rounded-xl p-4 mb-4">
                <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-1">
                  {nextAction.mod.icon} {nextAction.mod.title}
                </p>
                <p className="font-bold text-stone-900 leading-snug">{nextAction.lesson.title}</p>
                <p className="text-xs text-stone-400 mt-1">
                  {Math.round(moduleStats.find(s => s.mod.id === nextAction.mod.id)?.pct * 100)}% of this module done
                </p>
              </div>
              {reviewQueue.length > 0 ? (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                  <p className="text-xs font-semibold text-orange-700 mb-0.5">⏱ But first — review these:</p>
                  <p className="text-xs text-orange-600">
                    {reviewQueue.length} lesson{reviewQueue.length > 1 ? "s" : ""} due for review
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => onGoToModule && onGoToModule(nextAction.mod.id)}
                  className="w-full flex items-center justify-between bg-stone-900 text-white rounded-xl px-4 py-3 text-sm font-semibold hover:bg-stone-700 transition-colors"
                >
                  Open module
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
              <p className="font-bold text-stone-900">All lessons complete!</p>
              <p className="text-sm text-stone-500 mt-1">Take the final quiz to<br />earn your certificate</p>
            </div>
          )}
        </Card>
      </div>

      {/* ⏱ About to forget */}
      <Card icon={Clock} accent="orange" title="About to Forget">
        {reviewQueue.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-stone-500 mb-3">
              These lessons were completed a while ago — review them to lock them in.
            </p>
            {reviewQueue.map(({ id, lesson, mod, urgency }) => (
              <div
                key={id}
                className="flex items-center justify-between bg-stone-50 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg flex-shrink-0">{urgency.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{lesson.title}</p>
                    <p className="text-xs text-stone-400">{mod.icon} {mod.title}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className={`text-xs font-bold ${
                    urgency.color === 'red' ? 'text-red-600' :
                    urgency.color === 'orange' ? 'text-orange-600' : 'text-amber-600'
                  }`}>{urgency.label}</p>
                  <p className="text-xs text-stone-400">
                    {urgency.days < 1 ? "today" :
                     urgency.days < 2 ? "yesterday" :
                     `${Math.floor(urgency.days)}d ago`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-start gap-4 py-2">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              {hasProgress ? (
                <>
                  <p className="font-semibold text-stone-800">You're on track</p>
                  <p className="text-sm text-stone-500 mt-0.5">Nothing due for review right now. Keep completing new lessons and come back tomorrow.</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-stone-800">Spaced repetition</p>
                  <p className="text-sm text-stone-500 mt-0.5">Complete lessons and this section will remind you to review them at the right time — before you forget.</p>
                </>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* ⚡ Daily insight */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-700 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Daily Wisdom</span>
        </div>
        <blockquote className="text-white text-lg font-light leading-relaxed italic mb-4">
          "{wisdom.quote}"
        </blockquote>
        <p className="text-amber-400 text-sm font-semibold">— {wisdom.attr}</p>
      </div>
    </div>
  );
}
