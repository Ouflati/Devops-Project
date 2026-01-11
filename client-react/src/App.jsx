import { useEffect, useState } from "react";
import AuthApp from "./AuthApp";
import TeamChat from "./TeamChat";

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // 🔐 PAS CONNECTÉ → LOGIN
  if (!token) {
    return <AuthApp onLoginSuccess={(t) => setToken(t)} />;
  }

  // 💬 CONNECTÉ → CHAT
  return <TeamChat />;
}
