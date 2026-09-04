const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Rota de teste na raiz
app.get("/", (req, res) => {
  res.send("API Close Friends Pro ativa!");
});

// Rota de Registo
app.post("/auth/register", (req, res) => {
  const { email, pass } = req.body;
  if (!email || !pass) {
    return res.status(400).json({ error: "Email e palavra-passe obrigatórios." });
  }
  // Devolve o token necessário para a extensão avançar
  res.json({ token: "jwt_token_sucesso_123" });
});

// Rota de Login
app.post("/auth/login", (req, res) => {
  const { email, pass } = req.body;
  if (!email || !pass) {
    return res.status(400).json({ error: "Email e palavra-passe obrigatórios." });
  }
  res.json({ token: "jwt_token_sucesso_123" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor a rodar na porta ${PORT}`));
