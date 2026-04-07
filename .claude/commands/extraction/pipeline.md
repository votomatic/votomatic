---
description: Run the full extraction pipeline for all parties
---

# Pipeline Orchestrator

You are the orchestrator agent. Your job is to run the complete PDF extraction pipeline using the Task tool to spawn parallel sub-agents.

## Input
- Party list (comma-separated): $ARGUMENTS
- Example: "partido-morado,accion-popular,fuerza-popular"

## Directory Setup

First, ensure these directories exist:
```bash
mkdir -p data/pdfs data/extractions data/questions
```

## Pipeline Execution

### Stage 1: Extraction (Parallel)

**IMPORTANT**: Use the Task tool to spawn ONE agent per party IN PARALLEL (single message, multiple Task tool calls).

For each party in the comma-separated list, invoke the Task tool with:
- `subagent_type`: "general-purpose"
- `description`: "Extract [party-name]"
- `prompt`: The full content of the extract agent instructions below

<extract-agent-prompt>
You are an extraction agent for party: [PARTY_NAME]

## Language
- PDF content is in **Spanish**
- All output (statements, quotes, keywords) must remain in **Spanish**
- Do NOT translate any content

## Tasks

1. **Read the PDF** at `data/pdfs/[PARTY_NAME].pdf`
2. **Extract main topics**:
   - Identify themes: Economy, Health, Education, Environment, Security, Social Policy, Foreign Policy, Justice, etc.
   - Note which sections/pages cover each topic
3. **For each topic, extract proposals**:
   - Only concrete, measurable proposals
   - Ignore rhetoric and criticism of opponents
   - Capture numerical commitments (percentages, amounts, deadlines)
   - Identify binary stances (for/against specific policies)

## Output

Save to `data/extractions/[PARTY_NAME].json`:
```json
{
  "party": "[PARTY_NAME]",
  "source_pdf": "data/pdfs/[PARTY_NAME].pdf",
  "extracted_at": "ISO timestamp",
  "topics": [
    {
      "topic": "Topic name",
      "proposals": [
        {
          "statement": "Neutral description",
          "original_quote": "Exact quote from PDF",
          "page": 12,
          "measurable": true,
          "specificity": "alta|media|baja",
          "keywords": ["keyword1", "keyword2"]
        }
      ]
    }
  ]
}
```

## Rules
- Be objective and neutral in descriptions
- Preserve original quotes exactly
- Flag low-confidence extractions
- If PDF doesn't exist, report error and stop

Report: number of topics found, total proposals extracted, and any issues encountered.
</extract-agent-prompt>

### Stage 2: Classification (Parallel)

**WAIT** for Stage 1 to complete. Then use the Task tool to spawn ONE agent per party IN PARALLEL.

For each party, invoke Task tool with:
- `subagent_type`: "general-purpose"
- `description`: "Classify [party-name]"
- `prompt`: The classify agent instructions below

<classify-agent-prompt>
You are a classification agent for party: [PARTY_NAME]

## Input
- Extraction file: `data/extractions/[PARTY_NAME].json`

## Standard Issues to Classify

Evaluate the party's stance on each:

1. Aumento del salario mínimo
2. Impuestos a grandes fortunas
3. Privatización de servicios públicos
4. Matrimonio igualitario
5. Despenalización del aborto
6. Energías renovables vs combustibles fósiles
7. Política migratoria restrictiva
8. Aumento del gasto militar
9. Subsidios a empresas privadas
10. Reforma del sistema de pensiones
11. Educación pública gratuita
12. Sistema de salud universal
13. Descentralización del gobierno
14. Reforma del sistema judicial
15. Políticas de género

## Output

Update the extraction file by adding a `stances` array:

```json
{
  "stances": [
    {
      "issue": "Aumento del salario mínimo",
      "position": "a_favor|en_contra|neutral|no_mencionado",
      "confidence": "alta|media|baja",
      "evidence": "Quote or summary supporting this classification"
    }
  ]
}
```

## Rules
- Only classify based on explicit statements, not inferences
- Use "no_mencionado" if the topic isn't addressed
- Use "neutral" only if explicitly stated as neutral
- Low confidence = indirect evidence only
- High confidence = direct, explicit statement

Report: classified stances summary, any ambiguous cases, and issues not mentioned.
</classify-agent-prompt>

### Stage 3: Question Generation (Sequential)

**WAIT** for Stage 2 to complete. Then invoke ONE Task agent:

- `subagent_type`: "general-purpose"
- `description`: "Generate questions"
- `prompt`:

<question-agent-prompt>
You are a question generation agent. Your job is to create neutral, discriminating questions based on all parties' extracted positions.

## Language
- All content is in **Spanish**
- Generate all questions in **Spanish**
- Do NOT translate any content

## Input
- All extraction files in `data/extractions/*.json`

## Prerequisites
- All party extractions must be complete
- All classifications must be done

## Process

1. **Load all extractions** from `data/extractions/`
2. **Identify divergence points**: Find issues where parties disagree
3. **Generate questions** that:
   - Distinguish between at least 2 parties
   - Use neutral, accessible language (no jargon)
   - Address a single policy (no compound questions)
   - Can be answered with: Acuerdo / Desacuerdo / Neutral

## Question Quality Criteria
- Avoid loaded words: "peligroso", "necesario", "justo", "injusto"
- No leading questions
- Comprehensible by average citizen
- Relevant to current political context

## Output

Save to `data/questions/draft-questions.json`:

```json
{
  "generated_at": "ISO timestamp",
  "total_questions": 40,
  "questions": [
    {
      "id": "q001",
      "text": "El salario mínimo debe aumentarse a S/1500 para 2026",
      "topic": "economy",
      "discriminates_between": ["Partido A", "Partido B"],
      "party_positions": {
        "partido-a": "a_favor",
        "partido-b": "en_contra",
        "partido-c": "neutral"
      },
      "source_evidence": {
        "partido-a": "Quote from their plan",
        "partido-b": "Quote from their plan"
      }
    }
  ]
}
```

## Target
- Generate 30-50 draft questions
- Cover all major topic categories
- Ensure each party is differentiated on multiple questions

Report: questions per category, parties most/least differentiated, any topics with no divergence.
</question-agent-prompt>

### Stage 4: Validation (Sequential)

**WAIT** for Stage 3 to complete. Then invoke ONE Task agent:

- `subagent_type`: "general-purpose"
- `description`: "Validate questions"
- `prompt`:

<validate-agent-prompt>
You are a validation agent. Your job is to ensure questions are neutral and accurately represent party positions.

## Input
- Questions file: `data/questions/draft-questions.json`
- Extractions: `data/extractions/*.json`

## Validation Checks

### 1. Neutrality Check
For each question, analyze:
- [ ] No emotionally loaded language
- [ ] No premise that favors one position
- [ ] Comprehensible to average citizen
- [ ] Single policy per question
- [ ] No leading phrasing

### 2. Quote Verification
For each party position:
- [ ] Quote exists in original extraction
- [ ] Position accurately reflects the quote
- [ ] Confidence level is appropriate

### 3. Discrimination Check
- [ ] Question actually differentiates parties
- [ ] At least 2 parties have different positions

## Output

Update questions file with validation results:

```json
{
  "id": "q001",
  "text": "...",
  "validation": {
    "is_neutral": true,
    "neutrality_issues": [],
    "quotes_verified": true,
    "quote_issues": [],
    "discriminates": true,
    "suggested_revision": null,
    "status": "approved|needs_revision|rejected",
    "validated_at": "ISO timestamp"
  }
}
```

Also create `data/questions/validation-report.json`:

```json
{
  "validated_at": "ISO timestamp",
  "total_questions": 40,
  "approved": 32,
  "needs_revision": 6,
  "rejected": 2,
  "issues_summary": [
    {"type": "loaded_language", "count": 3},
    {"type": "quote_mismatch", "count": 2}
  ]
}
```

## Rules
- Be strict on neutrality
- Flag any uncertainty
- Suggest concrete revisions when possible
- Reject questions that can't be fixed

Report: validation summary, common issues found, questions needing human review.
</validate-agent-prompt>

### Stage 5: Final Report

After all stages complete, generate `data/pipeline-report.json`:
```json
{
  "run_at": "ISO timestamp",
  "parties_processed": ["partido-a", "partido-b"],
  "extraction_summary": {
    "partido-a": {"topics": 8, "proposals": 45}
  },
  "questions_generated": 40,
  "questions_approved": 32,
  "questions_need_revision": 6,
  "questions_rejected": 2,
  "ready_for_import": true
}
```

## Error Handling
- If a PDF is missing, skip that party and continue
- If extraction fails, log error and continue with others
- If < 2 parties succeed, abort pipeline

## Next Steps
After pipeline completes:
1. Review `data/questions/draft-questions.json`
2. Fix questions marked "needs_revision"
3. Run `/extraction/import-to-sanity [election-id]` to import approved questions
