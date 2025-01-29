async function loadHabitatDetails() {
  const params = new URLSearchParams(window.location.search);
  const habitatId = params.get("id");

  if (!habitatId) {
    console.error("Aucun ID d'habitat trouvé dans l'URL");
    return;
  }

  try {
    const response = await fetch(
      `https://arcadia2024.alwaysdata.net/arcadia/api/habitat/show/${habitatId}`
    );

    if (!response.ok) {
      throw new Error(`Erreur API : ${response.status}`);
    }

    const habitat = await response.json();

    // Affichage du hero
    displayHabitatHero(habitat);

    // Chargement des animaux liés à cet habitat
    loadAnimalsByHabitat(habitatId);
  } catch (error) {
    console.error("Erreur lors du chargement de l'habitat :", error);
  }
}

function displayHabitatHero(habitat) {
  const heroContainer = document.getElementById("hero-container");

  heroContainer.innerHTML = `
        <div class="row hero-scene text-center text-color w-100 m-0">
          <div class="hero-scene-content">
            <img class="img-hero img-fluid" src="${habitat.imageName}" alt="${habitat.nom}">
            <h1 class="hero-content">${habitat.nom}</h1>
          </div>
        </div>
    `;
}

async function loadAnimalsByHabitat(habitatId) {
  const animalsContainer = document.getElementById("animals-container");

  try {
    const response = await fetch(
      `https://arcadia2024.alwaysdata.net/arcadia/api/animal/showAllAnimals/${habitatId}`
    );

    if (!response.ok) {
      throw new Error(`Erreur API : ${response.status}`);
    }

    const animals = await response.json();

    if (animals.length === 0) {
      animalsContainer.innerHTML = `<p class="text-center">Aucun animal trouvé.</p>`;
      return;
    }

    let animalsHTML = "";
    animals.forEach((animal) => {
      animalsHTML += `
    <div class="col-12 col-md-4 mb-3">
        <div class="image-card text-white">
            <div class="image-container position-relative">
                <img src="${animal.imageSlug}" alt="${animal.prenom}" class="rounded w-100">
                <div class="action-image-buttons" data-show="connected">
                    <button type="button" class="btn btn-outline-light" data-bs-toggle="modal"
                            data-bs-target="#EditionPhotoModal"><i class="bi bi-pencil-square"></i></button>
                    <button type="button" class="btn btn-outline-light" data-bs-toggle="modal"
                            data-bs-target="#DeletePhotoModal"><i class="bi bi-trash"></i></button>
                    <button type="button" class="btn btn-outline-light" data-bs-toggle="modal"
                            data-bs-target="#RapportVeterinaireModal"><i class="bi bi-calendar2-heart"></i></button>
                    <button type="button" class="btn btn-outline-light" data-bs-toggle="modal"
                            data-bs-target="#RepasModal"><i class="bi bi-cup-hot"></i></button>
                </div>
                <button type="button" class="btn btn-secondary position-absolute bottom-0 start-50 translate-middle-x mb-2" 
                        onclick="fetchAnimalDetails(${animal.id})">
                    Voir les détails
                </button>
            </div>
            <p class="titre-image">${animal.prenom}</p>
        </div>
     </div>
    `;
    });

    animalsContainer.innerHTML = animalsHTML;
    showAndHideElementsForRoles();
  } catch (error) {
    console.error("Erreur lors du chargement des animaux :", error);
    animalsContainer.innerHTML = `<p class="text-center text-danger">Erreur lors du chargement des animaux.</p>`;
  }
}

// Fonction pour récupérer les détails de l'animal et l'afficher dans la modale
async function fetchAnimalDetails(animalId) {
  try {
    const response = await fetch(apiUrl + `animal/show/${animalId}`);

    if (!response.ok) {
      throw new Error(
        `Erreur de récupération des détails de l'animal : ${response.status}`
      );
    }

    const animal = await response.json();

    // Affichage des détails de l'animal dans la modale
    document.getElementById("animalPrenom").innerText = animal.prenom;
    document.getElementById("animalRace").innerText = animal.race;
    document.getElementById("animalNourritureDernierRepas").innerText =
      animal.nourritureDernierRepas;
    document.getElementById("animalQuantiteDernierRepas").innerText =
      animal.quantiteDernierRepas;
    document.getElementById("animalDateDernierRepas").innerText =
      animal.dateDernierRepas;

    const modal = new bootstrap.Modal(
      document.getElementById("AnimalDetailsModal")
    );
    modal.show();
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails de l'animal :",
      error
    );
  }
}

loadHabitatDetails();
