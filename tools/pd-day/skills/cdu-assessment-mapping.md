# Unit Assessment Mapping
Last updated
Aug 12, 2026

### Trigger
Slash command + auto

### Description
Maps a Unit of Competency (or cluster of units) from training.gov.au, the National Training Register, onto the TAFE's Assessment Mapping Matrix v7 template, applying the ASQA-audited mapping standard - numbered PE/KE evidence codes, macro-level assessment task notation (question, activity or checklist item numbers, never ticks), populated Student Resource References, a fully-mapped Foundation Skills table, and Northern Territory context-of-delivery contextualisation in Range of Conditions and Assessment Conditions. Use whenever the user asks to map a unit, build or populate an assessment mapping matrix, check performance/knowledge evidence coverage, prepare for an ASQA audit or validation, or gives a unit code (e.g. ICTCBL322, BSBWHS411) needing mapping to the institution's assessment tools - even if they don't name the template or spell out every requirement. Also use to check whether an existing mapping is complete, or to add NT contextualisation to one that's missing it.

### Included Files

![[TAFE Mapping/Screenshot 2026-08-12 at 8.18.32 am.png]]

### TAFE assessment mapping (Northern Territory)

This skill populates TAFE's Assessment Mapping Matrix v7 for a Unit of Competency, following the mapping standard the TAFE applies. The standard exists to make coverage auditable at a glance: an assessor should be able to take any Performance Evidence or Knowledge Evidence item, find its code, look it up in the matrix, and land on the exact question or checklist item that proves it. A matrix that just ticks boxes doesn't do that; this one has to.

A mapping is only finished when every element, performance criterion, performance evidence item, knowledge evidence item and retained foundation skill has a real macro-level reference in at least one assessment column. Treat that as the definition of done, not an aspiration.

### Output style - apply this throughout, not just in the closing notes

This is a compliance document the user's organisation will hand to an auditor, so the house style matters as much as the content. Apply all of this to every part of the matrix as you write it, not as a pass at the end:

Australian English throughout - organisation not organization, -ise not -ize, licence (noun) / license (verb).

 
### Before you start: read the reference files

This SKILL.md covers the workflow. The detail lives in three reference files - read them, don't guess at their content:

references/mapping-standard.md - the coding scheme, macro-notation rules, Student Resource Reference rules, Foundation Skills rules, and the completeness gate. This is the core of the standard; read it in full before mapping anything.
references/assessment-tool-notation.md - the exact notation convention for each  assessment tool type (Questioning, Direct Observation, Direct Observation and Questioning, Portfolio, Project), grounded in the actual AT templates.
references/nt-context-of-delivery.md - how to build the Northern Territory contextualisation in Range of Conditions and Assessment Conditions, and the rule that bounds it (contextualisation can add detail, never narrow what the unit covers).

### Workflow
##### Step 1 - Get the full unit text

You need, verbatim: Elements and Performance Criteria, Foundation Skills, Performance Evidence, Knowledge Evidence, and Assessment Conditions (and Range of Conditions, if the unit has a distinct section for it).

Check first whether the user has already provided the unit - a PDF, a training.gov.au export, or pasted text. If not, fetch it from https://training.gov.au/Training/Details/[UNITCODE] (try the "Unit of Competency" and "Assessment Requirements" documents specifically; training.gov.au often serves these as separate PDFs). If a fetch isn't possible, ask the user to attach the unit PDF rather than reconstructing it from memory - a wrong PC number or a paraphrased Knowledge Evidence item breaks the whole audit trail this matrix exists to provide.

If several units are being mapped together as a cluster or skill set, read mapping-standard.md section 7 before proceeding - each unit still needs its own complete matrix.

##### Step 2 - Assign evidence codes before mapping anything

Convert every Performance Evidence and Knowledge Evidence dot point into a numbered code (PE1, PE2, KE1, KE2 …, splitting into PE2a/PE2b where a dot point bundles distinct sub-items). Full rules in mapping-standard.md section 1. Show this coded list to the user before mapping if there's any ambiguity in how to split an item - getting the codes right matters more than moving fast, since they get referenced everywhere downstream, including inside the assessment tools themselves.

##### Step 3 - Establish the assessment task structure

The template supports three assessment tasks (AT1, AT2, AT3), though a unit can use fewer. For each one you need: a title, and which CDU tool template it's built on (Questioning, Direct Observation, Direct Observation and Questioning, Portfolio, or Project - see assessment-tool-notation.md), since that determines the notation you'll use.

If the user has already provided draft assessment tools, read them and use their actual question/item numbering.
If not, ask: how many assessment tasks, what's each one titled, and what tool type is each built on? Knowledge Evidence maps naturally to question-based tools; Performance Evidence maps naturally to observation, project or portfolio tools - a sensible default split is a knowledge quiz for AT1 and a practical observation or portfolio for AT2/AT3, but confirm rather than assume.
If task details genuinely aren't settled yet, use [AT1 - Title TBC] and flag it clearly rather than inventing a title - but still map at the evidence-code level so the structural work isn't wasted once titles are confirmed.

##### Step 4 - Populate Section 1 (Elements and Performance Criteria)

Copy the elements and PCs with the unit's own numbering, unchanged. For each PC: a Student Resource Reference (or the provisional-flag wording from mapping-standard.md section 3 if the SLR isn't structured yet), and macro-level notation in the relevant AT column(s).

##### Step 5 - Populate Section 2 (Foundation Skills)

Keep only the skills the unit actually lists, using its own category scheme (don't force the classic LLN list onto a unit that uses the four ACSF categories, or vice versa). Complete all six columns for each retained skill - see mapping-standard.md section 4, including the note on Foundation Skills trigger words for spotting skills embedded in a PC without being named explicitly.

##### Step 6 - Populate Section 3 (Range of Conditions) with Northern Territory contextualisation

This is where nt-context-of-delivery.md does the work. Even where the unit itself has no distinct Range of Conditions heading, populate this section using the unit's Assessment Conditions as the base, then add genuine NT-specific detail: delivery environment (lab/simulated/workplace), local industry and environmental conditions, and cohort/access considerations that actually apply - ask the user rather than inventing plausible-sounding detail, and check whether they've supplied a business case, TAS, or industry consultation document that already answers this.

##### Step 7 - Populate Section 4 (Mandatory Assessment Requirements)

For each coded PE and KE item: Student Resource Reference, macro-level AT notation (per assessment-tool-notation.md), following the same rules as Section 1. Then copy every Assessment Condition verbatim and complete the "how CDU addresses this" column with the specific NT delivery arrangement - simulated-environment justification if relevant (see the checklist in nt-context-of-delivery.md), actual facilities/equipment, actual access arrangements. If a condition genuinely can't be met as currently delivered, say so plainly rather than writing around it - that's a finding worth surfacing, not hiding.

Step 8 - Run the completeness gate

Before treating the matrix as finished, work through mapping-standard.md section 6: list every PC, every PE code, every KE code, every retained Foundation Skill, and confirm each appears with real notation somewhere in the matrix. Anything that doesn't goes in the closing notes (Step 10), not left blank.

##### Step 9 - Produce the output

Default output is a populated Markdown file, built from assets/Assessment_Mapping_Matrix_v7_template.md. That asset uses plain GitHub-Flavoured-Markdown pipe tables throughout - keep it that way as you populate it. Do not use raw HTML <table> markup, even though the original docx-to-Markdown conversion of this template used it (to preserve colspan/rowspan from the Word file). Raw HTML tables break in a lot of everyday Markdown viewers - Word's Markdown import, plain-text editors, some chat file previews - either getting stripped or shown as literal tags, which reads as a corrupted document to anyone just trying to read the matrix. Pipe tables render everywhere.

This means handling the two things HTML tables could do that pipe tables can't:

Section-header / colspan-style rows (e.g. an "Elements" divider row, or "Performance Evidence" / "Knowledge Evidence" / "Assessment Conditions" dividers in Section 4): put the label in the first column, bold it, and leave the remaining columns as - (a hyphen - the standard "not applicable" marker for this matrix, not an em dash and not a tick). This is exactly how the CDU-authored example in assets/Assessment_Mapping_Matrix_v7_template.md does it.
Multi-paragraph or list content in a cell: flatten it into one line of flowing prose (semicolons or commas between the pieces, consistent with the house style already), since a pipe-table cell has to be a single line.

If you're ever working from source content that still has raw HTML tables in it (an older copy of the template, or output from an earlier run of this skill), run scripts/html_tables_to_pipe_tables.py on it rather than hand-converting - it handles colspan/rowspan expansion and multi-paragraph cells consistently: python3 scripts/html_tables_to_pipe_tables.py input.md output.md.

** Save the populated file to the Cowork Files folder, named:**

**[UnitCode]_AssessmentMappingMatrix_v[n]_[YYYYMMDD].md**

Only build a .docx if the user specifically asks for one. In that case, use the docx skill together with assets/Assessment_Mapping_Matrix_v7_template.docx as the source file (this one still has the original Word table structure, which is what the docx skill needs), so the output keeps TAFE's actual formatting rather than being rebuilt from scratch.

##### Step 10 - Closing notes
 
Every matrix ends with a short section covering:

Any PC, PE or KE items that couldn't be confidently mapped, and why
Any Assessment Conditions that need educator or program-manager confirmation
Any Student Resource References marked provisional
Anything in the NT contextualisation that needs local confirmation (a specific lab, site, or partnership you didn't want to assert without checking)
A brief "Sources used" note - the unit's training.gov.au listing (with the date accessed), and any user-supplied documents you drew on for context

Follow the "Output style" section above throughout this closing section too - it's the most likely place for an unlabelled factual claim since it's written last and fastest.

A note on how this differs from a normal document task

Numbering PE/KE items and citing question numbers is a compliance requirement here, not a style choice - it doesn't conflict with a general preference for unnumbered, reorderable prose in longform documents, because a mapping matrix is a structured audit artefact, not narrative content. Keep that distinction in mind if the user has standing instructions against sequential numbering elsewhere; this skill's numbering is functional, not decorative, and should stay.



