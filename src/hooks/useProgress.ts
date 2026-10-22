import { useState, useEffect, useCallback } from "react";
import type { ProgressState, QuizProgress, Domain } from "@/types";

const STORAGE_KEY = "cloudprep-az900-progress";

const EMPTY_STATE: ProgressState = {
  quizAttempts: [],
  bookmarks: [],
  flashcardReview: [],
  flashcardKnown: [],
};

function loadState(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as ProgressState;
    return {
      quizAttempts: parsed.quizAttempts ?? [],
      bookmarks: parsed.bookmarks ?? [],
      flashcardReview: parsed.flashcardReview ?? [],
      flashcardKnown: parsed.flashcardKnown ?? [],
    };
  } catch {
    return EMPTY_STATE;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // storage full or unavailable — ignore
    }
  }, [progress]);

  const addQuizAttempt = useCallback((attempt: QuizProgress) => {
    setProgress((prev) => ({
      ...prev,
      quizAttempts: [...prev.quizAttempts, attempt],
    }));
  }, []);

  const toggleBookmark = useCallback((questionId: string) => {
    setProgress((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.includes(questionId)
        ? prev.bookmarks.filter((id) => id !== questionId)
        : [...prev.bookmarks, questionId],
    }));
  }, []);

  const markFlashcardKnown = useCallback((cardId: string) => {
    setProgress((prev) => ({
      ...prev,
      flashcardReview: prev.flashcardReview.filter((id) => id !== cardId),
      flashcardKnown: prev.flashcardKnown.includes(cardId)
        ? prev.flashcardKnown
        : [...prev.flashcardKnown, cardId],
    }));
  }, []);

  const markFlashcardReview = useCallback((cardId: string) => {
    setProgress((prev) => ({
      ...prev,
      flashcardKnown: prev.flashcardKnown.filter((id) => id !== cardId),
      flashcardReview: prev.flashcardReview.includes(cardId)
        ? prev.flashcardReview
        : [...prev.flashcardReview, cardId],
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(EMPTY_STATE);
  }, []);

  return {
    progress,
    addQuizAttempt,
    toggleBookmark,
    markFlashcardKnown,
    markFlashcardReview,
    resetProgress,
  };
}

export function getDomainAccuracy(
  attempts: QuizProgress[],
  domain: Domain
): { attempted: number; correct: number; accuracy: number } {
  const domainAttempts = attempts.filter((a) => a.domain === domain);
  const attempted = domainAttempts.length;
  const correct = domainAttempts.filter((a) => a.isCorrect).length;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  return { attempted, correct, accuracy };
}

export function getOverallAccuracy(attempts: QuizProgress[]): number {
  if (attempts.length === 0) return 0;
  const correct = attempts.filter((a) => a.isCorrect).length;
  return Math.round((correct / attempts.length) * 100);
}

const DOMAIN_WEIGHTS: Record<Domain, number> = {
  "cloud-concepts": 0.3,
  "architecture-services": 0.35,
  "management-governance": 0.35,
};

export function getWeightedReadinessScore(attempts: QuizProgress[]): number {
  if (attempts.length === 0) return 0;

  let score = 0;
  let totalWeight = 0;

  for (const domain of Object.keys(DOMAIN_WEIGHTS) as Domain[]) {
    const domainAttempts = attempts.filter((a) => a.domain === domain);
    if (domainAttempts.length > 0) {
      const accuracy =
        domainAttempts.filter((a) => a.isCorrect).length / domainAttempts.length;
      score += accuracy * DOMAIN_WEIGHTS[domain] * 100;
      totalWeight += DOMAIN_WEIGHTS[domain];
    }
  }

  if (totalWeight === 0) return 0;
  return Math.round(score / totalWeight);
}

export function getStreak(attempts: QuizProgress[]): number {
  if (attempts.length === 0) return 0;
  const sorted = [...attempts].sort((a, b) => b.timestamp - a.timestamp);
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get unique days from attempts
  const days = new Set<string>();
  for (const a of sorted) {
    const d = new Date(a.timestamp);
    d.setHours(0, 0, 0, 0);
    days.add(d.toISOString().slice(0, 10));
  }

  // Count consecutive days from today backwards
  const cursor = new Date(today);
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getReadinessStatus(accuracy: number): {
  label: string;
  color: string;
  bg: string;
} {
  if (accuracy >= 80)
    return { label: "Exam Ready", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500" };
  if (accuracy >= 60)
    return { label: "On Track", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500" };
  return { label: "Needs Practice", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500" };
}
