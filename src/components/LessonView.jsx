import { useState } from "react";
import { ArrowLeft, CheckCircle, BookOpen, ExternalLink, ScrollText } from "lucide-react";

// ── Inline parser: [text](url), **bold**, *italic* ─────────────────────────
function parseInline(text) {
  const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  const parts = [];
  let lastIndex = 0;
  let key = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[0].startsWith("[")) {
      parts.push(
        <a
          key={key++}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-900 font-medium"
        >
          {match[2]}
        </a>
      );
    } else if (match[0].startsWith("**")) {
      parts.push(
        <strong key={key++} className="font-semibold text-stone-900">
          {match[4]}
        </strong>
      );
    } else {
      parts.push(
        <em key={key++} className="italic text-stone-600">
          {match[5]}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

// ── Inline image with graceful fallback ────────────────────────────────────
function ImageBlock({ src, alt }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className="my-6 rounded-xl bg-stone-100 border border-stone-200 p-6 text-center text-stone-400">
        <span className="text-3xl">🖼️</span>
        <p className="text-sm mt-2 italic">{alt}</p>
      </div>
    );
  }
  return (
    <figure className="my-6">
      <img
        src={src}
        alt={alt}
        onError={() => setErr(true)}
        loading="lazy"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        className="w-full rounded-xl shadow-md object-cover max-h-80"
      />
      <figcaption className="text-center text-xs text-stone-400 mt-2 italic">{alt}</figcaption>
    </figure>
  );
}

// ── Main content formatter ─────────────────────────────────────────────────
function formatContent(text) {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Horizontal rule ---
    if (line.trim() === "---") {
      elements.push(<hr key={key++} className="my-6 border-stone-200" />);
      i++;
      continue;
    }

    // Image ![caption](url)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      elements.push(<ImageBlock key={key++} alt={imgMatch[1]} src={imgMatch[2]} />);
      i++;
      continue;
    }

    // Table rows starting with |
    if (line.trim().startsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines.filter((l) => !/^\|[-| :]+\|$/.test(l.trim()));
      elements.push(
        <div key={key++} className="my-5 overflow-x-auto rounded-xl border border-stone-200 shadow-sm">
          <table className="w-full text-sm">
            <tbody>
              {rows.map((row, ri) => {
                const cells = row.split("|").slice(1, -1);
                return (
                  <tr key={ri} className={ri === 0 ? "bg-stone-100" : ri % 2 === 0 ? "bg-stone-50/50" : "bg-white"}>
                    {cells.map((cell, ci) =>
                      ri === 0 ? (
                        <th key={ci} className="px-4 py-2.5 font-semibold text-stone-800 text-left border-b border-stone-200 whitespace-nowrap">
                          {parseInline(cell.trim())}
                        </th>
                      ) : (
                        <td key={ci} className="px-4 py-2.5 text-stone-600 border-b border-stone-100">
                          {parseInline(cell.trim())}
                        </td>
                      )
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Blockquote > text
    if (line.startsWith("> ")) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote key={key++} className="my-5 pl-4 border-l-4 border-amber-400 bg-amber-50/70 py-3 pr-4 rounded-r-xl">
          {quoteLines.map((ql, qi) => (
            <p key={qi} className="italic text-stone-700 leading-relaxed">
              {parseInline(ql)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Full-line heading **text**
    if (/^\*\*[^*]+\*\*$/.test(line.trim())) {
      elements.push(
        <h4 key={key++} className="font-bold text-stone-800 text-lg mt-6 mb-1">
          {line.trim().slice(2, -2)}
        </h4>
      );
      i++;
      continue;
    }

    // List items - (consecutive)
    if (line.startsWith("- ")) {
      const listLines = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        listLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} className="my-3 space-y-1.5 ml-1">
          {listLines.map((ll, li) => (
            <li key={li} className="flex items-start gap-2.5 text-stone-600 leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
              <span>{parseInline(ll)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      elements.push(<div key={key++} className="h-3" />);
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={key++} className="text-stone-600 leading-relaxed">
        {parseInline(line)}
      </p>
    );
    i++;
  }

  return elements;
}

// ── Sutra card ─────────────────────────────────────────────────────────────
function SutraCard({ sutra }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <a
      href={sutra.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 hover:border-amber-300 transition-all group"
    >
      {sutra.image && !imgErr ? (
        <img
          src={sutra.image}
          alt={sutra.title}
          onError={() => setImgErr(true)}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0 shadow-sm"
        />
      ) : (
        <div className="w-20 h-20 rounded-lg bg-amber-200/60 flex items-center justify-center flex-shrink-0">
          <ScrollText className="w-8 h-8 text-amber-600" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-stone-900 text-sm leading-tight">{sutra.title}</p>
            {sutra.subtitle && <p className="text-xs text-amber-700 font-medium mt-0.5">{sutra.subtitle}</p>}
          </div>
          <ExternalLink className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5 group-hover:text-amber-700 transition-colors" />
        </div>
        {sutra.collection && (
          <p className="text-xs text-stone-400 mt-1 font-mono">{sutra.collection}</p>
        )}
        {sutra.description && (
          <p className="text-xs text-stone-500 mt-1.5 leading-relaxed line-clamp-2">{sutra.description}</p>
        )}
      </div>
    </a>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function LessonView({ module, lesson, isComplete, onComplete, onBack }) {
  const [done, setDone] = useState(isComplete);

  const handleComplete = () => {
    setDone(true);
    onComplete(lesson.id);
  };

  const hasSutras = lesson.sutras && lesson.sutras.length > 0;
  const hasRefs = lesson.references && lesson.references.length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-stone-500 hover:text-stone-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to module
      </button>

      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-gradient-to-r ${module.color} text-white`}
      >
        <BookOpen className="w-3.5 h-3.5" />
        {module.title}
      </div>

      <h1 className="text-3xl font-bold text-stone-900 mb-8">{lesson.title}</h1>

      {/* Main content */}
      <div className="space-y-1 mb-10">{formatContent(lesson.content)}</div>

      {/* Original Texts & Sutras */}
      {hasSutras && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <ScrollText className="w-4 h-4 text-amber-600" />
            <h3 className="font-semibold text-stone-800 text-sm uppercase tracking-widest">
              Original Texts & Sutras
            </h3>
          </div>
          <div className="space-y-3">
            {lesson.sutras.map((s, i) => (
              <SutraCard key={i} sutra={s} />
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {hasRefs && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <ExternalLink className="w-4 h-4 text-stone-400" />
            <h3 className="font-semibold text-stone-500 text-xs uppercase tracking-widest">
              Further Reading
            </h3>
          </div>
          <div className="space-y-1.5">
            {lesson.references.map((ref, i) => (
              <a
                key={i}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900 underline decoration-amber-300 underline-offset-2"
              >
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                {ref.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Completion */}
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
