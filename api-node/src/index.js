require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors()); // 🔥 OBLIGATOIRE pour Firefox

app.use(express.json());

app.use("/api/chat", require("./routes/chat.routes"));
// Routes auth 
app.use("/auth", require("./routes/auth"));

// 🔥 ROUTES CHAT (AJOUT)
app.use('/messages', require('./routes/messages'));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`API running on port ${PORT}`)
);

