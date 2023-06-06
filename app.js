const express = require("express");
const { createClient } = require("redis");

const app = express();
const client = createClient();

client.connect();
app.listen(6969, () => {
  console.log("Conectei na porta 6969");
});

const sipPeers = [];

const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    const asteriskManager = require("asterisk-manager");
    const ami = asteriskManager("5038", "168.121.6.140", "websul", "bilmaster");

    ami.connect();
    ami.on("connect", () => {
      console.log("Realizei a conexão ao Asterisk");
      ami.action({ action: "SIPpeers" }, (err, res) => {
        if (err) {
          console.error("Erro ao obter SIPpeers:", err);
          reject(err);
        }
      });
    });

    ami.on("peerentry", (evt) => {
      const status = evt.status;
      const ip = evt.ipaddress;
      const name = evt.objectname;
      sipPeers.push({
        status,
        ip,
        name,
      });
      client.set("sippeers", JSON.stringify(sipPeers), (err, reply) => {
        if (err) {
          console.error("Erro ao armazenar SIPpeers no Redis:", err);
          reject(err);
        } else {
          console.log(sipPeers);
          resolve(sipPeers);
        }
        ami.disconnect();
      });
    });
    ami.on("error", (err) => {
      console.error("Erro ao conectar ao Asterisk:", err);
      reject(err);
    });
  });
};

app.get("/asterisk", async (req, res) => {
  try {
    client.get("sippeers", (err, reply) => {
      if (err) {
        console.error("Erro ao obter SIPpeers do Redis:", err);
        return res.status(500).send("Erro ao obter SIPpeers");
      }
      const sipPeers = JSON.parse(reply) || [];
      return res.send(sipPeers);
    });
  } catch (error) {
    console.error("Erro ao obter SIPpeers do Redis:", error);
    return res.status(500).send("Erro ao obter SIPpeers");
  }
});

// let sipPeers = [];

// ami.on("connect", () => {
//   ami.action({ action: "login" }, (err, res) => {
//     if (err) {
//       console.error("Erro ao realizar login:", err);
//     } else {
//       app.get("/sippeers", async function (req, res) {
//         ami.action({ action: "SIPpeers" });
//         ami.on("peerentry", (evt) => {
//           const status = evt.status;
//           const ip = evt.ipaddress;
//           const name = evt.objectname;
//           sipPeers.push({
//             status,
//             ip,
//             name,
//           });
//         });
//         res.status(200).json(sipPeers);
//         ami.action({ action: "Logoff" });
//       });
//     }
//   });
// });
