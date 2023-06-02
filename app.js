const express = require("express");
const asteriskManager = require("asterisk-manager");

const { createClient } = require("redis");
const Client = createClient();

const app = express();
const ami = asteriskManager("5038", "168.121.6.140", "websul", "bilmaster");
const startup = async () => {
  ami.connect();
  app.listen(6969, () => {
    console.log("Conectei na porta 6969");
  });
};
startup();

let sipPeers = [];

ami.on("connect", () => {
  ami.action({ action: "login" }, (err, res) => {
    if (err) {
      console.error("Erro ao realizar login:", err);
    } else {
      app.get("/sippeers", async function (req, res) {
        ami.action({ action: "SIPpeers" });
        ami.on("peerentry", (evt) => {
          const status = evt.status;
          const ip = evt.ipaddress;
          const name = evt.objectname;
          sipPeers.push({
            status,
            ip,
            name,
          });
        }); 
        res.status(200).json(sipPeers);
        ami.action({ action: "Logoff" });
      });
    }
  });
});
