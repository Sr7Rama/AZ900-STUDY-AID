import { useState } from "react";
import {
  RotateCw,
  Check,
  X,
  Layers,
  Filter,
  Sparkles,
} from "lucide-react";
import type { Flashcard } from "@/types";
import { DOMAIN_LABELS } from "@/types";

interface FlashcardModuleProps {
  flashcards: Flashcard[];
  reviewCards: string[];
  knownCards: string[];
  onMarkKnown: (id: string) => void;
  onMarkReview: (id: string) => void;
}

type ViewMode = "all" | "flagged";

const DOMAIN_DOT: Record<string, string> = {
  "cloud-concepts": "bg-brand-500",
  "architecture-services": "bg-emerald-500",
  "management-governance": "bg-amber-500",
};

export default function FlashcardModule({
  flashcards,
  reviewCards,
  knownCards,
  onMarkKnown,
  onMarkReview,
}: FlashcardModuleProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [flippedId, setFlippedId] = useState<string | null>(null);

  const visibleCards =
    viewMode === "flagged"
      ? flashcards.filter((c) => reviewCards.includes(c.id))
      : flashcards;

  function handleFlip(id: string) {
    setFlippedId(flippedId === id ? null : id);
  }

  function handleKnown(id: string) {
    onMarkKnown(id);
    setFlippedId(null);
  }

  function handleReview(id: string) {
    onMarkReview(id);
    setFlippedId(null);
  }

  return (
    <div className="tab-content max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex w-16 h-16 rounded-2xl bg-brand-500/10 items-center justify-center mb-4">
          <Layers className="w-8 h-8 text-brand-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Flashcards
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Tap a card to flip it. Self-assess to build your review deck.
        </p>
      </div>

      {/* Filter toggle + stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
          <button
            onClick={() => setViewMode("all")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === "all"
                ? "bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <Filter className="w-4 h-4" />
            All Cards ({flashcards.length})
          </button>
          <button
            onClick={() => setViewMode("flagged")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === "flagged"
                ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <X className="w-4 h-4" />
            Flagged ({reviewCards.length})
          </button>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Check className="w-4 h-4" />
            {knownCards.length} known
          </span>
          <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <X className="w-4 h-4" />
            {reviewCards.length} to review
          </span>
        </div>
      </div>

      {/* Cards grid */}
      {visibleCards.length === 0 ? (
        <div className="text-center py-16">
          <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">
            {viewMode === "flagged"
              ? "No flagged cards. Mark cards as 'Need Review' to build your study deck."
              : "No flashcards available."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleCards.map((card) => {
            const isFlipped = flippedId === card.id;
            const isKnown = knownCards.includes(card.id);
            const isReview = reviewCards.includes(card.id);

            return (
              <div
                key={card.id}
                className="flip-card h-64 cursor-pointer"
                onClick={() => handleFlip(card.id)}
              >
                <div
                  className={`flip-card-inner ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
                  style={{ transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)", transformStyle: "preserve-3d" }}
                >
                  {/* Front */}
                  <div
                    className="flip-card-front bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow"
                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <span className={`w-2 h-2 rounded-full ${DOMAIN_DOT[card.domain]}`} />
                        {DOMAIN_LABELS[card.domain]}
                      </span>
                      {isKnown && (
                        <span className="text-xs font-medium text-emerald-500">Known</span>
                      )}
                      {isReview && (
                        <span className="text-xs font-medium text-rose-500">Review</span>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {card.term}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Azure terminology
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                      <RotateCw className="w-3 h-3" />
                      Tap to flip
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className="flip-card-back bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 flex flex-col text-white shadow-sm"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-brand-200">
                        {card.term}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-brand-200">
                        <span className={`w-2 h-2 rounded-full ${DOMAIN_DOT[card.domain]}`} />
                        {DOMAIN_LABELS[card.domain]}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      <p className="text-sm leading-relaxed mb-3">{card.definition}</p>
                      <div className="border-t border-white/20 pt-2">
                        <p className="text-xs font-semibold text-brand-200 uppercase tracking-wide mb-1">
                          Use Case
                        </p>
                        <p className="text-xs text-brand-100 leading-relaxed">{card.useCase}</p>
                      </div>
                    </div>

                    {/* Self-assessment controls */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleKnown(card.id);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500/90 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Got It
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReview(card.id);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-rose-500/90 hover:bg-rose-500 text-white text-sm font-semibold transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Need Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
