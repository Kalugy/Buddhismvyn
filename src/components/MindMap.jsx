import { useState } from "react";
import { RotateCcw, Maximize2 } from "lucide-react";

// ── Layout constants ─────────────────────────────────────────────────────────
const W = 1200, H = 760;

// ── Node definitions ─────────────────────────────────────────────────────────
const NODES = [
  // ── Centre ──
  { id: "root", label: "Buddhism", emoji: "☸️", color: "#f59e0b", glow: "#fcd34d", size: 52,
    x: 600, y: 385,
    summary: "A 2,500-year-old path of wisdom and liberation founded in ancient India by Siddhartha Gautama — the Awakened One. The word 'Buddha' means 'one who has awakened.' Buddhism has around 500 million practitioners today across all cultures and continents." },

  // ── Level 1 ──
  { id: "buddha", label: "The Buddha", emoji: "🧘", color: "#8b5cf6", glow: "#c4b5fd", size: 38,
    x: 600, y: 165,
    summary: "Born Siddhartha Gautama (~563 BCE) in Lumbini, Nepal. A prince who left his palace after encountering human suffering. After 6 years as an ascetic and 49 days meditating under the Bodhi tree, he awakened. He taught for 45 years until his death at 80." },
  { id: "teachings", label: "Core Teachings", emoji: "📖", color: "#3b82f6", glow: "#93c5fd", size: 38,
    x: 900, y: 265,
    summary: "The Dharma — the Buddha's teachings. At its heart: the Four Noble Truths (suffering exists, has a cause, can end, there is a path) and the Noble Eightfold Path. Every Buddhist school, regardless of tradition, accepts these as foundational." },
  { id: "schools", label: "Three Schools", emoji: "🏛️", color: "#10b981", glow: "#6ee7b7", size: 38,
    x: 875, y: 530,
    summary: "Buddhism developed three major branches: Theravada (The Elders — oldest, Pali Canon, Southeast Asia), Mahayana (Great Vehicle — Bodhisattva ideal, East Asia), and Vajrayana (Diamond Vehicle — Tantra, Tibet & Mongolia). Three paths, one summit." },
  { id: "practice", label: "Daily Practice", emoji: "🙏", color: "#f97316", glow: "#fdba74", size: 38,
    x: 325, y: 530,
    summary: "Buddhism is lived, not just believed. Daily practice includes meditation, ethical conduct (the Five Precepts), generosity (dana), chanting, and mindfulness in every action. The path transforms ordinary life — eating, working, speaking — into spiritual practice." },
  { id: "texts", label: "Sacred Texts", emoji: "📜", color: "#ec4899", glow: "#f9a8d4", size: 38,
    x: 300, y: 265,
    summary: "The Buddha's words were memorized and transmitted orally for ~450 years before being written down. Three great canons: the Pali Canon (Theravada), Chinese Canon (Mahayana), and Tibetan Kangyur (Vajrayana). Together they contain thousands of sutras." },

  // ── Level 2: Buddha children ──
  { id: "birth", label: "Birth & Early Life", emoji: "👶", color: "#a78bfa", glow: "#ddd6fe", size: 27,
    x: 415, y: 52,
    summary: "Born to King Suddhodana in Lumbini (~563 BCE). A prophecy declared he would become a great king or a great spiritual teacher. His father sheltered him from suffering — surrounding him with luxury, beauty, and youth — until age 29." },
  { id: "foursights", label: "The Four Sights", emoji: "👁️", color: "#a78bfa", glow: "#ddd6fe", size: 27,
    x: 575, y: 32,
    summary: "At 29, Siddhartha left the palace and encountered: an old man, a sick person, a corpse, and a wandering ascetic at peace. These 'Four Sights' shattered his sheltered worldview and launched his spiritual quest. He left that same night." },
  { id: "enlightenment", label: "Enlightenment", emoji: "✨", color: "#a78bfa", glow: "#ddd6fe", size: 27,
    x: 728, y: 52,
    summary: "After 6 years of asceticism and 49 nights under the Bodhi tree in Bodh Gaya, Siddhartha awakened. He saw directly the arising and passing of all phenomena, the nature of suffering, its cause, and the path to its end. He became the Buddha." },
  { id: "firstsermon", label: "First Sermon", emoji: "🗣️", color: "#a78bfa", glow: "#ddd6fe", size: 27,
    x: 840, y: 118,
    summary: "Five days after enlightenment, the Buddha taught his five former companions at the Deer Park in Sarnath. The Dhammacakkappavattana Sutta — 'Setting the Wheel of Dhamma in Motion' — was the first teaching. This moment is called the First Turning of the Wheel." },

  // ── Level 2: Teachings children ──
  { id: "fourtruths", label: "Four Noble Truths", emoji: "☸️", color: "#60a5fa", glow: "#bfdbfe", size: 27,
    x: 1058, y: 162,
    summary: "1. Dukkha — life involves suffering and unsatisfactoriness. 2. Samudaya — suffering arises from craving and ignorance. 3. Nirodha — suffering can completely cease. 4. Magga — the Eightfold Path leads to its end. The Buddha's diagnosis and cure of the human condition." },
  { id: "eightfold", label: "Eightfold Path", emoji: "🛤️", color: "#60a5fa", glow: "#bfdbfe", size: 27,
    x: 1082, y: 278,
    summary: "The Middle Way — eight practices covering Wisdom (Right View, Right Intention), Ethics (Right Speech, Right Action, Right Livelihood), and Meditation (Right Effort, Right Mindfulness, Right Concentration). A complete, integrated system for awakening." },
  { id: "threemarks", label: "Three Marks", emoji: "🔄", color: "#60a5fa", glow: "#bfdbfe", size: 27,
    x: 1048, y: 395,
    summary: "All conditioned existence shares three characteristics: Anicca (impermanence — everything changes), Dukkha (unsatisfactoriness — clinging to what changes causes suffering), Anatta (non-self — there is no fixed, independent, permanent 'I')." },
  { id: "nirvana", label: "Nirvana", emoji: "🕊️", color: "#60a5fa", glow: "#bfdbfe", size: 27,
    x: 918, y: 128,
    summary: "The complete cessation of craving, hatred, and delusion — the end of suffering. Literally 'extinguishing' as a flame that goes out when fuel is consumed. Not nothingness, but profound freedom that doesn't depend on any condition. The goal of all Buddhist practice." },

  // ── Level 2: Schools children ──
  { id: "theravada", label: "Theravada", emoji: "🌿", color: "#34d399", glow: "#a7f3d0", size: 27,
    x: 1052, y: 468,
    summary: "'School of the Elders' — oldest surviving school, uses the Pali Canon. The Arahant (liberated being) is the ideal. Monks rise at 4 AM, go on alms rounds, practice Vipassana meditation. Dominant in Thailand, Sri Lanka, Myanmar, Cambodia, Laos." },
  { id: "mahayana", label: "Mahayana", emoji: "🌺", color: "#34d399", glow: "#a7f3d0", size: 27,
    x: 1060, y: 572,
    summary: "'Great Vehicle' — the Bodhisattva ideal: vowing to achieve Buddhahood for all beings. Heart Sutra, Diamond Sutra, Lotus Sutra. Schools include Zen (Japan/China), Pure Land (reciting Amitabha's name), and Tiantai. Dominant in China, Japan, Korea, Vietnam." },
  { id: "vajrayana", label: "Vajrayana", emoji: "💎", color: "#34d399", glow: "#a7f3d0", size: 27,
    x: 942, y: 650,
    summary: "'Diamond Vehicle' — Tantric Buddhism using mantra (Om Mani Padme Hum), mandala, and deity visualization. Claims awakening in one lifetime. The Dalai Lama leads the Gelug school. Tibetan Book of the Dead originated here. Dominant in Tibet, Bhutan, Mongolia." },

  // ── Level 2: Practice children ──
  { id: "meditation", label: "Meditation", emoji: "🧘", color: "#fb923c", glow: "#fed7aa", size: 27,
    x: 138, y: 452,
    summary: "Bhavana — 'cultivation.' Samatha (calm-abiding: developing concentration) and Vipassana (insight: directly seeing impermanence). The Anapanasati Sutta gives 16 steps from simple breath awareness to full liberation. 10 minutes daily changes the brain measurably in 8 weeks." },
  { id: "karma", label: "Karma & Rebirth", emoji: "🔁", color: "#fb923c", glow: "#fed7aa", size: 27,
    x: 115, y: 558,
    summary: "Karma = intentional action. Every intentional deed plants a seed that ripens as future experience. Craving and ignorance drive the cycle of rebirth (samsara). Ethical action, generosity, and wisdom gradually purify the mind and lead toward liberation." },
  { id: "precepts", label: "Five Precepts", emoji: "🌱", color: "#fb923c", glow: "#fed7aa", size: 27,
    x: 185, y: 650,
    summary: "The ethical foundation for lay Buddhists — renewed each morning as intentions: no killing, no stealing, no sexual misconduct, no false speech, no intoxicants. Not commandments from God but training rules — promises made to yourself. The ground of all practice." },
  { id: "festivals", label: "Sacred Festivals", emoji: "🏮", color: "#fb923c", glow: "#fed7aa", size: 27,
    x: 348, y: 685,
    summary: "Vesak (Buddha's birthday/enlightenment, May full moon — candlelight processions, lanterns) · Obon (Japan, honoring ancestors, floating lanterns on rivers, August) · Losar (Tibetan New Year, February) · Kathina (robe-offering after the Rains Retreat, October–November)." },

  // ── Level 2: Texts children ──
  { id: "palicanon", label: "Pali Canon", emoji: "📚", color: "#f472b6", glow: "#fbcfe8", size: 27,
    x: 132, y: 162,
    summary: "The Tipitaka ('Three Baskets') — oldest complete Buddhist canon. Written down in Sri Lanka ~29 BCE after 450 years of oral transmission. ~40× the length of the Bible. Vinaya (monastic rules), Sutta Pitaka (discourses), Abhidhamma (philosophy). Free at SuttaCentral." },
  { id: "heartsutra", label: "Heart Sutra", emoji: "❤️", color: "#f472b6", glow: "#fbcfe8", size: 27,
    x: 88, y: 275,
    summary: "260 Chinese characters — the most chanted Buddhist text in East Asia. Recited every morning in Zen temples across China, Japan, Korea, Vietnam. 'Form is emptiness. Emptiness is form.' In one page it captures the entire Prajnaparamita philosophy of awakening." },
  { id: "diamondsutra", label: "Diamond Sutra", emoji: "💠", color: "#f472b6", glow: "#fbcfe8", size: 27,
    x: 135, y: 388,
    summary: "The world's oldest complete dated printed book (868 CE, Tang Dynasty China) — found sealed in the Dunhuang caves for 900 years, now in the British Library. A dialogue on non-attachment and the nature of mind. Over 580 years older than Gutenberg's Bible." },
  { id: "lotussutra", label: "Lotus Sutra", emoji: "🌸", color: "#f472b6", glow: "#fbcfe8", size: 27,
    x: 282, y: 112,
    summary: "Central to Japanese and Chinese Buddhism. Its radical claim: every single being — regardless of gender, background, or history — possesses Buddha-nature and will ultimately attain full Buddhahood. No one is excluded. Introduced the concept of 'skillful means' (upaya)." },
];

// ── Children map ─────────────────────────────────────────────────────────────
const CHILDREN = {
  root:      ["buddha", "teachings", "schools", "practice", "texts"],
  buddha:    ["birth", "foursights", "enlightenment", "firstsermon"],
  teachings: ["fourtruths", "eightfold", "threemarks", "nirvana"],
  schools:   ["theravada", "mahayana", "vajrayana"],
  practice:  ["meditation", "karma", "precepts", "festivals"],
  texts:     ["palicanon", "heartsutra", "diamondsutra", "lotussutra"],
};

const NODE_MAP = Object.fromEntries(NODES.map(n => [n.id, n]));
const ALL_IDS  = new Set(NODES.map(n => n.id));

// Build edge list
const EDGES = Object.entries(CHILDREN).flatMap(([pid, kids]) =>
  kids.map(cid => [pid, cid])
);

// ── Component ─────────────────────────────────────────────────────────────────
export default function MindMap() {
  const [unlocked,   setUnlocked]   = useState(() => new Set(["root"]));
  const [active,     setActive]     = useState(null);
  const [justAdded,  setJustAdded]  = useState(() => new Set());

  const handleClick = (id) => {
    const children = CHILDREN[id] || [];
    const newKids  = children.filter(c => !unlocked.has(c));

    if (newKids.length > 0) {
      setUnlocked(prev => new Set([...prev, ...newKids]));
      setJustAdded(new Set(newKids));
      setTimeout(() => setJustAdded(new Set()), 700);
    }
    setActive(prev => (prev === id && newKids.length === 0) ? null : id);
  };

  const reset = () => {
    setUnlocked(new Set(["root"]));
    setActive(null);
    setJustAdded(new Set());
  };

  const showAll = () => {
    setUnlocked(new Set(ALL_IDS));
    setJustAdded(new Set());
    setActive(null);
  };

  const activeNode = active ? NODE_MAP[active] : null;
  const unlockedEdges = EDGES.filter(([a, b]) => unlocked.has(a) && unlocked.has(b));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 gap-3">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-stone-900">Mind Map</h2>
          <p className="text-stone-500 text-sm mt-0.5 hidden sm:block">Click any node to unlock its connections</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full font-mono hidden sm:inline">
            {unlocked.size} / {ALL_IDS.size}
          </span>
          <button
            onClick={reset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-600 hover:bg-stone-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={showAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-900 text-white text-xs hover:bg-stone-700 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Complete All</span>
          </button>
        </div>
      </div>

      {/* SVG canvas – horizontally scrollable on mobile */}
      <p className="text-xs text-stone-400 text-center mb-2 sm:hidden">← Scroll to explore →</p>
      <div className="rounded-2xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-950 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          overflow="visible"
          style={{ display: "block", minWidth: "900px", width: "100%", background: "linear-gradient(135deg, #0c0a09 0%, #111827 100%)" }}
        >
          <defs>
            {/* Dot-grid pattern */}
            <pattern id="dots" width="38" height="38" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.06)" />
            </pattern>
            {/* Glow filters */}
            <filter id="glow-sm" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-md" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="7" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-lg" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="12" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Background dots */}
          <rect width={W} height={H} fill="url(#dots)" />

          {/* Edges */}
          {unlockedEdges.map(([aid, bid]) => {
            const a = NODE_MAP[aid], b = NODE_MAP[bid];
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
            const dx = b.x - a.x, dy = b.y - a.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const cx = mx - (dy / len) * 18, cy = my + (dx / len) * 18;
            return (
              <path
                key={`${aid}-${bid}`}
                d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
                fill="none"
                stroke={a.glow}
                strokeWidth="1.5"
                strokeOpacity="0.3"
                style={{ transition: "stroke-opacity 0.4s" }}
              />
            );
          })}

          {/* Nodes */}
          {NODES.filter(n => unlocked.has(n.id)).map((node, idx) => {
            const isActive  = active === node.id;
            const isNew     = justAdded.has(node.id);
            const hasLocked = (CHILDREN[node.id] || []).some(c => !unlocked.has(c));

            return (
              <g
                key={node.id}
                transform={`translate(${node.x},${node.y})`}
                onClick={() => handleClick(node.id)}
                style={{ cursor: "pointer" }}
                className={isNew ? "node-appear" : ""}
              >
                {/* Active ring */}
                {isActive && (
                  <circle r={node.size + 14} fill="none"
                    stroke={node.glow} strokeWidth="2" strokeOpacity="0.6"
                    filter="url(#glow-sm)" />
                )}
                {/* "Unlock me" faint ring */}
                {hasLocked && !isActive && (
                  <circle r={node.size + 9} fill="none"
                    stroke={node.glow} strokeWidth="1" strokeOpacity="0.22"
                    className="pulse-ring" />
                )}
                {/* Glow halo */}
                <circle r={node.size + 4}
                  fill={node.color}
                  fillOpacity="0.12"
                  filter="url(#glow-md)" />
                {/* Main circle */}
                <circle r={node.size}
                  fill={node.color}
                  fillOpacity={isActive ? 1 : 0.88}
                  filter={isActive ? "url(#glow-lg)" : "url(#glow-sm)"}
                  style={{ transition: "fill-opacity 0.25s" }} />
                {/* Inner lighter ring */}
                <circle r={node.size - 7} fill={node.glow} fillOpacity="0.18" />
                {/* Emoji */}
                <text
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={node.size * 0.78}
                  style={{ userSelect: "none", pointerEvents: "none" }}
                >
                  {node.emoji}
                </text>
                {/* Label */}
                <text
                  y={node.size + 15}
                  textAnchor="middle"
                  fill="white" fillOpacity="0.9"
                  fontSize={node.size > 35 ? "12" : "10.5"}
                  fontWeight="600"
                  fontFamily="system-ui, sans-serif"
                  style={{ userSelect: "none", pointerEvents: "none", letterSpacing: "0.01em" }}
                >
                  {node.label}
                </text>
                {/* "locked children" dot indicator */}
                {hasLocked && (
                  <circle cx={node.size - 6} cy={-(node.size - 6)}
                    r="5" fill="#fbbf24" fillOpacity="0.9" />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info panel */}
      {activeNode && (
        <div
          key={activeNode.id}
          className="mt-4 rounded-2xl bg-white border border-stone-200 shadow-md overflow-hidden"
          style={{ borderLeft: `4px solid ${activeNode.color}` }}
        >
          <div className="p-4 flex items-start gap-4">
            <span className="text-4xl flex-shrink-0 mt-0.5">{activeNode.emoji}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-stone-900 text-base">{activeNode.label}</h3>
                {(CHILDREN[activeNode.id] || []).some(c => !unlocked.has(c)) && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    ✦ has more to unlock
                  </span>
                )}
                {(CHILDREN[activeNode.id] || []).length > 0 &&
                 (CHILDREN[activeNode.id] || []).every(c => unlocked.has(c)) && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    ✓ fully explored
                  </span>
                )}
              </div>
              <p className="text-stone-600 text-sm mt-1.5 leading-relaxed">{activeNode.summary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!activeNode && (
        <p className="text-center text-stone-400 text-sm mt-4">
          {unlocked.size === 1
            ? "Click the ☸️ node to begin exploring"
            : "Click any node to read its summary"}
        </p>
      )}

      {/* Animations */}
      <style>{`
        .node-appear {
          animation: nodeAppear 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          transform-box: fill-box;
          transform-origin: center;
        }
        @keyframes nodeAppear {
          from { opacity: 0; transform: scale(0.15); }
          to   { opacity: 1; transform: scale(1); }
        }
        .pulse-ring {
          animation: pulseRing 2.2s ease-in-out infinite;
        }
        @keyframes pulseRing {
          0%, 100% { stroke-opacity: 0.18; r: 0; }
          50%       { stroke-opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}
