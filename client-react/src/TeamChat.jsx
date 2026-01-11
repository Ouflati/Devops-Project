import { useEffect, useRef, useState } from "react";

const API_CHAT = "/api/node/api/chat/messages";
const API_ME = "/api/node/auth/me";

export default function TeamChat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [me, setMe] = useState(null);
  const boxRef = useRef(null);

  const token = localStorage.getItem("token");

  // 🚨 SÉCURITÉ : pas de token = retour login
  useEffect(() => {
    if (!token) {
      window.location.reload();
    }
  }, [token]);

  // 🔐 Charger utilisateur
  const loadMe = async () => {
    try {
      const res = await fetch(API_ME, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setMe(data);
    } catch {
      logout(); // ⬅️ TOKEN INVALID → LOGOUT
    }
  };

  // 💬 Charger messages
  const loadMessages = async () => {
    try {
      const res = await fetch(API_CHAT, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return;

      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {}
  };

  useEffect(() => {
    loadMe();
    loadMessages();
    const i = setInterval(loadMessages, 5000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    boxRef.current?.scrollTo(0, boxRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch(API_CHAT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ content: text })
    });

    setText("");
    loadMessages();
  };

  const deleteMessage = async (id) => {
    await fetch(`${API_CHAT}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    loadMessages();
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // ⏳ Chargement NORMAL
  if (!me) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: 100 }}>
        Chargement...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h3>💬 Chat Collaboratif</h3>

        <div style={styles.userRow}>
          <span>Connecté : <b>{me.username}</b></span>
          <button style={styles.logout} onClick={logout}>Déconnexion</button>
        </div>

        <div ref={boxRef} style={styles.messages}>
          {messages.map(m => (
            <div key={m.id} style={styles.message}>
              <div style={styles.meta}>
                <b>{m.username}</b> • {new Date(m.created_at).toLocaleString()}
              </div>
              <div>{m.content}</div>

              {m.user_id === me.id && (
                <button style={styles.delete} onClick={() => deleteMessage(m.id)}>
                  Supprimer
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Écris un message..."
          />
          <button style={styles.button} onClick={sendMessage}>Envoyer</button>
        </div>
      </div>
    </div>
  );
}
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#141e30,#243b55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: 420,
    background: "#0f172a",
    padding: 20,
    borderRadius: 16,
    color: "#e5e7eb",
    boxShadow: "0 20px 40px rgba(0,0,0,.6)"
  },
  userRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10
  },
  logout: {
    background: "#ef4444",
    border: "none",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer"
  },
  messages: {
    height: 300,
    overflowY: "auto",
    background: "#020617",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10
  },
  message: {
    background: "#1e293b",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8
  },
  meta: {
    fontSize: 12,
    opacity: 0.7
  },
  delete: {
    background: "#dc2626",
    border: "none",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    marginTop: 6
  },
  inputRow: {
    display: "flex",
    gap: 8
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    border: "none",
    background: "#020617",
    color: "#fff"
  },
  button: {
    background: "#6366f1",
    border: "none",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer"
  }
};
