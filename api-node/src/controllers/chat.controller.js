const { openDb } = require("../db");

exports.getMessages = async (req, res) => {
  try {
    const db = await openDb();
    const messages = await db.all(`
      SELECT 
        chat_messages.id,
        chat_messages.content,
        chat_messages.created_at,
        users.id AS user_id,
        users.username
      FROM chat_messages
      JOIN users ON users.id = chat_messages.user_id
      ORDER BY chat_messages.created_at ASC
    `);
    await db.close();
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.userId; // ← injecté par authMiddleware

    if (!content) {
      return res.status(400).json({ message: "Message vide" });
    }

    const db = await openDb();
    await db.run(
      "INSERT INTO chat_messages (user_id, content) VALUES (?, ?)",
      [userId, content]
    );
    await db.close();

    res.status(201).json({ message: "Message envoyé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const db = await openDb();
    await db.run("DELETE FROM chat_messages WHERE id = ?", [
      req.params.id,
    ]);
    await db.close();
    res.json({ message: "Message supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
