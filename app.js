const express = require("express");
const app = express();
const asteriskManager = require("asterisk-manager");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "carlos",
  password: "C@rlos1234",
  database: "NODE_MAP_USERS",
});
connection.connect();

app.use(express.static(path.join(__dirname, "views")));
app.use(express.static("/public"));

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

app.get("/api/users", async function (req, res) {
  connection.query("SELECT * FROM Users", (err, rows, fields) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao consultar o banco de dados" });
      return;
    }
    res.status(200).json(rows);
  });
});