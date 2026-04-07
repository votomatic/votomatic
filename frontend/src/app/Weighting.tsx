
import { useState, useMemo } from "react";
import type { Answer, AnswerValue } from "../lib/types/answer";
import type { Thesis } from "../lib/types/election";
import { cn, button } from "../lib/styles";

// Icon components for user answers
function AnswerIcon({ value, isWeighted }: { value: AnswerValue; isWeighted?: boolean }) {
  const baseClasses = "inline-flex items-center justify-center w-6 h-6 rounded-full";

  if (value === 1) {
    return (
      <span className={cn(baseClasses, isWeighted ? "bg-white/20 text-white" : "bg-green-500/20 text-green-500")}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    );
  }

  if (value === 0) {
    return (
      <span className={cn(baseClasses, isWeighted ? "bg-white/20 text-white" : "bg-yellow-500/20 text-yellow-500")}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </span>
    );
  }

  if (value === -1) {
    return (
      <span className={cn(baseClasses, isWeighted ? "bg-white/20 text-white" : "bg-red-500/20 text-red-500")}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </span>
    );
  }

  return (
    <span className={cn(baseClasses, isWeighted ? "bg-white/20 text-white" : "bg-gray-500/20 text-gray-500")}>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </span>
  );
}

interface WeightingProps {
  theses: Thesis[];
  answers: Answer[];
  weights?: Record<string, number>;
  onComplete: (weights: Record<string, number>) => void;
  onBack: () => void;
}

export function Weighting({ theses, answers, weights: initialWeights, onComplete, onBack }: WeightingProps) {
  const [weights, setWeights] = useState<Record<string, number>>(initialWeights || {});
  const [expandedThesis, setExpandedThesis] = useState<string | null>(null);

  const toggleExpand = (thesisKey: string) => {
    setExpandedThesis(expandedThesis === thesisKey ? null : thesisKey);
  };

  const toggleWeight = (thesisKey: string) => {
    setWeights((prev) => ({
      ...prev,
      [thesisKey]: prev[thesisKey] === 2 ? 1 : 2,
    }));
  };

  const handleComplete = () => {
    onComplete(weights);
  };

  const thesesWithAnswers = useMemo(() => {
    return theses.filter(thesis => answers.some(answer => answer.thesisKey === thesis._key));
  }, [theses, answers]);

  // Create a map of thesis key to answer for quick lookup
  const answerMap = useMemo(() => {
    return new Map(answers.map((a) => [a.thesisKey, a.value]));
  }, [answers]);

  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <header className="z-10">
        <div className="bg-background px-6 pt-4 md:pt-6 pb-5">
          {/* Back button and Title */}
          <div className="md:mx-auto md:max-w-[900px]">
            <button
              onClick={onBack}
              className={cn(button({ variant: "ghost", size: "sm", fullWidth: "auto" }), "mb-4 gap-2 -ml-4")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Volver al cuestionario
            </button>
            <h1 className="text-[min(7vw,3rem)] leading-[1.1] text-foreground mb-1">
              Ponderación de las tesis
            </h1>
            <p className="text-[min(4vw,1.5rem)] text-foreground-secondary">
              ¿Qué tesis son particularmente importantes para ti? Marca las tesis para que su peso se duplique en el cálculo.
            </p>
          </div>
        </div>
      </header>

      {/* Theses list */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="md:mx-auto md:max-w-[900px]">
          <div className="space-y-3">
            {thesesWithAnswers.map((thesis) => {
              const isWeighted = weights[thesis._key] === 2;
              const isExpanded = expandedThesis === thesis._key;
              const userAnswer = answerMap.get(thesis._key) ?? null;

              return (
                <div
                  key={thesis._key}
                  className={cn(
                    "bg-surface rounded-3xl overflow-hidden transition-all",
                    isWeighted && "bg-accent text-accent-foreground"
                  )}
                >
                  <div className="p-6 flex items-center justify-between gap-4">
                    {/* User answer icon */}
                    <div className="flex-shrink-0">
                      <AnswerIcon value={userAnswer} isWeighted={isWeighted} />
                    </div>

                    {/* Expandable title area */}
                    <button
                      onClick={() => toggleExpand(thesis._key)}
                      className="flex items-center gap-2 flex-1 min-w-0 text-left"
                    >
                      <span className="font-semibold">{thesis.title}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={cn(
                          "flex-shrink-0 transition-transform ml-auto",
                          isWeighted ? "text-accent-foreground/70" : "text-foreground-secondary",
                          isExpanded && "rotate-180"
                        )}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={() => toggleWeight(thesis._key)}
                      className={cn(
                        button({ variant: "default", size: "sm" }),
                        "!w-auto flex-shrink-0",
                        isWeighted && "bg-accent text-accent-foreground"
                      )}
                    >
                      {isWeighted ? "Marcado (2x)" : "Marcar"}
                    </button>
                  </div>

                  {/* Expandable description */}
                  {isExpanded && (
                    <div className={cn(
                      "px-6 pb-6 pt-0",
                      isWeighted ? "border-t border-accent-foreground/20" : "border-t border-background"
                    )}>
                      <p className={cn(
                        "text-sm leading-relaxed pt-4 pl-10",
                        isWeighted ? "text-accent-foreground/80" : "text-foreground-secondary"
                      )}>
                        {thesis.text}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 bg-background">
        <div className="md:mx-auto md:max-w-[900px] flex justify-center">
          <button
            onClick={handleComplete}
            className={cn(button({ variant: "primary" }))}
          >
            Ver resultados
          </button>
        </div>
      </footer>
    </div>
  );
}
