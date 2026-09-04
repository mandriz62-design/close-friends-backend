const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();
app.use(cors());
app.use(express.json());

// Inicializa o Stripe usando a chave secreta real configurada no Render
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Endpoint de Registo/Login
app.post("/auth", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "E-mail obrigatório" });
  
  res.json({
    token: `token_${Date.now()}`,
    email
  });
});

// Endpoint para verificar o estado da subscrição real no Stripe
app.post("/check-subscription", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "E-mail obrigatório" });

  try {
    // Procura o cliente no Stripe pelo e-mail
    const customers = await stripe.customers.list({ email: email, limit: 1 });

    if (customers.data.length === 0) {
      return res.json({ hasPaid: false, message: "Cliente não encontrado" });
    }

    const customerId = customers.data[0].id;

    // Procura por subscrições ativas do cliente
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active"
    });

    if (subscriptions.data.length > 0) {
      return res.json({ hasPaid: true, status: "active" });
    } else {
      return res.json({ hasPaid: false, status: "inactive" });
    }
  } catch (error) {
    console.error("Erro ao verificar Stripe:", error);
    res.status(500).json({ error: "Erro interno ao validar pagamento" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor a rodar na porta ${PORT}`));
