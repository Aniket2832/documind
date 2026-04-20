export default function Sidebar({ documents, activeDoc, onSelect, onDelete, onUploadNew }) {
  return (
    <div style={s.sidebar}>
      <div style={s.sidebarHeader}>
        <span style={s.sidebarTitle}>🧠 DocuMind</span>
        <button style={s.uploadBtn} onClick={onUploadNew}>+ New</button>
      </div>

      <p style={s.sidebarLabel}>YOUR DOCUMENTS</p>

      {documents.length === 0 && (
        <p style={s.emptyText}>No documents yet. Upload your first one!</p>
      )}

      {documents.map((doc, i) => (
        <div
          key={i}
          style={{
            ...s.docItem,
            background: activeDoc?.doc_id === doc.doc_id ? "#eff6ff" : "transparent",
            borderColor: activeDoc?.doc_id === doc.doc_id ? "#bfdbfe" : "transparent",
          }}
          onClick={() => onSelect(doc)}
        >
          <div style={s.docInfo}>
            <span style={s.docIcon}>📄</span>
            <div>
              <p style={s.docName}>{doc.filename.replace(/_/g, " ")}</p>
              <p style={s.docChunks}>{doc.chunks} chunks indexed</p>
            </div>
          </div>
          <button
            style={s.deleteBtn}
            onClick={e => { e.stopPropagation(); onDelete(doc.doc_id) }}
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  )
}

const s = {
  sidebar: { width: "260px", minHeight: "100vh", background: "#f8fafc", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", padding: "20px 16px", gap: "8px", flexShrink: 0 },
  sidebarHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  sidebarTitle: { fontSize: "18px", fontWeight: "700", color: "#1a202c" },
  uploadBtn: { padding: "6px 14px", background: "#2563eb", color: "white", borderRadius: "8px", fontSize: "13px", fontWeight: "600", border: "none", cursor: "pointer" },
  sidebarLabel: { fontSize: "10px", fontWeight: "700", color: "#94a3b8", letterSpacing: "1.5px", marginBottom: "8px", paddingLeft: "4px" },
  emptyText: { fontSize: "13px", color: "#94a3b8", padding: "12px 4px", lineHeight: "1.5" },
  docItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 10px", borderRadius: "10px", border: "1px solid transparent", cursor: "pointer", transition: "all 0.15s" },
  docInfo: { display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 },
  docIcon: { fontSize: "20px", flexShrink: 0 },
  docName: { fontSize: "13px", fontWeight: "500", color: "#1a202c", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "140px" },
  docChunks: { fontSize: "11px", color: "#94a3b8", marginTop: "2px" },
  deleteBtn: { background: "transparent", border: "none", cursor: "pointer", fontSize: "14px", padding: "4px", flexShrink: 0 },
}