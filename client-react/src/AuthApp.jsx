import { useState } from "react";

const API = "/api/node/auth";

export default function AuthApp({ onLoginSuccess }) {
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    oldPassword: "",
    newPassword: ""
  });
  const [token, setToken] = useState("");
  const [me, setMe] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const callApi = async (url, method, body, auth = false) => {
    const res = await fetch(`${API}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(auth && { Authorization: `Bearer ${token}` })
      },
      body: body ? JSON.stringify(body) : undefined
    });
    return res.json();
  };

  const handleRegister = async () => {
    const res = await callApi("/register", "POST", {
      username: form.username,
      email: form.email,
      password: form.password
    });
    setMessage(JSON.stringify(res));
  };

  const handleLogin = async () => {
  const res = await callApi("/login", "POST", {
    identifier: form.email,
    password: form.password
  });

  if (res.token) {
  localStorage.setItem("token", res.token);
  setToken(res.token);
  onLoginSuccess(); // 🔥 IMPORTANT
}
};


  const handleMe = async () => {
    const res = await callApi("/me", "GET", null, true);
    setMe(res);
  };

  const handleChangePassword = async () => {
    const res = await callApi("/change-password", "PUT", {
      oldPassword: form.oldPassword,
      newPassword: form.newPassword
    }, true);
    setMessage(JSON.stringify(res));
  };

  return (
    <div style={{ border: "1px solid #aaa", padding: 20, marginTop: 30 }}>
      <h2>🔐 Authentification</h2>

      <div>
        <button onClick={() => setMode("login")}>Login</button>
        <button onClick={() => setMode("register")}>Register</button>
      </div>

      {mode === "register" && (
        <>
          <h3>Register</h3>
          <input name="username" placeholder="Username" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} />
          <button onClick={handleRegister}>Register</button>
        </>
      )}

      {mode === "login" && (
        <>
          <h3>Login</h3>
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} />
          <button onClick={handleLogin}>Login</button>
        </>
      )}

      {token && (
        <>
          <h3>Utilisateur connecté</h3>
          <button onClick={handleMe}>Qui suis-je ?</button>
          <pre>{JSON.stringify(me, null, 2)}</pre>

          <h3>Changer votre mot de passe</h3>
          <input name="oldPassword" type="password" placeholder="Ancien mot de passe" onChange={handleChange} />
          <input name="newPassword" type="password" placeholder="Nouveau mot de passe" onChange={handleChange} />
          <button onClick={handleChangePassword}>Changer</button>
        </>
      )}

      <p>{message}</p>
    </div>
  );
}