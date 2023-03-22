import "../node_modules/axios/dist/axios.min.js";
import "../node_modules/chart.js/dist/chart.umd.js";

const getData = async () => {
  const retrievedData = await axios
    .get("http://localhost:8001/api/asterisk")
    .then((res) => res);

  const [QueueParams41, QueueParams42, QueueEntry] = retrievedData.data;

  return [QueueParams41, QueueParams42, QueueEntry]
};

const updateChart = async () => {
    const [QueueParams41, QueueParams42, QueueEntry] = await getData();

    console.log(QueueParams41)

  const totalCalls = data.reduce((acc, curr) => acc + parseInt(curr.calls), 0);
  const totalAban = data.reduce(
    (acc, curr) => acc + parseInt(curr.abandoned),
    0
  );
  const totalComplete = data.reduce(
    (acc, curr) => acc + parseInt(curr.completed),
    0
  );

  const aban = `<p class="content" style="font-size: 30px">${totalAban}</p>`;
  document.querySelector(".aban p").innerHTML = aban;

  const call = `<p class="content" style="font-size: 30px">${totalCalls}</p>`;
  document.querySelector(".call p").innerHTML = call;

  const complete = `<p class="content" style="font-size: 30px">${totalComplete}</p>`;
  document.querySelector(".complete p").innerHTML = complete;

  setInterval(updateChart, 2000);
};

await updateChart();
