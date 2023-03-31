const express = require("express");
const app = express();
const asteriskManager = require("asterisk-manager");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");

app.use(express.static("views/log"));
app.set("view engine", "html");
let ami = asteriskManager(
  "5038",
  "pabx20.brdsoft.com.br",
  "carlos",
  "c@rlos2023"
);
ami.connect();

app.use(cors());
app.use(express.json());

app.listen(8001, () => console.log("Conectando na porta 8001"));

let status = [];

app.get("/api/asterisk", async function (req, res) {
  function managerevent(evt) {
    if (evt.event === "QueueStatusComplete") {
      ami.removeListener("managerevent", managerevent);
    } else if (evt.event === "QueueEntry" || evt.event === "QueueParams") {
      status.push(evt);
    }
  }

  await ami.on("managerevent", managerevent);
  ami.action({ action: "QueueStatus" });

  res.status(200).json(status);
  status = [];
});

const credentials = {
  username: "usuario",
  password: "senha",
};

// Rota para autenticação
app.post("/login", (req, res) => {
  // Verifica se as credenciais estão corretas
  if (
    req.body.username === credentials.username &&
    req.body.password === credentials.password
  ) {
    // Cria um token JWT
    const token = jwt.sign(
      { username: credentials.username },
      "MinhaStringSecreta123"
    );

    // Envia o token como resposta
    res.json({ token: token });
  } else {
    // Retorna um erro de autenticação
    res.status(401).json({ error: "Credenciais inválidas" });
  }
});

// Rota protegida que só pode ser acessada com um token válido
app.get("/index", authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

// Middleware para autenticar o token
function authenticateToken(req, res, next) {
  // Verifica se o token foi enviado
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  // Verifica se o token é válido
  jwt.verify(token, "MinhaStringSecreta123", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    app.get("/", (req, res) => {});

    next();
  });
}

app.get("/", (req, res) => {
  res.render("log_in/login_screen.html");
});
