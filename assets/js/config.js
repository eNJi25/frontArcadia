const apiUrl = "https://arcadia2024.alwaysdata.net/arcadia/api/";

// Fontion pour mettre un texte tout en majuscule
function toUpperCase(text) {
  return text.toUpperCase();
}

// Fonction pour récupérer les données avec fetch et gérer les erreurs
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Une erreur est survenue :", error);
    return null;
  }
}

const tokenCookieName = "accesstoken";
const RoleCookieName = "role";
const UserId = "id"

const signoutBtn = document.getElementById("signoutBtn");
signoutBtn.addEventListener("click", signout);

function signout() {
  eraseCookie(tokenCookieName);
  eraseCookie(RoleCookieName);
  eraseCookie(UserId);
  window.location.reload();
}

function setToken(token) {
  setCookie(tokenCookieName, token, 7);
}

function getToken() {
  return getCookie(tokenCookieName);
}

function getRole() {
  return getCookie(RoleCookieName);
}

function getId() {
  return getCookie(UserId);
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name + "=" + (value || "") + expires + "; path=/;  SameSite=None; Secure;";
}

function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function isConnected() {
  if (getToken() == null || getToken() == undefined) {
    return false;
  } else {
    return true;
  }
}

function showAndHideElementsForRoles() {
  const userConnected = isConnected();
  console.log(userConnected);
  const role = getRole();

  let allElementsToEdit = document.querySelectorAll("[data-show]");

  allElementsToEdit.forEach((element) => {
    switch (element.dataset.show) {
      case "disconnected":
        if (userConnected) {
          element.classList.add("d-none");
        }
        break;
      case "connected":
        if (!userConnected) {
          element.classList.add("d-none");
        }
        break;
      case "admin":
        if (!userConnected || role != "ROLE_ADMIN") {
          element.classList.add("d-none");
        }
        break;
      case "user":
        if (!userConnected || role != "ROLE_USER") {
          element.classList.add("d-none");
        }
        break;
    }
  });
}
