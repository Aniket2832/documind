import { useState, useEffect } from "react"
import axios from "axios"
import LandingPage from "./pages/LandingPage"
import Sidebar from "./components/Sidebar"
import ChatWindow from "./components/ChatWindow"
import UploadModal from "./components/UploadModal"

export default function App() {
  const [page, setPage] = useState("landing")
  const [documents, setDocuments] = useState([])
  const [activeDoc, setActiveDoc] = useState(null)
  const [showUpload, setShowUpload] = useState(false)

  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://localhost:8000/documents")
      setDocuments(res.data.documents)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (page === "app") fetchDocuments()
  }, [page])

  const handleUploaded = (docData) => {
    fetchDocuments()
    setActiveDoc(docData)
  }

  const handleDelete = async (docId) => {
    await axios.delete("http://localhost:8000/document", { data: { doc_id: docId } })
    if (activeDoc?.doc_id === docId) setActiveDoc(null)
    fetchDocuments()
  }

  if (page === "landing") {
    return <LandingPage onStart={() => { setPage("app"); setShowUpload(true) }} />
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        documents={documents}
        activeDoc={activeDoc}
        onSelect={setActiveDoc}
        onDelete={handleDelete}
        onUploadNew={() => setShowUpload(true)}
      />

      <div style={{ flex: 1, overflow: "hidden" }}>
        {activeDoc ? (
          <ChatWindow doc={activeDoc} />
        ) : (
          <div style={s.noDoc}>
            <span style={s.noDocIcon}>🧠</span>
            <h2 style={s.noDocTitle}>Select or upload a document</h2>
            <p style={s.noDocSub}>Choose a document from the sidebar or upload a new one to start chatting</p>
            <button style={s.noDocBtn} onClick={() => setShowUpload(true)}>
              📤 Upload Document
            </button>
          </div>
        )}
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={handleUploaded}
        />
      )}
    </div>
  )
}

const s = {
  noDoc: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: "16px", background: "#f8fafc", textAlign: "center", padding: "40px" },
  noDocIcon: { fontSize: "56px" },
  noDocTitle: { fontSize: "22px", fontWeight: "700", color: "#1a202c" },
  noDocSub: { fontSize: "15px", color: "#64748b", maxWidth: "360px", lineHeight: "1.6" },
  noDocBtn: { padding: "12px 28px", background: "#2563eb", color: "white", borderRadius: "10px", fontSize: "15px", fontWeight: "600", border: "none", cursor: "pointer", marginTop: "8px" },
}