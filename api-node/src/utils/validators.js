const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const passwordRegex = /(?=.*[A-Z])(?=.*\d).{8,}$/;

function validateRegister({ username, email, password }) {
  if (!usernameRegex.test(username)) {
    return "Username invalide";
  }

  if (!emailRegex.test(email)) {
    return "Email invalide";
  }

  if (!passwordRegex.test(password)) {
    return "Mot de passe faible";
  }

  return null;
}

module.exports = { validateRegister };
