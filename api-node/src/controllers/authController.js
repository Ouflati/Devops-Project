const { createUser, findByEmailOrUsername, findById } = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/password');
const { validateRegister } = require('../utils/validators');
const { generateToken } = require('../utils/jwt');
const { findByIdWithPassword } = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const error = validateRegister(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const { username, email, password } = req.body;

    const existingUser = await findByEmailOrUsername(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Utilisateur déjà existant' });
    }

    const hashedPassword = await hashPassword(password);
    await createUser(username, email, hashedPassword);

    res.status(201).json({ message: 'Compte créé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await findByEmailOrUsername(identifier);
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = generateToken(user.id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await findById(req.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Les deux mots de passe sont requis' });
    }

    const user = await findByIdWithPassword(req.userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const match = await comparePassword(oldPassword, user.password);
    if (!match) return res.status(401).json({ message: 'Ancien mot de passe incorrect' });

    // Valider nouveau mot de passe
    const { validateRegister } = require('../utils/validators');
    const error = validateRegister({ username: user.username, email: user.email, password: newPassword });
    if (error) return res.status(400).json({ message: error });

    const hashedPassword = await hashPassword(newPassword);

    const db = await require('../db').openDb();
    await db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
    await db.close();

    res.json({ message: 'Mot de passe changé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.verifyToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Token requis' });

  try {
    const decoded = require('../utils/jwt').verifyToken(token);
    res.json({ valid: true, userId: decoded.userId });
  } catch (err) {
    res.status(401).json({ valid: false, message: 'Token invalide ou expiré' });
  }
};