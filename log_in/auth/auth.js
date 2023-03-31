const form = document
  .querySelector("form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    if (email === "usuario@exemplo.com" && password === "senha123") {
      alert("Login bem-sucedido!");

      window.location.href = "outra-pagina.html";
    } else {
      alert("E-mail ou senha incorretos.");
    }
  });
