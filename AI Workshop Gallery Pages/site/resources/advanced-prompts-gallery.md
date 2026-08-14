---
title: Advanced Prompts and Project Gallery
subtitle: Real projects, the strategy behind them, and what came out
site: ntworldink.com
audience: People who have used an AI chat tool and want more from it
model_scope: Model agnostic; works with any current frontier chat model
companion_page: Basic Prompts Gallery (separate resource)
---

# Advanced Prompts and Project Gallery

The companion to the Basic Prompts Gallery. Where the basic page shows the anatomy of a good single prompt, this page shows what happens when you stop treating the AI as a vending machine and start treating it as a collaborator on a real piece of work.

Every entry below is an actual project. Not an invented illustration; a thing I set out to make, with the messy real goal behind it, the strategy I used to get there, the prompt that did the work, and a genuine slice of what came out. Names, client details, and internal identifiers have been removed, but the craft is intact and the output is real.

The point is not to admire the outputs. It is to make the *thinking* visible. Most prompting guides show you a clean prompt and a clean answer and hide the part that actually matters: the ideation, the framing, the decision to hand the model a role or a source or a plan, the correction halfway through. That middle bit is the skill. This gallery is an attempt to show it.

## How each case study is laid out

Every one follows the same four beats, so you can see the pattern rather than just the result:

- **The idea**: the real problem I was trying to solve, in plain terms, including why the obvious approach was not good enough.
- **The strategy**: the approach that made it work. Giving the model a role, handing it my own source material, making it plan before it built, or writing a spec to hand to another tool.
- **The prompt**: the actual prompt or the pivotal instruction, cleaned up so it runs in a fresh chat.
- **What came out**: a real excerpt of the output, so you can judge it for yourself.

Each case is tagged with the core technique it demonstrates, so if you want to study one technique you can jump between the cases that use it. The techniques themselves are summarised at the very end, along with the note on where sophistication has to stop.

---

# The projects

## A tool that reads any AI product's privacy policy against Australian law

**Tags: reusable project, reference material, role**

**The idea.** Every AI tool ships a privacy policy, and almost nobody reads them against the actual legal standard they have to meet in Australia. I did not want a one-off opinion on one company. I wanted a reusable instrument: paste in the privacy policy of any AI product, from a clinical scribe to a general chatbot to a Chinese frontier model, and get it assessed clause by clause against all thirteen Australian Privacy Principles, to a standard a government procurement office would recognise.

**The strategy.** This is a saved Project with standing instructions, not a single chat. The instructions give the model a fixed role (an assessor working to the office regulator's PIA structure), a fixed rulebook (the thirteen APPs, the Notifiable Data Breach scheme, cross-border disclosure rules), and a fixed output shape (plan, analyse, address, review). The privacy policy you paste in is the only variable. Everything else is held constant, so two different tools get assessed the same way and the results are comparable.

**The prompt.** (This is the shape of the standing instruction; the input is whatever policy you paste.)

```
You are assessing a third-party AI product against Australian privacy law for a
government procurement office. I will paste a privacy policy. Assess it clause by
clause against all thirteen Australian Privacy Principles, plus the Notifiable Data
Breach scheme and cross-border disclosure rules under APP 8. Use the regulator's PIA
structure: plan, analyse, address, review. For each finding, state the APP engaged,
whether the policy meets it, the specific clause that creates the risk, and a
remediation. Rate each risk. Note genuine strengths as well as gaps. Where the policy
relies on an overseas legal basis that does not apply under Australian law, flag it.
Do not invent facts the policy does not state; where it is silent, say so and treat
silence as a gap.
```

**What came out.** Run against one Australian clinical-documentation platform, the assessment surfaced three high-priority gaps and did not soften them:

> APP 5 (notification): No patient-facing privacy notification mechanism. Patients are indirect data subjects; their health information is processed through the platform via practitioner use, but nothing notifies them this is occurring.
>
> APP 8 (cross-border): Related corporate entities in the UK, Canada (Ontario) and the USA (Delaware) create cross-border disclosure exposure. The US entity attracts CLOUD Act reach; the policy provides no binding safeguard.
>
> NDB scheme: No documented data breach response plan.

It also credited the real strengths (an explicit prohibition on using patient data to train the AI model, and functional pseudonymisation), so the output was an assessment, not a hit piece. The same instrument, pointed at a different product, produces the same structured scrutiny; that is the whole value of building it as a Project rather than asking the question fresh each time.

---

## Teaching myself Power BI without falling asleep on someone else's data

**Tags: reference material, self-directed learning, grounding in a real source**

**The idea.** I was working through a Power BI course and hitting the same wall I hit with Power Query: the sample datasets are soul-destroying. Coffee-shop sales, generic "big data", nothing I care about. I know from experience that I only get past a learning plateau when the data is in a domain I actually think about. Mine is cybersecurity and AI regulation. So rather than suffer through the course's data, I got the model to manufacture learning material in my own domains, realistic enough to build genuine dashboards on.

**The strategy.** Two steps, both about grounding. First, generate synthetic security-operations data with deliberate structure: a fact table and a lookup table so Power BI relationships and DAX have something real to bite on, and planted anomalies (clusters of failed logins, a rare unauthorised-OAuth event) so there is something *detectable* to find, not just rows. Second, for the parts that had to be true rather than synthetic, anchor to a named authoritative source rather than the model's memory: the Windows event-log dataset was modelled on a reference security encyclopedia, and a separate AI-regulation dataset was pinned to a named global regulatory tracker with per-row confidence labels.

**The prompt.** The synthetic SOC generator, written as a reusable instruction to hand to the spreadsheet assistant:

```
Generate a synthetic security operations centre dataset for a Power BI learning
project. Entirely fictional; no real IPs, departments or people. Two linked tables.

Fact table, 1000 rows: EventID, Timestamp (spread realistically across one recent
month, clustered on weekdays and business hours, not evenly), SourceIP, DestinationIP,
EventType (weighted: failed login and unusual data transfer most common; malware alert
and unauthorised OAuth grant rarest; include unsanctioned AI domain access),
Severity (correlated loosely with EventType), Department, Status, ResolvedDate
(populated only when resolved, always after Timestamp), AnalystAssigned (pool of six).

Lookup table: one row per EventType, with a plain-language Description, TypicalSeverity,
and Category. EventType values must match the fact table exactly so the two can be
related in Power BI. Plant a small number of anomalous patterns, for example a burst
of failed logins from one source, so there is something for a learner to detect.
```

**What came out.** A workbook I actually wanted to explore. The planted "failed login burst" gave me a genuine reason to build a time-series visual and a severity breakdown, because there was a real signal buried in the noise to go and find. The shadow-AI event types (unsanctioned AI domain access, unauthorised OAuth grant) were not padding; they map to an emerging insider-threat topic I teach, so the practice dataset doubled as teaching material. The lesson that transfers: the fastest way past a learning plateau is to make the model build your practice material in a domain you already care about, with a real signal planted inside it.

---

## Training a handwriting model, and letting the linguistics drive the engineering

**Tags: reference material, role, domain expertise steering a build**

**The idea.** I wanted to train a locally hosted model on a Thai handwriting dataset, using PyTorch, and I wanted to actually understand it rather than paste in code that ran. Thai is a genuinely hard script for this: no spaces between words, vowels and tone marks stacked above and below the consonant line, characters that change meaning by their position in a four-zone vertical space. That difficulty was the interesting part, not an obstacle to rush past.

**The strategy.** Two things. First, give the model the real dataset as the starting point rather than a description of it: point it at the actual dataset so the walkthrough matched the real structure. Second, and this is the step I am proudest of, insist that the *linguistics* explain the *engineering* decisions, rather than treating the writeup as generic ML boilerplate with a Thai label slapped on. Why CRNN suited this script. Why the four-zone structure makes segmentation hard. How my synthetic-data result sat against the published benchmark. The domain expertise was not decoration; it justified the architecture.

**The prompt.** The pivotal instruction, after the initial training walkthrough was working:

```
Now turn this into a writeup that uses the linguistics of Thai script to explain the
engineering choices, not the other way round. Explain why the four-zone vertical
structure (consonants on the line, vowels and tone marks above and below) makes
segmentation hard, why that justifies a CRNN over a plain CNN, and how my result
compares to the published benchmark for this dataset. Keep the real numbers. Be honest
about where my synthetic-data result sits relative to state of the art; do not inflate
it.
```

**What came out.** A writeup that reads as an interdisciplinary case study rather than a code dump. The honest benchmarking is the part that makes it credible:

> Our 57% character-level accuracy, achieved with synthetic data and minimal training samples, represents a promising foundation when read in context. The Burapha-TH benchmark (Onuean et al., 2022) reached 95.00% character accuracy using VGG-13 with batch normalisation across 355,656 samples from 1,072 writers. Their finding that VGG-13 with batch normalisation significantly outperformed a basic CNN (95.00% versus 78.51%) validated our decision to use sophisticated feature extraction with normalisation rather than a simpler architecture.

It also caught a teaching point I had not expected: a flat learning-rate curve alongside improving loss is not stagnation but the "goldilocks zone", the rate sitting in its optimal range. That is the sort of insight you only get when you make the model explain *why*, not just *how*. The transferable technique: when a build sits in a specialist domain, make your domain knowledge drive the technical choices, and force honest comparison against the real benchmark rather than a flattering summary.

---

## The same photo, three AI models, one comparative paper

**Tags: reference material as an image, role, mid-task correction**

**The idea.** I wanted to show a postgraduate class how differently the frontier vision models "see". So I gave three of them, one from each major lab, the identical three prompts about the identical photograph: a 1990s ISA graphics card, chosen because it lets you teach Moore's Law from a real object. Then I wanted the comparison itself written up as a proper short research paper, with a plain-English section a non-technical conference audience could follow.

**The strategy.** Three techniques stacked. The reference material was an *image*, not text; the whole exercise turned on what each model could read off the actual board. The role set the register: a research paper for a peer-reviewed venue, with a ring-fenced plain-English passage. And the technique most worth showing is the mid-task correction: the first draft came back technically sound but written as dense bullet points, so I stopped it and changed the register without losing the content.

**The prompt.** The correction, which is the instructive part:

```
The plain-English section and the overall structure are right; leave them. Rewrite
sections three to seven as flowing academic prose, the way a researcher writing for a
peer-reviewed venue would: full sentences, argument carried in paragraphs, not lists.
Keep every piece of technical content; extra length is fine if it buys better flow.
Do not touch the plain-English summary.
```

**What came out.** A roughly 2,500-word comparative paper that held its technical depth (multimodal processing, chain-of-thought reasoning, unified embedding spaces, cross-modal reasoning) while reading as prose rather than a slide dump, with the plain-English passage preserved intact for the non-specialist audience. The lesson that transfers is about iteration: when an output is competent but wrong in *register*, you do not start editing sentences. You name the register you want and what to leave untouched, and you get the whole thing corrected in one pass. Naming what not to change is what stops iteration from costing you ground you had already won.

---

## Matching placement students to hospitals, honestly

**Tags: plan first, iterative build, transparent limitations**

**The idea.** A real placement-office problem: match a cohort of students to hospitals across a large metropolitan area, starting with students clustered in one outer growth corridor. I needed a working tool, but more than that I needed one that would not lie to the staff using it; the failure mode here is a tool that looks authoritative and quietly gives you a wrong answer.

**The strategy.** Build it in stages, not in one leap, and make the model flag its own limitations rather than paper over them. We moved deliberately: a postcode reference first, then a small prototype covering a single corridor, then a scale-up to the whole metro area, then a separate density map as a second tool. At each stage the model was told to surface real design choices (straight-line distance versus drive-time; suburb centroids versus exact addresses) rather than decide them silently, and to say plainly where the data was thin.

**The prompt.** The framing instruction that set the honesty bar:

```
Build this in stages; do not jump to the finished tool. Start with a postcode
reference, then a prototype covering one corridor, and only then scale to the whole
metro area. Use straight-line (haversine) distance as a first pass, but tell me
explicitly where that will differ from real drive time. Accept fuzzy suburb names, not
just postcodes, because that is how staff actually type. Wherever your data is
approximate, for example hospital locations at suburb-centroid rather than street
precision, say so in the tool itself rather than presenting it as exact. Flag any
source you could not obtain.
```

**What came out.** A working matcher covering 29 facilities with fuzzy suburb matching, plus a companion density map, and, crucially, a readme that told the truth about its own limits:

> Private hospital coverage is thin, four of twenty-nine facilities, for a specific reason: the Department of Health's bulk private-hospital contact list is not fetchable programmatically, so each private hospital has to be researched individually. If staff flag a well-known private hospital as missing during testing, tell me which ones matter most and I will add them with verified addresses rather than guessing.
>
> Matching runs in three steps: exact postcode, exact suburb, then a fuzzy pass tolerating minor typos ("Clyde Nth", "Berwic"). The tool shows which method matched so staff can sanity-check anything uncertain.

The technique that transfers: for anything people will trust and act on, stage the build so structural choices surface early, and make the model expose its own uncertainty in the product itself. A tool that admits what it cannot do is worth more than one that hides it.

---

## An original teaching concept, from intuition to a buildable simulation

**Tags: ideation, research with sourcing rules, scope a build to the reliability of your evidence, safety designed into the spec**

**The idea.** This one started as an original concept, not a task. Language learners are told to immerse in a country before they travel. But increasingly a country's *digital* ecosystem is its own walled garden, and using it as a local would (the domestic Chinese app rather than its international sibling, real-name registration, platform-level censorship you can feel) is a distinct literacy that country immersion alone does not teach. I wanted to turn that idea into a real, buildable teaching artefact: an annotated simulation of a state-shaped interface, where a learner walks through the screens a local sees and reads a commentary layer explaining what each one exposes. Two ecosystems as the first cases: China's Weixin, and North Korea's Red Star OS and its intranet as a contrasting non-travel example.

**The strategy.** Take the concept from intuition to something a coding tool could build, through four grounded stages. A pedagogical rationale first. Then a research pass with strict sourcing rules to close specific factual uncertainties. Then, and this is the part worth studying, a build specification that made two deliberate design decisions most people would get wrong: it scoped each simulation to the *reliability of the evidence* behind it, and it wrote the safety constraint into the spec rather than leaving it to the builder's discretion.

**The prompt.** The research pass, with the sourcing discipline that mattered most:

```
Research the following module and close these specific uncertainties. Rules: dated
citations only, no undated claims; put a confidence label of high, medium or low on
each main finding; where you cannot verify something, say so and leave it flagged
rather than filling the gap. Anchor the China material to named primary sources on
platform surveillance and the split between the domestic and international app;
confirm the current state of real-name registration and foreign-wallet payment
mechanics. For the North Korea comparison, anchor to named recent reporting on the
domestic intranet. List every source used at the end.
```

**What came out of the research.** A report that actually closed its open questions instead of gesturing at them:

> China's unified Network ID: finalised, effective 15 July 2025 (confidence: high). Foreign-wallet mechanics on the domestic payment rail: confirmed across seven card networks with specific per-transaction caps; peer-to-peer transfer to domestic users remains blocked (confidence: high). North Korea's domestic intranet and locked-down OS: anchored to named 2023 and 2026 reporting as a non-travel comparative case, since it is inaccessible from outside the country (confidence: medium-high). Strongest additional modules ranked: Russia and Iran.

**Then the build spec, which is where the real craft is.** The China interface was specified as a full interactive walkthrough, wireframed screen by screen. Seven screens, each with a purpose and a commentary hook:

> - Landing / registration split screen, showing the phone-number branching logic (a Chinese number routes you one way, a foreign number the other) that determines which account type you get, annotated to explain why this single field changes the entire experience.
> - Home / chat list, annotated with a callout on real-time keyword filtering and the registration-dependent censorship difference.
> - Moments (the social feed), annotated with the "surveilled but not censored" status of non-domestically-registered content, per the platform-surveillance findings.
> - Mini-programs, annotated with the breadth of embedded services (ride-hailing, utilities, government) unique to the domestic ecosystem.
> - Wallet / payment, annotated with the domestic-card-versus-foreign-card distinction and what data each method exposes.
> - Official accounts / discovery, annotated with the cross-ecosystem discoverability limitation.

The North Korea material was deliberately scoped *down*, and the reasoning is the lesson:

> A parallel, much simpler DPRK panel: not a full simulated OS, just an annotated static comparison screen showing the Naenara portal layout and the Red Star OS desktop, used as a contrast reference rather than an interactive build. The DPRK material is reconstructed from leaked builds, defector accounts and the small number of foreigners who have used the intranet in-country; trying to make it feel as "live" as the China simulation would overstate what is actually known. Treat all service names and OS version details as indicative, and make that limitation part of the lesson: it teaches students how open-source research about closed societies actually gets made.

The safety constraint was written into the spec itself, not left to the builder:

> No functioning login. A convincing fake login screen is the one component that tips this from teaching tool into phishing-adjacent territory regardless of intent. Generic device chrome plus a persistent visual treatment (border, watermark or banner) so the artefact cannot be mistaken for the genuine app in a screenshot taken out of context. All data-sharing and permission content is annotated commentary layered over a mockup, never an interface that actually requests or stores real permissions.

Two smaller decisions rounded it out: a consistent annotation tag system (a data-sharing note, a cultural note, and a travel-advice note per callout) so the build could colour-code the commentary layer; and an English-help toggle built as a hand-authored gloss *overlay* rather than a translation engine, so switching help on adds English above the Chinese text rather than replacing it, and the learner never loses target-language exposure.

**Why this is the strong one.** Three techniques compound here. An original idea grounded through research that admits its gaps; a build scoped to the reliability of its evidence, so the confident simulation and the honest static panel sit side by side and the asymmetry itself teaches something; and a safety line designed into the specification rather than bolted on. The transferable lesson: when you write a spec for another tool to build, the quality is not just in what you ask for but in what you deliberately refuse to fake, and in matching the ambition of each part to how much you actually know.

---

## A search simulator that teaches old and new literacy side by side

**Tags: reference material as a mockup, teaching tool, build from an image**

**The idea.** Search literacy is having an awkward moment. The classic skills (boolean operators, quotation marks for exact phrases, minus to exclude, site: to pin a domain) still matter, but learners now also meet AI-generated summaries sitting above the real results, which need a different, more sceptical literacy. I wanted one teaching tool that let a learner toggle between the two worlds and compare them directly.

**The strategy.** Hand the model a mockup image of the target interface and have it build to that reference, then design the tool around a toggle so the AI-summary layer can be switched on and off for direct comparison. The reference here was visual: an image of a search page with an AI-overview panel, used as the thing to reproduce, so the simulator matched a real interface rather than an imagined one.

**The prompt.**

```
I am attaching a mockup of a search results page with an AI overview panel at the
top. Build a self-contained teaching simulator that reproduces this interface and
does two things. First, teach the classic boolean operators through worked example
searches: exact-phrase quotes, minus to exclude, site: to restrict, OR to broaden;
each should explain what the operator did and why it helps. Second, add an AI Overview
mode the learner can toggle on and off, so they can compare the AI-summary experience
against plain results, with a callout on each summary about what to verify. Offline,
no dependencies.
```

**What came out.** A single self-contained tool with a switchable AI-overview panel above the results, worked boolean examples each with a plain explanation of the operator, and callouts prompting the learner to check the AI summary's sources. Toggling the AI layer on and off made the comparison the lesson, rather than telling learners about the difference in the abstract. The transferable technique: when you want a build to match a real interface, give the model the picture and have it build to that, rather than describing the layout in words and hoping.

---

## Smaller builds worth a look

Not every useful project is a saga. A few short ones, each showing one clean technique:

**A double-click trainer for people who have never used a mouse.** The idea was accessibility, not novelty: some learners have genuinely never operated a mouse. The strategy was to make the model design the *feedback*, not just the target, so the tool distinguishes "too slow", "too fast" and "correct", and shows a timing bar for where the click gap landed against a success zone. Targets shrink across four levels to mimic real desktop-icon sizes. The technique: describe the human difficulty precisely, and let the model design the scaffolding around it.

**An Arabic typing game with the script done properly.** A self-contained typing trainer using real literary passages, right-to-left throughout, character-by-character colour feedback, live words-per-minute and accuracy, and a text-to-speech readout. The technique: hand over the exact constraints that a generic build gets wrong (RTL direction, an Arabic serif face, capturing keystrokes behind styled text) so the model gets the hard details right the first time.

**Authentic-looking Bitcoin maths for a film background.** A film needed an abstract background suggesting the proof-of-work miners perform. The strategy was a two-step refinement: first generate the symbolic equations, then substitute real protocol values (genuine difficulty targets in hex, real curve parameters, plausible block heights and timestamps) so it would read as credible to an informed viewer. The technique: separate "get the shape right" from "make it authentic" into two passes rather than asking for both at once.

**A precise document update, treated as surgery not rewriting.** A tooling catalogue needed a new entry inserted, two cross-reference matrices updated, and the whole thing converted to a Word document, without disturbing anything else. The strategy was to specify the exact edits as operations (insert here, change this cell from X to Y, add this row) rather than saying "update the document" and hoping. The technique: for edits to a structured document, name the precise changes so the model performs surgery rather than a helpful rewrite that quietly alters things you did not want touched.

---

# The techniques, gathered

If you read the whole gallery, the same handful of techniques keep recurring across very different projects. They are the actual content of "advanced" use:

- **Give the model a role.** It sets the standard, the vocabulary, and the register. "An assessor working to the regulator's structure", "a researcher writing for a peer-reviewed venue". One line changes everything after it.
- **Give the model reference material.** The single biggest quality jump. Your document, your data, an image, a mockup, a named authoritative source. When the model works from your world, it stops guessing.
- **Break a big task into a plan, and build in stages.** Structure errors are the expensive ones. Agree the shape, check a small sample, then build, so mistakes surface while they are still cheap.
- **Insist on honesty.** Confidence labels, dated sources, "say so rather than guessing", limitations exposed in the product itself. This is what separates a checkable output from a plausible one.
- **Build something durable, or portable.** A saved Project with standing instructions so the quality is ambient; or a self-contained spec you can hand to a coding tool with none of your conversation in front of it. When you write that spec, scope the ambition of each part to how much you actually know, so a confident build and an honest static reference can sit side by side, and write any safety constraint into the spec itself rather than leaving it to the builder.

The through-line: you are briefing a capable new colleague. You give them a role, a folder of your own source material, time to plan, and permission to tell you what they do not know. Then you refine from what comes back.

---

# Where sophistication stops

Everything here makes the model more capable in your hands. None of it changes what the model will refuse to do. A cleverer role, a well-structured Project, a sophisticated multi-step plan; none of these unlock anything the model would otherwise decline. A request to build a deceptive replica of a real trusted brand, or a working tool to capture other people's credentials, is refused whether you ask for it in one blunt line or wrap it in a professional-sounding project. The guardrail is about what the output could do in the world, not how skilfully the request was phrased. If anything, that is reassuring: the safety does not degrade as the user gets more advanced.

---

# Going further

Not one of the projects above started with someone knowing in advance that it would work. Each started with a description of an ambitious result and refinement from what came back. That is the rule that guides the whole gallery: you do not need to know whether a task is possible, or how to phrase it perfectly, before you begin. Describe the result you want, look at what the model produces, and shape it from there.

This principle has its own short page, [If you want to see if an AI can do something, just ask it](https://ntworldink.com/ai-literacy/just-ask-it.html), and it applies with more force at this level than at the basic one.

Everything here is model agnostic. The prompts contain no tool-specific syntax, so they run in any current frontier chat model, though the most advanced examples (browsing a live source, building a saved Project, handing a spec to a coding tool) depend on features your particular tool may or may not have.

A companion resource, the Basic Prompts Gallery, covers the foundations: the anatomy of a single good prompt, adding context and constraints, and the habit of iterating.
