import { useState, useRef, useEffect } from "react"
import axios from "axios"

export default function ChatWindow({ doc }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [sources, setSources] = useState([])
  const [confidence, setConfidence] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    setMessages([])
    setSources([])
    setConfidence(null)
  }, [doc])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const question = input
    setInput("")
    const newMessages = [...messages, { role: "user", content: question }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        doc_id: doc.doc_id,
        question,
        chat_history: newMessages.slice(-6).map(m => ({
          role: m.role, content: m.content
        }))
      })
      setMessages([...newMessages, { role: "assistant", content: res.data.answer }])
      setSources(res.data.sources)
      setConfidence(res.data.confidence)
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.wrapper}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h2 style={s.headerTitle}>📄 {doc.filename.replace(/_/g, " ")}</h2>
          <p style={s.headerSub}>{doc.chunks} chunks indexed · RAG-powered answers</p>
        </div>
        {confidence !== null && (
          <div style={s.confidenceBadge}>
            <span style={s.confidenceLabel}>Confidence</span>
            <span style={{
              ...s.confidenceVal,
              color: confidence > 60 ? "#16a34a" : confidence > 30 ? "#d97706" : "#dc2626"
            }}>{confidence}%</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={s.messages}>
        {messages.length === 0 && (
          <div style={s.emptyState}>
            <span style={s.emptyIcon}>💬</span>
            <p style={s.emptyTitle}>Ask anything about this document</p>
            <p style={s.emptySub}>DocuMind will find the answer from your document only</p>
            <div style={s.suggestions}>
              {["What is the main topic?", "Summarise this document", "What are the key findings?"].map((q, i) => (
                <button key={i} style={s.suggestion} onClick={() => setInput(q)}>{q}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={msg.role === "user" ? s.userRow : s.aiRow}>
            <span style={s.roleLabel}>{msg.role === "user" ? "You" : "DocuMind"}</span>
            <div style={msg.role === "user" ? s.userBubble : s.aiBubble}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={s.aiRow}>
            <span style={s.roleLabel}>DocuMind</span>
            <div style={s.aiBubble}>⏳ Searching your document...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Sources */}
      {sources.length > 0 && (
        <div style={s.sourcesBox}>
          <p style={s.sourcesTitle}>📎 Source chunks used to generate this answer:</p>
          {sources.map((src, i) => (
            <div key={i} style={s.sourceChunk}>
              <span style={s.sourceNum}>Chunk {i + 1}</span>
              <p style={s.sourceText}>{src.substring(0, 200)}...</p>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={s.inputRow}>
        <input
          style={s.input}
          placeholder="Ask anything about your document..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button
          style={{ ...s.sendBtn, opacity: loading || !input.trim() ? 0.6 : 1 }}
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Send →
        </button>
      </div>
    </div>
  )
}

const s = {
  wrapper: { flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" },
  header: { padding: "20px 28px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "white" },
  headerTitle: { fontSize: "17px", fontWeight: "600", color: "#1a202c" },
  headerSub: { fontSize: "12px", color: "#94a3b8", marginTop: "2px" },
  confidenceBadge: { background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "8px 16px", textAlign: "center" },
  confidenceLabel: { fontSize: "11px", color: "#64748b", display: "block" },
  confidenceVal: { fontSize: "22px", fontWeight: "700" },
  messages: { flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: "20px", background: "#f8fafc" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "12px", textAlign: "center", padding: "40px" },
  emptyIcon: { fontSize: "48px" },
  emptyTitle: { fontSize: "18px", fontWeight: "600", color: "#1a202c" },
  emptySub: { fontSize: "14px", color: "#64748b" },
  suggestions: { display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px" },
  suggestion: { padding: "8px 16px", background: "white", border: "1px solid #e2e8f0", borderRadius: "20px", fontSize: "13px", cursor: "pointer", color: "#2563eb" },
  userRow: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" },
  aiRow: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" },
  roleLabel: { fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", paddingLeft: "4px" },
  userBubble: { background: "#2563eb", color: "white", padding: "12px 16px", borderRadius: "16px 16px 4px 16px", fontSize: "14px", maxWidth: "70%", lineHeight: "1.6" },
  aiBubble: { background: "white", color: "#1a202c", padding: "12px 16px", borderRadius: "4px 16px 16px 16px", fontSize: "14px", maxWidth: "80%", lineHeight: "1.6", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  sourcesBox: { background: "#fffbeb", borderTop: "1px solid #fde68a", padding: "16px 28px" },
  sourcesTitle: { fontSize: "12px", fontWeight: "600", color: "#92400e", marginBottom: "10px" },
  sourceChunk: { background: "white", border: "1px solid #fde68a", borderRadius: "8px", padding: "10px 14px", marginBottom: "8px" },
  sourceNum: { fontSize: "11px", fontWeight: "700", color: "#d97706", display: "block", marginBottom: "4px" },
  sourceText: { fontSize: "12px", color: "#64748b", lineHeight: "1.5" },
  inputRow: { padding: "16px 28px", borderTop: "1px solid #e2e8f0", display: "flex", gap: "12px", background: "white" },
  input: { flex: 1, padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", background: "#f8fafc" },
  sendBtn: { padding: "12px 24px", background: "#2563eb", color: "white", borderRadius: "10px", fontSize: "14px", fontWeight: "600", border: "none", cursor: "pointer" },
}