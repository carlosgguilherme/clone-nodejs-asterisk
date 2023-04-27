
const express = require("express");
const asteriskManager = require("asterisk-manager");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const secret = "aisoleh";

const connection = mysql.createConnection({
  host: "localhost",
  user: "carlos",
  password: "C@rlos1234",
  database: "NODE_MAP_USERS",
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(cookieParser());

app.use("/static", function (req, res, next) {
  res.setHeader("Content-Type", "text/plain");
  next();
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.post("/auth", function (req, res) {
  let email = req.body.email;
  let password = req.body.password;

  console.log(req.body);

  if (email && password) {
    connection.query(
      "SELECT * FROM Users WHERE email = ? AND password = ?",
      [email, password],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          const token = jwt.sign({ email }, secret, { expiresIn: "1h" });
          res.cookie("token", token);
          res.status(200).json({ auth: true, token }); // Enviar o token como resposta
        } else {
          res.status(401).json({ error: "Email ou senha incorretos" }); // Retornar erro de autenticação
        }
      }
    );
  } else {
    res.status(400).json({ error: "Por favor, informe o email e a senha" }); // Retornar erro de requisição inválida
  }
});

app.post("/logout", function (req, res) {
  res.json({ auth: false, token: null });
});

// Middleware de autenticação com JWT

function verifyJWT(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ auth: false, message: "Token não informado." });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(500).json({ auth: false, message: "Falha ao autenticar o token." });
    }
    req.email = decoded.email;
    next();
  });
}

// Rota /map protegida com o middleware de autenticação
app.get("/map", verifyJWT, function (req, res) {
  res.sendFile(path.join(__dirname, "map.html"));
});

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
