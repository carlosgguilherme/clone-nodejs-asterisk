import "../node_modules/axios/dist/axios.min.js";

const getData = async () => {
  const retrievedData = await axios
    .get("http://localhost:8001/api/users")
    .then((res) => res);
    console.log(retrievedData)
}
getData()

const form = document
  .querySelector("form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("emailValue").value;
    const password = document.getElementById("passwordValue").value;
    console.log(email, password)
    if (email === "usuario@exemplo.com" && password === "senha123") {
      alert("Login bem-sucedido!");

      window.location.href = "map.html";
    } else {
      alert("E-mail ou senha incorretos.");
    }
  });
