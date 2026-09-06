# CDU template quirks catalogue

What each template hides, learned from populating the full set for ICTCBL322
(August 2026). Read the general section always; read the per-template section for
whichever file is being populated. Helper names refer to
`scripts/docx_template_tools.py`.

## Contents

- General quirks (every template)
- Student Unit Guide Template v6
- Assessment Mapping Matrix v7
- Assessor Guide v7
- AT templates v2.1
- Verification checklist

## General quirks (every template)

**Placeholder highlighting is character formatting, not an overlay.** The yellow
"fill me" cues are `w:highlight` on the placeholder runs. Text written in their place
inherits the highlighter. Strip it from everything populated (`strip_highlight`), but
keep it on fields deliberately left open (per-student fields, sections the user chose
to leave blank); there it correctly signals unfinished business.

**Instructions are mixed into content.** Red or highlighted guidance sits inside
headings ("1. Unit Details (Add as many tables as needed...)"), inside content cells
("Insert the application from www.training.gov.au..."), and inside band rows
("Elements Add/remove rows as required."). All of it must be removed or replaced when
the document is populated; a finished document that still says "Insert X here" fails
at a glance. Instruction runs are usually separate runs from the label they follow,
so they can be deleted run-by-run without touching the label.

**Instruction styling outlives instruction text.** Cells that held red-italic
guidance keep that formatting in their paragraph mark, so replacement text renders as
a red warning. `normalise_runs` on the row after filling it.

**Content controls are everywhere.** Three kinds, three handlings:
- Checkboxes (`w14:checkbox`): `tick_checkbox` sets the checked attribute AND swaps
  the ☐ glyph for ☒; setting only the attribute renders unticked in some viewers.
- Dropdowns (Assessment Method): the first sdt holds the selected value, and a second
  placeholder sdt ("Choose Assessment Method") usually lurks behind it. `set_dropdown`
  sets the first and deletes the rest. Use exact values from the dropdown's listItems:
  "Questioning (written or verbal)", "Direct Observation (reflecting authentic
  workplace activities)", "Product based (work products, logbook, portfolio)",
  "Structured Activities (project, role plays, activity sheets)", "Third party
  (reports, interviews and logbook verification)".
- Date pickers wrapped around ENTIRE cells: the cell is invisible to `row.cells` and
  to direct-tc listing, so a 4-column row reports 3 cells. `dump_table` prints the
  direct tc count per row to expose this; `unwrap_row_cell_sdt` fixes it.

**Hyperlinks are not runs.** `w:hyperlink` elements carry their own runs; clearing
only `w:r` leaves "www.training.gov.au" fragments in a filled cell. `set_p_text`
clears runs, hyperlinks and inline sdts together.

**Fragmented runs.** Word splits visible phrases across runs ("Do"+"cu"+"ment
version"+"#"), especially in footers. `replace_fragmented_text` handles these;
single-run replacement silently fails to match.

**Bookmarks collide across documents.** Tables copied from another docx (Assessor
Guide detail tables into the SUG; populated matrix tables into the Assessor Guide)
bring bookmark IDs that duplicate the destination's. Schema validation fails.
`strip_bookmarks` on every imported element.

**Page breaks hide in empty paragraphs.** Sections are separated by hard page breaks
inside empty spacer paragraphs. Deleting a section orphans its breaks; stacked breaks
produce blank pages. `collapse_duplicate_page_breaks` at the end of every build, and
`remove_trailing_empty_paragraphs` for the blank-last-page case. A single leftover
break immediately before a Word section boundary (portrait→landscape) also yields a
blank page and needs targeted removal.

**Floating logos are anchored to empty paragraphs.** The CDU logo on section pages is
a floating drawing anchored to a nearby empty paragraph, not a header. Two traps:
cloning such a paragraph as a spacer stamps logos over later pages (use
`make_spacer_prototype`, which refuses paragraphs containing drawings); and rows that
split across a page start under the floating logo (use `cant_split` on long rows).

**Numbering is inconsistent.** Section headings 1–6 may be an auto-numbered list
while "7. ..." is hardcoded text. Removing or inserting sections desynchronises them;
check heading numbers after structural changes.

**Template version stamps are sacred.** The footer's AQ&I segment ("Assessment
Mapping Matrix | Academic Quality & Integrity (AQ&I) | October 2025 | v7") identifies
the template version and stays. The "Document version #" placeholder in the same
footer is yours to fill with the populated document's identity.

## Student Unit Guide Template v6

- Cover: "Team:", "Unit code", "Unit name" paragraphs plus a band table carrying
  "Student Unit Guide | Unit Code and Title". Student-details table stays blank
  (per-student, keeps highlight).
- Unit Details table alternates header/content rows: Unit Code and Title,
  Application, Elements, Performance Evidence, Knowledge Evidence.
- Six AT slots in fixed method order: Questioning, Direct Observation, Project,
  Portfolio, Third Party, RPL Self-Assessment. Each slot = banner table ("AT# Method"
  + "Unit Code and Title") + an "Insert Assessment Detail Table here from the
  Assessor Guide" placeholder + a feedback table. Keep the slots the unit uses,
  delete the rest, and mind the orphaned page breaks.
- The Assessment Detail tables do not exist in this template; copy them from the
  Assessor Guide v7 (each is marked "mandatory and must be copied to the Student
  Unit Guide"), strip bookmarks, drop the red "must be copied" note from the copy.
- "Insert table from Assessor Guide" under Unit Assessment Summary = the 4-column
  summary table (task number / method+description / attempts / due date). Its due
  date cells are cell-level date pickers (see general quirks).
- The Portfolio detail table's numbered evidence rows have counterintuitive widths:
  the wide column is the numbered one; put descriptions there.
- Student Feedback section ships rows for exactly AT1–AT3 plus an instruction
  ("You can add rows or remove...") to strip. The Student Declaration references the
  document via a FILENAME field that resolves on open; leave it.

## Assessment Mapping Matrix v7

- Landscape; header carries "Assessment Mapping Matrix | Unit Code and Title".
- Approval record: Document title (plain), pre-validation and next-review dates as
  cell-level date pickers, Team Leader approval with an inline date picker.
- Version history ships ~9 blank rows; fill the real versions, keep about two
  spares, delete the rest.
- Section 1 ships a 3-element × 5-PC skeleton. Capture three row prototypes before
  deleting: element row, PC-first row (two paragraphs: "Performance Criteria" + the
  number), PC-continuation row; then clone per the unit's real structure.
- Foundation Skills table names ten skills; keep/rename/delete rows to the unit's
  actual list. Renamed rows serve ACSF-derived categories the template lacks
  ("Navigate the world of work", "Get the work done").
- Range of Conditions has exactly 4 data rows; Section 4 ships ~7 blank PE and KE
  rows and one AC row; clone from a blank data-row prototype to the counts needed.
- Highlighted "Add/remove rows as required." instructions in band cells; "(if
  applicable)" in the Range of Conditions heading.
- Use "-" in empty mapping cells so an auditor reads deliberate non-mapping, not an
  incomplete document.

## Assessor Guide v7

- Cover band table; Unit Details with Yes/No checkbox rows for prerequisites and
  licensing; Unit Assessment Summary same structure as the SUG's.
- Sections 3 and 4 are Y/N checkbox questions whose answer rows carry red
  instruction styling; fill and `normalise_runs`. Leave a box unticked with a "to be
  confirmed" note rather than asserting something unverified (e.g. the equipment
  register).
- Questioning section provides example question tables in three formats (digital,
  hand-written, verbal/RPL) plus a case-study stub. Clone the 2-row digital table
  (Q# + question / benchmark + S-US) per real question; delete ALL example tables
  afterwards including the one used as the prototype, and the format headings.
- The Direct Observation section's banner is embedded as the first row of its
  Assessment Details table (not a separate banner table), and its context row has
  only two options (Simulated/Active). Its Benchmark Guide cell points at the AT2
  instrument as the benchmark document rather than repeating the checklist.
- The Portfolio "Ref # / Document Name / Criteria" table's example rows use merged
  spanning cells that cannot be filled row-by-row; rebuild data rows by cloning the
  header row, stripping its shading and bold, then fill.
- Project and Third Party sections: delete whole spans (banner through benchmark
  table), keeping bookmarkEnds and one page break per boundary.
- The template embeds a full copy of the Assessment Mapping Matrix at the end
  (portrait→landscape section change). If the matrix docx is already populated, copy
  its four section tables in wholesale (strip bookmarks) instead of re-filling.
- Floating logos are anchored in empty paragraphs through this template; never
  clone them as spacers.

## AT templates v2.1

Questioning / Direct Observation / Portfolio / Direct Observation and Questioning.
These become the student-facing instruments. Their Assessment Details content
originates in the Assessor Guide; benchmark rows are removed from anything copied
into a student-facing document. Same general quirks apply (checkboxes, highlights,
"Click to enter" placeholders in student-details tables, which stay as-is for
per-student completion).

## Verification checklist

Run all four, in order, on every populated template:

1. `validate.py <out>.docx --original <template>.docx` passes (duplicate bookmark
   IDs are the usual failure).
2. Render to PDF, then page images; view every page: no leftover highlights except
   deliberate ones, no duplicated logos, no blank pages, no content under floating
   images, no text in wrong columns of merged tables, banners show the right AT
   numbers and unit title.
3. Plain-text placeholder scan is clean: Insert, Enter your, Click here, Choose,
   Add/remove, UNITCODE, AT#, "remove this", "if a cluster".
4. Programmatic completeness check against the source markdown: counts and codes of
   Elements, PCs, PE/KE/AC, questions, checklist items, doc refs all match, no
   duplicates.