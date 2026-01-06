import { useState } from "react";
import AuthApp from "./AuthApp";
import TeamChat from "./TeamChat";
import "./App.css";

export default function App() {
  const [logged, setLogged] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <div className="App">
      {!logged ? (
        <AuthApp onLoginSuccess={() => setLogged(true)} />
      ) : (
        <TeamChat />
      )}
    </div>
  );
}
