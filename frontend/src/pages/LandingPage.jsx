import { useEffect, useState } from "react"

const WORDS = ["PDFs", "Reports", "Manuals", "Contracts", "Research Papers"]

export default function LandingPage({ onStart }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIndex(i => (i + 1) % WORDS.length)
        setVisible(true)
      }, 400)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={s.page}>

      {/* ── Navbar ── */}
      <nav style={s.nav}>
        <div style={s.navLogo}>
          <span style={s.logoIcon}>🧠</span>
          <span style={s.logoText}>DocuMind</span>
        </div>
        <div style={s.navLinks}>
          <span style={s.navLink}>How it works</span>
          <span style={s.navLink}>Features</span>
          <button style={s.navBtn} onClick={onStart}>Try it free →</button>
        </div>
      </nav>

      {/* ── Split Hero ── */}
      <section style={s.hero}>

        {/* Left side — text */}
        <div style={s.heroLeft}>
          <div style={s.badge}>🔍 RAG-Powered Document Intelligence</div>
          <h1 style={s.heroTitle}>
            Chat with your{" "}
            <span style={{
              ...s.animWord,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-10px)"
            }}>
              {WORDS[wordIndex]}
            </span>
          </h1>
          <p style={s.heroSub}>
            Upload any document and ask questions in plain English.
            DocuMind uses RAG (Retrieval-Augmented Generation) to find
            the exact answer from your document — not from the AI's memory.
          </p>
          <div style={s.heroBtns}>
            <button style={s.primaryBtn} onClick={onStart}>
              🚀 Upload your first document
            </button>
          </div>
          <div style={s.trustRow}>
            {["✅ No hallucinations", "✅ Source highlighted", "✅ Multi-document"].map((t, i) => (
              <span key={i} style={s.trustItem}>{t}</span>
            ))}
          </div>
        </div>

        {/* Right side — mock UI preview */}
        <div style={s.heroRight}>
          <div style={s.mockWindow}>
            <div style={s.mockBar}>
              <span style={{...s.mockDot, background:"#ff5f57"}}/>
              <span style={{...s.mockDot, background:"#febc2e"}}/>
              <span style={{...s.mockDot, background:"#28c840"}}/>
              <span style={s.mockTitle}>DocuMind — research_paper.pdf</span>
            </div>
            <div style={s.mockBody}>
              <div style={s.mockMsg}>
                <span style={s.mockRole}>You</span>
                <div style={s.mockUserBubble}>What is the main conclusion of this paper?</div>
              </div>
              <div style={s.mockMsg}>
                <span style={s.mockRole}>DocuMind</span>
                <div style={s.mockAiBubble}>
                  Based on section 4.2 of your document, the main conclusion is that transformer-based models outperform RNNs on long-range dependencies by a factor of 3.2×...
                </div>
              </div>
              <div style={s.mockSource}>
                <span style={s.mockSourceLabel}>📄 Source found in chunk 12 · Confidence: 94%</span>
              </div>
              <div style={s.mockInput}>
                <span style={s.mockPlaceholder}>Ask anything about your document...</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>How DocuMind works</h2>
        <div style={s.stepsRow}>
          {[
            { icon: "📤", num: "01", title: "Upload document", desc: "Upload any PDF or TXT file. DocuMind reads and chunks it into searchable pieces." },
            { icon: "🔍", num: "02", title: "Semantic search", desc: "Your question is converted to a vector and matched against the most relevant chunks." },
            { icon: "🤖", num: "03", title: "Grounded answer", desc: "AI answers ONLY from your document — with source reference and confidence score." },
          ].map((s2, i) => (
            <div key={i} style={s.stepCard}>
              <div style={s.stepIcon}>{s2.icon}</div>
              <div style={s.stepNum}>{s2.num}</div>
              <h3 style={s.stepTitle}>{s2.title}</h3>
              <p style={s.stepDesc}>{s2.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{...s.section, background:"#f1f5f9", padding:"60px 40px"}}>
        <h2 style={s.sectionTitle}>Why DocuMind?</h2>
        <div style={s.featGrid}>
          {[
            { icon: "🎯", title: "No hallucinations", desc: "AI only answers from your actual document, not from its training data." },
            { icon: "📊", title: "Confidence score", desc: "See how relevant the retrieved chunks are to your question." },
            { icon: "💬", title: "Chat history", desc: "Multi-turn conversation — ask follow-up questions naturally." },
            { icon: "📂", title: "Multi-document", desc: "Upload multiple docs and switch between them seamlessly." },
            { icon: "🔎", title: "Source highlight", desc: "See exactly which part of the document the answer came from." },
            { icon: "⚡", title: "Instant answers", desc: "Powered by Groq's ultra-fast LLaMA 3 inference engine." },
          ].map((f, i) => (
            <div key={i} style={s.featCard}>
              <span style={s.featIcon}>{f.icon}</span>
              <h4 style={s.featTitle}>{f.title}</h4>
              <p style={s.featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={s.cta}>
        <h2 style={s.ctaTitle}>Stop searching. Start asking.</h2>
        <p style={s.ctaSub}>Upload your document and get answers in seconds.</p>
        <button style={s.primaryBtn} onClick={onStart}>🚀 Get started — it's free</button>
      </section>

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <span>🧠 DocuMind — Built with React + FastAPI + ChromaDB + Groq</span>
        <span>RAG-powered document intelligence</span>
      </footer>
    </div>
  )
}

const s = {
  page: { minHeight: "100vh", background: "#ffffff" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 40px", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, background: "white", zIndex: 100 },
  navLogo: { display: "flex", alignItems: "center", gap: "8px" },
  logoIcon: { fontSize: "22px" },
  logoText: { fontSize: "20px", fontWeight: "700", color: "#1a202c" },
  navLinks: { display: "flex", alignItems: "center", gap: "28px" },
  navLink: { fontSize: "14px", color: "#64748b", cursor: "pointer" },
  navBtn: { padding: "8px 20px", background: "#1a202c", color: "white", borderRadius: "8px", fontSize: "14px", fontWeight: "600" },
  hero: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", padding: "80px 40px", maxWidth: "1200px", margin: "0 auto", alignItems: "center" },
  heroLeft: { display: "flex", flexDirection: "column", gap: "24px" },
  badge: { display: "inline-block", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "99px", padding: "6px 16px", fontSize: "13px", color: "#1d4ed8", width: "fit-content" },
  heroTitle: { fontSize: "48px", fontWeight: "800", lineHeight: "1.15", color: "#1a202c" },
  animWord: { color: "#2563eb", display: "inline-block", transition: "opacity 0.4s ease, transform 0.4s ease" },
  heroSub: { fontSize: "16px", color: "#64748b", lineHeight: "1.7" },
  heroBtns: { display: "flex", gap: "12px" },
  primaryBtn: { padding: "14px 28px", background: "#2563eb", color: "white", borderRadius: "10px", fontSize: "15px", fontWeight: "600" },
  trustRow: { display: "flex", gap: "16px", flexWrap: "wrap" },
  trustItem: { fontSize: "13px", color: "#64748b" },
  heroRight: { display: "flex", justifyContent: "center" },
  mockWindow: { background: "white", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", border: "1px solid #e2e8f0", width: "100%", maxWidth: "420px", overflow: "hidden" },
  mockBar: { background: "#f8fafc", padding: "12px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "6px" },
  mockDot: { width: "12px", height: "12px", borderRadius: "50%", display: "inline-block" },
  mockTitle: { fontSize: "12px", color: "#94a3b8", marginLeft: "8px" },
  mockBody: { padding: "20px", display: "flex", flexDirection: "column", gap: "16px" },
  mockMsg: { display: "flex", flexDirection: "column", gap: "6px" },
  mockRole: { fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase" },
  mockUserBubble: { background: "#2563eb", color: "white", padding: "10px 14px", borderRadius: "12px 12px 4px 12px", fontSize: "13px", alignSelf: "flex-end" },
  mockAiBubble: { background: "#f1f5f9", color: "#1a202c", padding: "10px 14px", borderRadius: "4px 12px 12px 12px", fontSize: "13px", lineHeight: "1.6" },
  mockSource: { background: "#eff6ff", borderRadius: "8px", padding: "8px 12px" },
  mockSourceLabel: { fontSize: "11px", color: "#2563eb" },
  mockInput: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px 14px" },
  mockPlaceholder: { fontSize: "13px", color: "#94a3b8" },
  section: { maxWidth: "1100px", margin: "0 auto", padding: "60px 40px" },
  sectionTitle: { fontSize: "28px", fontWeight: "700", textAlign: "center", marginBottom: "40px", color: "#1a202c" },
  stepsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" },
  stepCard: { background: "#f8fafc", borderRadius: "14px", padding: "28px", border: "1px solid #e2e8f0", textAlign: "center" },
  stepIcon: { fontSize: "32px", marginBottom: "12px" },
  stepNum: { fontSize: "11px", color: "#2563eb", fontWeight: "700", marginBottom: "8px", letterSpacing: "2px" },
  stepTitle: { fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "#1a202c" },
  stepDesc: { fontSize: "13px", color: "#64748b", lineHeight: "1.6" },
  featGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", maxWidth: "1100px", margin: "0 auto" },
  featCard: { background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #e2e8f0" },
  featIcon: { fontSize: "24px", marginBottom: "10px", display: "block" },
  featTitle: { fontSize: "15px", fontWeight: "600", marginBottom: "6px", color: "#1a202c" },
  featDesc: { fontSize: "13px", color: "#64748b", lineHeight: "1.5" },
  cta: { textAlign: "center", padding: "80px 40px", background: "#1a202c" },
  ctaTitle: { fontSize: "32px", fontWeight: "700", color: "white", marginBottom: "12px" },
  ctaSub: { color: "#94a3b8", marginBottom: "28px", fontSize: "15px" },
  footer: { display: "flex", justifyContent: "space-between", padding: "24px 40px", borderTop: "1px solid #e2e8f0", color: "#94a3b8", fontSize: "13px", flexWrap: "wrap", gap: "8px" },
}