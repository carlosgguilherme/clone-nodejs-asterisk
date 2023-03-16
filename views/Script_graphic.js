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
    type: "bar",
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
    let soma = 0
    let totalcall = data.map((data)=>{
      console.log(parseInt(data.calls))
      soma += parseInt(data.calls)
    })
    console.log(soma)
    const aban = data.map(function (data) {
      return `<p class="content">${data.abandoned}</p>`;
    });

    document.querySelector(".aban p").innerHTML = aban.join("");
    const call = data.map(function (data) {
      return `<p class="content">${totalcall}</p>`;
    });

    document.querySelector(".call p").innerHTML = call.join("");

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
