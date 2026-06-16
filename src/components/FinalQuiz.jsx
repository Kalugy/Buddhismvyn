import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Heart, Flame, X, Check, Download, Share2 } from "lucide-react";

// ── helpers ────────────────────────────────────────────────────────────────
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── 10 questions spanning all 4 modules ───────────────────────────────────
const QUESTIONS = [
  // Module 1 — History
  {
    type: "tap",
    module: "History",
    question: "Where was Siddhartha Gautama born?",
    options: ["Lumbini, Nepal", "Bodh Gaya, India", "Varanasi, India", "Kushinagar, India"],
    correct: 0,
  },
  {
    type: "tf",
    module: "History",
    statement: "Theravada Buddhism is primarily practiced in East Asia — China, Japan, and Korea.",
    correct: 1, // False — that's Mahayana
  },
  {
    type: "tap",
    module: "History",
    question: "Which emperor was the greatest patron of Buddhism and spread it across Asia?",
    options: ["Chandragupta", "Harsha", "Ashoka", "Vikramaditya"],
    correct: 2,
  },
  // Module 2 — Core Teachings
  {
    type: "match",
    module: "Core Teachings",
    question: "Match each Noble Truth to its meaning",
    pairs: [
      { term: "Dukkha", definition: "There is suffering" },
      { term: "Samudaya", definition: "Suffering has a cause (craving)" },
      { term: "Nirodha", definition: "Suffering can end" },
      { term: "Magga", definition: "There is a path to end suffering" },
    ],
  },
  {
    type: "tap",
    module: "Core Teachings",
    question: "Which of the Three Marks of Existence means 'non-self'?",
    options: ["Anicca", "Dukkha", "Anatta", "Nirvana"],
    correct: 2,
  },
  {
    type: "tf",
    module: "Core Teachings",
    statement: "Right Speech, Right Action, and Right Livelihood belong to the 'Ethical Conduct' section of the Eightfold Path.",
    correct: 0, // True
  },
  // Module 3 — Buddhist Practice
  {
    type: "tap",
    module: "Buddhist Practice",
    question: "What does the word 'karma' literally mean?",
    options: ["Fate", "Punishment", "Action", "Justice"],
    correct: 2,
  },
  {
    type: "match",
    module: "Buddhist Practice",
    question: "Match each Brahmaviharā to its meaning",
    pairs: [
      { term: "Metta", definition: "Loving-kindness" },
      { term: "Karuna", definition: "Compassion" },
      { term: "Upekkha", definition: "Equanimity" },
    ],
  },
  // Module 4 — Meditation
  {
    type: "tap",
    module: "Meditation",
    question: "What is 'Vipassana'?",
    options: ["Breathing exercises", "Chanting and ritual", "Insight meditation", "Walking meditation"],
    correct: 2,
  },
  {
    type: "tf",
    module: "Meditation",
    statement: "In mindfulness of breathing (Anapanasati), the goal is to completely stop all thoughts.",
    correct: 1, // False — notice and return, not suppress
  },
];

const TOTAL_HEARTS = 3;

// ── Sub-renderers ──────────────────────────────────────────────────────────
function TapCards({ options, correct, onAnswer, answered }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((opt, i) => {
        let cls = "relative w-full rounded-2xl border-2 p-5 text-left text-sm font-medium transition-all duration-200 cursor-pointer select-none";
        if (!answered) {
          cls += " border-stone-200 bg-white hover:border-amber-400 hover:bg-amber-50 hover:scale-[1.02] active:scale-[0.98]";
        } else if (i === correct) {
          cls += " border-green-400 bg-green-50 text-green-800 scale-[1.02]";
        } else if (i === answered.chosen && i !== correct) {
          cls += " border-red-300 bg-red-50 text-red-700 opacity-80";
        } else {
          cls += " border-stone-100 bg-stone-50 text-stone-400 opacity-50";
        }
        return (
          <button key={i} disabled={!!answered} onClick={() => !answered && onAnswer(i)} className={cls}>
            {answered && i === correct && <span className="absolute top-3 right-3"><Check className="w-4 h-4 text-green-500" /></span>}
            {answered && i === answered.chosen && i !== correct && <span className="absolute top-3 right-3"><X className="w-4 h-4 text-red-400" /></span>}
            <span className="leading-snug">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

function TrueFalse({ correct, onAnswer, answered }) {
  const choices = [
    { label: "True", value: 0, icon: "✓" },
    { label: "False", value: 1, icon: "✗" },
  ];
  return (
    <div className="flex gap-4">
      {choices.map((c) => {
        let cls = "flex-1 rounded-2xl border-2 p-6 flex flex-col items-center gap-2 text-lg font-bold transition-all duration-200 cursor-pointer";
        if (!answered) {
          cls += " border-stone-200 bg-white";
          cls += c.value === 0 ? " hover:border-green-400 hover:bg-green-50 hover:text-green-700" : " hover:border-red-400 hover:bg-red-50 hover:text-red-700";
        } else if (c.value === correct) {
          cls += c.value === 0 ? " border-green-400 bg-green-50 text-green-700 scale-[1.03]" : " border-red-400 bg-red-50 text-red-700 scale-[1.03]";
        } else {
          cls += " border-stone-100 bg-stone-50 text-stone-300 opacity-50";
        }
        return (
          <button key={c.value} disabled={!!answered} onClick={() => !answered && onAnswer(c.value)} className={cls}>
            <span className="text-3xl">{c.icon}</span>
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

function MatchPairs({ pairs, onAnswer, answered }) {
  const [leftSel, setLeftSel] = useState(null);
  const [matched, setMatched] = useState({});
  const [wrong, setWrong] = useState(null);
  const rightItems = useState(() => shuffle(pairs.map((p) => p.definition)))[0];
  const defToLeft = {};
  pairs.forEach((p, i) => { defToLeft[p.definition] = i; });
  const matchedDefs = new Set(Object.values(matched));

  const handleLeft = (i) => {
    if (answered || matched[i] !== undefined) return;
    setLeftSel(i);
  };
  const handleRight = (def) => {
    if (answered || leftSel === null) return;
    if (defToLeft[def] === leftSel) {
      const next = { ...matched, [leftSel]: def };
      setMatched(next);
      setLeftSel(null);
      if (Object.keys(next).length === pairs.length) setTimeout(() => onAnswer(true), 400);
    } else {
      setWrong({ left: leftSel, right: def });
      setTimeout(() => setWrong(null), 600);
      setLeftSel(null);
    }
  };

  return (
    <div>
      <p className="text-xs text-stone-400 mb-4 text-center">Tap a term, then tap its matching definition</p>
      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          {pairs.map((p, i) => {
            const isMatched = matched[i] !== undefined;
            const isSelected = leftSel === i;
            const isWrong = wrong?.left === i;
            let cls = "w-full rounded-xl border-2 px-3 py-3 text-sm font-medium text-left transition-all duration-150 cursor-pointer";
            if (isMatched) cls += " border-green-300 bg-green-50 text-green-700";
            else if (isWrong) cls += " border-red-400 bg-red-50 text-red-700";
            else if (isSelected) cls += " border-amber-500 bg-amber-50 text-amber-800 scale-[1.02]";
            else cls += " border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50";
            return (
              <button key={i} onClick={() => handleLeft(i)} className={cls} disabled={isMatched}>
                {p.term}{isMatched && <span className="ml-1 text-green-500">✓</span>}
              </button>
            );
          })}
        </div>
        <div className="flex-1 space-y-2">
          {rightItems.map((def, i) => {
            const isMatched = matchedDefs.has(def);
            const isWrong = wrong?.right === def;
            let cls = "w-full rounded-xl border-2 px-3 py-3 text-sm text-left transition-all duration-150 cursor-pointer";
            if (isMatched) cls += " border-green-300 bg-green-50 text-green-700";
            else if (isWrong) cls += " border-red-400 bg-red-50 text-red-700";
            else if (leftSel !== null) cls += " border-stone-200 bg-white hover:border-purple-400 hover:bg-purple-50";
            else cls += " border-stone-200 bg-white opacity-70";
            return (
              <button key={i} onClick={() => handleRight(def)} className={cls} disabled={isMatched}>
                {def}{isMatched && <span className="ml-1 text-green-500">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Certificate card drawn on canvas ──────────────────────────────────────
function CertificateScreen({ score, total, onBack, onRestart }) {
  const canvasRef = useRef(null);

  const drawCertificate = (canvas) => {
    const W = 1080, H = 1080;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // Background gradient — warm saffron to deep amber
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#78350f");   // amber-900
    bg.addColorStop(0.5, "#92400e"); // amber-800
    bg.addColorStop(1, "#451a03");   // deep brown
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Subtle radial glow in center
    const glow = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 500);
    glow.addColorStop(0, "rgba(251,191,36,0.18)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Decorative border (double)
    ctx.strokeStyle = "rgba(251,191,36,0.6)";
    ctx.lineWidth = 6;
    ctx.strokeRect(32, 32, W - 64, H - 64);
    ctx.strokeStyle = "rgba(251,191,36,0.25)";
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, W - 96, H - 96);

    // Corner ornaments
    const corners = [[64, 64], [W - 64, 64], [64, H - 64], [W - 64, H - 64]];
    corners.forEach(([x, y]) => {
      ctx.strokeStyle = "rgba(251,191,36,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(251,191,36,0.7)";
      ctx.fill();
    });

    // Dharma wheel emoji large
    ctx.font = "120px serif";
    ctx.textAlign = "center";
    ctx.fillText("☸️", W / 2, 230);

    // App name
    ctx.fillStyle = "rgba(251,191,36,0.7)";
    ctx.font = "bold 36px sans-serif";
    ctx.letterSpacing = "8px";
    ctx.fillText("DHARMA PATH", W / 2, 300);

    // Divider line
    ctx.strokeStyle = "rgba(251,191,36,0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(200, 330); ctx.lineTo(W - 200, 330);
    ctx.stroke();

    // "This certifies that" text
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "italic 32px serif";
    ctx.fillText("This certifies the completion of", W / 2, 400);

    // Course title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 64px sans-serif";
    ctx.fillText("Buddhist Learning", W / 2, 490);
    ctx.fillText("Course", W / 2, 565);

    // Score badge background
    const bx = W / 2 - 130, by = 620, bw = 260, bh = 110, br = 20;
    ctx.beginPath();
    ctx.moveTo(bx + br, by);
    ctx.lineTo(bx + bw - br, by);
    ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + br);
    ctx.lineTo(bx + bw, by + bh - br);
    ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - br, by + bh);
    ctx.lineTo(bx + br, by + bh);
    ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - br);
    ctx.lineTo(bx, by + br);
    ctx.quadraticCurveTo(bx, by, bx + br, by);
    ctx.closePath();
    ctx.fillStyle = "rgba(251,191,36,0.18)";
    ctx.fill();
    ctx.strokeStyle = "rgba(251,191,36,0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Score text
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 56px sans-serif";
    ctx.fillText(`${score} / ${total}`, W / 2, 693);
    ctx.fillStyle = "rgba(251,191,36,0.7)";
    ctx.font = "24px sans-serif";

    // Trophy + congrats
    ctx.font = "52px serif";
    ctx.fillText("🏆", W / 2, 820);

    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "italic 30px serif";
    ctx.fillText("Completed with wisdom and dedication", W / 2, 880);

    // Bottom divider
    ctx.strokeStyle = "rgba(251,191,36,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(200, 910); ctx.lineTo(W - 200, 910);
    ctx.stroke();

    // Date
    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "24px sans-serif";
    ctx.fillText(date, W / 2, 960);
  };

  useEffect(() => {
    if (canvasRef.current) drawCertificate(canvasRef.current);
  }, []);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "dharma-path-certificate.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    canvas.toBlob(async (blob) => {
      const file = new File([blob], "dharma-path-certificate.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "I completed the Dharma Path Buddhist Course! 🙏☸️",
          text: `I just completed the full Buddhist Learning Course on Dharma Path with a score of ${score}/${total}! 🏆`,
        });
      } else {
        handleDownload();
      }
    });
  };

  return (
    <div className="max-w-lg mx-auto text-center py-8">
      <h2 className="text-3xl font-bold text-stone-900 mb-2">Course Complete! 🎉</h2>
      <p className="text-stone-500 mb-6">You've mastered the Dharma Path. Share your achievement!</p>

      {/* Certificate preview */}
      <div className="rounded-2xl overflow-hidden shadow-2xl mb-6 mx-auto" style={{ maxWidth: 400 }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      {/* Share / Download buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-800 to-amber-600 text-white font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-stone-800 text-white font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-stone-200 text-stone-600 font-medium py-3 px-4 rounded-xl hover:bg-stone-50 transition-colors"
        >
          Back to Course
        </button>
        <button
          onClick={onRestart}
          className="flex-1 border border-stone-200 text-stone-500 font-medium py-3 px-4 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Retry
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function FinalQuiz({ onBack, onComplete, alreadyPassed, savedScore }) {
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [hearts, setHearts] = useState(TOTAL_HEARTS);
  const [score, setScore] = useState(alreadyPassed && savedScore != null ? savedScore : 0);
  const [streak, setStreak] = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const [done, setDone] = useState(alreadyPassed ? "pass" : null);

  const q = QUESTIONS[idx];
  const progress = (idx / QUESTIONS.length) * 100;

  const handleAnswer = (chosen) => {
    const isRight = chosen === q.correct;
    setAnswered({ chosen, correct: q.correct, isRight });
    if (isRight) {
      setScore((s) => s + 1);
      const ns = streak + 1;
      setStreak(ns);
      if (ns >= 2) { setShowStreak(true); setTimeout(() => setShowStreak(false), 1500); }
    } else {
      setStreak(0);
      const nh = hearts - 1;
      setHearts(nh);
      if (nh <= 0) { setTimeout(() => setDone("fail"), 1200); }
    }
  };

  const handleMatchAnswer = () => {
    setScore((s) => s + 1);
    const ns = streak + 1;
    setStreak(ns);
    if (ns >= 2) { setShowStreak(true); setTimeout(() => setShowStreak(false), 1500); }
    setAnswered({ isRight: true, correct: true });
  };

  const next = () => {
    if (idx + 1 >= QUESTIONS.length) {
      // score is already updated by handleAnswer/handleMatchAnswer before next() is called
      const passed = score >= Math.ceil(QUESTIONS.length * 0.6);
      setDone(passed ? "pass" : "fail");
      if (passed) onComplete(score);
    } else {
      setIdx((i) => i + 1);
      setAnswered(null);
    }
  };

  const restart = () => {
    setIdx(0); setAnswered(null); setHearts(TOTAL_HEARTS);
    setScore(0); setDone(null); setStreak(0);
  };

  // ── Pass screen with shareable certificate ────────────────────────────
  if (done === "pass") {
    return <CertificateScreen score={score} total={QUESTIONS.length} onBack={onBack} onRestart={restart} />;
  }

  if (done === "fail") {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="text-7xl mb-4">💔</div>
        <h2 className="text-3xl font-bold text-stone-900 mb-2">Don't give up!</h2>
        <p className="text-stone-500 mb-6">Review the lessons and try again — every attempt brings you closer to wisdom.</p>
        <div className="space-y-3">
          <button onClick={restart} className="w-full bg-gradient-to-r from-amber-800 to-amber-600 text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Try again
          </button>
          <button onClick={onBack} className="w-full border border-stone-200 text-stone-600 font-medium py-3 px-6 rounded-xl hover:bg-stone-50 transition-colors">
            Review lessons
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz screen ────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-stone-400 hover:text-stone-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 bg-stone-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-amber-800 to-amber-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_HEARTS }).map((_, i) => (
            <Heart key={i} className={`w-5 h-5 transition-all duration-300 ${i < hearts ? "text-red-500 fill-red-500" : "text-stone-300"}`} />
          ))}
        </div>
      </div>

      {/* Streak toast */}
      {showStreak && (
        <div className="flex items-center justify-center gap-2 bg-orange-100 border border-orange-300 text-orange-700 rounded-xl py-2 px-4 mb-4 text-sm font-semibold animate-pulse">
          <Flame className="w-4 h-4" /> {streak} in a row! Keep going!
        </div>
      )}

      {/* Module tag + counter */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Question {idx + 1} of {QUESTIONS.length}
        </span>
        <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2.5 py-1 rounded-full">
          {q.module}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-xl font-bold text-stone-900 mb-6 leading-snug">
        {q.type === "tf" ? q.statement : q.question}
        {q.type === "tf" && (
          <span className="ml-2 text-xs font-normal text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full align-middle">True or False</span>
        )}
      </h2>

      {/* Answer UI */}
      {q.type === "tap" && (
        <TapCards options={q.options} correct={q.correct} onAnswer={handleAnswer} answered={answered} />
      )}
      {q.type === "tf" && (
        <TrueFalse correct={q.correct} onAnswer={handleAnswer} answered={answered} />
      )}
      {q.type === "match" && (
        <MatchPairs pairs={q.pairs} onAnswer={handleMatchAnswer} answered={answered} />
      )}

      {/* Floating Next button — appears after any answer */}
      {answered && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={next}
            className={`flex items-center gap-2 font-semibold px-8 py-3 rounded-2xl text-white shadow-lg hover:opacity-90 active:scale-95 transition-all ${
              answered.isRight ? "bg-green-600" : "bg-stone-700"
            }`}
          >
            {idx + 1 >= QUESTIONS.length ? "Finish" : "Next"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
