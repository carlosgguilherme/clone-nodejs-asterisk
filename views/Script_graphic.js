import "../node_modules/axios/dist/axios.min.js";
import "../node_modules/chart.js/dist/chart.umd.js";

const getData = async () => {
  const retrievedData = await axios
    .get("http://localhost:8001/api/asterisk")
    .then((res) => res);

  const queueParams = {};
  const queueEntries = [];

  retrievedData.data.forEach((obj) => {
    if (obj.hasOwnProperty("queue")) {
      if (!queueParams[obj.queue]) {
        queueParams[obj.queue] = [];
      }
      queueParams[obj.queue].push(obj);
    } else {
      queueEntries.push(obj);
    }
  });

  return { queueParams, queueEntries };
};
const updateChart = async () => { 
  const data = await getData();

  const queueKeys = Object.keys(data.queueParams);

  const totals = {
    calls: 0,
    abandoned: 0,
    completed: 0,
  };

  queueKeys.forEach((key) => {
    const params = data.queueParams[key];
 
    totals.calls += params.reduce((acc, curr) => acc + parseInt(curr.calls), 0);

    totals.abandoned += params.reduce(
      (acc, curr) => acc + parseInt(curr.abandoned),
      0
    );
    totals.completed += params.reduce(
      (acc, curr) => acc + parseInt(curr.completed),
      0
    );

    const aban = `<p class="content" style="font-size: 30px">${totals.abandoned}</p>`;
    document.querySelector(".aban p").innerHTML = aban;

    const call = `<p class="content" style="font-size: 30px">${totals.calls}</p>`;
    document.querySelector(".call p").innerHTML = call;

    const complete = `<p class="content" style="font-size: 30px">${totals.completed}</p>`;
    document.querySelector(".complete p").innerHTML = complete;
  });
};
setInterval(updateChart, 1000);
await updateChart();
