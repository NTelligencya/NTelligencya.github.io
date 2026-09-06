# assessment-tool-builder

### description

Builds the actual  TAFE assessment tools (AT1, AT2, AT3...) from an already-completed Assessment Mapping Matrix - the Questioning quiz, Direct Observation checklist, Portfolio document list, Project brief, or Direct Observation and Questioning hybrid, whichever the matrix specifies for each task. Use whenever the user asks to build, draft, or write up the assessment tasks, quiz questions, observation checklist, portfolio requirements, or Assessor Guide content for a unit that already has a mapping matrix, or says something like "now build the AT1/AT2/AT3 documents" or "write the actual questions/checklist for this mapping". This is downstream of the assessment-mapping skill - use that one first if no matrix exists yet, then this one to turn the matrix's provisional AT notation into real, populated assessment tool documents. Also use to check whether an existing AT tool's PE/KE cross-references still match its matrix, since the two can drift apart if either is edited separately.

### Assessment tool builder

This skill turns a completed Assessment Mapping Matrix into the actual assessment tool documents it references - the real questions behind `AT1 Q3`, the real checklist item behind `AT2 Obs Item 12`, the real document requirement behind `AT3 Doc Ref 1`. The matrix says evidence exists at a specific location; this skill writes what's actually at that location, and makes sure the two stay in agreement.

That agreement is the entire point, and it's easy to lose without checking: a first real attempt at this (drafting an AT2 Direct Observation checklist from the unit text, informed by the matrix but not cross-checked against it line by line) produced six items where the PE code written into the checklist didn't match what the matrix actually said for that item - not because the checklist itself was wrong, but because writing fresh content from the unit text and eyeballing consistency isn't reliable at this level of detail. Step 5 below exists because of that, and it isn't optional.

### Before you start

Read `references/at-tool-shapes.md` in full - it describes the exact structure for each of CDU's six AT tool types (Questioning, Direct Observation, Direct Observation and Questioning, Portfolio, Portfolio Evidence Analysis Record, Project), all as plain GFM pipe tables. Don't improvise a shape; use what's there.

### Workflow

#### Step 1 - Get the matrix and the unit text

You need the completed Assessment Mapping Matrix (built by the `cdu-assessment-mapping` skill) and the full unit text it was built from (Elements/PCs, Foundation Skills, Performance Evidence, Knowledge Evidence, Assessment Conditions). If the user hasn't supplied the matrix file, ask for it rather than trying to reconstruct one - this skill's whole value is staying faithful to an already-agreed mapping, not inventing a new one.

Read the matrix's "Coded evidence list" (or equivalent) to get the PE/KE codes and their exact unit wording, and read its Section 1 / Section 4 tables to see, for every element, PC, PE and KE, which AT and which item number the matrix already assigned it. This is the specification you're building to - every item number the matrix uses has to appear in the AT file you produce, with the same codes attached.

#### Step 2 - Work out how many AT files to build, and what type each is

The matrix's unit summary or assessment-task legend names each AT and its CDU template type (e.g. "AT1: Knowledge Quiz, built on the Questioning template"). Build one file per AT. If the user only wants one or two of the three rebuilt (say, just AT2), that's fine - do only those, but still cross-check them against the full matrix in Step 5.

#### Step 3 - Populate each AT file to the shape in at-tool-shapes.md

For every item number the matrix already uses for this AT (every `Q#`, `Obs Item #`, `Doc Ref #` or `Activity #`), write the real content:

- **Questioning**: a genuine question testing the KE (occasionally PE) item the matrix assigned that Q number, plus a benchmark answer describing what a satisfactory response covers.
- **Direct Observation**: the PC, phrased as an observable "did the student…" action, plus the PE code(s) the matrix assigned that item (if any - not every PC has a matching PE item; see the note in Step 6).
- **Portfolio**: what the required document must actually contain, specific enough that a student knows what to produce and an assessor can judge it, tied to the PE/PC the matrix assigned that Doc Ref.
- **Project**: the activity/step content, tied to whichever PE/KE codes the matrix assigned it.

Write real, usable content, not placeholder text - a benchmark answer that just repeats the question back, or a checklist item that just repeats the PC verbatim with no assessor-facing detail, isn't done. At the same time, don't invent requirements the unit and matrix don't have: every question, item and document has to trace back to something the matrix already put there.

#### Step 4 - Disclose what's original content

If the user hasn't supplied an existing, approved Assessor Guide for this unit (the common case - most units being freshly mapped don't have one yet), the question wording, benchmarking detail and document specifications you're writing are original drafts, not transcriptions of an approved instrument. Say so plainly near the top of each file, in the same spirit as the mapping matrix's own confidence-labelling: this is a first working draft that needs a curriculum SME's review before use with students, not a finished Assessor Guide. Don't bury this in closing notes where it's easy to miss - a document that reads as "done" when it's actually a draft is worse than one that's honestly labelled.

Some individual items will carry their own extra caveat beyond the general "this is a draft" note - a benchmark answer that can't cite a specific standard number without inventing one, say. Tag those inline where they occur (so the caveat sits right next to the thing it qualifies), but also say in the top disclosure that this pattern exists, so a reader skimming the document knows to expect occasional inline caveats rather than discovering them one at a time.

#### Step 5 - Verify against the matrix - do this for every AT file, every time

Run `scripts/verify_at_matches_matrix.py` against each AT file you produce:

```
python3 scripts/verify_at_matches_matrix.py <matrix.md> <at_file.md> --notation "<Q|Obs Item|Doc Ref|Activity>"
```

Use the notation word the matrix actually uses for that AT (check its macro-level references to see which). The script reports any item where the PE/KE codes in the AT file don't match what the matrix says for that item number - in either direction, a code the AT file has that the matrix doesn't, or one the matrix has that the AT file is missing. Fix every mismatch it reports before treating the file as finished; don't just note the mismatches and move on. If a mismatch turns out to be because the matrix itself is wrong or stale rather than the AT file, say so to the user rather than silently "fixing" the AT file to match a matrix you think is incorrect.

This check only verifies coded cross-references, not question quality or wording - it catches drift, not weak content. Read the file yourself too.

### Step 6 - A note on blank cross-reference cells

Not every Direct Observation or Project item will have a PE code (a "-" here is normal, not a gap): the unit's Performance Criteria are a fully detailed, individually-numbered list, while its Performance Evidence is a separate, usually shorter list that summarises the overall demonstration expected and doesn't necessarily name every PC individually. An item with no PE code is still a required, assessed PC - it's mapped via its PC number in Section 1 of the matrix, it just isn't also singled out by the unit's own Performance Evidence list. 

#### Step 7 - Output

Build each AT file as a plain Markdown file using GFM pipe tables throughout (see `references/at-tool-shapes.md` - no raw HTML `<table>` markup, for the same cross-viewer-compatibility reason the mapping matrix itself avoids it). Name each file to match the matrix's own convention:

`[UnitCode]_AT[N]_[ToolType]_v[n]_[YYYYMMDD].md`

e.g. `ICTCBL322_AT2_DirectObservation_v1_20260811.md`

Follow the same house style as the mapping matrix: Australian English and confidence labels (`high`/`medium`/`low`) on anything asserted beyond the unit's own wording - a claimed facility detail, an inferred delivery arrangement, and so on.

If asked for a `.docx` instead, use the docx skill;  so build it to the pipe-table structure in `references/at-tool-shapes.md`.


