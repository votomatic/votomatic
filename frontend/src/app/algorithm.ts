import type { Answer, PartyAnswer, AnswerValue } from './types';

/**
 * Score for a single thesis comparison
 */
export interface ThesisScore {
  thesisKey: string;
  score: number;
  userAnswer: AnswerValue;
  partyAnswer: -1 | 0 | 1;
}

/**
 * Overall match result between user and party
 */
export interface MatchResult {
  matchPercentage: number;
  thesisScores: ThesisScore[];
  totalPossibleScore: number;
  earnedScore: number;
}

/**
 * Calculate score for a single answer comparison
 *
 * @param userAnswer - User's answer (-1, 0, 1, or null)
 * @param partyAnswer - Party's answer (-1, 0, or 1)
 * @param weighted - Whether user marked this as important (doubles score)
 * @returns Score (0-4)
 */
export function scoreAnswer(
  userAnswer: AnswerValue,
  partyAnswer: -1 | 0 | 1,
  weighted: boolean = false
): number {
  // User skipped - no score
  if (userAnswer === null) {
    return 0;
  }

  // Base scoring matrix (unweighted)
  let baseScore: number;

  if (userAnswer === partyAnswer) {
    // Perfect match
    baseScore = 2;
  } else if (userAnswer === 0 || partyAnswer === 0) {
    // One is neutral - partial match
    baseScore = 1;
  } else {
    // Opposite positions
    baseScore = 0;
  }

  // Apply weighting (double if important)
  return weighted ? baseScore * 2 : baseScore;
}

/**
 * Calculate overall match between user answers and party answers
 *
 * @param userAnswers - User's answers
 * @param partyAnswers - Party's answers
 * @returns Match result with percentage and breakdown
 * @throws Error if arrays don't match in length or have missing theses
 */
export function calculateMatch(
  userAnswers: Answer[],
  partyAnswers: PartyAnswer[]
): MatchResult {
  // Validate array lengths
  if (userAnswers.length !== partyAnswers.length) {
    throw new Error('Array lengths must match');
  }

  let earnedScore = 0;
  let totalPossibleScore = 0;
  const thesisScores: ThesisScore[] = [];

  // Match answers by thesisKey
  for (const userAnswer of userAnswers) {
    const partyAnswer = partyAnswers.find((pa) => pa.thesisKey === userAnswer.thesisKey);

    if (!partyAnswer) {
      throw new Error(`No party answer found for thesis key: ${userAnswer.thesisKey}`);
    }

    const weighted = userAnswer.weighted ?? false;
    const score = scoreAnswer(userAnswer.value, partyAnswer.value, weighted);

    // Calculate max possible for this thesis
    let maxPossible: number;
    if (userAnswer.value === null) {
      // User skipped - doesn't count toward max
      maxPossible = 0;
    } else if (weighted) {
      // Weighted answer - max 4 points
      maxPossible = 4;
    } else {
      // Normal answer - max 2 points
      maxPossible = 2;
    }

    earnedScore += score;
    totalPossibleScore += maxPossible;

    thesisScores.push({
      thesisKey: userAnswer.thesisKey,
      score,
      userAnswer: userAnswer.value,
      partyAnswer: partyAnswer.value,
    });
  }

  // Calculate percentage
  const matchPercentage = totalPossibleScore > 0
    ? (earnedScore / totalPossibleScore) * 100
    : 0;

  return {
    matchPercentage,
    thesisScores,
    totalPossibleScore,
    earnedScore,
  };
}
