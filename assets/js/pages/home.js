const habitatsContainer = document.getElementById("habitats");


function toUpperCase(text) {
  return text.toUpperCase();
}

fetch("https://arcadia2024.alwaysdata.net/arcadia/api/habitat/showAll") // URL de l'API
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`); // Vérifie si la réponse est correcte
    }
    return response.json(); // Transforme la réponse en JSON
  })
  .then((data) => {
    // Pour chaque habitat récupéré, on génère une carte HTML
    data.forEach((habitat) => {
      const habitatCard = document.createElement("div");
      habitatCard.className = "col-12 col-md-4 mb-4"; // Colonne Bootstrap

      habitatCard.innerHTML = `
        <div class="card position-relative">
          <img src="${habitat.imageName}" class="img-fluid" alt="${
        habitat.nom
      }">
          <div class="w-100 h-100 card-body position-absolute d-flex flex-column justify-content-between align-items-center">
            <h3 class="card-title text-color">${toUpperCase(habitat.nom)}</h3>
            <a href="/arcadia/api/habitat/show/${
              habitat.id
            }" class="btn btn-secondary">Découvrir</a>
          </div>
        </div>
      `;

      // Ajoute la carte générée au conteneur
      habitatsContainer.appendChild(habitatCard);
    });
  })
  .catch((error) => {
    console.error("Une erreur est survenue :", error); // Gère les erreurs
    habitatsContainer.innerHTML = `<p class="text-danger text-center">Impossible de charger les habitats. Veuillez réessayer plus tard.</p>`;
  });
