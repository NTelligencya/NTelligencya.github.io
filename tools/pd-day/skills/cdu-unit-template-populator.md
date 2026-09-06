---
name: cdu-unit-template-populator
description: Populates CDU TAFE's official Word templates (Student Unit Guide v6, Assessment Mapping Matrix v7, Assessor Guide v7, AT templates v2.1, Assessment Summary v5) by editing the template file in place, preserving the structure CDU's compliance depends on; headers, footers, logos, styles, checkboxes, content controls and the AQ&I version stamp survive untouched. Use whenever the user asks to populate, fill in, or transfer mapped content into a CDU Word template, says "do the Word version", says the markdown content is ready for the official template, gives a unit code plus a template name, or wants a populated template checked against its markdown source or updated without disturbing the rest. Never hand-author these documents from scratch or rebuild them with a docx generator; in-place editing is the compliance-safe path and this skill is how to do it.
---

# CDU Unit Template Populator

Transfer completed unit content (usually markdown from the cdu-assessment-mapping /
cdu-assessment-tool-builder pipeline) into CDU's official Word templates without
disturbing anything that makes the template the template.

## Why in-place editing is the only acceptable method

These templates are controlled documents issued by Academic Quality & Integrity (AQ&I).
An auditor recognises them by their machinery: the CDU logo placement, the header bands,
the footer with the AQ&I template version ("October 2025 | v7"), the exact table
structures, the checkbox and dropdown content controls. Regenerating a lookalike from
scratch loses invisible parts of that machinery and is not the same document. So: copy
the template file, open the copy, and edit its XML in place. Everything not deliberately
changed stays byte-identical.

## Workflow

Work through these steps in order. Do not skip the inspection or verification steps;
every template in this family hides structure that will bite an unexamined edit.

**Stage and copy.** Stage the template and the content sources (markdown matrix, tools,
assessor guides, workbook). Copy the template to a scratch working directory and only
ever edit the copy.

**Inspect before planning.** Read `references/template-quirks.md` first; it catalogues
what each template hides. Then map the actual file with the inspection helpers in
`scripts/docx_template_tools.py` (`dump_body`, `dump_table`): the body element sequence
(paragraphs, tables, bookmarks, page breaks), every table's rows and merged cells, where
content controls (checkboxes, dropdowns, date pickers) sit, which runs carry the yellow
"fill me" highlight, what lives in headers and footers, and where floating logo images
are anchored. Five minutes of mapping prevents an hour of debugging.

**Resolve open choices once.** Some fields are the user's call, not yours: team names,
whether to draft or leave blank optional sections (delivery plans, AI statements),
anything the source markdown flags as unconfirmed. Ask once, together, before building.
Anything genuinely unknowable stays honest: leave it blank or mark it "to be confirmed
with the program area" rather than inventing a value.

**Build with a script.** Write a Python build script that imports
`scripts/docx_template_tools.py` and makes every change through those helpers; they
handle the run/paragraph mechanics that raw edits get wrong. Content rules while
filling:

- The unit's own wording goes in verbatim; Element and Performance Criteria numbering
  is never changed, regrouped or paraphrased. PE/KE/AT codes must match the mapping
  matrix exactly, since the audit trail runs unit → matrix → tool → guide.
- Where the template ships more structure than the unit needs (extra AT slots, spare
  evidence rows, unused Foundation Skills), remove the excess cleanly; where it ships
  less (three example elements when the unit has eight), clone row prototypes captured
  from the template itself so new rows carry the template's own formatting.
- Filled text sheds its placeholder styling: strip the yellow highlight from runs you
  populate, and normalise red/italic instruction styling when an instruction cell
  becomes real content. Fields that are deliberately left for later (per-student
  fields, a team statement the user chose to leave blank) keep their highlight; it is
  the template's signal that the field is still open.
- Australian English throughout; no em dashes; no confidence labels inside the
  document. Report uncertainties and unconfirmed items in the chat summary instead.

**Verify like an auditor.** Four checks, all of them, every time:

1. Schema validation against the original (`validate.py` from the docx skill, with
   `--original`); fix every violation, including duplicate bookmark IDs from copied
   tables.
2. Render to PDF and page images, and actually look at every page. The failures this
   catches are exactly the ones text checks miss: leftover highlights, cloned logos,
   blank pages from orphaned page breaks, content landing in the wrong column of a
   merged table, rows splitting under a floating header image.
3. Placeholder scan: extract plain text and search for instruction phrases ("Insert",
   "Enter your", "Click here", "Choose", "Add/remove", "UNITCODE", "AT#", "remove
   this"). Zero hits or a deliberate explanation for each.
4. Completeness cross-check against the source markdown, programmatically where
   possible: every Element, PC, PE, KE, AC, question, checklist item and doc ref
   present, with no duplicates.

**Name and deliver.** Name outputs `UNITCODE_DocumentName_vN_YYYYMMDD.docx`, matching
the version lineage of the source markdown (content transferred from a v2 matrix is
still v2). Send the file and commit it to the unit's output folder on the user's
machine, then summarise in chat what was filled, what was left blank on purpose, and
what still needs program-area confirmation.

## The quirks, in one breath

Full detail and per-template maps are in `references/template-quirks.md`; read it
before touching any of these files. The recurring traps: placeholder highlighting baked
into runs; instruction text mixed into headings and content cells; checkbox/dropdown/
date-picker content controls, including date pickers wrapped around entire table cells
that make a 4-column row look like 3 columns; text split across fragmented runs
(footers especially); hyperlinks living in `w:hyperlink` wrappers a naive run-clear
misses; duplicate bookmark IDs when tables are copied between documents; hard page
breaks hidden in empty spacer paragraphs; floating logo images anchored to empty
paragraphs that must never be cloned as spacers; merged/spanning example rows that need
rebuilding rather than filling; and one hardcoded heading number sitting after an
auto-numbered list.