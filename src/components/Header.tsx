import { Cloud, Moon, Sun, Flame, Brain, Target, AlertTriangle, BookOpen } from "lucide-react";
import type { ViewName, Theme } from "@/types";

interface HeaderProps {
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
  streak: number;
  totalAnswered: number;
  readinessScore: number;
  theme: Theme;
  onToggleTheme: () => void;
}

const NAV_ITEMS: { key: ViewName; label: string; icon: typeof Cloud }[] = [
  { key: "dashboard", label: "Dashboard", icon: Cloud },
  { key: "quiz", label: "Practice Quiz", icon: Brain },
  { key: "flashcards", label: "Flashcards", icon: Target },
  { key: "syllabus", label: "Study Guide", icon: BookOpen },
];

const NAV_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  quiz: "Practice Quiz",
  flashcards: "Flashcards",
  syllabus: "Study Guide",
};

export default function Header({
  currentView,
  onNavigate,
  streak,
  totalAnswered,
  readinessScore,
  theme,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
      {/* Compliance banner */}
      <div className="flex items-center justify-center gap-2 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 px-4 py-1.5">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="text-xs font-medium text-amber-800 dark:text-amber-300 text-center">
          Unofficial Community Practice Tool — Not affiliated with Microsoft
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500/30 rounded-xl blur-lg group-hover:bg-brand-500/50 transition-colors" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Cloud className="w-5.5 h-5.5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <h1 className="text-base font-bold leading-tight text-slate-900 dark:text-white">
                CloudPrep
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                AZ-900 Assistant
              </p>
            </div>
          </button>

          {/* Nav */}
          <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Stats + theme */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-3 mr-1">
              <StatChip icon={Flame} label="Streak" value={`${streak}d`} color="text-orange-500" />
              <StatChip icon={Brain} label="Answered" value={totalAnswered.toString()} color="text-brand-500" />
              <StatChip icon={Target} label="Readiness" value={`${readinessScore}%`} color="text-emerald-500" />
            </div>
            <button
              onClick={onToggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile stats */}
        <div className="flex items-center justify-center gap-4 py-2 lg:hidden border-t border-slate-100 dark:border-slate-900">
          <StatChip icon={Flame} label="Streak" value={`${streak}d`} color="text-orange-500" />
          <StatChip icon={Brain} label="Answered" value={totalAnswered.toString()} color="text-brand-500" />
          <StatChip icon={Target} label="Readiness" value={`${readinessScore}%`} color="text-emerald-500" />
        </div>
      </div>
    </header>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Cloud;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}:</span>
      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{value}</span>
    </div>
  );
}

export { NAV_LABELS };
