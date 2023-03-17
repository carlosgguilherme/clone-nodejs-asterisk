import "../node_modules/axios/dist/axios.min.js";
import "../node_modules/chart.js/dist/chart.umd.js";

const getData = async () => {
  const retrievedData = await axios
    .get("http://localhost:8001/api/asterisk")
    .then((res) => res);

  return retrievedData;
};

const createChart = async () => {
  const ctx = document.getElementById("chart");
  const { data } = await getData();
  const chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: data.map((res) => res.queue),
      datasets: [
        {
          label: "Abandonadas",
          data: data.map((res) => res.abandoned),
          borderWidth: 1,
        },
        {
          label: "Chamadas",
          data: data.map((res) => res.calls),
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  const updateChart = async () => {
    const { data } = await getData();
    const totalCalls = data.reduce((acc, curr) => acc + parseInt(curr.calls), 0);
    const totalAban = data.reduce((acc, curr) => acc + parseInt(curr.abandoned), 0);
    const totalComplete = data.reduce((acc, curr) => acc + parseInt(curr.completed), 0);

    const aban = `<p class="content" style="font-size: 30px">${totalAban}</p>`;
    document.querySelector(".aban p").innerHTML = aban;
    
    const call = `<p class="content" style="font-size: 30px">${totalCalls}</p>`;
    document.querySelector(".call p").innerHTML = call;

    const complete = `<p class="content" style="font-size: 30px">${totalComplete}</p>`;
    document.querySelector(".complete p").innerHTML = complete;

    const table = data.map(function (data) {
      return `<tr>
              <td>${data.queue}</td>
              <td>${data.abandoned}</td>
              <td>${data.calls}</td>
          </tr>`;
    });

    document.querySelector("#tb tbody").innerHTML = table.join("");

    chart.data.labels = data.map((res) => res.queue);
    chart.data.datasets[0].data = data.map((res) => res.abandoned);
    chart.data.datasets[1].data = data.map((res) => res.calls);
    chart.update();
  };

  setInterval(updateChart, 2000);
};

await createChart();
