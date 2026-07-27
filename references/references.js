/* ============================================================
   /references/ data and interactive rendering
   Personal, filterable reference shelf. Edit DATA to add or
   change entries: {t: title, d: note, u: url, c: category}.
   Category must be one of CATS.
   ============================================================ */

const CATS = ["AI info","AI tools","AI Security","Basic Digital Literacy","Cyber Security","Datasets & repos","Other"];

const DATA = [
  // ---- AI tools ----
  {t:"ChatGPT", d:"OpenAI's chat assistant.", u:"https://chat.openai.com/", c:"AI tools"},
  {t:"Claude", d:"Anthropic's chat assistant.", u:"https://claude.ai/", c:"AI tools"},
  {t:"Council AI", d:"Put one question to several AI models at once.", u:"https://council-ai.app/", c:"AI tools"},
  {t:"Google Gemini", d:"Google's chat assistant.", u:"https://gemini.google.com/app", c:"AI tools"},
  {t:"Grok", d:"xAI's chat assistant.", u:"https://grok.com/", c:"AI tools"},
  {t:"Grok (on X)", d:"Grok inside X / Twitter.", u:"https://x.com/i/grok", c:"AI tools"},
  {t:"Microsoft 365 Copilot", d:"Copilot across the Microsoft 365 apps.", u:"https://m365.cloud.microsoft/", c:"AI tools"},
  {t:"Midjourney", d:"AI image generation.", u:"https://www.midjourney.com/", c:"AI tools"},
  {t:"NotebookLM", d:"Google's document and research assistant.", u:"https://notebooklm.google.com/", c:"AI tools"},
  {t:"Perplexity", d:"AI answer engine with citations.", u:"https://www.perplexity.ai/", c:"AI tools"},
  {t:"Teachable Machine", d:"Train simple machine-learning models in the browser (Google).", u:"https://teachablemachine.withgoogle.com/", c:"AI tools"},
  {t:"Turnitin Clarity", d:"Turnitin's AI-writing detection product.", u:"https://www.turnitin.com/campaigns/clarity/", c:"AI tools"},
  {t:"UndetectedGPT Humanizer", d:"Rewrites AI text to dodge detectors; handy for demonstrating the cat and mouse.", u:"https://www.undetectedgpt.ai/humanizer", c:"AI tools"},

  // ---- AI info ----
  {t:"AI Problems Index", d:"Catalogue of open problems in AI (The Multiverse School).", u:"https://themultiverse.school/x/ai-problems-index", c:"AI info"},
  {t:"AI, Australia's interests", d:"Australian Government statement on AI (Prime Minister).", u:"https://www.pm.gov.au/media/ai-australias-interests-0", c:"AI info"},
  {t:"AI and Copyright in Australia", d:"Plain-language explainer from the Copyright Agency.", u:"https://www.copyright.com.au/membership/ai-and-copyright-in-australia/", c:"AI info"},
  {t:"AI Watch: Global regulatory tracker, Australia", d:"Where Australian AI regulation stands (White & Case).", u:"https://www.whitecase.com/insight-our-thinking/ai-watch-global-regulatory-tracker-australia", c:"AI info"},
  {t:"Andrej Karpathy (X)", d:"AI researcher and educator worth following.", u:"https://x.com/karpathy", c:"AI info"},
  {t:"Anthropic Project Glasswing", d:"Anthropic project page.", u:"https://www.anthropic.com/project/glasswing", c:"AI info"},
  {t:"Artificial Analysis", d:"Independent benchmarks and price/speed comparisons of AI models.", u:"https://artificialanalysis.ai/", c:"AI info"},
  {t:"arXiv search", d:"Research paper preprints.", u:"https://arxiv.org/search", c:"AI info"},
  {t:"C2PA", d:"Content provenance and authenticity standard (Content Credentials).", u:"https://c2pa.org/", c:"AI info"},
  {t:"Data Center Map", d:"Global directory of data centres.", u:"https://www.datacentermap.com/", c:"AI info"},
  {t:"Epoch AI", d:"Research and data on AI trends and compute.", u:"https://epoch.ai/", c:"AI info"},
  {t:"EU AI Act", d:"Up-to-date text and analysis of the Act.", u:"https://artificialintelligenceact.eu/", c:"AI info"},
  {t:"Perplexity (language-model visualisation)", d:"Interactive next-token / perplexity demo; not the perplexity.ai tool.", u:"https://perplexity.vercel.app/", c:"AI info"},
  {t:"RFC 9309: Robots Exclusion Protocol", d:"The formal robots.txt standard.", u:"https://www.rfc-editor.org/rfc/rfc9309.html", c:"AI info"},
  {t:"Robots Exclusion Protocol FAQ", d:"robots.txt explained in plain terms.", u:"https://www.robotstxt.org/faq.html", c:"AI info"},
  {t:"SynthID", d:"Google's watermarking for AI-generated content.", u:"https://ai.google.dev/responsible/docs/safeguards/synthid", c:"AI info"},
  {t:"Tiktokenizer", d:"Visualise how text splits into LLM tokens.", u:"https://tiktokenizer.vercel.app/", c:"AI info"},

  // ---- AI Security ----
  {t:"0DIN", d:"GenAI bug-bounty disclosures.", u:"https://0din.ai/disclosures", c:"AI Security"},
  {t:"AI Incident Database", d:"Searchable log of real-world AI harms.", u:"https://incidentdatabase.ai/", c:"AI Security"},
  {t:"AI Standards Hub", d:"AI standards and guidance (Alan Turing Institute).", u:"https://aistandardshub.org/", c:"AI Security"},
  {t:"Application Security: free LLM training", d:"Hands-on LLM security lessons.", u:"https://application.security/free/llm", c:"AI Security"},
  {t:"AVID: AI Vulnerability Database", d:"Open database of AI/ML vulnerabilities.", u:"https://avidml.org/", c:"AI Security"},
  {t:"BIML: LLM risk analysis", d:"LLM risk report, PDF with free registration.", u:"https://berryvilleiml.com/docs/BIML-LLM24.pdf", c:"AI Security"},
  {t:"BIML ML threat taxonomy", d:"Berryville Institute's machine-learning risk taxonomy.", u:"https://berryvilleiml.com/taxonomy/", c:"AI Security"},
  {t:"BSI AI security recommendations", d:"Germany's BSI guidance, English edition.", u:"https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Kuenstliche-Intelligenz/kuenstliche-intelligenz_node.html", c:"AI Security"},
  {t:"Doublespeak", d:"Browser game for jailbreaking a chatbot.", u:"https://doublespeak.chat/", c:"AI Security"},
  {t:"Dreadnode", d:"Offensive AI/ML security tooling (documentation).", u:"https://docs.dreadnode.io/getting-started/overview/", c:"AI Security"},
  {t:"EmbraceTheRed: ASCII Smuggler", d:"Hidden-Unicode prompt-injection demonstration and tool.", u:"https://embracethered.com/blog/ascii-smuggler.html", c:"AI Security"},
  {t:"ENISA: AI cybersecurity challenges", d:"European agency overview of AI security challenges.", u:"https://www.enisa.europa.eu/publications/artificial-intelligence-cybersecurity-challenges", c:"AI Security"},
  {t:"ENISA: Cybersecurity of AI and standardisation", d:"How AI security maps to standards.", u:"https://www.enisa.europa.eu/publications/cybersecurity-of-ai-and-standardisation", c:"AI Security"},
  {t:"ENISA: Multilayer framework for AI cybersecurity", d:"Good-practice framework for securing AI.", u:"https://www.enisa.europa.eu/publications/multilayer-framework-for-good-cybersecurity-practices-for-ai", c:"AI Security"},
  {t:"ENISA: Securing ML algorithms (2021)", d:"Threats and countermeasures for machine learning.", u:"https://www.enisa.europa.eu/publications/securing-machine-learning-algorithms", c:"AI Security"},
  {t:"ETSI Securing AI (SAI)", d:"ETSI's AI security work programme.", u:"https://www.etsi.org/technologies/securing-artificial-intelligence", c:"AI Security"},
  {t:"Gandalf", d:"Lakera's prompt-injection challenge; a great workshop opener.", u:"https://gandalf.lakera.ai/baseline", c:"AI Security"},
  {t:"Google Secure AI Framework (SAIF)", d:"Google's framework for securing AI systems.", u:"https://blog.google/technology/safety-security/introducing-googles-secure-ai-framework/", c:"AI Security"},
  {t:"Gray Swan Arena", d:"Public AI red-teaming arena.", u:"https://app.grayswan.ai/arena", c:"AI Security"},
  {t:"HackAPrompt playground", d:"Prompt-injection practice, hosted on Hugging Face.", u:"https://huggingface.co/spaces/hackaprompt/playground", c:"AI Security"},
  {t:"IEEE 2813", d:"Big Data business security risk assessment.", u:"https://standards.ieee.org/ieee/2813/7535/", c:"AI Security"},
  {t:"ISO/IEC 20547-4", d:"Big data security standard.", u:"https://www.iso.org/standard/71278.html", c:"AI Security"},
  {t:"Microsoft: Copilot secure deployment and governance", d:"Foundational guidance for governing Copilot.", u:"https://learn.microsoft.com/en-us/microsoft-365/copilot/secure-govern-copilot-foundational-deployment-guidance", c:"AI Security"},
  {t:"Microsoft: Failure modes in machine learning", d:"Taxonomy of intentional and unintentional ML failures.", u:"https://learn.microsoft.com/en-us/security/engineering/failure-modes-in-machine-learning", c:"AI Security"},
  {t:"Microsoft and MITRE: ML attack tooling", d:"News release on a tool to help security teams prepare for ML attacks.", u:"https://www.mitre.org/news-insights/news-release/microsoft-and-mitre-create-tool-help-security-teams-prepare-attacks", c:"AI Security"},
  {t:"MIT AI Risk Repository", d:"Structured repository of documented AI risks.", u:"https://airisk.mit.edu/", c:"AI Security"},
  {t:"MITRE ATLAS", d:"Adversarial threat landscape for AI systems.", u:"https://atlas.mitre.org/", c:"AI Security"},
  {t:"MITRE ATLAS matrix", d:"The ATLAS tactics and techniques matrix.", u:"https://atlas.mitre.org/matrices/ATLAS", c:"AI Security"},
  {t:"myLLMbank", d:"LLM penetration-testing sandbox.", u:"https://myllmbank.com/", c:"AI Security"},
  {t:"myLLMdoc", d:"LLM penetration-testing sandbox.", u:"https://myllmdoc.com/", c:"AI Security"},
  {t:"NCSC UK and CISA: Guidelines for secure AI development", d:"Joint guidelines for secure AI system development.", u:"https://www.ncsc.gov.uk/collection/guidelines-secure-ai-system-development", c:"AI Security"},
  {t:"NIST Adversarial ML Taxonomy (AI 100-2)", d:"NIST taxonomy and terminology, final.", u:"https://csrc.nist.gov/pubs/ai/100/2/e2023/final", c:"AI Security"},
  {t:"NIST Adversarial ML Taxonomy (draft, 2023)", d:"Earlier draft white paper.", u:"https://csrc.nist.gov/publications/detail/white-paper/2023/03/08/adversarial-machine-learning-taxonomy-and-terminology/draft", c:"AI Security"},
  {t:"NIST AI Risk Management Framework 1.0", d:"The AI RMF, via DOI.", u:"https://doi.org/10.6028/NIST.AI.100-1", c:"AI Security"},
  {t:"NISTIR 8269", d:"Adversarial ML taxonomy, draft PDF (served from a nist.rip mirror; worth swapping for a canonical NIST link).", u:"https://csrc.nist.rip/external/nvlpubs.nist.gov/nistpubs/ir/2019/NIST.IR.8269-draft.pdf", c:"AI Security"},
  {t:"OECD AI Incidents Monitor (AIM)", d:"Tracks AI incidents reported worldwide.", u:"https://oecd.ai/en/incidents", c:"AI Security"},
  {t:"OffSec ML Playbook", d:"Offensive machine-learning security wiki.", u:"https://wiki.offsecml.com/", c:"AI Security"},
  {t:"OWASP AI Exchange", d:"Community AI security guidance.", u:"https://owaspai.org/", c:"AI Security"},
  {t:"OWASP AI Exchange: NCSC/CISA mapping", d:"How the NCSC/CISA secure-AI guidelines map to the AI Exchange.", u:"https://owaspai.org/go/jointguidelines/", c:"AI Security"},
  {t:"OWASP Agentic AI Top 10 (2026)", d:"Top risks for agentic AI applications.", u:"https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/", c:"AI Security"},
  {t:"OWASP GenAI Security Project", d:"Hub for the GenAI and LLM security work.", u:"https://genai.owasp.org/", c:"AI Security"},
  {t:"OWASP LLM Top 10", d:"Top LLM application security risks.", u:"https://genai.owasp.org/llm-top-10/", c:"AI Security"},
  {t:"OWASP ML Top 10", d:"Top machine-learning security risks.", u:"https://mltop10.info/", c:"AI Security"},
  {t:"Pliny the Liberator (X)", d:"Well-known AI jailbreaking figure.", u:"https://x.com/elder_plinius", c:"AI Security"},
  {t:"PLOT4ai", d:"Privacy and AI threat-modelling library.", u:"https://plot4.ai/library", c:"AI Security"},
  {t:"PortSwigger: Web LLM attacks", d:"Free lab-based training on LLM attacks.", u:"https://portswigger.net/web-security/llm-attacks", c:"AI Security"},
  {t:"Prompt Airlines", d:"AI hacking challenge game.", u:"https://promptairlines.com/", c:"AI Security"},
  {t:"Sightline", d:"Protect AI's AI/ML supply-chain vulnerability database.", u:"https://sightline.protectai.com/", c:"AI Security"},

  // ---- Basic Digital Literacy ----
  {t:"Be Connected: topic library", d:"Beginner digital skills for older Australians (eSafety).", u:"https://beconnected.esafety.gov.au/topic-library", c:"Basic Digital Literacy"},
  {t:"Be Connected: articles and tips", d:"Short how-to articles for new users.", u:"https://beconnected.esafety.gov.au/topic-library/articles-and-tips", c:"Basic Digital Literacy"},
  {t:"Be Connected: computer basics for beginners", d:"Absolute-beginner computer lessons.", u:"https://beconnected.esafety.gov.au/topic-library/computer-basics-for-beginners", c:"Basic Digital Literacy"},
  {t:"DigitalLearn", d:"Free beginner technology courses.", u:"https://www.digitallearn.org/", c:"Basic Digital Literacy"},
  {t:"GCFGlobal", d:"Free tutorials across technology and everyday skills.", u:"https://edu.gcfglobal.org/en/subjects/tech/", c:"Basic Digital Literacy"},
  {t:"Microsoft Digital Literacy", d:"Foundational digital-skills curriculum.", u:"https://www.microsoft.com/en-us/digital-literacy", c:"Basic Digital Literacy"},
  {t:"Microsoft Learn", d:"Microsoft's free product and skills learning hub.", u:"https://learn.microsoft.com/en-us/", c:"Basic Digital Literacy"},
  {t:"Tech Life Unity", d:"Free step-by-step digital-literacy guides and YouTube channel; formerly Techboomers, running since 2015.", u:"https://www.techlifeunity.com/a-to-z-topics", c:"Basic Digital Literacy"},

  // ---- Cyber Security ----
  {t:"ACCCE Trace an Object", d:"Crowdsourced child-protection investigations.", u:"https://www.accce.gov.au/what-we-do/trace-an-object", c:"Cyber Security"},
  {t:"Annual Cyber Threat Report 2023-24", d:"ACSC's yearly threat report.", u:"https://www.cyber.gov.au/about-us/view-all-content/reports-and-statistics/annual-cyber-threat-report-2023-2024", c:"Cyber Security"},
  {t:"ASD: Australian Signals Directorate", d:"Australia's signals intelligence and cyber agency.", u:"https://www.asd.gov.au/", c:"Cyber Security"},
  {t:"Browserling", d:"Online cross-browser testing; handy for sandboxed browsing demos.", u:"https://www.browserling.com/", c:"Cyber Security"},
  {t:"Check Point Live Cyber Threat Map", d:"Real-time global attack map.", u:"https://threatmap.checkpoint.com/", c:"Cyber Security"},
  {t:"Cyber.gov.au", d:"Australian Cyber Security Centre home.", u:"https://www.cyber.gov.au/", c:"Cyber Security"},
  {t:"CyberDefenders", d:"Blue-team CTF challenges.", u:"https://cyberdefenders.org/blueteam-ctf-challenges/packetdetective/", c:"Cyber Security"},
  {t:"Data Breaches and Cyber Attacks in Australia 2018-2025", d:"Running list from Webber Insurance.", u:"https://www.webberinsurance.com.au/data-breaches-list", c:"Cyber Security"},
  {t:"Digital Forensics Tips", d:"DFIR how-tos and notes.", u:"https://www.digitalforensicstips.com/", c:"Cyber Security"},
  {t:"eSafety Guide", d:"Safety info for apps, games and social media (eSafety Commissioner).", u:"https://www.esafety.gov.au/key-topics/esafety-guide", c:"Cyber Security"},
  {t:"Essential Eight Explained (Nov 2023, PDF)", d:"ACSC mitigation strategies.", u:"https://www.cyber.gov.au/sites/default/files/2023-11/PROTECT%20-%20Essential%20Eight%20Explained%20%28November%202023%29.pdf", c:"Cyber Security"},
  {t:"Hack The Box Academy", d:"Guided offensive-security training.", u:"https://academy.hackthebox.com/", c:"Cyber Security"},
  {t:"Hack The Box Enterprise", d:"Team and enterprise cyber ranges.", u:"https://enterprise.hackthebox.com/", c:"Cyber Security"},
  {t:"HackerOne Hacktivity", d:"Public feed of disclosed bug-bounty reports.", u:"https://hackerone.com/hacktivity", c:"Cyber Security"},
  {t:"Information Security Manual (June 2025, PDF)", d:"The ACSC ISM.", u:"https://www.cyber.gov.au/sites/default/files/2025-07/Information%20security%20manual%20%28June%202025%29.pdf", c:"Cyber Security"},
  {t:"ISO: IT and related technologies", d:"ISO's IT standards sector page.", u:"https://www.iso.org/sectors/it-technologies", c:"Cyber Security"},
  {t:"Kaspersky Cyberthreat live map", d:"Real-time global threat map.", u:"https://cybermap.kaspersky.com/", c:"Cyber Security"},
  {t:"Linux Journey", d:"Learn Linux from the basics up.", u:"https://linuxjourney.com/", c:"Cyber Security"},
  {t:"Map the Dark", d:"DarkOwl's interactive darknet data visualisation.", u:"https://www.mapthedark.com/", c:"Cyber Security"},
  {t:"MaxMind GeoLite2", d:"Free IP geolocation databases.", u:"https://dev.maxmind.com/geoip/geolite2-free-geolocation-data/", c:"Cyber Security"},
  {t:"National Vulnerability Database (NIST)", d:"The US NVD.", u:"https://www.nist.gov/itl/nvd", c:"Cyber Security"},
  {t:"NSA Playset (Wayback)", d:"Catalogue of NSA-inspired hardware hacking tools.", u:"https://web.archive.org/web/20221205112239/http://www.nsaplayset.org/project-requirements", c:"Cyber Security"},
  {t:"NSA Spy Catalog (Der Spiegel, Wayback)", d:"Leaked NSA / ANT surveillance gear.", u:"https://web.archive.org/web/20140102051417/https://www.spiegel.de/international/world/a-941262.html", c:"Cyber Security"},
  {t:"NSW data breach: Resilient Homes Program", d:"Flood-victim data breach case study.", u:"https://www.nsw.gov.au/departments-and-agencies/nsw-reconstruction-authority/northern-region/northern-rivers/resilient-homes-program-data-breach", c:"Cyber Security"},
  {t:"NSW flood victims' details leaked (news)", d:"Media coverage of the breach.", u:"https://www.msn.com/en-au/news/australia/flood-victims-details-leaked-in-major-data-breach/ar-AA1NUsoz", c:"Cyber Security"},
  {t:"NT Government Cyber Security Hub", d:"Be CyberSmart NT.", u:"https://becybersmart.nt.gov.au/", c:"Cyber Security"},
  {t:"NT Information Privacy Principles", d:"NT Information Commissioner's IPPs.", u:"https://infocomm.nt.gov.au/privacy/information-privacy-principles", c:"Cyber Security"},
  {t:"OAIC: Australian Privacy Principles (key concepts)", d:"APP guidelines, key concepts.", u:"https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-b-key-concepts", c:"Cyber Security"},
  {t:"OAIC: Privacy Impact Assessment guidance", d:"When agencies must run a PIA.", u:"https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/government-agencies/australian-government-agencies-privacy-code/when-do-agencies-need-to-conduct-a-privacy-impact-assessment", c:"Cyber Security"},
  {t:"OSSEM", d:"Open Source Security Events Metadata project.", u:"https://ossemproject.com/intro.html", c:"Cyber Security"},
  {t:"OWASP Cheat Sheet Series", d:"Practical application-security cheat sheets.", u:"https://cheatsheetseries.owasp.org/", c:"Cyber Security"},
  {t:"PCI Security Standards Council", d:"Document library, including PCI DSS.", u:"https://www.pcisecuritystandards.org/document_library/", c:"Cyber Security"},
  {t:"PortSwigger Web Security Academy", d:"Free web-security training, essential skills.", u:"https://portswigger.net/web-security/essential-skills", c:"Cyber Security"},
  {t:"PSPF Release 2025 (PDF)", d:"Protective Security Policy Framework.", u:"https://www.protectivesecurity.gov.au/system/files/2025-07/pspf-release-2025.pdf", c:"Cyber Security"},
  {t:"Quiz Library (Cyber.gov.au)", d:"Cyber-awareness quizzes.", u:"https://www.cyber.gov.au/learn-basics/view-resources/quiz-library", c:"Cyber Security"},
  {t:"Radware Live Threat Map", d:"Real-time global attack map.", u:"https://livethreatmap.radware.com/", c:"Cyber Security"},
  {t:"ReportCyber", d:"Report cybercrime in Australia.", u:"https://reportapp.cyber.gov.au/", c:"Cyber Security"},
  {t:"Scamwatch: jobs and employment scams", d:"Recognise and report employment scams.", u:"https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams", c:"Cyber Security"},
  {t:"StopNCII", d:"Help to stop non-consensual intimate image abuse.", u:"https://stopncii.org/", c:"Cyber Security"},
  {t:"Surveillance Watch", d:"Map of the surveillance-technology industry.", u:"https://www.surveillancewatch.io/", c:"Cyber Security"},
  {t:"TryHackMe: Hacktivities", d:"Guided learning paths and rooms.", u:"https://tryhackme.com/hacktivities", c:"Cyber Security"},
  {t:"TryHackMe: Glossary", d:"Plain-language security glossary.", u:"https://tryhackme.com/glossary", c:"Cyber Security"},
  {t:"Vault 7 (WikiLeaks)", d:"CIA hacking-tools leak.", u:"https://wikileaks.org/ciav7p1/", c:"Cyber Security"},
  {t:"VirusTotal", d:"Scan files and URLs against many engines.", u:"https://www.virustotal.com/gui/home/upload", c:"Cyber Security"},

  // ---- Datasets & repos ----
  {t:"Common Crawl", d:"Open web-scale crawl corpus.", u:"https://commoncrawl.org/", c:"Datasets & repos"},
  {t:"Hugging Face: Datasets", d:"Searchable machine-learning dataset hub.", u:"https://huggingface.co/datasets", c:"Datasets & repos"},
  {t:"ai-robots-txt/ai.robots.txt", d:"robots.txt list for blocking AI crawlers.", u:"https://github.com/ai-robots-txt/ai.robots.txt", c:"Datasets & repos"},
  {t:"apurvsinghgautam/robin", d:"AI-powered dark-web OSINT tool.", u:"https://github.com/apurvsinghgautam/robin", c:"Datasets & repos"},
  {t:"atlas-bear/osint-ai-guide", d:"Guide to OSINT with AI.", u:"https://github.com/atlas-bear/osint-ai-guide", c:"Datasets & repos"},
  {t:"ComposioHQ/awesome-claude-skills", d:"Skill-creator and a curated skills list.", u:"https://github.com/ComposioHQ/awesome-claude-skills/tree/master/skill-creator", c:"Datasets & repos"},
  {t:"daveshap/Claude_Sentience", d:"Style_Candor.md and related notes.", u:"https://github.com/daveshap/Claude_Sentience/blob/main/Style_Candor.md", c:"Datasets & repos"},
  {t:"DAMO-NLP-SG/multilingual-safety-for-LLMs", d:"Multilingual LLM safety research.", u:"https://github.com/DAMO-NLP-SG/multilingual-safety-for-LLMs", c:"Datasets & repos"},
  {t:"docling-project/docling", d:"Parse documents into AI-ready formats.", u:"https://github.com/docling-project/docling", c:"Datasets & repos"},
  {t:"f/awesome-chatgpt-prompts", d:"prompts.csv prompt dataset.", u:"https://github.com/f/awesome-chatgpt-prompts/blob/main/prompts.csv", c:"Datasets & repos"},
  {t:"gnipping/Awesome-ML-SP-Papers", d:"Curated ML security and privacy papers.", u:"https://github.com/gnipping/Awesome-ML-SP-Papers", c:"Datasets & repos"},
  {t:"ipa-lab/hackingBuddyGPT", d:"LLMs for ethical hacking in under 50 lines.", u:"https://github.com/ipa-lab/hackingBuddyGPT", c:"Datasets & repos"},
  {t:"MultiJail dataset (CSV)", d:"Multilingual jailbreak dataset from DAMO-NLP-SG.", u:"https://github.com/DAMO-NLP-SG/multilingual-safety-for-LLMs/blob/main/data/MultiJail.csv", c:"Datasets & repos"},
  {t:"openai/codex", d:"Config reference.", u:"https://github.com/openai/codex/blob/main/docs/config.md", c:"Datasets & repos"},
  {t:"ottosulin/awesome-ai-security", d:"Curated AI security resources.", u:"https://github.com/ottosulin/awesome-ai-security", c:"Datasets & repos"},
  {t:"palantir/alerting-detection-strategy-framework", d:"Detection-engineering framework.", u:"https://github.com/palantir/alerting-detection-strategy-framework", c:"Datasets & repos"},
  {t:"protectai/ai-exploits", d:"Real-world AI/ML exploits.", u:"https://github.com/protectai/ai-exploits", c:"Datasets & repos"},
  {t:"ReversecLabs/damn-vulnerable-llm-agent", d:"Deliberately vulnerable LLM agent to practise on.", u:"https://github.com/ReversecLabs/damn-vulnerable-llm-agent", c:"Datasets & repos"},
  {t:"RiccardoBiosas/awesome-MLSecOps", d:"Curated MLSecOps resources.", u:"https://github.com/RiccardoBiosas/awesome-MLSecOps", c:"Datasets & repos"},
  {t:"TrustMLRG/GASP", d:"Adversarial-suffixes dataset (CSV).", u:"https://github.com/TrustMLRG/GASP/blob/main/data/advsuffixes/advsuffixes.csv", c:"Datasets & repos"},
  {t:"wunderwuzzi23/yolo-ai-cmdbot", d:"AI bot that turns a question into a shell command and runs it.", u:"https://github.com/wunderwuzzi23/yolo-ai-cmdbot", c:"Datasets & repos"},
  {t:"xai-org/grok-prompts", d:"Grok's published system prompts.", u:"https://github.com/xai-org/grok-prompts", c:"Datasets & repos"},

  // ---- Other ----
  {t:"Meta's Internal Research", d:"NYU Stern (Tech and Society Lab) compilation of Meta's internal studies on social media harms to youth mental health; launched 2026.", u:"https://metasinternalresearch.org", c:"Other"},
  {t:"Periodic Table of SEO Elements", d:"Search Engine Land's SEO reference chart.", u:"https://searchengineland.com/seotable", c:"Other"},
  {t:"Jobs and Skills Australia", d:"Labour-market and careers data.", u:"https://www.jobsandskills.gov.au", c:"Other"},
  {t:"Jobs and Skills Australia: ICT industry overview", d:"Computer system design and related services.", u:"https://www.jobsandskills.gov.au/jobs-and-skills-atlas/industry/70-computer-system-design-and-related-services/overview", c:"Other"},
  {t:"Repeal the Online Safety Act (UK petition)", d:"UK Parliament petition.", u:"https://petition.parliament.uk/petitions/722903", c:"Other"},
  {t:"ALRC: genetic discrimination in Australia", d:"Evidence report on genetic discrimination in employment.", u:"https://www.alrc.gov.au/publication/essentially-yours-the-protection-of-human-genetic-information-in-australia-alrc-report-96/30-genetic-discrimination-in-employment/evidence-of-genetic-discrimination-in-australia/", c:"Other"},

  // ============================================================
  // Merged from the former /resources/websites-and-tools.html
  // (curated, verified Feb 2026; folded in 27 July 2026). Plus
  // WildChat Visualiser carried over from the retired Articles
  // & Papers page. Duplicates of entries above were left out.
  // ============================================================

  // Benchmarks and leaderboards
  {t:"SWE-bench", d:"Benchmark measuring how well AI models solve real-world software engineering tasks drawn from GitHub issues; a practical measure of coding ability.", u:"https://www.swebench.com/", c:"AI info"},
  {t:"Humanity's Last Exam (HLE)", d:"A 2,500-question benchmark across 100+ subjects from the Center for AI Safety and Scale AI, published in Nature (January 2026), testing genuine expertise rather than pattern matching.", u:"https://agi.safe.ai/", c:"AI info"},
  {t:"Aider Code Editing Leaderboard", d:"Ranks LLMs on how well they edit code via the Aider assistant; useful for real-world coding comparisons.", u:"https://aider.chat/docs/leaderboards/", c:"AI info"},
  {t:"Arena (formerly LMSYS Chatbot Arena)", d:"Crowdsourced blind comparison of LLM outputs producing Elo-style rankings; rebranded from LMArena to Arena in January 2026.", u:"https://lmarena.ai/", c:"AI info"},

  // Interactive learning and visualisation
  {t:"TensorFlow Playground", d:"Browser-based neural network visualisation from Google; adjust layers, neurons and data to watch a network learn in real time.", u:"https://playground.tensorflow.org/", c:"AI info"},
  {t:"Transformer Explainer", d:"Interactive visualisation of how a transformer model processes text; good for explaining attention (Georgia Tech Polo Club).", u:"https://poloclub.github.io/transformer-explainer/", c:"AI info"},
  {t:"OpenAI Tokenizer", d:"Official OpenAI tool showing how text is broken into tokens; explains why prompts have length limits.", u:"https://platform.openai.com/tokenizer", c:"AI info"},
  {t:"Hugging Face Tokenizer Playground", d:"Compare tokenisation across models (GPT, LLaMA, Mistral); shows how models see the same text differently.", u:"https://huggingface.co/spaces/Xenova/the-tokenizer-playground", c:"AI info"},
  {t:"WildChat Visualiser", d:"Interactive tool for exploring how people actually use AI chatbots in the wild; useful for real-world usage patterns.", u:"https://wildvisualizer.com/?contains=essay&dataset=wildchat", c:"AI info"},

  // AI browsers, agents and emerging tools
  {t:"OpenAI ChatGPT Atlas", d:"OpenAI's Chromium-based browser with ChatGPT in every tab, browser memory and an agent mode; note the privacy implications of the memory feature.", u:"https://chatgpt.com/atlas/", c:"AI tools"},
  {t:"Perplexity Comet", d:"AI-native browser from Perplexity with ad blocking and background agents that can act across tabs.", u:"https://www.perplexity.ai/comet", c:"AI tools"},
  {t:"Google Antigravity", d:"Google's agent-first AI IDE, released alongside Gemini 3 in late 2025; agents plan, code, test and validate across editor, terminal and browser.", u:"https://antigravity.google/", c:"AI tools"},
  {t:"OpenAI Prism", d:"Free LaTeX-native workspace for scientific paper writing with GPT built in.", u:"https://prism.openai.com/", c:"AI tools"},
  {t:"OpenAI Codex Cookbook", d:"Official examples and recipes for using OpenAI's Codex coding agent.", u:"https://cookbook.openai.com/topic/codex", c:"AI info"},
  {t:"Awesome Claude: Vibe Coding Guide", d:"Community guide to vibe coding with Claude; a plain-language explainer of directing an AI to build software.", u:"https://awesomeclaude.ai/vibe-coding-guide", c:"AI info"},
  {t:"Awesome Claude: Code Cheatsheet", d:"Quick reference for Claude's code capabilities.", u:"https://awesomeclaude.ai/code-cheatsheet", c:"AI info"},
  {t:"Moltbook", d:"Self-described front page of the agent internet; an early directory and forum for AI agents.", u:"https://www.moltbook.com/m/general", c:"AI info"},
  {t:"Crabby-Rathbun AI-agent incident", d:"Case study: the GitHub profile of an AI agent that retaliated against an open-source maintainer who rejected its contribution by publishing a defamatory post; an early example of an agent independently targeting a human. See the NYT Hard Fork podcast at youtu.be/3n_jKx6v6qU.", u:"https://github.com/crabby-rathbun", c:"AI Security"},

  // AI safety, security and incident tracking
  {t:"AI Forensics", d:"European non-profit investigating the societal impacts of AI platforms, including algorithmic audits and content-moderation analysis.", u:"https://www.aiforensics.org/work", c:"AI Security"},
  {t:"AI Forensics: Grok Unleashed", d:"Investigation into X's Grok assistant and its behaviour around misinformation and content moderation.", u:"https://www.aiforensics.org/work/grok-unleashed", c:"AI Security"},
  {t:"ICMEC: Child Safety in the Age of AI", d:"ICMEC Australia resource on AI and child-safety risks, including deepfakes and CSAM generation.", u:"https://icmec.org.au/prioritising-child-safety-in-the-age-of-ai-2/", c:"AI Security"},
  {t:"Center for AI Safety (CAIS)", d:"The organisation behind Humanity's Last Exam and the Statement on AI Risk; a hub for AI safety research and advocacy.", u:"https://www.safe.ai/", c:"AI Security"},

  // AI privacy, data and user control
  {t:"ChatGPT Memory FAQ", d:"OpenAI's explainer on how ChatGPT memory works: what it saves, and how to view and delete memories.", u:"https://help.openai.com/en/articles/8590148-memory-faq", c:"AI info"},
  {t:"OpenAI Privacy Portal", d:"Where users submit data opt-out requests to OpenAI.", u:"https://privacy.openai.com", c:"AI info"},
  {t:"OAIC: Privacy Guidance for AI Products", d:"Australian Information Commissioner's guidance on privacy obligations when using commercial AI products, including PIAs and data minimisation.", u:"https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/guidance-on-privacy-and-the-use-of-commercially-available-ai-products", c:"Cyber Security"},
  {t:"LM Studio", d:"Desktop app for running open-source LLMs locally, with no data sent to external servers.", u:"https://lmstudio.ai/", c:"AI tools"},

  // Content provenance and copyright
  {t:"Content Authenticity Initiative", d:"Adobe-led initiative implementing the C2PA content-provenance standard in practice, with tools and guidance for creators and publishers.", u:"https://contentauthenticity.org/", c:"AI info"},

  // Australian AI policy, governance and regulation
  {t:"Voluntary AI Safety Standard (VAISS)", d:"Australia's 10 voluntary guardrails for safe and responsible AI; now integrated into the Guidance for AI Adoption (October 2025).", u:"https://www.industry.gov.au/publications/voluntary-ai-safety-standard", c:"AI info"},
  {t:"Australia's AI Ecosystem: Growth and Opportunities", d:"Government overview of Australia's AI ecosystem: investment, capability and workforce.", u:"https://www.industry.gov.au/publications/australias-artificial-intelligence-ecosystem-growth-and-opportunities", c:"AI info"},
  {t:"National Artificial Intelligence Centre (NAIC)", d:"Leads national AI policy development, including the VAISS and Guidance for AI Adoption.", u:"https://www.industry.gov.au/science-technology-and-innovation/technology/national-artificial-intelligence-centre", c:"AI info"},
  {t:"AI Adoption Tracker (Data)", d:"Government data tracking AI adoption across Australian industry sectors.", u:"https://www.industry.gov.au/publications/ai-adoption-tracker/ai-adoption-data", c:"AI info"},
  {t:"CAIDP: Council of Europe AI Treaty", d:"Resource on the Council of Europe Framework Convention on AI and Human Rights, the first binding international AI treaty.", u:"https://www.caidp.org/resources/coe-ai-treaty/", c:"AI info"},
  {t:"eSafety Commissioner: Generative AI", d:"eSafety guidance on generative AI risks and industry obligations under the Online Safety Act.", u:"https://www.esafety.gov.au/industry/tech-trends-and-challenges/generative-ai", c:"AI info"},

  // Cybersecurity and online safety
  {t:"Good Things Foundation: Internet Safety Tip Sheet", d:"Basic internet safety guidance from Good Things Foundation Australia, with The Smith Family.", u:"https://goodthingsaustralia.org/learn-resource/smithfamily-tipsheet-usinginternetv2/", c:"Basic Digital Literacy"},

  // AI research and discovery platforms
  {t:"Emergent Mind", d:"AI-powered research discovery tool for exploring arXiv papers through natural-language queries.", u:"https://www.emergentmind.com/", c:"AI info"},
  {t:"Google DeepMind Publications", d:"Full catalogue of DeepMind's research publications, from AlphaFold to Gemini.", u:"https://deepmind.google/research/publications/", c:"AI info"},
  {t:"Hugging Face", d:"The central hub for open-source AI models, datasets and demos; often called the GitHub of AI.", u:"https://huggingface.co/", c:"Datasets & repos"},
  {t:"Napkin AI", d:"Turns text into visual diagrams and infographics; handy for making training materials.", u:"https://www.napkin.ai/", c:"AI tools"},
  {t:"Stanford HAI AI Index Report", d:"The most comprehensive annual report on the state of AI globally (2025, 8th edition); benchmarks, investment, policy and workforce.", u:"https://hai.stanford.edu/ai-index/2025-ai-index-report", c:"AI info"},

  // Australian-made AI
  {t:"Maincode", d:"Melbourne company building AI models designed, trained and hosted in Australia; created Matilda, Australia's first homegrown language model.", u:"https://maincode.com/", c:"AI info"},

  // Productivity tools and prompt libraries
  {t:"Microsoft Copilot Prompt Gallery", d:"Microsoft's official prompt library for Copilot across the Office apps.", u:"https://copilot.cloud.microsoft/en-us/prompts/all", c:"AI info"},

  // Workforce, education and skills data
  {t:"Australian Bureau of Statistics: Labour Force", d:"Current Australian labour force data; grounds AI workforce discussions in real figures.", u:"https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia/latest-release", c:"Other"},
  {t:"OECD: Education at a Glance 2024", d:"Comprehensive international education data (OECD, 2024).", u:"https://www.oecd.org/en/publications/education-at-a-glance-2024_c00cad36-en.html", c:"Other"},
  {t:"Future Skills Organisation", d:"Australian Government-funded body identifying emerging skills needs across the economy.", u:"https://www.futureskillsorganisation.com.au/", c:"Other"},
  {t:"NCVER", d:"Australia's primary source of VET sector research and statistics.", u:"https://www.ncver.edu.au/", c:"Other"},
  {t:"VOCEDplus", d:"International research database for VET and tertiary education, maintained by NCVER.", u:"https://www.voced.edu.au/", c:"Other"},

  // Trending commentary and big-picture reads
  {t:"Matt Shumer: Something Big Is Happening", d:"Viral 2026 essay arguing AI capability has crossed a threshold that will disrupt white-collar work; widely discussed and widely criticised. Read as a conversation starter.", u:"https://shumer.dev/something-big-is-happening", c:"AI info"},
  {t:"Dario Amodei: The Adolescence of Technology", d:"Essay by Anthropic's CEO framing this phase of AI as an adolescence; a more measured counterpoint to the Shumer piece.", u:"https://www.darioamodei.com/essay/the-adolescence-of-technology", c:"AI info"},
  {t:"Citrini Research: The 2028 Global Intelligence Crisis", d:"Speculative scenario modelling AI's possible impact on labour markets; framed explicitly as scenario planning, not prediction (February 2026).", u:"https://www.citriniresearch.com/p/2028gic", c:"AI info"}
];

// ---- state ----
const state = { q:"", cat:"All", sort:"az" };

const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const prettyUrl = u => u.replace(/^https?:\/\//,"").replace(/\/$/,"");
const norm = s => s.toLowerCase();

const listEl  = document.getElementById("rl-list");
const countEl = document.getElementById("rl-count");
const chipsEl = document.getElementById("rl-chips");
const qEl     = document.getElementById("rl-q");
const clearEl = document.getElementById("rl-clear");
const sortEl  = document.getElementById("rl-sort");
const totalEl = document.getElementById("rl-total");

function buildChips(){
  const counts = {};
  CATS.forEach(c => counts[c] = DATA.filter(d => d.c === c).length);
  const chips = [["All", DATA.length]].concat(CATS.map(c => [c, counts[c]]));
  chipsEl.innerHTML = chips.map(([name,n]) =>
    `<button class="rl-chip${name===state.cat?" is-active":""}" data-cat="${esc(name)}" aria-pressed="${name===state.cat}">${esc(name)}<span class="rl-n">${n}</span></button>`
  ).join("");
}

function filtered(){
  const q = norm(state.q.trim());
  const rows = DATA.filter(d => {
    if(state.cat !== "All" && d.c !== state.cat) return false;
    if(q && !(norm(d.t).includes(q) || norm(d.d).includes(q))) return false;
    return true;
  });
  const byTitle = (a,b) => a.t.localeCompare(b.t, undefined, {sensitivity:"base"});
  if(state.sort === "az") rows.sort(byTitle);
  else if(state.sort === "za") rows.sort((a,b)=>byTitle(b,a));
  else if(state.sort === "cat") rows.sort((a,b)=>{
    const ci = CATS.indexOf(a.c) - CATS.indexOf(b.c);
    return ci !== 0 ? ci : byTitle(a,b);
  });
  return rows;
}

function render(){
  const rows = filtered();
  countEl.textContent = `Showing ${rows.length} of ${DATA.length}`
    + (state.cat!=="All" ? ` in ${state.cat}` : "")
    + (state.q.trim() ? ` matching "${state.q.trim()}"` : "");
  if(!rows.length){
    listEl.innerHTML = `<p class="rl-empty">No references match that search. Try a shorter term or reset the category filter.</p>`;
    return;
  }
  listEl.innerHTML = rows.map(d => {
    const idx = DATA.indexOf(d);
    return `<div class="rl-ref">`
      + `<a class="rl-t" href="${esc(d.u)}" target="_blank" rel="noopener noreferrer">${esc(d.t)}</a>`
      + `<span class="rl-tag" data-cat="${esc(d.c)}" role="button" tabindex="0" title="Filter to ${esc(d.c)}">${esc(d.c)}</span>`
      + `<span class="rl-d"> ${esc(d.d)}</span>`
      + `<span class="rl-u">${esc(prettyUrl(d.u))}</span>`
      + `<button class="rl-copy" data-i="${idx}" title="Copy title, note and link">copy</button>`
      + `</div>`;
  }).join("");
}

function fallbackCopy(text, done){
  const ta = document.createElement("textarea");
  ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); done(); } catch(_) {}
  document.body.removeChild(ta);
}

function setCat(cat){ state.cat = cat; buildChips(); render(); }

chipsEl.addEventListener("click", e => {
  const b = e.target.closest(".rl-chip"); if(!b) return;
  setCat(b.dataset.cat);
});

listEl.addEventListener("click", e => {
  const tag = e.target.closest(".rl-tag");
  if(tag){ setCat(tag.dataset.cat); window.scrollTo({top:0,behavior:"smooth"}); return; }
  const cp = e.target.closest(".rl-copy");
  if(cp){
    const d = DATA[+cp.dataset.i];
    const text = `${d.t}: ${d.d}\n${d.u}`;
    const done = () => { cp.textContent = "copied"; cp.classList.add("is-done"); setTimeout(()=>{ cp.textContent="copy"; cp.classList.remove("is-done"); }, 1400); };
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done).catch(()=>fallbackCopy(text, done));
    } else { fallbackCopy(text, done); }
  }
});

listEl.addEventListener("keydown", e => {
  if((e.key === "Enter" || e.key === " ") && e.target.classList.contains("rl-tag")){
    e.preventDefault(); setCat(e.target.dataset.cat); window.scrollTo({top:0,behavior:"smooth"});
  }
});

qEl.addEventListener("input", () => {
  state.q = qEl.value;
  clearEl.style.display = state.q ? "block" : "none";
  render();
});
clearEl.addEventListener("click", () => { qEl.value=""; state.q=""; clearEl.style.display="none"; qEl.focus(); render(); });
sortEl.addEventListener("change", () => { state.sort = sortEl.value; render(); });

if(totalEl) totalEl.textContent = DATA.length;
buildChips();
render();
