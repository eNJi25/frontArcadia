const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSignin = document.getElementById("btnSignin");
const signinForm = document.getElementById("signinForm");

btnSignin.addEventListener("click", checkCredentials);

function checkCredentials() {
  let dataForm = new FormData(signinForm);

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({
    username: dataForm.get("Email"),
    password: dataForm.get("Password"),
  });

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://arcadia2024.alwaysdata.net/arcadia/api/login", requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        mailInput.classList.add("is-invalid");
        passwordInput.classList.add("is-invalid");
      }
    })
    .then((result) => {

      setCookie(UserId, result.id, 7);

      const token = result.apiToken;
      setToken(token);

      setCookie(RoleCookieName, result.roles[0], 7);
      window.location.replace("/");
    })
    .catch((error) => console.log("error", error));
}
