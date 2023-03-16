const express = require("express");
const app = express();
const asteriskManager = require("asterisk-manager");
const cors = require("cors");

let ami = asteriskManager(
  "5038",
  "pabx20.brdsoft.com.br",
  "carlos",
  "c@rlos2023"
);
ami.connect();

app.use(cors());
app.use(express.json());

app.listen(8001, () => console.log("Conectando na porta 80012"));

let status = [];

app.get("/api/asterisk", async function (req, res) {
  function managerevent(evt) {
    if (evt.event === "QueueStatusComplete") {
      ami.removeListener("managerevent", managerevent);
    } //else if (evt.event === "QueueMember" || evt.event === "QueueParams") 
      else if (evt.event === "QueueParams") {
      status.push(evt);
    }
  }

  await ami.on("managerevent", managerevent);
  ami.action({ action: "QueueStatus" });

  res.status(200).json(status);
  status = [];
});
