"use client";

import Image from "next/image";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Banknote, Bike, BookOpen, Boxes,
  BriefcaseBusiness, Building2, Check, ChevronDown, CircleDot, Cloud, Code2,
  Cpu, GraduationCap, Layers3, LockKeyhole, Menu, MessageSquareText, Network,
  Printer, Send, ShieldCheck, Sparkles, Workflow, X, type LucideIcon
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "motion/react";
import { FormEvent, useState } from "react";

const navigation = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Our work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "AI & training", href: "#academy" },
  { label: "About", href: "#about" }
];

type Product = {
  number: string; name: string; category: string; description: string;
  imagePosition: string; alt: string; icon: LucideIcon; features: string[];
  boundary: string; repo: string; accent: string;
};

const products: Product[] = [
  { number: "01", name: "mPay", category: "FINANCIAL & SERVICE PLATFORMS", description: "A customer-facing platform for mobile recharge and partner-led mobility services, built around traceable transaction workflows.", imagePosition: "0% 0%", alt: "Illustrative artwork of a financial application workspace", icon: Banknote, features: ["Mobile operator discovery and recharge journeys", "Wallet ledger, payment and withdrawal workflows", "Partner, vehicle and booking operations"], boundary: "Stored-value and payment activity requires the appropriate regulated structure, verified providers and production acceptance.", repo: "https://github.com/Manav326/mpay", accent: "product-blue" },
  { number: "02", name: "QuantaEdge Learning", category: "EDUCATION & INSTITUTIONAL TECHNOLOGY", description: "An education ecosystem connecting structured learning, student and parent experiences, assessment and institution-level operations.", imagePosition: "100% 0%", alt: "Illustrative artwork of an education and AI learning workspace", icon: BookOpen, features: ["Courses, chapters, lessons and practice", "Student, parent and institutional workspaces", "AI tutor and curriculum authoring foundations"], boundary: "Curriculum coverage, source verification and teacher-reviewed AI evaluation remain important release gates.", repo: "https://github.com/Manav326/QuantaEdge", accent: "product-violet" },
  { number: "03", name: "Lucky Bajaj Dealership", category: "DEALERSHIP & BUSINESS OPERATIONS", description: "A connected dealership operations suite spanning the public showroom, customer relationships, inventory, sales and workshop workflows.", imagePosition: "0% 100%", alt: "Illustrative artwork of a motorcycle dealership and operations workspace", icon: Bike, features: ["Showroom, vehicle inventory and customer CRM", "Test rides, bookings, handover and service", "Parts, expenses, reporting and staff operations"], boundary: "Live dealership acceptance, payment settlement, statutory tax documents and authorized OEM integrations are separate gates.", repo: "https://github.com/Manav326/BajajDealership", accent: "product-amber" },
  { number: "04", name: "SmartPrint", category: "CONNECTED SAAS & EDGE SOFTWARE", description: "A QR-initiated printing ecosystem connecting customer phones, independent print shops, a cloud control plane and local printer agents.", imagePosition: "100% 100%", alt: "Illustrative artwork of a connected QR printing and shop workspace", icon: Printer, features: ["QR-led customer and shop workflows", "Direct shop-Wi-Fi or cloud-assisted transfer", "Windows print agent, approval and job tracking"], boundary: "LAN transfer still needs cloud coordination; physical printer compatibility and live device/network acceptance are ongoing work.", repo: "https://github.com/Manav326/QRtoPrint", accent: "product-cyan" }
];

const capabilities: { icon: LucideIcon; title: string; description: string; tags: string[] }[] = [
  { icon: ShieldCheck, title: "Critical & financial systems", description: "Transaction-heavy applications where correctness, traceability and controlled state changes matter.", tags: ["Financial workflows", "Payment integrations", "Audit trails", "Reconciliation"] },
  { icon: Workflow, title: "Custom business platforms", description: "Software that fits the way an organisation actually operates, from a single team to multi-location workflows.", tags: ["ERP & CRM", "SaaS platforms", "Inventory", "Operations"] },
  { icon: Sparkles, title: "AI & intelligent automation", description: "Useful AI built around business context, measurable tasks, human review and responsible deployment.", tags: ["LLM applications", "RAG systems", "AI agents", "Document workflows"] },
  { icon: Boxes, title: "Connected applications", description: "Coherent digital experiences across web, mobile, desktop, devices and the services that connect them.", tags: ["Web & mobile", "Desktop software", "APIs", "Cloud & edge"] }
];

type ArchitectureKey = "mpay" | "learning" | "dealership" | "smartprint";
const architecture: Record<ArchitectureKey, { label: string; icon: LucideIcon; context: string; steps: [string, string, string]; detail: string }> = {
  mpay: { label: "Financial flows", icon: Banknote, context: "Keep customer value, provider activity and service fulfilment distinct and traceable.", steps: ["Customer intent", "Authoritative transaction", "Provider outcome & reconciliation"], detail: "A transaction is more than a success screen. It needs a durable state, a unique reference and a safe path for pending or uncertain outcomes." },
  learning: { label: "Learning systems", icon: GraduationCap, context: "Connect curriculum structure, learner context, practice and human-reviewed outcomes.", steps: ["Curriculum & learner", "Learning experience", "Practice, feedback & progress"], detail: "Learning content and AI assistance must stay grounded in the right course, learner and verified source material." },
  dealership: { label: "Business operations", icon: Building2, context: "Bring customers, physical inventory and teams into one consistent operational picture.", steps: ["Customer & vehicle", "Connected workflows", "Service, handover & reports"], detail: "A customer request should flow into the staff process, the real inventory record and the history that the business relies on." },
  smartprint: { label: "Cloud + edge", icon: Printer, context: "Coordinate a cloud-managed job while keeping local document transfer and printing close to the shop.", steps: ["Customer phone & QR", "Cloud-coordinated job", "Shop agent & printer"], detail: "The experience has to remain understandable through upload, shop review, payment confirmation, dispatch and output confirmation." }
};

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.14 }} transition={{ duration: 0.68, delay, ease: [0.2, 0.72, 0.2, 1] }}>{children}</motion.div>;
}

function Brand() {
  return <a className="brand-lockup" href="#top" aria-label="QuantaEdge home"><span className="brand-mark" aria-hidden="true">Q<span>E</span></span><span className="brand-wordmark">QUANTAEDGE<span>SOFTWARE ENGINEERING & AI</span></span></a>;
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="section-heading"><p className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</p><h2>{title}</h2>{description ? <p className="section-lead">{description}</p> : null}</div>;
}

function ArchitectureExplorer() {
  const [active, setActive] = useState<ArchitectureKey>("mpay");
  const current = architecture[active];
  const CurrentIcon = current.icon;
  return <div className="architecture-panel">
    <div className="architecture-topline"><div><span className="live-indicator" /> INTERACTIVE SYSTEM MAP</div><span className="architecture-topline-note">Explore a workflow</span></div>
    <div className="architecture-tabs" role="tablist" aria-label="Explore product engineering workflows">
      {(Object.keys(architecture) as ArchitectureKey[]).map((key) => { const Icon = architecture[key].icon; return <button key={key} role="tab" aria-selected={active === key} className={"architecture-tab " + (active === key ? "is-active" : "")} onClick={() => setActive(key)}><Icon size={16} strokeWidth={1.8} /><span>{architecture[key].label}</span></button>; })}
    </div>
    <AnimatePresence mode="wait"><motion.div key={active} className="architecture-content" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .28 }}>
      <div className="architecture-intro"><span className="architecture-icon"><CurrentIcon size={22} /></span><div><p className="architecture-overline">ENGINEERING THE WHOLE JOURNEY</p><h3>{current.label}</h3><p>{current.context}</p></div></div>
      <div className="flow-diagram" aria-label={"Workflow: " + current.steps.join(", then ")}>
        {current.steps.map((step, index) => <div className="flow-step-wrap" key={step}><div className={"flow-step " + (index === 1 ? "flow-step-primary" : "")}><span className="flow-step-index">0{index + 1}</span><span>{step}</span></div>{index < 2 ? <div className="flow-connector"><span /><ArrowRight size={15} /></div> : null}</div>)}
      </div>
      <p className="architecture-detail">{current.detail}</p>
    </motion.div></AnimatePresence>
    <div className="architecture-foot"><span>Conceptual workflow view</span><span>Not a live production dashboard</span></div>
  </div>;
}

function ProjectEnquiry({ interest, setInterest }: { interest: string; setInterest: (value: string) => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const [preparedBrief, setPreparedBrief] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus(null); setCopied(false);
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    const fallback = [
      "QUANTAEDGE PROJECT ENQUIRY", "Name: " + String(payload.name || ""),
      "Email: " + String(payload.email || ""), "Organisation: " + String(payload.organisation || "Not provided"),
      "Phone: " + String(payload.phone || "Not provided"), "Interest: " + String(payload.interest || interest),
      "Budget: " + String(payload.budget || "Not specified"), "Timeline: " + String(payload.timeline || "Not specified"),
      "", "Project brief:", String(payload.message || "")
    ].join("\n");
    setSubmitting(true);
    try {
      const response = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) { setPreparedBrief(fallback); setStatus({ kind: "error", message: result.error || "We could not deliver your enquiry. Your details have not been sent." }); return; }
      form.reset(); setInterest("Custom software development");
      setStatus({ kind: "success", message: "Your enquiry has been sent. Thank you — the QuantaEdge team will review it." });
    } catch {
      setPreparedBrief(fallback); setStatus({ kind: "error", message: "We could not reach the enquiry service. Your details have not been sent." });
    } finally { setSubmitting(false); }
  }

  async function copyBrief() {
    try { await navigator.clipboard.writeText(preparedBrief); setCopied(true); }
    catch { setStatus({ kind: "error", message: "Clipboard access is unavailable in this browser. Please select and copy the brief manually." }); }
  }

  return <div className="contact-grid">
    <div className="contact-copy">
      <p className="eyebrow"><span className="eyebrow-dot" /> START A CONVERSATION</p>
      <h3>Bring us the problem. <span>Let’s engineer the solution.</span></h3>
      <p>Tell us what you are trying to build or improve. We will use the context to prepare a focused first discussion — not a generic sales pitch.</p>
      <div className="contact-points">
        <div><span><MessageSquareText size={18} /></span><p><strong>Start with the problem</strong><small>Share the workflow, challenge or idea behind your project.</small></p></div>
        <div><span><Layers3 size={18} /></span><p><strong>Scope before estimates</strong><small>We clarify users, integrations, risks and delivery boundaries.</small></p></div>
        <div><span><ShieldCheck size={18} /></span><p><strong>No false promises</strong><small>We explain what is practical, what it takes and what remains uncertain.</small></p></div>
      </div>
      <p className="contact-privacy">Your enquiry is sent only when the company inbox is configured for this deployment. See our <a href="/privacy">privacy notice</a>.</p>
    </div>
    <form className="enquiry-form" onSubmit={handleSubmit}>
      <div className="form-top"><div><p className="form-kicker">PROJECT ENQUIRY</p><h3>Tell us what you have in mind.</h3></div><span className="form-index">01 / 01</span></div>
      <div className="form-grid">
        <label className="field"><span>Your name <b>*</b></span><input name="name" autoComplete="name" placeholder="How should we address you?" maxLength={100} required /></label>
        <label className="field"><span>Work email <b>*</b></span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" maxLength={254} required /></label>
        <label className="field"><span>Organisation</span><input name="organisation" autoComplete="organization" placeholder="Company or institution" maxLength={120} /></label>
        <label className="field"><span>Phone <small>OPTIONAL</small></span><input name="phone" type="tel" autoComplete="tel" placeholder="+91 …" maxLength={32} /></label>
        <label className="field field-full"><span>What would you like to explore? <b>*</b></span><div className="select-wrap"><select name="interest" value={interest} onChange={(event) => setInterest(event.target.value)}>
          <option>Custom software development</option><option>Financial or transaction systems</option><option>Business automation / ERP / CRM</option><option>AI solutions and automation</option><option>Web or mobile application</option><option>Cloud, desktop or connected devices</option><option>AI and technology training</option><option>Careers, internship or collaboration</option><option>Other technology requirement</option>
        </select><ChevronDown size={16} /></div></label>
        <label className="field"><span>Indicative budget <small>OPTIONAL</small></span><div className="select-wrap"><select name="budget" defaultValue=""><option value="">Not decided yet</option><option>Below ₹1 lakh</option><option>₹1–5 lakh</option><option>₹5–15 lakh</option><option>₹15–30 lakh</option><option>₹30 lakh+</option><option>Prefer to discuss</option></select><ChevronDown size={16} /></div></label>
        <label className="field"><span>Expected timeline <small>OPTIONAL</small></span><div className="select-wrap"><select name="timeline" defaultValue=""><option value="">Not decided yet</option><option>Within 1 month</option><option>1–3 months</option><option>3–6 months</option><option>6+ months</option><option>Exploring options</option></select><ChevronDown size={16} /></div></label>
        <label className="field field-full"><span>Tell us about the problem or idea <b>*</b></span><textarea name="message" rows={5} minLength={20} maxLength={4000} placeholder="What happens today? What should the software make easier, safer or faster?" required /></label>
        <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="form-bottom"><p>Fields marked * are required. Please do not include passwords, payment credentials or sensitive personal data.</p><button className="button button-primary form-submit" type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send project enquiry"}<Send size={16} /></button></div>
      <AnimatePresence initial={false}>{status ? <motion.div className={"form-status " + status.kind} initial={{ opacity: 0, height: 0, y: 8 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0 }} role="status" aria-live="polite"><p>{status.message}</p>{status.kind === "error" && preparedBrief ? <button type="button" className="copy-brief" onClick={copyBrief}>{copied ? <Check size={15} /> : <ArrowRight size={15} />}{copied ? "Brief copied" : "Copy your project brief"}</button> : null}</motion.div> : null}</AnimatePresence>
    </form>
  </div>;
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [preferredInterest, setPreferredInterest] = useState("Custom software development");
  const { scrollYProgress } = useScroll();
  function openCareers() { setPreferredInterest("Careers, internship or collaboration"); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" }); }

  return <>
    <motion.div className="reading-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="container nav-container">
      <Brand />
      <nav id="main-navigation" className={"main-nav " + (mobileMenuOpen ? "nav-open" : "")} aria-label="Main navigation">
        {navigation.map((item) => <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>{item.label}</a>)}
        <a className="nav-mobile-cta" href="#contact" onClick={() => setMobileMenuOpen(false)}>Start a project <ArrowUpRight size={15} /></a>
      </nav>
      <a className="button button-dark nav-cta" href="#contact">Start a project <ArrowUpRight size={15} /></a>
      <button className="mobile-menu-button" onClick={() => setMobileMenuOpen((value) => !value)} aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileMenuOpen} aria-controls="main-navigation">{mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}</button>
    </div></header>

    <main id="main">
      <section className="hero-section" id="top"><div className="hero-grid-bg" aria-hidden="true" /><div className="container hero-layout">
        <div className="hero-copy">
          <motion.p className="eyebrow hero-eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}><span className="eyebrow-dot" /> SOFTWARE ENGINEERING · AI · DIGITAL SYSTEMS</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .72, delay: .08 }}>Engineering <span>that matters.</span></motion.h1>
          <motion.p className="hero-lead" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .72, delay: .17 }}>We turn complex problems into thoughtful software — from financial workflows and business platforms to intelligent everyday services.</motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .25 }}><a href="#contact" className="button button-primary">Discuss your project <ArrowUpRight size={17} /></a><a href="#work" className="button button-ghost-light">Explore our work <ArrowDownRight size={17} /></a></motion.div>
          <motion.div className="hero-proof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6, duration: .7 }}><div className="proof-avatars" aria-hidden="true"><span>QE</span><span>AI</span><span>SW</span></div><p><strong>Product-minded engineering</strong><small>Built around real workflows, not technology for its own sake.</small></p></motion.div>
        </div>
        <motion.div className="hero-visual" initial={{ opacity: 0, scale: .96, rotateY: -5 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: 1, delay: .14, ease: [.2, .7, .2, 1] }}>
          <div className="hero-art-frame"><Image src="/images/hero-network.svg" alt="QuantaEdge concept artwork showing finance, learning, mobility and printing systems connected through a digital network" fill priority sizes="(max-width: 900px) 100vw, 58vw" className="hero-art" /><div className="hero-art-vignette" /><div className="hero-art-label"><span className="live-indicator" /> ONE CONNECTED ENGINEERING MINDSET</div><div className="hero-float-card hero-float-top"><span className="float-icon"><Network size={17} /></span><span><strong>Connected systems</strong><small>Designed as one experience</small></span><span className="float-check"><Check size={13} /></span></div><div className="hero-float-card hero-float-bottom"><span className="float-icon"><Cpu size={17} /></span><span><strong>Built for real work</strong><small>Product · Platform · People</small></span></div><div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" /></div>
          <div className="hero-visual-caption"><span>FIG. 01 / DIGITAL ECOSYSTEM</span><span>FINANCE · LEARNING · MOBILITY · PRINT</span></div>
        </motion.div>
      </div><div className="container hero-bottomline"><span>BETTER SOFTWARE. BETTER BUSINESSES. A BETTER EVERYDAY.</span><a href="#capabilities">Discover what we engineer <ArrowDownRight size={14} /></a></div></section>

      <section className="intro-band"><div className="container intro-band-inner"><p className="eyebrow">OUR POINT OF VIEW</p><p className="intro-statement">Technology should make life <span>work better.</span> For a large institution, a growing company and the everyday business alike.</p><span className="intro-mark" aria-hidden="true">Q<span>E</span></span></div></section>

      <section className="section section-capabilities" id="capabilities"><div className="container"><Reveal><SectionHeading eyebrow="WHAT WE ENGINEER" title="Complex problems. Clear solutions." description="We bring product thinking, software engineering and practical AI together to build systems that fit the work they are meant to improve." /></Reveal>
        <div className="capability-grid">{capabilities.map((item, index) => { const Icon = item.icon; return <Reveal key={item.title} delay={index * .07}><motion.article className="capability-card" whileHover={{ y: -5, transition: { duration: .22 } }}><div className="capability-icon"><Icon size={23} strokeWidth={1.7} /></div><div className="capability-number">0{index + 1}</div><h3>{item.title}</h3><p>{item.description}</p><div className="tag-list">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><span className="card-corner"><ArrowUpRight size={15} /></span></motion.article></Reveal>; })}</div>
      </div></section>

      <section className="section section-work" id="work"><div className="container"><Reveal><div className="work-heading-row"><SectionHeading eyebrow="OUR PRODUCT WORK" title="Built around real-world problems." description="Our own products are where we test ideas, work through constraints and build end-to-end systems. Each is at a different stage of development." /><a className="text-link work-github-link" href="https://github.com/Manav326" target="_blank" rel="noreferrer">Explore our engineering on GitHub <ArrowUpRight size={15} /></a></div></Reveal>
        <div className="product-grid">{products.map((product, index) => { const Icon = product.icon; return <Reveal key={product.name} delay={(index % 2) * .08}><motion.article className={"product-card " + product.accent} whileHover={{ y: -5, transition: { duration: .24 } }}><div className="product-image-wrap" role="img" aria-label={product.alt} style={{ backgroundImage: "url(/images/product-atlas.svg)", backgroundSize: "200% 200%", backgroundPosition: product.imagePosition }}><span className="product-number">{product.number}</span><span className="product-illustration-label">CONCEPT ARTWORK</span><span className="product-image-icon"><Icon size={20} /></span></div><div className="product-content"><p className="product-category">{product.category}</p><div className="product-title-row"><h3>{product.name}</h3><span className="product-status"><span /> PRODUCT CASE STUDY</span></div><p className="product-description">{product.description}</p><ul className="product-features">{product.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul><div className="product-boundary"><ShieldCheck size={15} /><span>{product.boundary}</span></div><a className="product-link" href={product.repo} target="_blank" rel="noreferrer">Explore repository <ArrowUpRight size={16} /></a></div></motion.article></Reveal>; })}</div>
        <p className="work-disclaimer">The product visuals are original concept illustrations, not application screenshots. Feature descriptions reflect repository-level implementation and known release boundaries; they do not imply production certification or customer deployment.</p>
      </div></section>

      <section className="section section-architecture" id="approach"><div className="container architecture-layout">
        <Reveal className="architecture-copy"><p className="eyebrow"><span className="eyebrow-dot" /> HOW WE THINK</p><h2>We engineer the <span>whole system,</span> not just the screen.</h2><p className="section-lead">A useful interface is only one part of a dependable product. We think through the data, permissions, integrations, operational states and the people who rely on it.</p><div className="principle-list"><div><span><LockKeyhole size={17} /></span><p><strong>Clear ownership & access</strong><small>Users, data and permissions have defined boundaries.</small></p></div><div><span><CircleDot size={17} /></span><p><strong>Traceable workflows</strong><small>Important actions have states, references and history.</small></p></div><div><span><Cloud size={17} /></span><p><strong>Designed for operations</strong><small>Cloud, devices and people work together predictably.</small></p></div></div></Reveal>
        <Reveal delay={.12}><ArchitectureExplorer /></Reveal>
      </div></section>

      <section className="section section-process"><div className="container"><Reveal><SectionHeading eyebrow="THE ENGINEERING PROCESS" title="A clear path from problem to product." description="A practical process gives every project a shared direction, visible decisions and a better chance of delivering the right outcome." /></Reveal>
        <div className="process-grid">{[{n:"01",title:"Understand",text:"Map the problem, users, constraints and the outcome that matters.",icon:MessageSquareText},{n:"02",title:"Design",text:"Define workflows, architecture, scope and a coherent user experience.",icon:Layers3},{n:"03",title:"Build",text:"Develop in reviewable increments, with integrations and data boundaries in mind.",icon:Code2},{n:"04",title:"Validate",text:"Test real workflows, failure paths, accessibility and operational readiness.",icon:ShieldCheck},{n:"05",title:"Improve",text:"Deploy deliberately, observe the system and refine with real feedback.",icon:ArrowUpRight}].map((step,index)=>{const Icon=step.icon;return <Reveal key={step.n} delay={index*.05}><div className="process-step"><div className="process-step-top"><span>{step.n}</span><Icon size={19}/></div><h3>{step.title}</h3><p>{step.text}</p></div></Reveal>;})}</div>
      </div></section>

      <section className="section section-technology"><div className="container technology-layout"><Reveal><div><p className="eyebrow"><span className="eyebrow-dot"/> ENGINEERING FOUNDATIONS</p><h2>Modern technology. <span>Sound engineering.</span></h2><p className="section-lead">We choose tools for the problem, the operating environment and the team that will maintain the product — not for a technology checklist.</p><a href="#contact" className="text-link">Discuss your technology needs <ArrowRight size={15}/></a></div></Reveal>
        <Reveal delay={.12}><div className="technology-card-grid"><div className="technology-card"><Code2 size={20}/><strong>Modern application stacks</strong><span>Web · Mobile · Desktop · APIs</span></div><div className="technology-card"><Layers3 size={20}/><strong>Data & platform foundations</strong><span>Data modelling · Databases · Cloud</span></div><div className="technology-card"><Cpu size={20}/><strong>Applied AI systems</strong><span>LLMs · Retrieval · Agents · Evaluation</span></div><div className="technology-card"><Network size={20}/><strong>Connected infrastructure</strong><span>Integrations · Edge · Devices · Events</span></div><div className="technology-card"><ShieldCheck size={20}/><strong>Quality & security practices</strong><span>Testing · Access control · Auditability</span></div><div className="technology-card"><CircleDot size={20}/><strong>Performance & experience</strong><span>Responsive UX · Observability · Optimization</span></div></div></Reveal>
      </div></section>

      <section className="section section-academy" id="academy"><div className="container academy-layout"><Reveal className="academy-copy"><p className="eyebrow"><span className="eyebrow-dot"/> LEARN · BUILD · APPLY</p><h2>Make AI useful. <span>Build capability that lasts.</span></h2><p className="section-lead">Technology moves quickly. People and organisations need more than tool demonstrations — they need understanding, practice and the confidence to apply what they learn.</p><a href="#contact" className="button button-primary" onClick={()=>setPreferredInterest("AI and technology training")}>Discuss a training programme <ArrowUpRight size={16}/></a><p className="academy-note">Programmes are designed for professional, institutional and learner cohorts. Curriculum and delivery format are scoped with each organisation.</p></Reveal>
        <Reveal delay={.12}><div className="academy-programs">{[{n:"01",title:"AI foundations",text:"Understand AI, machine learning, generative AI and responsible use.",icon:Sparkles,level:"FOUNDATION"},{n:"02",title:"Generative AI at work",text:"Apply prompting, research, document workflows and practical automation.",icon:BriefcaseBusiness,level:"PRACTICAL"},{n:"03",title:"Applied AI engineering",text:"Build with Python, APIs, LLMs, retrieval, agents and evaluation.",icon:Code2,level:"TECHNICAL"},{n:"04",title:"Institutional capacity building",text:"Prepare faculty, teams and organisations to adopt technology with confidence.",icon:GraduationCap,level:"ORGANISATIONAL"}].map((program)=>{const Icon=program.icon;return <div className="academy-program" key={program.n}><span className="academy-program-number">{program.n}</span><span className="academy-program-icon"><Icon size={19}/></span><div><p>{program.level}</p><h3>{program.title}</h3><span>{program.text}</span></div><ArrowUpRight className="academy-program-arrow" size={17}/></div>;})}<div className="academy-method"><span>LEARNING MODEL</span><div><strong>Learn</strong><ArrowRight size={14}/><strong>Practise</strong><ArrowRight size={14}/><strong>Build</strong><ArrowRight size={14}/><strong>Apply</strong></div></div></div></Reveal>
      </div></section>

      <section className="section section-about" id="about"><div className="container about-layout"><Reveal><div className="founder-art"><div className="founder-art-grid"/><div className="founder-monogram">QE<span>.</span></div><p>BUILD WITH PURPOSE<br/>ENGINEER WITH CARE</p><div className="founder-coordinate">A PEOPLE-FIRST ENGINEERING MINDSET</div></div></Reveal>
        <Reveal delay={.12}><div className="about-copy"><p className="eyebrow"><span className="eyebrow-dot"/> THE PEOPLE BEHIND THE WORK</p><h2>Ambition grounded in <span>purpose.</span></h2><p className="about-lead">We believe technology should make life better, not more complicated. Our work starts by listening carefully, understanding the real constraint and choosing an approach that can stand up to everyday use.</p><div className="founder-profile"><div className="founder-initials">MG</div><div><h3>Manavjeet Gupta</h3><p>Founder · QuantaEdge</p><div className="founder-credentials"><span>B.Tech, Computer Science & Engineering · IIT Patna</span><span>Jawahar Navodaya Vidyalaya · Classes VI–XII</span></div></div></div><div className="team-note"><GraduationCap size={18}/><p>Our engineering team brings together graduates from IITs, NITs and other leading institutions, with a shared focus on practical problem-solving and thoughtful software development.</p></div></div></Reveal>
      </div></section>

      <section className="careers-strip"><div className="container careers-inner"><div><p className="eyebrow"><span className="eyebrow-dot"/> BUILD WITH US</p><h2>Curious minds. <span>Meaningful engineering.</span></h2><p>We welcome conversations with engineers, designers, researchers and learners who care about solving real problems.</p></div><button className="button button-outline-light" onClick={openCareers}>Connect with our team <ArrowUpRight size={16}/></button></div></section>
      <section className="section section-contact" id="contact"><div className="container"><Reveal><SectionHeading eyebrow="LET’S BUILD SOMETHING MEANINGFUL" title="Your next important idea starts with a conversation." description="Tell us what you want to change, improve or create. We will help you explore the right next step."/></Reveal><Reveal delay={.1}><ProjectEnquiry interest={preferredInterest} setInterest={setPreferredInterest}/></Reveal></div></section>
    </main>
    <footer className="site-footer"><div className="container"><div className="footer-top"><div className="footer-brand"><Brand/><p>Better software. Better businesses.<br/>A better everyday.</p></div><div className="footer-links"><div><strong>Explore</strong><a href="#capabilities">Capabilities</a><a href="#work">Our work</a><a href="#approach">Our approach</a><a href="#academy">AI & training</a></div><div><strong>Company</strong><a href="#about">About QuantaEdge</a><a href="#contact">Project enquiry</a><a href="#contact" onClick={openCareers}>Careers & collaboration</a><a href="/privacy">Privacy notice</a></div><div><strong>Products</strong>{products.map((product)=><a key={product.name} href={product.repo} target="_blank" rel="noreferrer">{product.name} <ArrowUpRight size={12}/></a>)}{process.env.NEXT_PUBLIC_CONTACT_EMAIL?<a href={"mailto:"+process.env.NEXT_PUBLIC_CONTACT_EMAIL}>Email QuantaEdge <ArrowUpRight size={12}/></a>:null}</div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} QuantaEdge. All rights reserved.</span><span>ENGINEERED WITH INTENTION <span className="footer-dot">·</span> BUILT FOR THE REAL WORLD</span><a href="#top">Back to top ↑</a></div></div></footer>
  </>;
}
