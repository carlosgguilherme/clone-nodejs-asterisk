//import "/node_modules/axios/dist/axios.min.js";
// Obtenha o valor do cookie 'token'
function getCookie(name) {
  const cookieArr = document.cookie.split(";").map(cookie => cookie.trim());
  const cookie = cookieArr.find(cookie => cookie.startsWith(`${name}=`));
  if (cookie) {
    return cookie.split("=")[1];
  }
  return null;
}

// Exemplo de como obter o JWT do cookie 'token'
const token = getCookie('token');

// Faça uma requisição para o servidor enviando o JWT no cabeçalho 'Authorization'
if (token) {
  // Faça a requisição para o servidor incluindo o JWT no cabeçalho 'Authorization'
  fetch('/api/recurso-protegido', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (response.ok) {
      // A resposta foi bem-sucedida, você pode processar os dados retornados
      return response.json();
    } else {
      // A resposta foi com erro, você pode tratar o erro aqui
      throw new Error("Erro na requisição");
    }
  })
  .then(data => {
    // Processar os dados retornados do servidor
    console.log(data);
  })
  .catch(error => {
    // Tratar o erro da requisição
    console.error(error);
  });
} else {
  // O token não foi encontrado, faça o tratamento adequado
  console.log("Token não encontrado");
}

const getData = async () => {
  const retrievedData = await axios
    .get("http://localhost:8001/api/asterisk")
    .then((res) => res);

  const queueParams = [];
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
  const dddToState = {
    68: "AC",
    82: "AL",
    92: "AM",
    71: "BA",
    88: "CE",
    61: "DF",
    27: "ES",
    62: "GO",
    98: "MA",
    65: "MT",
    67: "MS",
    31: "MG",
    91: "PA",
    83: "PB",
    41: "PR",
    81: "PE",
    22: "PI",
    21: "RJ",
    84: "RN",
    51: "RS",
    69: "RO",
    95: "RR",
    47: "SC",
    79: "SE",
    11: "SP",
    63: "TO",
  };

  const defaultmap = document.querySelectorAll("path");
  defaultmap.forEach((defaultmap) => {
    defaultmap.setAttribute("fill", "black");
  });

  queueKeys.forEach((key) => {
    const params = data.queueParams[key];
    const fact = params[0];
    let G = 1;

    totals.calls += fact.calls++;
    totals.abandoned += fact.abandoned++;
    totals.completed += fact.completed++;

    for (let i = 0; i < params.length - 1; i++) {
      const geo = params[G];
      G++;

      const ddd = geo.calleridnum.substr(0, 2);
      const state = dddToState[ddd];

      if (state) {
        const element = document.getElementById(`BR-${state}`);
        element.setAttribute("fill", "rgb(153, 255, 0)");
      }
    }

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