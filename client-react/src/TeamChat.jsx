import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "team3_chat_messages";

export default function TeamChat() {
  const [username, setUsername] = useState(() => localStorage.getItem("teamchat_user") || "");
  const [draftUser, setDraftUser] = useState(username);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const boxRef = useRef(null);

  // Sauvegarde auto des messages
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Scroll en bas
  useEffect(() => {
    const el = boxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const saveUser = () => {
    const u = draftUser.trim();
    setUsername(u);
    localStorage.setItem("teamchat_user", u);
  };

  const sendMessage = () => {
    const clean = text.trim();
    if (!clean) return;

    const msg = {
      id: crypto.randomUUID?.() || String(Date.now()),
      user: username || "Anonymous",
      text: clean,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  const clearAll = () => {
    if (!confirm("Supprimer tous les messages ?")) return;
    setMessages([]);
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>💬 Team Chat — Team 3</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={draftUser}
          onChange={(e) => setDraftUser(e.target.value)}
          placeholder="Ton nom"
          style={{ padding: 10, borderRadius: 10, flex: 1 }}
        />
        <button onClick={saveUser} style={{ padding: "10px 14px", borderRadius: 10 }}>
          OK
        </button>
        <button onClick={clearAll} style={{ padding: "10px 14px", borderRadius: 10 }}>
          Reset
        </button>
      </div>

      <div
        ref={boxRef}
        style={{
          border: "1px solid #444",
          borderRadius: 12,
          padding: 12,
          height: "55vh",
          overflow: "auto",
          background: "#111",
          color: "#eee",
        }}
      >
        {messages.length === 0 ? (
          <p style={{ opacity: 0.7 }}>Aucun message pour le moment…</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                <b style={{ opacity: 1 }}>{m.user}</b> •{" "}
                {new Date(m.createdAt).toLocaleString()}
              </div>
              <div style={{ fontSize: 14 }}>{m.text}</div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écris un message..."
          style={{ padding: 10, borderRadius: 10, flex: 1 }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={{ padding: "10px 14px", borderRadius: 10 }}>
          Envoyer
        </button>
      </div>
    </div>
  );
}
