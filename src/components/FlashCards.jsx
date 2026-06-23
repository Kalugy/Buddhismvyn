import { useState, useEffect } from "react";
import { RotateCcw, Shuffle, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Layers, Puzzle } from "lucide-react";

// ── Card data sets ──────────────────────────────────────────────────────────
const DECKS = [
  {
    id: "four-truths",
    name: "Four Noble Truths",
    emoji: "☸️",
    color: "from-amber-600 to-amber-400",
    cards: [
      { front: "Dukkha", back: "The truth of suffering — life is inherently unsatisfying. Joy fades, things change, nothing is permanent.", extra: "1st Noble Truth" },
      { front: "Samudaya", back: "The origin of suffering — craving (tanha) and ignorance are the root cause of all dissatisfaction.", extra: "2nd Noble Truth" },
      { front: "Nirodha", back: "The cessation of suffering — it is possible to end suffering completely. This state of freedom is called Nirvana.", extra: "3rd Noble Truth" },
      { front: "Magga", back: "The path to the end of suffering — the Noble Eightfold Path, the 'Middle Way' between extremes.", extra: "4th Noble Truth" },
    ],
  },
  {
    id: "eightfold",
    name: "Eightfold Path",
    emoji: "🛤️",
    color: "from-orange-700 to-orange-400",
    cards: [
      { front: "Right View", back: "Understanding the Four Noble Truths and the nature of reality — seeing things as they actually are.", extra: "Wisdom · #1" },
      { front: "Right Intention", back: "Committing to renunciation, goodwill, and harmlessness. Letting go of craving and ill-will.", extra: "Wisdom · #2" },
      { front: "Right Speech", back: "Speaking truthfully, kindly, and helpfully. No lying, gossip, harsh speech, or idle chatter.", extra: "Ethics · #3" },
      { front: "Right Action", back: "Acting ethically: not killing, not stealing, avoiding sexual misconduct. The Five Precepts in practice.", extra: "Ethics · #4" },
      { front: "Right Livelihood", back: "Earning a living in a way that doesn't cause harm — avoiding trades in weapons, living beings, meat, or poisons.", extra: "Ethics · #5" },
      { front: "Right Effort", back: "Energetically preventing unwholesome states from arising, and cultivating wholesome ones.", extra: "Meditation · #6" },
      { front: "Right Mindfulness", back: "Clear, non-judgmental awareness of body, feelings, mind-states, and mental objects — moment to moment.", extra: "Meditation · #7" },
      { front: "Right Concentration", back: "Developing deep meditative absorption (jhana) — unified, stable focus free from distraction.", extra: "Meditation · #8" },
    ],
  },
  {
    id: "three-schools",
    name: "Three Schools",
    emoji: "🏛️",
    color: "from-teal-700 to-teal-400",
    cards: [
      { front: "Theravada", back: "\"School of the Elders\" — oldest surviving school. Uses Pali Canon. Focuses on personal liberation (Arahant ideal). Dominant in Sri Lanka, Thailand, Myanmar, Cambodia, Laos.", extra: "The Path of the Elders" },
      { front: "Mahayana", back: "\"Great Vehicle\" — aims to liberate all beings, not just oneself. Bodhisattva ideal. Uses many Sanskrit sutras. Dominant in China, Japan, Korea, Vietnam.", extra: "The Great Vehicle" },
      { front: "Vajrayana", back: "\"Diamond Vehicle\" — Tantric Buddhism. Uses mantras, mandalas, and visualization. Claims to offer awakening in one lifetime. Dominant in Tibet, Bhutan, Mongolia.", extra: "The Diamond Vehicle" },
    ],
  },
  {
    id: "three-marks",
    name: "Three Marks of Existence",
    emoji: "🔄",
    color: "from-purple-700 to-purple-400",
    cards: [
      { front: "Anicca", back: "Impermanence — all conditioned phenomena are constantly changing. Nothing lasts. Clinging to what changes is the source of suffering.", extra: "1st Mark · Impermanence" },
      { front: "Dukkha", back: "Unsatisfactoriness — all conditioned existence involves suffering or unease, from obvious pain to the subtle discomfort of impermanence.", extra: "2nd Mark · Suffering" },
      { front: "Anatta", back: "Non-self — there is no fixed, permanent, independent 'self.' What we call 'I' is a constantly changing process of five aggregates.", extra: "3rd Mark · Non-self" },
    ],
  },
  {
    id: "brahmaviharas",
    name: "Four Brahmaviharas",
    emoji: "💛",
    color: "from-rose-600 to-pink-400",
    cards: [
      { front: "Metta", back: "Loving-kindness — the genuine wish for all beings to be happy and free from suffering. Begins with oneself and expands outward to all beings.", extra: "Divine Abode #1" },
      { front: "Karuna", back: "Compassion — the wish for all beings to be free from suffering. Moved by the pain of others without being overwhelmed by it.", extra: "Divine Abode #2" },
      { front: "Mudita", back: "Sympathetic joy — genuine happiness in the happiness of others. The antidote to envy and comparison.", extra: "Divine Abode #3" },
      { front: "Upekkha", back: "Equanimity — balanced, unshakeable calm. Not indifference, but deep stability that doesn't depend on conditions going a certain way.", extra: "Divine Abode #4" },
    ],
  },
  {
    id: "five-precepts",
    name: "Five Precepts",
    emoji: "🙏",
    color: "from-stone-700 to-stone-500",
    cards: [
      { front: "Panatipata veramani", back: "Abstain from taking life — respect for all living beings. The foundation of non-violence (ahimsa).", extra: "1st Precept · No killing" },
      { front: "Adinnadana veramani", back: "Abstain from taking what is not given — no stealing, cheating, or exploitation. Practice generosity instead.", extra: "2nd Precept · No stealing" },
      { front: "Kamesu micchacara veramani", back: "Abstain from sexual misconduct — no actions that cause harm in intimate relationships. Honesty and care.", extra: "3rd Precept · No misconduct" },
      { front: "Musavada veramani", back: "Abstain from false speech — no lying, gossip, or harmful words. Speak truthfully, kindly, and usefully.", extra: "4th Precept · No lying" },
      { front: "Sura-meraya veramani", back: "Abstain from intoxicants — keep the mind clear and aware. A clear mind is the foundation of practice.", extra: "5th Precept · No intoxicants" },
    ],
  },
  {
    id: "key-terms",
    name: "Key Buddhist Terms",
    emoji: "📖",
    color: "from-indigo-700 to-indigo-400",
    cards: [
      { front: "Dharma / Dhamma", back: "The Buddha's teachings; also the nature of reality as it truly is. Taking refuge in the Dharma means trusting the teachings as a guide.", extra: "Core term" },
      { front: "Sangha", back: "The community of practitioners — monks, nuns, and laypeople who practice together. One of the Three Jewels.", extra: "Community" },
      { front: "Nirvana / Nibbana", back: "The complete cessation of craving, hatred, and delusion — the end of suffering. Literally 'extinguishing' (as a flame).", extra: "Liberation" },
      { front: "Karma", back: "Intentional action and its consequences. Not fate — the natural law that every intentional deed plants a seed that ripens as experience.", extra: "Cause & Effect" },
      { front: "Samsara", back: "The cycle of birth, death, and rebirth driven by craving and ignorance. Practice leads to liberation from samsara.", extra: "The cycle" },
      { front: "Bodhisattva", back: "A being on the path to full Buddhahood who vows to delay final liberation in order to help all beings attain freedom first.", extra: "Mahayana ideal" },
      { front: "Sunyata", back: "Emptiness — all phenomena lack inherent, independent existence. Things arise in dependence on causes and conditions.", extra: "Mahayana teaching" },
      { front: "Dana", back: "Generosity — the first and most accessible spiritual practice. Giving freely without expectation of return.", extra: "Core practice" },
    ],
  },
];

// ── Flashcard flip component ─────────────────────────────────────────────────
function FlipCard({ card, index, total }) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => setFlipped(false), [card]);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs text-stone-400 font-mono">{index + 1} / {total}</p>
      <div
        className="w-full cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", minHeight: "220px" }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl bg-white border border-stone-200 shadow-lg flex flex-col items-center justify-center p-5 sm:p-8 gap-3"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 text-center">{card.extra}</p>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 text-center">{card.front}</h2>
            <p className="text-xs text-stone-400 mt-2">tap to reveal</p>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl bg-amber-50 border border-amber-200 shadow-lg flex flex-col items-center justify-center p-5 sm:p-8 gap-3"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 text-center">{card.extra}</p>
            <p className="text-sm sm:text-base text-stone-700 text-center leading-relaxed">{card.back}</p>
            <p className="text-xs text-stone-400 mt-2">tap to flip back</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Match game ───────────────────────────────────────────────────────────────
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function MatchGame({ deck }) {
  const cards = deck.cards.slice(0, Math.min(deck.cards.length, 6));
  const [terms, setTerms] = useState(() => shuffle(cards.map((c, i) => ({ id: i, text: c.front, type: "term" }))));
  const [defs, setDefs] = useState(() => shuffle(cards.map((c, i) => ({ id: i, text: c.back, type: "def" }))));
  const [selected, setSelected] = useState(null); // { id, type }
  const [matched, setMatched] = useState(new Set());
  const [wrong, setWrong] = useState(null);
  const [score, setScore] = useState(0);

  const reset = () => {
    setTerms(shuffle(cards.map((c, i) => ({ id: i, text: c.front, type: "term" }))));
    setDefs(shuffle(cards.map((c, i) => ({ id: i, text: c.back, type: "def" }))));
    setSelected(null);
    setMatched(new Set());
    setWrong(null);
    setScore(0);
  };

  const handlePick = (item) => {
    if (matched.has(item.id)) return;
    if (!selected) {
      setSelected(item);
      return;
    }
    if (selected.type === item.type) {
      setSelected(item);
      return;
    }
    if (selected.id === item.id) {
      const next = new Set(matched);
      next.add(item.id);
      setMatched(next);
      setSelected(null);
      setScore(s => s + 1);
    } else {
      setWrong({ a: selected.id, b: item.id });
      setTimeout(() => { setWrong(null); setSelected(null); }, 700);
    }
  };

  const allDone = matched.size === cards.length;

  const cardClass = (item) => {
    const isMatched = matched.has(item.id);
    const isSel = selected?.id === item.id && selected?.type === item.type;
    const isWrong = wrong && (wrong.a === item.id || wrong.b === item.id);
    if (isMatched) return "bg-green-50 border-green-300 text-green-800 opacity-50 cursor-default";
    if (isWrong) return "bg-red-50 border-red-300 text-red-700 animate-pulse";
    if (isSel) return "bg-amber-100 border-amber-400 text-stone-900 ring-2 ring-amber-400";
    return "bg-white border-stone-200 text-stone-700 hover:border-amber-300 hover:bg-amber-50 cursor-pointer";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-stone-500">Match each term to its meaning</p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-stone-600">{matched.size}/{cards.length} matched</span>
          <button onClick={reset} className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {allDone ? (
        <div className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
          <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <p className="text-xl font-bold text-green-800 mb-1">Perfect match!</p>
          <p className="text-sm text-green-600 mb-4">You matched all {cards.length} pairs.</p>
          <button onClick={reset} className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
            Play again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="space-y-1.5 sm:space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Terms</p>
            {terms.map(item => (
              <button
                key={item.id}
                onClick={() => handlePick(item)}
                disabled={matched.has(item.id)}
                className={`w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${cardClass(item)}`}
              >
                {matched.has(item.id) && <CheckCircle2 className="w-3 h-3 inline mr-1 text-green-500" />}
                {item.text}
              </button>
            ))}
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Meanings</p>
            {defs.map(item => (
              <button
                key={item.id}
                onClick={() => handlePick(item)}
                disabled={matched.has(item.id)}
                className={`w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border text-xs leading-snug transition-all ${cardClass(item)}`}
              >
                {matched.has(item.id) && <CheckCircle2 className="w-3 h-3 inline mr-1 text-green-500" />}
                <span className="line-clamp-3">{item.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function FlashCards() {
  const [activeDeck, setActiveDeck] = useState(DECKS[0]);
  const [mode, setMode] = useState("flash"); // "flash" | "match"
  const [cardIndex, setCardIndex] = useState(0);
  const [shuffled, setShuffled] = useState(DECKS[0].cards);

  const selectDeck = (deck) => {
    setActiveDeck(deck);
    setCardIndex(0);
    setShuffled(deck.cards);
    setMode("flash");
  };

  const doShuffle = () => {
    setShuffled(s => shuffle(s));
    setCardIndex(0);
  };

  const prev = () => setCardIndex(i => Math.max(0, i - 1));
  const next = () => setCardIndex(i => Math.min(shuffled.length - 1, i + 1));

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stone-900">Memory Cards</h2>
        <p className="text-stone-500 mt-1 text-sm">Study key Buddhist concepts — flip cards or test yourself with the match game.</p>
      </div>

      {/* Deck picker */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {DECKS.map(deck => (
          <button
            key={deck.id}
            onClick={() => selectDeck(deck)}
            className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
              activeDeck.id === deck.id
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
            }`}
          >
            <span>{deck.emoji}</span>
            <span className="whitespace-nowrap">{deck.name}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeDeck.id === deck.id ? "bg-white/20 text-white" : "bg-stone-100 text-stone-400"}`}>
              {deck.cards.length}
            </span>
          </button>
        ))}
      </div>

      {/* Mode toggle */}
      <div className="flex items-center bg-stone-100 rounded-xl p-1 gap-1 mb-6 w-fit">
        <button
          onClick={() => setMode("flash")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === "flash" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
        >
          <Layers className="w-4 h-4" /> Flashcards
        </button>
        <button
          onClick={() => setMode("match")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === "match" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
        >
          <Puzzle className="w-4 h-4" /> Match Game
        </button>
      </div>

      {/* Deck title bar */}
      <div className={`flex items-center gap-3 bg-gradient-to-r ${activeDeck.color} text-white rounded-xl px-4 py-3 mb-6`}>
        <span className="text-xl">{activeDeck.emoji}</span>
        <div>
          <p className="font-semibold text-sm">{activeDeck.name}</p>
          <p className="text-xs text-white/70">{activeDeck.cards.length} cards</p>
        </div>
      </div>

      {/* Flash card mode */}
      {mode === "flash" && (
        <div>
          <FlipCard card={shuffled[cardIndex]} index={cardIndex} total={shuffled.length} />

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={prev}
              disabled={cardIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={doShuffle}
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" /> Shuffle
            </button>
            <button
              onClick={next}
              disabled={cardIndex === shuffled.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-5">
            {shuffled.map((_, i) => (
              <button
                key={i}
                onClick={() => setCardIndex(i)}
                className={`rounded-full transition-all ${i === cardIndex ? "w-4 h-2 bg-amber-500" : "w-2 h-2 bg-stone-200 hover:bg-stone-300"}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Match game mode */}
      {mode === "match" && (
        <MatchGame key={activeDeck.id} deck={activeDeck} />
      )}
    </div>
  );
}
