import { useState } from "react"
import axios from "axios"

export default function UploadModal({ onClose, onUploaded }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError("")
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await axios.post("http://localhost:8000/upload", formData)
      onUploaded(res.data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <h2 style={s.modalTitle}>Upload Document</h2>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div
          style={s.dropzone}
          onClick={() => document.getElementById("fileInput").click()}
        >
          <span style={s.dropIcon}>📤</span>
          <p style={s.dropText}>
            {file ? file.name : "Click to select a PDF or TXT file"}
          </p>
          <p style={s.dropSub}>Supports PDF and TXT files</p>
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.txt"
            style={{ display: "none" }}
            onChange={e => setFile(e.target.files[0])}
          />
        </div>

        {error && <p style={s.error}>{error}</p>}

        <div style={s.modalFooter}>
          <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            style={{ ...s.uploadBtn, opacity: loading || !file ? 0.7 : 1 }}
            onClick={handleUpload}
            disabled={loading || !file}
          >
            {loading ? "⏳ Processing..." : "🚀 Upload & Index"}
          </button>
        </div>
      </div>
    </div>
  )
}

const s = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "white", borderRadius: "16px", padding: "28px", width: "440px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  modalTitle: { fontSize: "20px", fontWeight: "700", color: "#1a202c" },
  closeBtn: { background: "transparent", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" },
  dropzone: { border: "2px dashed #cbd5e1", borderRadius: "12px", padding: "40px 20px", textAlign: "center", cursor: "pointer", marginBottom: "20px", transition: "border-color 0.2s" },
  dropIcon: { fontSize: "36px", display: "block", marginBottom: "12px" },
  dropText: { fontSize: "15px", fontWeight: "500", color: "#1a202c", marginBottom: "6px" },
  dropSub: { fontSize: "13px", color: "#94a3b8" },
  error: { color: "#ef4444", fontSize: "13px", marginBottom: "16px" },
  modalFooter: { display: "flex", gap: "12px", justifyContent: "flex-end" },
  cancelBtn: { padding: "10px 20px", background: "transparent", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", cursor: "pointer", color: "#64748b" },
  uploadBtn: { padding: "10px 24px", background: "#2563eb", color: "white", borderRadius: "8px", fontSize: "14px", fontWeight: "600", border: "none", cursor: "pointer" },
}