import { useState } from "react";

const API = "/api/node/auth";

export default function AuthApp({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const callApi = async (url, method, body) => {
    const res = await fetch(`${API}${url}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error("Erreur API");
    return res.json();
  };

  const handleLogin = async () => {
    try {
      const res = await callApi("/login", "POST", {
        identifier: form.email,
        password: form.password
      });

      localStorage.setItem("token", res.token);
      onLoginSuccess(res.token);
    } catch {
      setMessage("❌ Login incorrect");
    }
  };

  const handleRegister = async () => {
    try {
      await callApi("/register", "POST", {
        username: form.username,
        email: form.email,
        password: form.password
      });

      setMessage("✅ Compte créé. Connectez-vous.");
      setMode("login");
    } catch {
      setMessage("❌ Erreur inscription");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        <h2 style={styles.title}>🔐 Authentification</h2>

        <div style={styles.tabs}>
          <span
            style={mode === "login" ? styles.activeTab : styles.tab}
            onClick={() => setMode("login")}
          >
            Login
          </span>
          <span
            style={mode === "register" ? styles.activeTab : styles.tab}
            onClick={() => setMode("register")}
          >
            Register
          </span>
        </div>

        <h3 style={{ marginBottom: 12 }}>
          {mode === "login" ? "Login" : "Register"}
        </h3>

        {mode === "register" && (
          <input
            style={styles.input}
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
        )}

        <div style={styles.row}>
          <input
            style={styles.input}
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <button
            style={styles.button}
            onClick={mode === "login" ? handleLogin : handleRegister}
          >
            {mode === "login" ? "Login" : "Register"}
          </button>
        </div>

        <p style={styles.message}>{message}</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#111",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  box: {
    border: "1px solid #666",
    padding: 24,
    width: 500,
    color: "#fff"
  },
  title: {
    textAlign: "center",
    marginBottom: 10
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20
  },
  tab: {
    cursor: "pointer",
    opacity: 0.6
  },
  activeTab: {
    cursor: "pointer",
    fontWeight: "bold"
  },
  row: {
    display: "flex",
    gap: 10,
    alignItems: "center"
  },
  input: {
    padding: 6,
    flex: 1,
    background: "#222",
    border: "1px solid #666",
    color: "#fff"
  },
  button: {
    padding: "6px 16px",
    background: "#333",
    color: "#fff",
    border: "1px solid #666",
    cursor: "pointer"
  },
  message: {
    marginTop: 10,
    fontSize: 13
  }
};
