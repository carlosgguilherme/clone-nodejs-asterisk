const express = require("express");
const asteriskManager = require("asterisk-manager");
const { createClient } = require("redis");

const app = express();
const ami = asteriskManager("5038", "168.121.6.140", "websul", "bilmaster");
const client = createClient();

client.connect();
ami.connect();
app.listen(6969, () => {
  console.log("Conectei na porta 6969");
});

const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    ami.action({ action: "login" }, (err, res) => {
      if (err) {
        console.error("Erro ao realizar login:", err);
        reject(err);
      } else {
        console.log('entrei no if action')
        const sipPeers = [];
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
        ami.on("end", () => {
          resolve(sipPeers);
        });
      }
    });
  });
};

app.get("/", async (req, res) => {
  try {
    const sipPeers = await getAllProducts();
    await client.set("getAllProducts", JSON.stringify(sipPeers));
    return res.send(sipPeers);
  } catch (error) {
    console.error("Erro ao obter produtos:", error);
    return res.status(500).send("Erro ao obter produtos");
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
