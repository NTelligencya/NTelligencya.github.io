#!/usr/bin/env python3
"""Build the PD Day procedure page at /cdu-ict-pd-day/: plain HTML, no scroll
effects, every skill file shown in full. The copy lives here; the skill texts
live in ./skills/ (verbatim copies from SD's vault and the Codex skill). Run
from anywhere: python3 tools/pd-day/build-pd-doc.py. It overwrites index.html."""
import html, os

HERE = os.path.dirname(os.path.abspath(__file__))
SK = os.path.join(HERE, 'skills')
OUT = os.path.normpath(os.path.join(HERE, '..', '..', 'cdu-ict-pd-day', 'index.html'))

def skill(fname, path_label, note):
    txt = open(os.path.join(SK, fname)).read().rstrip('\n')
    # drop the Obsidian image embed line in the mapping skill; the screenshot is shown beside it
    txt = '\n'.join(l for l in txt.split('\n') if not l.startswith('![['))
    lines = txt.count('\n') + 1
    return f'''<div class="skillfile" data-skillfile>
  <div class="skillfile__bar">
    <span class="skillfile__path">{html.escape(path_label)}</span>
    <span class="skillfile__meta">{lines} lines</span>
    <button type="button" class="skillfile__btn" data-expand hidden>Show the whole file</button>
  </div>
  <pre class="skillfile__pre" tabindex="0"><code>{html.escape(txt)}</code></pre>
  <p class="skillfile__note">{note}</p>
</div>'''

TREE = '''Mapping workspace/                                   set up once; one place for every unit
├─ CLAUDE.md                                         the brief; Cowork reads it first, every run
├─ 1. TAFE How to map assessments/                   the four ASQA and TAE reference PDFs
├─ 2. TAFE Templates/                                CDU's Word templates: Matrix v7, AT v2.1, Assessor Guide v7,
│                                                    Student Unit Guide v6, Assessment Summary v5
├─ 3. TAFE Mapping Claude Skills and files/          the four Cowork skills, as documents
├─ 4. Example CTCBL322 Mapping/                      the finished model unit; read only
└─ 5. CURRENT MAPPING PROJECT- Open_cablers advanced skill set/   the live project
   ├─ Open Cablers About the skill set/              ICTSS00086 course structure and PDFs
   ├─ Open Cablers Business_case_contextualisation/  the business case every unit draws on
   ├─ Open Cablers Compliance and regulatory library/ the current regulatory set; superseded kept apart
   ├─ SME To Do - Open Cabler Advanced Skill Set.md   the handover list
   └─ Open Cablers Units/                            one folder per unit
      └─ ICTCBL303/                                  the only new folder per unit
         ├─ Unit download from the National Training Register/
         │  ├─ ICTCBL303_Complete_R2.pdf             the one input: the unit
         │  └─ ICTCBL303_AssessmentRequirements_R2.pdf   and its assessment requirements
         ├─ ICTCBL303_Research_and_NT_Context_20260823.md   written before any skill runs
         ├─ CLAUDE.md                                the unit-level brief and status
         ├─ Mapping outputs/                         phases 1 to 3 write here
         │  └─ Populated Word templates/             phase 4 writes here
         └─ Student workbook (Brambling)/            the workbook pages and diagram lists'''

UNIT_TREE = '''ICTCBL303/
├─ Unit download from the National Training Register/
│  ├─ ICTCBL303_Complete_R2.pdf
│  └─ ICTCBL303_AssessmentRequirements_R2.pdf
├─ ICTCBL303_Research_and_NT_Context_20260823.md              written before any skill runs
├─ ICTCBL303 - Unit overview.md
├─ CLAUDE.md                                                  the unit-level brief and status
├─ Mapping outputs/
│  ├─ ICTCBL303_AssessmentMappingMatrix_v1_20260823.md        phase 1
│  ├─ ICTCBL303_MappingBuildReport_v1_20260823.md             phase 1
│  ├─ ICTCBL303_AT1_Questioning_v1_20260823.md                phase 2
│  ├─ ICTCBL303_AT2_DirectObservation_v1_20260823.md          phase 2
│  ├─ ICTCBL303_AT3_Portfolio_v1_20260823.md                  phase 2
│  ├─ ICTCBL303_ToolBuildReport_v1_20260823.md                phase 2
│  ├─ ICTCBL303_PreValidation_Findings_20260823.md            phase 3
│  ├─ ICTCBL303_AssessmentMappingMatrix_v2_20260830.md        phase 1 again, once the workbook existed
│  └─ Populated Word templates/
│     ├─ ICTCBL303_AssessmentMappingMatrix_v1_20260823.docx   phase 4
│     ├─ ICTCBL303_StudentUnitGuide_v1_20260823.docx          phase 4
│     ├─ ICTCBL303_AssessorGuide_v1_20260823.docx             phase 4
│     ├─ ICTCBL303_AT1_Questioning_v1_20260823.docx           phase 4
│     ├─ ICTCBL303_AT2_DirectObservation_v1_20260823.docx     phase 4
│     ├─ ICTCBL303_AT3_Portfolio_v1_20260823.docx             phase 4
│     └─ ICTCBL303_AssessmentMappingMatrix_v2_20260830.docx   phase 4
└─ Student workbook (Brambling)/
   ├─ ICTCBL303_Workbook_00_Unit_Overview.md
   ├─ ICTCBL303_Workbook_Element1_PrepareToInstallAndTerminate.md
   ├─ ICTCBL303_Workbook_Element1_DiagramRecommendations.md   read by phase 5
   ├─ ICTCBL303_Workbook_Element2_InstallTerminateAndTest.md
   ├─ ICTCBL303_Workbook_Element2_DiagramRecommendations.md
   ├─ ICTCBL303_Workbook_Element3_RemoveTerminationWaste.md
   ├─ ICTCBL303_Workbook_Element3_DiagramRecommendations.md
   ├─ ICTCBL303_Workbook_Element4_DocumentInstallation.md
   └─ ICTCBL303_Workbook_Element4_DiagramRecommendations.md'''

CTREE = '''<ul class="ctree" aria-label="The mapping workspace and the ICTCBL303 unit folder">
<li><span class="d">Mapping workspace/</span></li>
<li><span class="b">├─ </span><span class="s">CLAUDE.md</span><span class="t">                                        the brief, read first every time</span></li>
<li><span class="b">├─ </span><span class="s">Business_case_Open_Cabler_FINAL.md</span><span class="t">               cohort and NT context</span></li>
<li><span class="b">├─ </span><span class="s">ASQA how-to-map reference docs/</span><span class="t">                  four PDFs</span></li>
<li><span class="b">├─ </span><span class="s">Skills/</span><span class="t">                                          the four Cowork skills</span></li>
<li><span class="b">└─ </span><span class="d">ICTCBL303/</span><span class="t">                                       Install and terminate coaxial cable</span></li>
<li><span class="b">   ├─ </span><span class="d">Unit download from the National Training Register/</span></li>
<li><span class="b">   │  ├─ </span><span class="i">ICTCBL303_Complete_R2.pdf</span></li>
<li><span class="b">   │  └─ </span><span class="i">ICTCBL303_AssessmentRequirements_R2.pdf</span></li>
<li><span class="b">   ├─ </span><span class="s">ICTCBL303_Research_and_NT_Context_20260823.md</span><span class="t">             read before any skill runs</span></li>
<li><span class="b">   ├─ </span><span class="s">CLAUDE.md</span><span class="t">                                     the unit-level brief and status</span></li>
<li><span class="b">   ├─ </span><span class="d">Mapping outputs/</span></li>
<li><span class="b">   │  ├─ </span><span class="o">ICTCBL303_AssessmentMappingMatrix_v1_20260823.md</span><span class="t">       phase 1</span></li>
<li><span class="b">   │  ├─ </span><span class="o">ICTCBL303_MappingBuildReport_v1_20260823.md</span><span class="t">            phase 1</span></li>
<li><span class="b">   │  ├─ </span><span class="o">ICTCBL303_AT1_Questioning_v1_20260823.md</span><span class="t">               phase 2</span></li>
<li><span class="b">   │  ├─ </span><span class="o">ICTCBL303_AT2_DirectObservation_v1_20260823.md</span><span class="t">         phase 2</span></li>
<li><span class="b">   │  ├─ </span><span class="o">ICTCBL303_AT3_Portfolio_v1_20260823.md</span><span class="t">                 phase 2</span></li>
<li><span class="b">   │  ├─ </span><span class="o">ICTCBL303_ToolBuildReport_v1_20260823.md</span><span class="t">               phase 2</span></li>
<li><span class="b">   │  ├─ </span><span class="o">ICTCBL303_PreValidation_Findings_20260823.md</span><span class="t">           phase 3</span></li>
<li><span class="b">   │  ├─ </span><span class="o">ICTCBL303_AssessmentMappingMatrix_v2_20260830.md</span><span class="t">       phase 1, reissued 30 Aug</span></li>
<li><span class="b">   │  └─ </span><span class="d">Populated Word templates/</span></li>
<li><span class="b">   │     ├─ </span><span class="o">ICTCBL303_AssessmentMappingMatrix_v1_20260823.docx</span><span class="t">  phase 4</span></li>
<li><span class="b">   │     ├─ </span><span class="o">ICTCBL303_StudentUnitGuide_v1_20260823.docx</span><span class="t">         phase 4</span></li>
<li><span class="b">   │     ├─ </span><span class="o">ICTCBL303_AssessorGuide_v1_20260823.docx</span><span class="t">            phase 4</span></li>
<li><span class="b">   │     ├─ </span><span class="o">ICTCBL303_AT1_Questioning_v1_20260823.docx</span><span class="t">          phase 4</span></li>
<li><span class="b">   │     ├─ </span><span class="o">ICTCBL303_AT2_DirectObservation_v1_20260823.docx</span><span class="t">    phase 4</span></li>
<li><span class="b">   │     ├─ </span><span class="o">ICTCBL303_AT3_Portfolio_v1_20260823.docx</span><span class="t">            phase 4</span></li>
<li><span class="b">   │     └─ </span><span class="o">ICTCBL303_AssessmentMappingMatrix_v2_20260830.docx</span><span class="t">  phase 4</span></li>
<li><span class="b">   └─ </span><span class="d">Student workbook (Brambling)/</span></li>
<li><span class="b">      ├─ </span><span class="o">ICTCBL303_Workbook_00_Unit_Overview.md</span></li>
<li><span class="b">      ├─ </span><span class="o">ICTCBL303_Workbook_Element1_PrepareToInstallAndTerminate.md</span></li>
<li><span class="b">      ├─ </span><span class="o">ICTCBL303_Workbook_Element1_DiagramRecommendations.md</span><span class="t">  read by phase 5</span></li>
<li><span class="b">      ├─ </span><span class="o">ICTCBL303_Workbook_Element2_InstallTerminateAndTest.md</span></li>
<li><span class="b">      ├─ </span><span class="o">ICTCBL303_Workbook_Element2_DiagramRecommendations.md</span></li>
<li><span class="b">      ├─ </span><span class="o">ICTCBL303_Workbook_Element3_RemoveTerminationWaste.md</span></li>
<li><span class="b">      ├─ </span><span class="o">ICTCBL303_Workbook_Element3_DiagramRecommendations.md</span></li>
<li><span class="b">      ├─ </span><span class="o">ICTCBL303_Workbook_Element4_DocumentInstallation.md</span></li>
<li><span class="b">      └─ </span><span class="o">ICTCBL303_Workbook_Element4_DiagramRecommendations.md</span></li>
</ul>
<ul class="legend" aria-label="Key"><li class="s">Set up once</li><li class="i">The one input per unit</li><li class="o">Written by the pipeline</li></ul>'''

XML_ROW = open(os.path.join(HERE, 'elements-row.xml')).read().rstrip('\n')
MD_ROWS = """| **Mandatory Unit Requirements** | **Student Resource Reference** | **Assessment 1** **Knowledge Quiz** | **Assessment 2** **Direct Observation** | **Assessment 3** **Portfolio** |
|---|---|---|---|---|
| **Elements** | - | - | - | - |
| Element 1: Prepare for installation of optical fibre cable | Workbook Element 1 | - | AT2 Obs Item 1-8 | - |
| Performance Criteria **1.1** Access site according to enterprise procedures | Workbook Element 1, section 1.1 | - | AT2 Obs Item 1 | - |"""

page = f'''<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>ICT, CS and Digital PD Day · NTellWorldInk</title>
<meta name="description" content="Mapping and assessment design in Claude Cowork, phase by phase: the procedure used to map, tool, pre-validate, populate and illustrate the seven Open Cabler units, with every skill file in full. A one-day PD session for the CDU TAFE ICT, Cyber Security and Digital team.">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&amp;family=JetBrains+Mono:wght@400;500&amp;family=Manrope:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="doc.css">
</head>
<body>

<header class="bar">
  <a class="bar__mark" href="/">NTellWorldInk <small>Charles Darwin University · TAFE ICT, Cyber Security and Digital</small></a>
  <nav class="bar__nav" aria-label="Page">
    <a href="/client-access/">Course access</a>
    <a href="#contents">Contents</a>
  </nav>
</header>

<div class="layout">

<nav class="toc" id="contents" aria-label="Contents">
  <p class="toc__h">Contents</p>
  <ol class="toc__list">
    <li><a href="#before">Before you start</a></li>
    <li><a href="#markdown">Interlude: why Markdown first</a></li>
    <li><a href="#context">Directories and context</a></li>
    <li><a href="#phase-1">Phase 1: map the unit</a></li>
    <li><a href="#phase-2">Phase 2: build the tools</a></li>
    <li><a href="#phase-3">Phase 3: pre-validate</a></li>
    <li><a href="#phase-4">Phase 4: populate the templates</a></li>
    <li><a href="#phase-5">Phase 5: illustrate</a></li>
    <li><a href="#stepping-in">Where the person steered</a></li>
    <li><a href="#handover">What the SME still supplies</a></li>
    <li><a href="#next-unit">The next unit</a></li>
  </ol>
</nav>

<main class="doc" id="top">

<header class="title">
  <p class="eyebrow">ICT, Cyber Security and Digital PD Day</p>
  <h1>Mapping and assessment design in Claude Cowork</h1>
  <p class="title__sub">The Open Cabler workflow, phase by phase. How the seven units of the Advanced Cabler Registration Skill Set, ICTSS00086, were mapped, tooled, pre-validated, populated into CDU's Word templates and illustrated, and how to run the next unit the same way.</p>
  <p class="title__how">Work down the page in order. Each phase lists what goes in, what you do, the full skill file, what comes out and what you check. The skill files are shown exactly as saved; scroll inside each block, or open it in full.</p>
</header>

<!-- ============================================================ before you start -->
<section class="sec" id="before">
  <h2><span class="sec__n">0</span>Before you start</h2>

  <h3>Chat or Cowork: what changes</h3>
  <p>In a chat window you paste text in, read the answer and copy it out. The model never opens a file. Each step is done by hand, and each file is checked against the others by hand.</p>
  <p>Cowork works on a folder. Point it at the mapping workspace and it opens the files there, reads them, cross-checks them against each other, writes new files and saves them to disk in one run. It reads a written brief, CLAUDE.md, and follows saved procedures, the skills, rather than a one-off prompt.</p>
  <p>One unit produces about twenty files that have to agree with each other and with the register: a mapping matrix, three assessment tools, three assessor guides, a pre-validation report and one workbook page per Element. Cross-checking twenty files is the part a chat window does badly and Cowork does in one pass.</p>
  <div class="two">
    <div class="panel">
      <p class="panel__h">The same job in a chat window</p>
      <ol>
        <li>Paste the unit text from the register PDF.</li>
        <li>Copy the answer into the Word template.</li>
        <li>Paste the matrix back in to write the quiz.</li>
        <li>Paste the quiz back in to check its codes.</li>
        <li>Repeat for the checklist, the portfolio, three guides, the findings and eight workbook pages.</li>
        <li>Check the files against each other by hand.</li>
      </ol>
    </div>
    <div class="panel panel--files">
      <p class="panel__h">The same job in Cowork, one run: ICTCBL322 Mapping Outputs</p>
      <ul class="files">
        <li>ICTCBL322_AssessmentMappingMatrix_v2_20260815.md</li>
        <li>ICTCBL322_AT1_Questioning_v2_20260815.md</li>
        <li>ICTCBL322_AT2_DirectObservation_v2_20260815.md</li>
        <li>ICTCBL322_AT3_Portfolio_v2_20260815.md</li>
        <li>ICTCBL322_AssessorGuide_AT1_Questioning_v1_20260815.md</li>
        <li>ICTCBL322_AssessorGuide_AT2_DirectObservation_v1_20260815.md</li>
        <li>ICTCBL322_AssessorGuide_AT3_Portfolio_v1_20260815.md</li>
        <li>ICTCBL322_PreValidation_Findings_20260815.md</li>
        <li class="dir">Student Workbook (Brambling): 00 overview, Elements 1 to 8</li>
      </ul>
    </div>
  </div>

  <h3>What a skill is</h3>
  <div class="withfig">
    <div>
      <p>A skill is a folder Claude reads when a task matches its description. The file that matters is SKILL.md. It holds the skill's name, a description of when to use it, and the workflow, step by step. Beside it sit the files the workflow points at: references (the mapping standard, the notation rules, the NT context rules), scripts (checks that run the same way every time) and assets (the template).</p>
      <p>None of the four Cowork skills was written by hand. The pattern, used for every phase:</p>
      <ol class="steps">
        <li>Do the job with Claude for one unit, ICTCBL322. Give it the same guidance a TAE unit-design course gives: the ASQA Guide to developing assessment tools, the TAE Assessment Cluster training manual, the Users' guide to the Standards, and the CDU template the output has to fit.</li>
        <li>Read the output against that guidance. Correct it. Repeat until it is right.</li>
        <li>Run the skill creator: ask Claude to create a skill from what it has just done. It writes SKILL.md from the process it followed and packages the references, scripts and assets it used.</li>
        <li>Save the skill where Cowork loads it: your Claude account's skills, or the workspace folder.</li>
        <li>On the next unit, run the skill instead of repeating the conversation.</li>
      </ol>
    </div>
    <figure class="fig fig--small">
      <img src="assets/skill-files-mapping.png" width="233" height="315" alt="Cowork's file list for the cdu-assessment-mapping skill: SKILL.md, an assets folder with the Assessment Mapping Matrix template, a references folder with assessment-tool-notation, mapping-standard and nt-context-of-delivery, and a scripts folder with html_tables_to_pipe_tables.py">
      <figcaption>The cdu-assessment-mapping skill as Cowork lists it: seven files.</figcaption>
    </figure>
  </div>

  <h3>Set up the workspace once</h3>
  <p>Everything below sits in one folder. All of it is set up once and reused; the only new item per unit is the unit's own folder with its download from the National Training Register.</p>
  <pre class="tree"><code>{html.escape(TREE)}</code></pre>

  <h3>What Claude needs before the first run</h3>
  <p>All of it sits in the workspace before any skill runs. None of it is typed into a prompt.</p>
  <dl class="inputs">
    <div><dt>The unit code and its register download</dt><dd>Two PDFs per unit from training.gov.au: the unit of competency and its assessment requirements. Seven units in the skill set.</dd></div>
    <div><dt>The nominal hours</dt><dd>The NT allocated figures from the program area, 23 August 2026: 330 hours across the seven units. Recorded once in the brief and used in every mapping, Student Unit Guide and TAS reference.</dd></div>
    <div><dt>The business case</dt><dd>Business_case_Open_Cabler_FINAL.md: the three cohorts, the NT regulatory and market context and the WHS risks. It answers the questions the mapping skill would otherwise stop and ask.</dd></div>
    <div><dt>The CDU templates</dt><dd>Assessment Mapping Matrix v7, the AT templates v2.1, Assessor Guide v7, Student Unit Guide v6 and Assessment Summary v5, as issued by Academic Quality and Integrity. Phase 4 edits copies of these.</dd></div>
    <div><dt>The how-to-map references</dt><dd>The ASQA Guide to developing assessment tools, the Users' guide to the Standards, the TAE Assessment Cluster training manual and the CMS tip sheet on unit and pre-assessment validation. The first mapping was built to this guidance, and phase 3 checks against it.</dd></div>
    <div><dt>The brief and the skills</dt><dd>CLAUDE.md, read first on every run, and the four Cowork skills. The brief holds the unit table, the readiness bar set by ICTCBL322, the one numbering rule and the house style.</dd></div>
    <div><dt>The regulatory library</dt><dd>Cabling Provider Rules 2025, AS/CA S009:2020 and S008:2020, the Labelling Notice Instrument 2025, the NT Electrical Safety Act 2022 and Regulations 2024, and the NT confined spaces code of practice. Superseded instruments are kept in their own folder and never cited as current.</dd></div>
    <div><dt>The unit research file</dt><dd>One per unit, written before any skill runs: currency checks, regulatory anchors, NT contextualisation and known gaps. Every skill reads it first.</dd></div>
  </dl>

  <div class="rule">
    <p class="rule__k">The one rule that governs every phase</p>
    <p>Content and mapping are organised against the unit's own Elements and Performance Criteria, using the unit's own numbering, unchanged. Nothing is renumbered, regrouped, merged or paraphrased. An auditor must be able to trace any question, checklist item or paragraph straight back to the competency it covers.</p>
  </div>
</section>

<!-- ============================================================ interlude -->
<section class="sec" id="markdown">
  <h2><span class="sec__n">Interlude</span>Why the content is written in Markdown first</h2>
  <p class="produces"><b>The rule:</b> Markdown is the working format. Word documents come only from the template-populator skill, at phase 4, once the content is finished. Content decisions are never made inside a Word file.</p>
  <p>This is what keeps Claude's effort on the content: the unit's wording, the evidence codes, the traceability, the compliance. Not on navigating the structure of a legacy Word document. For anyone who has worked with XML, the reason is quick to show.</p>

  <h3>What a .docx actually is</h3>
  <p>A .docx is a zip archive of XML parts: document.xml for the body, then separate parts for headers, footers, styles, numbering, settings and a glossary, plus the relationship files that tie them together. The visible text sits inside runs, w:r elements, and Word splits a run wherever formatting, spell-check state or edit history changed, so one phrase can be three runs. Tables carry merged cells (w:gridSpan, w:vMerge). Content controls (w:sdt) wrap checkboxes, dropdowns and sometimes an entire cell, so a four-column row reports three cells. Bookmarks carry IDs that must stay unique across the file. The yellow "fill me" placeholder is character formatting on the run, not an overlay, so text typed in its place inherits it. None of that is content. All of it has to be preserved for the file to remain a valid CDU controlled document.</p>
  <p>The Assessment Mapping Matrix v7 template, unzipped: document.xml alone is 166 KB. It holds 352 paragraphs, 260 of them with no text at all (spacers and break carriers), 130 text runs, 6 tables, 3 content controls and 13 highlighted placeholder runs.</p>

  <h3>The same row, both ways</h3>
  <p>The Elements band row that opens Section 1 of the matrix. On the left, the ICTCBL322 matrix in Markdown: one line for that row, with the table header and the two rows that follow it for context. On the right, the same band row in the template's document.xml: 47 lines, three runs, one of them the highlighted instruction the model has to find and remove before the document is finished.</p>
  <div class="two two--code">
    <figure class="fig">
      <pre class="tree pre--cap"><code>{html.escape(MD_ROWS)}</code></pre>
      <figcaption>ICTCBL322_AssessmentMappingMatrix_v2_20260815.md, Section 1, first five lines of the table.</figcaption>
    </figure>
    <figure class="fig">
      <pre class="tree pre--cap"><code>{html.escape(XML_ROW)}</code></pre>
      <figcaption>Assessment Mapping Matrix v7.docx, word/document.xml, the same band row. Pretty-printed; the file stores it on one line.</figcaption>
    </figure>
  </div>

  <h3>Why that matters for the model</h3>
  <ul>
    <li><b>Effort goes to the content.</b> Every token spent on structure is a token not spent on the unit. In Markdown the structure is nearly free: a heading is a hash, a table row is pipes, bold is asterisks. The whole file is the content.</li>
    <li><b>The model can check what it wrote.</b> A Markdown file reads back the way it was written, so a completeness check is a read of the file. A phrase split across three w:r elements cannot be checked by reading; it needs a parser and a helper that knows the split is there.</li>
    <li><b>Versions diff.</b> v1 to v2 of a matrix is a readable line diff. Two .docx files do not diff in any useful way.</li>
    <li><b>Every viewer renders it.</b> Obsidian, GitHub, Word's Markdown import, a chat preview. The skills use pipe tables only, never raw HTML tables, for that reason.</li>
    <li><b>The template's machinery is untouched until the end.</b> Phase 4 copies the controlled document and edits the copy in place, through helpers that know its quirks, then runs four checks. Nothing about the content is decided there; it is a transfer.</li>
  </ul>

  <h3>The catalogue that came out of the rough start</h3>
  <p>Template population did not go smoothly at first. After the ICTCBL322 pack, Claude was asked to write out everything that is tricky about the templates' structure, so that later runs would not repeat the misalignments. That document became the populator skill's reference file. It reads as a list of reasons to keep content out of Word until the content is finished, and it is shown here in full.</p>
  {skill('template-quirks.md', 'cdu-unit-template-populator: references/template-quirks.md', "The catalogue Claude wrote after the ICTCBL322 population, now read by the populator skill before it touches any template. Saved in the vault as the skill's quirks catalogue.")}
</section>

<!-- ============================================================ context -->
<section class="sec" id="context">
  <h2><span class="sec__n">Interlude</span>Directories and context: what Claude is given, and where</h2>
  <p class="produces"><b>The claim:</b> the quality of what comes out is set before the first prompt is written. It is set by what is put in front of the model, how the folder is laid out, and what the files are called.</p>
  <p>Cowork finds files by name and by place. The brief refers to files by name. The skills refer to folders by name. A file that is in the wrong folder, or named so that its unit, version or date cannot be read from the name, is a file the model has to guess about. Every guess is a place an error gets in.</p>

  <h3>Rules for the folder</h3>
  <ul>
    <li><b>One workspace, one folder per unit, the same sub-folders in every unit.</b> The model learns the layout once and applies it to every unit that follows.</li>
    <li><b>The brief at the root, named CLAUDE.md exactly.</b> Cowork reads it on its own the moment the folder is connected. Move it or rename it and nothing reads it.</li>
    <li><b>Source of truth kept apart from outputs.</b> The register download folder holds the unit's two PDFs and nothing else. Outputs land in their own folder, so the model never mistakes its own draft for the register.</li>
    <li><b>Superseded material in its own folder, labelled as superseded.</b> The regulatory library keeps the 2014 Rules, S009:2013 and the 2023 Pathways guide in a folder called Superseded, historical reference only. Beside current material they would be cited as current.</li>
    <li><b>File names that carry the facts.</b> ICTCBL303_AssessmentMappingMatrix_v2_20260830.md tells the model the unit, the document, the version and the date without opening the file. The whole pipeline uses that pattern, and version lineage flows from the Markdown name to the Word name.</li>
    <li><b>Nothing the model does not need.</b> Every page it reads that it does not need is context spent, and a chance for something irrelevant to bleed into the output.</li>
  </ul>

  <h3>What would be done differently: the 80-page manual</h3>
  <p>The how-to-map folder included the TAE assessment design manual, about 80 pages. Read again later, about 40 of those pages were fluff as far as Claude's job was concerned: framing, pedagogy, worked narrative. Claude did not need them to know what to do. Run again, that manual would be slimmed to the pure instructions for compliant assessment design before it went into the folder. The point is not that the model cannot cope with 80 pages. It is that the 40 unneeded pages are read on every run that touches the reference set, and they carry assumptions of their own.</p>

  <h3>A harmless case of data poisoning: the SLR workbook</h3>
  <p>One of those assumptions got through. The reference material referred to the student learning resource as the SLR workbook. The acronym, and the assumption that the student-facing content was a workbook document, bled into the pipeline: the mapping skill still says "if the SLR isn't structured yet", and early outputs treated the student resource as a document to be written. It stayed that way until Claude was told, in the brief, that student-facing content goes onto a site called Brambling, CDU's online delivery shell, as pages.</p>
  <p>To anyone at CDU that is an obvious detail. To the model it was invisible, because nothing in the folder said it. It is the kind of detail that costs most at the end, when a later phase is asked for: the request to put all the text into plain HTML and embed the images would have been answered for the wrong destination. Write down the things that are obvious to you. They are exactly the things the model cannot know.</p>

  <h3>Choosing the model, and how long it took</h3>
  <div class="tblwrap"><table class="tbl">
    <thead><tr><th>Model</th><th>Used for</th><th>Note</th></tr></thead>
    <tbody>
      <tr><td>Haiku</td><td>Not used</td><td>Probably too light for the mapping and the compliance checks. Something stronger is needed where the coding and the traceability are decided.</td></tr>
      <tr><td>Opus 4.8, high effort</td><td>Nearly everything</td><td>The workhorse for the whole set. One known habit had to be controlled for in the instructions: a tendency to overly complex language, which other users had reported too.</td></tr>
      <tr><td>Fable 5</td><td>Not warranted</td><td>Perhaps at the mapping phase, but even that is not complicated for the model. There is a difference between complicated, difficult, and plain painful: onerous, busy knowledge work. Mapping is the third kind. It is tedious for a person, not hard for Claude.</td></tr>
    </tbody>
  </table></div>
  <div class="tblwrap"><table class="tbl">
    <thead><tr><th>Work</th><th>Time</th><th>What the time went on</th></tr></thead>
    <tbody>
      <tr><td>ICTCBL322, the first unit</td><td>about 4.5 hours</td><td>The original folder set-up; sourcing, engineering and cleaning the context files; the initial instructions; then the mapping and tools themselves. Most of this is done once.</td></tr>
      <tr><td>The six remaining units</td><td>about 8 hours all up</td><td>Mapped, tooled and pre-validated on 23 August 2026; Word sets, workbooks and v2 matrices on 30 August 2026. Set-up already existed; each unit added only its own folder.</td></tr>
    </tbody>
  </table></div>

  <h3>Give it the goal, not just the step</h3>
  <p>With the newer models, a stated long-term goal in the prompt works as an optimiser. Even when the work is prompted one phase at a time, with a person checking each step, the model should be told where it is all headed and what the finished set looks like. The workspace brief opens with exactly that:</p>
  <div class="rule">
    <p class="rule__k">The goal, from the workspace CLAUDE.md</p>
    <p>CDU is having the ACMA Open Cabler units added to its scope of registration. To progress the change-of-scope application for the Advanced Cabler Registration Skill Set (ICTSS00086), every unit needs a full set of assessment resources at the quality standard already reached for ICTCBL322, whose finished outputs are the model for the set. For each unit that means, in order of production: an Assessment Mapping Matrix, the assessment tools with their Assessor Guide, a Student Unit Guide holding each assessment task, pre-validation findings, and a Student Workbook for the Brambling learning shell; produced first in Markdown, then populated into CDU's official Word templates.</p>
  </div>
  <p>Twelve months ago this would have been too much for a frontier model. Tasks had to be broken into staged sections and chained, with the person carrying the overall state between them. This time the phased breakdown was mostly for the person, a way to keep track of what was happening. Claude held the full length and breadth of the task: it stayed on top of every outstanding edit to every corresponding document, and it reminded, relentlessly, whenever something had been missed. The phases on this page are the human's map of the work, not the limit of what the model can hold.</p>
</section>

<!-- ============================================================ phase 1 -->
<section class="sec" id="phase-1">
  <h2><span class="sec__n">Phase 1</span>Map the unit <span class="sec__skill">cdu-assessment-mapping</span></h2>
  <p class="produces"><b>Produces</b> the Assessment Mapping Matrix for one unit, in the v7 structure, as a Markdown file in the unit's Mapping outputs folder, with a mapping build report beside it.</p>

  <h3>What goes in</h3>
  <ul>
    <li>The unit's two register PDFs.</li>
    <li>The unit research file.</li>
    <li>The business case, for cohort and contextualisation.</li>
    <li>The skill's own files: the Matrix v7 template as assets, in Markdown and Word, three reference files and one script.</li>
  </ul>

  <h3>What you do</h3>
  <ol class="steps">
    <li>Connect the workspace folder in Cowork. It reads CLAUDE.md at the root without being asked.</li>
    <li>Check the unit folder: the two PDFs in the register download folder, the research file beside them.</li>
    <li>Prompt, for example: <code>Map ICTCBL303 with cdu-assessment-mapping. Read ICTCBL303_Research_and_NT_Context_20260823.md first.</code></li>
    <li>Claude codes the Performance Evidence and Knowledge Evidence before it maps anything (step 2 of the skill) and shows you the coded list where a dot point could split two ways. Read it. These codes are used in every later file.</li>
    <li>If Claude pauses to ask how far to contextualise, or for which cohort, the answer is in the business case. Point it there.</li>
    <li>Open the matrix. Run down the completeness gate (step 8) and the closing notes (step 10): what could not be mapped, what needs program-area confirmation, what is provisional.</li>
  </ol>

  <h3>The skill file</h3>
  <p>How it was made: ICTCBL322 was mapped by hand with Claude, guided by the how-to-map references and the Matrix v7 template. Each draft was corrected until the matrix was right, v1 on 11 August 2026 and v2 on 15 August once the tools existed and the codes could be checked both ways. Then one create-skill command, and Claude wrote this file from the process it had just followed.</p>
  {skill('cdu-assessment-mapping.md', 'cdu-assessment-mapping', 'The skill as Cowork shows it, copied into the vault on 12 August 2026: the trigger, the description Claude matches a request against, the included files, then the SKILL.md workflow. The three reference files and the script it names sit in the skill folder beside it.')}

  <h3>What came out for ICTCBL322</h3>
  <ul>
    <li>8 Elements and 31 Performance Criteria, copied with the unit's own numbering.</li>
    <li>PE1 to PE9 and KE1 to KE11 coded from the register PDFs, with bundled dot points split into 8a and 8b.</li>
    <li>Every PC, PE and KE given a real reference: an AT1 question number, an AT2 observation item or an AT3 document reference. No ticks.</li>
    <li>Foundation Skills reduced to the unit's own six; Range of Conditions and Assessment Conditions contextualised for NT delivery.</li>
    <li>Closing notes listing what needs program-area confirmation: the lab, the equipment register, the standard editions, the assessor credentials.</li>
  </ul>
  <p>The six remaining units were mapped the same way on 23 August 2026, and every matrix reissued as v2 on 30 August once the workbooks existed and the Student Resource References could point at real pages.</p>

  <h3>What you check</h3>
  <ul>
    <li>The Elements and PCs read exactly as the register PDF does.</li>
    <li>Every PC, PE code, KE code and retained Foundation Skill appears with real notation somewhere in the matrix.</li>
    <li>No cell carries a tick. A hyphen marks a cell deliberately left unmapped.</li>
    <li>The closing notes are honest: anything the skill could not confirm is listed there, not written around.</li>
  </ul>
</section>

<!-- ============================================================ phase 2 -->
<section class="sec" id="phase-2">
  <h2><span class="sec__n">Phase 2</span>Build the tools <span class="sec__skill">cdu-assessment-tool-builder</span></h2>
  <p class="produces"><b>Produces</b> one Markdown file per assessment task, AT1, AT2 and AT3, with their Assessor Guides and a tool build report, in Mapping outputs.</p>

  <h3>What goes in</h3>
  <ul>
    <li>The completed matrix from phase 1.</li>
    <li>The unit text.</li>
    <li>The skill's at-tool-shapes reference, which gives the exact structure of each of CDU's six AT tool types, and its verification script.</li>
  </ul>

  <h3>What you do</h3>
  <ol class="steps">
    <li>Prompt, for example: <code>Build the AT1, AT2 and AT3 files for ICTCBL303 from its matrix with cdu-assessment-tool-builder.</code></li>
    <li>Claude reads the matrix's coded evidence list and its Section 1 and Section 4 tables. Every item number the matrix uses has to appear in the tool it names, with the same codes.</li>
    <li>It writes one file per task, to the shape in at-tool-shapes.md. Near the top of each file it states that the content is an original first draft, not a transcription of an approved instrument.</li>
    <li>It runs <code>verify_at_matches_matrix.py</code> against each file. Read the report. Every mismatch is fixed before the file counts as finished. If the matrix is what is wrong, Claude says so rather than patching the tool to match.</li>
    <li>Read each file yourself. The script catches drift between codes, not a weak question or a checklist item that only repeats the PC.</li>
    <li>Open the tool build report for the items left for the SME.</li>
  </ol>

  <h3>The skill file</h3>
  <p>Made the same way as the mapping skill: the ICTCBL322 tools were drafted with Claude, corrected, then the process was written down. The skill's second paragraph records why its verification step exists: the first attempt, drafted from the unit text and eyeballed, had six mismatches.</p>
  {skill('cdu-assessment-tool-builder.md', 'cdu-assessment-tool-builder', 'The SKILL.md text as saved in the vault. The vault copy is followed by the ICTCBL322 AT2 Direct Observation draft used to test the skill; that test document is not reproduced here.')}

  <h3>What each tool holds</h3>
  <div class="tblwrap"><table class="tbl">
    <thead><tr><th>Tool</th><th>CDU template</th><th>What the skill writes</th><th>ICTWHS204, for scale</th></tr></thead>
    <tbody>
      <tr><td>AT1 Quiz</td><td>Questioning v2.1</td><td>A genuine question for every Knowledge Evidence item the matrix gave a Q number, with a benchmark answer. Safety-critical knowledge gets one question by default and an optional second, marked optional, for the SME to keep or remove.</td><td>21 questions</td></tr>
      <tr><td>AT2 Observation</td><td>Direct Observation v2.1</td><td>One comprehensive observed job, repeated only where a Performance Criterion requires it. Each PC phrased as an observable action with the PE codes the matrix assigned, and a benchmark so two assessors judge the same performance the same way.</td><td>33 items</td></tr>
      <tr><td>AT3 Portfolio or Project</td><td>Portfolio v2.1 or Project v2.1</td><td>What each required document must contain, specific enough for a student to produce and an assessor to judge, tied to the PE and PC the matrix assigned. ICTCBL247's AT3 is a Project; ICTTEN208 is a two-task unit with no AT3.</td><td>4 documents</td></tr>
      <tr><td>Assessor Guides</td><td>Assessor Guide v7</td><td>Model answers, benchmarks and decision rules, one guide per task, then a standalone guide on the v7 template. By default each task is written once, inside the Student Unit Guide. An invigilated task keeps only its description there; its question paper ships as a separate instrument.</td><td></td></tr>
    </tbody>
  </table></div>

  <h3>What you check</h3>
  <ul>
    <li>The verification report shows no mismatches, in either direction.</li>
    <li>Every question tests the KE item the matrix assigned it, and every benchmark answer says what a satisfactory response covers rather than repeating the question.</li>
    <li>The draft disclosure sits near the top of each file, not in the closing notes.</li>
    <li>Do not build tools for a unit before its mapping exists.</li>
  </ul>
</section>

<!-- ============================================================ phase 3 -->
<section class="sec" id="phase-3">
  <h2><span class="sec__n">Phase 3</span>Pre-validate <span class="sec__skill">cdu-assessment-prevalidation</span></h2>
  <p class="produces"><b>Produces</b> a findings report, UNITCODE_PreValidation_Findings_DATE.md, structured to drop into the Pre-Assessment Validation Report section of CDU's VET Unit and Pre-Assessment Validation form.</p>

  <h3>What goes in</h3>
  <ul>
    <li>The unit text, the matrix and the tools.</li>
    <li>The learning resource where it exists, so the Student Resource References can be checked.</li>
    <li>The how-to-map references, and the skill's three reference files: the traceability checks, the Rules of Evidence checklist and the report template.</li>
  </ul>

  <h3>What you do</h3>
  <ol class="steps">
    <li>Prompt, for example: <code>Pre-validate ICTCBL303, its matrix and its tools, with cdu-assessment-prevalidation.</code></li>
    <li>Claude lists what is present against the resource suite CDU expects for a unit: Student Unit Guide, assessment tasks, Assessor Guide, Student Assessment Agreement, Assessment Summary, session plans, RPL kit, learning resources. It asks which missing items are out of scope for this review. Answer once.</li>
    <li>It re-codes the Performance Evidence and Knowledge Evidence from the unit text on its own, without trusting the matrix, and compares. A mismatch is a finding.</li>
    <li>It checks traceability both ways: every matrix reference resolves to a real item in the tool, and every tool item traces back to a mapped requirement.</li>
    <li>It applies the Principles of Assessment and the Rules of Evidence to each tool, and checks that each Assessment Condition is answered with a concrete statement, not a restatement.</li>
    <li>Read the report: the verdict, the findings register (a stable ID, the area, the Standard, a severity, the finding, a recommendation), the "Still to do" checklist, and the suggested fixes drafted as replacement text you can lift.</li>
    <li>Decide what is fixed now and what is the SME's. Template population is not held back for open findings; that was the readiness-bar decision of 23 August 2026.</li>
  </ol>

  <h3>The skill file</h3>
  <p>Made the same way: the ICTCBL322 pack was pre-validated with Claude against the ASQA references, corrected, then written down. This is the desk review that gets a unit ready for the independent Assessment Panel Review; it is not that review, and it never marks student work.</p>
  {skill('cdu-assessment-prevalidation.md', 'cdu-assessment-prevalidation', 'The SKILL.md text as saved in the vault, with its frontmatter. The three reference files it names sit in the skill folder beside it.')}

  <h3>What came out</h3>
  <ul>
    <li>Findings reports for all six remaining units on 23 August 2026, each re-coded independently from its register PDFs.</li>
    <li>For ICTWHS204 that meant 11 Elements, 36 Performance Criteria, 10 Performance Evidence items, 21 Knowledge Evidence items and 6 Foundation Skills, confirmed against the matrix both ways.</li>
    <li>ICTCBL247 was re-validated the same day for set parity; its v2 findings supersede v1 and add two low findings.</li>
  </ul>

  <h3>What you check</h3>
  <ul>
    <li>Severity reflects what blocks delivery. High blocks a defensible sign-off; Medium must be resolved but need not block early work; Low is a refinement or a confirmation.</li>
    <li>The "Still to do" list is complete enough to work from. It is the handover to the SME.</li>
    <li>Strengths listed are ones that bear on validation, not conformance to house style.</li>
  </ul>
</section>

<!-- ============================================================ phase 4 -->
<section class="sec sec--slide" id="phase-4">
  <div class="slide">
    <div class="slide__left">
      <h2 class="slide__title">Populate the templates</h2>
      <p class="slide__id"><b>Phase 4</b>cdu-unit-template-populator</p>
      <p class="slide__text">One folder per unit. The scaffolding is set up once. The only new input is the unit's own download from the National Training Register. Everything else in the folder was written by the phases above.</p>
      <p class="slide__text">Four checks, all of them, every time: schema validation against the original template; render every page to an image and actually look at it; a placeholder scan with zero hits; a completeness cross-check against the source Markdown, every Element, PC, PE, KE, question, checklist item and document reference present, none duplicated.</p>
    </div>
    <div class="slide__right">
{CTREE}
    </div>
  </div>
  <p class="produces"><b>Produces</b> the Word documents on CDU's own templates, in the unit's Populated Word templates folder: the Assessment Mapping Matrix, the Student Unit Guide, the standalone Assessor Guide and each assessment instrument.</p>

  <h3>What goes in</h3>
  <ul>
    <li>The completed Markdown from phases 1 to 3.</li>
    <li>The CDU templates in the TAFE Templates folder.</li>
    <li>The skill's helper script, docx_template_tools.py, and its catalogue of what each template hides.</li>
  </ul>

  <h3>What you do</h3>
  <ol class="steps">
    <li>Settle the open choices once, before the build: team names, whether optional sections are drafted or left blank, and the readiness bar. Anything an SME must supply is left blank or marked TBC. No prose caveats go into the documents.</li>
    <li>Prompt, for example: <code>Populate the CDU templates for ICTCBL303 from its Mapping outputs with cdu-unit-template-populator.</code></li>
    <li>Claude copies the template to a working folder and inspects the copy before planning: the body element sequence, every table's merged cells, the checkbox, dropdown and date-picker controls, the highlighted fill-me runs, the headers, footers and anchored logos.</li>
    <li>It builds with a script through the skill's helpers. It never types into the document by hand, and never regenerates a lookalike from scratch.</li>
    <li>Four checks, every file: schema validation against the original template; every page rendered to an image and looked at; a placeholder scan with zero hits; a completeness cross-check against the source Markdown, every Element, PC, PE, KE, question, checklist item and document reference present, none duplicated.</li>
    <li>Open the rendered pages yourself. The file is named UNITCODE_DocumentName_vN_YYYYMMDD.docx, saved to the unit's populated-templates folder, and the chat summary says what was filled, what was left blank on purpose and what still needs confirmation.</li>
  </ol>

  <h3>The skill file</h3>
  <p>The ICTCBL322 documents were populated first, and the traps found on the way were written into the skill's quirks catalogue. ICTCBL303 was then built end to end as the pattern on 30 August 2026, and the other five units followed it the same day.</p>
  {skill('cdu-unit-template-populator.md', 'cdu-unit-template-populator', 'The SKILL.md text as saved in the vault, with its frontmatter.')}
  <p>The catalogue of template quirks the skill reads first is shown in full in <a href="#markdown">the interlude on Markdown</a>.</p>

  <h3>The seven units</h3>
  <div class="tblwrap"><table class="tbl">
    <thead><tr><th>Unit</th><th>Title</th><th>NT nominal hours</th><th>Note</th></tr></thead>
    <tbody>
      <tr><td>ICTCBL322</td><td>Install, test and terminate optical fibre cable on customer premises</td><td>40</td><td>Built first, by hand with Claude; the model for the set</td></tr>
      <tr><td>ICTCBL247</td><td>Install, maintain and modify customer premises communications cabling: ACMA Open Rule</td><td>100</td><td>AT3 is a Project</td></tr>
      <tr><td>ICTCBL301</td><td>Install, terminate and certify structured cabling installation</td><td>50</td><td></td></tr>
      <tr><td>ICTCBL303</td><td>Install and terminate coaxial cable</td><td>20</td><td>Pattern unit for phase 4; 24 files written by the pipeline</td></tr>
      <tr><td>ICTCBL323</td><td>Test cables and systems on customer premises</td><td>40</td><td></td></tr>
      <tr><td>ICTTEN208</td><td>Use electrical skills when working with telecommunications networks</td><td>40</td><td>Two-task unit</td></tr>
      <tr><td>ICTWHS204</td><td>Follow work health and safety and environmental policy and procedures</td><td>40</td><td></td></tr>
      <tr class="tbl__total"><td></td><td>Seven units</td><td>330</td><td>Mapped, tooled and pre-validated 23 August 2026; Word sets, workbooks and v2 matrices 30 August 2026</td></tr>
    </tbody>
  </table></div>
</section>

<!-- ============================================================ phase 5 -->
<section class="sec" id="phase-5">
  <h2><span class="sec__n">Phase 5</span>Illustrate <span class="sec__skill">brambling-technical-illustrations, in ChatGPT Codex</span></h2>
  <p class="produces"><b>Produces</b> the technical diagrams the student workbooks name, as PNG files with an image register and a proof sheet per batch, one working folder per unit; and the audit of the licensed ICTTEN202 workbook's images.</p>

  <h3>Setting up Codex: a mini folder and a brief</h3>
  <p>Codex knew nothing about the project, so the first job was context engineering: give it just the amount of information it needed and no more. That was a small folder holding two things, the student workbook pages for the unit and the diagram recommendations Claude had written for each Element, plus a short set of directives on what to optimise for: accuracy; technical accuracy; clear labelling; wires going to and from the right holes, which image generation gets wrong easily. The skill was then created from that set-up the same way the Cowork skills were: run the job, correct it, have the agent write down the method.</p>

  <h3>What goes in</h3>
  <ul>
    <li>The student workbook pages for the unit.</li>
    <li>The DiagramRecommendations file each workbook Element carries, written by Claude alongside the workbook pages, describing every diagram that Element needs.</li>
    <li>The directives: accuracy, technical accuracy, clear labelling, wires to and from the right holes.</li>
    <li>The master list, SME Diagrams and Illustrations to source.md: 214 recommendations across the seven units, 113 of them Essential.</li>
    <li>For ICTTEN202, the licensed workbook itself: 174 embedded images, 130 of them under 400 pixels wide.</li>
    <li>Manufacturer documentation and equipment references where recognition matters.</li>
  </ul>

  <h3>What you do</h3>
  <ol class="steps">
    <li>In ChatGPT Codex with the skill installed, attach the unit's mini folder: workbook pages and the recommendations file.</li>
    <li>Prompt with one of the skill's own typical requests, for example: <code>Create the 14 ICTCBL322 Element 1 draft illustrations from the attached project.</code> or <code>Audit ICTTEN202 TRCP32 learning images and propose replacements, without drawing yet.</code></li>
    <li>Codex reads the recommendation and the whole surrounding workbook section, then prepares a short brief per image: the teaching point, the visual method and why, the recognition features, the exact labels, the references.</li>
    <li>It chooses the method by teaching purpose: clear text graphics for comparisons and flows; photographs or reference-based realistic illustration for equipment and worksites, where a student has to recognise the real thing; precise schematics for hidden mechanisms, connections and geometry.</li>
    <li>It keeps variable values symbolic unless verified, and marks anything it cannot establish as needs-clarification rather than drawing it.</li>
    <li>Round one lands the drafts in the unit's drafts folder and writes the proof sheet: a draft image review gallery with one card per image carrying its PC, whether it is Essential or Supporting, its caption, and its alternative text and production notes.</li>
    <li>Round two: ask the model to verify and audit every draft for accuracy and technical clarity. In this build about half of the round-one drafts failed the model's own check and were redrawn.</li>
    <li>Go through every image on the proof sheet yourself, before any SME sees it, with two yes-or-no questions: can I see what is going on here; are the labels actually pointing at things in the picture. On a no, order the model to <code>verify for clarity</code> or <code>audit for labelling</code>. Either command makes the Codex model (Sol 5.6, at the time of the build) open the illustration itself and check it against the directives for technical accuracy. Then check where every wire runs and what it connects to. Most of the illustration time went here, iterating over small visual fixes.</li>
    <li>SME review before anything is approved. The model's verification pass is not approval. When the batch is confirmed usable, the approved images go to the unit's Brambling Images folder as PNG, with no status tag in the artwork: vector masters exported at 2000 pixels wide, photographic originals kept at their own resolution.</li>
  </ol>

  <h3>What went wrong, and what the second pass is for</h3>
  <ul>
    <li><b>Vector by default.</b> The model kept choosing a vector diagram where a photograph would teach better, even for equipment and handling a student has to recognise on a bench. The ICTCBL247 draft below is the example: cable bend radius and dragging a cable over an edge are things a student needs to see, not a symbol for. That is why every image gets a second, verifying pass, and why the skill's rule reads "photographs or reference-based realistic illustration for equipment and worksites".</li>
    <li><b>Labels placed arbitrarily.</b> A label would sit near, not on, the part it named. Every image was sent back with the instruction to verify the placement of each label.</li>
    <li><b>Wires heading the wrong way.</b> Where a wire runs, and whether it connects or does not connect, was the other common error. Check every connection against the reference before it goes near a student.</li>
    <li><b>The proof sheet is the workflow.</b> Iterating over the gallery, image by image, took most of the illustration time. Budget for it.</li>
  </ul>

  <figure class="fig fig--wide">
    <img src="assets/draft-ictcbl247-pc4-1.png" width="1600" height="1076" alt="A draft illustration open in the review viewer: Protect cable geometry while installing, ICTCBL247 PC 4.1, a two-panel vector diagram contrasting compliant handling with a sweeping curve against damaging handling with a too-tight bend dragged over an edge; the footer reads R is symbolic, not to scale; a filmstrip of other drafts runs down the left">
    <figcaption>A round-one draft in the review viewer, ICTCBL247 PC 4.1. A completely inappropriate use of a vector diagram: the model's default choice, with the bend radius marked symbolic, not to scale. This one needs to be a photograph.</figcaption>
  </figure>
  <div class="two two--figs">
    <figure class="fig">
      <img src="assets/proof-sheet-ictcbl323-1.png" width="828" height="1172" alt="Draft image review gallery for ICTCBL323, page one: a header stating 27 approved concepts, 21 essential and 6 supporting, with filter chips for All, Essential, Supporting and Elements 1 to 4, then nine image cards, each with its PC number, Essential or Supporting, a title, a caption and a collapsed alternative text and production notes row">
      <figcaption>The proof sheet for ICTCBL323, page one: 27 concepts, 21 Essential and 6 Supporting, with the review instruction at the top. All 27 were confirmed usable on 5 September 2026.</figcaption>
    </figure>
    <figure class="fig">
      <img src="assets/proof-sheet-ictcbl323-2.png" width="802" height="1192" alt="The same review gallery, images 10 to 21: environmental controls, OTDR principle against loss test, OTDR trace features, single-mode and multimode fibre, bidirectional testing, copper test boundaries, wiremap faults, PoE power chain, certification result screen, dB against dBm, marginal results, and measuring optical loss">
      <figcaption>The same proof sheet, images 10 to 21. Each card is checked for equipment recognition, connection accuracy, legibility, and whether the image teaches its caption without the alternative text.</figcaption>
    </figure>
  </div>

  <h3>The skill file</h3>
  <p>Built in ChatGPT Codex the same way the Cowork skills were: run the job, correct it, then have the agent write down the method. Its first version drew everything as vector art. After trial and error the rule that stayed is that the visual method follows the teaching purpose, and that a convincing appearance is not evidence of accuracy.</p>
  {skill('brambling-technical-illustrations.md', 'brambling-technical-illustrations', 'The SKILL.md text as exported from ChatGPT Codex. Its three reference files and three scripts sit in the skill folder beside it.')}

  <h3>What you check</h3>
  <ul>
    <li>Can a non-SME see what is going on in the image, yes or no. If no, it goes back.</li>
    <li>The visual method fits the teaching purpose: a photograph or realistic illustration where a student must recognise the real thing, a diagram where a diagram teaches.</li>
    <li>Every label points clearly at the thing it names.</li>
    <li>Every wire runs where it should and connects, or does not connect, as the reference says.</li>
    <li>Equipment is drawn with the features that tell one tool from another; no generic box-and-circle icons.</li>
    <li>No DRAFT, FINAL or review tag appears in the image itself. Filenames, folders and the register carry status.</li>
    <li>The register records the source edition and page for every verified detail, and a separate needs-clarification list.</li>
    <li>An SME has reviewed the batch before it is confirmed usable.</li>
  </ul>
</section>

<!-- ============================================================ stepping in -->
<section class="sec" id="stepping-in">
  <h2><span class="sec__n">Notes</span>Where the person steered</h2>
  <p>Three times the person overruled the machine. Each one became a rule in the brief.</p>

  <div class="story">
    <div>
      <h3>Scope creep, the cautious kind.</h3>
      <p>Halfway through the pipeline, Claude began logging the missing RPL position and the unsighted assessor credentials as severe blockers, run after run. Those items were already known and belong to the program area.</p>
      <p>The fix was one paragraph in CLAUDE.md. Build to the ICTCBL322 bar and no further. Where a value is missing, leave it blank or write TBC. The known open items are noted once and are not re-documented as running caveats.</p>
    </div>
    <figure class="fig"><img src="assets/cowork-task-list.png" width="280" height="557" alt="Cowork's progress panel for the ICTCBL247 build: two tasks struck through, six queued, ending with aligning the unit brief with the readiness-bar wording"><figcaption>Cowork, 24 August 2026: the task list after the scope note.</figcaption></figure>
  </div>

  <div class="story">
    <div>
      <h3>Literal instructions.</h3>
      <p class="q">"Where is the Word doc for the AT1 Questioning?"</p>
      <p>It had never been asked for. The model unit had three populated documents, so the agent treated a fourth as outside the precedent, and said so rather than guessing. The answer became a standing rule. By default, every task is written once inside the Student Unit Guide. An invigilated task keeps only its description there, and its question paper becomes a separate instrument, because students must not preview the questions.</p>
    </div>
    <figure class="fig"><img src="assets/cowork-at1-instrument.png" width="656" height="1039" alt="Cowork conversation: Claude explains that the AT1 Questioning instrument was not part of the ICTCBL322 precedent and asks whether to build it; the reply sets the rule for invigilated tasks"><figcaption>Cowork, 24 August 2026: the AT1 instrument exchange.</figcaption></figure>
  </div>

  <div class="story">
    <div>
      <h3>Read the plan before the build.</h3>
      <p>Before a large run, ask for the plan in plan mode and read it. The plan for the standards research and the instrument build named two research agents with a cross-check, a build order with ICTCBL303 first as the pattern for review, and the verification for every step. Reading the plan is where the scope gets set, and it is also where you catch the machine being helpful in the wrong direction.</p>
    </div>
    <figure class="fig"><img src="assets/cowork-progress-ictcbl247.png" width="625" height="461" alt="Cowork narrating its own progress: loading the populator skill, reading the pre-validation findings that specify the missing pieces, inspecting the ICTCBL322 worked example before building ICTCBL247"><figcaption>Cowork: the run narrating what it reads before it writes.</figcaption></figure>
  </div>
</section>

<!-- ============================================================ handover -->
<section class="sec" id="handover">
  <h2><span class="sec__n">Notes</span>What the SME and program area still supply</h2>
  <p>Every output is a draft written to a standard and labelled where it is uncertain. A person reviews it and signs it off.</p>
  <ul class="handover">
    <li><b>Resourcing facts.</b> The lab name, room and fitout; the equipment register for each unit; the named assessor's credentials. These populate the Assessment Conditions and only the program area can supply them.</li>
    <li><b>Standard editions.</b> The current editions are named and cited in the SME To Do: AS/NZS 3000:2018 with amendments, AS/NZS 11801.1:2019, AS 1367:2023, IEC 61280-4-1 and 4-2. What remains is to confirm CDU adopts them, and to set the two field-tester limit sets for ICTCBL301 and ICTCBL323.</li>
    <li><b>Judgement calls, per unit.</b> Sign off the drafted AT3 scenario and building plans for ICTCBL247; decide whether the OTDR event types are enumerated in ICTCBL323; keep or remove the optional second safety question in each quiz.</li>
    <li><b>Review of every draft.</b> The pack awaits curriculum SME review, then Team Leader approval and the Assessment Panel. The pipeline produces the draft pack; approval stays with people.</li>
  </ul>
</section>

<!-- ============================================================ next unit -->
<section class="sec" id="next-unit">
  <h2><span class="sec__n">Notes</span>The next unit</h2>
  <ol class="steps">
    <li>Copy a finished unit folder as the template and empty its output folders.</li>
    <li>Download the unit's two PDFs from training.gov.au into the register download folder.</li>
    <li>Rename the folder to the unit code.</li>
    <li>Write the unit's research file, or ask Claude to, before any skill runs.</li>
    <li>Point Cowork at the workspace and give it the first prompt.</li>
    <li>Run phases 1 to 5 in order. Do not start a phase before the one before it has been read.</li>
  </ol>
  <div class="prompt">
    <p class="prompt__k">First prompt</p>
    <p>Read CLAUDE.md and the skills file, then tell me what is already complete for this unit and what is still outstanding.</p>
  </div>

  <footer class="foot">
    <p><span class="mark">NTellWorldInk</span><br>Course materials © Charles Darwin University. TAFE ICT, Cyber Security and Digital. RTO Provider No: 0373.</p>
    <p>Last updated 6 September 2026.<br><a href="/client-access/">Course access</a> · <a href="#top">Back to the top</a></p>
  </footer>
</section>

</main>
</div>

<script src="doc.js"></script>
</body>
</html>
'''

open(OUT, 'w').write(page)
print('wrote', OUT, len(page), 'bytes')
