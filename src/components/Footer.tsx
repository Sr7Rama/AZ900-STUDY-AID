import { RotateCcw, Github, Info } from "lucide-react";
import { useState } from "react";

interface FooterProps {
  onReset: () => void;
}

export default function Footer({ onReset }: FooterProps) {
  const [confirming, setConfirming] = useState(false);

  const handleReset = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    onReset();
    setConfirming(false);
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Info className="w-4 h-4" />
            <span>
              CloudPrep is an unofficial study tool. Content is original and not derived from
              Microsoft exam materials.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://learn.microsoft.com/credentials/certifications/azure-fundamentals/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              <Github className="w-4 h-4" />
              Official AZ-900 Info
            </a>

            <button
              onClick={handleReset}
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${
                confirming
                  ? "bg-rose-500 text-white hover:bg-rose-600"
                  : "text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              {confirming ? "Click again to confirm" : "Reset Progress"}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
