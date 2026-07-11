import { VentureProfile } from "@/types";

export const VENTURES: Record<string, VentureProfile> = {
  nilvault: {
    id: "nilvault",
    name: "NILVault",
    tagline: "The universal NIL operating system — by Alvorant",
    sector: "College Sports / NIL Compliance & Fintech",
    stage: "Pre-Seed",
    ask: "$1.75M Pre-Seed (SAFE/priced round — confirm instrument with counsel)",
    useOfFunds:
      "Lean build to a live product with paying pilot schools; proof at month 9–12 unlocks a follow-on $5M seed at plan.",
    slideCount: 17,
    colorFrom: "from-indigo-950",
    colorTo: "to-slate-900",
    accent: "text-indigo-400",
    keyStats: [
      { label: "TAM", value: "$594M (defensible core $338M)" },
      { label: "SAM", value: "$406M" },
      { label: "SOM (36mo)", value: "$13M conservative → $45M aggressive" },
      { label: "University ACV", value: "$212K–$360K/yr" },
      { label: "Conference ACV", value: "$441K–$662K/yr" },
      { label: "D1 athletics budgets (the real wallet)", value: "$15–20B+" },
      { label: "NIL economy", value: "$2.5B (25/26) → $6B+ by 2030" },
      { label: "Take rate on athlete deals", value: "$0 — never takes a cut" },
    ],
    swot: {
      strengths: [
        "Neutral, no-cut model vs. deal-cut marketplaces (Opendorse, Playfly) — structural trust moat",
        "End-to-end workflow (contract → cap → payment → tax) no competitor covers fully",
        "Targets the $15-20B athletics operating budget, not the smaller athlete-money pool",
      ],
      weaknesses: [
        "Pre-product / pre-revenue — proof points are still ahead of the raise",
        "Long, multi-stakeholder university sales cycle (AD, GC, conference sign-off)",
        "Dependent on continued NIL/House settlement regulatory structure",
      ],
      opportunities: [
        "House v. NCAA settlement created a legally-mandated, continuously refreshing compliance need",
        "20+ adjacent paying constituencies (agencies, brands, accounting, media, licensing, data)",
        "High-school NIL expansion (45 states + DC) as a downstream expansion market",
      ],
      threats: [
        "NCAA/state NIL rules are still actively litigated and could shift the compliance model",
        "Incumbents (Opendorse, INFLCR, Teamworks, ARMS) have existing school relationships",
        "University procurement budget cycles can delay close timing regardless of product quality",
      ],
    },
    qaLibrary: [
      {
        keywords: ["regulat", "nil rule", "ncaa", "legal risk", "house settlement"],
        question: "How exposed are you to NIL regulatory/legal volatility?",
        answer:
          "NILVault is built as compliance infrastructure, not a rules engine tied to one policy snapshot — the platform ingests House v. NCAA cap rules, state NIL statutes, and conference agreements as configurable inputs. Regulatory change is actually a tailwind: every rule change increases the compliance burden schools must solve, which is the product's core value.",
      },
      {
        keywords: ["compet", "opendorse", "inflcr", "teamworks", "arms", "moat"],
        question: "What stops Opendorse/INFLCR/Teamworks from just building this?",
        answer:
          "Those platforms monetize by touching the deal (a cut or a per-deal fee), which structurally conflicts with being the neutral system of record schools and conferences need for audit-defensible compliance. NILVault's $0-cut model is a business-model moat, not just a feature — incumbents would have to cannibalize their own revenue to copy it.",
      },
      {
        keywords: ["revenue model", "pricing", "acv", "how do you make money"],
        question: "Walk me through the revenue model.",
        answer:
          "Universities pay a flat, value-based subscription ($150K base + usage, landing $212K–$360K/yr) — below the $250-500K in point tools it replaces. Conferences pay $441K–$662K/yr. Beyond institutions, 20+ paying constituencies (agencies, brands, accounting, media, licensing, data) plus a thin, capped per-receipt payment rail add layered revenue without taking a cut of athlete deals.",
      },
      {
        keywords: ["sales cycle", "school", "university", "close", "procurement"],
        question: "How long is the university sales cycle?",
        answer:
          "Multi-stakeholder (AD → GC → conference) and typically spans one budget cycle. The pre-seed is explicitly sized to fund pilot conversion through month 9-12, timed to the academic/athletics budget calendar rather than assuming enterprise-software close speed.",
      },
      {
        keywords: ["use of funds", "runway", "how much", "raise amount", "pre-seed"],
        question: "What does the $1.75M actually fund?",
        answer:
          "A lean build to a live product with paying pilot schools, proving the model with roughly 18-20 institutions before the $5M seed (already planned) is raised at proof around month 9-12. This is a capital-efficient, staged path rather than a single large upfront raise.",
      },
    ],
    complianceNote:
      "Institutional/education sales motion (not a consumer product) — standard Reg D 506(b)/(c) pre-seed considerations apply. No securities-specific claims found in the deck to flag, but confirm final SAFE/equity terms and any forward-looking TAM/SAM figures are appropriately hedged before external distribution.",
  },
  dentalpass: {
    id: "dentalpass",
    name: "DentalPass Pro",
    tagline: "The #1 Dental Membership Platform — Closing the $47B Uninsured Patient Revenue Gap",
    sector: "Vertical SaaS — Independent Dental Practices",
    stage: "Pre-Seed",
    ask: "Pre-Seed raise — target amount not stated in current deck (confirm with Eugene before sharing with investors)",
    useOfFunds:
      "Scale from 0 to 90,000+ active subscribing practices over 18 months per the phased GTM plan (Pioneer → Amplify → Scale → Dominate).",
    slideCount: 12,
    colorFrom: "from-teal-950",
    colorTo: "to-slate-900",
    accent: "text-teal-400",
    keyStats: [
      { label: "TAM", value: "$47B" },
      { label: "SAM", value: "$12B" },
      { label: "SOM", value: "$530M at 90,000 subscribers" },
      { label: "Projected ARR (Month 18)", value: "$52.9M" },
      { label: "Blended ARPU", value: "$531/yr" },
      { label: "Gross Margin", value: "84%" },
      { label: "CAC / Payback", value: "$120 / 2.7 months" },
      { label: "LTV : CAC", value: "13.3x" },
    ],
    swot: {
      strengths: [
        "Zero insurance-claim model — 100% collection rate, no denials",
        "Exceptional unit economics: 84% gross margin, 2.7-month CAC payback, 13.3x LTV:CAC",
        "60-second setup removes the #1 SaaS adoption friction for busy practice owners",
      ],
      weaknesses: [
        "Dental membership-plan category is not new — differentiation must be proven, not assumed",
        "\"Nationwide compliance engine\" and PMS integrations (Dentrix/Eaglesoft/Open Dental) are stated as built — verify actual integration status before claiming this to investors",
        "Revenue projections (90K subscribers by Month 18) are aggressive relative to typical vertical-SaaS ramp curves and should be stress-tested with a bear case",
      ],
      opportunities: [
        "Only 1 in 3 of 201,000 US dental practices currently offers any membership plan",
        "34% YoY category growth with no dominant national platform yet",
        "DSO and group-practice enterprise tier as a Phase 3+ expansion lever",
      ],
      threats: [
        "Low switching cost for practices means new entrants can copy the pricing model quickly",
        "Practice-management software incumbents (Dentrix, Eaglesoft, Open Dental) could bundle a competing membership feature",
        "State dental-practice-act rules do change — the compliance-engine claim creates ongoing maintenance obligation",
      ],
    },
    qaLibrary: [
      {
        keywords: ["compet", "differentiat", "moat", "why you"],
        question: "What's the differentiation in a crowded dental-SaaS market?",
        answer:
          "Speed and economics: a fully branded membership plan live in 60 seconds with zero insurance-claim overhead, 100% fee collection, and an 84% gross margin. Most competitors require setup fees, contracts, or partial insurance integration — DentalPass Pro removes all three friction points.",
      },
      {
        keywords: ["projection", "90,000", "growth", "aggressive", "realistic"],
        question: "How realistic is 90,000 subscribers by Month 18?",
        answer:
          "The phased model (500 → 2,000 → 30,000 → 60,000 → 90,000+) assumes a 4% monthly churn and a conservative 70/30 monthly-annual mix. We're happy to walk through the bear-case sensitivity model directly with you — ask for the downside scenario alongside the base case.",
      },
      {
        keywords: ["compliance", "50 state", "pms", "dentrix", "eaglesoft", "integration"],
        question: "Is the 50-state compliance engine and PMS integration actually live today?",
        answer:
          "The platform is architected for 50-state dental practice act compliance and an open API layer for Dentrix/Eaglesoft/Open Dental. For specific integration status (live vs. roadmap) per practice-management system, we'll connect you directly with the technical team for a live walkthrough before you finalize diligence.",
      },
      {
        keywords: ["cac", "ltv", "unit economics", "payback"],
        question: "What are the unit economics?",
        answer:
          "Blended ARPU of $531/yr, CAC of $120, a 2.7-month payback period, and a 13.3x LTV:CAC ratio assuming 3-year retention at 84% gross margin — well above typical SaaS benchmarks.",
      },
    ],
    complianceNote:
      "IMPORTANT GAP: the deck lists a 'Protected IP Address' (68.231.97.155) as an IP-protection claim on the cover and IP slide. An IP address is not intellectual property protection — recommend replacing this with actual trademark/patent/trade-secret language before this deck goes to any investor, to avoid a credibility red flag in diligence.",
  },
  midwestbudz: {
    id: "midwestbudz",
    name: "Midwest Budz LLC",
    tagline: "Vertically Integrated Hemp & Medical Marijuana Cultivation, Extraction & Processing Platform",
    sector: "Cannabis / Hemp — Pre-Revenue Build-to-Operate",
    stage: "Pre-Seed",
    ask: "$10.0M All-Equity Pre-Seed Raise",
    useOfFunds:
      "100% of the build: AZ licensing, ground-up 50,000 sq ft cultivation & extraction facility (3–6 month construction), and full equipment installation.",
    slideCount: 22,
    colorFrom: "from-emerald-950",
    colorTo: "to-slate-900",
    accent: "text-emerald-400",
    keyStats: [
      { label: "Total Raise", value: "$10.0M all-equity" },
      { label: "Year 1 → Year 5 Revenue", value: "$17.0M → $53.8M" },
      { label: "Base-Case IRR (5x EBITDA exit)", value: "127%" },
      { label: "Base-Case MOIC", value: "22.3x" },
      { label: "EBITDA Margin", value: "49% → 55%" },
      { label: "Break-even", value: "46% of Year-1 revenue (Month 3-4 of ops)" },
      { label: "Investor Payback", value: "~14 months from operational launch" },
      { label: "Capital Structure", value: "Zero debt, zero interest expense" },
    ],
    swot: {
      strengths: [
        "Clear, well-defined Arizona licensing & extraction framework",
        "Vertically integrated model by design across 5 revenue streams",
        "Facility site inside a permanently-extended Federal Opportunity Zone (OBBBA 2025)",
      ],
      weaknesses: [
        "Pre-revenue: no licenses, facility, or equipment exist today — fully dependent on this raise closing",
        "3–6 month build-out before any operations or revenue begin",
        "Cannabis banking limitations restrict standard debt financing and treasury operations",
      ],
      opportunities: [
        "Arizona cannabis market >$1B/yr; Southwest cultivators lack in-house extraction/testing capacity",
        "Concentrates ~18-22% of market share (up from 11.7% in 2019) at 75-85% gross margins",
        "Tribal land cultivation partnership pipeline in discussion",
      ],
      threats: [
        "Construction or licensing delays before any revenue begins",
        "Wholesale price compression as cultivation capacity expands regionally",
        "Federal/state regulatory change; cannabis remains federally a Schedule I position despite state legality",
      ],
    },
    qaLibrary: [
      {
        keywords: ["pre-revenue", "no revenue", "risk", "hasn't started"],
        question: "This is pre-revenue with no facility or license yet — why fund it now?",
        answer:
          "That's an accurate and disclosed characterization — this raise funds 100% of the build (licensing, 50,000 sq ft facility, equipment) over an estimated 3-6 month construction window. The financial model is CFO/Controller-audited with 14 documented findings and 5 institutional-grade statements added (Cash Flow, Balance Sheet, Break-Even, ROI/IRR, Sensitivity) specifically because it's pre-revenue — we wanted diligence-grade rigor before asking for capital, not after.",
      },
      {
        keywords: ["banking", "cannabis bank", "financial services"],
        question: "How do you handle cannabis banking restrictions?",
        answer:
          "The capital structure is 100% equity with zero debt and zero interest expense specifically to remove reliance on traditional lending, which is the primary point of friction for cannabis banking. Day-to-day banking will run through cannabis-compliant financial institutions already operating in Arizona.",
      },
      {
        keywords: ["opportunity zone", "oz", "tax", "qof"],
        question: "How does the Opportunity Zone benefit work for investors?",
        answer:
          "The facility site sits within a federally designated Opportunity Zone, permanently extended under the 2025 OBBBA. Qualifying investments via a Qualified Opportunity Fund structure get a rolling 5-year capital gains deferral, a 10% gain reduction if held 5+ years, and tax-free appreciation on the new investment if held 10+ years. Investors should confirm eligibility with their own tax advisor — we don't provide tax advice directly.",
      },
      {
        keywords: ["irr", "moic", "return", "exit"],
        question: "What's the return profile?",
        answer:
          "Base case (5x Year-5 EBITDA exit) projects a 127% IRR and 22.3x MOIC. Conservative (3x EBITDA) still projects 118% IRR / 16.3x MOIC, and payback of the full $10M is projected at ~14 months from operational launch via cumulative cash flow.",
      },
      {
        keywords: ["delay", "construction", "licensing timeline"],
        question: "What happens if construction or licensing is delayed?",
        answer:
          "Arizona's cultivation/extraction licensing pathway is well-established and well-precedented, and applications are filed immediately at funding close in parallel with build-out to compress the timeline. That said, delay is a disclosed risk in the deck's risk factors — the break-even cushion (46% of Year-1 revenue) provides some buffer against a slower ramp.",
      },
    ],
    complianceNote:
      "HIGHEST COMPLIANCE BAR OF THE THREE VENTURES: cannabis remains federally Schedule I. This must be run strictly as a Reg D 506(b) accredited-investor-only private placement with no general solicitation, state-by-state legal review before any investor in a given state is contacted, and explicit securities counsel sign-off before this agent goes live. Do not enable public/website-embedded chat for this venture without counsel approval.",
  },
};

export const VENTURE_LIST = Object.values(VENTURES);
