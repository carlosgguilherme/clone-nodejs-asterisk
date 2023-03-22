import "../node_modules/axios/dist/axios.min.js";
import "../node_modules/chart.js/dist/chart.umd.js";

const getData = async () => {
  const retrievedData = await axios
    .get("http://localhost:8001/api/asterisk")
    .then((res) => res);

  // const [QueueParams42, QueueParams41, QueueEntry] = retrievedData.data;

  return retrievedData;
};

const data = await getData();
const helo = Object.values(data.data[0]);
const gui = Object.keys(data.data[0]);

const V = [...gui, ...helo];
console.log(V);

console.log(V);
V.forEach(function (item, index) {
  console.log("ITEM: " + item," ITEM2: " + item);
});

// const updateChart = async () => {
//   const data = await getData();

//   const valueQueue42 = data
//     .filter((obj) => obj.queue === "42")
//     .map((obj) => [Number(obj.id), obj.calls]);
//   console.log(valueQueue42);

//   const totalCalls = data
//     .filter((obj) => obj.queue === "42" || obj.queue === "41")
//     .reduce((acc, curr) => acc + parseInt(curr.calls), 0);
//   const totalAban = data
//     .filter((obj) => obj.queue === "42")
//     .reduce((acc, curr) => acc + parseInt(curr.abandoned), 0);
//   const totalComplete = data
//     .filter((obj) => obj.queue === "42")
//     .reduce((acc, curr) => acc + parseInt(curr.completed), 0);

//   const aban = `<p class="content" style="font-size: 30px">${totalAban}</p>`;
//   document.querySelector(".aban p").innerHTML = aban;

//   const call = `<p class="content" style="font-size: 30px">${totalCalls}</p>`;
//   document.querySelector(".call p").innerHTML = call;

//   const complete = `<p class="content" style="font-size: 30px">${totalComplete}</p>`;
//   document.querySelector(".complete p").innerHTML = complete;

//   setInterval(updateChart, 2000);
// };

// await updateChart();
