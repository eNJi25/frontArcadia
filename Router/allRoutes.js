import Route from "./Route.js";

// Toutes les routes à définir ici (url, titre de la page, chemin page HTML, chemin fichier JS)
export const allRoutes = [
  new Route("/", "Accueil", "pages/home.html", "assets/js/pages/home.js"),
  new Route(
    "/services",
    "Nos Services",
    "pages/services.html",
    "assets/js/pages/services.js"
  ),
  new Route(
    "/login",
    "Connexion",
    "pages/auth/signin.html",
    "assets/js/pages/auth/signin.js"
  ),
  new Route(
    "/registration",
    "Inscription",
    "pages/auth/signup.html",
    "assets/js/pages/auth/signup.js"
  ),
  new Route(
    "/account",
    "Mon compte",
    "pages/auth/account.html",
    "assets/js/pages/auth/account.js"
  ),
  new Route(
    "/editPassword",
    "Modification mot de passe",
    "pages/auth/editPassword.html",
    "assets/js/pages/auth/editPassword.js"
  ),
  new Route(
    "/habitats",
    "Nos habitats",
    "pages/habitats.html",
    "assets/js/pages/habitats.js"
  ),
  new Route(
    "/habitat",
    "Habitat",
    "pages/habitat.html",
    "assets/js/pages/habitat.js"
  ),
];

export const websiteName = "Arcadia";
