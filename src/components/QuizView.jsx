import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Trophy, RotateCcw, Flame, Heart, X, Check } from "lucide-react";

// ── helpers ────────────────────────────────────────────────────────────────
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── Question renderers ──────────────────────────────────────────────────────

/** Big tap-card choice (no A/B labels) */
function TapCards({ question, options, correct, onAnswer, answered }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((opt, i) => {
        let base =
          "relative w-full rounded-2xl border-2 p-5 text-left text-sm font-medium transition-all duration-200 cursor-pointer select-none";
        if (!answered) {
          base += " border-stone-200 bg-white hover:border-amber-400 hover:bg-amber-50 hover:scale-[1.02] active:scale-[0.98]";
        } else if (i === correct) {
          base += " border-green-400 bg-green-50 text-green-800 scale-[1.02]";
        } else if (i === answered.chosen && i !== correct) {
          base += " border-red-300 bg-red-50 text-red-700 opacity-80";
        } else {
          base += " border-stone-100 bg-stone-50 text-stone-400 opacity-50";
        }
        return (
          <button
            key={i}
            disabled={!!answered}
            onClick={() => !answered && onAnswer(i)}
            className={base}
          >
            {answered && i === correct && (
              <span className="absolute top-3 right-3">
                <Check className="w-4 h-4 text-green-500" />
              </span>
            )}
            {answered && i === answered.chosen && i !== correct && (
              <span className="absolute top-3 right-3">
                <X className="w-4 h-4 text-red-400" />
              </span>
            )}
            <span className="leading-snug">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

/** True / False */
function TrueFalse({ correct, onAnswer, answered }) {
  const choices = [
    { label: "True", value: 0, icon: "✓", color: "text-green-700", bg: "bg-green-50", border: "border-green-400" },
    { label: "False", value: 1, icon: "✗", color: "text-red-700", bg: "bg-red-50", border: "border-red-400" },
  ];
  return (
    <div className="flex gap-4">
      {choices.map((c) => {
        let base =
          "flex-1 rounded-2xl border-2 p-6 flex flex-col items-center gap-2 text-lg font-bold transition-all duration-200 cursor-pointer";
        if (!answered) {
          base += " border-stone-200 bg-white hover:scale-[1.03] active:scale-[0.97]";
          if (c.value === 0) base += " hover:border-green-400 hover:bg-green-50 hover:text-green-700";
          else base += " hover:border-red-400 hover:bg-red-50 hover:text-red-700";
        } else if (c.value === correct) {
          base += ` ${c.border} ${c.bg} ${c.color} scale-[1.03]`;
        } else {
          base += " border-stone-100 bg-stone-50 text-stone-300 opacity-50";
        }
        return (
          <button key={c.value} disabled={!!answered} onClick={() => !answered && onAnswer(c.value)} className={base}>
            <span className="text-3xl">{c.icon}</span>
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

/** Drag-to-match (click-to-pair) */
function MatchPairs({ pairs, onAnswer, answered }) {
  const [leftSel, setLeftSel] = useState(null);
  const [matched, setMatched] = useState({});  // leftIdx -> rightIdx
  const [wrong, setWrong] = useState(null);

  const leftItems = pairs.map((p) => p.term);
  const rightItems = shuffle(pairs.map((p) => p.definition));

  // Build a lookup: definition -> correct left index
  const defToLeft = {};
  pairs.forEach((p, i) => { defToLeft[p.definition] = i; });

  const handleLeft = (i) => {
    if (answered || matched[i] !== undefined) return;
    setLeftSel(i);
  };

  const handleRight = (def) => {
    if (answered || leftSel === null) return;
    const correctLeft = defToLeft[def];
    if (correctLeft === leftSel) {
      const newMatched = { ...matched, [leftSel]: def };
      setMatched(newMatched);
      setLeftSel(null);
      if (Object.keys(newMatched).length === pairs.length) {
        setTimeout(() => onAnswer(true), 400);
      }
    } else {
      setWrong({ left: leftSel, right: def });
      setTimeout(() => setWrong(null), 600);
      setLeftSel(null);
    }
  };

  // right items already matched
  const matchedDefs = new Set(Object.values(matched));

  return (
    <div>
      <p className="text-xs text-stone-400 mb-4 text-center">Tap a term, then tap its matching definition</p>
      <div className="flex gap-3">
        {/* Left column – terms */}
        <div className="flex-1 space-y-2">
          {leftItems.map((term, i) => {
            const isMatched = matched[i] !== undefined;
            const isSelected = leftSel === i;
            const isWrong = wrong?.left === i;
            let cls = "w-full rounded-xl border-2 px-3 py-3 text-sm font-medium text-left transition-all duration-150 cursor-pointer";
            if (isMatched) cls += " border-green-300 bg-green-50 text-green-700";
            else if (isWrong) cls += " border-red-400 bg-red-50 text-red-700 animate-shake";
            else if (isSelected) cls += " border-amber-500 bg-amber-50 text-amber-800 scale-[1.02]";
            else cls += " border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50";
            return (
              <button key={i} onClick={() => handleLeft(i)} className={cls} disabled={isMatched}>
                {term}
                {isMatched && <span className="ml-1 text-green-500">✓</span>}
              </button>
            );
          })}
        </div>
        {/* Right column – definitions */}
        <div className="flex-1 space-y-2">
          {rightItems.map((def, i) => {
            const isMatched = matchedDefs.has(def);
            const isWrong = wrong?.right === def;
            let cls = "w-full rounded-xl border-2 px-3 py-3 text-sm text-left transition-all duration-150 cursor-pointer";
            if (isMatched) cls += " border-green-300 bg-green-50 text-green-700";
            else if (isWrong) cls += " border-red-400 bg-red-50 text-red-700";
            else if (leftSel !== null) cls += " border-stone-200 bg-white hover:border-purple-400 hover:bg-purple-50 cursor-pointer";
            else cls += " border-stone-200 bg-white opacity-70";
            return (
              <button key={i} onClick={() => handleRight(def)} className={cls} disabled={isMatched}>
                {def}
                {isMatched && <span className="ml-1 text-green-500">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Question data per module ────────────────────────────────────────────────
const quizData = {
  1: [
    {
      type: "tap",
      question: "Where was Siddhartha Gautama born?",
      options: ["Bodh Gaya, India", "Lumbini, Nepal", "Varanasi, India", "Kushinagar, India"],
      correct: 1,
    },
    {
      type: "tap",
      question: "Which event is called the 'Great Renunciation'?",
      options: [
        "Siddhartha's enlightenment under the Bodhi tree",
        "Siddhartha leaving his palace to seek liberation",
        "The First Buddhist Council",
        "Emperor Ashoka converting to Buddhism",
      ],
      correct: 1,
    },
    {
      type: "tf",
      statement: "Emperor Ashoka spread Buddhism across Asia after converting following a devastating war.",
      correct: 0, // 0 = True
    },
    {
      type: "match",
      question: "Match each Buddhist school to its home region",
      pairs: [
        { term: "Theravada", definition: "Southeast Asia (Thailand, Myanmar)" },
        { term: "Mahayana", definition: "East Asia (China, Japan, Korea)" },
        { term: "Vajrayana", definition: "Tibet & Mongolia" },
      ],
    },
    {
      type: "tap",
      question: "What does the word 'Buddha' mean?",
      options: ["The Holy One", "The Peaceful One", "The Awakened One", "The Compassionate One"],
      correct: 2,
    },
  ],
  2: [
    {
      type: "tap",
      question: "Which Noble Truth says that suffering CAN end?",
      options: ["The First — Dukkha", "The Second — Samudaya", "The Third — Nirodha", "The Fourth — Magga"],
      correct: 2,
    },
    {
      type: "match",
      question: "Match each Pali word to its meaning",
      pairs: [
        { term: "Anicca", definition: "Impermanence" },
        { term: "Dukkha", definition: "Suffering / Unsatisfactoriness" },
        { term: "Anatta", definition: "Non-self" },
      ],
    },
    {
      type: "tf",
      statement: "The Noble Eightfold Path is divided into three sections: Wisdom, Ethical Conduct, and Mental Cultivation.",
      correct: 0,
    },
    {
      type: "tap",
      question: "According to Buddhism, what primarily causes suffering?",
      options: ["Bad luck", "Craving (tanha)", "Other people", "Fate"],
      correct: 1,
    },
    {
      type: "tap",
      question: "Which path factor belongs to the 'Ethical Conduct' section?",
      options: ["Right View", "Right Intention", "Right Mindfulness", "Right Speech"],
      correct: 3,
    },
  ],
  3: [
    {
      type: "tap",
      question: "How many precepts are in the basic Buddhist guidelines for laypeople?",
      options: ["3", "5", "8", "10"],
      correct: 1,
    },
    {
      type: "tf",
      statement: "In Buddhism, karma is determined purely by the outcome of an action, not the intention behind it.",
      correct: 1, // False — intention is key
    },
    {
      type: "match",
      question: "Match each Brahmaviharā to its meaning",
      pairs: [
        { term: "Metta", definition: "Loving-kindness" },
        { term: "Karuna", definition: "Compassion" },
        { term: "Mudita", definition: "Sympathetic Joy" },
        { term: "Upekkha", definition: "Equanimity" },
      ],
    },
    {
      type: "tap",
      question: "What does the fifth precept ask practitioners to abstain from?",
      options: ["Eating meat", "Intoxicants that cloud the mind", "Working on holy days", "Speaking in anger"],
      correct: 1,
    },
    {
      type: "tf",
      statement: "The cycle of birth, death, and rebirth is called 'samsara' in Buddhism.",
      correct: 0,
    },
  ],
  4: [
    {
      type: "tap",
      question: "What does 'bhavana' (meditation) mean in Pali?",
      options: ["Stillness", "Cultivation or development", "Breathing", "Insight"],
      correct: 1,
    },
    {
      type: "match",
      question: "Match each meditation type to its focus",
      pairs: [
        { term: "Samatha", definition: "Calm & concentration" },
        { term: "Vipassana", definition: "Insight into reality" },
        { term: "Metta", definition: "Loving-kindness for all beings" },
      ],
    },
    {
      type: "tf",
      statement: "In breath meditation, the goal is to stop all thoughts completely.",
      correct: 1, // False — notice and return, not suppress
    },
    {
      type: "tap",
      question: "What is 'Anapanasati'?",
      options: ["Loving-kindness meditation", "Mindfulness of breathing", "Body scan meditation", "Walking meditation"],
      correct: 1,
    },
    {
      type: "tap",
      question: "Which of these is NOT one of the Four Foundations of Mindfulness?",
      options: ["Mindfulness of the body", "Mindfulness of feelings", "Mindfulness of past lives", "Mindfulness of mental objects"],
      correct: 2,
    },
  ],
};

// ── Main component ──────────────────────────────────────────────────────────
const TOTAL_HEARTS = 3;

export default function QuizView({ module, onComplete, onBack, alreadyPassed }) {
  const questions = quizData[module.id] || [];
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(null); // null | { chosen, correct }
  const [hearts, setHearts] = useState(TOTAL_HEARTS);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(alreadyPassed ? "pass" : null); // null | "pass" | "fail"
  const [streak, setStreak] = useState(0);
  const [showStreak, setShowStreak] = useState(false);

  const q = questions[idx];
  const progress = (idx / questions.length) * 100;

  const handleAnswer = (chosenIdx) => {
    const correctIdx = q.correct ?? 0;
    const isRight = chosenIdx === correctIdx;

    setAnswered({ chosen: chosenIdx, correct: correctIdx, isRight });

    if (isRight) {
      setScore((s) => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak >= 2) { setShowStreak(true); setTimeout(() => setShowStreak(false), 1500); }
    } else {
      setStreak(0);
      const newHearts = hearts - 1;
      setHearts(newHearts);
      if (newHearts <= 0) {
        setTimeout(() => setDone("fail"), 1200);
        return;
      }
    }
  };

  const handleMatchAnswer = (allCorrect) => {
    setScore((s) => s + 1);
    const newStreak = streak + 1;
    setStreak(newStreak);
    if (newStreak >= 2) { setShowStreak(true); setTimeout(() => setShowStreak(false), 1500); }
    setAnswered({ isRight: true, correct: true });
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      const passed = score + (answered?.isRight ? 1 : 0) >= Math.ceil(questions.length * 0.6);
      setDone(passed ? "pass" : "fail");
      if (passed) onComplete(module.id);
    } else {
      setIdx((i) => i + 1);
      setAnswered(null);
    }
  };

  const restart = () => {
    setIdx(0); setAnswered(null); setHearts(TOTAL_HEARTS);
    setScore(0); setDone(null); setStreak(0);
  };

  // ── Done screen ──────────────────────────────────────────────────────────
  if (done === "pass") {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="text-7xl mb-4 animate-bounce">🏆</div>
        <h2 className="text-3xl font-bold text-stone-900 mb-2">Excellent!</h2>
        <p className="text-stone-500 mb-6">You completed the {module.title} quiz.</p>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 inline-block">
          <p className="text-4xl font-bold text-amber-700">{score}/{questions.length}</p>
          <p className="text-sm text-amber-600 mt-1">questions correct</p>
        </div>
        <div className="space-y-3">
          <button onClick={onBack} className={`w-full bg-gradient-to-r ${module.color} text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity`}>
            Back to Module
          </button>
          <button onClick={restart} className="w-full border border-stone-200 text-stone-600 font-medium py-3 px-6 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Play again
          </button>
        </div>
      </div>
    );
  }

  if (done === "fail") {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="text-7xl mb-4">💔</div>
        <h2 className="text-3xl font-bold text-stone-900 mb-2">Don't give up!</h2>
        <p className="text-stone-500 mb-6">Review the lessons and try again — each attempt brings you closer.</p>
        <div className="space-y-3">
          <button onClick={restart} className={`w-full bg-gradient-to-r ${module.color} text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}>
            <RotateCcw className="w-4 h-4" /> Try again
          </button>
          <button onClick={onBack} className="w-full border border-stone-200 text-stone-600 font-medium py-3 px-6 rounded-xl hover:bg-stone-50 transition-colors">
            Review lessons
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz screen ──────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-stone-400 hover:text-stone-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Progress bar */}
        <div className="flex-1 bg-stone-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${module.color}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Hearts */}
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_HEARTS }).map((_, i) => (
            <Heart
              key={i}
              className={`w-5 h-5 transition-all duration-300 ${i < hearts ? "text-red-500 fill-red-500" : "text-stone-300"}`}
            />
          ))}
        </div>
      </div>

      {/* Streak toast */}
      {showStreak && (
        <div className="flex items-center justify-center gap-2 bg-orange-100 border border-orange-300 text-orange-700 rounded-xl py-2 px-4 mb-4 text-sm font-semibold animate-pulse">
          <Flame className="w-4 h-4" /> {streak} in a row! Keep going!
        </div>
      )}

      {/* Question counter */}
      <p className="text-xs text-stone-400 font-medium uppercase tracking-widest mb-3">
        Question {idx + 1} of {questions.length}
      </p>

      {/* Question */}
      <h2 className="text-xl font-bold text-stone-900 mb-6 leading-snug">
        {q.type === "tf" ? q.statement : q.question}
        {q.type === "tf" && (
          <span className="ml-2 text-xs font-normal text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full align-middle">True or False</span>
        )}
      </h2>

      {/* Answer UI */}
      {q.type === "tap" && (
        <TapCards
          question={q.question}
          options={q.options}
          correct={q.correct}
          onAnswer={handleAnswer}
          answered={answered}
        />
      )}

      {q.type === "tf" && (
        <TrueFalse correct={q.correct} onAnswer={handleAnswer} answered={answered} />
      )}

      {q.type === "match" && (
        <MatchPairs pairs={q.pairs} onAnswer={handleMatchAnswer} answered={answered} />
      )}

      {/* Feedback + Next */}
      {answered && q.type !== "match" && (
        <div className={`mt-5 rounded-2xl p-4 flex items-center justify-between ${answered.isRight ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{answered.isRight ? "🎉" : "💡"}</span>
            <div>
              <p className={`font-semibold ${answered.isRight ? "text-green-800" : "text-red-800"}`}>
                {answered.isRight ? "Correct!" : "Not quite"}
              </p>
              {!answered.isRight && q.type === "tap" && (
                <p className="text-xs text-red-600 mt-0.5">
                  Answer: <strong>{q.options[q.correct]}</strong>
                </p>
              )}
              {!answered.isRight && q.type === "tf" && (
                <p className="text-xs text-red-600 mt-0.5">
                  The correct answer is <strong>{q.correct === 0 ? "True" : "False"}</strong>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={next}
            className={`flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl text-white transition-opacity hover:opacity-90 ${answered.isRight ? "bg-green-600" : "bg-red-500"}`}
          >
            {idx + 1 >= questions.length ? "Finish" : "Next"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {answered && q.type === "match" && (
        <div className="mt-5 rounded-2xl p-4 flex items-center justify-between bg-green-50 border border-green-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <p className="font-semibold text-green-800">All matched correctly!</p>
          </div>
          <button
            onClick={next}
            className="flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl text-white bg-green-600 hover:opacity-90 transition-opacity"
          >
            {idx + 1 >= questions.length ? "Finish" : "Next"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
