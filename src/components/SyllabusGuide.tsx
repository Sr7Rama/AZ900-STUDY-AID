import { useState } from "react";
import { BookOpen, ChevronDown, Cloud, Server, Shield, CheckCircle2, Circle } from "lucide-react";
import { DOMAINS } from "@/types";
import type { Domain } from "@/types";
import { SAMPLE_QUESTIONS, SAMPLE_FLASHCARDS } from "@/data/sampleData";

const DOMAIN_ICONS: Record<Domain, typeof Cloud> = {
  "cloud-concepts": Cloud,
  "architecture-services": Server,
  "management-governance": Shield,
};

const DOMAIN_ACCENT: Record<Domain, string> = {
  "cloud-concepts": "text-brand-500 bg-brand-50 dark:bg-brand-950/30",
  "architecture-services": "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
  "management-governance": "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
};

export default function SyllabusGuide() {
  const [expandedDomain, setExpandedDomain] = useState<Domain | null>("cloud-concepts");

  const questionCount = (domain: Domain) =>
    SAMPLE_QUESTIONS.filter((q) => q.domain === domain).length;
  const flashcardCount = (domain: Domain) =>
    SAMPLE_FLASHCARDS.filter((f) => f.domain === domain).length;

  return (
    <div className="tab-content max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex w-16 h-16 rounded-2xl bg-brand-500/10 items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-brand-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          AZ-900 Study Guide
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          The official exam measures skills across three domains. Expand each to see covered topics.
        </p>
      </div>

      <div className="space-y-4">
        {DOMAINS.map((domain, idx) => {
          const Icon = DOMAIN_ICONS[domain.key];
          const accent = DOMAIN_ACCENT[domain.key];
          const isExpanded = expandedDomain === domain.key;

          return (
            <div
              key={domain.key}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => setExpandedDomain(isExpanded ? null : domain.key)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                      Domain {idx + 1}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {domain.weight}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
                    {domain.label}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 animate-slide-up">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {domain.description}
                  </p>

                  <div className="space-y-1.5 mb-4">
                    {domain.topics.map((topic) => (
                      <div
                        key={topic}
                        className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <Circle className="w-3 h-3 text-brand-400 dark:text-brand-600 shrink-0 mt-1" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                      {questionCount(domain.key)} practice questions
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {flashcardCount(domain.key)} flashcards
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Exam info */}
      <div className="mt-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="font-bold text-slate-900 dark:text-white mb-3">About the AZ-900 Exam</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <InfoItem label="Format" value="Multiple choice & multiple response" />
          <InfoItem label="Questions" value="40–60 questions" />
          <InfoItem label="Duration" value="45 minutes" />
          <InfoItem label="Passing Score" value="700 / 1000" />
          <InfoItem label="Cost" value="$99 USD (price varies by region)" />
          <InfoItem label="Validity" value="1 year" />
        </div>
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
          This study tool covers the skills measured as of the latest AZ-900 update. For official
          details, visit the Microsoft Learn certification page.
        </p>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>
    </div>
  );
}
