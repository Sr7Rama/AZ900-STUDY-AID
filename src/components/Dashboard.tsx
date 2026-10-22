import {
  Flame,
  Brain,
  Target,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Cloud,
  Server,
  Shield,
  BookOpen,
} from "lucide-react";
import type { ViewName, Domain, QuizProgress } from "@/types";
import { DOMAINS } from "@/types";
import {
  getDomainAccuracy,
  getWeightedReadinessScore,
  getStreak,
  getReadinessStatus,
} from "@/hooks/useProgress";

interface DashboardProps {
  attempts: QuizProgress[];
  bookmarks: string[];
  flashcardReviewCount: number;
  onStartSmartPractice: () => void;
  onNavigate: (view: ViewName) => void;
}

const DOMAIN_ICONS: Record<Domain, typeof Cloud> = {
  "cloud-concepts": Cloud,
  "architecture-services": Server,
  "management-governance": Shield,
};

const DOMAIN_COLORS: Record<Domain, { ring: string; bg: string; text: string }> = {
  "cloud-concepts": {
    ring: "stroke-brand-500",
    bg: "bg-brand-500",
    text: "text-brand-600 dark:text-brand-400",
  },
  "architecture-services": {
    ring: "stroke-emerald-500",
    bg: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  "management-governance": {
    ring: "stroke-amber-500",
    bg: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
  },
};

export default function Dashboard({
  attempts,
  bookmarks,
  flashcardReviewCount,
  onStartSmartPractice,
  onNavigate,
}: DashboardProps) {
  const readinessScore = getWeightedReadinessScore(attempts);
  const totalAnswered = attempts.length;
  const streak = getStreak(attempts);
  const status = getReadinessStatus(readinessScore);

  const domainStats = DOMAINS.map((d) => ({
    ...d,
    stats: getDomainAccuracy(attempts, d.key),
  }));

  // Find weakest domain
  const weakestDomain = domainStats
    .filter((d) => d.stats.attempted > 0)
    .sort((a, b) => a.stats.accuracy - b.stats.accuracy)[0];

  const hasData = totalAnswered > 0;

  return (
    <div className="tab-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero gauge */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Readiness Gauge */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-6">
            Overall Readiness
          </h2>
          <ReadinessGauge score={readinessScore} />
          <div
            className={`mt-6 px-4 py-2 rounded-full text-sm font-bold ${status.color} bg-slate-100 dark:bg-slate-800`}
          >
            {status.label}
          </div>
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 text-center">
            Weighted: Cloud Concepts (30%) + Architecture (35%) + Governance (35%)
          </p>
        </div>

        {/* Quick stats */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          <StatCard
            icon={Flame}
            label="Current Streak"
            value={`${streak} day${streak === 1 ? "" : "s"}`}
            sublabel={streak > 0 ? "Keep it going!" : "Start studying today"}
            color="text-orange-500"
            bg="bg-orange-50 dark:bg-orange-950/30"
            border="border-orange-200 dark:border-orange-900/40"
          />
          <StatCard
            icon={Brain}
            label="Questions Answered"
            value={totalAnswered.toString()}
            sublabel={`${bookmarks.length} bookmarked`}
            color="text-brand-500"
            bg="bg-brand-50 dark:bg-brand-950/30"
            border="border-brand-200 dark:border-brand-900/40"
          />
          <StatCard
            icon={Target}
            label="Readiness Index"
            value={`${readinessScore}%`}
            sublabel={hasData ? "Weighted by domain importance" : "No attempts yet"}
            color="text-emerald-500"
            bg="bg-emerald-50 dark:bg-emerald-950/30"
            border="border-emerald-200 dark:border-emerald-900/40"
          />
          <StatCard
            icon={AlertCircle}
            label="Cards to Review"
            value={flashcardReviewCount.toString()}
            sublabel="Need attention"
            color="text-rose-500"
            bg="bg-rose-50 dark:bg-rose-950/30"
            border="border-rose-200 dark:border-rose-900/40"
          />
        </div>
      </div>

      {/* Smart Practice CTA */}
      {weakestDomain && weakestDomain.stats.accuracy < 80 && (
        <div className="flex items-center justify-between bg-gradient-to-r from-brand-500 to-brand-700 rounded-2xl p-6 text-white shadow-lg shadow-brand-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Focus: {weakestDomain.label}</h3>
              <p className="text-sm text-brand-100">
                Your accuracy is {weakestDomain.stats.accuracy}% — let's bring this up.
              </p>
            </div>
          </div>
          <button
            onClick={onStartSmartPractice}
            className="flex items-center gap-2 bg-white text-brand-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-colors whitespace-nowrap"
          >
            Start Weak-Area Practice
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Domain breakdown */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Domain Breakdown
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {domainStats.map((d) => {
            const Icon = DOMAIN_ICONS[d.key];
            const colors = DOMAIN_COLORS[d.key];
            const accuracy = d.stats.attempted > 0 ? d.stats.accuracy : 0;
            const statusInfo = getReadinessStatus(accuracy);

            return (
              <div
                key={d.key}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${colors.bg}/10 flex items-center justify-center`}
                  >
                    <Icon className={`w-5.5 h-5.5 ${colors.text}`} />
                  </div>
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                    {d.weight}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{d.label}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                  {d.description.slice(0, 80)}...
                </p>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      {d.stats.attempted} answered
                    </span>
                    <span className={`font-bold ${colors.text}`}>
                      {d.stats.attempted > 0 ? `${accuracy}%` : "—"}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colors.bg} transition-all duration-700 ease-out`}
                      style={{ width: `${d.stats.attempted > 0 ? accuracy : 0}%` }}
                    />
                  </div>
                  {d.stats.attempted > 0 && (
                    <div
                      className={`text-xs font-medium ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onNavigate("syllabus")}
                  className="mt-4 flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  View syllabus topics
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  color,
  bg,
  border,
}: {
  icon: typeof Cloud;
  label: string;
  value: string;
  sublabel: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      className={`flex items-center gap-4 p-5 rounded-2xl border ${border} ${bg} transition-all hover:shadow-md`}
    >
      <div className={`w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shrink-0`}>
        <Icon className={`w-5.5 h-5.5 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-xl font-bold text-slate-900 dark:text-white truncate">{value}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{sublabel}</p>
      </div>
    </div>
  );
}

function ReadinessGauge({ score }: { score: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#f43f5e";

  return (
    <div className="relative w-44 h-44">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          strokeWidth="10"
          className="stroke-slate-100 dark:stroke-slate-800"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          strokeWidth="10"
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="gauge-ring"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{score}</span>
        <span className="text-sm text-slate-400 dark:text-slate-500">/ 100</span>
      </div>
    </div>
  );
}
