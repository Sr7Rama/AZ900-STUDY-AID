import { useState, useCallback } from "react";
import type { ViewName, Domain } from "@/types";
import { useTheme } from "@/hooks/useTheme";
import {
  useProgress,
  getWeightedReadinessScore,
  getStreak,
} from "@/hooks/useProgress";
import { SAMPLE_QUESTIONS, SAMPLE_FLASHCARDS } from "@/data/sampleData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Dashboard from "@/components/Dashboard";
import QuizModule from "@/components/QuizModule";
import FlashcardModule from "@/components/FlashcardModule";
import SyllabusGuide from "@/components/SyllabusGuide";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    progress,
    addQuizAttempt,
    toggleBookmark,
    markFlashcardKnown,
    markFlashcardReview,
    resetProgress,
  } = useProgress();

  const [view, setView] = useState<ViewName>("dashboard");
  const [smartDomain, setSmartDomain] = useState<Domain | null>(null);

  const handleNavigate = useCallback((v: ViewName) => setView(v), []);

  const handleStartSmartPractice = useCallback(() => {
    // Find weakest domain
    const domainKeys: Domain[] = ["cloud-concepts", "architecture-services", "management-governance"];
    const stats = domainKeys.map((d) => {
      const attempts = progress.quizAttempts.filter((a) => a.domain === d);
      const accuracy = attempts.length > 0 ? attempts.filter((a) => a.isCorrect).length / attempts.length : 1;
      return { domain: d, accuracy, hasData: attempts.length > 0 };
    });
    // Pick the domain with data and lowest accuracy, or the one without data
    const withData = stats.filter((s) => s.hasData);
    const target = withData.length > 0
      ? withData.sort((a, b) => a.accuracy - b.accuracy)[0].domain
      : domainKeys[0];
    setSmartDomain(target);
    setView("quiz");
  }, [progress.quizAttempts]);

  const readinessScore = getWeightedReadinessScore(progress.quizAttempts);
  const streak = getStreak(progress.quizAttempts);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header
        currentView={view}
        onNavigate={handleNavigate}
        streak={streak}
        totalAnswered={progress.quizAttempts.length}
        readinessScore={readinessScore}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1">
        {view === "dashboard" && (
          <Dashboard
            attempts={progress.quizAttempts}
            bookmarks={progress.bookmarks}
            flashcardReviewCount={progress.flashcardReview.length}
            onStartSmartPractice={handleStartSmartPractice}
            onNavigate={handleNavigate}
          />
        )}

        {view === "quiz" && (
          <QuizModule
            questions={SAMPLE_QUESTIONS}
            bookmarks={progress.bookmarks}
            onToggleBookmark={toggleBookmark}
            onAddAttempt={addQuizAttempt}
            smartDomain={smartDomain}
            onSmartComplete={() => setSmartDomain(null)}
          />
        )}

        {view === "flashcards" && (
          <FlashcardModule
            flashcards={SAMPLE_FLASHCARDS}
            reviewCards={progress.flashcardReview}
            knownCards={progress.flashcardKnown}
            onMarkKnown={markFlashcardKnown}
            onMarkReview={markFlashcardReview}
          />
        )}

        {view === "syllabus" && <SyllabusGuide />}
      </main>

      <Footer onReset={resetProgress} />
    </div>
  );
}
