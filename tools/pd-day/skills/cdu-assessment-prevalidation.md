# name: cdu-assessment-prevalidation
description: Pre-validates a completed CDU TAFE assessment mapping and its assessment tools against the ASQA Standards for RTOs before a unit is delivered, producing a findings report that feeds CDU's VET Unit and Pre-Assessment Validation. Use whenever the user asks to pre-validate, quality-check, sanity-check, audit-proof or "have we done a good job" on a completed Assessment Mapping Matrix, a set of assessment tasks (AT1/AT2/AT3), or a learning resource, before delivery or before Team Leader Approval and Assessment Panel Review. Also use when the user gives a unit code plus its mapping and tools and asks whether the mapping is complete, whether it would survive an ASQA audit, whether the tools meet the Rules of Evidence, or whether anything is missing. This is the pre-use review gate that sits after cdu-assessment-mapping (build the matrix) and cdu-assessment-tool-builder (build the tools), and before delivery; it checks work, it does not build the matrix or the tools.
---

# CDU assessment pre-validation

This skill runs the pre-use review that the 2025 Standards for RTOs now require before an assessment tool reaches students. It takes a completed mapping and its tools and answers one question with evidence: is this ready to deliver, and if not, exactly what has to change first. It does not build the matrix or the tools; if either does not exist yet, use `cdu-assessment-mapping` or `cdu-assessment-tool-builder` first.

The output is a findings report, structured to drop straight into the Pre-Assessment Validation Report section of CDU's VET Unit and Pre-Assessment Validation form. It is a desk review by one reviewer; it does not replace the independent VET Assessment Panel Review, and it never marks student work.

## What it is anchored to

The 2025 Standards for RTOs (commenced 1 July 2025) treat a documented pre-use review of every assessment tool as a mandatory quality gate, not an optional extra (medium; the standards are current, exact outcome-standard and performance-indicator numbers should be confirmed against the ASQA source at review time, since the numbering was restructured from the 2015 clauses). The review tests the tools against two sets of criteria that carry over from the previous standards:

- **Principles of Assessment:** validity, reliability, fairness, flexibility.
- **Rules of Evidence:** validity, sufficiency, authenticity, currency.

CDU's own VET Unit and Pre-Assessment Validation form phrases the evidence test as "valid, reliable, sufficient, current and authentic"; that wording maps onto the four Rules of Evidence plus reliability from the Principles, so use the full eight-criteria framing above and note the CDU wording where it helps the reader.

## Before you start: read the reference files

This SKILL.md is the workflow. The detail lives in three reference files; read them, do not work from memory:

- `references/traceability-and-completeness.md` - the mechanical checks: is the evidence coding faithful to the unit, does the macro-notation resolve to real tool item numbers, does the completeness gate actually hold, are Student Resource References populated, is the matrix status current now the tools exist.
- `references/rules-of-evidence-checklist.md` - the concrete pass or fail questions for each Principle of Assessment and Rule of Evidence, applied per tool, plus the resource-suite completeness check.
- `references/findings-report-template.md` - the output structure: findings register, severity scale, confidence labels, sources, and the "not certain" list.

## Workflow

### Step 1 - Assemble the inputs and check what is present

You need, at minimum: the unit (Elements and PCs, Foundation Skills, Performance Evidence, Knowledge Evidence, Assessment Conditions), the completed Assessment Mapping Matrix, and the assessment tools the matrix references. The learning resource (student workbook or SLR) should be present too, since without it the Student Resource References cannot be validated.

Check first whether the user has supplied the unit as a PDF or training.gov.au export. If not, fetch it from `https://training.gov.au/Training/Details/[UNITCODE]` (the Unit of Competency and the Assessment Requirements are often separate documents). Never validate a mapping against a remembered version of a unit; a wrong PC number or paraphrased KE item defeats the whole review.

Then list what is present against the resource suite CDU expects for a unit (see the resource-suite check in `rules-of-evidence-checklist.md`): Student Unit Guide, Assessment Tasks, Assessor Guide, Student Assessment Agreement, Student Assessment Summary, Session Plans, RPL kit and assessment tasks, and Learning Resources. Anything not supplied is either out of scope for this review or a gap; ask the user which, and record the ones that are genuinely missing as findings.

### Step 2 - Rebuild the ground truth independently

Do not trust the matrix's own codes. From the unit text, independently code the Performance Evidence (PE1, PE2 ...) and Knowledge Evidence (KE1, KE2 ...), splitting bundled dot points the same way the mapping standard does, and list every PC and every Foundation Skill. Then compare your independent coding to the matrix. A mismatch (a missed split, a miscount, a paraphrase that drifts from the unit's wording) is a finding. This step is what catches the errors a reviewer who reads only the matrix will miss.

### Step 3 - Run the traceability and completeness checks

Work through `references/traceability-and-completeness.md`. The core checks: coding faithful to the unit; no bare ticks anywhere; every AT reference resolves to a real question, checklist item or document number in the actual tool (open the tool and confirm the number exists and covers what the matrix claims); the completeness gate holds for every PC, PE code, KE code and retained Foundation Skill; Student Resource References populated against the real learning resource; and the matrix's status and version record current now that the tools exist. Reconcile the matrix numbering against the built tools both ways: every matrix reference points to a real tool item, and every tool item traces back to a mapped requirement.

### Step 4 - Run the Rules of Evidence and Principles of Assessment checks per tool

Work through `references/rules-of-evidence-checklist.md` for each assessment tool. The questions that most often surface real findings: does each requirement have enough evidence, or does a complex requirement rest on a single question or a single observation (sufficiency); is there an authentication method and a student declaration (authenticity); are the conditions of assessment stated, including whether questioning is open-book or supervised (authenticity, fairness); do observation items carry an observable benchmark so two assessors would judge the same performance the same way (reliability); is the evidence current to industry practice and equipment (currency); and are reasonable-adjustment and alternative-evidence pathways available (fairness, flexibility).

### Step 5 - Check Assessment Conditions and contextualisation

Confirm each Assessment Condition is copied verbatim and answered with a concrete statement of how the RTO meets it, not a restatement. Where delivery is in a simulated environment, confirm the justification is complete (full skill and knowledge coverage, genuine WHS conditions, current equipment, realistic time pressure and competing tasks, and the range of client or workplace interactions the unit implies). Confirm contextualisation adds detail without narrowing what the unit covers. Flag any condition that is asserted but not evidenced (a lab, an equipment register, a named standard, an assessor credential) as needing confirmation.

### Step 6 - Write the findings report

Build the report from `references/findings-report-template.md`. Lead with a short plain-language verdict answering "is this ready, and if not what has to change". State the strengths that were verified, so the report is balanced and the author can see what not to touch; list only strengths that bear on the validation, and do not treat conformance to the author's own output preferences (Australian English, no em dashes, confidence labels, a sources list) as a validation strength, since those are style preferences, not assessment criteria. Then the findings register: a stable ID, the area, the evidence test or Standard it relates to, a severity, the finding, and a recommendation. Give the higher-severity findings a short detail paragraph each.

Then two sections that turn the review into a work list rather than a verdict:

- **Still to do (outstanding items)** - a Markdown checkbox list of every open item, tagged to its finding ID and grouped into resources to confirm or build, decisions or confirmations needed from the program area or SME, and fixes ready to apply now. Anything that makes the output set incomplete (a missing resource, an unconfirmed policy position such as RPL, an unsighted equipment register) goes here as a trackable to-do, not as buried prose.
- **Suggested fixes and actions to enhance compliance** - where a finding can be closed by a change the reviewer can draft, draft it. For a wording fix, give the actual replacement text quoted so the author can lift it (a corrected RPL statement, an added authenticity declaration, a reworded Assessment Condition). Label these as drafts for SME and Team Leader review, with a confidence label and any confirmation the fix depends on.

Close with completeness verification, a Sources used list, and a "not certain / could not confirm" list.

Severity reflects what blocks delivery: High blocks a defensible sign-off; Medium must be resolved but need not block early work; Low is a refinement or a confirmation. Never inflate severity, and never soften a real blocker to make the report read better; a pre-validation that misses a gap is worse than one that names it plainly.

### Step 7 - Deliver and, where relevant, route into the CDU workflow

Save the findings report as Markdown (see naming below) and deliver it. If the user is working through CDU's CMS, note that the report populates the Pre-Assessment Validation Report section, and that the form then progresses Draft to Team Leader Approval to Assessment Panel Review; this desk review supports the first of those, it is not the Panel's independent review.

## Output style - apply throughout

Two conventions are intrinsic to this document regardless of who produces it, so apply them every time:

- **Australian English** throughout: organisation, -ise not -ize, licence (noun) / license (verb).
- **No emojis.**

Finding IDs (PV-01, PV-02 ...) are functional reference tags, not decorative numbering; state once that they are reference tags and not a priority order, so severity is read from its own column.

Anything else about wording (em dashes, measured tone, confidence labels, sequential numbering, and so on) is a personal or organisational output preference, not part of this skill. Whoever runs the skill will have their own such preferences applied automatically, so do not hardcode them here, and do not treat conformance to them as a validation finding.

## Naming and output

Default output is a Markdown file:

`[UnitCode]_PreValidation_Findings_[YYYYMMDD].md`

e.g. `ICTCBL322_PreValidation_Findings_20260815.md`

Only produce a `.docx` if the user asks for one. Save to the user's Cowork Files folder unless the user points to a specific outputs folder for the unit.

## What this skill does not do

It does not build or edit the matrix or the tools; it reports what should change and hands back to the build skills. It does not mark student submissions; that is the `preliminary-marking` skill. It is not the independent VET Assessment Panel Review; it is the desk pre-validation that gets a unit ready for that review.