# AI watermarking page: research refresh and rebuild, 16 September 2026

Scope: the CDU teaching-staff course page `/cdu-teaching-staff/ai-watermarking-and-provenance.html`, its companion deck `/presentations/ai-watermarking-explained/`, and a drafting-note sweep of every page in `/cdu-teaching-staff/`.

## Drafting-note sweep

Every course page in `/cdu-teaching-staff/` was searched for working notes, verification notes, "SD's", TODO/TBC markers, "placeholder", "drafting", "unverified" and similar, and every HTML comment was checked. Findings:

- The "Two claims left out on purpose" callout on the watermarking page was the only drafting note on the course pages. Removed (high).
- The deck's Module 05 sources paragraph carried the matching sentence ("Deliberately not used: a claimed style loophole ... appeared in early drafting material"). Removed (high).
- The "Verification of the underlying claim set was completed on 17 August 2026 for the companion deck" line in the page's Sources intro was also internal in tone. Rewritten as a plain note on how dates are given (high).
- Everything else that matched was legitimate content: the "The cautionary tale is itself unverified" callout on what-were-not-sure-about.html is about the ACU episode, not a drafting note; the deck's "Why this is flagged rather than stated flatly" note in Module 04 is a reader-facing caveat; all HTML comments are structural labels (high).

## What changed in the world since the page was compiled (2 weeks ago)

Anthropic

- On 14 August 2026 Anthropic published "How Claude's text watermarking works", stating that Claude uses Google DeepMind's SynthID-Text method rather than a scheme of its own. Your page and deck both said the scheme was "undisclosed" and that providers "keep their own keys secret". That is now out of date and has been corrected in both (high). Source dated 14 August 2026.
- Marking applies to supported models only. The help article, as at 16 September 2026, names Fable 5.1 and Mythos 5.1 and says older models are being brought in. The deck's line "there is no region where an unmarked Claude response is the default any more" was overstated for older models and now reads "for a supported model" (high).
- Anthropic's stated reason for marking worldwide is that it "does not yet have a durable way to scope it by region" (high, direct quote, 14 August 2026). Added to the "why worldwide" section alongside the existing GDPR analogy.
- Provider-stated limits, added to the page and labelled as vendor statements: light editing does not remove the mark, a full rewrite does; translations carry the mark; the mark is sparser on factual passages; minimal in code, but code comments may carry it (high, 14 August 2026).
- Detector distribution: a free browser-based file checker at claude.com/check-files (also reachable as claude.com/check-content; both load, the help article links check-content) reads for a C2PA credential only and does not check text (high). The text watermark detection API is in private preview for "eligible organisations as required under EU law": regulators, law enforcement, media, fact-checkers, independent researchers, educational organisations and EU civil society groups, with a registration form (high, help article accessed 16 September 2026). Educational organisations being on that list is worth knowing for CDU.

Other frontier labs and Article 50

- Code of Practice on Transparency of AI-generated Content: final text published 10 June 2026; about 190 signatories by 31 July 2026; the Commission names Anthropic, Google, Meta, Microsoft, OpenAI and Mistral among the providers (high; EC news item dated 31 July 2026). A later MoFo note (11 September 2026) counts 82 provider and 152 deployer signatures (high).
- Google signed on 24 July 2026 and named five partners adopting SynthID: Apple, ElevenLabs, Kakao, NVIDIA and OpenAI (high; Google blog dated 24 July 2026). Gemini text has carried SynthID-Text since 2024 (high). The SynthID Detector portal remains on a waitlist for journalists, media professionals and researchers; the Gemini app can be asked whether an image, video or audio clip was made by Google AI (high; deepmind.google accessed 16 September 2026).
- OpenAI: signed the Code; adds C2PA metadata and, from July 2026, Google's SynthID to images; runs a public image checker at openai.com/verify (high; OpenAI post dated 11 June 2026 and help article accessed 16 September 2026). No public confirmation that ChatGPT text is watermarked; its EU AI Act help page lists SynthID for images and audio only, and the September 2026 arXiv paper below records that OpenAI built a text watermark in 2024 and withheld it (medium; a social-media post claiming OpenAI "quietly updated its support page to cover text watermarking" could not be confirmed against the support page itself).
- Meta, Microsoft, Mistral: named signatories; no public confirmation of a text mark found (medium; the only cross-provider status table found is a secondary source, layer3labs, dated 22 August 2026).
- xAI: a social-media post says xAI did not sign; not confirmed from a primary source (low). Not stated on the page.
- Penalties: Article 99(4) puts Article 50 breaches at up to EUR 15 million or 3 per cent of worldwide annual turnover, whichever is higher (high; AI Act Service Desk). No Article 50 fine has been reported yet (medium; absence of evidence).
- Transition: systems already on the EU market before 2 August 2026 have until 2 December 2026 (medium; MoFo 11 September 2026; the deck's phrasing "content already in circulation" was slightly different, the page now uses the systems-on-the-market wording).
- EU labelling icons: page last updated 10 August 2026; three icon types; icons optional, the deployer labelling duty (deepfakes, and public-interest text without editorial review) mandatory (high).
- New academic source: Nemecek, Chaudhary and Ayday (Case Western Reserve University), "Watermarks Without Verification: AI Text Watermarking After the EU AI Act", arXiv 2609.09604, 9 September 2026. Argues that nobody outside the vendors can verify the watermark claims; measured SynthID-Text on two open models with detection on code near chance and a 3.1 point code-correctness cost on one model (high for the paper's existence and claims; the numbers are the authors' own experiments on open models, not on Claude or Gemini).

Everything else on the old page (Kirchenbauer mechanism, z-score, entropy and code, Sadasivan paraphrase attack, C2PA fragility, smoke-alarm framing) checked out and was kept.

## What the rebuilt page now does

- Presenter's scroll-through: every substantive block from the deck is now on the page in order, ending at a highlighted "Open the playground" card that deep-links to Module 06.
- "Signed metadata" unpacked for a non-technical reader: metadata = the label on the back of the photo; manifest = the record of what made it and what was done to it; signed = a seal that breaks if anything changes, with the medicine-bottle tamper-band analogy. Three definition tiles, your contentcredentials.org screenshot (full page) plus a crop of the penguin credential panel, and an SVG "what happens to the seal" figure (opened normally, screenshot, social upload).
- Your claude.com/check-files screenshot as an exhibit with the link opening in a new tab, plus the Content Credentials Verify tool (contentcredentials.org/verify redirects to verify.contentauthenticity.org, so the direct URL is used).
- Article 50(2) full text with the assistive-editing carve-out highlighted, a rollout timeline, penalties, why worldwide, and the three EC links you asked for, all target=_blank.
- A "who is marking what, and who can check" table and a "what this means in a marking office" callout.
- Deck exhibits reused by absolute path (SynthID crocodile mock-up, humaniser search results, Pangram report), the latter two in scrolling panels so they do not swamp the page.
- Confidence labels are not shown on the public page, consistent with the rest of the site; they are in this file instead.
- Fixed in passing: the deck card at the foot of the page was wrapped in a paragraph tag, which browsers break apart, so its title and text were not rendering. Same markup bug may exist on other course pages that use the same card snippet inside a paragraph; not checked.

## Deck edits (text only, interactive elements untouched)

Five sentences changed for accuracy in Modules 01, 03 and 06 (the "undisclosed scheme" lines, the worldwide-default claim, and the SynthID pane footnote), one sentence removed from the Module 05 sources (the drafting note), one source added (Anthropic, 14 August 2026). A backup of the pre-edit deck is not kept on your disk; git has the previous version.

## Files written

- `cdu-teaching-staff/ai-watermarking-and-provenance.html` (rebuilt)
- `cdu-teaching-staff/exhibit-content-credentials-site.jpg` and `.webp`
- `cdu-teaching-staff/exhibit-content-credential-panel.jpg` and `.webp`
- `cdu-teaching-staff/exhibit-claude-check-files.jpg` and `.webp`
- `presentations/ai-watermarking-explained/index.html` (seven text edits)
- `CLAUDE.md` (DONE entry under the watermarking topic)

Not done: git commit and push; search index not regenerated (no new pages).

## Unsure or could not find

- Whether OpenAI has begun marking ChatGPT text since its help page was last read; the page itself does not say so, and the claim circulating on social media could not be verified.
- Whether Meta, Microsoft or Mistral mark text; no primary source found either way.
- Whether xAI signed the Code; only a social-media source.
- The exact scope of the 2 December 2026 transition (systems placed on the market before 2 August versus content already in circulation); secondary sources phrase it differently.
- Whether any enforcement action under Article 50 has begun; none found.
- Which older Claude models have since gained marking support beyond the two named in the help article.

## Sources used

- Anthropic, "How Claude's text watermarking works", 14 August 2026: https://www.anthropic.com/news/claude-text-watermark (high)
- Anthropic Help Center, "How Claude marks AI-generated content", accessed 16 September 2026 ("updated over 2 weeks ago" per the page): https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content (high)
- Anthropic, Check if a file was made with Claude, accessed 16 September 2026: https://claude.com/check-files and https://claude.com/check-content (high)
- Euronews, "EU compliance, delivered globally", 11 August 2026: https://www.euronews.com/next/2026/08/11/eu-compliance-delivered-globally-anthropic-to-watermark-claudes-output-worldwide (high)
- TechCrunch, "Anthropic shares more details about how Claude's new watermarks will work", 15 August 2026: https://techcrunch.com/2026/08/15/anthropic-shares-more-details-about-how-claudes-new-watermarks-will-work/ (high)
- BleepingComputer, "How Anthropic plans to watermark Claude's AI-generated text", 14 August 2026: https://www.bleepingcomputer.com/news/artificial-intelligence/how-anthropic-plans-to-watermark-claudes-ai-generated-text/ (medium)
- European Commission, Code of Practice on Transparency of AI-generated Content, last updated 31 July 2026: https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content (high)
- European Commission, "Strong backing for the Code of Practice", 31 July 2026: https://digital-strategy.ec.europa.eu/en/news/strong-backing-code-practice-transparency-ai-generated-content (high)
- European Commission, Signing the Code FAQ, accessed 16 September 2026: https://digital-strategy.ec.europa.eu/en/faqs/signing-code-practice-transparency-ai-generated-content (high)
- European Commission, EU icons for labelling AI-generated content, last updated 10 August 2026: https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content (high)
- AI Act Service Desk, Article 50 and Article 99, accessed 16 September 2026: https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50 and https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-99 (high)
- Morrison Foerster, "Full Transparency: Organizations Sign EU Code of Practice on AI Transparency", 11 September 2026: https://www.mofo.com/resources/insights/260911-full-transparency-organizations-sign-eu-code (high)
- Google, "Google is signing the EU AI Act Code of Practice", 24 July 2026: https://blog.google/company-news/outreach-and-initiatives/public-policy/eu-ai-act-transparency-code-of-practice/ (high)
- GCN, "Google signs EU AI Act transparency code and expands SynthID", 25 July 2026: https://gcn.com/synthid-watermarking-google-signs-act-transparency/20021/ (medium)
- Google DeepMind, SynthID, accessed 16 September 2026: https://deepmind.google/models/synthid/ (high)
- Google, "SynthID Detector", 20 May 2025: https://blog.google/innovation-and-ai/products/google-synthid-ai-content-detector/ (high)
- OpenAI, "Supporting Europe's work in ensuring a trustworthy AI ecosystem", 11 June 2026: https://openai.com/index/supporting-eu-trustworthy-ai-ecosystem/ (high)
- OpenAI Help Center, "EU AI Act: OpenAI Resources and Customer Guidance", accessed 16 September 2026: https://help.openai.com/en/articles/12141645-eu-ai-act-openai-resources-and-customer-guidance (high)
- Nemecek, Chaudhary and Ayday, "Watermarks Without Verification", arXiv 2609.09604, 9 September 2026: https://arxiv.org/abs/2609.09604 (high)
- layer3labs, "Which AI Models Watermark Their Output? (2026)", 22 August 2026: https://www.layer3labs.io/comparisons/which-ai-models-watermark-their-output (medium, secondary)
- Content Credentials, accessed 16 September 2026: https://contentcredentials.org/ and Verify tool https://verify.contentauthenticity.org/ (high)
- Pangram, "Pangram Predicts 21% of ICLR Reviews are AI-Generated", 18 November 2025: https://www.pangram.com/blog/pangram-predicts-21-of-iclr-reviews-are-ai-generated (high)
- Social-media posts on OpenAI's support page and on xAI not signing, accessed 16 September 2026, not used on the page: https://x.com/AGTPinsights/status/2087141443781423430 and https://x.com/M1Astra/status/2087326161697472838 (low)
