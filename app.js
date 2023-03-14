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

app.listen(8001, () => console.log("Conectando na porta 8000"));

let status = [];
async function managerevent(evt) {
  if (evt.event === "QueueStatusComplete") {
    ami.removeListener("managerevent", managerevent);
  } else {
    status.push(evt);
  }
}
app.get("/api/asterisk", async function (req, res) { 
  ami.on("managerevent", managerevent);
  ami.action({ action: "QueueStatus" });
  res.status(200).json(status);
});
