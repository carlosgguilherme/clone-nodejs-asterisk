import "../node_modules/axios/dist/axios.min.js"
import "../node_modules/chart.js/dist/chart.umd.js"

const getData = async () => {
  const retrievedData = await axios
    .get("http://localhost:8001/api/asterisk")
    .then((res) => res);
    
  return retrievedData;
};

const createChart = async () => {
  const ctx = document.getElementById("chart");

  const data = await getData();
  console.log(data)
  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.data.map((res) => res.calls),
      datasets: [
        {
          label: "Numeros de pontos",
          data: data.data.map((res) => res.abandoned),
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
    const newData = await getData();

    chart.data.labels = newData.map((res) => res);
    chart.data.datasets[0].data = newData.map((res) => res);
    chart.update();
  };

  setInterval(updateChart, 2000);
};

createChart();