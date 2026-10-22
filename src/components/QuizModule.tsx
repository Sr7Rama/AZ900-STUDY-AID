import { useState, useMemo, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Bookmark,
  BookmarkCheck,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Award,
  Target,
} from "lucide-react";
import type { QuizQuestion, Domain, QuizProgress } from "@/types";
import { DOMAIN_LABELS, DOMAINS } from "@/types";

interface QuizModuleProps {
  questions: QuizQuestion[];
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  onAddAttempt: (attempt: QuizProgress) => void;
  smartDomain?: Domain | null;
  onSmartComplete: () => void;
}

type FilterOption = "all" | Domain;

const FILTER_OPTIONS: { key: FilterOption; label: string }[] = [
  { key: "all", label: "All Domains" },
  { key: "cloud-concepts", label: "Cloud Concepts" },
  { key: "architecture-services", label: "Azure Architecture" },
  { key: "management-governance", label: "Governance & Management" },
];

const DIFFICULTY_STYLES: Record<string, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400" },
  intermediate: { label: "Intermediate", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400" },
  advanced: { label: "Advanced", color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400" },
};

const QUIZ_LENGTH = 6;

export default function QuizModule({
  questions,
  bookmarks,
  onToggleBookmark,
  onAddAttempt,
  smartDomain,
  onSmartComplete,
}: QuizModuleProps) {
  const [filter, setFilter] = useState<FilterOption>("all");
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionAnswered, setSessionAnswered] = useState(0);

  // Start smart practice
  useEffect(() => {
    if (smartDomain) {
      setFilter(smartDomain);
      setActiveFilter(smartDomain);
      startQuiz(smartDomain);
      onSmartComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smartDomain]);

  const availableQuestions = useMemo(() => {
    if (activeFilter === "all") return questions;
    return questions.filter((q) => q.domain === activeFilter);
  }, [questions, activeFilter]);

  function shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function startQuiz(domain?: FilterOption) {
    const pool = domain && domain !== "all" ? questions.filter((q) => q.domain === domain) : questions;
    const shuffled = shuffle(pool).slice(0, Math.min(QUIZ_LENGTH, pool.length));
    setQuizQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setSessionCorrect(0);
    setSessionAnswered(0);
    setQuizStarted(true);
  }

  function handleSelectOption(optionId: string) {
    if (answered) return;
    const question = quizQuestions[currentIndex];
    const option = question.options.find((o) => o.id === optionId);
    if (!option) return;

    setSelectedOption(optionId);
    setAnswered(true);
    setSessionAnswered((prev) => prev + 1);
    if (option.isCorrect) setSessionCorrect((prev) => prev + 1);

    onAddAttempt({
      questionId: question.id,
      domain: question.domain,
      topic: question.topic,
      selectedOptionId: optionId,
      isCorrect: option.isCorrect,
      timestamp: Date.now(),
    });
  }

  function handleNext() {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      // Quiz finished
      setQuizStarted(false);
    }
  }

  // Filter screen
  if (!quizStarted) {
    return (
      <div className="tab-content max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-brand-500/10 items-center justify-center mb-4">
            <Target className="w-8 h-8 text-brand-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Practice Quiz Builder
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Select a domain or practice across all areas. Each session draws up to 6 random questions.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {FILTER_OPTIONS.map((opt) => {
            const count = opt.key === "all" ? questions.length : questions.filter((q) => q.domain === opt.key).length;
            const selected = filter === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setFilter(opt.key)}
                className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                  selected
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <p className="font-semibold text-slate-900 dark:text-white">{opt.label}</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  {count} question{count === 1 ? "" : "s"}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => {
              setActiveFilter(filter);
              startQuiz(filter);
            }}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-brand-500/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
          >
            Start Quiz
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Domain accuracy preview */}
        {questions.length > 0 && (
          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {DOMAINS.map((d) => {
              // Use the raw attempts from props via getDomainAccuracy — but we don't have attempts here
              return (
                <div
                  key={d.key}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-center"
                >
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    {d.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{d.weight} weight</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Quiz complete screen
  if (sessionAnswered === quizQuestions.length && !answered) {
    const score = Math.round((sessionCorrect / quizQuestions.length) * 100);
    return (
      <div className="tab-content max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
          <div className="inline-flex w-20 h-20 rounded-full bg-emerald-500/10 items-center justify-center mb-4">
            <Award className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Quiz Complete!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            You answered {sessionCorrect} out of {quizQuestions.length} correctly
          </p>
          <div className="text-5xl font-extrabold text-brand-600 dark:text-brand-400 mb-6">
            {score}%
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => startQuiz(activeFilter)}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              New Quiz
            </button>
            <button
              onClick={() => setQuizStarted(false)}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-6 py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Back to Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active quiz
  const question = quizQuestions[currentIndex];
  const progress = ((currentIndex + (answered ? 1 : 0)) / quizQuestions.length) * 100;
  const isBookmarked = bookmarks.includes(question.id);
  const difficulty = DIFFICULTY_STYLES[question.difficulty];

  return (
    <div className="tab-content max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-slate-600 dark:text-slate-400">
            Question {currentIndex + 1} of {quizQuestions.length}
          </span>
          <span className="text-slate-400 dark:text-slate-500">
            {sessionCorrect}/{sessionAnswered} correct
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div
        key={question.id}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm animate-slide-up"
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400">
              {DOMAIN_LABELS[question.domain]}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${difficulty.color}`}>
              {difficulty.label}
            </span>
          </div>
          <button
            onClick={() => onToggleBookmark(question.id)}
            className={`shrink-0 p-1.5 rounded-lg transition-colors ${
              isBookmarked
                ? "text-amber-500 bg-amber-50 dark:bg-amber-950/40"
                : "text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            }`}
            aria-label="Bookmark question"
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-relaxed mb-6">
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const showCorrect = answered && option.isCorrect;
            const showIncorrect = answered && isSelected && !option.isCorrect;

            let className =
              "w-full text-left flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ";

            if (!answered) {
              className += "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-950/20 cursor-pointer";
            } else if (showCorrect) {
              className += "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30";
            } else if (showIncorrect) {
              className += "border-rose-500 bg-rose-50 dark:bg-rose-950/30";
            } else {
              className += "border-slate-200 dark:border-slate-800 opacity-50";
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                disabled={answered}
                className={className}
              >
                <span
                  className={`w-7 h-7 shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                    !answered
                      ? "border-slate-300 dark:border-slate-600 text-slate-400"
                      : showCorrect
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : showIncorrect
                      ? "border-rose-500 bg-rose-500 text-white"
                      : "border-slate-300 dark:border-slate-700 text-slate-400"
                  }`}
                >
                  {option.id.toUpperCase()}
                </span>
                <span className="flex-1 text-sm sm:text-base text-slate-800 dark:text-slate-200">
                  {option.text}
                </span>
                {showCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                {showIncorrect && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div className="mt-6 animate-slide-up space-y-4">
            <div
              className={`p-4 rounded-xl border ${
                question.options.find((o) => o.id === selectedOption)?.isCorrect
                  ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20"
                  : "border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {question.options.find((o) => o.id === selectedOption)?.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500" />
                )}
                <span className="font-bold text-slate-900 dark:text-white">
                  {question.options.find((o) => o.id === selectedOption)?.isCorrect
                    ? "Correct!"
                    : "Not quite —"}
                </span>
              </div>
              <div className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Why this is correct
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {question.explanation}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-slate-900 dark:text-white">Key Exam Tip</span>
              </div>
              <div className="mb-1 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                Remember this for the exam
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {question.examTip}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
            >
              {currentIndex < quizQuestions.length - 1 ? "Next Question" : "See Results"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
