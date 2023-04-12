const express = require("express");
const asteriskManager = require("asterisk-manager");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const connection = mysql.createConnection({
  host: "localhost",
  user: "carlos",
  password: "C@rlos1234",
  database: "NODE_MAP_USERS",
});
const app = express();
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));

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
    const secret = "aisoleh";
    connection.query(
      "SELECT * FROM Users WHERE email = ? AND password = ?",
      [email, password],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          const token = jwt.sign({ email }, secret, { expiresIn: "1h" });
          res.status(200).json({ token: token });
        } else {
          res.send("Email ou senha incorretos");
        }
        res.end();
      }
    );
  } else {
    res.send("Por favor bote o email e a senha");
    res.end();
  }
});

function authtoken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401);
  }
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403);
    }
    req.user = user;
    next();
  });
}

app.get("/map", authtoken, function (req, res) {
  if (req.session.loggedin) {
    // res.set('Content-Type', 'text/javascript');
    res.sendFile(path.join(__dirname, "map.html"));
  }
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
