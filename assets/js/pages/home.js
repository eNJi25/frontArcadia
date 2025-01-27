function toUpperCase(text) {
  return text.toUpperCase();
}

// DEBUT Présentation Habitats

const habitatsContainer = document.getElementById("habitats");

fetch("https://arcadia2024.alwaysdata.net/arcadia/api/habitat/showAll")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    data.forEach((habitat) => {
      const habitatCard = document.createElement("div");
      habitatCard.className = "col-12 col-md-4 mb-3";

      habitatCard.innerHTML = `
        <div class="card position-relative">
          <img src="${habitat.imageName}" class="img-fluid habitat-card" alt="${
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

      habitatsContainer.appendChild(habitatCard);
    });
  })
  .catch((error) => {
    console.error("Une erreur est survenue :", error);
    habitatsContainer.innerHTML = `<p class="text-danger text-center">Impossible de charger les habitats. Veuillez réessayer plus tard.</p>`;
  });

// FIN Présentation Habitats

// DEBUT Carousel Services

const servicesContainer = document.getElementById("services");

fetch("https://arcadia2024.alwaysdata.net/arcadia/api/service/showAll")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    data.forEach((service, index) => {
      const serviceItem = document.createElement("div");
      serviceItem.classList.add("carousel-item");

      if (index === 0) {
        serviceItem.classList.add("active");
      }

      serviceItem.innerHTML = `
        <img src="${service.imageName}" class="d-block w-100" alt="${
        service.nom
      }">
        <div class="carousel-caption position-absolute bottom-0 start-0 w-100 d-flex justify-content-between align-items-center p-4">
            <h3 class="text-titre ms-3">${service.nom}</h3>
            <a href="#" class="btn btn-secondary me-3">En savoir plus</a>
        </div>
      `;

      servicesContainer.appendChild(serviceItem);
    });
  })
  .catch((error) => {
    console.error("Une erreur est survenue :", error);
    servicesContainer.innerHTML = `<p class="text-danger text-center">Impossible de charger les services. Veuillez réessayer plus tard.</p>`;
  });

// FIN Carousel Services

// DEBUT Présentation Animaux

const animauxContainer = document.getElementById("animaux");

fetch("https://arcadia2024.alwaysdata.net/arcadia/api/animal/showAnimalsHome")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    data.forEach((item) => {
      const animal = item.animal;
      const animalCard = document.createElement("div");
      animalCard.className = "col-12 col-md-4 mb-3";

      animalCard.innerHTML = `
        <div class="card position-relative">
          <img src="${animal.imageSlug}" class="img-fluid animal-card" alt="${
        animal.prenom
      }">
          <div class="w-100 h-100 card-body position-absolute d-flex flex-column justify-content-between align-items-center">
            <h3 class="card-title text-color">${toUpperCase(animal.prenom)}</h3>
            <a href="/arcadia/api/animal/show/${
              animal.id
            }" class="btn btn-secondary">Découvrir</a>
          </div>
        </div>
      `;

      animauxContainer.appendChild(animalCard);
    });
  })
  .catch((error) => {
    console.error("Une erreur est survenue :", error);
    animauxContainer.innerHTML = `<p class="text-danger text-center">Impossible de charger les animaux. Veuillez réessayer plus tard.</p>`;
  });

// FIN Présentation Animaux
