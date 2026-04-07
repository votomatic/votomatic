---
description: Generate neutral comparative questions from all party extractions
---

# Question Generation Orchestrator

You orchestrate question generation by delegating to Task agents. This prevents token overflow.

## Input
- Phase: `matrix`, `questions`, or `select` (required)
- Topic category: `economy`, `social`, `services`, or `governance` (required for matrix/questions)
- Format: `$ARGUMENTS` = `[phase] [category]` or `[phase]` for select

## Topic Categories (Optimized for Polarization)

| Category | Issues |
|----------|--------|
| `economy` | Nacionalización de recursos naturales, Impuestos a grandes fortunas, Reforma del sistema de pensiones (AFP), Salario mínimo por ley, Libre comercio vs proteccionismo |
| `social` | Matrimonio igualitario, Despenalización del aborto, Pena de muerte, Legalización de cultivos de coca, Política migratoria restrictiva |
| `services` | Privatización de servicios públicos, Rol del Estado en salud, Educación privada con vouchers, Energías renovables obligatorias |
| `governance` | Nueva constitución, Rol de FFAA en seguridad ciudadana, Reelección presidencial, Revocatoria de congresistas, Amnistía política |

---

## Phase 1: `matrix`

**You MUST use the Task tool** to process each issue separately.

### Step 1: Setup
1. Create directory `data/questions/` if needed
2. Initialize `data/questions/matrix-[category].json`:
```json
{
  "generated_at": "ISO timestamp",
  "category": "[category]",
  "total_parties": 0,
  "issues": []
}
```

### Step 2: Launch ONE Task per Issue (Sequentially)

For EACH issue in the category, launch a Task agent with this prompt:

```
You are analyzing party stances for a SINGLE issue. Return ONLY a JSON object.

## Your Task
Analyze the issue: "[ISSUE_NAME]"

## Instructions
1. List all files in data/extractions/*.json
2. For each file, read ONLY the `stances` array
3. Find the stance where `issue` matches "[ISSUE_NAME]"
4. Count: a_favor, en_contra, neutral, no_mencionado
5. Track party names in favor/contra lists

## Output Format (return ONLY this JSON, no other text)
{
  "issue": "[ISSUE_NAME]",
  "counts": {
    "a_favor": <number>,
    "en_contra": <number>,
    "neutral": <number>,
    "no_mencionado": <number>
  },
  "total_parties": <number>,
  "parties_favor": ["party-slug-1", "party-slug-2"],
  "parties_contra": ["party-slug-3", "party-slug-4"]
}
```

### Step 3: After Each Task Returns
1. Parse the JSON from the task result
2. Calculate **polarization score** (penalizes neutrals and no-mentions):
   ```
   effective_parties = a_favor + en_contra
   polarization = (a_favor × en_contra) / (effective_parties)²  [if effective_parties > 0, else 0]
   coverage_penalty = 1 - ((neutral + no_mencionado) / total_parties)
   final_score = polarization × coverage_penalty
   ```
3. Add to the issue object:
   - `polarization_score`: the final_score (0-0.25 range, 0.25 = perfect 50/50 split with no neutrals)
   - `effective_parties`: count of parties with clear positions
   - `neutral_ratio`: (neutral + no_mencionado) / total_parties
   - `recommended_for_questions`: true if final_score > 0.10 AND effective_parties >= 10
4. Append to the matrix file
5. Report: "Completed: [issue] (polarization: X.XX, effective: N parties)"

### Polarization Thresholds
- **High priority** (score > 0.15): Excellent differentiation
- **Medium priority** (score 0.10-0.15): Good differentiation
- **Low priority** (score < 0.10): Too much consensus or too many neutrals - SKIP
- **Minimum effective parties**: At least 10 parties must have clear a_favor/en_contra positions

---

## Phase 2: `questions`

**You MUST use the Task tool** for each high-divergence issue.

### Step 1: Load Matrix
Read `data/questions/matrix-[category].json` and filter issues where `recommended_for_questions: true`

### Step 2: Launch ONE Task per Issue (Sequentially)

For EACH qualifying issue, launch a Task agent:

```
You are generating questions for a political quiz. Return ONLY JSON.

## Issue: "[ISSUE_NAME]"
## Category: "[CATEGORY]"
## Parties in favor: [LIST]
## Parties against: [LIST]

## Instructions
1. Read stances[].evidence from extraction files ONLY for the listed parties
2. Generate 1-2 neutral questions that distinguish positions
3. Questions must be answerable with: Acuerdo / Desacuerdo / Neutral

## Question Rules
- Spanish language only
- No loaded words (peligroso, necesario, justo, injusto, fundamental, esencial)
- No leading questions
- Single policy per question
- Citizen-comprehensible
- **Frame as concrete policy, not abstract value** (e.g., "El Estado debe nacionalizar las empresas mineras" NOT "La minería debe beneficiar al pueblo")
- **Avoid consensus framing** - don't ask things everyone agrees with (e.g., "reducir la corrupción")
- **Binary when possible** - question should have a clear yes/no policy implication

## Output Format (return ONLY this JSON)
{
  "issue": "[ISSUE_NAME]",
  "questions": [
    {
      "text": "Question text in Spanish",
      "party_positions": {
        "party-slug": "a_favor|en_contra"
      },
      "source_evidence": {
        "party-slug": "Brief quote"
      }
    }
  ]
}
```

### Step 3: Aggregate Results
1. Collect questions from each task
2. Assign IDs (eco-001, soc-001, etc.)
3. Write to `data/questions/draft-questions-[category].json`:

```json
{
  "generated_at": "ISO timestamp",
  "category": "[category]",
  "total_questions": <number>,
  "questions": [...]
}
```

---

## Phase 3: `select`

This phase eliminates redundant questions and selects the final set for maximum party differentiation.

### Step 1: Load All Draft Questions
Read all `data/questions/draft-questions-*.json` files and merge into a single list.

### Step 2: Calculate Redundancy Clusters
For each pair of questions, calculate **position similarity**:
```
similarity = count(same_position) / count(parties_with_positions_in_both)
```
If similarity > 0.85, questions are redundant (measuring the same thing).

### Step 3: Select Best Question per Cluster
For each redundancy cluster:
1. Keep only the question with the **highest polarization_score**
2. Mark others as `eliminated: "redundant with [kept_question_id]"`

### Step 4: Ensure Major Party Differentiation
Check that selected questions differentiate between major parties. For Peru 2026:
- Must have at least 5 questions where Fuerza Popular ≠ Perú Libre
- Must have at least 3 questions where APP ≠ Juntos por el Perú
- Must have at least 3 questions where right-bloc ≠ left-bloc

### Step 5: Balance Categories
Target distribution (adjust to ~20 total questions):
- Economy: 5-6 questions
- Social: 5-6 questions
- Services: 4-5 questions
- Governance: 4-5 questions

If a category has too few high-polarization questions, report it as a gap.

### Step 6: Generate Final Output
Write to `data/questions/final-questions.json`:
```json
{
  "generated_at": "ISO timestamp",
  "selection_criteria": {
    "min_polarization": 0.10,
    "min_effective_parties": 10,
    "redundancy_threshold": 0.85
  },
  "statistics": {
    "total_draft_questions": <number>,
    "eliminated_low_polarization": <number>,
    "eliminated_redundant": <number>,
    "final_count": <number>
  },
  "category_distribution": {
    "economy": <number>,
    "social": <number>,
    "services": <number>,
    "governance": <number>
  },
  "major_party_splits": {
    "fuerza_popular_vs_peru_libre": <number>,
    "app_vs_juntos": <number>
  },
  "questions": [
    {
      "id": "final-001",
      "original_id": "eco-001",
      "text": "...",
      "category": "economy",
      "polarization_score": 0.18,
      "effective_parties": 25,
      "party_positions": {...},
      "key_splits": ["fuerza-popular:a_favor vs peru-libre:en_contra"]
    }
  ],
  "eliminated": [
    {
      "id": "eco-002",
      "reason": "redundant with final-001",
      "similarity": 0.92
    }
  ]
}
```

---

## Usage
```
/extraction:generate-questions matrix economy
/extraction:generate-questions questions economy
/extraction:generate-questions select
```

## Critical Rules
1. **NEVER process multiple issues in a single Task** - one issue per Task
2. **NEVER skip the Task tool** - direct processing will exceed tokens
3. **Process issues sequentially** - wait for each Task to complete before launching the next
4. Use `subagent_type: "general-purpose"` for all Tasks
5. **Prioritize polarization over coverage** - a question that splits 15 parties clearly is better than one where 30 parties are neutral
6. **One question per policy dimension** - avoid asking the same thing in different words
