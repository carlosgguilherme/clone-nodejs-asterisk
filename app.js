const express = require("express");
const asteriskManager = require("asterisk-manager");

const { createClient } = require("redis");
const { resolve } = require("path");
const Client = createClient();

const getAllProducts = async() => {
  ami.on("connect", () => {
    ami.action({ action: "login" }, (err, res) => {
      if (err) {
        console.error("Erro ao realizar login:", err);
      } else {  
      console.log("Realizei o login")
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
        resolve(sipPeers)
      }); 
}
console.log(getAllProducts)
const app = express();
const ami = asteriskManager("5038", "168.121.6.140", "websul", "bilmaster");
const startup = async () => {
  ami.connect();
  app.listen(7979, () => {
    console.log("Conectei na porta 6969");
  });
};
startup();

let sipPeers = [];


      app.get("/sippeers", async function (req, res) {
        const products = await getAllProducts();
        res.send('ksakdsakdsak')
       
        ami.action({ action: "Logoff" });
      });
    }
    )}
   )}

