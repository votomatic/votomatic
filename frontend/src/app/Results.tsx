import { useState, useMemo } from "react";
import type { Answer } from "../lib/types/answer";
import type { Thesis } from "../lib/types/election";
import type { PartyParticipation } from "../lib/types/party";
import { calculateMatch, type ThesisScore } from "../lib/matching/algorithm";
import { cn, card, button } from "../lib/styles";

interface ResultsProps {
  answers: Answer[];
  weights: Record<string, number>;
  theses: Thesis[];
  title: string;
  partyParticipations: PartyParticipation[];
  onBack: () => void;
}

interface PartyResult {
  name: string;
  abbreviation: string;
  logoUrl?: string | null;
  description?: string;
  matchPercentage: number;
  thesisScores: ThesisScore[];
}

// Helper to get agreement status
function getAgreementStatus(userAnswer: number | null, partyAnswer: number): "agree" | "partial" | "disagree" | "skipped" {
  if (userAnswer === null) return "skipped";
  if (userAnswer === partyAnswer) return "agree";
  if (userAnswer === 0 || partyAnswer === 0) return "partial";
  return "disagree";
}

export function Results({
  answers,
  weights,
  theses,
  partyParticipations,
  onBack,
}: ResultsProps) {
  const [expandedParty, setExpandedParty] = useState<string | null>(null);

  // Create a map of thesis key to thesis for quick lookup
  const thesisMap = useMemo(() => {
    return new Map(theses.map((t) => [t._key, t]));
  }, [theses]);

  // Calculate matches for all parties
  const partyResults: PartyResult[] = useMemo(() => {
    const results = partyParticipations.map((participation) => {
      const match = calculateMatch(answers, participation.answers, weights);

      return {
        name: participation.party.name,
        abbreviation: participation.party.abbreviation,
        logoUrl: participation.party.logoUrl,
        description: participation.party.description,
        matchPercentage: match.matchPercentage,
        thesisScores: match.thesisScores,
      };
    });

    // Sort by match percentage (descending)
    return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [answers, weights, partyParticipations]);

  const toggleParty = (partyName: string) => {
    setExpandedParty(expandedParty === partyName ? null : partyName);
  };

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
              Volver a ponderación
            </button>
            <h1 className="text-[min(7vw,3rem)] leading-[1.1] text-foreground mb-1">
              Tus resultados
            </h1>
          </div>
        </div>
      </header>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="md:mx-auto md:max-w-[900px]">
          {/* Disclaimer */}
          <div className={cn(card(), "mt-6 mb-6 text-sm text-foreground-secondary leading-relaxed")}>
            <p>
              Altos niveles de acuerdo entre tus respuestas y varios partidos no significan necesariamente que estos partidos estén cerca unos de otros en términos de su contenido.
            </p>
          </div>

          <div className="space-y-3">
            {partyResults.map((party) => {
              const isExpanded = expandedParty === party.name;

              return (
                <div
                  key={party.name}
                  className="bg-surface rounded-3xl overflow-hidden"
                >
                  {/* Party header - clickable */}
                  <button
                    onClick={() => toggleParty(party.name)}
                    className="w-full p-6 hover:bg-background transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-start gap-8">
                      {/* Logo and abbreviation side by side */}
                      <div className="flex items-center gap-6 flex-shrink-0">
                        {/* Logo */}
                        {party.logoUrl && (
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden bg-background flex-shrink-0">
                            <img
                              src={party.logoUrl}
                              alt={`${party.name} logo`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <h2 className="text-xl md:text-2xl font-bold text-foreground">
                          {party.name}
                        </h2>
                      </div>

                      {/* Chevron */}
                      <div className="flex-shrink-0 ml-auto">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={cn(
                            "transition-transform duration-300",
                            isExpanded ? "rotate-180" : ""
                          )}
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>

                    {/* Progress bar and percentage below */}
                    <div className="flex items-center gap-6">
                      {/* Progress bar container */}
                      <div className="flex-1 relative">
                        {/* Percentage on top of progress bar */}
                        <div className="flex justify-end mb-1">
                          <span className="text-xl md:text-2xl font-bold text-accent">
                            {Math.round(party.matchPercentage)}%
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent transition-all duration-500 rounded-full"
                            style={{ width: `${party.matchPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expandable content - full name, description, and thesis breakdown */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-0">
                      <div className="pt-4 border-t border-background space-y-4">

                        {/* Description */}
                        {party.description && (
                          <p className="text-foreground-secondary leading-relaxed">
                            {party.description}
                          </p>
                        )}

                        {/* Thesis breakdown */}
                        <div className="space-y-2 pt-2">
                          <h4 className="text-sm font-semibold text-foreground-secondary">Desglose por tesis:</h4>
                          {party.thesisScores
                            .filter((score) => score.userAnswer !== null)
                            .map((score) => {
                              const thesis = thesisMap.get(score.thesisKey);
                              const status = getAgreementStatus(score.userAnswer, score.partyAnswer);

                              return (
                                <div key={score.thesisKey} className="flex items-start gap-3">
                                  {/* Status icon */}
                                  <div className="flex-shrink-0 mt-0.5">
                                    {status === "agree" && (
                                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                          <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                      </span>
                                    )}
                                    {status === "partial" && (
                                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                          <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                      </span>
                                    )}
                                    {status === "disagree" && (
                                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                          <line x1="18" y1="6" x2="6" y2="18" />
                                          <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                      </span>
                                    )}
                                  </div>

                                  {/* Thesis text */}
                                  <p className="text-sm text-foreground-secondary leading-relaxed">
                                    {thesis?.title || score.thesisKey}
                                  </p>
                                </div>
                              );
                            })}
                        </div>
                      </div>
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
          {/* No primary CTA needed - this is the final page */}
        </div>
      </footer>
    </div>
  );
}
